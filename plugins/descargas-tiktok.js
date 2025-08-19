import axios from "axios";

const MAX_MB = 10;

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text || !text.includes('tiktok')) {
    return conn.reply(m.chat, '❤️ *Ingresa un enlace válido de TikTok*', m);
  }

  try {
    await m.react('⏳');

    let videoUrl = await getTiktokHDPrimary(text);
    if (!videoUrl) videoUrl = await getTiktokHDBackup(text);

    if (!videoUrl) throw new Error('No se pudo obtener el video HD.');

    const head = await axios.head(videoUrl);
    const contentLength = head.headers['content-length'];
    const fileSizeMB = parseInt(contentLength) / (1024 * 1024);

    if (fileSizeMB > MAX_MB) {
      return conn.reply(m.chat, `❌ El video pesa *${fileSizeMB.toFixed(2)} MB* y excede el límite de ${MAX_MB}MB.\n\n💡 Puedes descargarlo manualmente:\n${videoUrl}`, m);
    }

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: '*[ SANTAFLOW TE DA TU VIDEO DE TIKTOK HD SIN MARCA DE AGUA ]* 🎬'
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, '*Ocurrió un error al procesar el video 😢*', m);
  }
};

handler.help = ['tiktok', 'tt <url>'];
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];

export default handler;

// ─────────────── FUNCIONES API ───────────────

async function getTiktokHDPrimary(url) {
  try {
    const { data } = await axios.get('https://www.tikwm.com/api/', {
      params: { url },
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const result = data?.data;
    if (!result) return null;

    return result.hdplay || result.play_2 || result.play;
  } catch (e) {
    console.error('Error API primaria:', e);
    return null;
  }
}

async function getTiktokHDBackup(url) {
  try {
    const { data } = await axios.get(`https://api.tiklydown.me/download?url=${encodeURIComponent(url)}`);
    const video = data?.video?.no_watermark_hd || data?.video?.no_watermark;

    return video || null;
  } catch (e) {
    console.error('Error API backup:', e);
    return null;
  }
}
