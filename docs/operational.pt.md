> 🇧🇷 Português | [🇺🇸 English](operational.md)

# Guia Operacional
## Geração e entrega do bot para cada cliente

---

## Setup inicial (feito uma vez)

### 1. Criar conta n8n Cloud

Acesse [n8n.io](https://n8n.io) e crie uma conta gratuita. É aqui que o Configurador vai rodar.

### 2. Criar a planilha-modelo

Crie uma planilha no Google Sheets que será duplicada por cada cliente.

1. Crie uma planilha nova no Google Sheets
2. Na primeira linha, adicione os cabeçalhos (um por coluna):
   `Timestamp` | `Empresa` | `WhatsApp` | `Nome` | `Telefone Contato` | `Servico Interesse` | `Orcamento` | `Prazo` | `Status`
3. Renomeie a aba para `Leads` (com L maiúsculo)
4. Compartilhe como "qualquer pessoa com o link pode visualizar" — **Arquivo → Compartilhar**
5. Guarde o link

Esse link é enviado a todos os clientes. Eles fazem **Arquivo → Fazer uma cópia** e a planilha cai na conta Google deles, já formatada.

### 3. Importar o Configurador

O Configurador é o workflow que gera os bots personalizados.

1. No n8n, vá em **Workflows → Import from file**
2. Selecione: `workflows/setup/configurador.json`
3. Ative o workflow (botão verde)
4. Copie a **URL do formulário** que aparece no primeiro node

Essa URL é permanente. Você vai usá-la para gerar todos os workflows.

---

## Para cada novo cliente

### 1. Coletar as informações

| Campo | Exemplo | Onde o cliente encontra |
|---|---|---|
| Nome da empresa | Clínica Saúde Total | — |
| Mensagem de boas-vindas | Olá! Bem-vindo(a) à Clínica... | — |
| Serviços (por vírgula) | Consulta,Pediatria,Ortopedia | — |
| Phone Number ID | 1234567890123456 | Meta → app → WhatsApp → API Setup |
| Access Token | EAAG... | Mesma página do Phone Number ID |
| URL de notificação | https://hooks.slack.com/... | Opcional |

> O Phone Number ID e o Access Token são embutidos diretamente no JSON gerado — o cliente não precisa configurar nenhuma variável de ambiente.

### 2. Gerar o workflow

1. Acesse a URL do Configurador
2. Preencha os campos e clique em **"Submit"**
3. No painel de execução do n8n, abra a execução mais recente
4. Clique no node **"Resultado"**
5. Copie o conteúdo do campo `5_workflowJson`
6. Salve como arquivo: `bot_nome-da-empresa.json`

O node **"Resultado"** exibe:
- `2_arquivo` — nome sugerido para o arquivo
- `3_verifyToken_para_webhook_Meta` — código que o cliente usa no painel Meta
- `5_workflowJson` — JSON completo do bot

### 3. Entregar ao cliente

Envie via seu canal de venda:
- O arquivo `bot_nome-da-empresa.json`
- O Verify Token (campo `3_verifyToken_para_webhook_Meta`)
- O link da planilha-modelo
- O arquivo `contents/guia-cliente.md`

---

## O que o cliente faz sozinho

- Importar o JSON no n8n
- Conectar o Google Sheets via "Sign in with Google"
- Ativar o workflow e configurar o webhook no painel Meta
- Reconectar a conta Google quando expirar (~6 meses)
- Ver leads na planilha

## O que depende de você

- **Renovar o Access Token** se o cliente usar token temporário (dura 24h — orientar token permanente desde o início)
- **Editar perguntas** do bot: node "Lead Qualification" no n8n do cliente
- **Mudar mensagens ou serviços**: nodes "Send Welcome Message" e "Lead Qualification"

---

## Limites dos planos gratuitos

| Serviço | Limite gratuito |
|---|---|
| n8n Cloud | 2.500 execuções/mês |
| WhatsApp Business API | 1.000 conversas/mês |
| Google Sheets | Sem limite relevante |

---

## Suporte de primeiro nível

**"O bot não respondeu"**
→ Workflow ativo (botão verde)? Webhook configurado e verificado no painel Meta?

**"Dados não aparecem na planilha"**
→ O usuário completou todas as 5 perguntas? A credencial do Google Sheets está conectada?

**"Bot parou de responder"**
→ Normal — sessão expira após 30 min de inatividade. Nova mensagem reinicia do zero.

**"Token do WhatsApp expirou"**
→ Token temporário dura 24h. Configurar token permanente via Meta Business → System Users.
