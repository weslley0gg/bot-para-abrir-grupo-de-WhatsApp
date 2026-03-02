# 🤖 Bot de Automação de Grupo WhatsApp

Este é um bot feito em **Node.js** usando a biblioteca [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js), que **abre e fecha automaticamente um grupo do WhatsApp** nos horários configurados, além de permitir **mensagens automáticas de aviso**.

## 📅 Funcionalidades

- 🕗 Abre o grupo às **08:00 nas quartas e sábados**
- 🔒 Fecha o grupo às **17:00 na quarta e 12:00 no sábado**
- 📢 Envia mensagens automáticas informando a abertura ou fechamento do grupo
- 💻 Pode ser executado 24/7 com **PM2**
- 🧠 Usa `LocalAuth` para manter a sessão do WhatsApp ativa sem reautenticar

---

## 🚀 Instalação

1. **Clone o repositório**

```bash
git clone [https://github.com/seu-usuario/seu-repo.git](https://github.com/seu-usuario/seu-repo.git)
cd seu-repo

```

2. **Instale as dependências**

```bash
npm install whatsapp-web.js qrcode-terminal node-schedule

```

3. **Edite o ID do grupo**

No arquivo `bot.js`, substitua a variável `GROUP_ID` pelo ID real do seu grupo:

```javascript
const GROUP_ID = '120363333148844897@g.us';

```

---

## 🔍 Como descobrir o ID do Grupo

Para que o bot funcione, ele precisa do ID exato do grupo (que sempre termina com `@g.us`). Se você não sabe o ID, crie um arquivo chamado `get-id.js` com o código abaixo:

```javascript
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('✅ Cliente pronto!');
    const chats = await client.getChats();
    
    console.log('📋 Lista de Grupos:');
    chats.forEach(chat => {
        if (chat.isGroup) {
            console.log(`Nome: ${chat.name} | ID: ${chat.id._serialized}`);
        }
    });
    
    process.exit();
});

client.initialize();

```

Execute o script com o comando `node get-id.js`, escaneie o QR Code e copie o ID do grupo desejado que aparecerá no terminal.

---

## ▶️ Execução do Bot

```bash
node bot.js

```

Na **primeira vez**, será exibido um QR Code no terminal. Escaneie com seu WhatsApp para autenticar. Nas próximas vezes, a sessão será restaurada automaticamente.

---

## 🛠 Execução contínua com PM2 (opcional)

Para manter o bot rodando em segundo plano, mesmo se você fechar o terminal:

```bash
npm install -g pm2
pm2 start bot.js --name whatsapp-bot
pm2 save

```

Para fazer o bot iniciar automaticamente junto com o sistema operacional:

```bash
pm2 startup
# (siga a instrução que o comando retornar no terminal)

```

---

## ✅ Requisitos

* Node.js v14 ou superior
* WhatsApp no celular conectado e com internet
* O número logado no bot precisa ser **administrador do grupo** para conseguir alterar as configurações de envio de mensagens.

---

## 📄 Licença

MIT. Desenvolvido por Weslei.
