Aqui está o seu `README.md` completo e atualizado, agora incluindo a seção detalhada sobre como utilizar o script `test.js` para validar o funcionamento do bot antes de deixá-lo rodando no automático.

Basta copiar o código abaixo e substituir no seu repositório:

```markdown
# 🤖 Bot de Automação de Grupo WhatsApp

Este é um bot feito em **Node.js** usando a biblioteca [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js), que **abre e fecha automaticamente um grupo do WhatsApp** nos horários configurados, além de permitir **mensagens automáticas de aviso**. O código foi adaptado para rodar nativamente em servidores Linux (incluindo ARM), Windows e Mac.

## 📅 Funcionalidades

- 🕗 Abre o grupo às **08:00 nas quartas e sábados**
- 🔒 Fecha o grupo às **17:00 na quarta e 12:00 no sábado**
- 📢 Envia mensagens automáticas informando a abertura ou fechamento do grupo
- 💻 Pode ser executado 24/7 com **PM2**
- 🧠 Usa `LocalAuth` para manter a sessão do WhatsApp ativa sem reautenticar
- 🌐 Detecção automática de sistema operacional para rodar o Chromium corretamente em qualquer ambiente.

---

## 🚀 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/weslley0gg/bot-para-abrir-grupo-de-WhatsApp
cd bot-para-abrir-grupo-de-WhatsApp

```

2. **Instale as dependências**

```bash
npm install whatsapp-web.js qrcode-terminal node-schedule

```

*(Nota para usuários de servidores Linux: certifique--se de ter o Chromium instalado no sistema rodando `sudo apt update && sudo apt install -y chromium-browser`)*.

3. **Edite o ID do grupo**

Nos arquivos `bot.js` e `test.js`, substitua a variável `GROUP_ID` pelo ID real do seu grupo:

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

## 🧪 Testando o Bot Manualmente

Antes de deixar o bot rodando de forma automática, você pode usar o script `test.js` para garantir que as permissões de administrador estão corretas e que o bot consegue abrir e fechar o grupo imediatamente.

Para testar a **abertura** do grupo, rode:

```bash
node test.js open

```

Para testar o **fechamento** do grupo, rode:

```bash
node test.js close

```

*(Se for a primeira vez rodando, o terminal exibirá o QR Code para você escanear. A sessão será salva para os próximos usos).*

---

## ▶️ Execução do Bot (Automático)

Para iniciar a rotina de agendamentos, execute o arquivo principal:

```bash
node bot.js

```

Nas próximas vezes, a sessão será restaurada automaticamente sem a necessidade de ler o QR Code novamente.

---

## 🛠 Execução contínua com PM2 (Recomendado)

Para manter o bot rodando em segundo plano, mesmo se você fechar o terminal do seu servidor:

```bash
npm install -g pm2
pm2 start bot.js --name whatsapp-bot
pm2 save

```

Para fazer o bot iniciar automaticamente junto com o sistema operacional caso o servidor reinicie:

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
