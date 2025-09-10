const handler = async (m, { conn }) => {
  const { welcome, antiPrivate, antiarabe, restrict, antiBot, autoAceptar, autoRechazar, antiBot2, modoadmin, reaction, nsfw, antiSpam, antiLink2, jadibotmd, detect, antiver, audios, antiLink, antifake } = global.db.data.chats[m.chat] || {};
    /*
        let thumbnail = 'https://files.catbox.moe/4dple4.jpg';  
        let rcanal = 'https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U';
        
        await conn.sendMessage(m.chat, { 
            text: "🏔️ Enviando panel De configuración", 
            contextInfo: { 
                externalAdReply: { 
                    title: '┈ ⋞ 〈 ʀɪɴ ɪᴛᴏsʜɪ - ᴀɪ 〉 ⋟ ┈',
                    body: '°•°•°•°•°•°•°•°∞°•°•°•°•°•°•°•°',
                    mediaType: 1, 
                    thumbnail: await (await fetch(thumbnail)).buffer(), 
                    sourceUrl: rcanal 
                }
            }
        });*/
        
  const estado = (valor) => valor ? ' *`Activado`*' : ' *`Desactivado`*';
  const itoshi = `Estado:`;

  const text = `╭━━━〔 *📋 PANEL DE CONFIGURACIÓN* 〕━━━⬣
  
╭─〔 *Grupos* 〕
│ ☘️ Welcome: ${estado(welcome)}
| ☘️ Goodbye: ${estado(goodbye)}
│ ☘️ Antibot: ${estado(antiBot)}
│ ☘️ Autoaceptar: ${estado(autoAceptar)}
│ ☘️ Autorechazar: ${estado(autoRechazar)}
│ ☘️ AntiSub Bots: ${estado(antiBot2)}
│ ☘️ Modo Admin: ${estado(modoadmin)}
│ ☘️ Reacción: ${estado(reaction)}
│ ☘️ NSFW: ${estado(nsfw)}
│ ☘️ Anti Link2: ${estado(antiLink2)}
│ ☘️ Avisos / Detect: ${estado(detect)}
│ ☘️ Antiocultar / Antiver: ${estado(antiver)}
│ ☘️ Audios: ${estado(audios)}
│ ☘️ Antilink: ${estado(antiLink)}
│ ☘️ Antifakes: ${estado(antifake)}
╰─────────────⬣

╭─〔 *Owner / Creador* 〕
│ 🌳 Antiprivado: ${estado(antiPrivate)}
│ 🌳 Antiarabe: ${estado(antiarabe)}
│ 🌳 Restringir: ${estado(restrict)}
│ 🌳 Mode Jadibot: ${estado(jadibotmd)}
│ 🌳 antispam: ${estado(antiSpam)}
╰─────────────⬣

_*📝 Ejemplo:*_  \`.antilink on\``;

  const fkontak = {
    key: { fromMe: false, participant: '0@s.whatsapp.net' },
    message: { contactMessage: { displayName: `${conn.getName(m.sender)}` } }
  };

  await conn.sendMessage(m.chat, {
    text,
    contextInfo: {
      externalAdReply: {
        title: '⚙️ Configuración Santaflow',
        body: 'Gestión Avanzada del Reino',
        thumbnailUrl: 'https://i.postimg.cc/k55z3h9Z/IMG-20250909-WA0059.jpg',
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: fkontak });
};

handler.help = ['on'];
handler.tags = ['grupo'];
handler.command = ['off', 'on', 'nable'];
handler.register = true;

export default handler;
