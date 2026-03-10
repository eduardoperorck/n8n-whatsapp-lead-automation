> 🇧🇷 Português | [🇺🇸 English](api-integration.md)

# Exemplos de Integração com a API

Exemplos práticos de como interagir com a WhatsApp Business API e o webhook do n8n.

---

## 1. Enviar uma mensagem pelo WhatsApp (saída)

O bot usa esse endpoint para responder aos usuários. Você também pode chamá-lo manualmente para enviar mensagens proativas.

```bash
curl -X POST "https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511999887766",
    "type": "text",
    "text": { "body": "Olá! Esta é uma mensagem de teste." }
  }'
```

**Resposta (sucesso):**
```json
{
  "messaging_product": "whatsapp",
  "contacts": [{ "input": "5511999887766", "wa_id": "5511999887766" }],
  "messages": [{ "id": "wamid.XXXXXXXXXXXXXX" }]
}
```

---

## 2. Acionar o workflow de follow-up

Com o workflow de follow-up (`workflows/examples/follow_up_bot.json`) importado e ativo no n8n:

```bash
curl -X POST "https://seu-n8n.app.n8n.cloud/webhook/whatsapp-followup" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999887766",
    "message": "Olá! Ainda tem interesse nos nossos serviços? Podemos agendar uma conversa?",
    "company": "Clínica Saúde Total"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "phone": "5511999887766",
  "sentAt": "2026-03-10T14:00:00.000Z"
}
```

---

## 3. Verificação do webhook (handshake Meta)

Quando você configura a URL do webhook no painel Meta, a Meta envia um GET para verificar. O node de webhook do n8n trata isso automaticamente, mas veja como a troca funciona:

**Meta envia:**
```
GET /webhook/whatsapp?hub.mode=subscribe&hub.verify_token=SEU_VERIFY_TOKEN&hub.challenge=1234567890
```

**n8n responde:**
```
200 OK
Body: 1234567890
```

O verify token deve corresponder ao que foi configurado no painel Meta. O workflow retorna `hub.challenge` para confirmar a propriedade do endpoint.

---

## 4. Gerar um workflow via CLI

Se preferir a linha de comando ao formulário do Configurador:

```bash
node generator/generateWorkflow.js \
  --company "Clínica Saúde Total" \
  --welcome "Olá! Bem-vindo(a) à Clínica Saúde Total. Estamos aqui para cuidar da sua saúde! 💚" \
  --services "Consulta Clínica Geral,Pediatria,Ginecologia,Ortopedia"
```

O arquivo gerado é salvo em `workflows/production/bot_clinica-saude-total-{hash}.json`.

**Validar o arquivo gerado:**
```bash
node -e "
const { validateWorkflowFile } = require('./generator/workflowValidator');
const result = validateWorkflowFile('./workflows/production/bot_clinica-saude-total-{hash}.json');
console.log(result.valid ? 'Válido ✓' : 'Erros:', result.errors);
"
```

---

## 5. Rodar os testes

```bash
# Todos os testes
node --test tests/

# Arquivos individuais
node tests/generator.test.js
node tests/validator.test.js
```

---

## Referência de variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID do painel Meta | `1234567890123456` |
| `WHATSAPP_ACCESS_TOKEN` | Token Bearer para chamadas da API | `EAAG...` |
| `WHATSAPP_VERIFY_TOKEN` | Token para verificação do webhook | `minha-empresa-abc123` |
| `N8N_API_URL` | URL base da sua instância n8n | `https://meu-nome.app.n8n.cloud` |
| `N8N_API_KEY` | Chave de API do n8n para acesso programático | `n8n_api_...` |

> Nos workflows gerados para clientes, `WHATSAPP_PHONE_NUMBER_ID` e `WHATSAPP_ACCESS_TOKEN` são embutidos diretamente como valores estáticos. Essas variáveis só são necessárias ao usar o gerador CLI ou os scripts.
