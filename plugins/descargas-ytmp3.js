import axios from "axios"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🚩 Ingresa un enlace de YouTube\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/axAGA0Syiv4`)

  try {
    let url = `https://api.zenzxz.my.id/downloader/ytmp3v2?url=${encodeURIComponent(text)}`
    let { data } = await axios.get(url)

    if (!data.status) return m.reply("❌ Error al descargar el audio.")

    let info = `🎶 *${data.title}*\n⏱ Duración: ${data.duration} seg`
    await conn.sendMessage(m.chat, { image: { url: data.thumbnail }, caption: info }, { quoted: m })
    await conn.sendMessage(m.chat, { audio: { url: data.download_url }, mimetype: "audio/mpeg" }, { quoted: m })
  } catch (e) {
    m.reply("⚠️ Ocurrió un error.")
  }
}

handler.help = ["ytmp3 <url>"]
handler.tags = ["downloader"]
handler.command = ['ytmp3']

export default handler