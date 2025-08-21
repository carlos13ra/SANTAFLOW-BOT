import fetch from 'node-fetch';

let tiktokSessions = new Map();

const tiktokHandler = async (m, { conn, command, args, usedPrefix }) => {
    let query = args.join(' ').trim();

    let session = tiktokSessions.get(m.chat) || {
        videos: [],
        currentIndex: 0,
        query: query || ''
    };

    if (command === 'tksearch') {
        if (!query) {
            return conn.reply(
                m.chat,
                `🌀 \`\`\`Escribe lo que quieres buscar\`\`\`\n\`Ejemplo:\`\n> ${usedPrefix}tksearch Videos Graciosos `,
                m
            );
        }

        session = { videos: [], currentIndex: 0, query: query };
        tiktokSessions.set(m.chat, session);

        try {
            const apiUrl = `https://delirius-apiofc.vercel.app/search/tiktoksearch?query=${encodeURIComponent(query)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Ajusta aquí según la API real
            const results = data?.meta || data?.result || data?.videos || [];

            if (!results.length) {
                return conn.reply(m.chat, '❌ No se encontraron videos', m);
            }

            session.videos = results;
            tiktokSessions.set(m.chat, session);

            return await sendVideoWithButtons(session, m, conn, usedPrefix);
        } catch (error) {
            console.error(error);
            return conn.reply(m.chat, '❌ Error al buscar videos', m);
        }
    }

    if (command === 'tkseguir') {
        if (!session.videos.length) {
            return conn.reply(m.chat, '❌ Primero usa .tksearch para buscar videos', m);
        }

        if (session.currentIndex + 1 >= session.videos.length) {
            return conn.reply(m.chat, '✅ No hay más videos, vuelve a buscar.', m);
        }

        session.currentIndex += 1;
        tiktokSessions.set(m.chat, session);
        return await sendVideoWithButtons(session, m, conn, usedPrefix);
    }
};

async function sendVideoWithButtons(session, m, conn, usedPrefix) {
    const video = session.videos[session.currentIndex];

    if (!video || !video.hd) {
        return conn.reply(m.chat, '⚠️ No se pudo obtener el video en HD', m);
    }

    const caption = session.currentIndex === 0 
        ? `✅ Usa el botón para ver más videos.\n\n${wm || ''}`
        : `_*©${author || 'Bot'}*_`;

    try {
        const buttons = [];
        
        if (session.currentIndex + 1 < session.videos.length) {
            buttons.push({
                buttonId: `${usedPrefix}tkseguir`,
                buttonText: { displayText: "➡️ Siguiente video" },
                type: 1
            });
        }

        await conn.sendMessage(
            m.chat,
            {
                video: { url: video.hd },
                caption: caption,
                buttons: buttons,
                viewOnce: true
            },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Error al enviar el video', m);
    }
}

tiktokHandler.help = ['tksearch <búsqueda>', 'tkseguir'];
tiktokHandler.tags = ['descargas'];
tiktokHandler.command = ['tksearch', 'tkseguir'];

export default tiktokHandler;