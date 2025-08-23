// plugins/play_sin_prefijo.js
// Autor: Tú :)
// Requiere: yt-search, ytdl-core, node-fetch@2
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MAX_FILE_MB = 45 
const PENDING_TTL_MS = 5 * 60 * 1000 
const RESULTS_PER_PAGE = 5

const FALLBACKS = {
  audio: [],
  video: []
}

const pendingPlaySessions = new Map()

function cleanupOldSessions() {
  const now = Date.now()
  for (const [chat, sess] of pendingPlaySessions.entries()) {
    if (now - sess.createdAt > PENDING_TTL_MS) pendingPlaySessions.delete(chat)
  }
}

function bytesToMB(bytes) {
  return bytes / (1024 * 1024)
}
async function safeUnlink(file) { try { fs.unlinkSync(file) } catch { } }

function pickBestAudioFormat(info) {
  const audioOnly = ytdl.filterFormats(info.formats, 'audioonly')
  audioOnly.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))
  return audioOnly[0] || info.formats.find(f => f.hasAudio)
}

function pickBestVideoFormat(info, maxMB = MAX_FILE_MB) {
  const av = info.formats.filter(f => f.hasVideo && f.hasAudio && f.qualityLabel)
  const order = ['360p', '480p', '720p', '1080p']
  av.sort((a, b) => order.indexOf(a.qualityLabel) - order.indexOf(b.qualityLabel))
  const secs = parseInt(info.videoDetails.lengthSeconds || '0', 10)
  for (const f of av) {
    const br = (f.bitrate || f.averageBitrate || 256000)
    const sizeBytes = (br * secs)
    const sizeMBapprox = sizeBytes / (8 * 1024 * 1024)
    if (sizeMBapprox <= maxMB) return f
  }
  return av[0] || info.formats.find(f => f.hasVideo && f.hasAudio)
}

function formatList(results) {
  let out = '╭━━━〔 🔎 RESULTADOS 〕━━⬣\n'
  results.forEach((r, i) => {
    out += `┃ ${i + 1}. ${r.title}\n`
    out += `┃ ⏱️ ${r.duration}  • 👁️ ${r.views.toLocaleString()} • 📺 ${r.author}\n`
    out += `┃ 🔗 ${r.url}\n`
  })
  out += '╰━━━━━━━━━━━━━━━━━━⬣\n'
  out += 'Responde a ESTE mensaje con:\n'
  out += '» ytmp3    (envía el #1)\n'
  out += '» ytmp4    (envía el #1)\n'
  out += '» ytmp3 3  (envía el #3)\n'
  out += '» ytmp4 2  (envía el #2)\n'
  return out
}

function parseChoice(text) {
  const t = (text || '').trim().toLowerCase()
  const m = t.match(/^(ytmp3|ytmp4)(?:\s+(\d+))?$/i)
  if (!m) return null
  const kind = m[1] === 'ytmp3' ? 'audio' : 'video'
  const idx = m[2] ? Math.max(1, parseInt(m[2], 10)) : 1
  return { kind, index: idx }
}

