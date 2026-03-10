> [🇧🇷 Português](guia-cliente.md) | 🇺🇸 English

# Your WhatsApp bot in 20 minutes

Whoever set up your bot sent you (via email, WhatsApp, or download link) **three items**:
- **`.json` file** — the bot already configured for your business
- **Verify Token** — a text code (looks something like `my-company-ab12cd`)
- **Spreadsheet link** — a Google Sheets link you'll duplicate to your account

> **Can't find one of these items?** Check your email, WhatsApp, or wherever you purchased the product. If you still can't find it, contact whoever sold you the bot before continuing.

This guide will take you from zero to a working bot in about 20 minutes. No coding, terminal, or technical knowledge required.

---

## Before you start — what you'll need

- [ ] The `.json` file you received
- [ ] The Verify Token you received
- [ ] The spreadsheet link you received
- [ ] A free **n8n** account (see how to create one below if you don't have one)
- [ ] A **Google** account (Gmail works)

---

## Creating your n8n account (skip if you already have one)

1. Go to **n8n.io** in your browser
2. Click **"Get started for free"**
3. Enter your email and create a password
4. Confirm your email if prompted
5. Once logged in, you'll see the main screen with a left sidebar — that's n8n

---

## Step 1 — Import the bot into n8n

**Estimated time: 2 minutes**

1. In the left sidebar, click **"Workflows"**
2. Click the **"Add workflow"** button
3. In the menu that appears, click **"Import from file"**
4. Select the `.json` file you received
5. The bot appears on screen with your company name and all fields already filled in

> **Success looks like:** a diagram with several colored blocks connected by lines, with your company name in the top left corner.

---

## Step 2 — Set up and connect your Google Sheets

**Estimated time: 3 minutes**

### 2a — Duplicate the spreadsheet to your account

1. Open the **spreadsheet link** you received
2. In the top menu, click **File → Make a copy**
3. Choose a name (the default is fine) and click **"Ok"**
4. The spreadsheet opens in your Google account, already set up with all headers and the `Leads` tab

> **Success looks like:** the spreadsheet open in your Google account with a tab called `Leads` at the bottom.

### 2b — Connect the spreadsheet to the bot in n8n

1. Go back to n8n
2. In the diagram, find the **purple block** called "Lead Storage — Google Sheets" and double-click it
3. A window will open. Click **"Credential for Google Sheets API"**
4. Click **"Create new credential"**
5. Click **"Sign in with Google"**
6. Choose the same Google account where you copied the spreadsheet
7. Click **"Allow"** to authorize
8. You'll return to n8n. In the **"Document"** field, click the arrow and **choose the spreadsheet** you just copied
9. In the **"Sheet"** field, select **Leads**
10. Click **"Save"**
11. Close the window by clicking X

> **Success looks like:** the purple block shows no red or orange warnings, and the Document and Sheet fields are filled in.

---

## Step 3 — Activate the bot

**Estimated time: 1 minute**

1. In the top right corner, find the **activate toggle** (a small switch next to "Inactive")
2. Click it — it will turn **green** showing "Active"
3. Double-click the **orange block** called "WhatsApp Webhook" (first block in the diagram)
4. A window will show the **Webhook URL** — a long address starting with `https://`
5. Click the copy button next to the URL or select all and copy (Ctrl+C)
6. **Keep this address** — you'll need it in the next step

> **Success looks like:** the toggle is green showing "Active" and you've copied the Webhook URL.

---

## Step 4 — Configure the webhook in the Meta panel

**Estimated time: 5 minutes**

This is the step that connects WhatsApp to your bot. You'll do this in the Meta developer panel (the same company behind WhatsApp and Facebook).

1. Go to **developers.facebook.com** and log in with your business Facebook account
2. In the top menu, click **"My Apps"** and open your WhatsApp app
3. In the left sidebar, click **WhatsApp** → **Configuration**
4. Scroll down to the **"Webhook"** section
5. Click the **"Edit"** button
6. In the **"Callback URL"** field, paste the Webhook URL you copied in the previous step
7. In the **"Verify token"** field, paste the **Verify Token** you received with this guide
8. Click **"Verify and Save"**
9. Did **"Verified"** appear next to the webhook? Perfect.
10. Scroll down a bit more to **"Webhook fields"**
11. Find the **"messages"** row and click **"Subscribe"**

> **Success looks like:** "Verified" appears in the webhook section and "messages" shows as subscribed (green icon).

---

## Final test

Send **"Hi"** to the WhatsApp number connected to your Meta app.

Within a few seconds, the bot should reply with your company's welcome message and start asking questions. Once the conversation ends, open your spreadsheet and check that the data appeared.

> **Bot working =** message received + data in the spreadsheet at the end of the conversation.

---

## Something went wrong?

**Bot didn't respond at all:**
- Is the toggle green (Active) in n8n?
- Was the Webhook URL pasted correctly in the "Callback URL" field in the Meta panel?
- Did "Verified" appear after clicking "Verify and Save"?
- Is "messages" subscribed?

**Responds but data doesn't appear in the spreadsheet:**
- Did you complete **all** of the bot's questions? (data is only saved when the conversation reaches the end)
- Is the spreadsheet tab named exactly `Leads` with a capital L?
- Does the purple block in n8n show no red or orange alerts?

**Bot took a while to respond then stopped:**
- Normal — the conversation expires after 30 minutes without a reply. Send another message to restart from scratch.

**Still having issues?** Contact whoever set up your bot and let them know which step had a problem.
