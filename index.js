const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, disconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        getMessage: async () => { return { conversation: '' }; }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== disconnectReason.loggedOut;
            console.log('Conexão fechada. Reconectando:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('=== BOT CONECTADO E PRONTO PARA MENSAGENS ===');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        try {
            // Processa apenas novas notificações
            if (m.type !== 'notify') return;

            const msg = m.messages[0];

            // Trava 1: Ignora se for mensagem enviada por você mesmo ou vazia
            if (!msg || !msg.message || msg.key.fromMe) return;

            // Extrai o texto de qualquer formato de mensagem
            const texto = msg.message.conversation || 
                          msg.message.extendedTextMessage?.text || 
                          '';

            // Trava 2: Ignora se a mensagem não tiver texto real (ex: avisos de leitura)
            if (!texto || texto.trim() === '') return;

            // Trava 3: Evita responder à própria mensagem de aviso
            if (texto.includes('Aguarde, logo já te respondo!')) return;

            console.log('-> MENSAGEM VALIDA RECEBIDA:', texto, '| De:', msg.key.remoteJid);

            // Envia a resposta única
            await sock.sendMessage(msg.key.remoteJid, { 
                text: 'Aguarde, logo já te respondo! ⏳' 
            });

            console.log('-> RESPOSTA ÚNICA ENVIADA COM SUCESSO!');

        } catch (err) {
            console.error('Erro ao processar mensagem:', err);
        }
    });
}

connectToWhatsApp();
