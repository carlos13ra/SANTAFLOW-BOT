import fetch from "node-fetch"
import yts from "yt-search"

let handler = async (m, { conn, text, command, usedPrefix }) => {
  try {
    let q = m.quoted?.text || text // si responde al mensaje del bot
    let input = text || q 

    if (!input) {
      return conn.reply(
        m.chat,
        `🌱 Ingresa el nombre de la canción o un enlace de YouTube.\n\n📌 Ejemplo:\n${usedPrefix + command} despacito`,
        m
      )
    }

    // Caso especial: si el usuario responde al BOT con "audio" o "video"
    if (/^(audio|video)$/i.test(input) && m.quoted?.text) {
      let lastQuery = m.quoted.text.match(/🎶 Resultado de: (.+)/i)?.[1]
      if (!lastQuery) return conn.reply(m.chat, "⚠️ No encontré el título anterior.", m)

      input = lastQuery // usar el título de la búsqueda anterior
      input = { query: lastQuery, type: input.toLowerCase() }
    }

    // Detectar tipo: audio o video
    let type = "audio"
    if (/video/i.test(input.query || input)) type = "video"
    if (/audio/i.test(input.query || input)) type = "audio"

    let search = await yts(input.query || input)
    let vid = search.videos[0]
    if (!vid) return conn.reply(m.chat, "⚠️ No encontré resultados.", m)

    // API según tipo
    let apiUrl = type === "audio"
      ? `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(vid.title)}`
      : `https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(vid.title)}`

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    let res = await fetch(apiUrl)
    let json = await res.json()
    if (!json.result?.download_url) {
      return conn.reply(m.chat, "⚠️ Error descargando el archivo.", m)
    }

    // Enviar el resultado
    if (type === "audio") {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: json.result.download_url },
          mimetype: "audio/mpeg",
          contextInfo: {
            externalAdReply: {
              title: vid.title,
              body: "🎶 Descargado en MP3",
              thumbnailUrl: vid.thumbnail,
              sourceUrl: vid.url,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: json.result.download_url },
          caption: `🎬 *${vid.title}*`,
          contextInfo: {
            externalAdReply: {
              title: vid.title,
              body: "🎥 Descargado en MP4",
              thumbnailUrl: vid.thumbnail,
              sourceUrl: vid.url,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: m }
      )
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "⚠️ Error al procesar tu solicitud.", m)
  }
}

handler.command = /^(play|yt)$/i
export default handler