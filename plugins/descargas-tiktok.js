import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `🥭 Joder tio- debes poner un link de TikTok Bien😈`, m, fake);
    }

    try {
        await conn.reply(m.chat, `
╭─⊰ 🌸 𝐒𝐀𝐍𝐓𝐀𝐅𝐋𝐎𝐖~ ⊱─╮  
┃ ⏳ *Espera un momentito SANTAFLOW-LA RESPUESTA...*  
┃ 💕 *Estoy descargando tu videíto SANTAFLOW~RED*  
╰─⊰ ✨ SANTAFLOW~POP DEL MONO ⊱─╯`, m);

        const tiktokData = await tiktokdl(args[0]);

        if (!tiktokData || !tiktokData.data || !tiktokData.data.play) {
            return conn.reply(m.chat, "❌ Uff... No pude traer tu video onichan 😿", m);
        }

        const data = tiktokData.data;
        const videoURL = data.play;

        const formatNumber = (n = 0) => n.toLocaleString('es-PE');
        const formatDuration = (seconds = 0) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins} min ${secs} seg`;
        };

        if (videoURL) {
            await conn.sendFile(m.chat, videoURL, "tiktok.mp4", `╭─╼⃝🌸 𝑶𝒏𝒊𝒄𝒉𝒂𝒂𝒏~ 💖  
│ 🍡 *Tu video está servidito BIEN~!*  
│  
│ 🎀 *Título:* ${data.title || 'Sin descripción uwu'}  
│ 💗 *Likes:* ${formatNumber(data.digg_count)} ✨  
│ 📝 *Comentarios:* ${formatNumber(data.comment_count)} 💕  
│ 👁 *Vistas:* ${formatNumber(data.play_count)} 🌸  
│ 🔁 *Compartido:* ${formatNumber(data.share_count)} 💌  
│ ⏲️ *Duración:* ${formatDuration(data.duration)} ⌛  
│ 🖼️ *Calidad:* ${videoURL.includes('hd') ? 'HD 🌟' : 'Normalito 📺'}  
│  
╰─❖ 🌈 𝐃𝐢𝐬𝐟𝐫𝐮𝐭𝐚𝐥𝐨, 𝐒𝐀𝐍𝐓𝐀𝐅𝐋𝐎𝐖-𝐕𝐄𝐍𝐈𝐃 𝐏𝐎𝐑 𝐌𝐈~ 💞`, m);
        } else {
            return conn.reply(m.chat, "❌ No pude descargarlo nya~ 😿", m);
        }
    } catch (error1) {
        return conn.reply(m.chat, `❌ Error inesperado: ${error1.message}`, m);
    }
};

handler.help = ['tiktok'].map((v) => v + ' *<link>*');
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];
handler.register = true;
handler.coin = 2;
handler.limit = true;

export default handler;

async function tiktokdl(url) {
    let tikwm = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    let response = await (await fetch(tikwm)).json();
    return response;
}
