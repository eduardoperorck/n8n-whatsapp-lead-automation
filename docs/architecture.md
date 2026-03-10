> [🇧🇷 Português](architecture.pt.md) | 🇺🇸 English

# Architecture — n8n WhatsApp Lead Automation

## Overview

The system is composed of three layers:

```
┌──────────────────────────────────────────────┐
│                 INPUT LAYER                  │
│  WhatsApp Business API → n8n Webhook         │
└──────────────────────────┬───────────────────┘
                           ↓
┌──────────────────────────────────────────────┐
│              PROCESSING LAYER                │
│  Message Parser → Intent Router              │
│  Lead Qualification State Machine            │
└──────────────────────────┬───────────────────┘
                           ↓
┌──────────────────────────────────────────────┐
│                OUTPUT LAYER                  │
│  Google Sheets Storage + Agent Notification  │
└──────────────────────────────────────────────┘
```

---

## Node Pipeline

### 1. WhatsApp Webhook (Trigger)
**Node:** `n8n-nodes-base.webhook`

- Exposes `POST /webhook/whatsapp` endpoint
- Exposes `GET /webhook/whatsapp` for Meta webhook verification
- Validates `hub.verify_token` on GET
- Returns `hub.challenge` to confirm the webhook

**Resilience:**
- Responds `200 OK` immediately before processing (prevents WhatsApp retry)
- Timeout set to 30s

---

### 2. Method Router (IF)
**Node:** `n8n-nodes-base.if`

- `GET` → webhook verification flow
- `POST` → main processing flow

---

### 3. Message Parser (Code)
**Node:** `n8n-nodes-base.code`

Extracts and validates the incoming message.

**Validations:**
- Max payload size: 64KB
- Message type: only `text` is processed
- Required structure: `entry[0].changes[0].value.messages[0]`

**Fallbacks:**
| Situation | Response |
|---|---|
| Payload > 64KB | Silent log + discard |
| Type `audio` | "Sorry, I only accept text messages" |
| Type `image` | "Sorry, I only accept text messages" |
| Malformed JSON | Silent log + `200 OK` (prevents retry loop) |
| Empty text | Silently ignored |

---

### 4. Intent Router (Switch)
**Node:** `n8n-nodes-base.switch`

Routes based on the user's conversation state:

| Intent | Condition | Destination |
|---|---|---|
| `greeting` | First message / reset | Welcome message |
| `qualifying` | Qualification in progress | Continues Q&A |
| `complete` | All questions answered | Storage + Notification |
| `unknown` | Fallback | Help message |

Conversation state is tracked using the phone number (`from`) as key.

---

### 5. Lead Qualification (Code)
**Node:** `n8n-nodes-base.code`

State machine for lead qualification. Configurable questions:

1. Full name
2. Best phone number for contact
3. Service of interest (`{{services}}`)
4. Approximate budget
5. Start timeline

**Resilience:**
- Unexpected response → repeats the question with guidance
- Session timeout: 30 minutes of inactivity resets the state

---

### 6. Send WhatsApp Message (HTTP Request)
**Node:** `n8n-nodes-base.httpRequest`

Sends a text message via WhatsApp Business API.

**Resilience:**
- Auto-retry: 3 attempts with exponential backoff (1s, 2s, 4s)
- Rate limit: respects the 80 msg/s API limit
- Timeout: 10s per request
- HTTP 429 (rate limit): waits for `Retry-After` header

---

### 7. Lead Storage (Google Sheets)
**Node:** `n8n-nodes-base.googleSheets`

Appends the qualified lead to the spreadsheet.

**Columns:**
| Column | Description |
|---|---|
| Timestamp | Date/time of submission |
| Empresa | `{{company_name}}` |
| WhatsApp | WhatsApp number |
| Nome | Provided name |
| Telefone Contato | Alternative phone |
| Servico Interesse | Selected service |
| Orcamento | Provided budget |
| Prazo | Provided timeline |
| Status | `novo` |

**Resilience:**
- Retry: 3 attempts with random jitter (prevents thundering herd)
- Google quota: 100 req/100s → local queue if needed
- Unsaved data: error log + agent notification with raw data

---

### 8. Agent Notification (HTTP Request)
**Node:** `n8n-nodes-base.httpRequest`

Fires a notification webhook (Slack, custom endpoint, etc.).

**Payload:**
```json
{
  "company": "{{company_name}}",
  "lead": {
    "phone": "+5511999999999",
    "name": "João Silva",
    "service": "Consulta",
    "budget": "R$ 500",
    "timeline": "Next week"
  },
  "timestamp": "2026-03-09T10:00:00Z"
}
```

**Resilience:**
- Retry: 2 attempts
- Notification failure: does NOT block the flow — lead is already saved in Sheets

---

## Full Data Flow

```
[WhatsApp User]
    │ POST /webhook/whatsapp
    ↓
[Webhook Node]
    │ extracts raw body
    ↓
[Method Router]
    ├─ GET → [Verify Challenge] → [Respond 200 + challenge]
    └─ POST ↓
[Message Parser]
    ├─ invalid/unsupported → [Send Fallback Msg] → [Respond 200]
    └─ valid text ↓
[Intent Router]
    ├─ greeting  → [Send Welcome Message] → [Respond 200]
    ├─ qualifying → [Lead Qualification]
    │                    ↓
    │              [Send Next Question] → [Respond 200]
    └─ complete  → [Lead Qualification (final)]
                        ↓
                   [Google Sheets Append]
                        ↓
                   [Agent Notification]
                        ↓
                   [Respond 200]
```

---

## Security Considerations

- **Verify Token:** validated on the Meta webhook initial handshake
- **No hardcoded secrets:** all credentials via n8n Credentials or env vars
- **Input sanitization:** Message Parser rejects malformed payloads before any processing
- **Always 200 response:** WhatsApp retries any status != 200, creating loops — we always return 200 even on internal errors
