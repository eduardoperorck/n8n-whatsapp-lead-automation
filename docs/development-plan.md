# Claude Development Plan
Project: n8n WhatsApp Lead Automation

Objective:
Build a production-ready automation system for WhatsApp lead qualification using n8n.

The system must allow:
- automatic replies
- lead qualification
- lead storage
- workflow generation
- easy deployment

The project should also function as:
- a product
- a GitHub portfolio project
- a reusable automation template
2️⃣ Arquitetura do produto

Claude deve implementar a arquitetura abaixo.

User message
    ↓
WhatsApp API
    ↓
n8n Webhook
    ↓
Message Parser
    ↓
Intent Switch
    ↓
Lead Qualification Flow
    ↓
Google Sheets Storage
    ↓
Agent Notification

3️⃣ Estrutura do repositório que o Claude deve criar

n8n-whatsapp-lead-automation/
│
├── README.md
├── CLAUDE.md
├── .env.example
├── .gitignore
│
├── docs/
│   ├── product-overview.md
│   ├── architecture.md
│   ├── workflow-logic.md
│   └── claude-development-plan.md
│
├── workflows/
│   ├── template/
│   │   └── whatsapp_lead_template.json
│   │
│   ├── examples/
│   │   ├── clinic_bot.json
│   │   └── restaurant_bot.json
│   │
│   └── production/
│       └── lead_qualification_workflow.json
│
├── generator/
│   ├── generateWorkflow.js
│   ├── templateEngine.js
│   └── workflowValidator.js
│
├── scripts/
│   ├── importWorkflow.sh
│   └── deployWorkflow.sh
│
├── scripts/pocs/
│   └── (Provas de Conceito)
│
└── examples/
    ├── form_payload.json
    └── lead_data.json

4️⃣ Responsabilidades do Claude Code

Claude deve implementar 4 módulos principais.

1️⃣ Workflow Template

Arquivo:

workflows/template/whatsapp_lead_template.json

Esse template deve conter variáveis:

{{company_name}}
{{welcome_message}}
{{services}}

Claude deve garantir que:

o JSON seja importável no n8n

os nodes estejam organizados

existam comentários explicativos

2️⃣ Workflow Generator

Claude deve criar um sistema que:

receive form data
    ↓
load workflow template
    ↓
replace variables
    ↓
validate JSON
    ↓
export workflow

Arquivo principal:

generator/generateWorkflow.js

Função esperada:

generateWorkflow(config)

Entrada:

{
 company_name,
 welcome_message,
 services
}

Saída:

n8n workflow JSON

3️⃣ Workflow Validator

Arquivo:

generator/workflowValidator.js

Claude deve validar:

JSON válido

nodes obrigatórios

ausência de credenciais hardcoded

estrutura compatível com n8n

4️⃣ Import Script

Arquivo:

scripts/importWorkflow.sh

Função:

curl -X POST $N8N_API_URL/rest/workflows

Usando variáveis de ambiente.

5️⃣ Fluxo de uso do produto

Claude deve documentar o fluxo de uso:

client purchases product
      ↓
client fills configuration form
      ↓
system receives form data
      ↓
workflow generator runs
      ↓
custom workflow created
      ↓
workflow deployed to n8n

6️⃣ Metodologia de Desenvolvimento (Engenharia de Produção & Vibe Coding)

Claude aplicará as seguintes metodologias estritas na execução:
- **Small Releases**: Entregas contínuas e parciais. Cada feature de código (um script, um workflow) deve ser validada e funcional. Evitar tentar codificar todo o sistema de uma só vez (fuga da ilusão do "one-shot").
- **Desenvolvimento Documentado (Diário)**: O desenvolvimento não deve ser silencioso. Claude manterá um "diário de bordo" dentro de `docs/development-diary/` documentando o que foi feito na iteração, decisões de resiliência, fallbacks construídos, ou falhas encontradas que motivaram refatorações.
- **Benchmark Driven Development (PoC First)**: Antes de adotar integrações não triviais via n8n Node ou de escrever parseadores estritos em JS, construir *Provas de Conceito (PoCs)* dentro da pasta `scripts/pocs/`.
- **Resiliência e Pós-Deploy**: Cada integração via Webhook, banco de dados (ex: Google Sheets) e API do WhatsApp deve vir munida de tratamentos para limite de taxa (rate limits), time-outs da rede e fallbacks lógicos (ex: "o que fazer se o cliente mandar áudio gigante?").
- **Testes Automatizados**: Scripts geradores/validadores (`generateWorkflow.js`, `workflowValidator.js`) serão providos de testes unitários (TDD) para garantir consistência à medida que o projeto ganha complexidade.

7️⃣ Estrutura do README que Claude deve gerar

Claude deve gerar README com:

project overview
features
architecture diagram
installation
usage
workflow generation
deployment