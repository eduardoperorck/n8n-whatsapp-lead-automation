# Guia Completo de Configuração
## WhatsApp Lead Automation — Do Zero ao Funcionando

> Esse guia foi escrito para quem nunca mexeu com automação. Siga cada passo com calma — você consegue!

---

## Antes de começar: o que você vai precisar

Você precisará criar contas em 3 serviços. Todos têm plano gratuito para começar.

| O que | Para que serve | Custo |
|---|---|---|
| **n8n Cloud** | É onde a automação fica rodando | Gratuito para começar |
| **Meta for Developers** | Para conectar ao WhatsApp Business | Gratuito |
| **Google Sheets** | Para guardar os leads que chegarem | Gratuito |

> Tempo estimado para configurar tudo: **2 a 3 horas** na primeira vez.

---

## ETAPA 1 — Configurar o n8n (onde a automação roda)

O n8n é o "motor" da automação. Pense nele como uma plataforma que conecta o WhatsApp com a sua planilha.

### Opção A — n8n na nuvem (recomendado para iniciantes)

1. Acesse **n8n.io** e clique em **"Start for free"**
2. Crie uma conta com seu e-mail
3. Anote o endereço do seu n8n — vai ser algo como `https://seu-nome.app.n8n.cloud`
4. Vá em **Settings > API** e crie uma chave de API (anote essa chave)

### Opção B — n8n no seu computador (mais técnico)

Se preferir rodar localmente, instale com:
```
npx n8n
```
O n8n vai abrir no endereço `http://localhost:5678`

---

## ETAPA 2 — Configurar a conta Meta para WhatsApp

Essa é a parte mais demorada. Siga com atenção.

### Passo 1: Criar conta de desenvolvedor Meta

1. Acesse **developers.facebook.com**
2. Clique em **"Começar"** ou **"Get Started"**
3. Faça login com sua conta do Facebook (ou crie uma)
4. Aceite as políticas de desenvolvedor

### Passo 2: Criar um Aplicativo

1. No painel, clique em **"Criar App"** (ou "Create App")
2. Escolha o tipo: **"Business"**
3. Dê um nome para o app (ex: `Bot Minha Empresa`)
4. Clique em **"Criar App"**

### Passo 3: Adicionar o WhatsApp ao App

1. No painel do seu app, clique em **"Adicionar Produto"**
2. Encontre **"WhatsApp"** e clique em **"Configurar"**
3. Siga as instruções para conectar sua conta do WhatsApp Business

### Passo 4: Pegar as credenciais

Você vai precisar de 3 informações. Anote cada uma:

**a) Phone Number ID (ID do Número de Telefone)**
- No painel do WhatsApp, vá em **API Setup**
- Copie o **"Phone number ID"** — é um número longo como `1234567890123456`

**b) Access Token (Token de Acesso)**
- Na mesma página de API Setup
- Copie o **"Temporary access token"** (começa com `EAAG...`)
- *Atenção: esse token expira em 24h. Para produção, você precisará de um token permanente — veja o FAQ.*

**c) Verify Token (Token de Verificação)**
- Você mesmo vai criar esse. Pode ser qualquer texto, ex: `minha-empresa-token-123`
- Anote ele — você vai usar na hora de configurar o Webhook

### Passo 5: Configurar o Webhook

1. Ainda no painel do WhatsApp, clique em **"Configuration"** no menu lateral
2. Em **"Webhook"**, clique em **"Edit"**
3. No campo **"Callback URL"**, cole o endereço do seu n8n seguido de `/webhook/whatsapp`:
   ```
   https://seu-nome.app.n8n.cloud/webhook/whatsapp
   ```
4. No campo **"Verify token"**, cole o Verify Token que você criou no passo anterior
5. Clique em **"Verify and Save"**
6. Nas assinaturas, marque **"messages"**
7. Clique em **"Subscribe"**

> Se aparecer um erro na verificação do webhook, verifique se o n8n está rodando e se a automação está ativa.

---

## ETAPA 3 — Configurar o Google Sheets

O sistema vai salvar automaticamente os dados de cada lead numa planilha.

### Passo 1: Criar a planilha

1. Acesse **sheets.google.com**
2. Clique em **"+"** para criar uma planilha nova
3. Renomeie a aba para: `Leads`
4. Na primeira linha, crie estes cabeçalhos (um em cada coluna):

```
Timestamp | Empresa | WhatsApp | Nome | Telefone Contato | Servico Interesse | Orcamento | Prazo | Status
```

5. Copie o ID da planilha na barra de endereço:
   ```
   https://docs.google.com/spreadsheets/d/AQUI_FICA_O_ID/edit
   ```
   O ID é o código longo entre `/d/` e `/edit`

### Passo 2: Criar uma Service Account (conta de serviço)

Isso permite que o n8n acesse sua planilha de forma segura.

