import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("✦ Ingresa un link de YouTube válido.");

  try {
    const res = await fetch(`https://delirius-apiofc.vercel.app/download/ytmp3?url=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.estado) throw new Error("No se pudo descargar el audio.");

    const { titulo, autor, imagen, descargar } = json.datos;

    await conn.sendMessage(m.chat, {
      audio: { url: descargar.url },
      mimetype: "audio/mpeg",
      fileName: descargar.filename,
      contextInfo: {
        externalAdReply: {
          title: titulo,
          body: autor,
          thumbnailUrl: imagen,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
  } catch (e) {
    m.reply("✦ Error al descargar el audio.");
  }
};

handler.command = ["ytmp3"];
export default handler;