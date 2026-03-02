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

// Substitua pelo ID do seu grupo
const GROUP_ID = '120363333148844897@g.us';

client.on('qr', qr => {
  // gera e imprime QR code no terminal
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('🤖 Bot pronto!');

  // Quarta-feira 08:00 → AVISO + abre o grupo
  schedule.scheduleJob('0 8 * * 3', async () => {
    const chat = await client.getChatById(GROUP_ID);
    // 1) envia mensagem de aviso
    await chat.sendMessage('Bom dia! O grupo está sendo aberto agora, podem enviar as agendas.');
    // 2) executa a abertura
    await chat.setMessagesAdminsOnly(false);
    console.log('[Qua 08:00] Grupo ABERTO e aviso enviado');
  });

  // Quarta-feira 17:00 → fecha o grupo + AVISO
  schedule.scheduleJob('0 17 * * 3', async () => {
    const chat = await client.getChatById(GROUP_ID);
    // 1) fecha o grupo
    await chat.setMessagesAdminsOnly(true);
    // 2) envia mensagem de aviso
    await chat.sendMessage('🔒 Atenção: O grupo foi fechado. Caso não tenha conseguido postar a agenda dentro do horário estipulado, envie-a com a devida justificativa do atraso para os seguintes e-mails: weslei.proterra@gmail.com, edsonalexandrino.proterra@gmail.com e ronaldo.proterra@gmail.com.');
    console.log('[Qua 17:00] Grupo FECHADO e aviso enviado');
  });

  // Sábado 08:00 → AVISO + abre o grupo
  schedule.scheduleJob('0 8 * * 6', async () => {
    const chat = await client.getChatById(GROUP_ID);
    await chat.sendMessage('Bom dia! O grupo está sendo aberto agora, podem enviar as agendas.');
    await chat.setMessagesAdminsOnly(false);
    console.log('[Sáb 08:00] Grupo ABERTO e aviso enviado');
  });

  // Sábado 12:00 → fecha o grupo + AVISO
  schedule.scheduleJob('0 12 * * 6', async () => {
    const chat = await client.getChatById(GROUP_ID);
    await chat.setMessagesAdminsOnly(true);
    await chat.sendMessage('🔒 Atenção: O grupo foi fechado. Caso não tenha conseguido postar a agenda dentro do horário estipulado, envie-a com a devida justificativa do atraso para os seguintes e-mails: weslei.proterra@gmail.com, edsonalexandrino.proterra@gmail.com e ronaldo.proterra@gmail.com.');
    console.log('[Sáb 12:00] Grupo FECHADO e aviso enviado');
  });

});

client.initialize();
