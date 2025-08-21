import fetch from 'node-fetch';

let handler = async (m, { conn, args, command, usedPrefix}) => {
  const text = args.join(" ");
  if (!text) {
    return m.reply(
      `╭━━━〔 🎶 *SPOTIFY PLAYER* 🎶 〕━━⬣
┃ ✦ Uso correcto:
┃ ⌬ ${usedPrefix + command} *nombre de canción*
┃ ✧ Ejemplo:
┃ ⌬ ${usedPrefix + command} Shakira Monotonía
╰━━━━━━━━━━━━━━━━━━⬣`
    );
  }

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.result?.downloadUrl) {
      return m.reply(
        `╭━━━〔 ⚠️ *SIN RESULTADOS* ⚠️ 〕━━⬣
┃ ✦ No encontré nada con:
┃ ⌬ *${text}*
┃ ✧ Intenta con otro nombre 🎵
╰━━━━━━━━━━━━━━━━━━⬣`
      );
    }

    const { title, artist, duration, cover, url } = json.result.metadata;
    const audio = json.result.downloadUrl;

    // Enviar imagen con detalles
    await conn.sendMessage(m.chat, {
      image: { url: cover },
      caption: `╭━━━〔 🎧 *SPOTIFY MUSIC* 🎧 〕━━⬣
┃ ✦ 🎵 *Título:* ${title}
┃ ✦ 👤 *Artista:* ${artist}
┃ ✦ ⏱️ *Duración:* ${duration}
┃ ✦ 🌍 *Enlace:* ${url}
╰━━━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m });


    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mp4',
      ptt: false,
      fileName: `${title}.mp3`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    return m.reply(
      `╭━━━〔 ⚠️ *ERROR* ⚠️ 〕━━⬣
┃ ✦ Hubo un problema al procesar la solicitud.
┃ ✧ Intenta nuevamente más tarde ⏳
╰━━━━━━━━━━━━━━━━━━⬣`
    );
  }
};

handler.help = ['spotify', 'music']
handler.tags = ['downloader']
handler.command = ['spotify', 'splay']
export default handler