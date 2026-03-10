# Perguntas Frequentes (FAQ)
## WhatsApp Lead Automation

---

### Instalação e Configuração

**O bot não respondeu quando enviei "Oi". O que fazer?**

Verifique nesta ordem:
1. O workflow está ativo no n8n? (toggle verde)
2. O Webhook do WhatsApp está configurado com a URL correta do n8n?
3. O Access Token não expirou? (tokens temporários duram 24h)
4. No painel do Meta, vá em **WhatsApp > Configuration** e clique em **"Test"** para ver se o webhook responde

---

**O token de acesso do WhatsApp expirou. O que fazer?** {#token-permanente}

O token temporário que o Meta fornece expira em 24 horas. Para usar em produção, você precisa de um token permanente:

1. No painel Meta, vá em **Business Settings > System Users**
2. Crie um novo System User do tipo **"Admin"**
3. Clique em **"Add Assets"** e adicione o seu app de WhatsApp
4. Clique em **"Generate New Token"**
5. Selecione o app e as permissões: `whatsapp_business_messaging`, `whatsapp_business_management`
6. Copie o token gerado e atualize no arquivo `.env` e nas credenciais do n8n
7. Esse token não expira automaticamente

---

**Apareceu um erro "Cannot find module" ao rodar o Node.js. O que fazer?**

Execute `npm install` na pasta do projeto antes de rodar qualquer script:
```
npm install
```

---

**O Google Sheets não está recebendo os dados. O que verificar?**

1. O e-mail da Service Account foi adicionado como Editor na planilha?
2. O ID da planilha no `.env` está correto? (é o código na URL, não o nome)
3. A aba da planilha se chama exatamente `Leads`? (com L maiúsculo)
4. A Google Sheets API está ativada no Google Cloud Console?
5. No n8n, as credenciais do Google Sheets estão configuradas?

---

**O n8n não está encontrando o arquivo de workflow para importar.**

Certifique-se de ter rodado o gerador primeiro:
```
node generator/generateWorkflow.js
```
O arquivo gerado fica em `workflows/production/`. Verifique se a pasta existe.

---

### Uso e Funcionamento

**O bot responde mensagens, mas o lead não aparece na planilha.**

Isso acontece quando a conversa não chegou até o fim (o cliente não respondeu todas as 5 perguntas). O lead só é salvo quando completa o fluxo. Se o cliente parar no meio, aguarde 30 minutos — a sessão expira e na próxima mensagem o bot reinicia do zero.

---

**O bot para de responder depois de um tempo.**

A sessão do usuário expira após 30 minutos sem atividade. Isso é normal — é uma medida de segurança para evitar conversas travadas. Quando o usuário mandar outra mensagem, o bot reinicia do zero.

---

**Posso mudar as perguntas que o bot faz?**

Sim! Você pode editar diretamente no n8n sem precisar gerar um novo workflow:
1. No n8n, abra o workflow
2. Clique duas vezes no node **"Lead Qualification"**
3. Edite o código: encontre o array `QUESTIONS` e altere as perguntas
4. Salve e pronto

---

**Posso adicionar ou remover perguntas?**

Sim, mas exige editar o código no node Lead Qualification. Adicione ou remova objetos do array `QUESTIONS` mantendo o formato:
```javascript
{ key: 'nome_do_campo', state: 'Q6', question: 'Sua pergunta aqui?' }
```
Lembre-se de também adicionar a coluna correspondente na planilha do Google Sheets.

---

**Como o cliente pode recomeçar a conversa do zero?**

O cliente pode digitar qualquer palavra de saudação: `oi`, `olá`, `menu`, `início`, `começar`. O bot vai reiniciar a conversa.

---

**O bot recebe fotos ou áudios?**

Não — o bot responde que só processa mensagens de texto. Esse comportamento é intencional. Para alterar quais tipos de mensagem aceitar, edite o node **"Message Parser"**.

---

**Posso usar um número de celular pessoal no WhatsApp Business API?**

Não. A API do WhatsApp Business exige um número dedicado — não pode ser um número que você já usa no WhatsApp pessoal ou comum. Você pode usar um número novo de chip ou um número de VOIP.

---

### Segurança

**As credenciais ficam seguras?**

Sim. O projeto foi desenvolvido para nunca salvar credenciais no código:
- Todas as chaves ficam no arquivo `.env` (que nunca deve ser enviado ao GitHub)
- O n8n armazena credenciais de forma criptografada
- Existe um validador automático que impede a publicação de credenciais expostas

**Nunca compartilhe seu arquivo `.env` com ninguém.**

---

**O arquivo `.env` foi para o GitHub por acidente. O que fazer?**

1. Revogue imediatamente todos os tokens e chaves expostas:
   - Meta: regenere o Access Token
   - n8n: regenere a API Key
   - Google: delete a Service Account e crie uma nova
2. Remova o arquivo do histórico do Git
3. Crie novos tokens e atualize o `.env`

---

### Escalabilidade e Limites

**Quantas mensagens o sistema consegue processar?**

- O n8n Cloud (plano gratuito) suporta 2.500 execuções por mês
- A API do WhatsApp tem limite de 80 mensagens por segundo
- O Google Sheets aceita 100 requisições por 100 segundos

Para volumes maiores, faça upgrade do plano do n8n.

---

**O sistema funciona 24 horas por dia?**

Sim, se usar n8n Cloud. Se usar n8n no seu computador, o bot só funciona enquanto o computador estiver ligado e o n8n rodando.

---

**Posso usar para múltiplas empresas?**

Sim. Cada empresa deve ter seu próprio workflow gerado com as configurações dela. Você pode hospedar todos no mesmo n8n.

---

### Suporte

**Ainda está com dúvidas?**

Releia o [Guia Passo a Passo](guia-passo-a-passo.md) com calma. Se o problema persistir, entre em contato informando:
- Qual etapa deu erro
- Qual mensagem de erro apareceu
- Print da tela (se possível)
