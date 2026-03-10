# Seu bot de WhatsApp em 30 minutos

Você recebeu o arquivo `.json` do seu bot personalizado. Agora é só instalar — sem programação, sem terminal.

---

## O que você vai precisar

- [ ] O arquivo `.json` que você recebeu (está na pasta ou e-mail)
- [ ] Uma conta no **n8n Cloud** — crie grátis em [n8n.io](https://n8n.io) se ainda não tiver
- [ ] Acesso ao **painel Meta** (developers.facebook.com) por 5 minutos
- [ ] Uma planilha no **Google Sheets** criada com uma aba chamada `Leads`

---

## Passo 1 — Importar o bot no n8n (2 minutos)

1. Acesse seu **n8n** e faça login
2. No menu lateral, clique em **"Workflows"**
3. Clique em **"Add workflow"** (botão no canto superior direito)
4. Clique em **"Import from file"**
5. Selecione o arquivo `.json` que você recebeu
6. O workflow já aparece com o nome da sua empresa, com todos os nodes prontos

---

## Passo 2 — Conectar o Google Sheets (1 minuto)

1. No workflow aberto, clique duas vezes no node **"Lead Storage — Google Sheets"** (roxo)
2. Clique no campo **"Credential for Google Sheets API"**
3. Clique em **"Create new credential"**
4. Clique em **"Sign in with Google"** e autorize com a sua conta Google
5. Após autorizar, clique no campo **"Document"** e selecione sua planilha na lista
6. No campo **"Sheet"**, selecione a aba **Leads**
7. Clique em **"Save"**

> Sua planilha deve ter os cabeçalhos na primeira linha:
> `Timestamp | Empresa | WhatsApp | Nome | Telefone Contato | Servico Interesse | Orcamento | Prazo | Status`

---

## Passo 3 — Conectar o WhatsApp (5 minutos)

Você vai precisar de 2 informações do painel Meta. Abra uma nova aba e acesse:
**developers.facebook.com → Seu app → WhatsApp → API Setup**

**a) Copie o "Phone Number ID"**
É um número longo como `1234567890123456`

**b) Copie o "Access Token"**
Começa com `EAAG...`

Agora, no n8n:

1. Clique em **"Settings"** no menu lateral → **"Variables"**
2. Crie duas variáveis:

| Name | Value |
|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | Cole o Phone Number ID |
| `WHATSAPP_ACCESS_TOKEN` | Cole o Access Token |

3. Clique em **"Save"** em cada uma

> **Atenção:** O token fornecido pelo Meta expira em 24 horas. Após o teste, peça ao seu fornecedor para configurar um token permanente.

---

## Passo 4 — Ativar o workflow (1 clique)

1. Volte para o seu workflow
2. No canto superior direito, clique no **toggle** (o botão liga/desliga)
3. Ele vai ficar **verde** — o bot está ativo

Após ativar, clique no node **"WhatsApp Webhook"** e copie a **URL do Webhook** que aparece. Você vai precisar dela no próximo passo.

---

## Passo 5 — Configurar o Webhook no painel Meta (2 minutos)

1. Volte no painel Meta → **WhatsApp → Configuration → Webhook → Edit**
2. No campo **"Callback URL"**, cole a URL do webhook que você copiou
3. No campo **"Verify Token"**, digite qualquer texto sem espaços (ex: `minha-empresa-2024`) e anote
4. Clique em **"Verify and Save"**
5. Em **"Webhook fields"**, marque **"messages"** e clique em **"Subscribe"**

---

## Teste final

Mande **"Oi"** para o número do WhatsApp configurado no seu app Meta.

Em alguns segundos o bot deve responder com a mensagem de boas-vindas e começar a fazer as perguntas.

Ao final da conversa, verifique se os dados apareceram na sua planilha Google Sheets.

---

## Algo deu errado?

**Bot não respondeu:**
- O workflow está ativo (toggle verde)?
- A URL do webhook foi colada corretamente no painel Meta?
- O "Verify Token" foi verificado com sucesso no painel Meta?

**Dados não aparecem na planilha:**
- O cliente completou todas as 5 perguntas? (só salva ao finalizar)
- A credencial do Google Sheets está configurada no node "Lead Storage"?
- A aba da planilha se chama exatamente `Leads`?

**Ainda com dúvidas?** Entre em contato com quem configurou seu bot para você.
