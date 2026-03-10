> [🇧🇷 Português](templates.pt.md) | 🇺🇸 English

# Message Templates — WhatsApp Lead Automation

This document contains ready-to-use message templates for the WhatsApp bot, organized by situation and business type. Use them as a foundation and adapt the tone, details, and services to fit your specific business.

---

## 1. First Contact Messages (Welcome)

These are the messages the bot sends when a new customer initiates contact. The goal is to make a strong first impression, set the expectation that this is an automated assistant, and begin the qualification process in a natural, conversational way.

---

### 1.1 Healthcare Clinic

**General clinic:**
```
Hi there! 👋 Welcome to *Total Health Clinic*.

I'm the clinic's virtual assistant, here to help you schedule your appointment quickly — any time of day.

To find the best time slot for you, I'll need a few details. Could you answer a couple of quick questions?

Let's start: what's your name? 😊
```

**Dental clinic:**
```
Hi! Welcome to *BrightSmile Dental* 🦷

I'm the clinic's virtual assistant. I can help you book an appointment or answer questions — all right here on WhatsApp, no waiting on hold.

To get started, could you tell me your name?
```

**Aesthetics / beauty clinic:**
```
Hello! ✨ You've reached the *Glow Aesthetic Studio* booking assistant.

I'm here to help you schedule a procedure or answer any questions about our services.

What's your name so I can get your booking started?
```

---

### 1.2 Restaurant

**Traditional restaurant:**
```
Hello! 🍽️ Welcome to *The Grand Table Restaurant*.

Our virtual assistant is here to help you with reservations and menu information — quickly and without the wait.

To get started, what's your name?
```

**Pizza / delivery:**
```
Hi! 🍕 You've reached *Napoli Pizza*.

I can help you with table reservations or delivery information. I just need a few quick details.

What's your name to get started?
```

**Event venue / catering:**
```
Hello! 🎉 Welcome to *Celebrate Events*.

Our assistant is available 24/7 to help you with event inquiries, reservations, and package information.

Could you share your name so I can personalize your experience?
```

---

### 1.3 Service Provider

**General services (plumber, electrician, etc.):**
```
Hi there! 🔧 You've reached *QuickFix Services*.

Need a job done fast and without the hassle? I'm here to log your request and make sure one of our technicians gets back to you as soon as possible.

What's your name?
```

**Personal trainer / gym:**
```
Hey! 💪 Welcome to *FitZone Gym*.

Looking to start your fitness journey, or already a member wanting to know more about our plans? I'm here to help.

What's your name?
```

**Legal / consulting:**
```
Hello. Welcome to *Morrison & Associates*.

I'm the firm's virtual assistant. I can log your contact request and ensure one of our consultants gets back to you promptly.

To begin, what is your name?
```

---

### 1.4 School / Training Center

**Language school:**
```
Hi! 🌎 Welcome to *Speak Up Language School*!

I'm the school's virtual assistant. I can help you with course information, class schedules, and enrollment — all right here.

What's your name to get started?
```

**K-12 school / tutoring:**
```
Hello! 📚 Welcome to *Horizon Academy*.

I'm here to help you with enrollment information, grade levels, and tutoring programs.

What's your name?
```

**Vocational / professional training:**
```
Hi! 🎓 You've reached *ProSkills Training Center*.

Ready to take the next step in your career? I'm here to walk you through our courses and enrollment options.

Could you start by sharing your name?
```

---

## 2. Qualification Questions

These questions are sent by the bot in sequence after the welcome message. Each question should be sent individually — one at a time — and the bot waits for the customer's response before continuing.

---

### 2.1 Healthcare Clinic

**Question 2 — Specialty / service needed:**
```
Thanks, {{name}}! 😊

Which specialty or type of consultation are you looking for?

Examples: general practitioner, cardiology, dermatology, orthopedics, psychology, physiotherapy...
```

