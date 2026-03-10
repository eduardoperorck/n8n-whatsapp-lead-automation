> 🇧🇷 Português | [🇺🇸 English](product-overview.md)

# Visão do Produto — n8n WhatsApp Lead Automation

## O Problema

Pequenas empresas perdem leads todos os dias porque não conseguem responder mensagens de WhatsApp rapidamente fora do horário comercial, ou porque o processo de qualificação é manual e inconsistente.

## A Solução

Um sistema de automação WhatsApp plug-and-play que:

1. **Responde automaticamente** a qualquer mensagem recebida, 24/7
2. **Qualifica o lead** com perguntas estruturadas (nome, interesse, orçamento, prazo)
3. **Armazena os dados** em uma planilha Google Sheets organizada
4. **Notifica o responsável** quando o lead está qualificado e pronto para atendimento

## Público-Alvo

| Vertical | Exemplo |
|---|---|
| Clínicas e consultórios | Agendamento de consultas, triagem inicial |
| Restaurantes | Reservas, pedidos de delivery |
| Prestadores de serviço | Orçamentos, agendamento de visitas |
| Escolas e cursos | Matrículas, informações de turmas |

## Modelo de Produto

O sistema é vendido como **produto digital low-ticket**:

1. Operador coleta as informações do cliente (empresa, serviços, credenciais WhatsApp)
2. Usa o workflow **Configurador** (`workflows/setup/configurador.json`) para gerar o JSON personalizado
3. Entrega ao cliente: arquivo `.json`, Verify Token e guia de instalação
4. Cliente importa o JSON no n8n, conecta o Google Sheets via OAuth2 e ativa

O cliente não precisa de terminal, Node.js, variáveis de ambiente ou Google Cloud Console.

## Modelo de Precificação

Vendido como produto digital low-ticket de pagamento único. Posicionamento sugerido:
- **Faixa de preço:** entrada acessível para pequenas empresas
- **Entrega:** instantânea — cliente recebe o pacote logo após o pagamento
- **Upsell:** personalização adicional, novos verticais, suporte a renovação de token

O preço exato é definido externamente a este repositório.

## Diferenciais

- **Zero código** para o usuário final
- **Credenciais embutidas**: Phone Number ID e Access Token já vêm no JSON gerado
- **Google OAuth2**: conexão com planilha via "Sign in with Google" — sem Service Account
- **Customizável** por empresa via formulário no Configurador
- **Resiliente**: fallbacks para mensagens inválidas, áudios, imagens
- **Escalável**: mesmo template serve múltiplos clientes

## Fluxo de Uso

```
Operador preenche formulário no Configurador (n8n)
        ↓
Workflow JSON personalizado é gerado com credenciais embutidas
        ↓
JSON + Verify Token + guia são entregues ao cliente
        ↓
Cliente importa o JSON no n8n
        ↓
Cliente conecta Google Sheets (Sign in with Google)
        ↓
Cliente ativa o workflow e cola o webhook no painel Meta
        ↓
Sistema em produção — leads sendo capturados
```
