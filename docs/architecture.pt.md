> 🇧🇷 Português | [🇺🇸 English](architecture.md)

# Arquitetura — n8n WhatsApp Lead Automation

## Visão Geral

O sistema é composto por três camadas:

```
┌──────────────────────────────────────────────┐
│              CAMADA DE ENTRADA               │
│  WhatsApp Business API → n8n Webhook         │
└──────────────────────────┬───────────────────┘
                           ↓
┌──────────────────────────────────────────────┐
│           CAMADA DE PROCESSAMENTO            │
│  Message Parser → Intent Router              │
│  Lead Qualification State Machine            │
└──────────────────────────┬───────────────────┘
                           ↓
┌──────────────────────────────────────────────┐
│             CAMADA DE SAÍDA                  │
│  Google Sheets Storage + Agent Notification  │
└──────────────────────────────────────────────┘
```

---

## Pipeline Canônico de Nodes

### 1. WhatsApp Webhook (Trigger)
**Node:** `n8n-nodes-base.webhook`

- Expõe endpoint `POST /webhook/whatsapp`
- Expõe endpoint `GET /webhook/whatsapp` para verificação Meta
- Valida `hub.verify_token` no GET
- Retorna `hub.challenge` para confirmar o webhook

**Resiliência:**
- Responde `200 OK` imediatamente antes de processar (evita retry do WhatsApp)
- Timeout configurado para 30s

---

### 2. Method Router (IF)
**Node:** `n8n-nodes-base.if`

- `GET` → fluxo de verificação de webhook
- `POST` → fluxo principal de processamento

---

### 3. Message Parser (Code)
**Node:** `n8n-nodes-base.code`

Extrai e valida a mensagem recebida.

**Validações:**
- Tamanho máximo do payload: 64KB
- Tipo de mensagem: apenas `text` é processado
- Estrutura obrigatória: `entry[0].changes[0].value.messages[0]`

**Fallbacks:**
| Situação | Resposta |
|---|---|
| Payload > 64KB | Log + descarte silencioso |
| Tipo `audio` | "Desculpe, só aceito mensagens de texto" |
| Tipo `image` | "Desculpe, só aceito mensagens de texto" |
| JSON malformado | Log + `200 OK` silencioso (evita retry loop) |
| Texto vazio | Ignora silenciosamente |

---

### 4. Intent Router (Switch)
**Node:** `n8n-nodes-base.switch`

Roteia baseado no estado da conversa do usuário:

| Intenção | Condição | Destino |
|---|---|---|
| `greeting` | Primeira mensagem / reset | Envio de boas-vindas |
| `qualifying` | Qualificação em andamento | Continua Q&A |
| `complete` | Todas as perguntas respondidas | Storage + Notificação |
| `unknown` | Fallback | Mensagem de ajuda |

O estado da conversa é rastreado via número de telefone (`from`) como chave.

---

### 5. Lead Qualification (Code)
**Node:** `n8n-nodes-base.code`

Máquina de estados da qualificação. Perguntas configuráveis:

1. Nome completo
2. Melhor telefone para contato
3. Serviço de interesse (`{{services}}`)
4. Orçamento aproximado
5. Prazo para início

**Resiliência:**
- Resposta fora do esperado → repete a pergunta com instrução
- Timeout de sessão: 30 minutos de inatividade redefine o estado

---

### 6. Send WhatsApp Message (HTTP Request)
**Node:** `n8n-nodes-base.httpRequest`

Envia mensagem de texto via WhatsApp Business API.

**Resiliência:**
- Retry automático: 3 tentativas com backoff exponencial (1s, 2s, 4s)
- Rate limit: respeita limite de 80 msg/s da API
- Timeout: 10s por requisição
- Erro 429 (rate limit): espera o `Retry-After` header

---

### 7. Lead Storage (Google Sheets)
**Node:** `n8n-nodes-base.googleSheets`

Appends o lead qualificado na planilha.

**Colunas:**
| Coluna | Descrição |
|---|---|
| Timestamp | Data/hora do preenchimento |
| Empresa | `{{company_name}}` |
| Telefone | Número WhatsApp |
| Nome | Nome informado |
| Telefone Contato | Telefone alternativo |
| Serviço Interesse | Serviço selecionado |
| Orçamento | Valor informado |
| Prazo | Prazo informado |
| Status | `novo` |

**Resiliência:**
- Retry: 3 tentativas com jitter aleatório (evita thundering herd)
- Quota Google: 100 req/100s → fila local se necessário
- Dado não salvo: log de erro + notificação ao agente com dados brutos

---

### 8. Agent Notification (HTTP Request)
**Node:** `n8n-nodes-base.httpRequest`

Dispara webhook de notificação (Slack, endpoint custom, etc.).

**Payload enviado:**
```json
{
  "company": "{{company_name}}",
  "lead": {
    "phone": "+5511999999999",
    "name": "João Silva",
    "service": "Consulta",
    "budget": "R$ 500",
    "timeline": "Próxima semana"
  },
  "timestamp": "2026-03-09T10:00:00Z"
}
```

**Resiliência:**
- Retry: 2 tentativas
- Falha na notificação: NÃO bloqueia o fluxo — lead já está salvo no Sheets

---

## Fluxo de Dados Completo

```
[WhatsApp User]
    │ POST /webhook/whatsapp
    ↓
[Webhook Node]
    │ extrai body raw
    ↓
[Method Router]
    ├─ GET → [Verify Challenge] → [Respond 200 + challenge]
    └─ POST ↓
[Message Parser]
    ├─ invalid/unsupported → [Send Fallback Msg] → [Respond 200]
    └─ valid text ↓
[Intent Router]
    ├─ greeting  → [Send Welcome Message] → [Respond 200]
    ├─ qualifying → [Lead Qualification]
    │                    ↓
    │              [Send Next Question] → [Respond 200]
    └─ complete  → [Lead Qualification (final)]
                        ↓
                   [Google Sheets Append]
                        ↓
                   [Agent Notification]
                        ↓
                   [Respond 200]
```

---

## Considerações de Segurança

- **Verify Token:** validado no handshake inicial do webhook Meta
- **No hardcoded secrets:** todas as credenciais via n8n Credentials ou env vars
- **Input sanitization:** Message Parser rejeita payloads malformados antes de qualquer processamento
- **Response sempre 200:** o WhatsApp re-envia mensagens para qualquer status != 200, criando loops — sempre retornamos 200 mesmo em erro interno
