import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    await m.reply(`*📀 Por favor, ingresa el enlace o nombre de una canción de Spotify.*\n> *\`Ejemplo:\`* ${usedPrefix + command} Ponte bonita - Cris mj`);
    return;
  }

  await m.react('⌛');

  try {
    let ouh = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    let gyh = await ouh.json();

    if (!gyh.result || !gyh.result.downloadUrl) {
      throw new Error('No se encontró la canción o el enlace es inválido.');
    }

    await conn.sendMessage(m.chat, {
      audio: { url: gyh.result.downloadUrl },
      mimetype: 'audio/mpeg'
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    await m.reply(`❌ Error al obtener el audio:\n${e.message}`);
    await m.react('❌');
  }
}

handler.help = ['spotify *<texto>*']
handler.tags = ['descargas']
handler.command = ['spotify', 'spotifydl', 'spdl']

export default handler