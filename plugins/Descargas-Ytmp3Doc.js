/*import fetch from 'node-fetch'
import Jimp from 'jimp'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let q = args.join(" ").trim()
  if (!q) {
    return conn.sendMessage(m.chat, {
      text: `*\`🍉 ɪɴɢʀᴇsᴇ ᴇʟ ɴᴏᴍʙʀᴇ ᴅᴇʟ ᴀᴜᴅɪᴏ ᴀ ᴅᴇsᴄᴀʀɢᴀʀ.\`*`
    }, { quoted: m })
  }

  await conn.sendMessage(m.chat, {
    text: `૮₍｡˃ ᵕ ˂ ｡₎ა 🫛 *¡Descargando tu archiwito kawaii!*
  
˚₊· ͟͟͞͞➳❥ 📊 Progresito:  
[▓▓▓▓▓░░░░░] 50% 🍬💗`
  }, { quoted: m })

  try {
    let res = await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(q)}`)
    let json = await res.json()

    if (!json.status || !json.data || !json.data.length) {
      return conn.sendMessage(m.chat, { text: `❌ No encontré resultados para *${q}*.` }, { quoted: m })
    }

    let vid = json.data[0]

    let dl = await fetch(`https://api.starlights.uk/api/downloader/youtube?url=${encodeURIComponent(vid.url)}`)
    let info = await dl.json()

    if (!info.status || !info.mp3) {
      return conn.sendMessage(m.chat, { text: `🌿 No se pudo obtener el audio de *${vid.title}*.` }, { quoted: m })
    }

    let { mp3 } = info

    let caption = `
= 📀 *${mp3.title}*
= ⏱️ 𝐃𝐮𝐫𝐚𝐜𝐢𝐨𝐧: ${vid.duration}
= ⚡ 𝐂𝐚𝐧𝐚𝐥: ${vid.author?.name || "Desconocido"}
= 🍧 𝐂𝐚𝐥𝐢𝐝𝐚𝐝: ${mp3.quality}
= 🍂 𝐓𝐚𝐦𝐚𝐧̃𝐨: ${mp3.size}
= 🔗 𝐋𝐢𝐧𝐤: ${vid.url}
`.trim()

    let thumb = null
    try {
      const img = await Jimp.read(mp3.thumbnail)
      img.resize(300, Jimp.AUTO)
      thumb = await img.getBufferAsync(Jimp.MIME_JPEG)
    } catch (err) {
      console.log("⚠️ Error al procesar miniatura:", err)
    }

    await conn.sendMessage(m.chat, {
      document: { url: mp3.dl_url },
      mimetype: "audio/mpeg",
      fileName: `${mp3.title}.mp3`,
      caption,
      ...(thumb ? { jpegThumbnail: thumb } : {}),
      contextInfo: {
        externalAdReply: {
          title: mp3.title,
          body: "𝚈𝙾𝚄𝚃𝚄𝙱𝙴 ~ 𝙼𝙿3 ~ 𝙳𝙾𝙲 ",
          mediaUrl: vid.url,
          sourceUrl: vid.url,
          thumbnailUrl: mp3.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (err) {
    console.error("[Error en ytmp3doc]", err)
    conn.sendMessage(m.chat, { text: `Error: ${err.message}` }, { quoted: m })
  }
}

handler.command = ['ytmp3doc', 'ytadoc']
handler.help = ['ytmp3doc <texto>']
handler.tags = ['descargas']

export default handler*/

import fetch from 'node-fetch'
import Jimp from 'jimp'
import axios from 'axios'
import crypto from 'crypto'

