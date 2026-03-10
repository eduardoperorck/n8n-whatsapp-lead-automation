# Seu bot de WhatsApp em 20 minutos

Você recebeu dois itens:
- **Arquivo `.json`** — o bot já configurado para a sua empresa
- **Verify Token** — um código de texto (parece algo como `minha-empresa-ab12cd`)

Esse guia vai te levar do zero ao bot funcionando em cerca de 20 minutos. Não é necessário saber programação, mexer em terminal ou entender de tecnologia.

---

## Antes de começar — o que você vai precisar

- [ ] O arquivo `.json` que você recebeu
- [ ] O Verify Token que você recebeu
- [ ] Conta gratuita no **n8n** (veja como criar abaixo se ainda não tiver)
- [ ] Conta no **Google** com uma planilha no Google Sheets

> **Crie a planilha agora.** Abra o Google Sheets, crie uma planilha nova e coloque o nome que quiser. Na primeira linha, adicione esses títulos nas colunas (pode copiar e colar):
>
> `Timestamp` | `Empresa` | `WhatsApp` | `Nome` | `Telefone Contato` | `Servico Interesse` | `Orcamento` | `Prazo` | `Status`
>
> Renomeie a aba na parte de baixo para `Leads` (com L maiúsculo).

---

## Criando sua conta no n8n (pule se já tiver)

1. Acesse **n8n.io** no seu navegador
2. Clique em **"Get started for free"**
3. Preencha seu e-mail e crie uma senha
4. Confirme o e-mail se pedir
5. Quando entrar, você verá a tela principal com um menu lateral — isso é o n8n

---

## Passo 1 — Importar o bot no n8n

**Tempo estimado: 2 minutos**

1. No menu do lado esquerdo, clique em **"Workflows"**
2. Clique no botão **"Add workflow"**
3. No menu que aparece, clique em **"Import from file"** (ou "Importar do arquivo")
4. Selecione o arquivo `.json` que você recebeu
5. O bot aparece na tela com o nome da sua empresa e todos os campos já preenchidos

> **Funcionou quando:** você conseguir ver um diagrama com vários blocos coloridos conectados com linhas, com o nome da sua empresa no canto superior esquerdo.

---

## Passo 2 — Conectar sua planilha do Google Sheets

**Tempo estimado: 2 minutos**

1. No diagrama, encontre o **bloco roxo** chamado "Lead Storage — Google Sheets" e clique duas vezes nele
2. Uma janela vai abrir. Clique em **"Credential for Google Sheets API"**
3. Clique em **"Create new credential"** (criar nova credencial)
4. Clique em **"Sign in with Google"** (entrar com Google)
5. Escolha a conta Google onde está a sua planilha
6. Clique em **"Allow"** ou **"Permitir"** para autorizar
7. Você voltará para o n8n. No campo **"Document"** (Documento), clique na seta e **escolha sua planilha** na lista
8. No campo **"Sheet"** (Aba), selecione **Leads**
9. Clique em **"Save"** (Salvar)
10. Feche a janela clicando no X

> **Funcionou quando:** o bloco roxo não mostrar mais um aviso em vermelho ou laranja, e os campos Document e Sheet estiverem preenchidos.

---

## Passo 3 — Ativar o bot

**Tempo estimado: 1 minuto**

1. No canto superior direito da tela, localize o **botão de ativar** (um interruptor pequeno ao lado de "Inactive" ou "Ativo")
2. Clique nele — ele ficará **verde** e vai mostrar "Active"
3. Agora clique duas vezes no **bloco laranja** chamado "WhatsApp Webhook" (primeiro bloco do diagrama)
4. Uma janela vai abrir mostrando a **URL do Webhook** — um endereço longo começando com `https://`
5. Clique no botão de copiar ao lado da URL ou selecione tudo e copie (Ctrl+C)
6. **Guarde esse endereço** — você vai usar no próximo passo

> **Funcionou quando:** o interruptor estiver verde mostrando "Active" e você tiver copiado a URL do Webhook.

---

## Passo 4 — Configurar o webhook no painel Meta

**Tempo estimado: 5 minutos**

Esse é o passo que conecta o WhatsApp ao seu bot. Você vai fazer isso no painel de desenvolvedor da Meta (mesma empresa do WhatsApp e Facebook).

1. Acesse **developers.facebook.com** e faça login com o Facebook da sua empresa
2. No menu superior, clique em **"My Apps"** (Meus apps) e abra o app do seu WhatsApp
3. No menu do lado esquerdo, clique em **WhatsApp** → **Configuration** (Configuração)
4. Role a página até encontrar a seção **"Webhook"**
5. Clique no botão **"Edit"** (Editar)
6. No campo **"Callback URL"**, cole a URL do Webhook que você copiou no passo anterior
7. No campo **"Verify token"**, cole o **Verify Token** que você recebeu junto com este guia
8. Clique em **"Verify and Save"** (Verificar e Salvar)
9. Apareceu **"Verified"** (Verificado) ao lado do webhook? Perfeito.
10. Role um pouco mais para baixo até ver **"Webhook fields"**
11. Encontre a linha **"messages"** e clique em **"Subscribe"** (Inscrever)

> **Funcionou quando:** aparecer "Verified" na seção do webhook e "messages" aparecer como inscrito (com um ícone verde).

---

## Teste final

Mande **"Oi"** para o número de WhatsApp que está conectado no seu app Meta.

Em alguns segundos, o bot deve responder com a mensagem de boas-vindas da sua empresa e começar a fazer as perguntas. Quando chegar ao final da conversa, abra sua planilha e veja se os dados apareceram.

> **Bot funcionando =** mensagem recebida + dados na planilha ao final da conversa.

---

## Algo deu errado?

**Bot não respondeu nada:**
- O interruptor está verde (Active) no n8n?
- A URL do Webhook foi colada corretamente no campo "Callback URL" do painel Meta?
- Apareceu "Verified" depois de clicar em "Verify and Save"?
- O "messages" está com Subscribe ativado?

**Responde mas os dados não aparecem na planilha:**
- Você completou **todas** as perguntas do bot? (os dados só são salvos quando a conversa chega ao fim)
- A aba da planilha se chama exatamente `Leads` com L maiúsculo?
- O bloco roxo no n8n está sem alertas em vermelho ou laranja?

**O bot demorou para responder e depois parou:**
- Normal — a conversa expira após 30 minutos sem resposta. Mande outra mensagem para reiniciar do zero.

**Ainda com dúvidas?** Entre em contato com quem configurou seu bot e informe qual passo deu problema.
