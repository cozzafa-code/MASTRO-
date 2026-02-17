
'use client';
import { useState, useRef } from "react";

/* ═══ MASTRO MISURE v6 ═══
   + 3 Temi (Cantiere Dark / Chiaro / Blu Notte)
   + Nuovo Cliente + Nuova Commessa
   + AI "Ask MASTRO"
   + Disegno pennino + Accessori flag
   + Pipeline CHI/DOVE/COSA + Messaggi + Stato Cliente
*/

const FONT_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,300&family=JetBrains+Mono:wght@400;600&display=swap";

/* ── TEMI ── */
const THEMES = {
  dark: { name: "Cantiere Dark", emoji: "🌙",
    bg: "#0b0d12", bg2: "#10131a", card: "#161a24", card2: "#1c2130",
    bdr: "#222839", bdrL: "#2c3347", text: "#eeeae4", sub: "#858b9f", sub2: "#4f5568",
    acc: "#f0a820", accD: "#c48418", accLt: "rgba(240,168,32,0.12)",
    grn: "#2dd4a0", grnLt: "rgba(45,212,160,0.10)", red: "#ef6868", redLt: "rgba(239,104,104,0.10)",
    blue: "#5c9ff8", blueLt: "rgba(92,159,248,0.10)", purple: "#a07cf8", purpleLt: "rgba(160,124,248,0.10)",
    white08: "rgba(255,255,255,0.08)", white04: "rgba(255,255,255,0.04)",
  },
  light: { name: "Chiaro", emoji: "☀️",
    bg: "#f5f5f0", bg2: "#ffffff", card: "#ffffff", card2: "#f8f8f5",
    bdr: "#e0ddd5", bdrL: "#d0cdc5", text: "#1a1a1a", sub: "#666660", sub2: "#999990",
    acc: "#e09010", accD: "#c07808", accLt: "rgba(224,144,16,0.10)",
    grn: "#1a9e73", grnLt: "rgba(26,158,115,0.08)", red: "#dc4444", redLt: "rgba(220,68,68,0.08)",
    blue: "#3b7fe0", blueLt: "rgba(59,127,224,0.08)", purple: "#7c5ce0", purpleLt: "rgba(124,92,224,0.08)",
    white08: "rgba(0,0,0,0.06)", white04: "rgba(0,0,0,0.03)",
  },
  midnight: { name: "Blu Notte", emoji: "🌊",
    bg: "#0a1628", bg2: "#0e1d35", card: "#132444", card2: "#162a50",
    bdr: "#1e3a6a", bdrL: "#264880", text: "#e8eef8", sub: "#7a95c0", sub2: "#4a6590",
    acc: "#50a0ff", accD: "#3080e0", accLt: "rgba(80,160,255,0.12)",
    grn: "#40d8a8", grnLt: "rgba(64,216,168,0.10)", red: "#ff6070", redLt: "rgba(255,96,112,0.10)",
    blue: "#60b0ff", blueLt: "rgba(96,176,255,0.10)", purple: "#a08fff", purpleLt: "rgba(160,143,255,0.10)",
    white08: "rgba(255,255,255,0.08)", white04: "rgba(255,255,255,0.04)",
  },
};

