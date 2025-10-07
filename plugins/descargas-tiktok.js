import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(
    `🍏 Ingresa un enlace de TikTok.\n\nEjemplo:\n*${usedPrefix + command} https://vt.tiktok.com/ZSB2HNoKR/*`
  )

  try {
    let api = `https://delirius-apiofc.vercel.app/download/tiktok?url=${encodeURIComponent(text)}`
    let res = await fetch(api)
    let json = await res.json()

    if (!json.status) throw `No se pudo obtener el video.`

    let data = json.data
    let video = data.meta.media.find(m => m.type === "video")

    let caption = `≡ 🌷 *Título:* ${data.title || "-"}
≡ 👤 *Autor:* ${data.author?.nickname || "-"} (${data.author?.username || ""})
≡ 🎵 *Audio:* ${data.music?.title || "-"} – ${data.music?.author || "-"}
≡ ⏳ *Duración:* ${data.duration || 0} seg
≡ 👁 *Reproducciones:* ${data.repro || 0}
≡ ❤️ *Likes:* ${data.like || 0}
≡ 💬 *Comentarios:* ${data.comment || 0}
≡ 🔄 *Compartido:* ${data.share || 0}
≡ 📅 *Publicado:* ${data.published || "-"}
≡ 📥 *Descargas:* ${data.download || 0}
≡ 🌍 *Región:* ${data.region || "-"}
≡ 📂 *Tamaño:* ${video?.size_hd || video?.size_org || "?"}

🔗 *Link HD:* ${video?.hd || video?.org}
`.trim()

    let sizeMB = parseFloat((video?.size_hd || video?.size_org || "0").replace(" MB", "").trim())

    if (video && sizeMB <= 50) {
      await conn.sendMessage(m.chat, {
        video: { url: video.hd || video.org },
        caption
      }, { quoted: m })
    } else {
      await m.reply(caption)
    }

  } catch (e) {
    console.error(e)
    m.reply(`\`Error al procesar el video.\``)
  }
}

handler.help = ['tiktok'].map((v) => v + ' *<link>*')
handler.tags = ['descargas']
handler.command = ['tiktok', 'tt']
handler.register = true
handler.coin = 2
handler.limit = true

export default handler