const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const schedule = require('node-schedule');

// Use LocalAuth para persistir sessão entre reinícios
const client = new Client({
  authStrategy: new LocalAuth()
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
