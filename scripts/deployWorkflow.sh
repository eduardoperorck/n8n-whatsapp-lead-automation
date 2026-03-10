#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deployWorkflow.sh
#
# Pipeline completo de deploy:
#   1. Gera o workflow a partir da configuração
#   2. Valida a segurança e estrutura do JSON gerado
#   3. Importa para o n8n via API
#   4. (Opcional) Ativa o workflow
#
# Uso:
#   bash scripts/deployWorkflow.sh \
#     --company "Nome da Empresa" \
#     --welcome "Mensagem de boas-vindas" \
#     --services "Serviço A,Serviço B" \
#     [--activate]
#
# Ou via .env (COMPANY_NAME, WELCOME_MESSAGE, SERVICES)
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── Cores ─────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log()    { echo -e "${BLUE}[deploy]${NC} $*"; }
step()   { echo -e "\n${CYAN}══ $* ${NC}"; }
ok()     { echo -e "${GREEN}[deploy] ✅${NC} $*"; }
warn()   { echo -e "${YELLOW}[deploy] ⚠️ ${NC} $*"; }
error()  { echo -e "${RED}[deploy] ❌${NC} $*" >&2; }

# ── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Carrega .env ──────────────────────────────────────────────────────────────
if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

# ── Argumentos ────────────────────────────────────────────────────────────────
COMPANY="${COMPANY_NAME:-}"
WELCOME="${WELCOME_MESSAGE:-}"
SERVICES="${SERVICES:-}"
ACTIVATE=false
OUTPUT_FILE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --company)  COMPANY="$2";  shift 2 ;;
    --welcome)  WELCOME="$2";  shift 2 ;;
    --services) SERVICES="$2"; shift 2 ;;
    --activate) ACTIVATE=true; shift   ;;
    --output)   OUTPUT_FILE="$2"; shift 2 ;;
    --help)
      echo "Uso: $0 --company <nome> --welcome <msg> --services <s1,s2> [--activate]"
      exit 0 ;;
    *) error "Argumento desconhecido: $1"; exit 1 ;;
  esac
done

# ── Valida argumentos obrigatórios ────────────────────────────────────────────
MISSING=()
[ -z "$COMPANY"  ] && MISSING+=("--company (ou COMPANY_NAME)")
[ -z "$WELCOME"  ] && MISSING+=("--welcome (ou WELCOME_MESSAGE)")
[ -z "$SERVICES" ] && MISSING+=("--services (ou SERVICES)")

if [ ${#MISSING[@]} -gt 0 ]; then
  error "Argumentos obrigatórios ausentes:"
  for m in "${MISSING[@]}"; do error "  $m"; done
  exit 1
fi

# (A verificação explícita do Node.js foi removida por problemas de compatibilidade no Git Bash no Windows. 
# Se o Node.js não estiver instalado, o script falhará no Passo 1).

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   n8n WhatsApp Lead Automation — Deploy Pipeline  ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
log "Empresa:  $COMPANY"
log "Serviços: $SERVICES"
echo ""

# ── STEP 1: Gerar ─────────────────────────────────────────────────────────────
step "STEP 1/3 — Gerando workflow"

GENERATE_ARGS=(
  "--company" "$COMPANY"
  "--welcome" "$WELCOME"
  "--services" "$SERVICES"
)

if [ -n "$OUTPUT_FILE" ]; then
  GENERATE_ARGS+=("--output" "$OUTPUT_FILE")
fi

if ! node "$ROOT_DIR/generator/generateWorkflow.js" "${GENERATE_ARGS[@]}"; then
  error "Falha na geração do workflow."
  exit 1
fi

ok "Workflow gerado com sucesso."

# ── STEP 2: Validar ───────────────────────────────────────────────────────────
step "STEP 2/3 — Validando workflow"

# Encontra o arquivo gerado mais recente
if [ -n "$OUTPUT_FILE" ]; then
  WORKFLOW_FILE="$OUTPUT_FILE"
else
  WORKFLOW_FILE=$(ls -t "$ROOT_DIR/workflows/production/"*.json 2>/dev/null | head -1 || true)
fi

if [ -z "$WORKFLOW_FILE" ] || [ ! -f "$WORKFLOW_FILE" ]; then
  error "Arquivo de workflow não encontrado após geração."
  exit 1
fi

if ! node "$ROOT_DIR/generator/workflowValidator.js" "$WORKFLOW_FILE"; then
  error "Workflow falhou na validação. Corrija os erros antes de importar."
  exit 1
fi

ok "Validação passou."

# ── STEP 3: Importar ──────────────────────────────────────────────────────────
step "STEP 3/3 — Importando para o n8n"

IMPORT_ARGS=("--file" "$WORKFLOW_FILE")
if [ "$ACTIVATE" = true ]; then
  IMPORT_ARGS+=("--activate")
fi

if ! bash "$SCRIPT_DIR/importWorkflow.sh" "${IMPORT_ARGS[@]}"; then
  error "Falha no import para o n8n."
  exit 1
fi

# ── Conclusão ─────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            Deploy concluído com sucesso!          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
log "Próximos passos:"
log "  1. Acesse o n8n e configure as credenciais (WhatsApp API, Google Sheets)"
log "  2. Ative o workflow manualmente se não usou --activate"
log "  3. Teste enviando uma mensagem de WhatsApp para o número configurado"
echo ""
