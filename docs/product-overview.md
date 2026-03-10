> [🇧🇷 Português](product-overview.pt.md) | 🇺🇸 English

# Product Overview — n8n WhatsApp Lead Automation

## The Problem

Small businesses lose leads every day because they can't respond to WhatsApp messages quickly outside business hours, or because their qualification process is manual and inconsistent.

## The Solution

A plug-and-play WhatsApp automation system that:

1. **Automatically replies** to any incoming message, 24/7
2. **Qualifies the lead** through structured questions (name, interest, budget, timeline)
3. **Stores the data** in an organized Google Sheets spreadsheet
4. **Notifies the owner** when the lead is fully qualified and ready for follow-up

## Target Audience

| Vertical | Example |
|---|---|
| Clinics and practices | Appointment scheduling, initial triage |
| Restaurants | Reservations, delivery orders |
| Service providers | Quotes, visit scheduling |
| Schools and courses | Enrollment, class information |

## Product Model

The system is sold as a **low-ticket digital product**:

1. Operator collects client information (company name, services, WhatsApp credentials)
2. Uses the **Configurador** workflow (`workflows/setup/configurador.json`) to generate a personalized JSON
3. Delivers to client: `.json` file, Verify Token, and installation guide
4. Client imports the JSON into n8n, connects Google Sheets via OAuth2, and activates

The client needs no terminal, Node.js, environment variables, or Google Cloud Console.

## Pricing Model

Sold as a one-time low-ticket digital product. Suggested positioning:
- **Price point:** entry-level (accessible to small businesses)
- **Delivery:** instant — client receives the bundle immediately after payment
- **Upsell:** customization, extra verticals, token renewal support

Actual pricing is set externally to this repository.

## Key Features

- **Zero code** for the end user
- **Embedded credentials**: Phone Number ID and Access Token are already included in the generated JSON
- **Google OAuth2**: spreadsheet connected via "Sign in with Google" — no Service Account needed
- **Customizable** per company via the Configurador form
- **Resilient**: fallbacks for invalid messages, audio, and images
- **Scalable**: same template serves multiple clients

## Usage Flow

```
Operator fills out the Configurador form (n8n)
        ↓
Personalized workflow JSON is generated with embedded credentials
        ↓
JSON + Verify Token + guide are delivered to the client
        ↓
Client imports the JSON into n8n
        ↓
Client connects Google Sheets (Sign in with Google)
        ↓
Client activates the workflow and pastes the webhook URL in Meta panel
        ↓
System in production — leads being captured
```
