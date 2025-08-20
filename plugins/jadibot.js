import ws from 'ws';

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) 
    return conn.reply(m.chat, `☁️ El comando *${command}* está desactivado temporalmente.`, m, fake);

  const channelRD = { 
    id: '120363402079893698@newsletter', 
    name: 'ˢᴬᴺᵀᴬᶠᴸᴼᵂ Bot | ° ᴄʜᴀɴɴᴇʟ - Official 🧪꙰⃟⸙'
  };

  const connsActivas = global.conns.filter(conn =>
    conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED
  );
  
  const _muptime = process.uptime() * 1000;
  const rinuptime = clockString(_muptime);

  const vistos = new Set();
  const subbotsUnicos = connsActivas.filter(conn => {
    const jid = conn.user?.jid;
    if (vistos.has(jid)) return false;
    vistos.add(jid);
    return true;
  });

  function convertirMsADiasHorasMinutosSegundos(ms) {
    let segundos = Math.floor(ms / 1000);
    let minutos = Math.floor(segundos / 60);
    let horas = Math.floor(minutos / 60);
    let dias = Math.floor(horas / 24);
    segundos %= 60;
    minutos %= 60;
    horas %= 24;

    let resultado = '';
    if (dias) resultado += `${dias} 𝑫, `;
    if (horas) resultado += `${horas} 𝑯, `;
    if (minutos) resultado += `${minutos} 𝑴, `;
    if (segundos) resultado += `${segundos} 𝑺`;
    return resultado.trim();
  }

  const total = subbotsUnicos.length;
  const maxSubbots = 100;
  const disponibles = maxSubbots - total;

  const lista = subbotsUnicos.map((bot, i) => {
    return `─────────────────────────
╭➤ ѕσ¢ƙєт #${i + 1} 𓆩📻𓆪
🐭 \`υѕυαяιο:\` ${bot.user?.name || 'Sub-Bot 🍂'}
🎮 \`ℓιиκ:\` wa.me/${(bot.user?.jid || '').replace(/[^0-9]/g, '')}?text=${usedPrefix}code
🍕 \`єи ℓιиєα:\` ${bot.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - bot.uptime) : 'Desconocido'}
─────────────────────────`;
  }).join('\n\n');

  const textoSubbots = `───〔 ⚽ 𝐒𝐎𝐂𝐊𝐄𝐓𝐒 𝐀𝐂𝐓𝐈𝐕𝐎𝐒 🔋 〕───

⏳ *ᴛɪᴇᴍᴘᴏ ᴀᴄᴛɪᴠᴏ:* _[ ${rinuptime} ]_
🌿 *sᴇssɪᴏɴs ʟɪʙʀᴇs:* _[ ${disponibles} ]_
🏆 *sᴜʙ-ʙᴏᴛs ᴄᴏɴᴇᴄᴛᴀᴅᴏs:* _[ ${total} ]_


— ☘️ 𝐿𝐼𝑆𝑇𝐴 𝐷𝐸 𝑆𝑈𝐵-𝐵𝑂𝑇𝑆 𝐴𝐶𝑇𝐼𝑉𝑂𝑆 🧪 —


${lista || '🌙 No hay Sub-Bots conectados por ahora verifique mas tarde.'}`;

  await conn.sendMessage(m.chat, {
    text: textoSubbots,
    contextInfo: {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelRD.id,
        serverMessageId: 100,
        newsletterName: channelRD.name
      },
      externalAdReply: {
        title: `🌀 ѕσ¢ƙєтѕ αcтιvσѕ`,
        body: `🍂 Conectados: ${total}/${maxSubbots}`,
        thumbnailUrl: icono,
        sourceUrl: redes,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true
      }
    }
  }, { quoted: global.fakeMetaMsg });
};

handler.command = ['sockets', 'bots', 'socket'];
handler.tags = ['jadibot'];
handler.help = ['sockets'];

export default handler;

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}
