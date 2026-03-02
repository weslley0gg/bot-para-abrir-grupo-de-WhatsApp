const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const os = require('os');
const fs = require('fs');

const action = process.argv[2]; // 'open' ou 'close'
const GROUP_ID = '120363333148844897@g.us';

if (!['open', 'close'].includes(action)) {
  console.error('Uso: node test.js open   → TESTA abertura');
  console.error('     node test.js close  → TESTA fechamento');
  process.exit(1);
}

// 🔍 Função inteligente para achar o navegador com base no sistema operacional
function getBrowserPath() {
    if (os.platform() === 'linux') {
        const linuxPaths = [
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/snap/bin/chromium'
        ];
        for (let path of linuxPaths) {
            if (fs.existsSync(path)) return path;
        }
    }
    return undefined;
}

// ⚙️ Configurações base do Puppeteer
const puppeteerConfig = {
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
    ]
};

const browserPath = getBrowserPath();
if (browserPath) {
    puppeteerConfig.executablePath = browserPath;
    console.log(`[Sistema] Rodando no Linux. Usando navegador em: ${browserPath}`);
} else {
    console.log('[Sistema] Rodando no Windows/Mac. Usando navegador padrão.');
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: puppeteerConfig
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

  // Encerra o processo logo após executar a ação
  process.exit(0);
});

client.initialize();