import fetch from "node-fetch"
import yts from "yt-search"
import axios from "axios"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim()) 
      return conn.reply(m.chat, `*⚽ Por favor, ingresa el nombre o enlace del video.*`, m, fake)

    let videoIdMatch = text.match(youtubeRegexID)
    let search = await yts(videoIdMatch ? 'https://youtu.be/' + videoIdMatch[1] : text)
    let video = videoIdMatch
      ? search.all.find(v => v.videoId === videoIdMatch[1]) || search.videos.find(v => v.videoId === videoIdMatch[1])
      : search.videos?.[0]

    if (!video) return conn.reply(m.chat, '✧ No se encontraron resultados para tu búsqueda.', m)

    const { title, thumbnail, timestamp, views, ago, url, author } = video
    const vistas = formatViews(views)
    const canal = author?.name || 'Desconocido'
    
    await m.react('⏱️');
    const info = `🌷 \`Titulo:\`  *<${title || 'Desconocido'}>*\n\n> 📺 \`Canal\` » *${canal}*\n> 👁️ \`Vistas\` » *${vistas || 'Desconocido'}*\n> ⏱ \`Duración\` » *${timestamp || 'Desconocido'}*\n> 📆 \`Publicado\` » *${ago || 'Desconocido'}*\n> 🔗 \`Link\` » ${url}`

    const thumb = (await conn.getFile(thumbnail)).data
    await conn.sendMessage(m.chat, { image: thumb, caption: info, ...rcanal }, { quoted: fkontak })

    if (['play', 'playaudio'].includes(command)) {
      try {
        const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/v1?url=${encodeURIComponent(url)}&format=mp3`
        const res = await fetch(apiUrl)
        const json = await res.json()

        if (!json.status || !json.result?.downloadUrl)
          throw '*⚠ No se obtuvo un enlace válido desde la API.*'

        const { title: songTitle, downloadUrl, duration, cover, format, quality } = json.result

        await m.react('✅')
        await conn.sendMessage(m.chat, {
          audio: { url: downloadUrl },
          mimetype: 'audio/mpeg',
          fileName: `${songTitle || title}.mp3`,
          contextInfo: {
            externalAdReply: {
              title: songTitle || title,
              body: `🎧 ${format.toUpperCase()} • ${quality}kbps • ${duration}`,
              mediaType: 1,
              thumbnail: await (await fetch(cover || thumbnail)).buffer(),
              mediaUrl: url,
              sourceUrl: url,
              renderLargerThumbnail: false
            }
          }
        }, { quoted: m })

      } catch (e) {
        console.error(e)
        return conn.reply(m.chat, '*⚠︎ No se pudo enviar el audio. El archivo podría ser demasiado pesado o hubo un error en la API.*', m)
      }
    }

    else if (['play2', 'playvideo'].includes(command)) {
      try {
        const apiUrl = `https://api.zenzxz.my.id/downloader/ytmp4v2?url=${encodeURIComponent(url)}`
        const res = await fetch(apiUrl)
        const json = await res.json()

        if (!json.status || !json.download_url)
          throw '*⚠ No se pudo obtener el enlace de descarga de video.*'

        const dlUrl = json.download_url
        const videoTitle = json.title || title
        const videoDesc = `Duración: ${json.duration || 'Desconocido'}s\nFormato: ${json.format || 'Desconocido'}`
        const thumbUrl = json.thumbnail || thumbnail
        const thumb = (await conn.getFile(thumbUrl)).data

        const size = await getSize(dlUrl)
        const sizeStr = size ? await formatSize(size) : 'Desconocido'

        await m.react('✅')

        const caption = `🎬 *${videoTitle}*\n\n🧾 ${videoDesc}\n📏 Tamaño: *${sizeStr}*\n\n> ⚡ *Descarga completa*`

        await conn.sendMessage(m.chat, {
          video: { url: dlUrl },
          caption,
          mimetype: 'video/mp4',
          fileName: `${videoTitle}.mp4`,
          contextInfo: {
            externalAdReply: {
              title: videoTitle,
              body: '🔥 SANTAFLOW - IA 🌀',
              mediaType: 1,
              thumbnail: thumb,
              mediaUrl: url,
              sourceUrl: url,
              renderLargerThumbnail: false
            }
          }
        }, { quoted: m })
      } catch (e) {
        console.error(e)
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. El archivo podría ser muy pesado o hubo un error en el enlace.', m)
      }
    }

    else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m)
    }

  } catch (err) {
    console.error(err)
    return m.reply(`⚠︎ Ocurrió un error:\n${err}`)
  }
}

handler.command = handler.help = ['playaudio', 'play', 'playvideo', 'play2']
handler.tags = ['descargas']

export default handler


function formatViews(views) {
  if (views === undefined) return "No disponible"
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`
  return views.toString()
}

async function getSize(downloadUrl) {
  try {
    const response = await axios.head(downloadUrl, { maxRedirects: 5 })
    const length = response.headers['content-length']
    return length ? parseInt(length, 10) : null
  } catch {
    return null
  }
}

async function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  if (!bytes || isNaN(bytes)) return 'Desconocido'
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(2)} ${units[i]}`
}