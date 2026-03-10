> [🇧🇷 Português](faq.md) | 🇺🇸 English

# Frequently Asked Questions
## WhatsApp Lead Automation

---

### The bot didn't respond when I sent "Hi". What should I do?

Check in this order:

1. Is the bot **toggle green (Active)** in n8n?
2. Was the Webhook URL pasted correctly in the "Callback URL" field in the Meta panel?
3. Did **"Verified"** appear after clicking "Verify and Save"?
4. Is the **"messages"** field subscribed in the "Webhook fields" section?
5. Is the WhatsApp Access Token valid? (Temporary tokens last only 24 hours. If using a temporary token, see the question about tokens below.)

---

### The WhatsApp access token expired. What should I do?

The temporary token provided by Meta expires in 24 hours. For production use, you need a **permanent token**:

1. In the Meta panel, go to **Business Settings → System Users**
2. Create a new System User of type **"Admin"**
3. Click **"Add Assets"** and add your WhatsApp app
4. Click **"Generate New Token"**
5. Select the app and check the permissions: `whatsapp_business_messaging` and `whatsapp_business_management`
6. Copy the generated token
7. Contact whoever set up the bot to update the JSON with the new token

This token does not expire automatically.

---

### Google Sheets isn't receiving data. What should I check?

1. Did you complete **all** of the bot's questions? (data is only saved when the conversation ends)
2. Is the spreadsheet tab named exactly `Leads` (capital L)?
3. In n8n, does the purple "Lead Storage — Google Sheets" block show no red or orange alerts?
4. Is the Google account connected? (double-click the purple block and check that the credential is active)

---

### The bot responds but stops mid-conversation.

The session expires after 30 minutes without a response from the user. This is expected behavior — it prevents stuck conversations. When the user sends another message, the bot restarts from scratch.

---

### The lead didn't appear in the spreadsheet even after the full conversation.

The lead is only saved when the user answers **all 5 questions** and reaches the end of the flow. If they stopped midway, the data is not saved. Wait for the session to expire (30 min) and ask them to test again, answering all the way through.

---

### How can a user restart the conversation from the beginning?

The user can type any greeting: `hi`, `hello`, `menu`, `start`. The bot will restart the conversation.

---

### Does the bot receive photos or audio?

No — the bot informs the user that it only processes text messages. To change this behavior, the technical contact needs to edit the "Message Parser" block directly in n8n.

---

### Can I change the questions the bot asks?

Yes. In n8n, open the workflow and double-click the **"Lead Qualification"** block. Find the `QUESTIONS` array in the code and edit the questions. Remember to add the corresponding column in your Google Sheets spreadsheet.

---

### Can I use a personal phone number with the WhatsApp Business API?

No. The WhatsApp Business API requires a dedicated number that is **not** already in use on personal or regular WhatsApp. You can use a new SIM card number or a VoIP number.

---

### Does the system run 24 hours a day?

Yes — using n8n Cloud. The bot runs even when your computer is off.

---

### How many messages can the system handle?

- **n8n Cloud (free):** 2,500 executions per month
- **WhatsApp Business API:** 1,000 conversations per month free; paid per conversation after that
- **Google Sheets:** no relevant limit for normal use

For higher volumes, upgrade your n8n or Meta plan.

---

### Can I use it for multiple businesses?

Yes. Each business has its own `.json` file generated with its specific settings. You can import all of them into the same n8n account — each as a separate workflow.

---

### Still having issues?

Contact whoever set up your bot and provide:
- Which step had the problem
- What appeared on screen (a screenshot helps a lot)
- Any error message that was shown
