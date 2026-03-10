> 🇧🇷 Português | [🇺🇸 English](templates.en.md)

# Templates de Mensagem — WhatsApp Lead Automation

Este documento contém modelos de mensagem prontos para uso no bot de WhatsApp, organizados por situação e tipo de negócio. Use-os como base e adapte o tom, os detalhes e os serviços para a sua realidade.

---

## 1. Mensagens de Primeiro Contato (Boas-Vindas)

Estas são as mensagens que o bot envia quando um novo cliente manda a primeira mensagem. O objetivo é causar boa impressão, informar que o atendimento é automático e iniciar o processo de qualificação de forma natural.

---

### 1.1 Clínica de Saúde

**Clínica genérica:**
```
Olá! 👋 Bem-vindo(a) à *Clínica Saúde Total*.

Sou o assistente virtual da clínica e estou aqui para te ajudar a agendar sua consulta rapidinho — a qualquer hora do dia.

Para encontrar o melhor horário para você, preciso de algumas informações. Pode me responder as perguntas abaixo?

Começando: qual é o seu nome? 😊
```

**Clínica odontológica:**
```
Oi! Seja bem-vindo(a) à *OdontoSorriso* 🦷

Sou o assistente virtual da clínica. Vou te ajudar a agendar seu atendimento ou tirar dúvidas — tudo aqui pelo WhatsApp, sem espera.

Para começar, pode me dizer seu nome?
```

**Clínica de estética:**
```
Olá, tudo bem? ✨ Aqui é o atendimento da *Studio Bela Estética*.

Estou aqui para te ajudar a marcar seu procedimento ou tirar qualquer dúvida sobre nossos serviços.

Qual é o seu nome para eu começar o atendimento?
```

---

### 1.2 Restaurante

**Restaurante tradicional:**
```
Olá! 🍽️ Bem-vindo(a) ao *Restaurante Casa Grande*.

Nosso assistente virtual está aqui para te ajudar com reservas e informações sobre o cardápio — com agilidade e sem precisar ligar.

Para começar, qual é o seu nome?
```

**Pizzaria / delivery:**
```
Oi! 🍕 Aqui é o atendimento da *Pizzaria Napoli*.

Posso te ajudar com reservas de mesa ou informações sobre delivery. Vou precisar de alguns dados rapidinho.

Me diz seu nome para começar?
```

**Restaurante temático / buffet:**
```
Olá! 🎉 Bem-vindo(a) ao *Buffet Celebrar*.

Nosso assistente está disponível 24h para te ajudar com eventos, reservas e informações sobre pacotes.

Pode me contar seu nome para eu personalizar seu atendimento?
```

---

### 1.3 Prestador de Serviço

**Serviços gerais (encanador, eletricista, etc.):**
```
Olá! 🔧 Aqui é o atendimento da *ServiçosFácil*.

Precisa de um serviço de forma rápida e sem complicação? Estou aqui para registrar seu pedido e garantir que um de nossos técnicos entre em contato com você o mais rápido possível.

Qual é o seu nome?
```

**Personal trainer / academia:**
```
Oi! 💪 Bem-vindo(a) ao atendimento da *Academia FitZone*.

Quer começar sua jornada fitness ou já é aluno(a) e quer saber mais sobre nossos planos? Estou aqui para ajudar.

Me conta seu nome para começar!
```

**Advocacia / consultoria:**
```
Olá! Bem-vindo(a) ao atendimento do *Escritório Monteiro & Associados*.

Sou o assistente virtual do escritório. Posso registrar sua solicitação de contato e garantir que um de nossos advogados retorne para você.

Para iniciar, qual é o seu nome?
```

---

### 1.4 Escola / Curso

**Escola de idiomas:**
```
Olá! 🌎 Seja bem-vindo(a) à *Escola de Inglês Speak Up*!

Sou o assistente virtual da escola. Posso te ajudar com informações sobre cursos, turmas e matrícula — tudo por aqui mesmo.

Me diz seu nome para começar?
```

**Escola regular / reforço:**
```
Oi! 📚 Bem-vindo(a) ao atendimento do *Colégio Horizonte*.

Estou aqui para te ajudar com informações sobre matrículas, turmas e programas de reforço.

Qual é o seu nome?
```

**Curso profissionalizante:**
```
Olá! 🎓 Aqui é o atendimento do *Centro de Formação PraTodos*.

Quer dar um novo passo na sua carreira? Estou aqui para te apresentar nossos cursos e condições de matrícula.

Pode começar me dizendo seu nome?
```

---

## 2. Perguntas de Qualificação

Estas perguntas são feitas pelo bot em sequência, após a mensagem de boas-vindas. Cada pergunta deve ser enviada individualmente — uma por vez — e o bot aguarda a resposta antes de continuar.

---

### 2.1 Clínica de Saúde

