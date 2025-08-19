import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m
handler.all = async function (m) {

global.getBuffer = async function getBuffer(url, options) {
try {
options ? options : {}
var res = await axios({
method: "get",
url,
headers: {
'DNT': 1,
'User-Agent': 'GoogleBot',
'Upgrade-Insecure-Request': 1
},
...options,
responseType: 'arraybuffer'
})
return res.data
} catch (e) {
console.log(`Error : ${e}`)
}}
  
global.creador = 'wa.me/51946200884'
global.ofcbot = `${conn.user.jid.split('@')[0]}`
global.namechannel = '=͟͟͞Santaflow bot • 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⌺'
global.namechannel2 = '=͟͟͞Santaflow bot • 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⌺'
global.namegrupo = '=͟͟͞Santaflow bot • 𝒐𝒇𝒊𝒄𝒊𝒂𝒍 ⌺'
global.namecomu = '=͟͟͞Santaflow bot • 𝑪𝒐𝒎𝒖𝒏𝒊𝒕𝒚 ˟꘏꙳'
global.listo = '- 🌀 *𝐓𝐔 𝐏𝐀𝐍𝐄𝐋 𝐄𝐒𝐓𝐀 𝐋𝐈𝐒𝐓𝐎...*'
global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://files.catbox.moe/vm6opf.jpg')

global.canalIdM = ["120363402079893698@newsletter", "120363402079893698@newsletter", "120363401008003732@newsletter"]
global.canalNombreM = ["  ꙰⃟⛅  santaflow ᵇᵒᵗ | ° ᴄʜᴀɴɴᴇʟ ᵒᶠⁱᶜⁱᵃˡ  🧪꙰⃟⸙", "⟬ ᳞ꪳ⃟ 𖤐 𝙎ANTAFLOW BOT 𝘾𝙃𝘼𝙉𝙉𝙀𝙇 ᴼᶠᴵᶜᴵᴬᴸ𖤐 ᳞ꪳ⃟ ⟭", "✦ 𝗥𝗶𝗻 𝗜𝘁𝗼𝘀𝗵𝗶 - 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 ✦"]
global.channelRD = await getRandomChannel()

global.d = new Date(new Date + 3600000)
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, {weekday: 'long'})
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'})
global.mes = d.toLocaleDateString('es', {month: 'long'})
global.año = d.toLocaleDateString('es', {year: 'numeric'})
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})

global.rwait = '🕒'
global.done = '✅'
global.error = '✖️'
global.msm = '⚠︎'

global.emoji = '🍀'
global.emoji2 = '🌾'
global.emoji3 = '👻'
global.emoji4 = '✧'
global.emoji5 = '🌲''
global.emoji6 = '★'
global.emojis = [emoji, emoji2, emoji3, emoji4, emoji5, emoji6].getRandom()

global.wait = '✧͢☁️ 𝐏𝐑𝐎𝐂𝐄𝐒𝐀𝐍𝐃𝐎...⚙️༄  \n=͟͟͞💠 𝑬𝒔𝒑𝒆𝒓𝒆 𝒑𝒐𝒓 𝒇𝒂𝒗𝒐𝒓...';
global.waitt = '✧͢☁️ 𝐏𝐑𝐎𝐂𝐄𝐒𝐀𝐍𝐃𝐎...⚙️༄  \n=͟͟͞💠 𝑬𝒔𝒑𝒆𝒓𝒆 𝒑𝒐𝒓 𝒇𝒂𝒗𝒐𝒓...';
global.waittt = '✧͢☁️ 𝐏𝐑𝐎𝐂𝐄𝐒𝐀𝐍𝐃𝐎...⚙️༄  \n=͟͟͞💠 𝑬𝒔𝒑𝒆𝒓𝒆 𝒑𝒐𝒓 𝒇𝒂𝒗𝒐𝒓...';
global.waitttt = '✧͢☁️ 𝐏𝐑𝐎𝐂𝐄𝐒𝐀𝐍𝐃𝐎...⚙️༄  \n=͟͟͞💠 𝑬𝒔𝒑𝒆𝒓𝒆 𝒑𝒐𝒓 𝒇𝒂𝒗𝒐𝒓...';


var canal = 'https://whatsapp.com/channel/0029Vb6iXGDISTkKY8fxUa39'  
var comunidad = 'https://whatsapp.com/channel/0029Vb6iXGDISTkKY8fxUa39'
var git = 'https://github.com/Yuji-XDev'
var github = 'https://github.com/Yuji-XDev/SukunaBot-V2'
var tiktok = 'https://www.tiktok.com/@carlos.ramirez.fc13?_t=ZS-8yloqqAfxkP&_r=1'
let correo = 'blackoficial2025@gmail.com'
global.redes = [canal, comunidad, git, github, tiktok, correo].getRandom()

let category = "imagen"
const db = './src/database/db.json'
const db_ = JSON.parse(fs.readFileSync(db))
const random = Math.floor(Math.random() * db_.links[category].length)
const randomlink = db_.links[category][random]
const response = await fetch(randomlink)
const rimg = await response.buffer()
global.icons = rimg

var ase = new Date(); var hour = ase.getHours(); switch(hour){ case 0: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 1: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 2: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 3: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 4: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 5: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 6: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 7: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌅'; break; case 8: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 9: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 10: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 11: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 12: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 13: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 14: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 15: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 16: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 17: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 18: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 19: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 20: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 21: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 22: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 23: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break;}
global.saludo = hour;

global.nombre = m.pushName || 'Anónimo'
global.taguser = '@' + m.sender.split("@s.whatsapp.net")
var more = String.fromCharCode(8206)
global.readMore = more.repeat(850)

global.packsticker = `⬣──🔥 𝙋𝙊𝘿𝙀𝙍 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 ──⬣
👤 𝙉𝙤𝙢𝙗𝙧𝙚: ${nombre}
🤖 𝘽𝙤𝙩 𝘼𝙘𝙩𝙞𝙫𝙤: ${botname}
📆 𝘿𝙞́𝙖: ${fecha}
🕓 𝙃𝙤𝙧𝙖: ${tiempo}`;

global.packsticker2 = `> ⛩️ 𝘾𝙤𝙣 𝙙𝙚𝙙𝙞𝙘𝙖𝙘𝙞𝙤́𝙣 𝙙𝙚: ${dev} ⊰╯`
  
global.fkontak = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {}) }, message: { 'contactMessage': { 'displayName': `${nombre}`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${nombre},;;;\nFN:${nombre},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': null, thumbnail: null,sendEphemeral: true}}}

global.fake = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, newsletterName: channelRD.name, serverMessageId: -1 }
}}, { quoted: m }

global.icono = [
'https://i.postimg.cc/4dL4Wd8L/IMG-20250808-WA0306-1.jpg'
].getRandom()

//global.rcanal = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, serverMessageId: 100, newsletterName: channelRD.name, }, externalAdReply: { showAdAttribution: true, title: packname, body: dev, mediaUrl: null, description: null, previewType: "PHOTO", thumbnailUrl: icono, sourceUrl: redes, mediaType: 1, renderLargerThumbnail: true }, }, }}

global.rcanal = {contextInfo: {forwardingScore: 2025, isForwarded: true, externalAdReply: {title: packname, body: 'SUKUNA - ULTRA', sourceUrl: redes, thumbnailUrl: icono}}}
}


export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalIdM.length)
let id = canalIdM[randomIndex]
let name = canalNombreM[randomIndex]
return { id, name }
}
