const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode    = require('qrcode-terminal');

const action    = process.argv[2];         // 'open' ou 'close'
const GROUP_ID  = '120363333148844897@g.us'; 

if (!['open','close'].includes(action)) {
  console.error('Uso: node test.js open   → TESTA abertura');
  console.error('     node test.js close  → TESTA fechamento');
  process.exit(1);
}

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  const chat = await client.getChatById(GROUP_ID);

  if (action === 'open') {
    await chat.setMessagesAdminsOnly(false);
    console.log('✅ Grupo ABERTO (teste)');
  } else {
    await chat.setMessagesAdminsOnly(true);
    console.log('✅ Grupo FECHADO (teste)');
  }

  process.exit(0);
});

client.initialize();
