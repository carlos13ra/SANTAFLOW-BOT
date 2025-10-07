import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let pp = await conn.profilePictureUrl(who, 'image').catch((_) => 'https://files.catbox.moe/xr2m6u.jpg')
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)


  if (user.registered) {
   const texto = `✧━━━━〔 ⚠ ＡＶＩＳＯ ⚠ 〕━━━━✧
*🚫 Ya cuentas con un registro activo...*
¿ 𝚀𝚞𝚒𝚎𝚛𝚎𝚜 𝚛𝚎𝚐𝚒𝚜𝚝𝚛𝚊𝚛𝚝𝚎 𝚗𝚞𝚎𝚟𝚊𝚖𝚎𝚗𝚝𝚎?

🎋 Usa *#unreg* para borrar tu registro y comenzar otra vez.
✧━━━━━━━━━━━━━━━━━━✧`;

    const botones = [
      { buttonId: `${usedPrefix}ping`, buttonText: { displayText: '🌳 Velocidad del Bot' }, type: 1 },
      { buttonId: `${usedPrefix}unreg`, buttonText: { displayText: '🌷 Unreg' }, type: 1 },
    ];

    return await conn.sendMessage(m.chat, {
      image: { url: icono },
      caption: texto,
      mentions: [m.sender],
      footer: '˜”*°•.˜”*°• RIN ITOSHI BOT •°*”˜.•°*”˜',
      buttons: botones,
      headerType: 4,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: 100,
          newsletterName: channelRD.name
        }
      }
    }, { quoted: m });
 }
  
   if (!Reg.test(text)) {
     const mensaje = `✦・🍂  ᴇʟ ᴄᴏᴍᴀɴᴅᴏ ɪɴɢʀᴇsᴀᴅᴏ ᴇs ɪɴᴄᴏʀʀᴇᴄᴛᴏ
┈┈┈┈┈┈┈┈┈┈
↳ Úsalo así:
   ${usedPrefix + command} nombre.edad

🎄 Ejemplo:
   ${usedPrefix + command} ${name2}.18
┈┈┈┈┈┈┈┈┈┈`;

     const botones = [
       { buttonId: `${usedPrefix}reg ${name2}.18`, buttonText: { displayText: '🖍️ Auto Verificación' }, type: 1 },
       { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '🎲 Menu All' }, type: 1 },
     ];

    return await conn.sendMessage(m.chat, {
      image: { url: icono },
      caption: mensaje,
      mentions: [m.sender],
      footer: '˜”*°•.˜”*°• RIN ITOSHI BOT •°*”˜.•°*”˜',
      buttons: botones,
      headerType: 4,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: 100,
          newsletterName: channelRD.name
        }
      }
    }, { quoted: m });
  }

  let hora = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
    
  let fechaObj = new Date();
  let fecha = fechaObj.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' });
  let dia = fechaObj.toLocaleDateString('es-PE', { weekday: 'long', timeZone: 'America/Lima' });

  let [_, name, splitter, age] = text.match(Reg)
  if (!name) return m.reply(`*『✦』El nombre no puede estar vacío.*`)
  if (!age) return m.reply(`*『✦』La edad no puede estar vacía.*`)
  if (name.length >= 100) return m.reply(`*『✦』El nombre es demasiado largo.*`)
  age = parseInt(age)
  if (age > 1000) return m.reply(`*『✦』Wow el abuelo quiere jugar al bot.*`)
  if (age < 5) return m.reply(`*『✦』hay un abuelo bebé jsjsj.*`)

  user.name = `${name} ✓`
  user.age = age
  user.regTime = + new Date      
  user.registered = true
  user.coin = (user.coin || 0) + 40
  user.exp = (user.exp || 0) + 300
  user.joincount = (user.joincount || 0) + 20

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  let regbot = `✅ VERIFICACIÓN EXITOSA ✅
───────────────────
· › 🌷 \`NOMBRE\` » *${name}*
· › 🌀 \`EDAD\` » *${age} años*
───────────────────
· › 🕸️ \`FECHA\` » *${fecha}*
· › 🐋 \`HORA\` » *${hora}*
· › 🌿 \`DIA\` » *${dia}*
───────────────────
• 🍹 RECOMPENSAS 🧪
· › 🪙 \`COINS:\` *+40*
· › 🏮 \`EXP:\` *+300*
· › 🔰 \`TOKENS:\` *+20*
───────────────────`.trim();

  await m.react?.('📩')

  await conn.sendMessage(
    m.chat,
    {
      image: { url: pp },
      caption: regbot,
      contextInfo: {
      mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: 100,
          newsletterName: channelRD.name
        },
        externalAdReply: {
          title: '✦͢🌹⌗ 𝐔𝐒𝐔𝐀𝐑𝐈𝐎 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐃𝐎 💎✨',
          body: '꒰🍃꒱ ᴛᴜ ᴄᴜᴇɴᴛᴀ ʜᴀ ꜱɪᴅᴏ ᴀᴄᴛɪᴠᴀᴅᴀ ᴄᴏɴ éꜱᴇxɪᴛᴏ\n☯︎ ʙʏ: 𝑺𝒉𝒂𝑫𝒐𝒘•𝑪𝒐𝒓𝒆',
          mediaType: 1,
          thumbnailUrl: icono,
          mediaUrl: redes,
          sourceUrl: redes,
          renderLargerThumbnail: true
        }
      }
    },
    { quoted: m });
  };

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'] 

export default handler