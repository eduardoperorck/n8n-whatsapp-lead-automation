> 🇧🇷 Português | [🇺🇸 English](delivery-checklist.en.md)

# Checklist de Entrega — Bot WhatsApp

**Produto:** WhatsApp Lead Automation
**Versão do checklist:** 1.0
**Uso:** Preencher a cada nova entrega de bot para um cliente

---

## Dados da Entrega

| Campo | Valor |
|---|---|
| Nome do cliente | |
| Empresa do cliente | |
| Tipo de negócio | |
| Data de entrega | |
| Responsável pela entrega | |
| Contato do cliente (WhatsApp) | |
| Contato do cliente (e-mail) | |

---

## Parte 1 — Pré-Entrega (antes de gerar o bot)

Confirme esses itens com o cliente antes de preencher o Configurador. Se algum item estiver pendente, não avance — a ativação vai falhar sem eles.

### 1.1 Requisitos de Conta

- [ ] Cliente tem conta ativa no **n8n** (n8n.io)
  - Plano: `gratuito` / `Starter` / `Pro` / `Enterprise`
  - URL da instância (se self-hosted): ___________________________

- [ ] Cliente tem acesso ao **painel de desenvolvedor da Meta** (developers.facebook.com)
  - App criado: `sim` / `não`
  - App ID: ___________________________

- [ ] Cliente tem **número de telefone dedicado** para o WhatsApp Business API
  - Número: ___________________________
  - O número está registrado no WhatsApp pessoal? `sim` / `não` ← deve ser NÃO

- [ ] Cliente tem conta **Google** (para o Google Sheets)
  - E-mail Google: ___________________________

### 1.2 Dados da API do WhatsApp

- [ ] **Phone Number ID** confirmado com o cliente
  - Valor: ___________________________
  - Onde encontrar: Meta App → WhatsApp → API Setup → Phone Number ID

- [ ] **WhatsApp Business Account ID (WABA ID)** confirmado
  - Valor: ___________________________

- [ ] **Access Token** obtido pelo cliente
  - Tipo: `temporário (24h)` / `permanente (system user)` ← preferir permanente
  - Token: *(não anotar aqui — referenciar via variável de ambiente no n8n)*

- [ ] **Verify Token** definido
  - Valor escolhido: ___________________________
  - Regra: string simples sem espaços, ex: `nome-empresa-ab12cd`

### 1.3 Informações de Conteúdo do Bot

- [ ] Nome da empresa confirmado (aparece nas mensagens de boas-vindas)
  - Valor: ___________________________

- [ ] Tipo de negócio definido (clínica / restaurante / prestador de serviço / escola / outro)
  - Valor: ___________________________

- [ ] Perguntas de qualificação revisadas e aprovadas pelo cliente (5 perguntas)
  - P1 (nome): padrão ✓
  - P2 (serviço/interesse): ___________________________
  - P3 (urgência/disponibilidade): ___________________________
  - P4 (preferência de contato): padrão ✓
  - P5 (observações): padrão ✓

- [ ] Canal de notificação para o dono definido
  - Canal: `WhatsApp` / `E-mail` / `outro`
  - Destino da notificação: ___________________________

---

## Parte 2 — Geração do Bot (Configurador)

### 2.1 Preenchimento do Formulário do Configurador

- [ ] Abrir o workflow **Configurador** no n8n
- [ ] Preencher campo: `businessName` → ___________________________
- [ ] Preencher campo: `businessType` → ___________________________
- [ ] Preencher campo: `phoneNumberId` → ___________________________
- [ ] Preencher campo: `wabaId` → ___________________________
- [ ] Preencher campo: `verifyToken` → ___________________________
- [ ] Preencher campo: `notificationTarget` → ___________________________
- [ ] Preencher perguntas customizadas (P2 e P3) se diferentes do padrão
- [ ] Executar o Configurador

### 2.2 Validação do JSON Gerado