const Ico = ({ d, size = 20, color = "#858b9f", fill = "none", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);

const ICO = {
  back: "M15 19l-7-7 7-7", plus: "M12 4v16m8-8H4", check: "M5 13l4 4L19 7",
  send: "M12 19V5m0 0l-7 7m7-7l7 7", chevR: "M9 5l7 7-7 7",
  phone: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  nav: "M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  camera: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
  ruler: "M6 2L2 6l12 12 4-4L6 2zm3 7l2 2",
  msg: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  pin: "M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
  clienti: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  pencil: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  undo: "M3 10h10a5 5 0 010 10H9m-6-10l4-4m-4 4l4 4",
  ai: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  close: "M6 18L18 6M6 6l12 12",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  userPlus: "M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m5.5-10a4 4 0 100-8 4 4 0 000 8zM20 8v6m3-3h-6",
};

const OGGI = new Date();
const GG = ["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];
const MM = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
const fmtDate = (d) => `${GG[d.getDay()]} ${d.getDate()} ${MM[d.getMonth()].substring(0,3)} ${d.getFullYear()}`;
const sameDay = (a, b) => a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const TEAM = [
  { id: "fabio", nome: "Fabio", ruolo: "Titolare", avatar: "F", color: "#f0a820" },
  { id: "marco", nome: "Marco", ruolo: "Posatore", avatar: "M", color: "#5c9ff8" },
  { id: "luca", nome: "Luca", ruolo: "Misuratore", avatar: "L", color: "#2dd4a0" },
  { id: "sara", nome: "Sara", ruolo: "Ufficio", avatar: "S", color: "#a07cf8" },
];

const FASI = [
  { id: "sopralluogo", label: "Sopralluogo", icon: "📍", color: "#5c9ff8" },
  { id: "preventivo", label: "Preventivo", icon: "📋", color: "#a07cf8" },
  { id: "misure", label: "Misure", icon: "📐", color: "#f0a820" },
  { id: "ordini", label: "Ordini", icon: "📦", color: "#e879f9" },
  { id: "produzione", label: "Produzione", icon: "⚙️", color: "#fb923c" },
  { id: "posa", label: "Posa", icon: "🔧", color: "#2dd4a0" },
  { id: "chiusura", label: "Chiusura", icon: "✅", color: "#34d399" },
];

const mkPipe = (fase, data) => {
  const p = {}; let found = false;
  FASI.forEach(f => {
    if (f.id === fase) { found = true; p[f.id] = { stato: "in_corso", ...(data[f.id] || {}) }; }
    else if (!found) { p[f.id] = { stato: "completato", ...(data[f.id] || {}) }; }
    else { p[f.id] = { stato: "futuro", responsabile: null, data: null, dove: null, cosa: null, ...(data[f.id] || {}) }; }
  });
  return p;
};

const INIT_CANTIERI = [
  { id: 1, cliente: "Rossi Mario", indirizzo: "Via Roma 12, Cosenza", tel: "333 1234567", vani: 5, faseCorrente: "misure", note: "Appartamento 3° piano.",
    pipeline: mkPipe("misure", { sopralluogo: { responsabile: "fabio", data: "03/02", dove: "Via Roma 12", cosa: "5 vani, PVC bianco." }, preventivo: { responsabile: "sara", data: "05/02", dove: "Ufficio", cosa: "€4.200 accettato." }, misure: { responsabile: "luca", data: "17/02", dove: "Via Roma 12", cosa: "2/5 vani completati." }, ordini: { responsabile: "sara" }, posa: { responsabile: "marco" }, chiusura: { responsabile: "fabio" } }) },
  { id: 2, cliente: "Greco Anna", indirizzo: "C.so Mazzini 45, Rende", tel: "328 9876543", vani: 3, faseCorrente: "preventivo", note: "Cucina + 2 bagni.",
    pipeline: mkPipe("preventivo", { sopralluogo: { responsabile: "fabio", data: "06/02", dove: "C.so Mazzini 45", cosa: "3 finestre." }, preventivo: { responsabile: "sara", data: "10/02", dove: "Ufficio", cosa: "Attesa listino." } }) },
  { id: 3, cliente: "Ferraro Luigi", indirizzo: "Via Caloprese 8, Cosenza", tel: "347 5551234", vani: 8, faseCorrente: "sopralluogo", note: "Villa bifamiliare.",
    pipeline: mkPipe("sopralluogo", { sopralluogo: { responsabile: "fabio", data: "17/02", dove: "Via Caloprese 8", cosa: "Oggi ore 08:30." } }) },
  { id: 4, cliente: "Bruno Teresa", indirizzo: "Via Popilia 102, Cosenza", tel: "339 4449876", vani: 4, faseCorrente: "ordini", note: "Attesa colore.",
    pipeline: mkPipe("ordini", { sopralluogo: { responsabile: "fabio", data: "22/01", dove: "Via Popilia 102", cosa: "4 fin. alluminio." }, preventivo: { responsabile: "sara", data: "24/01", dove: "Ufficio", cosa: "€6.800 accettato." }, misure: { responsabile: "luca", data: "28/01", dove: "Via Popilia 102", cosa: "4/4 OK." }, ordini: { responsabile: "sara", data: "15/02", dove: "Ufficio", cosa: "Attesa RAL." }, posa: { responsabile: "marco" }, chiusura: { responsabile: "fabio" } }) },
  { id: 5, cliente: "Mancini Paolo", indirizzo: "Via Panebianco 33, Cosenza", tel: "366 7773210", vani: 6, faseCorrente: "produzione", note: "Consegna 15/03.",
    pipeline: mkPipe("produzione", { sopralluogo: { responsabile: "fabio", data: "12/01", dove: "Via Panebianco", cosa: "6 PVC." }, preventivo: { responsabile: "sara", data: "14/01", dove: "Ufficio", cosa: "€8.500." }, misure: { responsabile: "luca", data: "18/01", dove: "Via Panebianco", cosa: "6/6." }, ordini: { responsabile: "sara", data: "20/01", dove: "Ufficio", cosa: "Schüco OK." }, produzione: { data: "20/01", dove: "Schüco Padova", cosa: "Consegna 15/03." }, posa: { responsabile: "marco" }, chiusura: { responsabile: "fabio" } }) },
];

const APPUNTAMENTI = [
  { id: 1, cantiereId: 3, ora: "08:30", durata: "1h", tipo: "Sopralluogo", date: new Date(OGGI.getFullYear(), OGGI.getMonth(), OGGI.getDate()), color: "#f0a820" },
  { id: 2, cantiereId: 2, ora: "10:30", durata: "45min", tipo: "Consegna Misure", date: new Date(OGGI.getFullYear(), OGGI.getMonth(), OGGI.getDate()), color: "#5c9ff8" },
  { id: 3, cantiereId: 1, ora: "14:00", durata: "1h30", tipo: "Rilievo Misure", date: new Date(OGGI.getFullYear(), OGGI.getMonth(), OGGI.getDate()), color: "#f0a820" },
];

const INIT_VANI = [
  { id: 1, cantiereId: 1, nome: "Finestra Soggiorno", tipo: "2 ante", stanza: "Soggiorno", misure: { L1: 1400, L2: 1400, L3: 1400, H1: 1600, H2: 1600, H3: 1600, D1: 120, D2: 120, D3: 120 }, foto: 2, completato: true, accessori: { tapparella: true, cassonetto: true } },
  { id: 2, cantiereId: 1, nome: "Portafinestra Camera", tipo: "1 anta", stanza: "Camera", misure: { L1: 900, L2: 900, L3: 900, H1: 2200, H2: 2200, H3: 2200, D1: 100, D2: 100, D3: 100 }, foto: 1, completato: true, accessori: {} },
  { id: 3, cantiereId: 1, nome: "Finestra Bagno", tipo: "Vasistas", stanza: "Bagno", misure: {}, foto: 0, completato: false, accessori: {} },
  { id: 4, cantiereId: 1, nome: "Finestra Cucina", tipo: "2 ante", stanza: "Cucina", misure: {}, foto: 0, completato: false, accessori: {} },
  { id: 5, cantiereId: 1, nome: "Portone Ingresso", tipo: "Blindato", stanza: "Ingresso", misure: {}, foto: 0, completato: false, accessori: {} },
];

const INIT_TASKS = [
  { id: 1, testo: "Metro laser da Rossi", fatto: false, priorita: "alta", data: fmtDate(OGGI) },
  { id: 2, testo: "Colore con Bruno Teresa", fatto: false, priorita: "media", data: fmtDate(OGGI) },
  { id: 3, testo: "Guarnizioni Mancini", fatto: true, priorita: "bassa", data: fmtDate(OGGI) },
  { id: 4, testo: "Foto difetti Popilia", fatto: false, priorita: "alta", data: fmtDate(new Date(OGGI.getTime() + 86400000)) },
];

/* ── AI SYSTEM ── */
const aiSmartFill = (current) => {
  const f = { ...current };
  const avg = (arr) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  const aL = [current.L1, current.L2, current.L3].filter(Boolean);
  const aH = [current.H1, current.H2, current.H3].filter(Boolean);
  const aD = [current.D1, current.D2, current.D3].filter(Boolean);
  if (aL.length > 0) { const a = avg(aL); if (!f.L1) f.L1 = a + Math.round((Math.random()-0.5)*6); if (!f.L2) f.L2 = a; if (!f.L3) f.L3 = a - Math.round((Math.random()-0.5)*6); }
  if (aH.length > 0) { const a = avg(aH); if (!f.H1) f.H1 = a + Math.round((Math.random()-0.5)*8); if (!f.H2) f.H2 = a; if (!f.H3) f.H3 = a - Math.round((Math.random()-0.5)*8); }
  if (aD.length > 0) { const a = avg(aD); if (!f.D1) f.D1 = a; if (!f.D2) f.D2 = a; if (!f.D3) f.D3 = a; }
  return f;
};
const aiCheckAnomalies = (m) => {
  const w = []; const Ls = [m.L1,m.L2,m.L3].filter(Boolean); const Hs = [m.H1,m.H2,m.H3].filter(Boolean); const Ds = [m.D1,m.D2,m.D3].filter(Boolean);
  if (Ls.length >= 2 && Math.max(...Ls) - Math.min(...Ls) > 15) w.push({ t: "warn", m: `⚠️ Larghezze: diff. ${Math.max(...Ls)-Math.min(...Ls)}mm — muro fuori piombo?` });
  if (Hs.length >= 2 && Math.max(...Hs) - Math.min(...Hs) > 15) w.push({ t: "warn", m: `⚠️ Altezze: diff. ${Math.max(...Hs)-Math.min(...Hs)}mm — verificare livello` });
  if (Ls.some(l => l < 300)) w.push({ t: "err", m: "🔴 Larghezza < 300mm — corretto?" });
  if (Hs.some(h => h < 300)) w.push({ t: "err", m: "🔴 Altezza < 300mm — corretto?" });
  if (Ds.some(d => d > 400)) w.push({ t: "warn", m: "⚠️ Profondità > 400mm — cassonetto incluso?" });
  if (w.length === 0 && (Ls.length > 0 || Hs.length > 0)) w.push({ t: "ok", m: "✅ Misure nella norma" });
  return w;
};
const aiPreventivo = (m, tipo, acc) => {
  const L = Math.max(m.L1||0,m.L2||0,m.L3||0), H = Math.max(m.H1||0,m.H2||0,m.H3||0);
  if (!L || !H) return null;
  const mq = (L*H)/1000000; let base = mq * 350;
  if (tipo?.includes("Blind")) base = mq * 600;
  if (tipo?.includes("1 anta")) base *= 0.9;
  let ext = 0;
  if (acc.tapp) ext += mq * 120; if (acc.pers) ext += mq * 180; if (acc.zanz) ext += mq * 60; if (acc.cass) ext += 150;
  const tot = Math.round(base + ext + 80);
  return { mq: mq.toFixed(2), base: Math.round(base), ext: Math.round(ext), tot, iva: Math.round(tot * 1.22) };
};
const aiPhotoScan = () => {
  const bL = 1000 + Math.round(Math.random()*800), bH = 1200 + Math.round(Math.random()*1000), bD = 80 + Math.round(Math.random()*100);
  return { L1: bL+3, L2: bL, L3: bL-2, H1: bH+5, H2: bH, H3: bH-4, D1: bD, D2: bD, D3: bD, conf: 85+Math.round(Math.random()*10), tipo: ["2 ante","1 anta","Vasistas","Scorrevole"][Math.floor(Math.random()*4)] };
};
const aiDrawRecognize = (n) => {
  if (n < 3) return { tipo: "—", conf: 0 };
  if (n <= 5) return { tipo: "Vasistas", conf: 72, desc: "Ribalta dall'alto" };
  if (n <= 10) return { tipo: "1 anta", conf: 78, desc: "Apertura laterale" };
  if (n <= 15) return { tipo: "2 ante", conf: 85, desc: "Due ante simmetriche" };
  return { tipo: "Sagomata", conf: 65, desc: "Tipologia speciale" };
};
const aiVoiceParse = (text) => {
  const r = {}; const nums = text.match(/(\d{3,4})/g);
  if (nums) { const keys = ["L1","L2","L3","H1","H2","H3","D1","D2","D3"]; nums.forEach((n, i) => { if (i < 9) r[keys[i]] = parseInt(n); }); }
  return r;
};
const getAIResponse = (q, cantieri) => {
  const l = q.toLowerCase();
  if (l.includes("rossi")) return "📐 **Rossi Mario** — Misure\n2/5 vani completati\nMancano: Bagno, Cucina, Ingresso\nResp: Luca · Preventivo: €4.200\n\n💡 Completa oggi alle 14:00 → sblocca Ordini";
  if (l.includes("ferraro")) return "📍 **Ferraro Luigi** — Sopralluogo\nOggi 08:30 · Via Caloprese 8\nVilla bifamiliare, 8 vani\nResp: Fabio (tu!)";
  if (l.includes("bruno")) return "📦 **Bruno Teresa** — Ordini\nAttesa colore RAL · €6.800\nResp: Sara";
  if (l.includes("mancini")) return "⚙️ **Mancini** — Produzione\nSchüco Padova → consegna 15/03\nPosa sett. 17-21/03 · Saldo €5.500";
  if (l.includes("greco")) return "📋 **Greco Anna** — Preventivo\nAttesa listino Rehau · 3 finestre\nResp: Sara";
  if (l.includes("oggi") || l.includes("programma") || l.includes("giornata")) return "📅 **Oggi:**\n\n08:30 — 📍 Sopralluogo Ferraro\n→ Via Caloprese 8\n\n10:30 — 📋 Consegna Greco\n→ C.so Mazzini 45\n\n14:00 — 📐 Rilievo Rossi\n→ Via Roma 12 (3 vani)\n\n🗺️ Percorso: Caloprese→Mazzini→Roma\n⏱️ 25 min totali di guida";
  if (l.includes("stato") || l.includes("riepilogo") || l.includes("pipeline")) return "📊 **Pipeline:**\n📍 Sopralluogo: 1 (Ferraro)\n📋 Preventivo: 1 (Greco)\n📐 Misure: 1 (Rossi)\n📦 Ordini: 1 (Bruno)\n⚙️ Produzione: 1 (Mancini)\n\nTotale: " + cantieri.length + " commesse";
  if (l.includes("misure") || l.includes("mancanti")) return "📐 **Misure mancanti:**\nRossi: 3 vani (Bagno, Cucina, Ingresso)\nGreco: 3 vani (tutti)\nFerraro: 8 vani (dopo sopralluogo)\n\n14 vani totali\n💡 Completa Rossi oggi → -21% backlog";
  if (l.includes("preventivo") || l.includes("prezzo") || l.includes("listino")) return "💰 **Listino AI:**\nPVC 2 ante: ~€350/mq\n1 anta: ~€315/mq\nVasistas: ~€280/mq\nPortafinestra: ~€400/mq\n\n+ Tapparella: ~€120/mq\n+ Persiana: ~€180/mq\n+ Zanzariera: ~€60/mq\n+ Cassonetto: ~€150\n+ Posa: ~€80/vano";
  if (l.includes("ottimizza") || l.includes("percorso") || l.includes("route")) return "🗺️ **Percorso ottimizzato:**\n\n1️⃣ 08:30 Ferraro — Via Caloprese\n   ↓ 8 min\n2️⃣ 10:30 Greco — C.so Mazzini\n   ↓ 12 min\n3️⃣ 14:00 Rossi — Via Roma\n\n⏱️ 20 min guida totale\n⛽ ~8 km";
  if (l.includes("sugger") || l.includes("priorit") || l.includes("cosa devo")) return "🎯 **Priorità:**\n\n1. 🔴 Misure Rossi (3 vani) → sblocca Ordini\n2. 🟡 Colore Bruno Teresa → Sara attende\n3. 🟢 Sopralluogo Ferraro 08:30\n\n💡 Completa Rossi → ordini domani";
  return "🤖 **MASTRO AI** — Chiedi:\n\n📋 \"com'è Rossi?\" → stato commessa\n📅 \"cosa ho oggi?\" → programma\n📊 \"riepilogo\" → pipeline\n📐 \"misure mancanti\"\n💰 \"preventivo\" → listino\n🗺️ \"ottimizza percorso\"\n🎯 \"priorità\" → suggerimenti";
};

/* ── Tab Icons ── */
const TabIcoOggi = ({active, T}) => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="2" fill={active ? T.acc : "none"} stroke={active ? T.acc : T.sub2} strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="2" stroke={active ? T.acc : T.sub2} strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="2" stroke={active ? T.acc : T.sub2} strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="2" stroke={active ? T.acc : T.sub2} strokeWidth="1.5"/></svg>);
const TabIcoCal = ({active, T}) => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="3" stroke={active ? T.acc : T.sub2} strokeWidth="1.5"/><path d="M3 9h18" stroke={active ? T.acc : T.sub2} strokeWidth="1.5"/><path d="M8 2v4M16 2v4" stroke={active ? T.acc : T.sub2} strokeWidth="1.5" strokeLinecap="round"/></svg>);
const TabIcoTask = ({active, T}) => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="3" stroke={active ? T.acc : T.sub2} strokeWidth="1.5"/><path d="M8 9l2 2 4-4" stroke={active ? T.acc : T.sub2} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 15h8M8 18h5" stroke={active ? T.acc : T.sub2} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/></svg>);
const TabIcoComm = ({active, T}) => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 7a3 3 0 013-3h12a3 3 0 013 3v2H3V7z" fill={active ? T.acc+"30" : "none"} stroke={active ? T.acc : T.sub2} strokeWidth="1.5"/><rect x="3" y="9" width="18" height="12" rx="0" stroke={active ? T.acc : T.sub2} strokeWidth="1.5"/></svg>);
const TabIcoProf = ({active, T}) => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill={active ? T.acc+"30" : "none"} stroke={active ? T.acc : T.sub2} strokeWidth="1.5"/><path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke={active ? T.acc : T.sub2} strokeWidth="1.5" strokeLinecap="round"/></svg>);

