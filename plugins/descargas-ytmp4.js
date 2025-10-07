import fetch from "node-fetch";
import fs from "fs";
import path from "path";

let handler = async (m, { conn, text }) => {
    try {
        if (!text) return conn.reply(m.chat, "❌ Por favor envía el enlace de YouTube.", m);

        await m.react("⏳");
        const apiURL = `https://api-nv.eliasaryt.pro/api/dl/yt-direct?url=${encodeURIComponent(text)}&type=video&key=hYSK8YrJpKRc9jSE`;
        
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("Error al descargar el vídeo");


        const tmpDir = "./tmp";
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
        const filePath = path.join(tmpDir, `video_${Date.now()}.mp4`);
        const fileStream = fs.createWriteStream(filePath);
        await new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on("error", reject);
            fileStream.on("finish", resolve);
        });

 
        await conn.sendMessage(
            m.chat,
            { video: fs.readFileSync(filePath), caption: "🎬 Aquí está tu vídeo" },
            { quoted: m }
        );

        fs.unlinkSync(filePath);

    } catch (err) {
        console.error(err);
        conn.reply(m.chat, "❌ Ocurrió un error al descargar el vídeo.", m);
    }
};

handler.help = ["ytvid <link>"];
handler.tags = ["downloader"];
handler.command = ["ytmp4"];

export default handler;