# Seu bot de WhatsApp em 20 minutos

Você recebeu dois itens:
- **Arquivo `.json`** — o bot já configurado para a sua empresa
- **Verify Token** — um código que você vai usar em um passo abaixo

Agora é só instalar. Não precisa de programação, terminal ou configuração técnica.

---

## O que você vai precisar

- [ ] O arquivo `.json` recebido
- [ ] O Verify Token recebido (um código de texto)
- [ ] Conta no **n8n Cloud** — crie grátis em [n8n.io](https://n8n.io) se ainda não tiver
- [ ] Uma planilha no **Google Sheets** com uma aba chamada `Leads`

> **Dica:** Crie a planilha agora antes de começar. Adicione na primeira linha os cabeçalhos:
> `Timestamp | Empresa | WhatsApp | Nome | Telefone Contato | Servico Interesse | Orcamento | Prazo | Status`

---

## Passo 1 — Importar o bot no n8n (2 minutos)

1. Acesse seu **n8n** e faça login
2. No menu lateral, clique em **"Workflows"**
3. Clique em **"Add workflow"** → **"Import from file"**
4. Selecione o arquivo `.json` que você recebeu
5. O workflow aparece com o nome da sua empresa e todos os campos já preenchidos

---

## Passo 2 — Conectar o Google Sheets (1 minuto)

1. No workflow aberto, clique duas vezes no node roxo **"Lead Storage — Google Sheets"**
2. Clique em **"Credential for Google Sheets API"** → **"Create new credential"**
3. Clique em **"Sign in with Google"** e autorize com a conta Google onde está sua planilha
4. No campo **"Document"**, selecione sua planilha na lista
5. No campo **"Sheet"**, selecione a aba **Leads**
6. Clique em **"Save"**

---

## Passo 3 — Ativar o workflow (1 clique)

1. No canto superior direito do workflow, clique no **toggle** (o botão liga/desliga)
2. Ele ficará **verde** — o bot está ativo
3. Clique no node **"WhatsApp Webhook"** e copie a **URL do Webhook** que aparece

---

## Passo 4 — Configurar o Webhook no painel Meta (5 minutos)

1. Acesse **developers.facebook.com** → seu app → **WhatsApp → Configuration → Webhook → Edit**
2. No campo **"Callback URL"**, cole a URL do webhook que você copiou no passo anterior
3. No campo **"Verify token"**, cole o **Verify Token** que você recebeu junto com este guia
4. Clique em **"Verify and Save"**
5. Em **"Webhook fields"**, marque **"messages"** e clique em **"Subscribe"**

---

## Teste final

Mande **"Oi"** para o número do WhatsApp configurado no seu app Meta.

Em alguns segundos o bot responde com a mensagem de boas-vindas e começa a fazer as perguntas. Ao final, verifique se os dados apareceram na sua planilha.

---

## Algo deu errado?

**Bot não respondeu:**
- O workflow está ativo (toggle verde)?
- A URL do webhook foi colada corretamente no painel Meta?
- O Verify Token foi aceito (aparece "Verified" no painel Meta)?

**Dados não aparecem na planilha:**
- O cliente completou **todas** as perguntas do bot? (só salva ao finalizar)
- A aba da planilha se chama exatamente `Leads` (com L maiúsculo)?
- A credencial Google Sheets está conectada no node roxo?

**Ainda com dúvidas?** Entre em contato com quem configurou seu bot.
