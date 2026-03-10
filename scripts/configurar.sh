#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# configurar.sh
#
# Assistente interativo de configuração em português.
# Faz perguntas simples e gera o .env + o workflow automaticamente.
#
# Uso:
#   bash scripts/configurar.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── Cores ─────────────────────────────────────────────────────────────────────
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

# ── Funções utilitárias ────────────────────────────────────────────────────────
titulo()   { echo -e "\n${CYAN}${BOLD}━━━ $* ━━━${NC}\n"; }
pergunta() { echo -e "${BLUE}?${NC} ${BOLD}$1${NC}"; }
info()     { echo -e "  ${YELLOW}ℹ${NC}  $1"; }
ok()       { echo -e "  ${GREEN}✓${NC}  $1"; }
erro()     { echo -e "  ${RED}✗${NC}  $1" >&2; }
linha()    { echo -e "${CYAN}──────────────────────────────────────────────────${NC}"; }

ler_valor() {
  local prompt="$1"
  local padrao="${2:-}"
  local valor=""
  if [ -n "$padrao" ]; then
    read -r -p "  → $prompt [$padrao]: " valor
    echo "${valor:-$padrao}"
  else
    while [ -z "$valor" ]; do
      read -r -p "  → $prompt: " valor
      if [ -z "$valor" ]; then
        erro "Este campo é obrigatório."
      fi
    done
    echo "$valor"
  fi
}

# ── Cabeçalho ─────────────────────────────────────────────────────────────────
clear
echo ""
echo -e "${CYAN}${BOLD}"
echo "  ╔═══════════════════════════════════════════════════╗"
echo "  ║     WhatsApp Lead Automation — Configuração       ║"
echo "  ║          Assistente Interativo em Português        ║"
echo "  ╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"
echo "  Olá! Vou ajudar você a configurar sua automação."
echo "  Responda as perguntas abaixo. Você pode alterar tudo"
echo "  depois editando o arquivo .env na pasta do projeto."
echo ""
linha

# ── BLOCO 1: Dados da empresa ──────────────────────────────────────────────────
titulo "PARTE 1 de 4 — Sua Empresa"

pergunta "Qual é o nome da sua empresa?"
COMPANY_NAME=$(ler_valor "Nome da empresa")

pergunta "Qual a mensagem de boas-vindas que o bot vai enviar?"
info "Exemplo: Olá! Bem-vindo à Clínica Saúde Total. Como podemos ajudar?"
WELCOME_MESSAGE=$(ler_valor "Mensagem de boas-vindas" "Olá! Bem-vindo(a) à $COMPANY_NAME. Como posso ajudar?")

pergunta "Quais são os seus serviços? (separe por vírgula)"
info "Exemplo: Consulta,Pediatria,Ginecologia ou Reserva de Mesa,Delivery"
SERVICES=$(ler_valor "Seus serviços" "Serviço A,Serviço B")

linha

# ── BLOCO 2: WhatsApp ──────────────────────────────────────────────────────────
titulo "PARTE 2 de 4 — WhatsApp Business API"
info "Você encontra essas informações em: developers.facebook.com > Seu App > WhatsApp > API Setup"
echo ""

pergunta "Qual é o seu Phone Number ID?"
info "É um número longo como: 1234567890123456"
WHATSAPP_PHONE_NUMBER_ID=$(ler_valor "Phone Number ID")

pergunta "Qual é o seu Access Token?"
info "Começa com EAAG... (você encontra em API Setup no painel Meta)"
WHATSAPP_ACCESS_TOKEN=$(ler_valor "Access Token")