**Question 3 — Urgency / availability:**
```
Got it! Is this an urgent matter or are you scheduling for the coming days or weeks?

If you have a preferred date or time period, feel free to mention it.
```

**Question 4 — Contact preference:**
```
Great. How would you prefer us to get back to you?

1️⃣ WhatsApp message
2️⃣ Phone call
3️⃣ Email

Just type the number or the word — whatever's easier.
```

**Question 5 — Additional notes:**
```
Is there anything else you'd like us to know? For example, whether you have health insurance, a preference for a specific doctor, or any other relevant detail.

If not, just reply *"no"* and we're all set. 😊
```

---

### 2.2 Restaurant

**Question 2 — Type of request:**
```
Thanks, {{name}}!

What can I help you with today?

1️⃣ Make a table reservation
2️⃣ Delivery information
3️⃣ Menu or pricing questions
4️⃣ Something else

Type the number or describe what you need.
```

**Question 3 — Date and party size (reservation):**
```
Great! What date and time would you like to reserve a table?

And how many people will be in your party?
```

**Question 4 — Dietary restrictions:**
```
Does anyone in your group have dietary restrictions or special requirements we should know about? (vegetarian, gluten-free, allergies, etc.)

If not, just reply *"no"*.
```

**Question 5 — Confirmation contact:**
```
Almost done! What's the best phone number to confirm your reservation?

(This WhatsApp number is fine if you prefer.)
```

---

### 2.3 Service Provider

**Question 2 — Type of service needed:**
```
Thanks, {{name}}!

What kind of service do you need?

Describe it however is easiest — plumbing issue, electrical work, painting, renovation... anything works.
```

**Question 3 — Location and availability:**
```
Understood. Could you share your address or general area so we can plan the visit?

And what day and time works best for you?
```

**Question 4 — Urgency:**
```
Is this service urgent, or can it be scheduled for the next few days?
```

**Question 5 — Additional details:**
```
Any other details that would help us come prepared? For example, the floor or unit number, access instructions, or a description of the issue.

If nothing else to add, just reply *"no"* and we're done. 😊
```

---

### 2.4 School / Training Center

**Question 2 — Course / program of interest:**
```
Thanks, {{name}}! 😊

Which course or program are you interested in?

For example: beginner English, math tutoring, Grade 5 enrollment, IT certification...
```

**Question 3 — Who is enrolling and age group:**
```
Is this enrollment for yourself or for someone else (child, dependent)?

And what is the student's age or grade level?
```

**Question 4 — Preferred schedule:**
```
What schedule works best for classes?

1️⃣ Morning
2️⃣ Afternoon
3️⃣ Evening
4️⃣ Weekends
5️⃣ Online / flexible

Feel free to select more than one.
```

**Question 5 — How they heard about you:**
```
Last question: how did you hear about us?

Instagram, a friend's recommendation, Google, a sign... any answer helps! 😊
```

---

## 3. Follow-Up Messages

These messages are sent **manually** by the business owner or team after receiving the lead notification. The bot does not send these automatically — they are templates for you to copy, personalize, and send through the regular WhatsApp app.

---

### 3.1 Generic follow-up (within 2 hours)

```
Hi {{name}}! 😊 This is {{your_name}} from {{business}}.

I saw that you reached out to us on WhatsApp. I'm following up to move your inquiry forward.

Do you have a couple of minutes to chat now?
```

---

### 3.2 Follow-up for appointment scheduling (clinic / service)

```
Hi {{name}}! Hope you're doing well.

This is {{your_name}} from {{clinic/business}}. I see you're looking for {{service_or_specialty}} and we have availability on {{day_and_time}}.

Does that work for you? If so, I can confirm it right now! 😊
```

---

### 3.3 Follow-up for reservation (restaurant)

```
Hello {{name}}! 🍽️

This is {{your_name}} from {{restaurant}}. I saw your reservation request for {{date}} at {{time}} for {{number_of_people}} people.

We have the table available! Shall I confirm that for you?
```

