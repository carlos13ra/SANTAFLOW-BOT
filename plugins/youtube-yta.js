import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`⚡ *Ejemplo de uso:*\n\n✎ ✧ \`${usedPrefix + command}\` https://youtu.be/ZtFPexrxt4g?si=aWllBcy3adHrobOB\n✎ ✧ \`${usedPrefix + command}\` DJ malam pagi slowed`);
  }

  await m.react('💿');

  const isYoutubeUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(text);
  let info = null;

  try {
    if (isYoutubeUrl) {
      try {
        const res = await fetch(`https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(text)}&type=audio&quality=128kbps&apikey=russellxz`);
        const json = await res.json();

        if (json?.status && json?.data?.url) {
          info = {
            title: json.title || "YouTube Audio",
            author: json.channel || "Desconocido",
            duration: json.fduration || "Desconocida",
            thumb: json.thumbnail || `https://i.ytimg.com/vi/${json.id}/hqdefault.jpg`,
            download: json.data.url,
            filename: json.data.filename || `${command}_${Date.now()}.mp3`,
            size: json.data.size || "Desconocido"
          };
        }
      } catch (e) {
        console.error('Error en Neoxr API:', e);
      }
    }

    if (!info) throw '❌ No se pudo obtener información de la API.';

    await conn.sendMessage(m.chat, {
      audio: { url: info.download },
      fileName: info.filename,
      mimetype: "audio/mpeg",
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: info.title,
          body: `🌱 Duración: ${info.duration} | Canal: ${info.author}`,
          mediaUrl: text,
          sourceUrl: text,
          thumbnailUrl: info.thumb,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await m.react('✅');

  } catch (err) {
    console.error(err);
    await m.reply('❌ *No se pudo obtener el MP3.* Intenta con otro título o link.');
    await m.react('❌');
  }
};

handler.command = ['yta'];
handler.help = ['yta <url o texto>'];
handler.tags = ['downloader'];

export default handler;