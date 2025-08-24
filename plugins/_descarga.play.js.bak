
import yts from "yt-search";

const ytIdRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const toSansSerifPlain = (text = "") =>
  text.split("").map((char) => {
    const map = {
      a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
      j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
      s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
      A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨",
      J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
      S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
      0: "𝟢", 1: "𝟣", 2: "𝟤", 3: "𝟥", 4: "𝟦", 5: "𝟧", 6: "𝟨", 7: "𝟩", 8: "𝟪", 9: "𝟫"
    };
    return map[char] || char;
  }).join("");

const formatViews = (views) => {
  if (!views) return "Desconocido";
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`;
  return views.toString();
};

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(toSansSerifPlain("✦ Ingresa el nombre o link de un video."));

  await conn.sendMessage(m.chat, { react: { text: "🕐", key: m.key } });

  let video;
  try {
    const ytId = ytIdRegex.exec(text);
    const search = ytId ? await yts({ videoId: ytId[1] }) : await yts(text);
    video = ytId ? search.video : search.all[0];
  } catch {
    return m.reply(toSansSerifPlain("✦ Error al buscar el video."));
  }

  if (!video) return m.reply(toSansSerifPlain("✦ No se encontró el video."));

  const { title, timestamp, views, url, thumbnail, author, ago } = video;

  const caption = [
    "✧─── ･ ｡ﾟ★: .✦ . :★. ───✧",
    "⧼ ᰔᩚ ⧽  M U S I C  -  Y O U T U B E",
    "",
    `» ✧🌱 « *${title}*`,
    `> ➩ Canal › *${author.name}*`,
    `> ➩ Duración › *${timestamp}*`,
    `> ➩ Vistas › *${formatViews(views)}*`,
    `> ➩ Publicado › *${ago || "desconocido"}*`,
    `> ➩ Link › *${url}*`,
    "",
    "> ✰ Responde con *audio* o *video* para descargar ✧"
  ].join("\n");

  let msg = await conn.sendMessage(m.chat, {
    image: { url: thumbnail },
    caption
  }, { quoted: m });


  conn.playContext = conn.playContext || {};
  conn.playContext[msg.key.id] = { url };
};

handler.command = ["play"];
export default handler;

// ---------------------------------------------
// Capturador de respuestas
let before = async (m, { conn }) => {
  if (!m.quoted) return;
  if (!conn.playContext) return;

  let ctx = conn.playContext[m.quoted.id];
  if (!ctx) return;

  let txt = m.text.trim().toLowerCase();

  if (txt === "audio") {
    // redirige al plugin ytmp3
    m.text = ctx.url;
    conn.plugins["ytmp3"]?.(m, { conn, text: ctx.url, args: [ctx.url], command: "ytmp3", usedPrefix: "." });
  } else if (txt === "video") {
    // redirige al plugin ytmp4
    m.text = ctx.url;
    conn.plugins["ytmp4"]?.(m, { conn, text: ctx.url, args: [ctx.url], command: "ytmp4", usedPrefix: "." });
  }
};

export { before };