async function sendAudio(conn, m, videoUrl, title) {
  try {
    const info = await ytdl.getInfo(videoUrl)
    const fmt = pickBestAudioFormat(info)
    if (!fmt) throw new Error('No hay formato de audio válido.')

    const tmp = path.join(__dirname, `tmp_audio_${Date.now()}.mp3`)
    await new Promise((resolve, reject) => {
      const stream = ytdl.downloadFromInfo(info, { format: fmt })
      const ws = fs.createWriteStream(tmp)
      let total = 0
      stream.on('data', c => { total += c.length; if (bytesToMB(total) > MAX_FILE_MB) stream.destroy(new Error('Audio excede el tamaño máximo')) })
      stream.on('error', reject)
      ws.on('finish', resolve)
      stream.pipe(ws)
    })

    await conn.sendMessage(m.chat, { audio: fs.readFileSync(tmp), mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
    await safeUnlink(tmp)
    return
  } catch (e) {
    for (const fb of FALLBACKS.audio) {
      try {
        const res = await fb(videoUrl)
        await conn.sendMessage(m.chat, { audio: { url: res.url }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
        return
      } catch { }
    }
    throw e
  }
}

async function sendVideo(conn, m, videoUrl, title) {
  try {
    const info = await ytdl.getInfo(videoUrl)
    const fmt = pickBestVideoFormat(info)
    if (!fmt) throw new Error('No hay formato de video válido.')

    const ext = (fmt.container || 'mp4').replace('webm', 'mp4')
    const tmp = path.join(__dirname, `tmp_video_${Date.now()}.${ext}`)
    await new Promise((resolve, reject) => {
      const stream = ytdl.downloadFromInfo(info, { format: fmt })
      const ws = fs.createWriteStream(tmp)
      let total = 0
      stream.on('data', c => { total += c.length; if (bytesToMB(total) > MAX_FILE_MB) stream.destroy(new Error('Video excede el tamaño máximo')) })
      stream.on('error', reject)
      ws.on('finish', resolve)
      stream.pipe(ws)
    })

    await conn.sendMessage(m.chat, { video: fs.readFileSync(tmp), caption: title }, { quoted: m })
    await safeUnlink(tmp)
    return
  } catch (e) {
    for (const fb of FALLBACKS.video) {
      try {
        const res = await fb(videoUrl)
        await conn.sendMessage(m.chat, { video: { url: res.url }, caption: title }, { quoted: m })
        return
      } catch { }
    }
    throw e
  }
}

// ====== HANDLER ======
let handler = async (m, { conn, text, isBaileys, usedPrefix, command }) => {
  try {
    cleanupOldSessions()
    const fromMe = m.key?.fromMe
    const isCmd = !!command || (usedPrefix && text?.startsWith?.(usedPrefix))
    const body = (text || (m.text || '')).trim()

    const quoted = m.quoted
    if (quoted && quoted.key?.id) {
      const sess = pendingPlaySessions.get(m.chat)
      if (sess && sess.promptMsgId === quoted.key.id) {
        const choice = parseChoice(body)
        if (!choice) {
          return conn.reply(m.chat, '❌ Responde con "ytmp3", "ytmp4", o por ejemplo "ytmp3 3".', m)
        }
        const idx = choice.index - 1
        const pick = sess.results[idx]
        if (!pick) return conn.reply(m.chat, '❌ Número fuera de rango.', m)

        await conn.reply(m.chat, `⏳ Descargando ${choice.kind} de:\n${pick.title}`, m)
        if (choice.kind === 'audio') await sendAudio(conn, m, pick.url, pick.title)
        else await sendVideo(conn, m, pick.url, pick.title)

        pendingPlaySessions.delete(m.chat)
        return
      }
    }

    if (!fromMe && !isCmd && body && body.length >= 2) {
      const r = await yts.search({ query: body, hl: 'es', gl: 'PE' })
      const vids = (r.videos || []).slice(0, RESULTS_PER_PAGE)
      if (!vids.length) return conn.reply(m.chat, '🙃 No encontré resultados. Prueba con otro nombre.', m)

      const results = vids.map(v => ({
        title: v.title,
        url: v.url,
        duration: v.timestamp || `${v.seconds || 0}s`,
        views: v.views || 0,
        author: v.author?.name || 'Desconocido',
        thumbnail: v.thumbnail
      }))

      const caption = [
        '╭━━━〔 ▶️ PLAY 〕━━⬣',
        `┃ 🔎 Búsqueda: ${body}`,
        '╰━━━━━━━━━━━━━━━━━━⬣',
        formatList(results)
      ].join('\n')

      const sent = await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
      pendingPlaySessions.set(m.chat, {
        createdAt: Date.now(),
        query: body,
        results,
        promptMsgId: sent.key.id
      })
      return
    }

  } catch (err) {
    console.error('play_sin_prefijo error:', err)
    return conn.reply(m.chat, '💥 Ocurrió un error procesando tu solicitud.', m)
  }
}

handler.help = ['ytmp']
handler.tags = ['downloader']
handler.command = /^ytmp$/i
export default handler