// plugins/downloader-pinterest.js

import fetch from 'node-fetch';

const API_BASE = 'https://api.dorratz.com/v3/pinvideo';

let handler = async (m, { conn, text, command, usedPrefix }) => {
  try {
    let pinUrl =
      (text && (text.match(/https?:\/\/\S+/i) || [])[0]) ||
      (m.quoted && m.quoted.text && (m.quoted.text.match(/https?:\/\/\S+/i) || [])[0]);

    if (!pinUrl || !/pinterest\.com\/pin\//i.test(pinUrl)) {
      return conn.reply(
        m.chat,
        [
          '🌱 *Descarga Pinterest*',
          'Envía el link de un *Pin* con video.',
          '',
          `• Ejemplo: ${usedPrefix + command} https://pinterest.com/pin/4151824651938194`,
        ].join('\n'),
        m
      );
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const apiKey = process.env.DORRATZ_API_KEY || ''; 
    const urlParam = encodeURIComponent(pinUrl);

    let endpoint = `${API_BASE}?url=${urlParam}`;

    
    const FALLBACK_API_KEY = '';
    if (!apiKey && FALLBACK_API_KEY) {
      endpoint += `&apikey=${encodeURIComponent(FALLBACK_API_KEY)}`;
    }

    const headers = {
      'User-Agent': 'Rin-Itoshi-Bot/1.0 (+PinterestDownloader)',
      'Accept': 'application/json',
    };
    if (apiKey) {
      // probamos dos headers comunes por si el servicio usa uno u otro
      headers['Authorization'] = `Bearer ${apiKey}`;
      headers['x-api-key'] = apiKey;
      headers['apikey'] = apiKey;
    }

    // 4) Llamar a la API de dorratz
    const res = await fetch(endpoint, { headers, timeout: 60_000 });
    if (!res.ok) {
      throw new Error(`API respondió ${res.status} ${res.statusText}`);
    }
    const data = await res.json();

    // 5) Extraer el .mp4 de forma robusta (por si cambian nombres de claves)
    const videoUrl =
      findMp4Url(data) ||
      findMp4Url(data?.resultado) ||
      findMp4Url(data?.result) ||
      findMp4Url(data?.data);

    if (!videoUrl) {
      // Mostrar JSON resumido para debug
      const preview = JSON.stringify(data, null, 2).slice(0, 600);
      throw new Error(
        `No se encontró .mp4 en la respuesta.\n\nVista previa:\n${preview}...`
      );
    }

    const thumb = logo;

    const contextInfo = {
      externalAdReply: {
        title: '📌 Pinterest Downloader',
        body: 'Listo para enviar tu video',
        mediaType: 1,
        thumbnailUrl: thumb,
        renderLargerThumbnail: true,
        sourceUrl: pinUrl,
      },
    };

    await conn.reply(
      m.chat,
      [
        '╭━━━〔  Pinterest DL  〕━━⬣',
        '┆ 🔎 URL detectada',
        `┆ ${pinUrl}`,
        '┆',
        '┆ 🎬 Preparando tu video…',
        '╰━━━━━━━━━━━━━━━━━━⬣',
      ].join('\n'),
      m,
      { contextInfo }
    );

    // 7) Enviar el video como documento o como video directo
    // Intento 1: como video (muestra preview en WhatsApp)
    try {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption:
            '✅ *Descarga lista*\n' +
            '— Plataforma: Pinterest\n' +
            `— Fuente: ${pinUrl}\n` +
            '— By: shadow',
          mimetype: 'video/mp4',
          contextInfo,
        },
        { quoted: m }
      );
    } catch (e) {
      // Intento 2: como documento (por si WhatsApp se pone quisquilloso)
      await conn.sendMessage(
        m.chat,
        {
          document: { url: videoUrl },
          fileName: 'pinterest.mp4',
          mimetype: 'video/mp4',
          caption:
            '✅ *Descarga lista (documento)*\n' +
            `— Fuente: ${pinUrl}\n` +
            '— By: shadow',
          contextInfo,
        },
        { quoted: m }
      );
    }

    // 8) Reacción final
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    conn.reply(
      m.chat,
      '⚠️ *Error al procesar el Pin.*\n' + String(err?.message || err),
      m
    );
  }
};

// ==== Utilidades ====

/**
 * Busca recursivamente el primer string que luzca como URL de .mp4
 * en un objeto/array cualquiera.
 */
function findMp4Url(any) {
  let url;
  try {
    const visit = (node) => {
      if (url) return;
      if (!node) return;
      if (typeof node === 'string') {
        const s = node.trim();
        if (/^https?:\/\/\S+\.mp4(\?\S+)?$/i.test(s)) {
          url = s;
        }
        return;
      }
      if (Array.isArray(node)) {
        for (const v of node) {
          visit(v);
          if (url) return;
        }
        return;
      }
      if (typeof node === 'object') {
        for (const k of Object.keys(node)) {
          if (
            /url|video|download|link|mp4|play|stream/i.test(k) &&
            typeof node[k] === 'string' &&
            /^https?:\/\/\S+\.mp4(\?\S+)?$/i.test(node[k])
          ) {
            url = node[k];
            return;
          }
          visit(node[k]);
          if (url) return;
        }
      }
    };
    visit(any);
  } catch {}
  return url || null;
}

handler.help = ['pin2'].map((v) => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(pin2)$/i;

export default handler;