const Avatar = ({ member, size = 28 }) => {
  const m = TEAM.find(t => t.id === member);
  if (!m) return <div style={{ width: size, height: size, borderRadius: size/2, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 700 }}>?</div>;
  return <div style={{ width: size, height: size, borderRadius: size/2, background: m.color + "25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, color: m.color, fontWeight: 700, border: `1.5px solid ${m.color}40`, flexShrink: 0 }}>{m.avatar}</div>;
};

const Toggle = ({ on, onToggle, label, color, T }) => (
  <div onClick={onToggle} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer" }}>
    <span style={{ fontSize: 13, color: on ? T.text : T.sub }}>{label}</span>
    <div style={{ width: 44, height: 24, borderRadius: 12, background: on ? color + "40" : T.white08, padding: 2, transition: "all 0.2s", position: "relative" }}>
      <div style={{ width: 20, height: 20, borderRadius: 10, background: on ? color : T.sub2, transition: "all 0.2s", transform: on ? "translateX(20px)" : "translateX(0)" }} />
    </div>
  </div>
);

/* ═══ MAIN APP ═══ */
export default function MastroMisure() {
  const [theme, setTheme] = useState("dark");
  const T = THEMES[theme];
  const [tab, setTab] = useState("oggi");
  const [screen, setScreen] = useState(null);
  const [selectedCantiere, setSelectedCantiere] = useState(null);
  const [selectedVano, setSelectedVano] = useState(null);
  const [cantieri, setCantieri] = useState(INIT_CANTIERI);
  const [vani, setVani] = useState(INIT_VANI);
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [calMonth, setCalMonth] = useState(new Date(OGGI.getFullYear(), OGGI.getMonth(), 1));
  const [calSelected, setCalSelected] = useState(OGGI);
  const [misureData, setMisureData] = useState({});
  const [activeMisura, setActiveMisura] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [msgText, setMsgText] = useState("");
  const [msgTarget, setMsgTarget] = useState(null);
  const [messages, setMessages] = useState([]);
  const [accTapparella, setAccTapparella] = useState(false);
  const [accPersiana, setAccPersiana] = useState(false);
  const [accZanzariera, setAccZanzariera] = useState(false);
  const [accCassonetto, setAccCassonetto] = useState(false);
  const [accMisure, setAccMisure] = useState({});
  const [drawing, setDrawing] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#f0a820");
  const [drawWidth, setDrawWidth] = useState(3);
  const canvasRef = useRef(null);
  // Modals
  const [showNewCliente, setShowNewCliente] = useState(false);
  const [showNewCommessa, setShowNewCommessa] = useState(false);
  const [newCl, setNewCl] = useState({ nome: "", cognome: "", tel: "", indirizzo: "" });
  const [newCo, setNewCo] = useState({ clienteId: 0, indirizzo: "", note: "", vani: "1" });
  // AI
  const [showAI, setShowAI] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState([{ role: "ai", text: "Ciao Fabio! 🤖 Sono MASTRO AI.\nChiedimi qualsiasi cosa: stato commesse, programma, misure, preventivi, percorso ottimale..." }]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [showScanResult, setShowScanResult] = useState(null);
  const [showPreventivo, setShowPreventivo] = useState(false);
  const [showAnomalies, setShowAnomalies] = useState(false);

  const S = {
    app: { width: "100%", maxWidth: 430, margin: "0 auto", height: "100dvh", background: T.bg, fontFamily: "'DM Sans', system-ui", color: T.text, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" },
    header: { padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, background: T.bg2, borderBottom: `1px solid ${T.bdr}`, minHeight: 56, flexShrink: 0 },
    hTitle: { fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" },
    hSub: { fontSize: 11, color: T.sub, marginTop: 1 },
    tabBar: { display: "flex", borderTop: `1px solid ${T.bdr}`, background: T.bg2, padding: "4px 0 max(env(safe-area-inset-bottom), 6px)", flexShrink: 0 },
    tabI: (a) => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "5px 0", fontSize: 9, fontWeight: a ? 600 : 400, color: a ? T.acc : T.sub2, cursor: "pointer", position: "relative" }),
    content: { flex: 1, overflowY: "auto", paddingBottom: 8 },
    card: { background: T.card, borderRadius: 14, border: `1px solid ${T.bdr}`, margin: "0 12px 10px", padding: 14, cursor: "pointer" },
    badge: (bg, c) => ({ display: "inline-flex", padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: bg, color: c }),
    btn: (bg, c = "#fff") => ({ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 20px", borderRadius: 12, background: bg, color: c, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", width: "100%" }),
    input: { width: "100%", background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 14, outline: "none", fontFamily: "'DM Sans'" },
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200 },
    modalBox: { width: "100%", maxWidth: 430, background: T.bg2, borderRadius: "20px 20px 0 0", padding: "20px 16px max(env(safe-area-inset-bottom),20px)", maxHeight: "85vh", overflowY: "auto" },
  };

  const goBack = () => {
    if (screen === "vano") { setScreen("cantiere"); setSelectedVano(null); setActiveMisura(null); setShowVoice(false); setShowScanResult(null); setShowPreventivo(false); setShowAnomalies(false); }
    else if (screen === "draw") { setScreen("vano"); }
    else if (screen === "pipeline" || screen === "stato_cliente") { setScreen("cantiere"); }
    else if (screen === "messaggi") { setScreen("pipeline"); setMsgTarget(null); }
    else { setScreen(null); setSelectedCantiere(null); }
  };
  const openCantiere = (c) => { setSelectedCantiere(c); setScreen("cantiere"); };
  const openVano = (v) => { setSelectedVano(v); setMisureData(v.misure || {}); setAccTapparella(!!v.accessori?.tapparella); setAccCassonetto(!!v.accessori?.cassonetto); setAccPersiana(!!v.accessori?.persiana); setAccZanzariera(!!v.accessori?.zanzariera); setScreen("vano"); };

  const addCliente = () => {
    if (!newCl.nome || !newCl.cognome) return;
    const nome = `${newCl.cognome} ${newCl.nome}`;
    const id = cantieri.length + 1;
    setCantieri(prev => [...prev, { id, cliente: nome, indirizzo: newCl.indirizzo || "Da definire", tel: newCl.tel || "", vani: 0, faseCorrente: "sopralluogo", note: "", pipeline: mkPipe("sopralluogo", { sopralluogo: { responsabile: "fabio", data: `${OGGI.getDate()}/${String(OGGI.getMonth()+1).padStart(2,'0')}`, dove: newCl.indirizzo || "Da definire", cosa: "Nuovo cliente." } }) }]);
    setNewCl({ nome: "", cognome: "", tel: "", indirizzo: "" });
    setShowNewCliente(false);
  };

  const addCommessa = () => {
    const id = cantieri.length + 1;
    const cl = cantieri.find(c => c.id === newCo.clienteId);
    if (!cl) return;
    setCantieri(prev => [...prev, { id, cliente: cl.cliente, indirizzo: newCo.indirizzo || cl.indirizzo, tel: cl.tel, vani: parseInt(newCo.vani) || 1, faseCorrente: "sopralluogo", note: newCo.note, pipeline: mkPipe("sopralluogo", { sopralluogo: { responsabile: "fabio", data: `${OGGI.getDate()}/${String(OGGI.getMonth()+1).padStart(2,'0')}`, dove: newCo.indirizzo || cl.indirizzo, cosa: "Nuova commessa." } }) }]);
    setNewCo({ clienteId: 0, indirizzo: "", note: "", vani: "1" });
    setShowNewCommessa(false);
  };

  const sendAI = () => {
    if (!aiInput.trim()) return;
    const q = aiInput.trim();
    setAiChat(prev => [...prev, { role: "user", text: q }]);
    setAiInput("");
    setTimeout(() => { setAiChat(prev => [...prev, { role: "ai", text: getAIResponse(q, cantieri) }]); setAiLoading(false); }, 800);
  };

  // Drawing
  const startDraw = (e) => { setIsDrawing(true); const r = canvasRef.current.getBoundingClientRect(); const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left; const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top; setDrawing(p => [...p, { points: [{x,y}], color: drawColor, width: drawWidth }]); };
  const moveDraw = (e) => { if (!isDrawing) return; e.preventDefault(); const r = canvasRef.current.getBoundingClientRect(); const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left; const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top; setDrawing(p => { const c = [...p]; c[c.length-1].points.push({x,y}); return c; }); };
  const endDraw = () => setIsDrawing(false);

  /* ═══ VIEWS ═══ */
  const OggiView = () => {
    const oggiApp = APPUNTAMENTI.filter(a => sameDay(a.date, OGGI));
    return (<div style={S.content}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "12px 12px 4px" }}>
        {[{ l: "Oggi", v: oggiApp.length, c: T.acc }, { l: "Task", v: tasks.filter(t => !t.fatto).length, c: T.red }, { l: "Commesse", v: cantieri.length, c: T.grn }].map((s, i) => (
          <div key={i} style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.bdr}`, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.c, fontFamily: "'JetBrains Mono'" }}>{s.v}</div>
            <div style={{ fontSize: 10, color: T.sub }}>{s.l}</div>
          </div>))}
      </div>
      {/* AI Quick Actions */}
      <div style={{ display: "flex", gap: 8, padding: "8px 12px" }}>
        <div onClick={() => { setShowAI(true); setAiChat(p => [...p, { role: "user", text: "ottimizza percorso" }]); setAiLoading(true); setTimeout(() => { setAiChat(p => [...p, { role: "ai", text: getAIResponse("ottimizza percorso", cantieri) }]); setAiLoading(false); }, 800); }} style={{ flex: 1, padding: "10px 12px", background: T.purpleLt, borderRadius: 10, border: `1px solid ${T.purple}30`, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 16 }}>🗺️</div><div><div style={{ fontSize: 11, fontWeight: 700, color: T.purple }}>AI Percorso</div><div style={{ fontSize: 9, color: T.sub }}>Ottimizza giornata</div></div>
        </div>
        <div onClick={() => { setShowAI(true); setAiChat(p => [...p, { role: "user", text: "priorità" }]); setAiLoading(true); setTimeout(() => { setAiChat(p => [...p, { role: "ai", text: getAIResponse("priorità", cantieri) }]); setAiLoading(false); }, 800); }} style={{ flex: 1, padding: "10px 12px", background: T.accLt, borderRadius: 10, border: `1px solid ${T.acc}30`, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 16 }}>🎯</div><div><div style={{ fontSize: 11, fontWeight: 700, color: T.acc }}>AI Priorità</div><div style={{ fontSize: 9, color: T.sub }}>Cosa fare prima</div></div>
        </div>
      </div>
      {oggiApp[0] && (() => { const a = oggiApp[0]; const c = cantieri.find(x => x.id === a.cantiereId); return (
        <div onClick={() => openCantiere(c)} style={{ margin: "12px 12px 4px", padding: 14, background: `linear-gradient(135deg, ${T.card}, ${T.card2})`, borderRadius: 14, border: `1px solid ${T.acc}40`, cursor: "pointer" }}>
          <div style={{ fontSize: 10, color: T.acc, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>▶ Prossimo</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: 16, fontWeight: 700 }}>{c.cliente}</div><div style={{ fontSize: 20, fontWeight: 700, color: T.acc, fontFamily: "'JetBrains Mono'" }}>{a.ora}</div></div>
          <div style={{ fontSize: 12, color: T.sub, marginTop: 4 }}>{c.indirizzo}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}><span style={S.badge(a.color + "20", a.color)}>{a.tipo}</span></div>
        </div>);})()}
      <div style={{ padding: "12px 12px 4px" }}><div style={{ fontSize: 13, fontWeight: 600, color: T.sub }}>Giornata</div></div>
      {oggiApp.map(a => { const c = cantieri.find(x => x.id === a.cantiereId); return (
        <div key={a.id} onClick={() => openCantiere(c)} style={{ ...S.card, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 4, height: 44, borderRadius: 2, background: a.color }} /><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{c.cliente}</div><div style={{ fontSize: 11, color: T.sub }}>{a.tipo} · {c.indirizzo}</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>{a.ora}</div><div style={{ fontSize: 10, color: T.sub }}>{a.durata}</div></div>
        </div>);})}
      <div style={{ padding: "12px 12px 4px" }}><div style={{ fontSize: 13, fontWeight: 600, color: T.sub }}>Pipeline</div></div>
      {cantieri.map(c => { const fi = FASI.findIndex(f => f.id === c.faseCorrente); const fase = FASI[fi]; return (
        <div key={c.id} onClick={() => openCantiere(c)} style={{ ...S.card, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{c.cliente}</div><span style={S.badge(fase.color + "20", fase.color)}>{fase.icon} {fase.label}</span></div>
          <div style={{ display: "flex", gap: 3 }}>{FASI.map((f, i) => <div key={f.id} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= fi ? fase.color : T.white08 }} />)}</div>
        </div>);})}
    </div>);
  };

  const CalView = () => {
    const yr = calMonth.getFullYear(), mo = calMonth.getMonth(); const fd = new Date(yr, mo, 1).getDay(); const dim = new Date(yr, mo + 1, 0).getDate();
    const cells = []; for (let i = 0; i < (fd === 0 ? 6 : fd - 1); i++) cells.push(null); for (let d = 1; d <= dim; d++) cells.push(new Date(yr, mo, d));
    return (<div style={S.content}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
        <div onClick={() => setCalMonth(new Date(yr, mo - 1, 1))} style={{ cursor: "pointer", padding: 8 }}><Ico d={ICO.back} size={18} color={T.sub} /></div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{MM[mo]} {yr}</div>
        <div onClick={() => setCalMonth(new Date(yr, mo + 1, 1))} style={{ cursor: "pointer", padding: 8, transform: "rotate(180deg)" }}><Ico d={ICO.back} size={18} color={T.sub} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, padding: "0 12px", textAlign: "center" }}>{["L","M","M","G","V","S","D"].map((g, i) => <div key={i} style={{ fontSize: 10, color: T.sub2, fontWeight: 600, padding: 4 }}>{g}</div>)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, padding: "0 12px" }}>
        {cells.map((day, i) => { if (!day) return <div key={i} />; const isT = sameDay(day, OGGI), isS = sameDay(day, calSelected), has = APPUNTAMENTI.some(a => sameDay(a.date, day)); return (
          <div key={i} onClick={() => setCalSelected(day)} style={{ textAlign: "center", padding: "8px 2px", borderRadius: 10, cursor: "pointer", background: isS ? T.acc + "25" : "transparent", border: isT ? `1.5px solid ${T.acc}` : "1.5px solid transparent" }}>
            <div style={{ fontSize: 13, fontWeight: isT || isS ? 700 : 400, color: isS ? T.acc : isT ? T.text : T.sub }}>{day.getDate()}</div>
            {has && <div style={{ width: 5, height: 5, borderRadius: 3, background: T.acc, margin: "3px auto 0" }} />}
          </div>);})}
      </div>
    </div>);
  };

  const TaskView = () => {
    const toggle = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, fatto: !t.fatto } : t));
    const pc = { alta: T.red, media: T.acc, bassa: T.sub2 };
    return (<div style={S.content}>
      <div style={{ padding: "12px 16px 8px" }}><div style={{ fontSize: 13, fontWeight: 600, color: T.sub }}>Da fare</div></div>
      {tasks.filter(t => !t.fatto).map(t => (<div key={t.id} style={{ ...S.card, display: "flex", gap: 10, alignItems: "center" }}><div onClick={() => toggle(t.id)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${pc[t.priorita]}40`, cursor: "pointer" }} /><div style={{ flex: 1 }}><div style={{ fontSize: 13 }}>{t.testo}</div></div><div style={{ width: 8, height: 8, borderRadius: 4, background: pc[t.priorita] }} /></div>))}
      <div style={{ padding: "12px 16px 8px" }}><div style={{ fontSize: 13, fontWeight: 600, color: T.sub2 }}>Fatti</div></div>
      {tasks.filter(t => t.fatto).map(t => (<div key={t.id} style={{ ...S.card, display: "flex", gap: 10, alignItems: "center", opacity: 0.5 }}><div onClick={() => toggle(t.id)} style={{ width: 22, height: 22, borderRadius: 6, background: T.grn + "30", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Ico d={ICO.check} size={14} color={T.grn} sw={2.5} /></div><div style={{ fontSize: 13, textDecoration: "line-through", color: T.sub2 }}>{t.testo}</div></div>))}
    </div>);
  };

  const CommView = () => (<div style={S.content}>
    <div style={{ padding: "12px", display: "flex", gap: 8 }}>
      <button onClick={() => setShowNewCliente(true)} style={{ ...S.btn(T.accLt, T.acc), flex: 1, padding: "10px", borderRadius: 10, fontSize: 12 }}><Ico d={ICO.userPlus} size={16} color={T.acc} /> Nuovo Cliente</button>
      <button onClick={() => setShowNewCommessa(true)} style={{ ...S.btn(T.grnLt, T.grn), flex: 1, padding: "10px", borderRadius: 10, fontSize: 12 }}><Ico d={ICO.plus} size={16} color={T.grn} /> Nuova Commessa</button>
    </div>
    {cantieri.map(c => { const fi = FASI.findIndex(f => f.id === c.faseCorrente); const fase = FASI[fi]; return (
      <div key={c.id} onClick={() => openCantiere(c)} style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><div style={{ fontSize: 15, fontWeight: 700 }}>{c.cliente}</div><span style={S.badge(fase.color + "20", fase.color)}>{fase.icon} {fase.label}</span></div>
        <div style={{ fontSize: 12, color: T.sub, marginBottom: 8 }}>{c.indirizzo}</div>
        <div style={{ display: "flex", gap: 3 }}>{FASI.map((f, i) => <div key={f.id} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= fi ? fase.color : T.white08 }} />)}</div>
      </div>);})}
  </div>);

  const ProfView = () => (<div style={S.content}>
    <div style={{ padding: 20, textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 36, background: T.acc + "25", border: `2px solid ${T.acc}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: T.acc, margin: "0 auto 12px" }}>F</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>Fabio</div>
      <div style={{ fontSize: 13, color: T.sub }}>Walter Cozza Serramenti</div>
    </div>
    {/* Tema */}
    <div style={S.card}>
      <div style={{ fontSize: 11, color: T.sub, fontWeight: 600, marginBottom: 10 }}>🎨 TEMA</div>
      <div style={{ display: "flex", gap: 8 }}>
        {Object.entries(THEMES).map(([key, th]) => (
          <div key={key} onClick={() => setTheme(key)} style={{ flex: 1, padding: 12, borderRadius: 12, background: th.bg, border: `2px solid ${theme === key ? th.acc : th.bdr}`, cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{th.emoji}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: th.text }}>{th.name}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={S.card}>
      <div style={{ fontSize: 11, color: T.sub, fontWeight: 600, marginBottom: 10 }}>STATISTICHE</div>
      {[{ l: "Commesse", v: cantieri.length }, { l: "Vani", v: cantieri.reduce((s, c) => s + c.vani, 0) }, { l: "Task aperti", v: tasks.filter(t => !t.fatto).length }].map((s, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${T.bdr}` : "none" }}>
          <span style={{ fontSize: 13, color: T.sub }}>{s.l}</span><span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>{s.v}</span>
        </div>))}
    </div>
  </div>);

  const CantiereView = () => {
    const c = selectedCantiere; if (!c) return null;
    const fi = FASI.findIndex(f => f.id === c.faseCorrente); const fase = FASI[fi];
    const cv = vani.filter(v => v.cantiereId === c.id);
    return (<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={S.header}><div onClick={goBack} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.back} size={20} color={T.sub} /></div><div style={{ flex: 1 }}><div style={S.hTitle}>{c.cliente}</div><div style={S.hSub}>{c.indirizzo}</div></div></div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "14px 12px 8px" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>{FASI.map((f, i) => (<div key={f.id} style={{ flex: 1, textAlign: "center" }}><div style={{ height: 6, borderRadius: 3, background: i <= fi ? fase.color : T.white08, marginBottom: 4 }} /><div style={{ fontSize: 12 }}>{f.icon}</div></div>))}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setScreen("pipeline")} style={{ ...S.btn(T.blueLt, T.blue), flex: 1, padding: "10px", borderRadius: 10, fontSize: 12 }}><Ico d={ICO.eye} size={16} color={T.blue} /> Pipeline</button>
            <button onClick={() => setScreen("stato_cliente")} style={{ ...S.btn(T.grnLt, T.grn), flex: 1, padding: "10px", borderRadius: 10, fontSize: 12 }}><Ico d={ICO.clienti} size={16} color={T.grn} /> Stato Cliente</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, padding: "4px 12px 12px" }}>
          <button style={{ ...S.btn(T.accLt, T.acc), flex: 1, padding: "10px", borderRadius: 10, fontSize: 12 }}><Ico d={ICO.phone} size={16} color={T.acc} /> Chiama</button>
          <button style={{ ...S.btn(T.purpleLt, T.purple), flex: 1, padding: "10px", borderRadius: 10, fontSize: 12 }}><Ico d={ICO.nav} size={16} color={T.purple} /> Naviga</button>
        </div>
        {c.note && <div style={{ ...S.card, background: T.white04 }}><div style={{ fontSize: 11, color: T.sub, fontWeight: 600, marginBottom: 4 }}>NOTE</div><div style={{ fontSize: 13 }}>{c.note}</div></div>}
        <div style={{ padding: "8px 12px 4px", display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: 13, fontWeight: 600, color: T.sub }}>Vani ({cv.length})</div><button style={{ background: T.accLt, color: T.acc, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>+ Nuovo</button></div>
        {cv.map(v => (<div key={v.id} onClick={() => openVano(v)} style={{ ...S.card, display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: v.completato ? T.grnLt : T.white08, display: "flex", alignItems: "center", justifyContent: "center" }}>{v.completato ? <Ico d={ICO.check} size={20} color={T.grn} /> : <Ico d={ICO.ruler} size={20} color={T.sub2} />}</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{v.nome}</div><div style={{ fontSize: 11, color: T.sub }}>{v.tipo} · {v.stanza}</div></div><Ico d={ICO.chevR} size={16} color={T.sub2} />
        </div>))}
        <div style={{ padding: "12px 12px 20px" }}>{(() => {
          const pInfo = c.pipeline[c.faseCorrente];
          const isMyPhase = pInfo?.responsabile === "fabio"; // current user
          const respPerson = pInfo?.responsabile ? TEAM.find(t => t.id === pInfo.responsabile) : null;
          if (fi >= FASI.length - 1) return <div style={{ ...S.btn(T.grnLt, T.grn) }}>✅ COMMESSA COMPLETATA</div>;
          if (!isMyPhase) return (
            <div style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.bdr}`, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: T.sub, marginBottom: 4 }}>Fase in carico a</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {respPerson && <Avatar member={pInfo.responsabile} size={28} />}
                <div style={{ fontSize: 15, fontWeight: 700 }}>{respPerson?.nome || "Non assegnato"}</div>
                <span style={{ fontSize: 11, color: T.sub }}>({respPerson?.ruolo})</span>
              </div>
              <div style={{ fontSize: 11, color: T.sub2, marginTop: 6 }}>Solo {respPerson?.nome} può avanzare questa fase</div>
              {respPerson && <button onClick={() => { setMsgTarget({ faseId: c.faseCorrente, responsabile: pInfo.responsabile }); setScreen("messaggi"); }} style={{ ...S.btn(T.blueLt, T.blue), marginTop: 10, padding: "10px", borderRadius: 10, fontSize: 12 }}><Ico d={ICO.msg} size={16} color={T.blue} /> Scrivi a {respPerson.nome}</button>}
            </div>
          );
          return <button onClick={() => {
            const nextFase = FASI[fi + 1].id;
            const updated = cantieri.map(x => {
              if (x.id !== c.id) return x;
              const newPipe = { ...x.pipeline };
              newPipe[c.faseCorrente] = { ...newPipe[c.faseCorrente], stato: "completato", data: `${OGGI.getDate()}/${String(OGGI.getMonth()+1).padStart(2,'0')}` };
              newPipe[nextFase] = { ...newPipe[nextFase], stato: "in_corso", data: `${OGGI.getDate()}/${String(OGGI.getMonth()+1).padStart(2,'0')}` };
              return { ...x, faseCorrente: nextFase, pipeline: newPipe };
            });
            setCantieri(updated);
            setSelectedCantiere(updated.find(x => x.id === c.id));
          }} style={{ ...S.btn(`linear-gradient(135deg, ${T.acc}, ${T.accD})`), boxShadow: `0 4px 20px ${T.acc}50` }}>
            <Ico d={ICO.check} size={18} color="#fff" /> ✅ COMPLETA {FASI[fi].label.toUpperCase()} → {FASI[fi + 1].label.toUpperCase()}
          </button>;
        })()}</div>
      </div>
    </div>);
  };

  const PipelineView = () => {
    const c = selectedCantiere; if (!c) return null;
    return (<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={S.header}><div onClick={goBack} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.back} size={20} color={T.sub} /></div><div style={{ flex: 1 }}><div style={S.hTitle}>Pipeline</div><div style={S.hSub}>{c.cliente}</div></div></div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {FASI.map((f, i) => { const info = c.pipeline[f.id]; const done = info.stato === "completato"; const curr = info.stato === "in_corso"; const fut = info.stato === "futuro"; const resp = info.responsabile ? TEAM.find(t => t.id === info.responsabile) : null; return (
          <div key={f.id} style={{ display: "flex", gap: 12, marginBottom: 4 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: done ? f.color : curr ? f.color + "30" : T.white08, border: curr ? `2px solid ${f.color}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{done ? <Ico d={ICO.check} size={16} color="#fff" /> : f.icon}</div>
              {i < FASI.length - 1 && <div style={{ width: 2, flex: 1, background: done ? f.color + "60" : T.white08, margin: "4px 0" }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: curr ? 700 : 500, color: fut ? T.sub2 : T.text }}>{f.label}</div>
              {resp && !fut && <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}><Avatar member={info.responsabile} size={22} /><div style={{ fontSize: 12, fontWeight: 600 }}>{resp.nome}</div></div>}
              {info.dove && !fut && <div style={{ fontSize: 11, color: T.sub, marginTop: 4 }}><Ico d={ICO.pin} size={12} color={T.sub} /> {info.dove}</div>}
              {info.cosa && !fut && <div style={{ marginTop: 6, padding: 10, background: curr ? f.color + "12" : T.white04, borderRadius: 8, fontSize: 12, color: T.sub }}>{info.cosa}</div>}
              {!fut && resp && <button onClick={() => { setMsgTarget({ faseId: f.id, responsabile: info.responsabile }); setScreen("messaggi"); }} style={{ display: "flex", alignItems: "center", gap: 4, background: T.blueLt, border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600, color: T.blue, cursor: "pointer", marginTop: 8 }}><Ico d={ICO.msg} size={14} color={T.blue} />Scrivi a {resp.nome}</button>}
            </div>
          </div>);})}
      </div>
    </div>);
  };

  const MessaggiView = () => {
    const c = selectedCantiere; if (!c || !msgTarget) return null;
    const fase = FASI.find(f => f.id === msgTarget.faseId); const resp = TEAM.find(t => t.id === msgTarget.responsabile);
    const fm = messages.filter(m => m.cantiereId === c.id && m.faseId === msgTarget.faseId);
    const doSend = () => { if (!msgText.trim()) return; setMessages(p => [...p, { id: Date.now(), cantiereId: c.id, faseId: msgTarget.faseId, da: "fabio", a: msgTarget.responsabile, testo: msgText.trim(), ora: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }), data: "oggi" }]); setMsgText(""); };
    return (<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={S.header}><div onClick={goBack} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.back} size={20} color={T.sub} /></div><Avatar member={msgTarget.responsabile} size={32} /><div style={{ flex: 1 }}><div style={S.hTitle}>{resp?.nome}</div><div style={S.hSub}>{fase?.icon} {fase?.label}</div></div></div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {fm.length === 0 && <div style={{ textAlign: "center", padding: 40, color: T.sub2, fontSize: 13 }}>Nessun messaggio</div>}
        {fm.map(m => { const mine = m.da === "fabio"; return (<div key={m.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}><div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 14, borderBottomRightRadius: mine ? 4 : 14, borderBottomLeftRadius: mine ? 14 : 4, background: mine ? T.acc + "20" : T.card, border: `1px solid ${mine ? T.acc + "30" : T.bdr}` }}><div style={{ fontSize: 13, lineHeight: 1.5 }}>{m.testo}</div></div></div>);})}
      </div>
      <div style={{ padding: "8px 12px 12px", background: T.bg2, borderTop: `1px solid ${T.bdr}`, display: "flex", gap: 8 }}>
        <input value={msgText} onChange={e => setMsgText(e.target.value)} onKeyDown={e => e.key === "Enter" && doSend()} placeholder="Scrivi..." style={{ ...S.input, flex: 1, borderRadius: 12 }} />
        <button onClick={doSend} style={{ width: 44, height: 44, borderRadius: 22, background: msgText.trim() ? T.acc : T.white08, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M5 12h14m-7-7l7 7-7 7" size={20} color={msgText.trim() ? "#000" : T.sub2} sw={2} /></button>
      </div>
    </div>);
  };

  const StatoView = () => {
    const c = selectedCantiere; if (!c) return null;
    const fi = FASI.findIndex(f => f.id === c.faseCorrente); const fase = FASI[fi]; const info = c.pipeline[c.faseCorrente]; const resp = info?.responsabile ? TEAM.find(t => t.id === info.responsabile) : null;
    return (<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ ...S.header }}><div onClick={goBack} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.back} size={20} color={T.sub} /></div><div style={{ flex: 1 }}><div style={{ fontSize: 10, color: T.grn, fontWeight: 600 }}>📞 CLIENTE CHIAMA</div><div style={S.hTitle}>{c.cliente}</div></div></div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ margin: 12, padding: 20, background: `linear-gradient(135deg, ${fase.color}15, ${fase.color}08)`, borderRadius: 16, border: `1px solid ${fase.color}30` }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: fase.color, marginBottom: 8 }}>{fase.icon} {fase.label}</div>
          <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>{FASI.map((f, i) => <div key={f.id} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= fi ? fase.color : T.white08 }} />)}</div>
          <div style={{ background: T.bg + "80", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 10, color: T.grn, fontWeight: 700, marginBottom: 6 }}>💬 COSA DIRE</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 500 }}>{info?.cosa || "In lavorazione."}</div>
          </div>
          {resp && <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12 }}><Avatar member={info.responsabile} size={36} /><div><div style={{ fontSize: 13, fontWeight: 600 }}>{resp.nome}</div><div style={{ fontSize: 11, color: T.sub }}>{resp.ruolo}</div></div></div>}
        </div>
      </div>
    </div>);
  };

  const VanoView = () => {
    const v = selectedVano; if (!v) return null;
    const punti = [{ key: "L1", x: 95, y: 35 }, { key: "L2", x: 95, y: 115 }, { key: "L3", x: 95, y: 195 }, { key: "H1", x: 30, y: 115 }, { key: "H2", x: 95, y: 115 }, { key: "H3", x: 160, y: 115 }, { key: "D1", x: 185, y: 35 }, { key: "D2", x: 185, y: 115 }, { key: "D3", x: 185, y: 195 }];
    const handleTap = (key) => { setActiveMisura(key); setInputVal(misureData[key] ? String(misureData[key]) : ""); };
    const saveMisura = () => { if (activeMisura && inputVal) setMisureData(d => ({ ...d, [activeMisura]: parseInt(inputVal) || 0 })); setActiveMisura(null); setInputVal(""); };
    const filled = Object.values(misureData).filter(v => v > 0).length;
    return (<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={S.header}>
        <div onClick={goBack} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.back} size={20} color={T.sub} /></div>
        <div style={{ flex: 1 }}><div style={S.hTitle}>{v.nome}</div><div style={S.hSub}>{v.tipo} · {filled}/9</div></div>
        <button onClick={() => setScreen("draw")} style={{ background: T.purpleLt, border: "none", borderRadius: 10, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Ico d={ICO.pencil} size={16} color={T.purple} /><span style={{ fontSize: 11, fontWeight: 600, color: T.purple }}>Disegna</span></button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* AI Action Bar */}
        <div style={{ display: "flex", gap: 6, padding: "10px 12px", overflowX: "auto", flexShrink: 0 }}>
          <button onClick={() => setShowVoice(true)} style={{ display: "flex", alignItems: "center", gap: 4, background: T.accLt, border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600, color: T.acc, cursor: "pointer", whiteSpace: "nowrap" }}>🎤 Voce</button>
          <button onClick={() => { const r = aiPhotoScan(); setShowScanResult(r); }} style={{ display: "flex", alignItems: "center", gap: 4, background: T.blueLt, border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600, color: T.blue, cursor: "pointer", whiteSpace: "nowrap" }}>📸 Scan</button>
          <button onClick={() => { const filled2 = aiSmartFill(misureData); setMisureData(filled2); }} style={{ display: "flex", alignItems: "center", gap: 4, background: T.grnLt, border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600, color: T.grn, cursor: "pointer", whiteSpace: "nowrap" }}>🧠 Smart Fill</button>
          <button onClick={() => setShowAnomalies(!showAnomalies)} style={{ display: "flex", alignItems: "center", gap: 4, background: T.redLt, border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600, color: T.red, cursor: "pointer", whiteSpace: "nowrap" }}>⚠️ Check</button>
          {(misureData.L1 || misureData.H1) && <button onClick={() => setShowPreventivo(!showPreventivo)} style={{ display: "flex", alignItems: "center", gap: 4, background: T.purpleLt, border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600, color: T.purple, cursor: "pointer", whiteSpace: "nowrap" }}>💰 Prev.</button>}
        </div>

        {/* Voice Modal */}
        {showVoice && (<div style={{ margin: "0 12px 8px", padding: 14, background: T.card2, borderRadius: 14, border: `1px solid ${T.acc}40` }}>
          <div style={{ fontSize: 12, color: T.acc, fontWeight: 700, marginBottom: 8 }}>🎤 DETTATURA MISURE</div>
          <div style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>Es: "1400 1400 1400 1600 1600 1600 120 120 120" oppure "larghezza 1 1400 altezza 2 1600"</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={voiceText} onChange={e => setVoiceText(e.target.value)} placeholder="Inserisci o detta misure..." style={{ ...S.input, flex: 1, fontSize: 13 }} />
            <button onClick={() => { if (voiceText.trim()) { const parsed = aiVoiceParse(voiceText); setMisureData(d => ({ ...d, ...parsed })); setVoiceText(""); setShowVoice(false); } }} style={{ padding: "0 16px", borderRadius: 10, background: T.acc, color: "#000", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 12 }}>Applica</button>
          </div>
          <button onClick={() => setShowVoice(false)} style={{ marginTop: 6, background: "transparent", border: "none", color: T.sub, fontSize: 11, cursor: "pointer" }}>Chiudi</button>
        </div>)}

        {/* Scan Result */}
        {showScanResult && (<div style={{ margin: "0 12px 8px", padding: 14, background: T.blueLt, borderRadius: 14, border: `1px solid ${T.blue}30` }}>
          <div style={{ fontSize: 12, color: T.blue, fontWeight: 700, marginBottom: 8 }}>📸 AI SCAN — Confidenza {showScanResult.conf}%</div>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 6 }}>Tipo rilevato: <strong style={{ color: T.text }}>{showScanResult.tipo}</strong></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, fontSize: 11 }}>
            {["L1","L2","L3","H1","H2","H3","D1","D2","D3"].map(k => (<div key={k} style={{ background: T.white04, borderRadius: 6, padding: "4px 6px", textAlign: "center" }}><span style={{ color: T.sub }}>{k}:</span> <strong>{showScanResult[k]}</strong></div>))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => { setMisureData(d => { const n = { ...d }; Object.keys(showScanResult).forEach(k => { if (k.match(/^[LHD]\d$/)) n[k] = showScanResult[k]; }); return n; }); setShowScanResult(null); }} style={{ flex: 1, padding: "8px", borderRadius: 8, background: T.blue, color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 12 }}>✅ Applica tutto</button>
            <button onClick={() => setShowScanResult(null)} style={{ padding: "8px 16px", borderRadius: 8, background: T.white08, color: T.sub, fontWeight: 600, border: "none", cursor: "pointer", fontSize: 12 }}>Ignora</button>
          </div>
        </div>)}

        {/* Anomalies */}
        {showAnomalies && (() => { const a = aiCheckAnomalies(misureData); return (<div style={{ margin: "0 12px 8px" }}>{a.map((w, i) => (<div key={i} style={{ padding: 10, marginBottom: 4, borderRadius: 10, background: w.t === "err" ? T.redLt : w.t === "warn" ? T.accLt : T.grnLt, border: `1px solid ${w.t === "err" ? T.red : w.t === "warn" ? T.acc : T.grn}30`, fontSize: 12, color: w.t === "err" ? T.red : w.t === "warn" ? T.acc : T.grn }}>{w.m}</div>))}</div>); })()}

        {/* AI Preventivo */}
        {showPreventivo && (() => { const p = aiPreventivo(misureData, selectedVano?.tipo, { tapp: accTapparella, pers: accPersiana, zanz: accZanzariera, cass: accCassonetto }); return p ? (<div style={{ margin: "0 12px 8px", padding: 14, background: T.purpleLt, borderRadius: 14, border: `1px solid ${T.purple}30` }}>
          <div style={{ fontSize: 12, color: T.purple, fontWeight: 700, marginBottom: 8 }}>💰 PREVENTIVO AI</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 12 }}>
            <div style={{ color: T.sub }}>Superficie:</div><div style={{ fontWeight: 700 }}>{p.mq} m²</div>
            <div style={{ color: T.sub }}>Serramento:</div><div style={{ fontWeight: 700 }}>€{p.base}</div>
            <div style={{ color: T.sub }}>Accessori:</div><div style={{ fontWeight: 700 }}>€{p.ext}</div>
            <div style={{ color: T.sub }}>Posa:</div><div style={{ fontWeight: 700 }}>€80</div>
            <div style={{ borderTop: `1px solid ${T.purple}30`, paddingTop: 6, fontWeight: 700, color: T.text }}>Totale (IVA):</div>
            <div style={{ borderTop: `1px solid ${T.purple}30`, paddingTop: 6, fontWeight: 700, fontSize: 16, color: T.purple }}>€{p.iva}</div>
          </div>
          <div style={{ fontSize: 10, color: T.sub, marginTop: 6 }}>* Stima AI · IVA 22% inclusa</div>
        </div>) : null; })()}
        <div style={{ padding: "16px 12px 8px", display: "flex", justifyContent: "center" }}>
          <div style={{ background: `linear-gradient(180deg, ${T.card}, ${T.card2})`, borderRadius: 20, border: `1px solid ${T.bdr}`, padding: 16, width: "100%", maxWidth: 340, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `repeating-linear-gradient(0deg, ${T.text} 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, ${T.text} 0 1px, transparent 1px 20px)`, borderRadius: 20 }} />
            <div style={{ fontSize: 11, color: T.acc, fontWeight: 700, marginBottom: 14, textAlign: "center", letterSpacing: "0.1em", position: "relative" }}>📐 SCHEMA VANO</div>
            <svg viewBox="0 0 220 230" style={{ width: "100%", position: "relative" }}>
              <defs><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              <rect x="22" y="10" width="146" height="200" fill="none" stroke={T.bdrL} strokeWidth="8" rx="3" opacity="0.5"/>
              <rect x="30" y="18" width="130" height="184" fill={T.bg + "60"} stroke={T.bdrL} strokeWidth="1.5" rx="2"/>
              <rect x="20" y="210" width="150" height="6" rx="2" fill={T.sub2 + "40"}/>
              <text x="95" y="6" textAnchor="middle" fill={T.acc} fontSize="9" fontWeight="700">LARGHEZZA</text>
              <text x="6" y="115" textAnchor="middle" fill={T.blue} fontSize="9" fontWeight="700" transform="rotate(-90,6,115)">ALTEZZA</text>
              <text x="210" y="115" textAnchor="middle" fill={T.grn} fontSize="9" fontWeight="700" transform="rotate(90,210,115)">PROFONDITÀ</text>
              {punti.map(p => { const val = misureData[p.key]; const color = p.key[0] === "L" ? T.acc : p.key[0] === "H" ? T.blue : T.grn; const isAct = activeMisura === p.key; return (
                <g key={p.key} onClick={() => handleTap(p.key)} style={{ cursor: "pointer" }}>
                  {isAct && <circle cx={p.x} cy={p.y} r={22} fill={color + "10"} stroke={color} strokeWidth="0.5"/>}
                  <circle cx={p.x} cy={p.y} r={val ? 16 : 14} fill={val ? color + "20" : T.white08} stroke={isAct ? color : val ? color + "50" : T.bdr} strokeWidth={isAct ? 2 : 1.2} filter={val ? "url(#g)" : ""}/>
                  <text x={p.x} y={p.y - 4} textAnchor="middle" fill={val ? color : T.sub2} fontSize="7" fontWeight="700">{p.key}</text>
                  <text x={p.x} y={p.y + 7} textAnchor="middle" fill={val ? T.text : T.sub2} fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono'">{val || "—"}</text>
                </g>);})}
            </svg>
          </div>
        </div>
        {/* Input */}
        {activeMisura && (<div style={{ margin: "0 12px 12px", padding: 16, background: T.card2, borderRadius: 14, border: `1px solid ${T.acc}40` }}>
          <div style={{ fontSize: 12, color: T.acc, fontWeight: 600, marginBottom: 8 }}>{activeMisura}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && saveMisura()} placeholder="mm" autoFocus style={{ flex: 1, background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 10, padding: "12px", color: T.text, fontSize: 20, fontFamily: "'JetBrains Mono'", fontWeight: 700, outline: "none", textAlign: "center" }} />
            <button onClick={saveMisura} style={{ padding: "0 20px", borderRadius: 10, background: T.acc, color: "#000", fontWeight: 700, border: "none", cursor: "pointer" }}>OK</button>
          </div>
        </div>)}
        {/* Riepilogo */}
        <div style={{ padding: "0 12px 12px" }}><div style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.bdr}`, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.sub, marginBottom: 10 }}>RIEPILOGO</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {["L","H","D"].map(tipo => { const color = tipo === "L" ? T.acc : tipo === "H" ? T.blue : T.grn; return [1,2,3].map(n => { const key = `${tipo}${n}`, val = misureData[key]; return (
              <div key={key} onClick={() => handleTap(key)} style={{ background: val ? color + "10" : T.white04, borderRadius: 8, padding: "8px 6px", textAlign: "center", cursor: "pointer", border: `1px solid ${val ? color + "30" : "transparent"}` }}>
                <div style={{ fontSize: 9, color, fontWeight: 600 }}>{key}</div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'JetBrains Mono'", color: val ? T.text : T.sub2 }}>{val || "—"}</div>
              </div>);}); })}
          </div>
        </div></div>
        {/* Accessori */}
        <div style={{ padding: "0 12px 12px" }}><div style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.bdr}`, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.sub, marginBottom: 6 }}>ACCESSORI</div>
          <Toggle on={accTapparella} onToggle={() => setAccTapparella(!accTapparella)} label="🪟 Tapparella" color={T.blue} T={T} />
          {accTapparella && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8, paddingLeft: 8 }}>{[{k:"tL",l:"Largh."},{k:"tH",l:"Alt."}].map(m => (<div key={m.k} style={{ background: T.white04, borderRadius: 8, padding: 8 }}><div style={{ fontSize: 9, color: T.blue, fontWeight: 600, marginBottom: 4 }}>{m.l}</div><input type="number" placeholder="mm" value={accMisure[m.k]||""} onChange={e => setAccMisure(d => ({...d,[m.k]:e.target.value}))} style={{ ...S.input, fontSize: 14, fontFamily: "'JetBrains Mono'", fontWeight: 700, textAlign: "center", padding: "6px" }} /></div>))}</div>}
          <Toggle on={accPersiana} onToggle={() => setAccPersiana(!accPersiana)} label="🏠 Persiana" color="#fb923c" T={T} />
          {accPersiana && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8, paddingLeft: 8 }}>{[{k:"pL",l:"Largh."},{k:"pH",l:"Alt."}].map(m => (<div key={m.k} style={{ background: T.white04, borderRadius: 8, padding: 8 }}><div style={{ fontSize: 9, color: "#fb923c", fontWeight: 600, marginBottom: 4 }}>{m.l}</div><input type="number" placeholder="mm" value={accMisure[m.k]||""} onChange={e => setAccMisure(d => ({...d,[m.k]:e.target.value}))} style={{ ...S.input, fontSize: 14, fontFamily: "'JetBrains Mono'", fontWeight: 700, textAlign: "center", padding: "6px" }} /></div>))}</div>}
          <Toggle on={accZanzariera} onToggle={() => setAccZanzariera(!accZanzariera)} label="🦟 Zanzariera" color={T.grn} T={T} />
          {accZanzariera && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8, paddingLeft: 8 }}>{[{k:"zL",l:"Largh."},{k:"zH",l:"Alt."}].map(m => (<div key={m.k} style={{ background: T.white04, borderRadius: 8, padding: 8 }}><div style={{ fontSize: 9, color: T.grn, fontWeight: 600, marginBottom: 4 }}>{m.l}</div><input type="number" placeholder="mm" value={accMisure[m.k]||""} onChange={e => setAccMisure(d => ({...d,[m.k]:e.target.value}))} style={{ ...S.input, fontSize: 14, fontFamily: "'JetBrains Mono'", fontWeight: 700, textAlign: "center", padding: "6px" }} /></div>))}</div>}
          <Toggle on={accCassonetto} onToggle={() => setAccCassonetto(!accCassonetto)} label="📦 Cassonetto" color={T.purple} T={T} />
          {accCassonetto && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8, paddingLeft: 8 }}>{[{k:"cL",l:"L"},{k:"cH",l:"H"},{k:"cD",l:"Prof."}].map(m => (<div key={m.k} style={{ background: T.white04, borderRadius: 8, padding: 8 }}><div style={{ fontSize: 9, color: T.purple, fontWeight: 600, marginBottom: 4 }}>{m.l}</div><input type="number" placeholder="mm" value={accMisure[m.k]||""} onChange={e => setAccMisure(d => ({...d,[m.k]:e.target.value}))} style={{ ...S.input, fontSize: 14, fontFamily: "'JetBrains Mono'", fontWeight: 700, textAlign: "center", padding: "6px" }} /></div>))}</div>}
        </div></div>
        <div style={{ padding: "0 12px 12px" }}><button style={{ ...S.btn(T.purpleLt, T.purple), borderRadius: 12 }}><Ico d={ICO.camera} size={18} color={T.purple} /> Foto ({v.foto})</button></div>
        <div style={{ padding: "0 12px 20px" }}><button style={{ ...S.btn(`linear-gradient(135deg, ${T.grn}, #1a9e73)`) }}><Ico d={ICO.check} size={18} color="#fff" /> SALVA MISURE</button></div>
      </div>
    </div>);
  };

  const DrawView = () => {
    const colors = [T.acc, T.blue, T.red, T.grn, "#fff", T.purple];
    return (<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={S.header}><div onClick={goBack} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.back} size={20} color={T.sub} /></div><div style={{ flex: 1 }}><div style={S.hTitle}>Disegno Vano</div><div style={S.hSub}>Pennino / dito</div></div></div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: T.bg2, borderBottom: `1px solid ${T.bdr}` }}>
        {colors.map(c => <div key={c} onClick={() => setDrawColor(c)} style={{ width: 28, height: 28, borderRadius: 14, background: c, border: drawColor === c ? "3px solid #fff" : `2px solid ${T.bdr}`, cursor: "pointer" }} />)}
        <div style={{ flex: 1 }} />
        <div onClick={() => setDrawing(p => p.slice(0, -1))} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.undo} size={20} color={T.sub} /></div>
        <div onClick={() => setDrawing([])} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.trash} size={20} color={T.red} /></div>
      </div>
      <div ref={canvasRef} onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
        style={{ flex: 1, background: T.card, position: "relative", touchAction: "none", cursor: "crosshair" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: `repeating-linear-gradient(0deg, ${T.text} 0 1px, transparent 1px 30px), repeating-linear-gradient(90deg, ${T.text} 0 1px, transparent 1px 30px)` }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {drawing.map((s, i) => s.points.length > 1 && <polyline key={i} points={s.points.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round"/>)}
        </svg>
        {drawing.length === 0 && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", color: T.sub2 }}><div style={{ fontSize: 40 }}>✏️</div><div style={{ fontSize: 14, marginTop: 8 }}>Disegna la tipologia</div></div>}
      </div>
      {drawing.length > 0 && (() => { const rec = aiDrawRecognize(drawing.length); return rec.conf > 0 ? (
        <div style={{ padding: "8px 12px", background: T.purpleLt, borderTop: `1px solid ${T.purple}30` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ fontSize: 16 }}>🧠</div><div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: T.purple }}>AI: {rec.tipo} ({rec.conf}%)</div>{rec.desc && <div style={{ fontSize: 10, color: T.sub }}>{rec.desc}</div>}</div></div>
        </div>) : null; })()}
      <div style={{ padding: "8px 12px 12px", background: T.bg2 }}><button onClick={goBack} style={S.btn(`linear-gradient(135deg, ${T.grn}, #1a9e73)`)}><Ico d={ICO.check} size={18} color="#fff" /> Salva Disegno</button></div>
    </div>);
  };

  /* ═══ RENDER ═══ */
  return (<>
    <link href={FONT_URL} rel="stylesheet" />
    <style>{`* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; } ::-webkit-scrollbar { width: 0; } input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; } input[type=number] { -moz-appearance: textfield; } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    <div style={S.app}>
      {screen === "cantiere" && <CantiereView />}
      {screen === "vano" && <VanoView />}
      {screen === "draw" && <DrawView />}
      {screen === "pipeline" && <PipelineView />}
      {screen === "messaggi" && <MessaggiView />}
      {screen === "stato_cliente" && <StatoView />}

      {!screen && (<>
        <div style={S.header}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${T.acc}, ${T.accD})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#000" }}>M</div>
          <div style={{ flex: 1 }}><div style={S.hTitle}>MASTRO MISURE</div><div style={S.hSub}>{fmtDate(OGGI)}</div></div>
        </div>
        {tab === "oggi" && <OggiView />}
        {tab === "calendario" && <CalView />}
        {tab === "task" && <TaskView />}
        {tab === "commesse" && <CommView />}
        {tab === "profilo" && <ProfView />}
        <div style={S.tabBar}>
          {[{id:"oggi",Ic:TabIcoOggi,l:"Oggi"},{id:"calendario",Ic:TabIcoCal,l:"Calendario"},{id:"task",Ic:TabIcoTask,l:"Task"},{id:"commesse",Ic:TabIcoComm,l:"Commesse"},{id:"profilo",Ic:TabIcoProf,l:"Profilo"}].map(t => (
            <div key={t.id} onClick={() => setTab(t.id)} style={S.tabI(tab === t.id)}>
              <t.Ic active={tab === t.id} T={T} />{t.l}
              {t.id === "task" && tasks.filter(x => !x.fatto).length > 0 && <div style={{ position: "absolute", top: 0, right: "50%", marginRight: -18, width: 16, height: 16, borderRadius: 8, background: T.red, fontSize: 9, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{tasks.filter(x => !x.fatto).length}</div>}
            </div>))}
        </div>
      </>)}

      {/* AI FAB */}
      {!showAI && <button onClick={() => setShowAI(true)} style={{ position: "absolute", bottom: screen ? 20 : 72, right: 16, width: 52, height: 52, borderRadius: 26, background: `linear-gradient(135deg, ${T.purple}, #7040d0)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(160,124,248,0.5)", cursor: "pointer", border: "none", zIndex: 100 }}><Ico d={ICO.ai} size={26} color="#fff" /></button>}

      {/* AI Chat */}
      {showAI && (<div style={{ position: "absolute", inset: 0, background: T.bg, display: "flex", flexDirection: "column", zIndex: 150 }}>
        <div style={{ ...S.header, background: `linear-gradient(135deg, ${T.purple}20, ${T.bg2})` }}>
          <div onClick={() => setShowAI(false)} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.close} size={20} color={T.sub} /></div>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: `linear-gradient(135deg, ${T.purple}, #7040d0)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={ICO.ai} size={18} color="#fff" /></div>
          <div style={{ flex: 1 }}><div style={S.hTitle}>MASTRO AI</div><div style={S.hSub}>Assistente intelligente</div></div>
        </div>
        {/* Quick chips */}
        <div style={{ display: "flex", gap: 6, padding: "8px 12px", overflowX: "auto", flexShrink: 0 }}>
          {["Cosa ho oggi?","Riepilogo","Misure mancanti","Percorso","Prezzi","Priorità"].map(q => (<button key={q} onClick={() => { setAiChat(p => [...p, { role: "user", text: q }]); setAiLoading(true); setTimeout(() => { setAiChat(p => [...p, { role: "ai", text: getAIResponse(q, cantieri) }]); setAiLoading(false); }, 800); }} style={{ background: T.white08, border: `1px solid ${T.bdr}`, borderRadius: 20, padding: "6px 12px", fontSize: 11, color: T.sub, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans'" }}>{q}</button>))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {aiChat.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "85%", padding: "12px 16px", borderRadius: 16, borderBottomRightRadius: m.role === "user" ? 4 : 16, borderBottomLeftRadius: m.role === "user" ? 16 : 4, background: m.role === "user" ? T.acc + "20" : T.card, border: `1px solid ${m.role === "user" ? T.acc + "30" : T.bdr}` }}>
                <div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", color: T.text }}>{m.text.replace(/\*\*(.*?)\*\*/g, '$1')}</div>
              </div>
            </div>))}
          {aiLoading && <div style={{ display: "flex", gap: 6, padding: 12 }}>{[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: T.purple, opacity: 0.5 }} />)}</div>}
        </div>
        <div style={{ padding: "8px 12px 12px", background: T.bg2, borderTop: `1px solid ${T.bdr}`, display: "flex", gap: 8 }}>
          <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendAI()} placeholder="Chiedi a MASTRO AI..." style={{ ...S.input, flex: 1, borderRadius: 12 }} />
          <button onClick={sendAI} style={{ width: 44, height: 44, borderRadius: 22, background: aiInput.trim() ? T.purple : T.white08, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d="M5 12h14m-7-7l7 7-7 7" size={20} color={aiInput.trim() ? "#fff" : T.sub2} sw={2} /></button>
        </div>
      </div>)}

      {/* Modal Nuovo Cliente */}
      {showNewCliente && (<div style={S.modal} onClick={() => setShowNewCliente(false)}>
        <div style={S.modalBox} onClick={e => e.stopPropagation()}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>👤 Nuovo Cliente</div>
          {[{k:"cognome",l:"Cognome *",p:"Es. Rossi"},{k:"nome",l:"Nome *",p:"Es. Mario"},{k:"tel",l:"Telefono",p:"333 1234567"},{k:"indirizzo",l:"Indirizzo",p:"Via Roma 12, Cosenza"}].map(f => (
            <div key={f.k} style={{ marginBottom: 12 }}><div style={{ fontSize: 12, color: T.sub, fontWeight: 600, marginBottom: 4 }}>{f.l}</div><input value={newCl[f.k]} onChange={e => setNewCl(p => ({...p,[f.k]:e.target.value}))} placeholder={f.p} style={S.input} /></div>))}
          <button onClick={addCliente} style={{ ...S.btn(`linear-gradient(135deg, ${T.acc}, ${T.accD})`), marginTop: 8 }}>Crea Cliente</button>
        </div>
      </div>)}

      {/* Modal Nuova Commessa */}
      {showNewCommessa && (<div style={S.modal} onClick={() => setShowNewCommessa(false)}>
        <div style={S.modalBox} onClick={e => e.stopPropagation()}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📋 Nuova Commessa</div>
          <div style={{ marginBottom: 12 }}><div style={{ fontSize: 12, color: T.sub, fontWeight: 600, marginBottom: 4 }}>Cliente *</div>
            <select value={newCo.clienteId} onChange={e => setNewCo(p => ({...p,clienteId:parseInt(e.target.value)}))} style={{ ...S.input, appearance: "auto" }}>
              <option value={0}>Seleziona cliente...</option>
              {cantieri.map(c => <option key={c.id} value={c.id}>{c.cliente}</option>)}
            </select>
          </div>
          {[{k:"indirizzo",l:"Indirizzo lavoro",p:"Via..."},{k:"note",l:"Note",p:"Dettagli..."},{k:"vani",l:"N. vani stimati",p:"1"}].map(f => (
            <div key={f.k} style={{ marginBottom: 12 }}><div style={{ fontSize: 12, color: T.sub, fontWeight: 600, marginBottom: 4 }}>{f.l}</div><input value={newCo[f.k]} onChange={e => setNewCo(p => ({...p,[f.k]:e.target.value}))} placeholder={f.p} style={S.input} /></div>))}
          <button onClick={addCommessa} style={{ ...S.btn(`linear-gradient(135deg, ${T.grn}, #1a9e73)`), marginTop: 8 }}>Crea Commessa</button>
        </div>
      </div>)}
    </div>
  </>);
}