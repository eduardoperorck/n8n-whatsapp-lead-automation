# Guia do Vendedor
## Como vender e entregar o Bot de WhatsApp

---

## O modelo de negócio em uma linha

**Você personaliza → gera um JSON → entrega ao cliente → cliente instala em 30 minutos.**

O cliente não precisa saber programar, instalar nada ou entender de APIs. Você faz a parte técnica em 2 minutos; ele faz a parte de instalar seguindo o guia.

---

## Setup inicial (feito uma vez)

### 1. Criar sua conta n8n Cloud

Acesse [n8n.io](https://n8n.io) e crie uma conta gratuita. Você vai usar o n8n para gerar os workflows dos seus clientes.

### 2. Importar o Configurador

O workflow **Configurador** é a sua ferramenta de produção. Ele transforma as informações do cliente em um arquivo JSON pronto para entrega.

1. No seu n8n, vá em **Workflows → Import from file**
2. Selecione o arquivo: `workflows/setup/configurador.json`
3. Ative o workflow (toggle verde)
4. Copie a **URL do formulário** que aparece no node "Formulário de Configuração"

Essa URL é permanente. Você vai usá-la para gerar todos os workflows dos seus clientes.

---

## Para cada novo cliente (2 minutos)

### 1. Coletar as informações do cliente

O formulário pede 5 campos obrigatórios + 1 opcional:

| Campo | Exemplo | Onde o cliente encontra |
|---|---|---|
| Nome da empresa | Clínica Saúde Total | — |
| Mensagem de boas-vindas | Olá! Bem-vindo(a) à Clínica... | — |
| Serviços (por vírgula) | Consulta,Pediatria,Ortopedia | — |
| Phone Number ID | 1234567890123456 | Meta → seu app → WhatsApp → API Setup |
| Access Token | EAAG... | Mesma página do Phone Number ID |
| URL de notificação | https://hooks.slack.com/... | Opcional — Slack, Discord, etc. |

Você pode coletar essas informações via formulário de venda, WhatsApp ou e-mail e preencher você mesmo — ou compartilhar o link do formulário direto com o cliente para ele preencher.

### 2. Gerar o workflow

1. Acesse a URL do Configurador no seu n8n
2. Preencha os 3 campos com as informações do cliente
3. Clique em **"Submit"**
4. No painel de execução do n8n, abra a execução mais recente
5. Clique no node **"Resultado"**
6. Copie o conteúdo do campo `workflowJson`
7. Salve como arquivo: `bot_nome-da-empresa.json`

### 3. Entregar ao cliente

No node **"Resultado"** da execução, você verá:
- `2_arquivo` — nome sugerido para o arquivo (ex: `bot_clinica-saude-total-abc123.json`)
- `3_verifyToken_para_webhook_Meta` — o código que o cliente vai usar na configuração do webhook
- `5_workflowJson` — o JSON completo do bot (copie e salve como `.json`)

Envie para o cliente:
- O arquivo `bot_nome-da-empresa.json`
- O Verify Token (campo `3_verifyToken_para_webhook_Meta`)
- O arquivo `docs/guia-cliente.md` (o guia de instalação)

O cliente segue o guia e em 30 minutos o bot está funcionando.

---

## O que o cliente consegue fazer sozinho

- Ativar e desativar o workflow
- Reconectar a conta Google quando pedir (autorização expira a cada 6 meses)
- Ver os leads na planilha
- Mandar "menu" no WhatsApp para reiniciar o fluxo

## O que o cliente vai precisar de você

- **A cada ~60 dias:** Renovar o token do WhatsApp (o token permanente não expira, mas se usar o temporário precisará de ajuda)
- **Para adicionar perguntas:** Editar o node "Lead Qualification" diretamente no n8n
- **Para mudar o texto das mensagens:** Editar os nodes de envio diretamente no n8n
- **Para mudar os serviços:** Editar o node "Send Welcome Message" e o node "Lead Qualification"

---

## Personalização avançada

### Usar o gerador via linha de comando (para quem prefere)

Se você tiver Node.js instalado, pode usar o gerador original:

```bash
node generator/generateWorkflow.js \
  --company "Nome da Empresa" \
  --welcome "Mensagem de boas-vindas" \
  --services "Serviço A,Serviço B"
```

O arquivo gerado fica em `workflows/production/`.

### Modificar as perguntas do bot para todos os clientes

Edite o node "Lead Qualification" no `workflows/template/whatsapp_lead_template.json`. Qualquer mudança aqui é aplicada em todos os workflows gerados depois.

### Criar novos exemplos por vertical

Gere um workflow para o vertical desejado e salve em `workflows/examples/`. Útil para ter modelos prontos de clínica, restaurante, escola, etc.

### Adicionar notificação no WhatsApp do vendedor

No campo "URL de Notificação" do Configurador, cole o webhook de um serviço de notificação (Slack, Discord, ou um webhook de WhatsApp) para receber alertas em tempo real quando um lead for qualificado.

---

## Suporte de primeiro nível ao cliente

Use essas respostas para as dúvidas mais comuns:

**"O bot não respondeu"**
→ Verifique se o workflow está ativo (toggle verde) e se o webhook foi configurado corretamente no painel Meta.

**"Os dados não aparecem na planilha"**
→ O cliente completou todas as 5 perguntas? O lead só é salvo ao final. Verifique também se a credencial do Google Sheets está conectada.

**"O bot parou de responder depois de um tempo"**
→ Comportamento normal. A sessão expira após 30 minutos de inatividade. O cliente precisa mandar uma nova mensagem para reiniciar.

**"O token do WhatsApp expirou"**
→ Token temporário dura 24h. Para produção, configure um token permanente via Meta Business → System Users (veja o FAQ técnico em `docs/faq.md`).

---

## Limites dos planos gratuitos

| Serviço | Limite gratuito |
|---|---|
| n8n Cloud | 2.500 execuções por mês |
| WhatsApp Business API | 1.000 conversas/mês grátis |
| Google Sheets | Sem limite relevante |

Para clientes com volume maior, oriente o upgrade para planos pagos do n8n e Meta.