const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    cdn: "/random-cdn",
    info: "/v2/info",
    download: "/download"
  },
  headers: {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0'
  },
  crypto: {
    hexToBuffer: (hexString) => {
      const matches = hexString.match(/.{1,2}/g);
      return Buffer.from(matches.join(''), 'hex');
    },
    decrypt: async (enc) => {
      const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
      const data = Buffer.from(enc, 'base64');
      const iv = data.slice(0, 16);
      const content = data.slice(16);
      const key = savetube.crypto.hexToBuffer(secretKey);

      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      let decrypted = decipher.update(content);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return JSON.parse(decrypted.toString());
    }
  },
  isUrl: str => { 
    try { new URL(str); return true } catch { return false } 
  },
  youtube: url => {
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let regex of patterns) {
      if (regex.test(url)) return url.match(regex)[1];
    }
    return null;
  },
  request: async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: savetube.headers
      });
      return { status: true, code: 200, data: response };
    } catch (error) {
      return {
        status: false,
        code: error.response?.status || 500,
        error: error.message
      };
    }
  },
  getCDN: async () => {
    const response = await savetube.request(savetube.api.cdn, {}, 'get');
    if (!response.status) return response;
    return { status: true, code: 200, data: response.data.cdn };
  },
  download: async (link) => {
    if (!link) return { status: false, code: 400, error: "Falta el enlace de YouTube." };
    if (!savetube.isUrl(link)) return { status: false, code: 400, error: "URL inválida de YouTube." };

    const id = savetube.youtube(link);
    if (!id) return { status: false, code: 400, error: "No se pudo extraer el ID del video." };

    try {
      const cdnRes = await savetube.getCDN();
      if (!cdnRes.status) return cdnRes;
      const cdn = cdnRes.data;

      const infoRes = await savetube.request(`https://${cdn}${savetube.api.info}`, {
        url: `https://www.youtube.com/watch?v=${id}`
      });
      if (!infoRes.status) return infoRes;

      const decrypted = await savetube.crypto.decrypt(infoRes.data.data);

      const dl = await savetube.request(`https://${cdn}${savetube.api.download}`, {
        id: id,
        downloadType: 'audio',
        quality: '128',
        key: decrypted.key
      });

      return {
        status: true,
        code: 200,
        result: {
          title: decrypted.title || "Desconocido",
          thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          download: dl.data.data.downloadUrl,
          duration: decrypted.duration,
          quality: '128',
          id
        }
      };

    } catch (error) {
      return { status: false, code: 500, error: error.message };
    }
  }
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let q = args.join(" ").trim()
  if (!q) {
    return conn.sendMessage(m.chat, {
      text: `*\`🍉 ɪɴɢʀᴇsᴇ ᴇʟ ɴᴏᴍʙʀᴇ ᴅᴇʟ ᴀᴜᴅɪᴏ ᴀ ᴅᴇsᴄᴀʀɢᴀʀ.\`*`
    }, { quoted: m })
  }

  await conn.sendMessage(m.chat, {
    text: `૮₍｡˃ ᵕ ˂ ｡₎ა 🫛 *¡Descargando tu archiwito kawaii!*
  
˚₊· ͟͟͞͞➳❥ 🔥 DESCARGANDO 💫:  
[▓▓▓▓▓░░░░░] 50% 🔥`
  }, { quoted: m })

  try {
    // 🔍 Buscar en YT
    let res = await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(q)}`)
    let json = await res.json()
    if (!json.status || !json.data || !json.data.length) {
      return conn.sendMessage(m.chat, { text: `❌ No encontré resultados para *${q}*.` }, { quoted: m })
    }

    let vid = json.data[0]

    // 📥 Descargar con SAVETUBE
    let info = await savetube.download(vid.url)
    if (!info.status) {
      return conn.sendMessage(m.chat, { text: `🌿 No se pudo obtener el audio de *${vid.title}*.` }, { quoted: m })
    }

    let { result } = info

    let caption = `
= 📀 *${result.title}*
= ⏱️ 𝐃𝐮𝐫𝐚𝐜𝐢𝐨𝐧: ${vid.duration}
= 💫 𝐂𝐚𝐥𝐢𝐝𝐚𝐝: ${result.quality}
= ⚡ 𝐂𝐚𝐧𝐚𝐥: ${vid.author?.name || "Desconocido"}
= 🔗 𝐋𝐢𝐧𝐤: ${vid.url}
`.trim()

    let thumb = null
    try {
      const img = await Jimp.read(result.thumbnail)
      img.resize(300, Jimp.AUTO)
      thumb = await img.getBufferAsync(Jimp.MIME_JPEG)
    } catch (err) {
      console.log("⚠️ Error al procesar miniatura:", err)
    }

    await conn.sendMessage(m.chat, {
      document: { url: result.download },
      mimetype: "audio/mpeg",
      fileName: `${result.title}.mp3`,
      caption,
      ...(thumb ? { jpegThumbnail: thumb } : {}),
      contextInfo: {
        externalAdReply: {
          title: result.title,
          body: "YOUTUBE ~ MP3 ~ DOC ~ SANTAFLOW  IA",
          mediaUrl: vid.url,
          sourceUrl: vid.url,
          thumbnailUrl: result.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (err) {
    console.error("[Error en ytmp3doc]", err)
    conn.sendMessage(m.chat, { text: `Error: ${err.message}` }, { quoted: m })
  }
}

handler.command = ['ytmp3doc', 'ytadoc']
handler.help = ['ytmp3doc <texto>']
handler.tags = ['descargas']

export default handler
