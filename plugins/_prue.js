import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  try {
    if (!text) return conn.reply(m.chat, `*⚠️ Ingresa un enlace o nombre de video de YouTube*`, m);

    await m.react('⏳'); // Emoji de carga

    // Llamada a la API
    const res = await fetch(`https://ochinpo-helper.hf.space/yt?query=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data.success) return conn.reply(m.chat, '*❌ No se encontró el video*', m);

    const video = data.result;

    // Primero enviamos la miniatura con la info
    const caption = `
🎬 *Título:* ${video.title}
👤 *Autor:* ${video.author.name}
🕒 *Duración:* ${video.duration.timestamp}
👁️ *Vistas:* ${video.views}
📅 *Subido:* ${video.uploadDate} (${video.ago})
📄 *Descripción:*
${video.description}
`;

    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption,
      footer: 'YouTube Downloader',
      headerType: 4
    }, { quoted: m });

    // Luego enviamos el video directamente
    await conn.sendMessage(m.chat, {
      video: { url: video.download.video },
      caption: `🎬 Aquí está tu video: *${video.title}*`,
      mimetype: 'video/mp4',
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '*❌ Ocurrió un error al procesar tu solicitud*', m);
  }
};

handler.command = ['yt'];


export default handler;