import fetch from "node-fetch"
import yts from "yt-search"
import axios from "axios"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) return conn.reply(m.chat, `*⚽ Por favor, ingresa el nombre o enlace del video.*`, m)

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
    const infoMessage = `🌷 \`Titulo:\`  *<${title || 'Desconocido'}>*\n\n` +
      `> 📺 \`Canal\` » *${canal}*\n` +
      `> 👁️ \`Vistas\` » *${vistas || 'Desconocido'}*\n` +
      `> ⏱ \`Duración\` » *${timestamp || 'Desconocido'}*\n` +
      `> 📆 \`Publicado\` » *${ago || 'Desconocido'}*\n` +
      `> 🔗 \`Link\` » ${url}`

    const thumb = (await conn.getFile(thumbnail))?.data
    const external = {
      contextInfo: {
        externalAdReply: {
          title: title,
          body: '🎶 Descarga en curso...',
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    }

    await conn.reply(m.chat, infoMessage, m, external)
    
    if (['playaudio', 'play'].includes(command)) {
      try {
        const res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)
        const json = await res.json()

        if (!json?.result?.download?.url) throw '*⚠ No se obtuvo un enlace válido.*'

        await m.react('✅');
        await conn.sendMessage(m.chat, {
          audio: { url: json.result.download.url },
          mimetype: 'audio/mpeg',
          fileName: `${json.result.metadata?.title || 'audio'}.mp3`,
          contextInfo: {
            externalAdReply: {
              title: title,
              body: '⚽ Rin Itoshi - Music 🎧',
              mediaType: 1,
              thumbnail: thumb,
              mediaUrl: url,
              sourceUrl: url,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m })
      } catch (e) {
        return conn.reply(m.chat, '*⚠︎ No se pudo enviar el audio.*', m)
      }
    }

    else if (['playvideo', 'play2'].includes(command)) {
      try {
        const res = await fetch(`https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(url)}`)
        const json = await res.json()

        if (!json?.result?.download?.url) throw '⚠ No se obtuvo enlace de video.'

        const meta = json.result.metadata || {}
        const down = json.result.download || {}

        const size = await getSize(down.url)
        const sizeStr = size ? await formatSize(size) : 'Desconocido'

        await m.react('✅');

        let caption = `🧪  DESCARGA COMPLETA 🌱
> ✦ *Título:* ${meta.title || "Desconocido"}
> ❏ *Canal:* ${meta.author?.name || "Desconocido"}
> ⌬ *Duración:* ${meta.duration?.timestamp || "Desconocida"}
> ✧ *Calidad:* ${down.quality || "HD"}
> ⨳ *Tamaño:* ${sizeStr}
> 🜸 *Vistas:* ${formatViews(meta.views)}
> ❖ *Publicado:* ${meta.ago || 'Desconocido'}

🌱 *Enlace:* ${meta.url || url}
        `.trim()

        await conn.sendFile(
          m.chat,
          down.url,
          down.filename || 'video.mp4',
          caption,
          m
        )
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video.', m)
      }
    }

    else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m)
    }

  } catch (err) {
    return m.reply(`⚠︎ Ocurrió un error:\n${err}`)
  }
}

handler.command = handler.help = ['playaudio', 'playvideo', 'play', 'play2']
handler.tags = ['descargas']

export default handler


function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`
  return views.toString()
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

async function getSize(downloadUrl) {
  try {
    const response = await axios.head(downloadUrl, { maxRedirects: 5 });
    const length = response.headers['content-length'];
    return length ? parseInt(length, 10) : null;
  } catch {
    return null;
  }
}

async function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  if (!bytes || isNaN(bytes)) return 'Desconocido';
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}