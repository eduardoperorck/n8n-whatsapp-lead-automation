# Product Overview — n8n WhatsApp Lead Automation

## O Problema

Pequenas empresas perdem leads todos os dias porque não conseguem responder mensagens de WhatsApp rapidamente fora do horário comercial, ou porque o processo de qualificação é manual e inconsistente.

## A Solução

Um sistema de automação WhatsApp plug-and-play que:

1. **Responde automaticamente** a qualquer mensagem recebida, 24/7
2. **Qualifica o lead** com perguntas estruturadas (nome, interesse, orçamento, prazo)
3. **Armazena os dados** em uma planilha Google Sheets organizada
4. **Notifica o vendedor humano** quando o lead está qualificado e pronto para atendimento

## Público-Alvo

| Vertical | Exemplo |
|---|---|
| Clínicas e consultórios | Agendamento de consultas, triagem inicial |
| Restaurantes | Reservas, pedidos de delivery |
| Prestadores de serviço | Orçamentos, agendamento de visitas |
| Escolas e cursos | Matrículas, informações de turmas |

## Modelo de Produto

O sistema é vendido como **template de automação**:

1. Cliente compra o produto (acesso ao template + gerador)
2. Cliente preenche um formulário de configuração (nome da empresa, serviços, mensagem de boas-vindas)
3. O sistema gera automaticamente o workflow n8n personalizado
4. Script de deploy importa o workflow para o n8n do cliente
5. Cliente conecta suas credenciais (WhatsApp API, Google Sheets)

## Diferenciais

- **Zero código** para o usuário final
- **Customizável** por empresa via formulário
- **Resiliente**: fallbacks para mensagens inválidas, áudios, imagens
- **Escalável**: mesmo template serve múltiplos clientes
- **Auditável**: todos os leads ficam registrados no Google Sheets

## Fluxo de Uso

```
Cliente compra o produto
        ↓
Preenche formulário de configuração
        ↓
generateWorkflow(config) é executado
        ↓
Workflow JSON personalizado é gerado
        ↓
workflowValidator.js valida o JSON
        ↓
importWorkflow.sh importa para o n8n
        ↓
Cliente ativa o workflow no n8n
        ↓
Sistema em produção — leads sendo capturados
```
