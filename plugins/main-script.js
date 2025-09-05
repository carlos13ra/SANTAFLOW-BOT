import moment from 'moment-timezone'
import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
try {
let res = await fetch('https://github.com/carlos13ra/SANTAFLOW-BOT.git')

if (!res.ok) throw new Error('Error al obtener datos del repositorio')
let json = await res.json()

let txt = `╭━━❰ 🌟 𝗜𝗡𝗙𝗢 𝗗𝗘𝗟 𝗦𝗖𝗥𝗜𝗣𝗧 🌟 ❱━━⬣\n`
txt += `┃✨ 𝙉𝙤𝙢𝙗𝙧𝙚: *${json.name}*\n`
txt += `┃👁️‍🗨️ 𝙑𝙞𝙨𝙞𝙩𝙖𝙨: *${json.watchers_count}*\n`
txt += `┃🧮 𝙋𝙚𝙨𝙤: *${(json.size / 1024).toFixed(2)} MB*\n`
txt += `┃⏰ 𝘼𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙙𝙤: *${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}*\n`
txt += `┃🔗 𝙐𝙧𝙡: ${json.html_url}\n`
txt += `┃🍴 𝙁𝙤𝙧𝙠𝙨: *${json.forks_count}*\n`
txt += `┃🌟 𝙎𝙩𝙖𝙧𝙨: *${json.stargazers_count}*\n`
txt += `╰━━━◇◆◇━━━━━━⬣\n\n`
txt += `> *${dev}*`

await conn.sendMessage(m.chat, {text: txt, contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterName: channelRD.name, newsletterJid: channelRD.id, }, externalAdReply: { title: packname, body: dev, thumbnailUrl: 'https://files.catbox.moe/3bmdrm.jpg', sourceUrl: redes, mediaType: 1, renderLargerThumbnail: true }}}, {quoted: m})

} catch {
await conn.reply(m.chat, `${msm} Ocurrió un error.`, m)
await m.react(error)
}}

handler.help = ['script']
handler.tags = ['main']
handler.command = ['script', 'sc']
handler.register = true

export default handler
