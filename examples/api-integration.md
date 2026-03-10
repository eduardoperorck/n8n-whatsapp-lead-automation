> [🇧🇷 Português](api-integration.pt.md) | 🇺🇸 English

# API Integration Examples

Practical examples of how to interact with the WhatsApp Business API and the n8n webhook.

---

## 1. Sending a WhatsApp message (outbound)

The bot uses this endpoint to reply to users. You can also call it manually to send proactive messages.

```bash
curl -X POST "https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511999887766",
    "type": "text",
    "text": { "body": "Hello! This is a test message." }
  }'
```

**Response (success):**
```json
{
  "messaging_product": "whatsapp",
  "contacts": [{ "input": "5511999887766", "wa_id": "5511999887766" }],
  "messages": [{ "id": "wamid.XXXXXXXXXXXXXX" }]
}
```

---

## 2. Triggering the follow-up workflow

Once the follow-up workflow (`workflows/examples/follow_up_bot.json`) is imported and active in n8n:

```bash
curl -X POST "https://your-n8n.app.n8n.cloud/webhook/whatsapp-followup" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999887766",
    "message": "Hi! Following up on your interest in our services. Are you still looking?",
    "company": "Total Health Clinic"
  }'
```

**Response:**
```json
{
  "success": true,
  "phone": "5511999887766",
  "sentAt": "2026-03-10T14:00:00.000Z"
}
```

---

## 3. Verifying the webhook (Meta handshake)

When you configure the webhook URL in the Meta panel, Meta sends a GET request to verify it. The n8n webhook node handles this automatically, but here is what the exchange looks like:

**Meta sends:**
```
GET /webhook/whatsapp?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=1234567890
```

**n8n responds:**
```
200 OK
Body: 1234567890
```

The verify token must match what you configured in the Meta panel. The workflow returns `hub.challenge` to confirm ownership.

---

## 4. Generating a workflow via CLI

If you prefer the command-line over the Configurador form:

```bash
node generator/generateWorkflow.js \
  --company "Total Health Clinic" \
  --welcome "Hello! Welcome to Total Health Clinic. We're here to take care of you! 💚" \
  --services "General Consultation,Pediatrics,Gynecology,Orthopedics"
```

The output file is saved to `workflows/production/bot_total-health-clinic-{hash}.json`.

**Validate the generated file:**
```bash
node -e "
const { validateWorkflowFile } = require('./generator/workflowValidator');
const result = validateWorkflowFile('./workflows/production/bot_total-health-clinic-{hash}.json');
console.log(result.valid ? 'Valid ✓' : 'Errors:', result.errors);
"
```

---

## 5. Running the tests

```bash
# All tests
node --test tests/

# Individual test files
node tests/generator.test.js
node tests/validator.test.js
```

---

## Environment variables reference

| Variable | Description | Example |
|---|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID from Meta | `1234567890123456` |
| `WHATSAPP_ACCESS_TOKEN` | Bearer token for API calls | `EAAG...` |
| `WHATSAPP_VERIFY_TOKEN` | Token for webhook verification | `my-company-abc123` |
| `N8N_API_URL` | Your n8n instance base URL | `https://my-name.app.n8n.cloud` |
| `N8N_API_KEY` | n8n API key for programmatic access | `n8n_api_...` |

> In the generated client workflows, `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_ACCESS_TOKEN` are embedded directly as static values. These env vars are only needed when running the CLI generator or scripts.
