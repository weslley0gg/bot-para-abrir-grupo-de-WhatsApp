const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const schedule = require('node-schedule');
const os = require('os');
const fs = require('fs');

// 🔍 Função inteligente para achar o navegador com base no sistema operacional
function getBrowserPath() {
    if (os.platform() === 'linux') {
        const linuxPaths = [
            '/usr/bin/chromium-browser', // Caminho comum Ubuntu/Debian
            '/usr/bin/chromium',         // Caminho comum Arch/Raspberry Pi
            '/snap/bin/chromium'         // Caminho comum via Snap
        ];
        // Verifica qual desses caminhos realmente existe no servidor
        for (let path of linuxPaths) {
            if (fs.existsSync(path)) return path;
        }
    }
    // No Windows e Mac, retorna null para o Puppeteer usar o Chrome embutido dele
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

// Se encontrou um caminho customizado (Linux), adiciona na configuração
const browserPath = getBrowserPath();
if (browserPath) {
    puppeteerConfig.executablePath = browserPath;
    console.log(`[Sistema] Rodando no Linux. Usando navegador em: ${browserPath}`);
} else {
    console.log('[Sistema] Rodando no Windows/Mac. Usando navegador padrão do Puppeteer.');
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: puppeteerConfig
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
