# Diário de Desenvolvimento — 2026-03-10 (SR-08)

**Sprint:** SR-08 — Produto Completo: Bilíngue, Reposicionamento e Conteúdo

---

## Contexto e Motivação

Três frentes de trabalho nesta sprint:

1. **Reposicionamento do repositório**: GitHub é portfolio técnico para devs/recrutadores, não canal de venda. A documentação anterior misturava audiências.
2. **Bilinguismo**: Todos os documentos precisam existir em português e inglês (Opção A — arquivos separados com sufixo de idioma).
3. **Completar o plano do produto** (`docs/plan.md`): Features 1–6 do blueprint do produto precisavam ser implementadas.

---

## Decisões Arquiteturais

### 1. Separação de pastas por audiência

**Antes:** `docs/` continha tanto documentação técnica quanto guias de cliente/vendedor.

**Depois:**
```
docs/          ← documentação técnica (audiência: devs, recrutadores)
contents/      ← artefatos de entrega ao cliente (audiência: compradores)
package/       ← checklists operacionais (audiência: operador)
```

### 2. Estratégia bilíngue (Opção A — arquivos separados)

- `docs/` → EN é primary (sem sufixo), PT ganha `.pt.md`
- `contents/` → PT é primary (sem sufixo), EN ganha `.en.md`
- `README.md` = EN, `README.pt.md` = PT
- Cada arquivo tem header de navegação: `🇧🇷 Português | 🇺🇸 English`

**Motivação:** GitHub convenciona README.md em inglês. Docs técnicas têm audiência internacional. Conteúdo de entrega é prioritariamente para mercado brasileiro.

### 3. Eliminação do papel "vendedor"

O `guia-vendedor.md` foi renomeado para `docs/operational.pt.md` / `docs/operational.md`. O papel de "vendedor" não existe como entidade separada — é o próprio desenvolvedor/operador.

### 4. README reposicionado como portfolio técnico

O README anterior tinha "COMECE AQUI: sou cliente / sou vendedor". O novo tem:
- O que o projeto faz (técnico)
- Arquitetura em diagrama
- Decisões técnicas relevantes (OAuth2, credenciais embutidas, Form Trigger, Verify Token)
- Stack
- Como rodar localmente

### 5. Follow-up workflow

Criado `workflows/examples/follow_up_bot.json` — workflow independente para envio de mensagens de acompanhamento. Acionado via webhook POST com `{ phone, message, company }`. Não depende do workflow principal.

---

## Artefatos Criados / Modificados

| Arquivo | Ação |
|---|---|
| `README.md` | Reescrito como portfolio técnico (EN) |
| `README.pt.md` | Criado (PT) |
| `docs/architecture.md` | Traduzido para EN (primary) |
| `docs/architecture.pt.md` | Criado (PT) |
| `docs/workflow-logic.md` | Traduzido para EN (primary) |
| `docs/workflow-logic.pt.md` | Criado (PT) |
| `docs/product-overview.md` | Traduzido para EN + modelo de produto atualizado |
| `docs/product-overview.pt.md` | Criado (PT) |
| `docs/operational.md` | Criado (EN) |
| `docs/operational.pt.md` | Renomeado de `guia-vendedor.md` (PT) |
| `docs/guia-passo-a-passo.md` | Deletado (conteúdo desatualizado) |
| `contents/guia-cliente.md` | Movido de `docs/` (PT primary) |
| `contents/client-guide.en.md` | Criado (EN) |
| `contents/faq.md` | Movido de `docs/` (PT primary) |
| `contents/faq.en.md` | Criado (EN) |
| `contents/blueprint.pt.md` | Criado — guia educacional completo (PT) |
| `contents/blueprint.en.md` | Criado — guia educacional completo (EN) |
| `contents/templates.pt.md` | Criado — 25+ templates de mensagem (PT) |
| `contents/templates.en.md` | Criado — 25+ templates de mensagem (EN) |
| `examples/webhook-payload.json` | Criado — payload real da WhatsApp API |
| `examples/api-integration.md` | Criado — exemplos de integração com API |
| `package/delivery-checklist.pt.md` | Criado — checklist de entrega (PT) |
| `package/delivery-checklist.en.md` | Criado — checklist de entrega (EN) |
| `workflows/examples/follow_up_bot.json` | Criado — workflow de follow-up |

---

## Problemas em Aberto (SR-09)

- **Preço do produto**: não definido no repositório — é decisão de negócio externa ao código
- **PDF do produto**: o blueprint (`contents/blueprint.pt.md`) está pronto para exportação PDF via qualquer ferramenta Markdown → PDF (Pandoc, Typora, etc.) — não automatizado
- **api-integration.pt.md**: versão PT do guia de integração não criada nesta sprint
- **follow_up_bot.json**: usa `$env` vars para token/phone ID (diferente do bot principal que embute as credenciais) — considerar Configurador separado para follow-up em SR-09
