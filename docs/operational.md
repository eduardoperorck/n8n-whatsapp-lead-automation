> [🇧🇷 Português](operational.pt.md) | 🇺🇸 English

# Operational Guide
## Generating and delivering the bot for each client

---

## One-time setup

### 1. Create an n8n Cloud account

Go to [n8n.io](https://n8n.io) and create a free account. This is where the Configurador will run.

### 2. Create the spreadsheet template

Create a Google Sheets spreadsheet that each client will duplicate.

1. Create a new spreadsheet in Google Sheets
2. In the first row, add the following headers (one per column):
   `Timestamp` | `Empresa` | `WhatsApp` | `Nome` | `Telefone Contato` | `Servico Interesse` | `Orcamento` | `Prazo` | `Status`
3. Rename the tab to `Leads` (capital L)
4. Share with "Anyone with the link can view" — **File → Share**
5. Save the link

This link is sent to all clients. They go to **File → Make a copy** and the spreadsheet lands in their Google account, already formatted.

### 3. Import the Configurador

The Configurador is the workflow that generates personalized bots.

1. In n8n, go to **Workflows → Import from file**
2. Select: `workflows/setup/configurador.json`
3. Activate the workflow (green toggle)
4. Copy the **form URL** shown in the first node

This URL is permanent. Use it to generate all client workflows.

---

## For each new client

### 1. Collect information

| Field | Example | Where to find |
|---|---|---|
| Company name | Total Health Clinic | — |
| Welcome message | Hello! Welcome to Total Health Clinic... | — |
| Services (comma-separated) | Consultation,Pediatrics,Orthopedics | — |
| Phone Number ID | 1234567890123456 | Meta → app → WhatsApp → API Setup |
| Access Token | EAAG... | Same page as Phone Number ID |
| Notification URL | https://hooks.slack.com/... | Optional |

> The Phone Number ID and Access Token are embedded directly in the generated JSON — the client does not need to configure any environment variables.

### 2. Generate the workflow

1. Open the Configurador URL
2. Fill in the fields and click **"Submit"**
3. In the n8n execution panel, open the latest execution
4. Click on the **"Resultado"** node
5. Copy the content of the `5_workflowJson` field
6. Save as: `bot_company-name.json`

The **"Resultado"** node outputs:
- `2_arquivo` — suggested filename
- `3_verifyToken_para_webhook_Meta` — the code the client uses in the Meta panel
- `5_workflowJson` — full bot JSON

### 3. Deliver to the client

Send via your sales channel:
- The `bot_company-name.json` file
- The Verify Token (field `3_verifyToken_para_webhook_Meta`)
- The spreadsheet template link
- The `contents/guia-cliente.en.md` file (or PT version for Brazilian clients)

---

## What the client handles independently

- Importing the JSON into n8n
- Connecting Google Sheets via "Sign in with Google"
- Activating the workflow and configuring the webhook in the Meta panel
- Reconnecting the Google account when it expires (~6 months)
- Viewing leads in the spreadsheet

## What requires your support

- **Renewing the Access Token** if the client uses a temporary token (lasts 24h — recommend permanent token from the start)
- **Editing questions**: "Lead Qualification" node in the client's n8n
- **Changing messages or services**: "Send Welcome Message" and "Lead Qualification" nodes

---

## Free plan limits

| Service | Free limit |
|---|---|
| n8n Cloud | 2,500 executions/month |
| WhatsApp Business API | 1,000 conversations/month |
| Google Sheets | No relevant limit |

---

## First-level support

**"The bot didn't respond"**
→ Is the workflow active (green toggle)? Was the webhook configured and verified in the Meta panel?

**"Data doesn't appear in the spreadsheet"**
→ Did the user complete all 5 questions? Is the Google Sheets credential connected?

**"Bot stopped responding"**
→ Expected behavior — session expires after 30 min of inactivity. A new message restarts from scratch.

**"WhatsApp token expired"**
→ Temporary token lasts 24h. Set up a permanent token via Meta Business → System Users.
