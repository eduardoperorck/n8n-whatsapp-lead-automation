> 🇧🇷 Português | [🇺🇸 English](workflow-logic.md)

# Lógica do Workflow — n8n WhatsApp Lead Automation

## Máquina de Estados da Conversa

Cada usuário (identificado pelo número de telefone `from`) possui um estado de conversa:

```
IDLE → GREETING_SENT → Q1 → Q2 → Q3 → Q4 → Q5 → COMPLETE
```

| Estado | Descrição |
|---|---|
| `IDLE` | Nenhuma interação anterior ou sessão expirada |
| `GREETING_SENT` | Boas-vindas enviadas, aguardando primeira resposta |
| `Q1` | Aguardando nome |
| `Q2` | Aguardando telefone de contato |
| `Q3` | Aguardando serviço de interesse |
| `Q4` | Aguardando orçamento |
| `Q5` | Aguardando prazo |
| `COMPLETE` | Qualificação concluída |

## Timeout de Sessão

- Inatividade > 30 minutos → estado resetado para `IDLE`
- Na próxima mensagem, o fluxo começa do zero

## Perguntas de Qualificação

As perguntas são configuradas no node **Lead Qualification** e podem ser alteradas diretamente no n8n sem re-deploy:

```
Q1: "Qual é o seu nome completo?"
Q2: "Qual o melhor número para contato? (pode ser este mesmo)"
Q3: "Qual serviço você tem interesse? Opções: {{services}}"
Q4: "Qual seu orçamento aproximado para este serviço?"
Q5: "Quando você gostaria de começar?"
```

## Roteamento de Intenções

O **Intent Router** avalia o estado atual + conteúdo da mensagem:

```javascript
// Pseudocódigo do roteamento
if (session.state === 'IDLE' || isGreeting(text)) {
  → fluxo GREETING
} else if (session.state in ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']) {
  → fluxo QUALIFYING (salva resposta, avança estado)
} else if (session.state === 'COMPLETE') {
  → fluxo COMPLETE (storage + notificação)
} else {
  → fluxo UNKNOWN (mensagem de ajuda)
}
```

## Detecção de Saudação

Palavras que ativam o fluxo de boas-vindas:

```
oi, olá, ola, hello, hi, bom dia, boa tarde, boa noite,
início, inicio, começar, comecar, start, menu
```

## Mensagens do Sistema

### Boas-vindas
```
Olá! {{welcome_message}}

Nossos serviços: {{services}}

Para começar, me diga: qual é o seu nome completo?
```

### Tipo de Mensagem Inválido
```
Desculpe, no momento só consigo processar mensagens de texto.
Por favor, envie sua dúvida em texto. 😊
```

### Conclusão da Qualificação
```
Perfeito, [nome]! Recebi todas as suas informações.
Nossa equipe entrará em contato em breve pelo número [telefone].
Até logo! 👋
```

### Fallback (intent desconhecida)
```
Não entendi sua mensagem. Digite *menu* para ver as opções disponíveis.
```

## Estrutura do Lead no Google Sheets

| Campo | Origem |
|---|---|
| Timestamp | `new Date().toISOString()` |
| Empresa | `{{company_name}}` (fixo no template) |
| WhatsApp | `message.from` |
| Nome | Resposta Q1 |
| Telefone Contato | Resposta Q2 |
| Serviço Interesse | Resposta Q3 |
| Orçamento | Resposta Q4 |
| Prazo | Resposta Q5 |
| Status | `"novo"` (padrão) |

## Payload de Notificação ao Agente

```json
{
  "event": "new_qualified_lead",
  "company": "{{company_name}}",
  "timestamp": "ISO 8601",
  "lead": {
    "whatsapp": "+5511999999999",
    "name": "João Silva",
    "contact_phone": "+5511888888888",
    "service_interest": "Consulta Clínica Geral",
    "budget": "R$ 300 a R$ 500",
    "timeline": "Esta semana"
  }
}
```
