// codigo de dv.Shadow

import fetch from 'node-fetch';
import yts from 'yt-search';

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `🌱 𝙄𝙣𝙜𝙧𝙚𝙨𝙖 𝙪𝙣 𝙚𝙣𝙡𝙖𝙘𝙚 𝙙𝙚 𝙔𝙤𝙪𝙏𝙪𝙗𝙚`, m, fake);
    }

    await conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } });

    const search = await yts(text);
    const video = search.videos[0];
    if (!video) {
      return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
    }

    const { title, timestamp, views, ago, url, author, thumbnail } = video;
    const canal = author?.name || 'Desconocido';
    const vistas = new Intl.NumberFormat('es-PE').format(views);

    let duracion;
    const partes = timestamp.split(':');
    if (partes.length === 3) {
      const [horas, min, seg] = partes;
      duracion = `${parseInt(horas)} hora${horas === '1' ? '' : 's'}, ${parseInt(min)} minuto${min === '1' ? '' : 's'}, ${parseInt(seg)} segundo${seg === '1' ? '' : 's'}`;
    } else {
      const [min, seg] = partes;
      duracion = `${parseInt(min)} minuto${min === '1' ? '' : 's'}, ${parseInt(seg)} segundo${seg === '1' ? '' : 's'}`;
    }

    const api = `https://dark-core-api.vercel.app/api/download/YTMP3?key=api&url=${url}`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json || !json.status || !json.download) {
      throw new Error('⚠️ No se pudo generar el enlace de descarga.');
    }
    const thumbnailBuffer = await (await fetch(thumbnail)).buffer();
    const textoInfo = `╭━━✿ YASSSU YOUTUBE MP3 ✿━━╮
┃
┃ 🍃 Título: *${title}* 〜♡
┃ ⏱️ Duración: *${duracion}* ✧
┃ 🍰 Canal: *${canal}* ♡
┃ 👀 Vistas: *${vistas}* ☆
┃ 🌱 Publicado: *${ago}* ♡
┃ 🔗 Link: *${url}* ✧
┃
╰━❀➤ El audio ya se esta enviando... 🎤❤`;

    await conn.sendMessage(m.chat, {text: textoInfo, contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterName: channelRD.name, newsletterJid: channelRD.id, }, externalAdReply: { title: title, body: '┈ ⋞ 〈 ☘️ ʀɪɴ ɪᴛᴏsʜɪ - ᴀɪ ⛅ 〉 ⋟ ┈', thumbnailUrl: thumbnailBuffer, sourceUrl: redes, mediaType: 1, renderLargerThumbnail: true }}}, {quoted: m});

    await conn.sendMessage(m.chat, {
      audio: { url: json.download },
      mimetype: 'audio/mpeg',
      fileName: `${json.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: json.title,
          body: 'YOUTUBE • MP3',
          mediaType: 1,
          thumbnail: thumbnailBuffer,
          mediaUrl: url,
          sourceUrl: url,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error('❌ Error en ytmp3:', e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return conn.reply(m.chat, `❌ *Error:* ${e.message}`, m);
  }
};

handler.command = ['ytmp3'];
handler.tags = ['descargas'];
handler.help = ['ytmp3 *<link>*'];

export default handler;
