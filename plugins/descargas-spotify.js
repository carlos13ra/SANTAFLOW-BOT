import fetch from 'node-fetch';

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const text = args.join(" ");
  if (!text) {
    return m.reply(
      `⟬⟬ 🌸 *SPOTIFY - DESCARGAS* 🌸 ⟭⟭
╭─╼━━━━━━━━━━━╾─╮
│ 🪷 Uso correcto:
│ ⤷ ${usedPrefix + command} dj opus
╰─╼━━━━━━━━━━━╾─╯
     ⌬ 𝑩𝒐𝒕: *Rin Itoshi*`
    );
  }

  await m.react('🔍');

  try {
    const searchRes = await fetch(`https://api.vreden.my.id/api/spotifysearch?query=${encodeURIComponent(text)}`);
    const searchJson = await searchRes.json();

    if (!searchJson.result || searchJson.result.length === 0) {
      return m.reply(
        `⟬⟬ 🌸 *SPOTIFY - DESCARGAS* 🌸 ⟭⟭
╭─╼━━━━━━━━━━━╾─╮
│ ❌ No encontré resultados para:
│ ⤷ *${text}*
╰─╼━━━━━━━━━━━╾─╯
     ⌬ 𝑩𝒐𝒕: *Rin Itoshi*`
      );
    }

    const track = searchJson.result[0];
    const { title, artist, album, duration, releaseDate, spotifyLink, coverArt } = track;

    const detailRes = await fetch(`https://api.vreden.my.id/api/spotify?url=${encodeURIComponent(spotifyLink)}`);
    const detailJson = await detailRes.json();

    if (!detailJson.result?.music) {
      return m.reply(
        `⟬⟬ 🌸 *SPOTIFY - DESCARGAS* 🌸 ⟭⟭
╭─╼━━━━━━━━━━━╾─╮
│ ⚠️ No pude obtener el audio de:
│ ⤷ *${title}*
╰─╼━━━━━━━━━━━╾─╯
     ⌬ 𝑩𝒐𝒕: *Rin Itoshi*`
      );
    }

    const audioUrl = detailJson.result.music;

    await conn.sendMessage(m.chat, {
      image: { url: coverArt },
      caption: `⟬⟬ 🎼 *SPOTIFY - TRACK* 🎼 ⟭⟭
╭─╼━━━━━━━━━━━╾─╮
│ 🎵 *Título:* ${title}
│ 👤 *Artista:* ${artist}
│ 💿 *Álbum:* ${album}
│ ⏱️ *Duración:* ${duration}
│ 📅 *Lanzamiento:* ${releaseDate}
│ 🌐 *Spotify:* ${spotifyLink}
╰─╼━━━━━━━━━━━╾─╯
     ⌬ 𝑩𝒐𝒕: *Rin Itoshi*`
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: false,
      fileName: `${title}.mp3`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    return m.reply(
      `⟬⟬ 🌸 *SPOTIFY - DESCARGAS* 🌸 ⟭⟭
╭─╼━━━━━━━━━━━╾─╮
│ ⚠️ Ocurrió un error inesperado.
│ 🔄 Intenta nuevamente más tarde.
╰─╼━━━━━━━━━━━╾─╯
     ⌬ 𝑩𝒐𝒕: *Rin Itoshi*`
    );
  }
};

handler.help = ['spotify'];
handler.tags = ['descargas'];
handler.command = ['spotify', 'spotifydl'];
handler.register = true;

export default handler;
