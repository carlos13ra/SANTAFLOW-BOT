// by dv.shadow - https://github.com/Yuji-XDev

import { proto } from '@whiskeysockets/baileys';
import PhoneNumber from 'awesome-phonenumber';

const handler = async (m, { conn }) => {
  const name = '🌱 CARLOS- CREADOR ⚡';
  const numCreador = '51984169553';
  const empresa = ' SANTAFLOW Bot Inc.';
  const about = '🧪 Desarrollador de SANTAFLOW BOT- MD';
  const correo = 'carlosramirezvillanueva30@gmail.com';
  const web = 'https://gituhb.com/carlos13ra';
  const direccion = 'Tokyo, Japón 🇯🇵';
  const fotoPerfil = 'https://files.catbox.moe/fft2hr.jpg';

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
ORG:${empresa}
TITLE:CEO & Fundador
TEL;waid=${numCreador}:${new PhoneNumber('+' + numCreador).getNumber('international')}
EMAIL:${correo}
URL:${web}
NOTE:${about}
ADR:;;${direccion};;;;
X-ABADR:ES
X-WA-BIZ-NAME:${name}
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD`.trim();

  const contactMessage = {
    displayName: name,
    vcard
  };

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [contactMessage]
    },
    contextInfo: {
      externalAdReply: {
        title: '🧪 Contacto del Creador 🔥',
        body: 'Toca aquí para guardar el contacto o hablar con él',
        mediaType: 1,
        thumbnailUrl: fotoPerfil,
        renderLargerThumbnail: true,
        sourceUrl: web
      }
    }
  }, { quoted: m });
};

handler.help = ['creador'];
handler.tags = ['info'];
handler.command = ['creador', 'creator', 'owner'];
export default handler;