- [ ] JSON foi gerado sem erros de execução no n8n
- [ ] Abrir o arquivo JSON e verificar:
  - [ ] Campo `businessName` está correto
  - [ ] `verifyToken` corresponde ao definido com o cliente
  - [ ] `phoneNumberId` está correto
  - [ ] Perguntas de qualificação estão corretas e na ordem certa
  - [ ] Mensagens de boas-vindas mencionam o nome da empresa
  - [ ] Nenhum token de acesso está hardcoded no JSON ← crítico
- [ ] Salvar o arquivo com o nome: `bot-[nome-empresa].json`

---

## Parte 3 — Itens de Entrega

Estes são os arquivos e informações que devem ser entregues ao cliente.

### 3.1 Arquivos Obrigatórios

- [ ] **`bot-[nome-empresa].json`** — arquivo do bot gerado pelo Configurador
- [ ] **`guia-cliente.md`** (ou PDF gerado a partir dele) — tutorial de ativação
- [ ] **`faq.md`** (ou PDF) — perguntas frequentes

### 3.2 Informações a Enviar

- [ ] **Verify Token** — copiar e enviar separadamente ao cliente (não no JSON)
  - Token: ___________________________

- [ ] **Link da planilha Google Sheets** — modelo para o cliente duplicar
  - Link: ___________________________
  - Confirmar que a aba se chama exatamente `Leads` (com L maiúsculo)

- [ ] **Canal de entrega** confirmado:
  - [ ] Por e-mail
  - [ ] Por WhatsApp
  - [ ] Por link de download (ex: Google Drive, Dropbox)
  - Link de entrega (se aplicável): ___________________________

### 3.3 Itens Opcionais (quando aplicável)

- [ ] Templates de mensagem personalizados (`templates.pt.md`)
- [ ] Blueprint do produto (`blueprint.pt.md`) para o cliente entender o sistema
- [ ] Acesso ao n8n da empresa (se você gerencia o n8n por conta do cliente)

---

## Parte 4 — Pós-Entrega e Acompanhamento

### 4.1 Confirmações do Cliente (acompanhar em até 48h após entrega)

- [ ] Cliente confirmou que recebeu todos os arquivos
- [ ] Cliente conseguiu criar conta no n8n (se não tinha)
- [ ] Cliente importou o arquivo `.json` com sucesso
- [ ] Cliente conectou o Google Sheets ao bot
- [ ] Cliente ativou o workflow no n8n (interruptor verde)
- [ ] Webhook foi verificado no painel Meta ("Verified" apareceu)
- [ ] Campo "messages" foi inscrito (Subscribe) no painel Meta
- [ ] Teste final funcionou: cliente enviou "Oi" e recebeu resposta do bot
- [ ] Lead de teste apareceu na planilha do Google Sheets

### 4.2 Problemas Relatados Durante Onboarding

*(Anotar qualquer problema encontrado pelo cliente durante a ativação)*

| Problema | Solução aplicada | Resolvido |
|---|---|---|
| | | |
| | | |
| | | |

### 4.3 Dados do Token de Acesso (para controle do responsável técnico)

- Tipo de token: `temporário` / `permanente`
- Se temporário: data de expiração: ___________________________
- Lembrete configurado para renovação: `sim` / `não`
- Anotação: tokens temporários expiram em 24h — orientar o cliente a gerar um token permanente via System User antes de colocar em produção.

---

## Parte 5 — Notas de Onboarding

*(Espaço livre para anotar observações sobre o cliente, particularidades do negócio, personalizações feitas, acordos sobre suporte, próximos passos, etc.)*

---

**Entrega concluída:** `sim` / `não`

**Data de conclusão:** ___________________________

**Assinatura do responsável:** ___________________________

---

*Este checklist faz parte do produto WhatsApp Lead Automation. Manter uma cópia arquivada para cada entrega realizada.*
