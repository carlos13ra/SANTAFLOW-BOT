import fs from 'fs'
import fetch from 'node-fetch'
import { WAMessageStubType } from '@whiskeysockets/baileys'

// === FUNCIÓN AUXILIAR: DETECTAR PAÍS POR NÚMERO ===
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
  const match = Object.keys(prefijos).find(p => numero.startsWith(p))
  return match ? prefijos[match] : '🌍 Desconocido'
}

// === FUNCIÓN: BIENVENIDA ===
async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`
  const pais = detectarPaisPorNumero(userId)
  const pp = await conn.profilePictureUrl(userId, 'image')
    .catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

  const fecha = new Date().toLocaleDateString("es-ES", {
    timeZone: "America/Mexico_City",
    day: 'numeric', month: 'long', year: 'numeric'
  })
  const groupSize = groupMetadata.participants.length + 1
  const desc = groupMetadata.desc?.toString() || 'Sin descripción'

  const mensaje = (chat.sWelcome || 'Edita con el comando "setwelcome"')
    .replace(/{usuario}/g, username)
    .replace(/{grupo}/g, `*${groupMetadata.subject}*`)
    .replace(/{desc}/g, desc)

  // Imagen desde la API Eliasaryt
  const imageUrl = `https://api-nv.eliasaryt.pro/api/generate/welcome2?username=${encodeURIComponent(username)}&guildName=${encodeURIComponent(groupMetadata.subject)}&memberCount=${groupSize}&avatar=${encodeURIComponent(pp)}&background=https://files.catbox.moe/7cckvp.jpg&key=hYSK8YrJpKRc9jSE`

  const caption = `
❀ Bienvenido a *"_${groupMetadata.subject}_"*
✰ _Usuario_ » ${username}
● ${mensaje}
◆ _Ahora somos ${groupSize} Miembros._
ꕥ Fecha » ${fecha}
🌎 País » ${pais}
૮꒰ ˶• ᴗ •˶꒱ა ¡Disfruta tu estadía en el grupo!
> *➮ Usa _#help_ para ver la lista de comandos.*
`.trim()

  return { image: imageUrl, caption, mentions: [userId] }
}

// === FUNCIÓN: DESPEDIDA (MEJORADA Y CON RESPALDO) ===
async function generarDespedida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`
  const pais = detectarPaisPorNumero(userId)
  const pp = await conn.profilePictureUrl(userId, 'image')
    .catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

  const fecha = new Date().toLocaleDateString("es-ES", {
    timeZone: "America/Mexico_City",
    day: 'numeric', month: 'long', year: 'numeric'
  })
  const groupSize = groupMetadata.participants.length - 1
  const desc = groupMetadata.desc?.toString() || 'Sin descripción'

  const mensaje = (chat.sBye || 'Edita con el comando "setbye"')
    .replace(/{usuario}/g, username)
    .replace(/{grupo}/g, groupMetadata.subject)
    .replace(/{desc}/g, desc)

  let imageBuffer

  // === PRIMERA OPCIÓN: API DE Siputzx ===
  try {
    const apiUrl = `https://api.siputzx.my.id/api/canvas/goodbyev5?username=${encodeURIComponent(username)}&guildName=${encodeURIComponent(groupMetadata.subject)}&memberCount=${groupSize}&avatar=${encodeURIComponent(pp)}&background=${encodeURIComponent('https://files.catbox.moe/7cckvp.jpg')}&quality=90`
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`Error ${res.status}`)

    const arrayBuffer = await res.arrayBuffer()
    imageBuffer = Buffer.from(arrayBuffer)

  } catch (err) {
    console.warn('⚠️ Falló la API de Siputzx, usando respaldo Eliasaryt:', err.message)

    // === SEGUNDA OPCIÓN: API de Eliasaryt (Respaldo) ===
    try {
      const fallbackUrl = `https://api-nv.eliasaryt.pro/api/generate/goodbye2?username=${encodeURIComponent(username)}&guildName=${encodeURIComponent(groupMetadata.subject)}&memberCount=${groupSize}&avatar=${encodeURIComponent(pp)}&background=https://i.ibb.co/4YBNyvP/images-76.jpg&key=hYSK8YrJpKRc9jSE`
      const res2 = await fetch(fallbackUrl)
      if (!res2.ok) throw new Error(`Error ${res2.status}`)

      const arrayBuffer2 = await res2.arrayBuffer()
      imageBuffer = Buffer.from(arrayBuffer2)

    } catch (err2) {
      console.error('🚫 Ambas APIs fallaron, usando imagen por defecto:', err2.message)
      const fallback = 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg'
      const fallbackRes = await fetch(fallback)
      const buf = await fallbackRes.arrayBuffer()
      imageBuffer = Buffer.from(buf)
    }
  }

  const caption = `
❀ Adiós de *"_${groupMetadata.subject}_"*
✰ _Usuario_ » ${username}
● ${mensaje}
◆ _Ahora somos ${groupSize} Miembros._
ꕥ Fecha » ${fecha}
🌎 País » ${pais}
(˶˃⤙˂˶) ¡Te esperamos pronto!
> *➮ Usa _#help_ para ver la lista de comandos.*
`.trim()

  return { image: imageBuffer, caption, mentions: [userId] }
}

// === HANDLER PRINCIPAL ===
let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0

  const chat = global.db.data.chats[m.chat]
  const userId = m.messageStubParameters[0]
  if (!userId) return

  const primaryBot = chat.primaryBot
  if (primaryBot && conn.user.jid !== primaryBot) throw !1

  // === BIENVENIDA ===
  if (chat.welcome && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const { image, caption, mentions } = await generarBienvenida({ conn, userId, groupMetadata, chat })
    rcanal.contextInfo.mentionedJid = mentions
    await conn.sendMessage(m.chat, { image: { url: image }, caption, ...rcanal }, { quoted: fkontak })
  }

  // === DESPEDIDA ===
  if (chat.welcome && (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {

    const { image, caption, mentions } = await generarDespedida({ conn, userId, groupMetadata, chat })
    rcanal.contextInfo.mentionedJid = mentions
    await conn.sendMessage(m.chat, { image, caption, ...rcanal }, { quoted: fkontak })
  }
}

export { generarBienvenida, generarDespedida }
export default handler