pergunta "Crie um Verify Token (pode ser qualquer texto sem espaços)"
info "Exemplo: minha-empresa-token-2024  (você vai usar esse mesmo na configuração do Webhook)"
WHATSAPP_VERIFY_TOKEN=$(ler_valor "Verify Token" "$(echo "$COMPANY_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')-webhook-token")

linha

# ── BLOCO 3: Google Sheets ─────────────────────────────────────────────────────
titulo "PARTE 3 de 4 — Google Sheets (Planilha dos Leads)"
info "Você encontra o ID da planilha na URL do Google Sheets:"
info "https://docs.google.com/spreadsheets/d/[ID_AQUI]/edit"
echo ""

pergunta "Qual é o ID da sua planilha Google Sheets?"
GOOGLE_SHEETS_SPREADSHEET_ID=$(ler_valor "ID da planilha")

pergunta "Qual é o nome da aba onde os leads vão ser salvos?"
GOOGLE_SHEETS_SHEET_NAME=$(ler_valor "Nome da aba" "Leads")

linha

# ── BLOCO 4: n8n ──────────────────────────────────────────────────────────────
titulo "PARTE 4 de 4 — n8n (Plataforma de Automação)"
info "Se estiver usando n8n Cloud, a URL será algo como: https://seu-nome.app.n8n.cloud"
info "Se estiver rodando localmente, use: http://localhost:5678"
echo ""

pergunta "Qual é a URL do seu n8n?"
N8N_API_URL=$(ler_valor "URL do n8n" "http://localhost:5678")

pergunta "Qual é a sua API Key do n8n?"
info "Você encontra em: n8n > Settings > API > Create an API key"
N8N_API_KEY=$(ler_valor "API Key do n8n")

pergunta "URL de notificação quando chegar um lead (opcional — Slack, webhook, etc.)"
info "Deixe em branco para pular"
read -r -p "  → URL de notificação [deixe vazio para pular]: " AGENT_NOTIFICATION_URL
AGENT_NOTIFICATION_URL="${AGENT_NOTIFICATION_URL:-https://hooks.slack.com/services/SEU/WEBHOOK/AQUI}"

linha

# ── Confirmação ────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}Resumo da configuração:${NC}"
echo ""
echo "  Empresa:       $COMPANY_NAME"
echo "  Serviços:      $SERVICES"
echo "  n8n URL:       $N8N_API_URL"
echo "  Planilha:      $GOOGLE_SHEETS_SPREADSHEET_ID"
echo ""

read -r -p "$(echo -e "  ${BLUE}?${NC} Está tudo certo? Posso salvar e gerar o workflow? [S/n]: ")" CONFIRMA
CONFIRMA="${CONFIRMA:-S}"

if [[ "$CONFIRMA" =~ ^[Nn] ]]; then
  echo ""
  echo "  Ok! Execute o script novamente para recomeçar."
  exit 0
fi

# ── Salva o .env ──────────────────────────────────────────────────────────────
titulo "Salvando configurações"

cat > "$ENV_FILE" << EOF
# ─────────────────────────────────────────────────────────────────────────────
# Arquivo de configuração gerado pelo configurar.sh em $(date '+%d/%m/%Y %H:%M')
# NUNCA envie este arquivo para o GitHub ou compartilhe com outras pessoas.
# ─────────────────────────────────────────────────────────────────────────────

# ── n8n ──────────────────────────────────────────────────────────────────────
N8N_API_URL=$N8N_API_URL
N8N_API_KEY=$N8N_API_KEY

# ── WhatsApp Business API ────────────────────────────────────────────────────
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=$WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_ACCESS_TOKEN=$WHATSAPP_ACCESS_TOKEN
WHATSAPP_VERIFY_TOKEN=$WHATSAPP_VERIFY_TOKEN

# ── Google Sheets ────────────────────────────────────────────────────────────
GOOGLE_SHEETS_SPREADSHEET_ID=$GOOGLE_SHEETS_SPREADSHEET_ID
GOOGLE_SHEETS_SHEET_NAME=$GOOGLE_SHEETS_SHEET_NAME

# ── Notificação do Agente ────────────────────────────────────────────────────
AGENT_NOTIFICATION_URL=$AGENT_NOTIFICATION_URL

# ── Dados da Empresa ─────────────────────────────────────────────────────────
COMPANY_NAME=$COMPANY_NAME
WELCOME_MESSAGE=$WELCOME_MESSAGE
SERVICES=$SERVICES
EOF

ok "Arquivo .env salvo com sucesso!"

# ── Instala dependências ───────────────────────────────────────────────────────
titulo "Instalando dependências"

if ! command -v node &> /dev/null; then
  erro "Node.js não encontrado. Instale em: nodejs.org"
  exit 1
fi

cd "$ROOT_DIR"
if ! npm install --silent 2>&1; then
  erro "Falha ao instalar dependências. Verifique sua conexão com a internet."
  exit 1
fi
ok "Dependências instaladas!"

# ── Gera o workflow ────────────────────────────────────────────────────────────
titulo "Gerando workflow personalizado"

if node generator/generateWorkflow.js \
  --company "$COMPANY_NAME" \
  --welcome "$WELCOME_MESSAGE" \
  --services "$SERVICES"; then
  ok "Workflow gerado com sucesso!"
else
  erro "Falha ao gerar o workflow."
  exit 1
fi

# ── Deploy para o n8n ──────────────────────────────────────────────────────────
titulo "Importando workflow para o n8n"

if bash scripts/importWorkflow.sh; then
  ok "Workflow importado para o n8n!"
else
  erro "Falha ao importar para o n8n. Verifique a URL e a API Key do n8n."
  echo ""
  info "Você pode importar manualmente:"
  info "1. Acesse seu n8n"
  info "2. Clique em 'Import from file'"
  info "3. Selecione o arquivo em: workflows/production/"
  exit 1
fi

# ── Conclusão ─────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}"
echo "  ╔═══════════════════════════════════════════════════╗"
echo "  ║           Configuração concluída!                  ║"
echo "  ╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"
echo "  Próximos passos:"
echo ""
echo -e "  ${BOLD}1.${NC} Acesse seu n8n: $N8N_API_URL"
echo -e "  ${BOLD}2.${NC} Encontre o workflow '${COMPANY_NAME}' e ative-o (toggle verde)"
echo -e "  ${BOLD}3.${NC} Configure as credenciais do Google Sheets no n8n"
echo -e "  ${BOLD}4.${NC} No painel Meta, configure o Webhook com:"
echo "     URL:          ${N8N_API_URL}/webhook/whatsapp"
echo "     Verify Token: ${WHATSAPP_VERIFY_TOKEN}"
echo -e "  ${BOLD}5.${NC} Teste enviando 'Oi' para o seu número do WhatsApp"
echo ""
echo -e "  Dúvidas? Leia: ${CYAN}docs/faq.md${NC}"
echo ""
