import fetch from 'node-fetch';

export async function before(m, { conn }) {
  if (!m.text || !global.prefix.test(m.text)) return;

  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();
  
  const thumbRes = await fetch("https://i.postimg.cc/0NxWTkp0/1754525596737.jpg");
  const thumbBuffer = await thumbRes.buffer();
  const fkontak = {
        key: {
           participants: "0@s.whatsapp.net",
           remoteJid: "status@broadcast",
           fromMe: false,
           id: "Halo"
        },
        message: {
            locationMessage: {
                name: `*̥₊🎧 𝑺𝒂𝒏𝒕𝒂𝒇𝒍𝒐𝒘 - 𝑩𝒐𝒕 | © 𝘣𝘺 ᴄᴀʀʟᴏs ʀᴀᴍɪʀᴇᴢ ◌🥭`,
                jpegThumbnail: thumbBuffer
            }
        },
        participant: "0@s.whatsapp.net"
  };
  const channelRD = { 
    id: '120363402079893698@newsletter', 
    name: '🎧 𝐒𝐀𝐍𝐓𝐀𝐅𝐋𝐎𝐖 - 𝐁𝐎𝐓 | 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 𝐎𝐅𝐈𝐂𝐈𝐀𝐋 💫'
  };

  if (!command || command === 'bot') return;

  const isValidCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      const cmdList = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      if (cmdList.includes(command)) return true;
    }
    return false;
  };

  if (isValidCommand(command, global.plugins)) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];

    if (chat?.isBanned) {
      const avisoDesactivado = `╭─⭑༺ 🔒 𝐁𝐎𝐓 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐀𝐃𝐎 ༻⭑─╮
│ ✖️  *${bot}* está en *modo inactivo*.  
│ 💬  Los comandos están *bloqueados*.  
│ 📌  Solo un *administrador* puede  
│      volver a *activarlo*.  
│  
│ 💠  Actívalo con: *${usedPrefix}bot on*  
╰───────────────────────⬯`;

      await conn.sendMessage(m.chat, {
      text: avisoDesactivado,
      mentions: [m.sender],
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: '',
          newsletterName: channelRD.name
        },
        externalAdReply: {
          title: '◌*̥₊ 🎧 𝐒𝐀𝐍𝐓𝐀𝐅𝐋𝐎𝐖 - 𝐁𝐎𝐓 ◌📀༉',
          body: '',
          thumbnailUrl: 'https://i.postimg.cc/Y2JJXwyb/1754525693627.jpg',
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
        },
        mentionedJid: null
      }
    }, { quoted: fkontak });
    return;
    }

    if (!user.commands) user.commands = 0;
    user.commands += 1;
    return;
  }

  //await m.react('💔');
  const mensajesNoEncontrado = [
    `> ⌗ El comando *"${command}"* no se reconoce.
> ⌗ Menú disponible: *${usedPrefix}menu*`,

    `✧ *"${command}"* no forma parte del sistema.
 ✧ Consulta: *${usedPrefix}menu*`,

    `❐ *"${command}"* no está registrado.
❐ Usa *${usedPrefix}menu* para ver opciones.`,

    `🎵 El comando *"${command}"* no existe.
🌤️ Consulta el menú: *${usedPrefix}menu*`,

    `🎤 *"${command}"* no está disponible.
🔥 Menú: *${usedPrefix}menu*`,

    `📌 Comando: *"${command}"* inválido.
💫 Usa: *${usedPrefix}menu* para ver todos los comandos disponibles.`
  ];

  const texto = mensajesNoEncontrado[Math.floor(Math.random() * mensajesNoEncontrado.length)];
  const thumb = 'https://i.postimg.cc/pTm6Z0fw/1754253021526.jpg';

  
  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: [m.sender],
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelRD.id,
        serverMessageId: '',
        newsletterName: channelRD.name
      },
      externalAdReply: {
        title: ' 🎃 𝐒𝐀𝐍𝐓𝐀𝐅𝐋𝐎𝐖 - 𝐁𝐎𝐓 📀',
        body: '',
        thumbnailUrl: thumb,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
      },
     mentionedJid: null
    }
  }, { quoted: fkontak });
}