---

### 3.4 Follow-up for enrollment (school)

```
Hi {{name}}! 📚

This is {{your_name}} from {{school/course}}. I see you're interested in {{course_or_grade_level}}.

We have spots available in the {{schedule}} schedule. Would you like me to send you more details about the program and enrollment process?
```

---

### 3.5 Follow-up for unresponsive leads (24–48 hours later)

```
Hi {{name}}, hope all is well!

I tried to reach you earlier but didn't manage to connect. 😊

If you're still interested in {{service}}, I'm here and happy to help. Just send me a message whenever it's convenient.

— {{your_name}}, {{business}}
```

---

## 4. Conversion Messages (Closing)

Use these templates when confirming a booking, closing a sale, or finalizing any commitment. The goal is to reduce friction and make confirmation as easy as possible for the customer.

---

### 4.1 Appointment confirmation

```
All set, {{name}}! 🎉

Your appointment is confirmed:

📅 Date: {{date}}
🕐 Time: {{time}}
📍 Location: {{address or "online"}}
👤 With: {{professional_name}} (if applicable)

You'll receive a reminder message {{X hours/1 day}} before your appointment.

If you have any questions, just reach out. See you then! 😊
```

---

### 4.2 Reservation confirmation

```
Your reservation is confirmed, {{name}}! 🥂

📅 Date: {{date}}
🕐 Time: {{time}}
👥 Party size: {{number}}
📍 {{restaurant_name}}

We look forward to seeing you! If you need to cancel or make changes, please let us know at least {{X hours}} in advance.

See you on {{date}}! 😊
```

---

### 4.3 Enrollment confirmation

```
Wonderful news, {{name}}! 🎓

Your enrollment in {{course_or_program}} is confirmed!

📅 Classes begin: {{date}}
🕐 Schedule: {{time}}
📍 {{location or "Online access at: link"}}

You'll receive your materials and access details shortly. Don't hesitate to reach out if you have any questions.

Welcome to the {{school}} family! 😊
```

---

### 4.4 Service quote / estimate

```
Hi {{name}},

Based on the information you provided, here's a preliminary estimate for {{service}}:

💰 Estimated cost: {{currency}}{{amount}}
⏱️ Estimated time: {{duration}}
📋 What's included: {{brief_description}}

This is an initial estimate — I can confirm the exact price after a quick on-site assessment.

Would you like to schedule a free, no-obligation visit this week?
```

---

## 5. Customization Instructions

### How to adapt these templates for your business

**1. Replace all {{ }} fields**
All fields in double curly braces (`{{name}}`, `{{business}}`, etc.) are variables you need to replace with real data. Some are filled automatically by the bot (like `{{name}}`, which comes from the customer's first response). Others you fill in manually when sending follow-up messages.

**2. Match the tone to your audience**
- For clinics and legal services: keep a more formal tone, avoid slang
- For restaurants and gyms: a relaxed, friendly tone works well; emojis are welcome
- For schools: use a warm, encouraging tone — especially when the contact is a parent

**3. Customize qualification questions to reflect your actual services**
The qualification questions in the bot can — and should — be updated to reflect the real services you offer. If you are a clinic with three specific specialties, list those three options in question 2 rather than asking an open-ended question.

**4. Emojis: use sparingly and consistently**
One or two emojis per message increase engagement and make the interaction feel more human. More than that starts to look unprofessional. Set a style standard and stick to it across all messages.

**5. Test before going live**
Before activating the bot in production, send messages to the number and go through the entire flow as if you were a customer. Check that responses make sense, the tone is right, and that data arrives correctly in the spreadsheet.

**6. Update templates periodically**
When you add new services, change your address, or update pricing, remember to review the bot messages accordingly. A bot with outdated information creates confusion and erodes trust.

---

*This document is part of the WhatsApp Lead Automation product. For support or customization questions, contact whoever set up your bot.*
