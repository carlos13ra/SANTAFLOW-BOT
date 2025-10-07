import fetch from "node-fetch"
import yts from "yt-search"
import axios from "axios";

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) return conn.reply(m.chat, `*⚽ Por favor, ingresa el nombre o enlace del video.*`, m, fake)

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
    
    // --- AUDIO (play / playaudio) ---
    if (['play', 'playaudio'].includes(command)) {
      try {
        const res = await fetch(`https://api.vreden.my.id/api/v1/download/youtube/audio?url=${url}&quality=128`)
        const json = await res.json()
        
        if (!json.result?.download?.url) throw '*⚠ No se obtuvo un enlace válido.*'

        await m.react('✅');
        await conn.sendMessage(m.chat, {
          audio: { url: json.result.download.url },
          mimetype: 'audio/mpeg',
          fileName: json.result.download.filename || `${json.result.metadata?.title || title}.mp3`,
          contextInfo: {
            externalAdReply: {
              title: title,
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
        return conn.reply(m.chat, '*⚠︎ No se pudo enviar el audio. El archivo podría ser demasiado pesado o hubo un error en la generación del enlace.*', m)
      }
    }

    // --- VIDEO (play2 / playvideo) ---
    else if (['play2','playvideo'].includes(command)) {
      try {
        const res = await fetch(`https://api-nv.eliasaryt.pro/api/dl/yt-direct?url=${url}&type=video&key=hYSK8YrJpKRc9jSE`)

        const size = await getSize(json.data.download.url)
        const sizeStr = size ? await formatSize(size) : 'Desconocido'

        await m.react('✅');

        let caption = ` 🧪  DESCARGA COMPLETA 🌱
        `.trim()

        await conn.sendFile(
          m.chat,
          res,
          `${title || 'video'}.mp4`,
          caption,
          m
        )
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. El archivo podría ser muy pesado o hubo un error en el enlace.', m)
      }
    }

    else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m)
    }

  } catch (err) {
    return m.reply(`⚠︎ Ocurrió un error:\n${err}`)
  }
}

handler.command = handler.help = ['playaudio', 'play', 'playvideo', 'play2']
handler.tags = ['descargas']

export default handler


// --- Helpers ---
function formatViews(views) {
  if (views === undefined) return "No disponible"
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
  } catch (error) {
    console.error("Error al obtener el tamaño:", error.message);
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