**Pergunta 2 — Especialidade / serviço desejado:**
```
Obrigado, {{nome}}! 😊

Qual especialidade ou tipo de consulta você está procurando?

Exemplos: clínico geral, cardiologia, dermatologia, ortopedia, psicologia...
```

**Pergunta 3 — Urgência / disponibilidade:**
```
Entendido! É uma situação de urgência ou você está agendando para os próximos dias / semanas?

Se preferir, pode indicar uma data ou período que funcione melhor para você.
```

**Pergunta 4 — Preferência de contato:**
```
Perfeito. Como prefere que nossa equipe retorne para você?

1️⃣ WhatsApp
2️⃣ Ligação telefônica
3️⃣ E-mail

Pode digitar o número ou a palavra mesmo.
```

**Pergunta 5 — Observações:**
```
Tem mais alguma informação que queira nos passar? Por exemplo, se é convênio, particular, ou se tem alguma preferência de horário ou médico.

Se não tiver nada, pode responder *"não"* mesmo. 😊
```

---

### 2.2 Restaurante

**Pergunta 2 — Tipo de solicitação:**
```
Obrigado, {{nome}}!

Você quer:

1️⃣ Fazer uma reserva de mesa
2️⃣ Informações sobre delivery
3️⃣ Informações sobre o cardápio ou preços
4️⃣ Outro assunto

Pode digitar o número ou descrever o que precisa.
```

**Pergunta 3 — Data e tamanho do grupo (reserva):**
```
Ótimo! Para qual data e horário você gostaria de reservar a mesa?

E quantas pessoas serão no total?
```

**Pergunta 4 — Restrições alimentares:**
```
Algum dos convidados tem restrição alimentar ou preferência especial que devemos saber? (vegetariano, sem glúten, alergia, etc.)

Se não houver nada, pode responder *"não"*.
```

**Pergunta 5 — Contato de confirmação:**
```
Perfeito! Qual o melhor número de telefone para confirmarmos sua reserva?

(Pode ser esse mesmo número do WhatsApp, se preferir.)
```

---

### 2.3 Prestador de Serviço

**Pergunta 2 — Tipo de serviço necessário:**
```
Obrigado, {{nome}}!

Qual tipo de serviço você precisa?

Descreva da forma que for mais fácil — problema com encanamento, instalação elétrica, pintura, reforma... o que for.
```

**Pergunta 3 — Endereço e disponibilidade:**
```
Entendido. Para nos deslocarmos até você, pode me informar o bairro ou endereço aproximado?

E qual o melhor dia e horário para o atendimento?
```

**Pergunta 4 — Urgência:**
```
Esse serviço é urgente ou pode ser agendado para os próximos dias?
```

**Pergunta 5 — Observações adicionais:**
```
Tem mais algum detalhe que nos ajude a chegar preparado? Por exemplo, o andar do imóvel, se o problema é em área específica, ou qualquer outro detalhe relevante.

Se não tiver, responda *"não"* e encerro por aqui. 😊
```

---

### 2.4 Escola / Curso

**Pergunta 2 — Interesse específico:**
```
Obrigado, {{nome}}! 😊

Qual curso ou série você tem interesse?

Por exemplo: inglês para iniciantes, reforço de matemática, turma do 5º ano, habilitação profissional em TI...
```

**Pergunta 3 — Para quem é e faixa etária:**
```
A matrícula é para você ou para outra pessoa (filho, dependente)?

E qual a faixa etária do aluno?
```

**Pergunta 4 — Turno preferido:**
```
Qual o turno preferido para as aulas?

1️⃣ Manhã
2️⃣ Tarde
3️⃣ Noite
4️⃣ Fim de semana
5️⃣ Online / flexível

Pode indicar mais de uma opção.
```

**Pergunta 5 — Como ficou sabendo:**
```
Última pergunta: como você ficou sabendo da nossa escola?

Instagram, indicação de amigo, Google, outdoor... pode contar à vontade! 😊
```

---

## 3. Mensagens de Acompanhamento (Follow-Up)

Estas mensagens são enviadas **manualmente** pelo dono ou responsável pelo negócio, após receber a notificação do lead. O bot não envia essas mensagens automaticamente — elas são modelos para você copiar, personalizar e enviar pelo WhatsApp comum.

---

### 3.1 Follow-up genérico (primeiras 2 horas)

```
Olá, {{nome}}! 😊 Aqui é {{seu_nome}} da {{empresa}}.

Vi que você entrou em contato conosco pelo WhatsApp. Estou retornando para dar andamento ao seu atendimento.

Você tem um minutinho agora para conversarmos?
```

---

### 3.2 Follow-up para agendamento (clínica / serviço)

```
Oi, {{nome}}! Tudo bem?

Aqui é {{seu_nome}} da {{clínica/empresa}}. Vi que você quer {{serviço_ou_especialidade}} e temos disponibilidade {{dia_e_horário}}.

Funciona para você? Se sim, já confirmo no mesmo instante! 😊
```

---

### 3.3 Follow-up para reserva (restaurante)

