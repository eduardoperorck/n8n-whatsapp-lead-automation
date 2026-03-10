> [🇧🇷 Português](workflow-logic.pt.md) | 🇺🇸 English

# Workflow Logic — n8n WhatsApp Lead Automation

## Conversation State Machine

Each user (identified by the phone number `from`) has a conversation state:

```
IDLE → GREETING_SENT → Q1 → Q2 → Q3 → Q4 → Q5 → COMPLETE
```

| State | Description |
|---|---|
| `IDLE` | No previous interaction or expired session |
| `GREETING_SENT` | Welcome sent, waiting for first response |
| `Q1` | Waiting for name |
| `Q2` | Waiting for contact phone |
| `Q3` | Waiting for service of interest |
| `Q4` | Waiting for budget |
| `Q5` | Waiting for timeline |
| `COMPLETE` | Qualification completed |

## Session Timeout

- Inactivity > 30 minutes → state reset to `IDLE`
- On the next message, the flow starts from scratch

## Qualification Questions

Questions are configured in the **Lead Qualification** node and can be edited directly in n8n without re-deploying:

```
Q1: "What is your full name?"
Q2: "What is the best phone number to reach you? (this one is fine)"
Q3: "Which service are you interested in? Options: {{services}}"
Q4: "What is your approximate budget for this service?"
Q5: "When would you like to get started?"
```

## Intent Routing

The **Intent Router** evaluates the current state + message content:

```javascript
// Routing pseudocode
if (session.state === 'IDLE' || isGreeting(text)) {
  → GREETING flow
} else if (session.state in ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']) {
  → QUALIFYING flow (saves answer, advances state)
} else if (session.state === 'COMPLETE') {
  → COMPLETE flow (storage + notification)
} else {
  → UNKNOWN flow (help message)
}
```

## Greeting Detection

Words that trigger the welcome flow:

```
oi, olá, ola, hello, hi, bom dia, boa tarde, boa noite,
início, inicio, começar, comecar, start, menu
```

## System Messages

### Welcome
```
Hello! {{welcome_message}}

Our services: {{services}}

To get started, please tell me: what is your full name?
```

### Unsupported Message Type
```
Sorry, I can only process text messages at the moment.
Please send your question as text. 😊
```

### Qualification Complete
```
Great, [name]! I've received all your information.
Our team will contact you shortly at [phone].
Talk soon! 👋
```

### Fallback (unknown intent)
```
I didn't understand your message. Type *menu* to see the available options.
```

## Lead Structure in Google Sheets

| Field | Source |
|---|---|
| Timestamp | `new Date().toISOString()` |
| Empresa | `{{company_name}}` (static in template) |
| WhatsApp | `message.from` |
| Nome | Q1 answer |
| Telefone Contato | Q2 answer |
| Servico Interesse | Q3 answer |
| Orcamento | Q4 answer |
| Prazo | Q5 answer |
| Status | `"novo"` (default) |

## Agent Notification Payload

```json
{
  "event": "new_qualified_lead",
  "company": "{{company_name}}",
  "timestamp": "ISO 8601",
  "lead": {
    "whatsapp": "+5511999999999",
    "name": "João Silva",
    "contact_phone": "+5511888888888",
    "service_interest": "General Consultation",
    "budget": "R$ 300 to R$ 500",
    "timeline": "This week"
  }
}
```
