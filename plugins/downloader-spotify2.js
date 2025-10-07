import fetch from 'node-fetch';

let handler = async (m, { conn, text, command }) => {
  if (!text || !text.startsWith("https://open.spotify.com/track/")) {
    return m.reply(`🎵 Ingresa la URL de una canción de Spotify.\n\nEjemplo:\n.${command} https://open.spotify.com/track/6UR5tB1wVm7qvH4xfsHr8m`);
  }

  try {

    let res = await fetch(`https://api.dorratz.com/spotifydl?url=${encodeURIComponent(text)}`);
    let data = await res.json();

    if (!data.download_url) {
      return m.reply("⚠️ No se pudo obtener el enlace de descarga.");
    }

    let caption = `╭━━━〔 🎶 SPOTIFY MUSIC 🍂 〕━━⬣
┃✨ *Título:* ${data.name}
┃🎤 *Artista:* ${data.artists}
┃⏱️ *Duración:* ${(data.duration_ms / 60000).toFixed(2)} min
┃📀 *By:* shadow
╰━━━━━━━━━━━━━━━━⬣`;

    await conn.sendMessage(m.chat, {
      image: { url: data.image },
      caption
    }, { quoted: m });


    await conn.sendMessage(m.chat, {
      audio: { url: data.download_url },
      mimetype: "audio/mpeg",
      fileName: `${data.name}.mp3`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply("❌ Error al procesar la canción.");
  }
};

handler.help = ["music <url_spotify>"];
handler.tags = ["descargas"];
handler.command = ['music'];

export default handler;