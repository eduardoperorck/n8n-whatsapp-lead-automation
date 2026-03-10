#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# importWorkflow.sh
#
# Importa um workflow JSON para o n8n via API REST.
# Verifica se o workflow já existe (por nome) antes de importar,
# evitando duplicatas (operação idempotente).
#
# Uso:
#   bash scripts/importWorkflow.sh [--file <caminho>] [--activate]
#
# Variáveis de ambiente obrigatórias:
#   N8N_API_URL   — ex: http://localhost:5678
#   N8N_API_KEY   — chave da API do n8n (Settings > API > Create API Key)
#
# Variáveis opcionais:
#   WORKFLOW_FILE — caminho para o .json (padrão: último gerado em production/)
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── Cores ─────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()    { echo -e "${BLUE}[import]${NC} $*"; }
ok()     { echo -e "${GREEN}[import] ✅${NC} $*"; }
warn()   { echo -e "${YELLOW}[import] ⚠️ ${NC} $*"; }
error()  { echo -e "${RED}[import] ❌${NC} $*" >&2; }

# ── Carrega .env se existir ───────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ -f "$ROOT_DIR/.env" ]; then
  log "Carregando variáveis de $ROOT_DIR/.env"
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

# ── Argumentos ────────────────────────────────────────────────────────────────
WORKFLOW_FILE="${WORKFLOW_FILE:-}"
ACTIVATE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --file)      WORKFLOW_FILE="$2"; shift 2 ;;
    --activate)  ACTIVATE=true;      shift   ;;
    *)           error "Argumento desconhecido: $1"; exit 1 ;;
  esac
done

# ── Resolve arquivo de workflow ───────────────────────────────────────────────
if [ -z "$WORKFLOW_FILE" ]; then
  # Usa o arquivo mais recente em production/
  WORKFLOW_FILE=$(ls -t "$ROOT_DIR/workflows/production/"*.json 2>/dev/null | head -1 || true)
  if [ -z "$WORKFLOW_FILE" ]; then
    error "Nenhum workflow encontrado em workflows/production/. Execute primeiro: node generator/generateWorkflow.js"
    exit 1
  fi
  log "Usando workflow mais recente: $WORKFLOW_FILE"
fi

if [ ! -f "$WORKFLOW_FILE" ]; then
  error "Arquivo não encontrado: $WORKFLOW_FILE"
  exit 1
fi

# ── Validação de variáveis obrigatórias ───────────────────────────────────────
if [ -z "${N8N_API_URL:-}" ]; then
  error "Variável N8N_API_URL não definida. Configure no .env ou exporte antes de executar."
  exit 1
fi

if [ -z "${N8N_API_KEY:-}" ]; then
  error "Variável N8N_API_KEY não definida. Configure no .env ou exporte antes de executar."
  exit 1
fi

# Remove trailing slash da URL
N8N_API_URL="${N8N_API_URL%/}"

# ── Verifica dependências ─────────────────────────────────────────────────────
for cmd in curl jq; do
  if ! command -v "$cmd" &>/dev/null; then
    error "Dependência não encontrada: $cmd. Instale-a e tente novamente."
    exit 1
  fi
done

# ── Lê o workflow ─────────────────────────────────────────────────────────────
log "Lendo workflow: $WORKFLOW_FILE"
WORKFLOW_JSON=$(cat "$WORKFLOW_FILE")
WORKFLOW_NAME=$(echo "$WORKFLOW_JSON" | jq -r '.name')

log "Workflow: $WORKFLOW_NAME"

# ── Verifica duplicata por nome ───────────────────────────────────────────────
log "Verificando se workflow já existe no n8n..."

EXISTING=$(curl \
  --silent \
  --max-time 15 \
  --header "X-N8N-API-KEY: $N8N_API_KEY" \
  --header "Content-Type: application/json" \
  "$N8N_API_URL/api/v1/workflows?limit=100" 2>/dev/null || echo '{"data":[]}')

EXISTING_ID=$(echo "$EXISTING" | jq -r --arg name "$WORKFLOW_NAME" \
  '.data[] | select(.name == $name) | .id' 2>/dev/null | head -1 || true)

# ── Import ou Update ──────────────────────────────────────────────────────────
if [ -n "$EXISTING_ID" ]; then
  warn "Workflow '$WORKFLOW_NAME' já existe (ID: $EXISTING_ID). Atualizando..."

  RESPONSE=$(curl \
    --silent \
    --max-time 30 \
    --request PUT \
    --header "X-N8N-API-KEY: $N8N_API_KEY" \
    --header "Content-Type: application/json" \
    --data "$WORKFLOW_JSON" \
    "$N8N_API_URL/api/v1/workflows/$EXISTING_ID")

  RESULT_ID=$(echo "$RESPONSE" | jq -r '.id // empty' 2>/dev/null || true)

  if [ -z "$RESULT_ID" ]; then
    error "Falha ao atualizar workflow. Resposta da API:"
    echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
    exit 1
  fi

  ok "Workflow atualizado com sucesso! ID: $RESULT_ID"

else
  log "Importando novo workflow..."

  RESPONSE=$(curl \
    --silent \
    --max-time 30 \
    --request POST \
    --header "X-N8N-API-KEY: $N8N_API_KEY" \
    --header "Content-Type: application/json" \
    --data "$WORKFLOW_JSON" \
    "$N8N_API_URL/api/v1/workflows")

  RESULT_ID=$(echo "$RESPONSE" | jq -r '.id // empty' 2>/dev/null || true)

  if [ -z "$RESULT_ID" ]; then
    error "Falha ao importar workflow. Resposta da API:"
    echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
    exit 1
  fi

  ok "Workflow importado com sucesso! ID: $RESULT_ID"
fi

# ── Ativa o workflow se solicitado ────────────────────────────────────────────
if [ "$ACTIVATE" = true ]; then
  log "Ativando workflow..."

  ACT_RESPONSE=$(curl \
    --silent \
    --max-time 15 \
    --request PATCH \
    --header "X-N8N-API-KEY: $N8N_API_KEY" \
    --header "Content-Type: application/json" \
    --data '{"active": true}' \
    "$N8N_API_URL/api/v1/workflows/$RESULT_ID")

  if echo "$ACT_RESPONSE" | jq -e '.active == true' &>/dev/null; then
    ok "Workflow ativado!"
  else
    warn "Não foi possível ativar o workflow automaticamente. Ative manualmente no n8n."
  fi
fi

echo ""
ok "Import concluído."
log "Acesse: $N8N_API_URL/workflow/$RESULT_ID"
