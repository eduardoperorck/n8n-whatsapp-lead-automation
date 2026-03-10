# WhatsApp Lead Automation

> Automatize o atendimento do seu WhatsApp e capture leads 24h por dia — sem precisar saber programar.

---

## COMECE AQUI

### Sou cliente (comprei o produto e recebi um arquivo JSON)

Siga o guia de instalação de 20 minutos — sem terminal, sem programação:

**[docs/guia-cliente.md](docs/guia-cliente.md)**

---

### Sou vendedor (quero gerar bots para meus clientes)

1. Importe o Configurador no seu n8n: `workflows/setup/configurador.json`
2. Ative o workflow e acesse o formulário
3. Preencha os dados do cliente → copie o JSON gerado → entregue ao cliente

Guia completo do vendedor: **[docs/guia-vendedor.md](docs/guia-vendedor.md)

---

### Ficou com dúvidas?

[docs/faq.md](docs/faq.md)

---

## O que esse produto faz

Quando um cliente manda mensagem no seu WhatsApp, o bot:

1. Responde automaticamente — mesmo às 3 da manhã
2. Faz perguntas para entender o que o cliente quer
3. Salva os dados do cliente na sua planilha Google Sheets
4. Te avisa que chegou um lead qualificado

Você só entra em contato com leads que já responderam suas perguntas e estão prontos para fechar.

---

## Para quem é esse produto

| Tipo de negócio | Exemplo de uso |
|---|---|
| Clínicas e consultórios | Agenda consultas e faz triagem inicial |
| Restaurantes | Recebe reservas e pedidos de delivery |
| Prestadores de serviço | Coleta informações para orçamento |
| Escolas e cursos | Capta alunos e responde dúvidas |

---

## Como funciona por dentro

```
Cliente manda mensagem no WhatsApp
           ↓
    Bot responde automaticamente
           ↓
    Faz 5 perguntas de qualificação
           ↓
    Salva tudo no Google Sheets
           ↓
    Te notifica que chegou um lead
```

---

## O que você vai precisar configurar

Você vai criar contas gratuitas em 3 serviços:

| Serviço | Para que serve |
|---|---|
| **n8n** | Plataforma onde a automação roda |
| **Meta for Developers** | Para conectar ao WhatsApp |
| **Google Sheets** | Para guardar os leads |

O guia completo explica cada passo: [docs/guia-passo-a-passo.md](docs/guia-passo-a-passo.md)

---

## Estrutura do projeto

```
n8n-whatsapp-lead-automation/
├── docs/
│   ├── guia-passo-a-passo.md   ← COMECE AQUI (guia para não-técnicos)
│   ├── faq.md                  ← Perguntas frequentes e soluções
│   ├── architecture.md         ← Documentação técnica
│   ├── workflow-logic.md       ← Como o bot funciona internamente
│   └── product-overview.md     ← Visão do produto
├── workflows/
│   ├── template/               ← Template base do workflow
│   ├── examples/               ← Exemplos prontos (clínica, restaurante)
│   └── production/             ← Seu workflow gerado fica aqui
├── generator/                  ← Motor de geração do workflow
├── scripts/
│   ├── configurar.sh           ← Assistente interativo de configuração
│   ├── deployWorkflow.sh       ← Deploy completo via linha de comando
│   └── importWorkflow.sh       ← Importa o workflow para o n8n
├── tests/                      ← Testes automatizados
└── .env.example                ← Modelo de configuração (copie para .env)
```

---

## Instalação rápida (para desenvolvedores)

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/n8n-whatsapp-lead-automation
cd n8n-whatsapp-lead-automation

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# 3. Instale dependências
npm install

# 4. Gere e faça deploy do workflow
bash scripts/deployWorkflow.sh \
  --company "Minha Empresa" \
  --welcome "Bem-vindo!" \
  --services "Serviço A,Serviço B"
```

Ou use o assistente interativo que faz tudo isso com perguntas simples:

```bash
bash scripts/configurar.sh
```

---

## Exemplos prontos

Dois workflows de exemplo já estão incluídos:

| Exemplo | Arquivo |
|---|---|
| Clínica médica | `workflows/examples/clinic_bot.json` |
| Restaurante | `workflows/examples/restaurant_bot.json` |

Você pode importar qualquer um diretamente no n8n para ver como funciona antes de personalizar.

---

## Segurança

- Nenhuma credencial hardcoded — tudo via variáveis de ambiente
- Validador automático bloqueia workflows com segredos expostos
- Webhook com verificação de token obrigatória

---

## Documentação completa

| Documento | Conteúdo |
|---|---|
| [Guia Passo a Passo](docs/guia-passo-a-passo.md) | Setup completo em português simples |
| [FAQ](docs/faq.md) | Problemas comuns e soluções |
| [Visão do Produto](docs/product-overview.md) | O que o sistema faz e para quem |
| [Arquitetura](docs/architecture.md) | Documentação técnica dos nodes |
| [Lógica do Workflow](docs/workflow-logic.md) | Máquina de estados e fluxo de dados |

---

## Licença

MIT — veja [LICENSE](LICENSE) para detalhes.
