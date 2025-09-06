import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const YT_REGEX = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;
const STELLAR_API_KEY = 'proyectsV2';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim()) 
      return conn.reply(m.chat, `⚡ *Por favor, ingresa el nombre o enlace del video.*`, m);

    let videoIdMatch = text.match(YT_REGEX);
    let search = await yts(videoIdMatch ? 'https://youtu.be/' + videoIdMatch[1] : text);
    let video = videoIdMatch
      ? search.all.find(v => v.videoId === videoIdMatch[1]) || search.videos.find(v => v.videoId === videoIdMatch[1])
      : search.videos?.[0];

    if (!video) return conn.reply(m.chat, '✧ No se encontraron resultados para tu búsqueda.', m);

    const { title = 'Desconocido', thumbnail, timestamp = 'Desconocido', views, ago = 'Desconocido', url, author } = video;
    const vistas = formatViews(views);
    const canal = author?.name || 'Desconocido';

    await m.react('⏱️');
    const infoMessage = `🌷 \`Titulo:\`  *${title}*\n\n` +
      `> 📺 \`Canal\` » *${canal}*\n` +
      `> 👁️ \`Vistas\` » *${vistas}*\n` +
      `> ⏱ \`Duración\` » *${timestamp}*\n` +
      `> 📆 \`Publicado\` » *${ago}*\n` +
      `> 🔗 \`Link\` » ${url}`;

    const thumb = (await conn.getFile(thumbnail))?.data;
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
    };

    await conn.reply(m.chat, infoMessage, m, external);

    if (['play', 'playaudio'].includes(command)) {
      try {
        const apiUrl = `https://api.stellarwa.xyz/download/ytmp3?url=${encodeURIComponent(url)}&apikey=${STELLAR_API_KEY}`;
        const res = await fetch(apiUrl);
        const json = await res.json();

        if (!json?.status || !json?.data?.dl) 
          throw '*⚠ No se obtuvo un enlace válido.*';

        const audioTitle = json.data.title || 'audio';
        const audioUrl = json.data.dl;

        await conn.sendMessage(m.chat, {
          audio: { url: audioUrl },
          mimetype: 'audio/mpeg',
          fileName: `${audioTitle}.mp3`,
          ptt: true,
          contextInfo: {
            externalAdReply: {
              title: title,
              body: '⚽ RIN ITOSHI - IA 🌀',
              mediaType: 1,
              thumbnail: thumb,
              mediaUrl: url,
              sourceUrl: url,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m });

      } catch (e) {
        return conn.reply(m.chat, '*⚠︎ No se pudo enviar el audio. El archivo podría ser demasiado pesado o hubo un error en la generación del enlace.*', m);
      }
    } else if (['play2','playvideo'].includes(command)) {
      try {
        const res = await fetch(`https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`);
        const json = await res.json();
        if (!json?.status || !json?.data?.download?.url) 
          throw '⚠ No se obtuvo enlace de video.';

        const size = await getSize(json.data.download.url);
        const sizeStr = size ? await formatSize(size) : 'Desconocido';

        await m.react('✅');

        const caption = ` 🧪  DESCARGA COMPLETA 🌱
> ✦ *Título:* ${json.data.title || 'Desconocido'}
> ❏ *Canal:* ${json.data.author || 'Desconocido'}
> ⌬ *Categoría:* ${json.data.category || 'Desconocida'}
> ⬡ *Duración:* ${formatTime(json.data.duration || 0)}
> ✧ *Calidad:* ${json.data.quality || 'HD'}
> ⨳ *Tamaño:* ${sizeStr}
> 🜸 *Vistas:* ${formatViews(json.data.views)}
> ◈ *Likes:* ${json.data.likes || 'No disponible'}
> ⌭ *Comentarios:* ${json.data.comments || 'No disponible'}
> ❖ *Publicado:* ${ago}

🌱 *Enlace:* https://youtu.be/${json.data.id || ''}`.trim();

        await conn.sendFile(
          m.chat,
          json.data.download.url,
          `${json.data.title || 'video'}.mp4`,
          caption,
          m
        );
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. El archivo podría ser muy pesado o hubo un error en el enlace.', m);
      }
    } else return conn.reply(m.chat, '✧︎ Comando no reconocido.', m);

  } catch (err) {
    return m.reply(`⚠︎ Ocurrió un error:\n${err}`);
  }
};

handler.command = handler.help = ['playaudio', 'play', 'playvideo', 'play2'];
handler.tags = ['descargas'];

export default handler;

function formatViews(views) {
  if (!views) return "No disponible";
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`;
  return views.toString();
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
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
