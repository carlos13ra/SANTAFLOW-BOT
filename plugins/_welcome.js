import fs from 'fs'
import fetch from 'node-fetch'
import { WAMessageStubType } from '@whiskeysockets/baileys'

function detectarPaisPorNumero(jid) {
  const numero = jid.replace('@s.whatsapp.net', '')
  const prefijos = {
    '52': '🇲🇽 México', '54': '🇦🇷 Argentina', '57': '🇨🇴 Colombia',
    '51': '🇵🇪 Perú', '591': '🇧🇴 Bolivia', '55': '🇧🇷 Brasil',
    '56': '🇨🇱 Chile', '58': '🇻🇪 Venezuela', '34': '🇪🇸 España',
    '1': '🇺🇸 Estados Unidos', '593': '🇪🇨 Ecuador', '502': '🇬🇹 Guatemala',
    '503': '🇸🇻 El Salvador', '504': '🇭🇳 Honduras', '505': '🇳🇮 Nicaragua',
    '506': '🇨🇷 Costa Rica', '507': '🇵🇦 Panamá', '595': '🇵🇾 Paraguay',
    '598': '🇺🇾 Uruguay', '60': '🇲🇾 Malasia', '62': '🇮🇩 Indonesia',
    '91': '🇮🇳 India'
  }
  return Object.entries(prefijos).find(([p]) => numero.startsWith(p))?.[1] || '🌍 Desconocido'
}

async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`
  const pais = detectarPaisPorNumero(userId)
  const pp = await conn.profilePictureUrl(userId, 'image')
    .catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

  const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Mexico_City" })
  const groupSize = groupMetadata.participants.length + 1
  const desc = groupMetadata.desc?.toString() || 'Sin descripción'

  const mensaje = (chat.sWelcome || '¡Bienvenido {usuario}!')
    .replace(/{usuario}/g, username)
    .replace(/{grupo}/g, `*${groupMetadata.subject}*`)
    .replace(/{desc}/g, desc)

  const caption = `
❀ *Bienvenido a ${groupMetadata.subject}*
✰ _Usuario_ » ${username}
● ${mensaje}
◆ _Ahora somos ${groupSize} Miembros._
ꕥ Fecha » ${fecha}
🌎 País » ${pais}
> Usa *#help* para ver los comandos.
`.trim()

  return { image: pp, caption, mentions: [userId] }
}

async function generarDespedida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`
  const pais = detectarPaisPorNumero(userId)
  const pp = await conn.profilePictureUrl(userId, 'image')
    .catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

  const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Mexico_City" })
  const groupSize = groupMetadata.participants.length - 1
  const desc = groupMetadata.desc?.toString() || 'Sin descripción'

  const mensaje = (chat.sBye || 'Adiós {usuario}.')
    .replace(/{usuario}/g, username)
    .replace(/{grupo}/g, groupMetadata.subject)
    .replace(/{desc}/g, desc)

  const caption = `
❀ *Adiós de ${groupMetadata.subject}*
✰ _Usuario_ » ${username}
● ${mensaje}
◆ _Ahora somos ${groupSize} Miembros._
ꕥ Fecha » ${fecha}
🌎 País » ${pais}
`.trim()

  return { image: pp, caption, mentions: [userId] }
}

let handler = m => m
handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0

  const chat = global.db.data.chats[m.chat]
  const userId = m.messageStubParameters[0]
  if (!userId) return

  if (chat.primaryBot && conn.user.jid !== chat.primaryBot) return !1

  // Bienvenida
  if (chat.welcome && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const { image, caption, mentions } = await generarBienvenida({ conn, userId, groupMetadata, chat })
    await conn.sendMessage(m.chat, { image: { url: image }, caption, mentions }, {})
  }

  // Despedida
  if (chat.welcome && (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {

    const { image, caption, mentions } = await generarDespedida({ conn, userId, groupMetadata, chat })
    await conn.sendMessage(m.chat, { image: { url: image }, caption, mentions }, {})
  }
}

export { generarBienvenida, generarDespedida }
export default handler