```
Olá, {{nome}}! 🍽️

Sou {{seu_nome}} do {{restaurante}}. Vi sua solicitação de reserva para {{data}} às {{horário}} para {{número_de_pessoas}} pessoas.

Temos a mesa disponível! Posso confirmar para você?
```

---

### 3.4 Follow-up para matrícula (escola)

```
Olá, {{nome}}! 📚

Aqui é {{seu_nome}} do {{colégio/curso}}. Vi que você tem interesse em {{curso_ou_turma}}.

Temos vagas disponíveis no turno {{turno}}. Posso te enviar mais informações sobre o programa e as condições de matrícula?
```

---

### 3.5 Follow-up para leads que não responderam (24–48h depois)

```
Oi, {{nome}}! Tudo bem?

Tentei entrar em contato antes, mas não consegui te alcançar. 😊

Se ainda tiver interesse em {{serviço}}, fico à disposição. É só me chamar aqui!

— {{seu_nome}}, {{empresa}}
```

---

## 4. Mensagens de Conversão (Fechamento)

Use estes templates no momento de fechar a venda ou confirmar o agendamento. O objetivo é reduzir fricção e tornar a confirmação simples para o cliente.

---

### 4.1 Confirmação de agendamento

```
Perfeito, {{nome}}! 🎉

Agendamento confirmado:

📅 Data: {{data}}
🕐 Horário: {{horário}}
📍 Local: {{endereço ou "online"}}
👤 Responsável: {{nome_do_profissional}} (se aplicável)

Você receberá uma mensagem de lembrete {{X horas/1 dia}} antes.

Qualquer dúvida, é só me chamar aqui. Até lá! 😊
```

---

### 4.2 Confirmação de reserva

```
Reserva confirmada, {{nome}}! 🥂

📅 Data: {{data}}
🕐 Horário: {{horário}}
👥 Pessoas: {{número}}
📍 {{nome_do_restaurante}}

Estaremos te esperando! Se precisar cancelar ou alterar, avise com pelo menos {{X horas}} de antecedência.

Até {{data}}! 😊
```

---

### 4.3 Confirmação de matrícula

```
Que ótimo, {{nome}}! 🎓

Sua matrícula em {{curso_ou_turma}} foi confirmada!

📅 Início das aulas: {{data}}
🕐 Horário: {{horário}}
📍 {{local ou "acesso online em: link"}}

Em breve você receberá os materiais e instruções de acesso. Se tiver qualquer dúvida, é só chamar!

Bem-vindo(a) à família {{escola}}! 😊
```

---

### 4.4 Proposta de orçamento (serviço)

```
Olá, {{nome}}!

Com base nas informações que você passou, preparei um orçamento inicial para {{serviço}}:

💰 Valor estimado: R$ {{valor}}
⏱️ Prazo estimado: {{prazo}}
📋 O que inclui: {{descrição_breve}}

Esse é um valor preliminar — posso confirmar com precisão após uma avaliação rápida no local.

Posso agendar uma visita sem compromisso para essa semana?
```

---

## 5. Instruções de Personalização

### Como adaptar os templates para o seu negócio

**1. Substitua os campos entre {{ }}**
Todos os campos entre duplas chaves (`{{nome}}`, `{{empresa}}`, etc.) são variáveis que você deve substituir pelos dados reais. Alguns são preenchidos automaticamente pelo bot (como `{{nome}}`, que vem da primeira resposta do cliente). Os demais você preenche manualmente ao enviar.

**2. Ajuste o tom ao seu público**
- Para clínicas e advocacia: tom mais formal, evite gírias
- Para restaurantes e academias: tom mais descontraído, emojis são bem-vindos
- Para escolas: tom acolhedor e positivo, especialmente quando o cliente é um pai/mãe

**3. Adapte as perguntas de qualificação ao seu menu de serviços**
As perguntas de qualificação no bot podem — e devem — ser modificadas para refletir os serviços reais que você oferece. Se você é uma clínica com três especialidades, liste essas três na pergunta 2 em vez de pedir uma resposta aberta.

**4. Emojis: use com moderação e consistência**
Um ou dois emojis por mensagem aumentam a taxa de resposta e tornam o atendimento mais humano. Mais do que isso começa a parecer pouco profissional. Defina um padrão e mantenha.

**5. Teste antes de ativar**
Antes de colocar o bot em produção, mande mensagens para o número e percorra todo o fluxo como se fosse um cliente. Verifique se as respostas fazem sentido, se o tom está certo e se os dados chegam na planilha corretamente.

**6. Atualize os templates periodicamente**
Se você adicionar novos serviços, mudar de endereço ou atualizar os preços, lembre-se de revisar as mensagens no bot. Um bot com informações desatualizadas gera confusão e perda de credibilidade.

---

*Este documento faz parte do produto WhatsApp Lead Automation. Para suporte ou dúvidas sobre personalização, entre em contato com quem configurou seu bot.*
