> 🇧🇷 Português | [🇺🇸 English](faq.en.md)

# Perguntas Frequentes
## WhatsApp Lead Automation

---

### O bot não respondeu quando enviei "Oi". O que fazer?

Verifique nesta ordem:

1. O interruptor do bot está **verde (Active)** no n8n?
2. A URL do Webhook foi colada corretamente no campo "Callback URL" do painel Meta?
3. Apareceu **"Verified"** depois de clicar em "Verify and Save"?
4. O campo **"messages"** está marcado como inscrito (Subscribe) na seção "Webhook fields"?
5. O Access Token do WhatsApp está válido? (Tokens temporários duram apenas 24 horas. Se estiver usando temporário, veja a pergunta sobre token abaixo.)

---

### O token de acesso do WhatsApp expirou. O que fazer?

O token temporário que o Meta fornece expira em 24 horas. Para usar em produção, você precisa de um **token permanente**:

1. No painel Meta, vá em **Business Settings → System Users**
2. Crie um novo System User do tipo **"Admin"**
3. Clique em **"Add Assets"** e adicione o seu app de WhatsApp
4. Clique em **"Generate New Token"**
5. Selecione o app e marque as permissões: `whatsapp_business_messaging` e `whatsapp_business_management`
6. Copie o token gerado
7. Entre em contato com quem configurou o bot para ele atualizar o JSON com o novo token

Esse token não expira automaticamente.

---

### O Google Sheets não está recebendo os dados. O que verificar?

1. Você completou **todas** as perguntas do bot? (os dados só são salvos quando a conversa termina)
2. A aba da planilha se chama exatamente `Leads` (com L maiúsculo)?
3. No n8n, o bloco roxo "Lead Storage — Google Sheets" está sem alertas em vermelho ou laranja?
4. A conta Google está conectada? (clique duas vezes no bloco roxo e verifique se a credencial está ativa)

---

### O bot responde mas para no meio da conversa.

A sessão expira após 30 minutos sem resposta do usuário. Isso é normal — evita conversas presas. Quando o usuário mandar outra mensagem, o bot reinicia do zero.

---

### O lead não apareceu na planilha mesmo após a conversa.

O lead só é salvo quando o usuário responde **todas as 5 perguntas** e chega ao final do fluxo. Se ele parou no meio, o dado não é salvo. Aguarde a sessão expirar (30 min) e peça para testar de novo respondendo até o fim.

---

### Como o cliente pode recomeçar a conversa do zero?

O usuário pode digitar qualquer saudação: `oi`, `olá`, `menu`, `início`, `começar`. O bot reinicia a conversa.

---

### O bot recebe fotos ou áudios?

Não — o bot informa que só processa mensagens de texto. Para alterar esse comportamento, o responsável técnico precisa editar o bloco "Message Parser" diretamente no n8n.

---

### Posso mudar as perguntas que o bot faz?

Sim. No n8n, abra o workflow e clique duas vezes no bloco **"Lead Qualification"**. Encontre o array `QUESTIONS` no código e edite as perguntas. Lembre-se de adicionar a coluna correspondente na planilha do Google Sheets.

---

### Posso usar um número de celular pessoal na API do WhatsApp?

Não. A API do WhatsApp Business exige um número dedicado que **não esteja** sendo usado no WhatsApp pessoal ou comum. Você pode usar um número novo de chip ou um número de VOIP.

---

### O sistema funciona 24 horas por dia?

Sim — usando o n8n Cloud. O bot funciona mesmo com o computador desligado.

---

### Quantas mensagens o sistema consegue processar?

- **n8n Cloud (gratuito):** 2.500 execuções por mês
- **WhatsApp Business API:** 1.000 conversas por mês grátis; depois é pago por conversa
- **Google Sheets:** sem limite relevante para uso normal

Para volumes maiores, faça upgrade do plano do n8n ou do Meta.

---

### Posso usar para múltiplas empresas?

Sim. Cada empresa tem seu próprio arquivo `.json` gerado com as configurações dela. Você pode importar todos na mesma conta n8n — cada um como um workflow separado.

---

### Ainda está com dúvidas?

Entre em contato com quem configurou seu bot informando:
- Qual passo deu problema
- O que apareceu na tela (print ajuda muito)
- Qual mensagem de erro foi exibida (se houver)
