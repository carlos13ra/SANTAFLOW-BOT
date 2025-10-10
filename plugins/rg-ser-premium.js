import fetch from 'node-fetch'

const pHora = 1000
const pDia = 10000
const pSemana = 25000
const pMes = 50000

const cHora = 20
const cDia = 200
const cSemana = 500
const cMes = 1000

let handler = async (m, { conn, usedPrefix, command, args }) => {
  const currency = 'Yenes'
  const user = global.db.data.users[m.sender]
  if (typeof user.coin !== 'number') user.coin = 0
  if (typeof user.premiumTime !== 'number') user.premiumTime = 0
  if (typeof user.premium !== 'boolean') user.premium = false

  const texto = `✐ Opciones disponibles para comprar premium:

° *h* → Horas = ${pHora} ${currency}
° *d* → Días = ${pDia} ${currency}
° *s* → Semanas = ${pSemana} ${currency}
° *m* → Meses = ${pMes} ${currency}

✧ Ejemplo:
${usedPrefix + command} 1 h → 1 hora premium
${usedPrefix + command} 2 d → 2 días premium
${usedPrefix + command} 1 s → 1 semana premium
${usedPrefix + command} 1 m → 1 mes premium`

  if (!args[0]) return conn.reply(m.chat, texto, m, fkontak)

  if (isNaN(args[0])) return conn.reply(m.chat, `ꕥ Solo se aceptan números.\n> Ejemplo: *${usedPrefix + command} 1 h*`, m, fkontak)

  const cantidad = parseInt(args[0])
  const tipo = (args[1] || '').toLowerCase() || 'h'

  const precios = { h: pHora, d: pDia, s: pSemana, m: pMes }
  const comisiones = { h: cHora, d: cDia, s: cSemana, m: cMes }
  const tipos = { h: 'Hora(s)', d: 'Día(s)', s: 'Semana(s)', m: 'Mes(es)' }

  if (!precios[tipo]) return conn.reply(m.chat, `ꕥ Formato no válido. Opciones: *h, d, s, m*`, m, fkontak)

  const precio = precios[tipo]
  const comision = comisiones[tipo]
  const total = (precio + comision) * cantidad

  if (user.coin < total) return conn.reply(m.chat, `ꕥ No tienes suficientes ${currency} para comprar la membresía premium.`, m, fkontak)

  const tiempoMs = {
    h: 3600000,
    d: 86400000,
    s: 604800000,
    m: 2592000000
  }[tipo] * cantidad

  const ahora = Date.now()
  if (ahora < user.premiumTime) user.premiumTime += tiempoMs
  else user.premiumTime = ahora + tiempoMs
  user.premium = true
  user.coin -= total

  const name = (await conn.getName(m.sender)) || m.pushName || 'Usuario'

  const resumen = `
\`\`\`乂 ¡BUY - PREMIUM! 乂\`\`\`

ᰔᩚ Usuario » ${name}
ⴵ Tiempo Premium » ${cantidad} ${tipos[tipo]}
✦ Total pagado » ${total} ${currency}
⛁ Monedas restantes » ${user.coin}
✧ Comisión » -${comision * cantidad} (incluida)
`

  await conn.sendMessage(m.chat, { text: resumen, mentions: [m.sender] }, { quoted: fkontak })
  await m.react('✅')
}

handler.help = ['vip', 'premium', 'prem']
handler.tags = ['rg']
handler.command = ['vip', 'premium', 'prem']

export default handler