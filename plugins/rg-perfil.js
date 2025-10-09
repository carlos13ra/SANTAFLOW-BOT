import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
try {
if (!global.db.data.users) global.db.data.users = {}
if (!global.db.data.characters) global.db.data.characters = {}

let mentioned = m.mentionedJid && m.mentionedJid[0]
let userId = mentioned || (m.quoted ? m.quoted.sender : m.sender)
let user = global.db.data.users[userId] || {}
let name

try {
  name = (await conn.getName(userId)) || userId.split('@')[0]
} catch {
  name = userId.split('@')[0]
}

const cumpleanos = user.birth || 'Sin especificar :< (#setbirth)'
const genero = user.genre || 'Sin especificar'
const pareja = user.marry
const casado = pareja
  ? (global.db.data.users[pareja]?.name?.trim() ||
      (await conn.getName(pareja).catch(() => pareja.split('@')[0])))
  : 'Nadie'
const description = user.description || 'Sin descripción :v'

const exp = user.exp || 0
const nivel = user.level || 0
const coin = user.coin || 0
const bank = user.bank || 0
const total = coin + bank
const currency = 'coins'

const sorted = Object.entries(global.db.data.users)
  .map(([k, v]) => ({ ...v, jid: k }))
  .sort((a, b) => (b.level || 0) - (a.level || 0))
const rank = sorted.findIndex(u => u.jid === userId) + 1

const datos = xpRange(nivel, global.multiplier)
const progreso = `${exp - datos.min} / ${datos.xp} _(${Math.floor(((exp - datos.min) / datos.xp) * 100)}%)_`

const premium = user.premium || global.prems?.map(v => v.replace(/\D+/g, '') + '@s.whatsapp.net').includes(userId)
const tiempoPremium = premium
  ? user.premiumTime
    ? await formatTime(user.premiumTime - Date.now())
    : 'Permanente'
  : '—'

const favId = user.favorite
const favLine = favId && global.db.data.characters?.[favId]
  ? `\n๑ Claim favorito » *${global.db.data.characters[favId].name || '???'}*`
  : ''

const ownedIDs = Object.entries(global.db.data.characters)
  .filter(([, c]) => c.user === userId)
  .map(([id]) => id)
const haremCount = ownedIDs.length
const haremValue = ownedIDs.reduce((acc, id) => {
  const char = global.db.data.characters[id] || {}
  return acc + (typeof char.value === 'number' ? char.value : 0)
}, 0)

const pp = await conn.profilePictureUrl(userId, 'image').catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

const text = `
╭━━━〔 *💫 PERFIL DE ${name.toUpperCase()}* 〕━━⬣
┃
┃ 🪷 *Descripción:* ${description}
┃ 🎂 *Cumpleaños:* ${cumpleanos}
┃ ⚥ *Género:* ${genero}
┃ 💍 *Casado con:* ${casado}
┃
┃ 💢 *Nivel:* ${nivel}
┃ 🧭 *Experiencia:* ${exp.toLocaleString()}
┃ 🧱 *Progreso:* ${progreso}
┃ 🏆 *Puesto global:* #${rank}
┃
┃ 💎 *Premium:* ${premium ? `✔️ (${tiempoPremium})` : '✖️'}
┃ 💰 *Coins:* ${coin.toLocaleString()} + Banco ${bank.toLocaleString()}
┃ 🏦 *Total:* ${total.toLocaleString()} ${currency}
┃
┃ 💞 *Harem:* ${haremCount} personajes
┃ 💎 *Valor total:* ${haremValue.toLocaleString()}
${favLine}
┃
┃ 📊 *Comandos usados:* ${user.commands || 0}
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`


await conn.sendMessage(
  m.chat,
  { image: { url: pp }, caption: text.trim(), mentions: [userId] },
  { quoted: fkontak }
)

} catch (error) {
console.error(error)
await m.reply(`⚠️ *Ocurrió un error inesperado.*\n> Usa *${usedPrefix}report ${command}* para informarlo.\n\n🧩 ${error.message}`)
}
}

handler.help = ['profile', 'perfil']
handler.tags = ['rg']
handler.command = ['profile', 'perfil', 'perfíl']
handler.group = true

export default handler

async function formatTime(ms) {
let s = Math.floor(ms / 1000),
  m = Math.floor(s / 60),
  h = Math.floor(m / 60),
  d = Math.floor(h / 24)
let months = Math.floor(d / 30),
  weeks = Math.floor((d % 30) / 7)
s %= 60
m %= 60
h %= 24
d %= 7
let t = months
  ? [`${months} mes${months > 1 ? 'es' : ''}`]
  : weeks
  ? [`${weeks} semana${weeks > 1 ? 's' : ''}`]
  : d
  ? [`${d} día${d > 1 ? 's' : ''}`]
  : []
if (h) t.push(`${h} hora${h > 1 ? 's' : ''}`)
if (m) t.push(`${m} minuto${m > 1 ? 's' : ''}`)
if (s) t.push(`${s} segundo${s > 1 ? 's' : ''}`)
return t.length > 1 ? t.slice(0, -1).join(' ') + ' y ' + t.slice(-1) : t[0]
}