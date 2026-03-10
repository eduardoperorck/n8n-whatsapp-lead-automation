# Diário de Desenvolvimento — 2026-03-09 (SR-07)

**Sprint:** SR-07 — Simplificação da Jornada do Cliente Final

---

## Contexto e Motivação

Análise da jornada do usuário final revelou que o produto, embora tecnicamente sólido, criava barreiras desnecessárias para o público-alvo (pequenos empreendedores sem conhecimento técnico):

| Ponto de atrito | Impacto |
|---|---|
| Google Cloud Console (Service Account) | 10+ passos, principal ponto de abandono |
| Node.js + scripts bash | Intimidador para não-técnicos |
| 11 variáveis no .env | Usuário não sabe de onde tirar cada informação |
| Tempo de setup: 2-3 horas | Produto low-ticket não suporta onboarding tão longo |

**Meta:** Reduzir a jornada do cliente de 2-3h para 30-45 min, sem abrir o terminal.

---

## Modelo de Negócio Revisado

A sprint introduziu uma separação explícita de responsabilidades:

```
VENDEDOR: usa o Configurador → gera JSON personalizado → entrega ao cliente
CLIENTE:  importa JSON → conecta Google OAuth2 → cola token WhatsApp → ativa
```

O cliente final nunca mais precisará abrir o terminal.

---

## Decisões Arquiteturais

### 1. Google OAuth2 em vez de Service Account

**Antes:** node Google Sheets com `mode: "id"` + sem bloco `credentials` → forçava criação de Service Account (10+ passos no Google Cloud Console).

**Depois:** node com `mode: "list"` + bloco `credentials.googleSheetsOAuth2Api` com id placeholder `"GOOGLE_OAUTH2_PLACEHOLDER"`.

**Por que funciona:** Quando o n8n importa um workflow com credential id inexistente no sistema, exibe o estado "credencial não configurada" com botão "Connect Google Account" — abre OAuth2 nativo. O modo `"list"` habilita um picker visual de planilhas após autenticação.

**Impacto:** Elimina Google Cloud Console completamente (10+ passos → 2 cliques).

**Arquivos alterados:**
- `workflows/template/whatsapp_lead_template.json`
- `workflows/examples/clinic_bot.json`
- `workflows/examples/restaurant_bot.json`

### 2. Workflow Configurador com Form Trigger

Criado `workflows/setup/configurador.json` — um workflow n8n de uso exclusivo do vendedor.

**Nodes:**
1. **Form Trigger** — cria URL de formulário web público com 4 campos (nome da empresa, mensagem de boas-vindas, serviços, URL de notificação opcional)
2. **Code: Gerar Workflow** — recebe os dados do formulário, constrói o workflow completo como objeto JavaScript (evita double-escaping de JSON), gera UUIDs únicos para `id`, `versionId` e `webhookId`
3. **Set: Resultado** — formata output para cópia fácil no painel de execução do n8n

**Decisão crítica:** O template completo do bot é embutido como objeto JavaScript literal dentro do Code node (não como string JSON), eliminando o problema de double-escaping de aspas. O `JSON.stringify()` ao final produz JSON válido.

**Benefício:** Substitui Node.js + npm + configurar.sh + deployWorkflow.sh por um formulário web sem código.

### 3. Separação de documentação por audiência

Criados dois guias distintos:
- `docs/guia-cliente.md` — 1 página, sem jargão, para quem comprou e recebeu o JSON
- `docs/guia-vendedor.md` — modelo de negócio, uso do Configurador, suporte de primeiro nível

O `docs/guia-passo-a-passo.md` recebeu nota de redirecionamento no topo.

---

## Problemas em Aberto (registrados para SR-08)

**WhatsApp via env vars:** Os nodes de mensagem ainda referenciam `$env.WHATSAPP_PHONE_NUMBER_ID` e `$env.WHATSAPP_ACCESS_TOKEN`. Em n8n Cloud, isso exige configurar Settings → Variables. Para um cliente 100% não-técnico, a alternativa futura é embutir o Phone ID diretamente no JSON gerado e usar credencial "Header Auth" para o token — eliminaria as env vars completamente.

**webhookId duplicado:** `clinic_bot.json` e `restaurant_bot.json` compartilhavam `webhookId: "whatsapp-lead-webhook-01"`. O Configurador agora gera um UUID único por workflow via `crypto.randomUUID()`. Os exemplos existentes ainda têm o webhook duplicado — corrigir nos exemplos em SR-08.

---

## Métricas da Sprint

| Artefato | Ação |
|---|---|
| `workflows/template/whatsapp_lead_template.json` | Atualizado — OAuth2 no Google Sheets |
| `workflows/examples/clinic_bot.json` | Atualizado — OAuth2 no Google Sheets |
| `workflows/examples/restaurant_bot.json` | Atualizado — OAuth2 no Google Sheets |
| `workflows/setup/configurador.json` | Criado — Form Trigger + gerador in-workflow |
| `docs/guia-cliente.md` | Criado — guia de 1 página para o comprador |
| `docs/guia-vendedor.md` | Criado — modelo de negócio + operação |
| `docs/guia-passo-a-passo.md` | Atualizado — nota de redirecionamento |
| `README.md` | Atualizado — seção COMECE AQUI dividida por audiência |

**Jornada do cliente antes:** 2-3 horas, 25-30 passos manuais, Google Cloud Console obrigatório
**Jornada do cliente depois:** 30-45 minutos, ~12 passos, sem terminal, sem Google Cloud Console
