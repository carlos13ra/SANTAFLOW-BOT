import fetch from 'node-fetch';

let handler = async (m, { conn, args, command, usedPrefix }) => {
  let url = args[0];
  if (!url) {
    return m.reply(
      `⚠️ Ingresa un link de Spotify\n\nEjemplo:\n${usedPrefix + command} https://open.spotify.com/track/37ZtpRBkHcaq6hHy0X98zn`
    );
  }

  try {
    let api1 = `https://delirius-apiofc.vercel.app/download/spotifydl?url=${url}`;
    let api2 = `https://delirius-apiofc.vercel.app/download/spotifydlv2?url=${url}`;

    let res, json;

    try {
      res = await fetch(api1);
      json = await res.json();
      if (!json.estado || !json.datos?.URL) throw new Error('Falla API 1');
    } catch (e) {
      res = await fetch(api2);
      json = await res.json();
      if (!json.estado || !json.datos?.URL) throw new Error('Falla API 2');
    }

    let { título, autor, imagen, URL } = json.datos;

    let txt = `╭━━━〔 🎵 𝗦𝗣𝗢𝗧𝗜𝗙𝗬 𝗗𝗟 🎵 〕━━⬣
┃✨ *Título:* ${título}
┃👤 *Artista:* ${autor}
┃📀 *Fuente:* Spotify
╰━━━━━━━━━━━━⬣`;

    await conn.sendMessage(m.chat, { image: { url: imagen }, caption: txt }, { quoted: m });
    await conn.sendMessage(m.chat, { audio: { url: URL }, mimetype: 'audio/mpeg', fileName: `${título}.mp3` }, { quoted: m });

  } catch (e) {
    console.log(e);
    return m.reply('❌ No se pudo descargar el audio desde ninguna API.');
  }
};

handler.command = ['spotifydl', 'music'];
export default handler;