> 🇧🇷 Português | [🇺🇸 English](README.md)

# n8n WhatsApp Lead Automation

Sistema de qualificação de leads via WhatsApp construído com n8n, WhatsApp Business API e Google Sheets. Desenvolvido como produto digital low-ticket para pequenas empresas que querem automatizar o primeiro atendimento.

---

## O que faz

Quando um cliente manda mensagem no WhatsApp da empresa, o sistema:

1. Responde automaticamente com uma mensagem de boas-vindas personalizada
2. Conduz uma conversa estruturada de qualificação (5 perguntas)
3. Salva o lead completo numa planilha Google Sheets
4. Notifica o responsável em tempo real (Slack, Discord ou webhook)

Opera 24/7, sem intervenção humana até o lead estar qualificado.

---

## Arquitetura

```
WhatsApp (Meta API)
        ↓  POST /webhook
   Webhook Node (n8n)
        ↓
  Message Parser      ← normaliza entrada, ignora mídia/áudio
        ↓
  Intent Router       ← saudação? mensagem avulsa? resposta em fluxo?
        ↓
 Lead Qualification   ← máquina de estados: IDLE → Q1 → Q2 → Q3 → Q4 → Q5 → COMPLETE
        ↓
   Lead Storage       ← Google Sheets via OAuth2
        ↓
Agent Notification    ← HTTP POST para webhook de notificação
```

O estado da conversa é mantido por usuário no n8n Static Data, com expiração automática de sessão após 30 minutos de inatividade.

---

## Decisões técnicas relevantes

**Google OAuth2 em vez de Service Account**
O node do Google Sheets usa `googleSheetsOAuth2Api` com um credential id placeholder (`GOOGLE_OAUTH2_PLACEHOLDER`). Quando o n8n detecta uma credencial inexistente, exibe o botão "Connect Google Account" — o cliente conecta a planilha com 2 cliques, sem abrir o Google Cloud Console.

**Credenciais WhatsApp embutidas no JSON gerado**
O Phone Number ID e o Access Token são coletados no formulário do Configurador e embutidos diretamente no workflow gerado como URL e header `Authorization: Bearer`. Elimina a necessidade do cliente configurar variáveis de ambiente no n8n.

**Workflow Configurador com Form Trigger**
`workflows/setup/configurador.json` é um workflow n8n com Form Trigger que substitui scripts de linha de comando. O operador preenche um formulário web → o Code node constrói o workflow completo como objeto JavaScript (evita double-escaping) → JSON.stringify produz o arquivo pronto para entrega.

**Verify Token auto-gerado**
O Configurador gera `${slug}-${random}` como verify token para cada cliente, exposto no output do Set node para entrega imediata.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Orquestração | n8n (self-hosted ou Cloud) |
| Mensageria | WhatsApp Business API — Meta Graph API v18.0 |
| Armazenamento | Google Sheets (OAuth2) |
| Geração de workflow | n8n Code node (JavaScript) + `generator/generateWorkflow.js` |
| Testes | Node.js test runner (`tests/`) |

---

## Estrutura do projeto

```
n8n-whatsapp-lead-automation/
├── workflows/
│   ├── template/           ← Template base do workflow
│   ├── examples/           ← Exemplos prontos: clínica, restaurante
│   └── setup/              ← Configurador (gerador via formulário)
├── generator/              ← generateWorkflow.js — geração via CLI
├── scripts/                ← configurar.sh, deployWorkflow.sh, importWorkflow.sh
├── tests/                  ← Testes automatizados
├── contents/               ← Artefatos de entrega ao cliente (guias, FAQ)
├── docs/
│   ├── architecture.md / architecture.pt.md
│   ├── workflow-logic.md / workflow-logic.pt.md
│   ├── product-overview.md / product-overview.pt.md
│   ├── operational.md / operational.pt.md
│   └── development-diary/
└── .env.example
```

---

## Como rodar localmente

```bash
# Instalar dependências
npm install

# Gerar um workflow de exemplo
node generator/generateWorkflow.js \
  --company "Clínica Exemplo" \
  --welcome "Olá! Bem-vindo(a)." \
  --services "Consulta,Pediatria,Ortopedia"

# Rodar os testes
npm test
```

Para uso completo com n8n, importe o arquivo gerado em `workflows/production/` direto no painel do n8n.

---

## Documentação técnica

| Documento | Conteúdo |
|---|---|
| [architecture.pt.md](docs/architecture.pt.md) | Nodes, fluxo de dados, integrações |
| [workflow-logic.pt.md](docs/workflow-logic.pt.md) | Máquina de estados, sessão, qualificação |
| [product-overview.pt.md](docs/product-overview.pt.md) | Visão do produto e contexto |
| [operational.pt.md](docs/operational.pt.md) | Como gerar e entregar bots para clientes |
| [development-diary/](docs/development-diary/) | Log de sprints e decisões |

---

## Segurança

- Nenhuma credencial hardcoded — referenciadas via variáveis de ambiente ou geradas por cliente
- Webhook com verificação de token obrigatória (verify token único por cliente)
- Credenciais do Google via OAuth2 (sem service account JSON no repositório)

---

## Licença

MIT — veja [LICENSE](LICENSE).