1. Acesse **console.cloud.google.com**
2. Clique em **"Select a project"** → **"New Project"**
3. Dê um nome (ex: `Automacao WhatsApp`) e clique em **"Create"**
4. No menu lateral, vá em **"APIs & Services"** → **"Library"**
5. Busque **"Google Sheets API"** e clique em **"Enable"**
6. Volte para **"APIs & Services"** → **"Credentials"**
7. Clique em **"+ Create Credentials"** → **"Service Account"**
8. Dê um nome (ex: `n8n-automacao`) e clique em **"Create and Continue"**
9. Em "Role", selecione **"Editor"** e clique em **"Continue"** → **"Done"**
10. Clique na service account recém-criada
11. Vá na aba **"Keys"** → **"Add Key"** → **"Create new key"** → **"JSON"**
12. Um arquivo JSON vai baixar. Guarde esse arquivo com segurança.

### Passo 3: Compartilhar a planilha com a Service Account

1. Abra o arquivo JSON que baixou e encontre o campo `"client_email"` — copie esse e-mail (termina com `@...iam.gserviceaccount.com`)
2. Volte para sua planilha do Google Sheets
3. Clique em **"Compartilhar"**
4. Cole o e-mail da service account
5. Dê permissão de **"Editor"**
6. Clique em **"Enviar"**

---

## ETAPA 4 — Gerar e importar o workflow

Agora você vai personalizar a automação para a sua empresa.

### Passo 1: Baixar este projeto

Se você recebeu um arquivo ZIP:
- Extraia em uma pasta no seu computador

Se você tem o link do GitHub:
1. Clique em **"Code"** → **"Download ZIP"**
2. Extraia o ZIP

### Passo 2: Instalar o Node.js

O Node.js é necessário para gerar a automação personalizada.

1. Acesse **nodejs.org**
2. Baixe a versão **"LTS"** (a recomendada)
3. Instale normalmente (Next, Next, Finish)
4. Para verificar: abra o Prompt de Comando (Windows) ou Terminal (Mac/Linux) e digite:
   ```
   node --version
   ```
   Deve aparecer algo como `v20.0.0`

### Passo 3: Configurar suas informações

1. Na pasta do projeto, encontre o arquivo `.env.example`
2. Faça uma cópia e renomeie para `.env`
3. Abra o `.env` com um editor de texto (Bloco de Notas serve)
4. Preencha cada campo com as informações que você coletou:

```
N8N_API_URL=https://seu-nome.app.n8n.cloud
N8N_API_KEY=sua_chave_api_do_n8n

WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_ACCESS_TOKEN=seu_access_token
WHATSAPP_VERIFY_TOKEN=minha-empresa-token-123

GOOGLE_SHEETS_SPREADSHEET_ID=id_da_sua_planilha
GOOGLE_SHEETS_SHEET_NAME=Leads

COMPANY_NAME=Nome da Sua Empresa
WELCOME_MESSAGE=Olá! Bem-vindo(a) à Nome da Sua Empresa. Como podemos ajudar?
SERVICES=Serviço 1,Serviço 2,Serviço 3
```

### Passo 4: Executar o script de configuração

Abra o Terminal ou Prompt de Comando na pasta do projeto e execute:

**Windows (Prompt de Comando):**
```
npm install
node generator/generateWorkflow.js
bash scripts/deployWorkflow.sh
```

**Mac / Linux (Terminal):**
```bash
npm install
bash scripts/configurar.sh
```

O script vai fazer perguntas simples e configurar tudo automaticamente.

### Passo 5: Ativar o workflow no n8n

1. Acesse seu n8n
2. Vá em **"Workflows"**
3. Encontre o workflow com o nome da sua empresa
4. Clique no botão de ativar (o toggle fica verde)

---

## ETAPA 5 — Testar o sistema

Antes de usar com clientes reais, faça um teste:

1. Abra o WhatsApp no seu celular
2. Envie uma mensagem para o número configurado: `Oi`
3. Em alguns segundos, o bot deve responder com a mensagem de boas-vindas
4. Responda as perguntas do bot
5. Ao final, verifique se os dados apareceram na sua planilha do Google Sheets
6. Verifique se você recebeu a notificação (no Slack ou no canal que configurou)

**Funcionou?** Parabéns! Sua automação está pronta.

**Não funcionou?** Veja o [FAQ](faq.md) ou entre em contato com o suporte.

---

## Resumo das credenciais que você vai precisar

Use essa lista como checklist antes de começar:

- [ ] URL do n8n (ex: `https://minha-empresa.app.n8n.cloud`)
- [ ] Chave de API do n8n
- [ ] Phone Number ID do WhatsApp
- [ ] Access Token do WhatsApp
- [ ] Verify Token (você cria — qualquer texto)
- [ ] ID da planilha Google Sheets
- [ ] Arquivo JSON da Service Account do Google

---

## Próximos passos após a configuração

- Configure o [token permanente do WhatsApp](faq.md#token-permanente) para não precisar renovar a cada 24h
- Personalize as perguntas do bot diretamente no n8n
- Configure notificações no WhatsApp do vendedor (em vez do Slack)
- Veja os leads chegando na sua planilha em tempo real
