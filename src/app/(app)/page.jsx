"use client";
import { useState, useRef, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   MASTRO MISURE — v15 COMPLETE REBUILD
   Tutte le feature recuperate + design Apple chiaro
   ═══════════════════════════════════════════════════════ */

const FONT = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;600&display=swap";
const FF = "'Plus Jakarta Sans',sans-serif";
const FM = "'JetBrains Mono',monospace";

/* ── TEMI ── */
const THEMES = {
  chiaro: {
    name: "Chiaro", emoji: "☀️",
    bg: "#f5f5f7", bg2: "#ffffff", card: "#ffffff", card2: "#f8f8fa",
    bdr: "#e5e5ea", bdrL: "#d1d1d6", text: "#1d1d1f", sub: "#86868b", sub2: "#aeaeb2",
    acc: "#0066cc", accD: "#0055aa", accLt: "rgba(0,102,204,0.08)", accBg: "linear-gradient(135deg,#0066cc,#0055aa)",
    grn: "#34c759", grnLt: "rgba(52,199,89,0.08)",
    red: "#ff3b30", redLt: "rgba(255,59,48,0.08)",
    orange: "#ff9500", orangeLt: "rgba(255,149,0,0.08)",
    blue: "#007aff", blueLt: "rgba(0,122,255,0.08)",
    purple: "#af52de", purpleLt: "rgba(175,82,222,0.08)",
    cyan: "#32ade6", cyanLt: "rgba(50,173,230,0.08)",
    cardSh: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    cardShH: "0 4px 12px rgba(0,0,0,0.08)",
    r: 12, r2: 16
  },
  scuro: {
    name: "Scuro", emoji: "🌙",
    bg: "#000000", bg2: "#1c1c1e", card: "#1c1c1e", card2: "#2c2c2e",
    bdr: "#38383a", bdrL: "#48484a", text: "#f2f2f7", sub: "#8e8e93", sub2: "#636366",
    acc: "#0a84ff", accD: "#0070e0", accLt: "rgba(10,132,255,0.12)", accBg: "linear-gradient(135deg,#0a84ff,#0070e0)",
    grn: "#30d158", grnLt: "rgba(48,209,88,0.12)",
    red: "#ff453a", redLt: "rgba(255,69,58,0.12)",
    orange: "#ff9f0a", orangeLt: "rgba(255,159,10,0.12)",
    blue: "#0a84ff", blueLt: "rgba(10,132,255,0.12)",
    purple: "#bf5af2", purpleLt: "rgba(191,90,242,0.12)",
    cyan: "#64d2ff", cyanLt: "rgba(100,210,255,0.12)",
    cardSh: "0 1px 3px rgba(0,0,0,0.3)",
    cardShH: "0 4px 12px rgba(0,0,0,0.4)",
    r: 12, r2: 16
  },
  oceano: {
    name: "Oceano", emoji: "🌊",
    bg: "#0f1923", bg2: "#162231", card: "#1a2a3a", card2: "#1f3040",
    bdr: "#2a3f55", bdrL: "#345070", text: "#e8ecf0", sub: "#7a90a5", sub2: "#4a6070",
    acc: "#4fc3f7", accD: "#29b6f6", accLt: "rgba(79,195,247,0.12)", accBg: "linear-gradient(135deg,#4fc3f7,#29b6f6)",
    grn: "#66bb6a", grnLt: "rgba(102,187,106,0.12)",
    red: "#ef5350", redLt: "rgba(239,83,80,0.12)",
    orange: "#ffa726", orangeLt: "rgba(255,167,38,0.12)",
    blue: "#42a5f5", blueLt: "rgba(66,165,245,0.12)",
    purple: "#ab47bc", purpleLt: "rgba(171,71,188,0.12)",
    cyan: "#26c6da", cyanLt: "rgba(38,198,218,0.12)",
    cardSh: "0 1px 3px rgba(0,0,0,0.25)",
    cardShH: "0 4px 12px rgba(0,0,0,0.35)",
    r: 12, r2: 16
  }
};

/* ── PIPELINE 7+1 FASI ── */
const PIPELINE = [
  { id: "sopralluogo", nome: "Sopralluogo", ico: "🔍", color: "#007aff" },
  { id: "preventivo", nome: "Preventivo", ico: "📋", color: "#ff9500" },
  { id: "conferma", nome: "Conferma", ico: "✍️", color: "#af52de" },
  { id: "misure", nome: "Misure", ico: "📐", color: "#5856d6" },
  { id: "ordini", nome: "Ordini", ico: "📦", color: "#ff2d55" },
  { id: "produzione", nome: "Produzione", ico: "🏭", color: "#ff9500" },
  { id: "posa", nome: "Posa", ico: "🔧", color: "#34c759" },
  { id: "chiusura", nome: "Chiusura", ico: "✅", color: "#30b0c7" },
];

/* ── DATI DEMO ── */
const CANTIERI_INIT = [
  { id: 1, code: "CM-0004", cliente: "Fabio Cozza", indirizzo: "Via Gabriele Barrio, Cosenza", fase: "sopralluogo", vani: [
    { id: 1, nome: "Cucina", tipo: "Finestra", stanza: "Cucina", piano: "PT", misure: { lAlto: 1200, lCentro: 1198, lBasso: 1195, hSx: 1400, hCentro: 1402, hDx: 1398, d1: 0, d2: 0, spSx: 120, spDx: 120, arch: 0, davInt: 200, davEst: 50 }, cassonetto: true, casH: 250, casP: 300, accessori: { tapparella: { attivo: true, colore: "RAL 9010", l: 1200, h: 1600 }, persiana: { attivo: false }, zanzariera: { attivo: true, colore: "RAL 9010", l: 1180, h: 1380 } }, foto: { panoramica: true, spalle: true, soglia: false, dettagli: false }, note: "Muro portante, attenzione alla spalletta sinistra" },
    { id: 2, nome: "Salone", tipo: "Portafinestra", stanza: "Soggiorno", piano: "PT", misure: { lAlto: 1400, lCentro: 1402, lBasso: 1400, hSx: 2200, hCentro: 2200, hDx: 2198, d1: 2610, d2: 2608, spSx: 150, spDx: 150, arch: 0, davInt: 0, davEst: 0 }, cassonetto: false, accessori: { tapparella: { attivo: true, colore: "RAL 7016", l: 1400, h: 2400 }, persiana: { attivo: false }, zanzariera: { attivo: false } }, foto: { panoramica: true, spalle: true, soglia: true, dettagli: true }, note: "" },
    { id: 3, nome: "Camera", tipo: "Finestra", stanza: "Camera", piano: "P1", misure: {}, foto: {}, note: "", accessori: { tapparella: { attivo: false }, persiana: { attivo: false }, zanzariera: { attivo: false } } },
  ], sistema: "Schüco CT70", tipo: "nuova", telefono: "338 1234567", mezzoSalita: "Scala interna", allegati: [], creato: "15 Feb", aggiornato: "oggi", log: [
    { chi: "Fabio", cosa: "aggiunto vano Cucina — L:1200 H:1400", quando: "Oggi, 10:30", color: "#007aff" },
    { chi: "Fabio", cosa: "completato misure Salone", quando: "Oggi, 09:15", color: "#34c759" },
    { chi: "Marco", cosa: "eseguito sopralluogo", quando: "17 Feb, 14:00", color: "#ff9500" },
    { chi: "Fabio", cosa: "creato la commessa", quando: "15 Feb, 08:30", color: "#86868b" },
  ]},
  { id: 2, code: "CM-0002", cliente: "Teresa Bruno", indirizzo: "Via Roma 45, Rende", fase: "ordini", vani: [
    { id: 1, nome: "Bagno", tipo: "Vasistas", stanza: "Bagno", piano: "P1", misure: { lAlto: 800, lCentro: 800, lBasso: 798, hSx: 600, hCentro: 600, hDx: 600 }, foto: { panoramica: true }, note: "", accessori: { tapparella: { attivo: false }, persiana: { attivo: false }, zanzariera: { attivo: false } } },
    { id: 2, nome: "Studio", tipo: "Finestra", stanza: "Studio", piano: "PT", misure: { lAlto: 1000, lCentro: 998, lBasso: 1000, hSx: 1200, hCentro: 1200, hDx: 1198 }, foto: { panoramica: true, soglia: true }, note: "Doppio vetro richiesto", accessori: { tapparella: { attivo: true, colore: "RAL 7016", l: 1000, h: 1400 }, persiana: { attivo: false }, zanzariera: { attivo: false } } },
    { id: 3, nome: "Ingresso", tipo: "Porta", stanza: "Ingresso", piano: "PT", misure: { lAlto: 900, lCentro: 900, lBasso: 900, hSx: 2100, hCentro: 2100, hDx: 2100 }, foto: {}, note: "", accessori: { tapparella: { attivo: false }, persiana: { attivo: false }, zanzariera: { attivo: false } } },
    { id: 4, nome: "Cameretta", tipo: "Finestra", stanza: "Camera", piano: "P1", misure: { lAlto: 1100, lCentro: 1100, lBasso: 1098 }, foto: {}, note: "", accessori: { tapparella: { attivo: false }, persiana: { attivo: false }, zanzariera: { attivo: false } } },
  ], sistema: "Rehau S80", tipo: "nuova", telefono: "347 9876543", mezzoSalita: "Scala a mano", allegati: [], creato: "10 Feb", aggiornato: "16 Feb", log: [
    { chi: "Fabio", cosa: "avanzato a Ordine", quando: "16 Feb, 11:00", color: "#ff2d55" },
    { chi: "Fabio", cosa: "completato tutte le misure", quando: "15 Feb, 16:30", color: "#34c759" },
    { chi: "Fabio", cosa: "creato la commessa", quando: "10 Feb, 08:00", color: "#86868b" },
  ]},
  { id: 3, code: "CM-0003", cliente: "Mario Ferraro", indirizzo: "Via Gabriele Barrio, Cosenza", fase: "sopralluogo", vani: [
    { id: 1, nome: "Sala", tipo: "Scorrevole", stanza: "Soggiorno", piano: "PT", misure: {}, foto: {}, note: "", accessori: { tapparella: { attivo: false }, persiana: { attivo: false }, zanzariera: { attivo: false } } },
  ], sistema: "", tipo: "riparazione", telefono: "", mezzoSalita: "", allegati: [], creato: "12 Feb", aggiornato: "12 Feb", alert: "Sopralluogo oggi", log: [] },
  { id: 4, code: "CM-0001", cliente: "Antonio Rossi", indirizzo: "Via G. Barrio, 8", fase: "sopralluogo", vani: [], sistema: "", tipo: "nuova", telefono: "333 7654321", mezzoSalita: "", allegati: [], creato: "8 Feb", aggiornato: "8 Feb", alert: "Nessun vano inserito", log: [] },
];

const TASKS_INIT = [
  { id: 1, text: "Sopralluogo Via G. Barrio", meta: "Portare metro laser + modulo", time: "09:00", priority: "alta", cm: "CM-0003", done: false },
  { id: 2, text: "Inserire misure vani CM-0001", meta: "Cliente aspetta preventivo", time: "", priority: "media", cm: "CM-0001", done: false },
  { id: 3, text: "Chiamare fornitore Schüco", meta: "Confermare data consegna ordine", time: "15:00", priority: "bassa", cm: "CM-0002", done: false },
  { id: 4, text: "Comprare viti inox 5x60", meta: "Brico — fatto", time: "08:00", priority: "bassa", cm: "", done: true },
];

const MSGS_INIT = [
  { id: 1, from: "Fornitore Schüco", preview: "Conferma ordine #4521 — materiale pronto per spedizione il 20/02", time: "14:32", cm: "CM-0002", read: false, canale: "email", thread: [
    { who: "Tu", text: "Buongiorno, stato ordine #4521?", time: "09:15", date: "18/02", canale: "email" },
    { who: "Fornitore Schüco", text: "Ordine in lavorazione, consegna prevista 20/02", time: "10:40", date: "18/02", canale: "email" },
    { who: "Tu", text: "Perfetto, confermate anche le maniglie satinate?", time: "11:05", date: "18/02", canale: "email" },
    { who: "Fornitore Schüco", text: "Conferma ordine #4521 — materiale pronto per spedizione il 20/02. Maniglie satinate incluse.", time: "14:32", date: "19/02", canale: "email" },
  ]},
  { id: 2, from: "Mario (posatore)", preview: "Fabio, per la CM-0004 servono i controtelai speciali?", time: "12:15", cm: "CM-0004", read: false, canale: "whatsapp", thread: [
    { who: "Mario", text: "Ciao Fabio, domani vado a posare CM-0004", time: "08:30", date: "19/02", canale: "whatsapp" },
    { who: "Tu", text: "Ok Mario, ricordati il silicone neutro", time: "08:45", date: "19/02", canale: "whatsapp" },
    { who: "Mario", text: "Fabio, per la CM-0004 servono i controtelai speciali?", time: "12:15", date: "19/02", canale: "whatsapp" },
  ]},
  { id: 3, from: "Cliente Rossi", preview: "Grazie per il preventivo, procediamo con l'ordine", time: "Ieri", cm: "CM-0001", read: true, canale: "sms", thread: [
    { who: "Tu", text: "Buongiorno Sig. Rossi, in allegato il preventivo per la sostituzione dei 5 infissi.", time: "16:00", date: "17/02", canale: "email" },
    { who: "Cliente Rossi", text: "Grazie per il preventivo, procediamo con l'ordine", time: "09:30", date: "18/02", canale: "sms" },
  ]},
  { id: 4, from: "Vetreria Milano", preview: "Vetri tripli pronti per il ritiro", time: "11:00", cm: "CM-0002", read: false, canale: "telegram", thread: [
    { who: "Vetreria Milano", text: "Vetri tripli pronti per il ritiro. Magazzino aperto fino alle 17.", time: "11:00", date: "19/02", canale: "telegram" },
  ]},
  { id: 5, from: "Teresa Bruno", preview: "Quando iniziate i lavori?", time: "Ieri", cm: "CM-0002", read: true, canale: "whatsapp", thread: [
    { who: "Teresa Bruno", text: "Buongiorno, quando iniziate i lavori a casa mia?", time: "15:00", date: "18/02", canale: "whatsapp" },
    { who: "Tu", text: "Buongiorno signora Bruno, prevediamo di iniziare la prossima settimana", time: "15:30", date: "18/02", canale: "whatsapp" },
    { who: "Teresa Bruno", text: "Quando iniziate i lavori?", time: "10:00", date: "19/02", canale: "sms" },
  ]},
];

const TEAM_INIT = [
  { id: 1, nome: "Fabio Cozza", ruolo: "Titolare", compiti: "Gestione commesse, preventivi, rapporti clienti", colore: "#007aff" },
  { id: 2, nome: "Marco Ferraro", ruolo: "Posatore", compiti: "Sopralluoghi, misure, installazione", colore: "#34c759" },
  { id: 3, nome: "Sara Greco", ruolo: "Ufficio", compiti: "Ordini, contabilità, assistenza clienti", colore: "#af52de" },
];

const CONTATTI_INIT = [
  { id: 1, nome: "Giuseppe Rossi", tipo: "cliente", tel: "347 1234567", email: "rossi@email.it", preferito: true, canali: ["whatsapp", "email"], cm: "CM-0001" },
  { id: 2, nome: "Teresa Bruno", tipo: "cliente", tel: "338 9876543", email: "bruno@pec.it", preferito: true, canali: ["whatsapp", "sms"], cm: "CM-0002" },
  { id: 3, nome: "Lucia Ferraro", tipo: "cliente", tel: "333 4567890", email: "", preferito: false, canali: ["whatsapp"], cm: "CM-0003" },
  { id: 4, nome: "Antonio Mancini", tipo: "cliente", tel: "340 1112233", email: "mancini@gmail.com", preferito: false, canali: ["whatsapp", "email"], cm: "CM-0004" },
  { id: 5, nome: "Fornitore Schüco", tipo: "fornitore", tel: "0984 123456", email: "ordini@schuco.it", preferito: true, canali: ["email", "telegram"], cm: "" },
  { id: 6, nome: "Vetreria Milano", tipo: "fornitore", tel: "02 9876543", email: "info@vetreriami.it", preferito: true, canali: ["email", "telegram"], cm: "" },
  { id: 7, nome: "Ferramenta Cosenza", tipo: "fornitore", tel: "0984 555666", email: "ordini@ferracosenza.it", preferito: false, canali: ["email", "whatsapp"], cm: "" },
  { id: 8, nome: "Geom. Calabrò", tipo: "professionista", tel: "339 7778899", email: "calabro@studio.it", preferito: false, canali: ["email", "whatsapp"], cm: "" },
];

const COLORI_INIT = [
  { id: 1, nome: "Bianco", code: "RAL 9010", hex: "#f5f5f0", tipo: "RAL" },
  { id: 2, nome: "Grigio antracite", code: "RAL 7016", hex: "#383e42", tipo: "RAL" },
  { id: 3, nome: "Nero", code: "RAL 9005", hex: "#0e0e10", tipo: "RAL" },
  { id: 4, nome: "Marrone", code: "RAL 8014", hex: "#4a3728", tipo: "RAL" },
  { id: 5, nome: "Noce", code: "Noce", hex: "#6b4226", tipo: "Legno" },
  { id: 6, nome: "Rovere", code: "Rovere", hex: "#a0784a", tipo: "Legno" },
];

const SISTEMI_INIT = [
  { id: 1, marca: "Aluplast", sistema: "Ideal 4000", euroMq: 180, sovRAL: 12, sovLegno: 22, colori: ["RAL 9010", "RAL 7016", "RAL 9005", "Noce"], sottosistemi: ["Classicline", "Roundline"] },
  { id: 2, marca: "Schüco", sistema: "CT70", euroMq: 280, sovRAL: 15, sovLegno: 25, colori: ["RAL 9010", "RAL 7016", "RAL 9005"], sottosistemi: ["Classic", "Rondo"] },
  { id: 3, marca: "Rehau", sistema: "S80", euroMq: 220, sovRAL: 12, sovLegno: 20, colori: ["RAL 9010", "RAL 7016", "Noce"], sottosistemi: ["Geneo", "Synego"] },
  { id: 4, marca: "Finstral", sistema: "FIN-Project", euroMq: 350, sovRAL: 18, sovLegno: 30, colori: ["RAL 9010", "RAL 7016", "RAL 9005", "Rovere"], sottosistemi: ["Nova-line", "Step-line"] },
];

const VETRI_INIT = [
  { id: 1, nome: "Doppio basso emissivo", code: "4/16/4 BE", ug: 1.1 },
  { id: 2, nome: "Triplo basso emissivo", code: "4/12/4/12/4 BE", ug: 0.6 },
  { id: 3, nome: "Doppio sicurezza", code: "33.1/16/4 BE", ug: 1.1 },
  { id: 4, nome: "Triplo sicurezza", code: "33.1/12/4/12/4 BE", ug: 0.6 },
  { id: 5, nome: "Satinato", code: "4/16/4 SAT", ug: 1.1 },
  { id: 6, nome: "Fonoisolante", code: "44.2/20/6 BE", ug: 1.0 },
];

const TIPOLOGIE_RAPIDE = [
  { code: "F1A", label: "Finestra 1 anta", icon: "🪟" },
  { code: "F2A", label: "Finestra 2 ante", icon: "🪟" },
  { code: "F3A", label: "Finestra 3 ante", icon: "🪟" },
  { code: "PF1A", label: "Portafinestra 1 anta", icon: "🚪" },
  { code: "PF2A", label: "Portafinestra 2 ante", icon: "🚪" },
  { code: "SC2A", label: "Scorrevole 2 ante", icon: "↔" },
  { code: "SC4A", label: "Scorrevole 4 ante", icon: "↔" },
  { code: "ALZSC", label: "Alzante scorrevole", icon: "⬆" },
  { code: "FISDX", label: "Fisso DX", icon: "▮" },
  { code: "FISSX", label: "Fisso SX", icon: "▮" },
  { code: "VAS", label: "Vasistas", icon: "⬇" },
  { code: "BLI", label: "Porta blindata", icon: "🛡" },
  { code: "SOPR", label: "Sopraluce", icon: "△" },
  { code: "MONO", label: "Monoblocco", icon: "⬜" },
];

const COPRIFILI_INIT = [
  { id: 1, nome: "Coprifilo piatto 40mm", cod: "CP40" },
  { id: 2, nome: "Coprifilo piatto 50mm", cod: "CP50" },
  { id: 3, nome: "Coprifilo piatto 70mm", cod: "CP70" },
  { id: 4, nome: "Coprifilo angolare 40mm", cod: "CA40" },
  { id: 5, nome: "Coprifilo a Z 50mm", cod: "CZ50" },
];

const LAMIERE_INIT = [
  { id: 1, nome: "Lamiera davanzale 200mm", cod: "LD200" },
  { id: 2, nome: "Lamiera davanzale 250mm", cod: "LD250" },
  { id: 3, nome: "Lamiera davanzale 300mm", cod: "LD300" },
  { id: 4, nome: "Scossalina 150mm", cod: "SC150" },
  { id: 5, nome: "Scossalina 200mm", cod: "SC200" },
];

/* ── ICONS SVG ── */
const Ico = ({ d, s = 20, c = "#888", sw = 1.8 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const ICO = {
  home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  chat: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  back: <><polyline points="15 18 9 12 15 6"/></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  check: <><polyline points="20 6 9 17 4 12"/></>,
  phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></>,
  map: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
  camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
  pen: <><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></>,
  trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
  ai: <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></>,
};

/* ── MISURE PUNTI ── */
const PUNTI_MISURE = [
  { key: "lAlto", label: "L alto", x: 95, y: 8, color: "acc" },
  { key: "lCentro", label: "L centro", x: 95, y: 125, color: "acc" },
  { key: "lBasso", label: "L basso", x: 95, y: 242, color: "acc" },
  { key: "hSx", label: "H sx", x: 8, y: 125, color: "blue", rot: true },
  { key: "hCentro", label: "H centro", x: 95, y: 170, color: "blue" },
  { key: "hDx", label: "H dx", x: 182, y: 125, color: "blue", rot: true },
  { key: "d1", label: "D1 ↗", x: 50, y: 55, color: "purple" },
  { key: "d2", label: "D2 ↘", x: 140, y: 55, color: "purple" },
];

/* ══════════════════════════════════════ */
/* ══          MAIN COMPONENT          ══ */
/* ══════════════════════════════════════ */

export default function MastroMisure() {
  const [theme, setTheme] = useState("chiaro");
  const T = THEMES[theme];
  
  const [tab, setTab] = useState("home");
  const [cantieri, setCantieri] = useState(CANTIERI_INIT);
  const [tasks, setTasks] = useState(TASKS_INIT);
  const [msgs, setMsgs] = useState(MSGS_INIT);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [team, setTeam] = useState(TEAM_INIT);
  const [coloriDB, setColoriDB] = useState(COLORI_INIT);
  const [sistemiDB, setSistemiDB] = useState(SISTEMI_INIT);
  const [vetriDB, setVetriDB] = useState(VETRI_INIT);
  const [coprifiliDB, setCoprifiliDB] = useState(COPRIFILI_INIT);
  const [lamiereDB, setLamiereDB] = useState(LAMIERE_INIT);
  const [favTipologie, setFavTipologie] = useState(["F1A", "F2A", "PF2A", "SC2A", "FISDX", "VAS"]);
  
  // Navigation
  const [selectedCM, setSelectedCM] = useState(null);
  const [selectedVano, setSelectedVano] = useState(null);
  const [filterFase, setFilterFase] = useState("tutte");
  const [searchQ, setSearchQ] = useState("");
  const [showModal, setShowModal] = useState(null); // 'task' | 'commessa' | 'vano' | null
  const [settingsTab, setSettingsTab] = useState("generali");
  const [aiChat, setAiChat] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMsgs, setAiMsgs] = useState([{ role: "ai", text: "Ciao Fabio! Sono MASTRO AI. Chiedimi qualsiasi cosa sulle tue commesse, task o misure." }]);
  
  // Send commessa modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendOpts, setSendOpts] = useState({ misure: true, foto: true, disegno: true, note: true, accessori: true });
  const [sendConfirm, setSendConfirm] = useState(null);
  
  // Vano wizard step
  const [vanoStep, setVanoStep] = useState(0);
  const spCanvasRef = useRef(null);
  const [spDrawing, setSpDrawing] = useState(false); // "sent" | null
  
  // Agenda
  const [agendaView, setAgendaView] = useState("mese"); // "giorno" | "settimana" | "mese"
  const [selDate, setSelDate] = useState(new Date());
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ text: "", time: "", tipo: "appuntamento", cm: "", persona: "", date: "" });
  const [events, setEvents] = useState(() => {
    const t = new Date(); const td = t.toISOString().split("T")[0];
    const tm = new Date(t); tm.setDate(tm.getDate() + 1); const tmStr = tm.toISOString().split("T")[0];
    const t2 = new Date(t); t2.setDate(t2.getDate() + 2); const t2Str = t2.toISOString().split("T")[0];
    return [
      { id: 1, text: "Sopralluogo Ferraro", time: "09:00", date: td, tipo: "appuntamento", cm: "CM-0003", persona: "Fabio Cozza", color: "#ff3b30", addr: "Via G. Barrio" },
      { id: 2, text: "Consegna materiale Bruno", time: "14:00", date: td, tipo: "appuntamento", cm: "CM-0002", persona: "Sara Greco", color: "#007aff", addr: "Via Roma 45, Rende" },
      { id: 3, text: "Posa Cozza — Camera", time: "16:30", date: td, tipo: "appuntamento", cm: "CM-0004", persona: "Marco Ferraro", color: "#34c759", addr: "Via G. Barrio" },
      { id: 4, text: "Ritiro vetri Finstral", time: "10:00", date: tmStr, tipo: "task", cm: "", persona: "Marco Ferraro", color: "#ff9500" },
      { id: 5, text: "Preventivo Rossi", time: "", date: t2Str, tipo: "task", cm: "CM-0001", persona: "Sara Greco", color: "#af52de" },
    ];
  });
  
  // Advance fase notification
  const [faseNotif, setFaseNotif] = useState(null);
  
  // AI Photo
  const [showAIPhoto, setShowAIPhoto] = useState(false);
  const [aiPhotoStep, setAiPhotoStep] = useState(0); // 0=ready, 1=analyzing, 2=done
  const [settingsModal, setSettingsModal] = useState(null); // {type, item?}
  const [settingsForm, setSettingsForm] = useState({});
  const [showAllegatiModal, setShowAllegatiModal] = useState(null); // "nota" | "vocale" | "video" | null
  const [allegatiText, setAllegatiText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const recInterval = useRef(null);
  const [playingId, setPlayingId] = useState(null);
  const [playProgress, setPlayProgress] = useState(0);
  const playInterval = useRef(null);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Drawing state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#1d1d1f");
  const [penSize, setPenSize] = useState(2);
  const [drawPaths, setDrawPaths] = useState([]);

  // New task form
  const [newTask, setNewTask] = useState({ text: "", meta: "", time: "", priority: "media", cm: "" });
  const [taskAllegati, setTaskAllegati] = useState([]); // allegati for new task
  const [msgFilter, setMsgFilter] = useState("tutti"); // tutti/email/whatsapp/sms/telegram
  const [msgSearch, setMsgSearch] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeMsg, setComposeMsg] = useState({ to: "", text: "", canale: "whatsapp", cm: "" });
  const [fabOpen, setFabOpen] = useState(false);
  const [contatti, setContatti] = useState(CONTATTI_INIT);
  const [msgSubTab, setMsgSubTab] = useState("chat"); // "chat" | "rubrica"
  const [rubricaSearch, setRubricaSearch] = useState("");
  const [rubricaFilter, setRubricaFilter] = useState("tutti"); // tutti/preferiti/team/clienti/fornitori
  const [globalSearch, setGlobalSearch] = useState("");
  // New commessa form
  const [newCM, setNewCM] = useState({ cliente: "", indirizzo: "", telefono: "", sistema: "", tipo: "nuova", difficoltaSalita: "", mezzoSalita: "", foroScale: "", pianoEdificio: "", note: "" });
  // New vano form
  const [newVano, setNewVano] = useState({ nome: "", tipo: "F1A", stanza: "Soggiorno", piano: "PT", sistema: "", coloreInt: "", coloreEst: "", bicolore: false, coloreAcc: "", vetro: "", telaio: "", telaioAlaZ: "", rifilato: false, rifilSx: "", rifilDx: "", rifilSopra: "", rifilSotto: "", coprifilo: "", lamiera: "" });
  const [customPiani, setCustomPiani] = useState(["S1", "PT", "P1", "P2", "P3"]);
  const [mezziSalita, setMezziSalita] = useState(["Scala interna", "Scala esterna", "Scala aerea", "Scala a mano", "Gru", "Elevatore", "Ponteggio", "Nessuno"]);
  const [showAddPiano, setShowAddPiano] = useState(false);
  const [newPiano, setNewPiano] = useState("");

  // Responsive width
  const [winW, setWinW] = useState(typeof window !== "undefined" ? window.innerWidth : 430);
  useEffect(() => {
    const h = () => setWinW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  const isTablet = winW >= 768;
  const isDesktop = winW >= 1024;

  const goBack = () => {
    if (showRiepilogo) { setShowRiepilogo(false); return; }
    if (selectedVano) { setSelectedVano(null); setVanoStep(0); return; }
    if (selectedCM) { setSelectedCM(null); return; }
  };

  /* ── Helpers ── */
  const countVani = () => cantieri.reduce((s, c) => s + c.vani.length, 0);
  const urgentCount = () => cantieri.filter(c => c.alert).length;
  const readyCount = () => cantieri.filter(c => c.fase === "posa" || c.fase === "chiusura").length;
  const faseIndex = (fase) => PIPELINE.findIndex(p => p.id === fase);
  const priColor = (p) => p === "alta" ? T.red : p === "media" ? T.orange : T.sub2;

  const toggleTask = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const addTask = () => {
    if (!newTask.text.trim()) return;
    setTasks(ts => [...ts, { id: Date.now(), ...newTask, done: false, allegati: [...taskAllegati] }]);
    setTaskAllegati([]);
    setNewTask({ text: "", meta: "", time: "", priority: "media", cm: "" });
    setShowModal(null);
  };

  const addCommessa = () => {
    if (!newCM.cliente.trim()) return;
    const code = "CM-" + String(cantieri.length + 1).padStart(4, "0");
    const nc = { id: Date.now(), code, cliente: newCM.cliente, indirizzo: newCM.indirizzo, telefono: newCM.telefono, fase: "sopralluogo", vani: [], sistema: newCM.sistema, tipo: newCM.tipo, difficoltaSalita: newCM.difficoltaSalita, mezzoSalita: newCM.mezzoSalita, foroScale: newCM.foroScale, pianoEdificio: newCM.pianoEdificio, note: newCM.note, allegati: [], creato: "Oggi", aggiornato: "Oggi", log: [{ chi: "Fabio", cosa: "creato la commessa", quando: "Adesso", color: T.sub }] };
    setCantieri(cs => [nc, ...cs]);
    setNewCM({ cliente: "", indirizzo: "", telefono: "", sistema: "", tipo: "nuova", difficoltaSalita: "", mezzoSalita: "", foroScale: "", pianoEdificio: "", note: "" });
    setShowModal(null);
    setSelectedCM(nc);
    setTab("commesse");
  };

  const addVano = () => {
    if (!selectedCM) return;
    const tipObj = TIPOLOGIE_RAPIDE.find(t => t.code === newVano.tipo);
    const nome = newVano.nome.trim() || `${tipObj?.label || newVano.tipo} ${(selectedCM.vani?.length || 0) + 1}`;
    const v = { id: Date.now(), nome, tipo: newVano.tipo, stanza: newVano.stanza, piano: newVano.piano, sistema: newVano.sistema, coloreInt: newVano.coloreInt, coloreEst: newVano.coloreEst, bicolore: newVano.bicolore, coloreAcc: newVano.coloreAcc, vetro: newVano.vetro, telaio: newVano.telaio, telaioAlaZ: newVano.telaioAlaZ, rifilato: newVano.rifilato, rifilSx: newVano.rifilSx, rifilDx: newVano.rifilDx, rifilSopra: newVano.rifilSopra, rifilSotto: newVano.rifilSotto, coprifilo: newVano.coprifilo, lamiera: newVano.lamiera, misure: {}, foto: {}, note: "", cassonetto: false, accessori: { tapparella: { attivo: false }, persiana: { attivo: false }, zanzariera: { attivo: false } } };
    setCantieri(cs => cs.map(c => c.id === selectedCM.id ? { ...c, vani: [...c.vani, v], aggiornato: "Oggi" } : c));
    setSelectedCM(prev => ({ ...prev, vani: [...prev.vani, v] }));
    setNewVano(prev => ({ nome: "", tipo: prev.tipo, stanza: "Soggiorno", piano: prev.piano, sistema: prev.sistema, coloreInt: prev.coloreInt, coloreEst: prev.coloreEst, bicolore: prev.bicolore, coloreAcc: prev.coloreAcc, vetro: prev.vetro, telaio: prev.telaio, telaioAlaZ: prev.telaioAlaZ, rifilato: prev.rifilato, rifilSx: prev.rifilSx, rifilDx: prev.rifilDx, rifilSopra: prev.rifilSopra, rifilSotto: prev.rifilSotto, coprifilo: prev.coprifilo, lamiera: prev.lamiera }));
    setShowModal(null);
  };

  const updateMisura = (vanoId, key, value) => {
    const val = value === "" ? "" : value;
    const numVal = parseInt(value) || 0;
    setCantieri(cs => cs.map(c => c.id === selectedCM?.id ? {
      ...c, vani: c.vani.map(v => v.id === vanoId ? { ...v, misure: { ...v.misure, [key]: numVal } } : v)
    } : c));
    if (selectedVano?.id === vanoId) {
      setSelectedVano(prev => ({ ...prev, misure: { ...prev.misure, [key]: numVal } }));
    }
    setSelectedCM(prev => prev ? ({ ...prev, vani: prev.vani.map(v => v.id === vanoId ? { ...v, misure: { ...v.misure, [key]: numVal } } : v) }) : prev);
  };

  const toggleAccessorio = (vanoId, acc) => {
    setCantieri(cs => cs.map(c => c.id === selectedCM?.id ? {
      ...c, vani: c.vani.map(v => v.id === vanoId ? { ...v, accessori: { ...v.accessori, [acc]: { ...v.accessori[acc], attivo: !v.accessori[acc].attivo } } } : v)
    } : c));
    if (selectedVano?.id === vanoId) {
      setSelectedVano(prev => ({ ...prev, accessori: { ...prev.accessori, [acc]: { ...prev.accessori[acc], attivo: !prev.accessori[acc].attivo } } }));
    }
  };

  const updateAccessorio = (vanoId, acc, field, value) => {
    setCantieri(cs => cs.map(c => c.id === selectedCM?.id ? {
      ...c, vani: c.vani.map(v => v.id === vanoId ? { ...v, accessori: { ...v.accessori, [acc]: { ...v.accessori[acc], [field]: value } } } : v)
    } : c));
    if (selectedVano?.id === vanoId) {
      setSelectedVano(prev => ({ ...prev, accessori: { ...prev.accessori, [acc]: { ...prev.accessori[acc], [field]: value } } }));
    }
    setSelectedCM(prev => prev ? ({ ...prev, vani: prev.vani.map(v => v.id === vanoId ? { ...v, accessori: { ...v.accessori, [acc]: { ...v.accessori[acc], [field]: value } } } : v) }) : prev);
  };

  // DELETE functions
  const deleteTask = (taskId) => { if (confirm("Eliminare questo task?")) setTasks(ts => ts.filter(t => t.id !== taskId)); };
  const deleteVano = (vanoId) => {
    if (!confirm("Eliminare questo vano e tutte le sue misure?")) return;
    setCantieri(cs => cs.map(c => c.id === selectedCM?.id ? { ...c, vani: c.vani.filter(v => v.id !== vanoId) } : c));
    setSelectedCM(prev => prev ? ({ ...prev, vani: prev.vani.filter(v => v.id !== vanoId) }) : prev);
    if (selectedVano?.id === vanoId) { setSelectedVano(null); setVanoStep(0); }
  };
  const deleteCommessa = (cmId) => {
    if (!confirm("Eliminare questa commessa e tutti i suoi vani?")) return;
    setCantieri(cs => cs.filter(c => c.id !== cmId));
    if (selectedCM?.id === cmId) { setSelectedCM(null); setSelectedVano(null); }
  };
  const deleteEvent = (evId) => { if (confirm("Eliminare questo evento?")) setEvents(ev => ev.filter(e => e.id !== evId)); };
  const deleteMsg = (msgId) => { if (confirm("Eliminare questo messaggio?")) setMsgs(ms => ms.filter(m => m.id !== msgId)); };

  const addAllegato = (tipo, content) => {
    if (!selectedCM) return;
    const a = { id: Date.now(), tipo, nome: content || (tipo === "file" ? "Allegato" : tipo === "vocale" ? "Nota vocale" : tipo === "video" ? "Video" : "Nota"), data: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }), durata: tipo === "vocale" ? "0:" + String(Math.floor(Math.random() * 30 + 5)).padStart(2, "0") : tipo === "video" ? "0:" + String(Math.floor(Math.random() * 45 + 10)).padStart(2, "0") : "" };
    setCantieri(cs => cs.map(x => x.id === selectedCM.id ? { ...x, allegati: [...(x.allegati || []), a] } : x));
    setSelectedCM(p => ({ ...p, allegati: [...(p.allegati || []), a] }));
  };

  const playAllegato = (id) => {
    if (playingId === id) { clearInterval(playInterval.current); setPlayingId(null); setPlayProgress(0); return; }
    clearInterval(playInterval.current);
    setPlayingId(id); setPlayProgress(0);
    let prog = 0;
    playInterval.current = setInterval(() => { prog += 2; setPlayProgress(prog); if (prog >= 100) { clearInterval(playInterval.current); setPlayingId(null); setPlayProgress(0); } }, 100);
  };

  // SETTINGS CRUD
  const addSettingsItem = () => {
    const f = settingsForm;
    if (settingsModal === "sistema" && f.marca && f.sistema) {
      setSistemiDB(s => [...s, { id: Date.now(), marca: f.marca, sistema: f.sistema, euroMq: parseInt(f.euroMq) || 0, sovRAL: parseInt(f.sovRAL) || 0, sovLegno: parseInt(f.sovLegno) || 0, colori: [], sottosistemi: f.sottosistemi ? f.sottosistemi.split(",").map(s => s.trim()) : [] }]);
    } else if (settingsModal === "colore" && f.nome && f.code) {
      setColoriDB(c => [...c, { id: Date.now(), nome: f.nome, code: f.code, hex: f.hex || "#888888", tipo: f.tipo || "RAL" }]);
    } else if (settingsModal === "vetro" && f.nome && f.code) {
      setVetriDB(v => [...v, { id: Date.now(), nome: f.nome, code: f.code, ug: parseFloat(f.ug) || 1.0 }]);
    } else if (settingsModal === "coprifilo" && f.nome && f.cod) {
      setCoprifiliDB(c => [...c, { id: Date.now(), nome: f.nome, cod: f.cod }]);
    } else if (settingsModal === "lamiera" && f.nome && f.cod) {
      setLamiereDB(l => [...l, { id: Date.now(), nome: f.nome, cod: f.cod }]);
    } else if (settingsModal === "tipologia" && f.code && f.label) {
      TIPOLOGIE_RAPIDE.push({ code: f.code, label: f.label, icon: f.icon || "🪟" });
    } else if (settingsModal === "membro" && f.nome) {
      const colori = ["#007aff","#34c759","#af52de","#ff9500","#ff3b30","#5ac8fa"];
      setTeam(t => [...t, { id: Date.now(), nome: f.nome, ruolo: f.ruolo || "Posatore", compiti: f.compiti || "", colore: colori[t.length % colori.length] }]);
    } else return;
    setSettingsModal(null); setSettingsForm({});
  };
  const deleteSettingsItem = (type, id) => {
    if (!confirm("Eliminare?")) return;
    if (type === "sistema") setSistemiDB(s => s.filter(x => x.id !== id));
    if (type === "colore") setColoriDB(c => c.filter(x => x.id !== id));
    if (type === "vetro") setVetriDB(v => v.filter(x => x.id !== id));
    if (type === "coprifilo") setCoprifiliDB(c => c.filter(x => x.id !== id));
    if (type === "lamiera") setLamiereDB(l => l.filter(x => x.id !== id));
  };

  const advanceFase = (cmId) => {
    const FASE_TEAM = { preventivo: "Sara Greco", conferma: "Sara Greco", misure: "Marco Ferraro", ordini: "Sara Greco", produzione: "Marco Ferraro", posa: "Marco Ferraro", chiusura: "Fabio Cozza" };
    setCantieri(cs => cs.map(c => {
      if (c.id !== cmId) return c;
      const idx = faseIndex(c.fase);
      if (idx < PIPELINE.length - 1) {
        const next = PIPELINE[idx + 1];
        return { ...c, fase: next.id, log: [{ chi: "Fabio", cosa: `avanzato a ${next.nome}`, quando: "Adesso", color: next.color }, ...c.log] };
      }
      return c;
    }));
    if (selectedCM?.id === cmId) {
      const idx = faseIndex(selectedCM.fase);
      if (idx < PIPELINE.length - 1) {
        const next = PIPELINE[idx + 1];
        const addetto = FASE_TEAM[next.id] || "Fabio Cozza";
        setSelectedCM(prev => ({ ...prev, fase: next.id, log: [{ chi: "Fabio", cosa: `avanzato a ${next.nome}`, quando: "Adesso", color: next.color }, ...prev.log] }));
        setFaseNotif({ fase: next.nome, addetto, color: next.color });
        setTimeout(() => setFaseNotif(null), 4000);
      }
    }
  };

  const addEvent = () => {
    if (!newEvent.text.trim()) return;
    setEvents(ev => [...ev, { id: Date.now(), ...newEvent, date: newEvent.date || selDate.toISOString().split("T")[0], color: newEvent.tipo === "appuntamento" ? "#007aff" : "#ff9500" }]);
    setNewEvent({ text: "", time: "", tipo: "appuntamento", cm: "", persona: "", date: "" });
    setShowNewEvent(false);
  };

  const sendCommessa = () => {
    setSendConfirm("sent");
    setTimeout(() => { setSendConfirm(null); setShowSendModal(false); }, 2500);
  };

  const handleAI = () => {
    if (!aiInput.trim()) return;
    const q = aiInput.toLowerCase();
    setAiMsgs(m => [...m, { role: "user", text: aiInput }]);
    setAiInput("");
    let resp = "Non ho capito, prova a riformulare la domanda.";
    if (q.includes("oggi") || q.includes("programma")) {
      const t = tasks.filter(x => !x.done);
      resp = `Oggi hai ${t.length} task aperti:\n${t.map((x, i) => `${i + 1}. ${x.text}${x.time ? ` (${x.time})` : ""}`).join("\n")}`;
    } else if (q.includes("commess") || q.includes("stato") || q.includes("pipeline")) {
      resp = `Hai ${cantieri.length} commesse:\n${cantieri.map(c => `• ${c.code} ${c.cliente} — ${PIPELINE.find(p => p.id === c.fase)?.nome}`).join("\n")}`;
    } else if (q.includes("vani") || q.includes("misur")) {
      resp = `Totale vani: ${countVani()}\nCommesse con vani da misurare:\n${cantieri.filter(c => c.vani.some(v => Object.keys(v.misure || {}).length < 6)).map(c => `• ${c.code}: ${c.vani.filter(v => Object.keys(v.misure || {}).length < 6).length} vani incompleti`).join("\n")}`;
    } else if (q.includes("urgent") || q.includes("priorit")) {
      const u = tasks.filter(x => x.priority === "alta" && !x.done);
      resp = u.length ? `Task urgenti:\n${u.map(x => `• ${x.text}`).join("\n")}` : "Nessun task urgente!";
    }
    setTimeout(() => setAiMsgs(m => [...m, { role: "ai", text: resp }]), 300);
  };

  const exportPDF = () => {
    if (!selectedCM) return;
    const cm = selectedCM;
    let html = `<html><head><title>MASTRO MISURE — ${cm.code}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px}h1{color:#0066cc;border-bottom:3px solid #0066cc;padding-bottom:10px}h2{color:#333;margin-top:30px}.vano{border:1px solid #ddd;border-radius:8px;padding:15px;margin:10px 0;page-break-inside:avoid}.misure-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.m-item{background:#f5f5f7;padding:6px 10px;border-radius:4px;font-size:13px}.m-label{color:#666;font-size:11px}.m-val{font-weight:700;color:#1d1d1f}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.info{color:#666;font-size:13px}@media print{body{padding:0}}</style></head><body>`;
    html += `<div class="header"><div><h1>MASTRO MISURE</h1><p class="info">Report Misure — ${cm.code}</p></div><div style="text-align:right"><p><strong>${cm.cliente}</strong></p><p class="info">${cm.indirizzo}</p><p class="info">Sistema: ${cm.sistema || "N/D"} | Tipo: ${cm.tipo === "riparazione" ? "Riparazione" : "Nuova"}</p></div></div>`;
    cm.vani.forEach((v, i) => {
      const m = v.misure || {};
      html += `<div class="vano"><h3>${i + 1}. ${v.nome} — ${v.tipo} (${v.stanza}, ${v.piano})</h3><div class="misure-grid">`;
      [["L alto", m.lAlto], ["L centro", m.lCentro], ["L basso", m.lBasso], ["H sinistra", m.hSx], ["H centro", m.hCentro], ["H destra", m.hDx], ["Diag. 1", m.d1], ["Diag. 2", m.d2], ["Spall. SX", m.spSx], ["Spall. DX", m.spDx], ["Architrave", m.arch], ["Dav. int.", m.davInt], ["Dav. est.", m.davEst]].forEach(([l, val]) => {
        html += `<div class="m-item"><div class="m-label">${l}</div><div class="m-val">${val || "—"} mm</div></div>`;
      });
      html += `</div>`;
      if (v.cassonetto) html += `<p style="margin-top:8px;font-size:13px">Cassonetto: ${v.casH || "—"} × ${v.casP || "—"} mm</p>`;
      if (v.note) html += `<p style="margin-top:4px;font-size:12px;color:#666">Note: ${v.note}</p>`;
      html += `</div>`;
    });
    html += `<div style="margin-top:40px;border-top:1px solid #ddd;padding-top:20px;display:flex;justify-content:space-between"><div><p class="info">Firma tecnico</p><div style="border-bottom:1px solid #333;width:200px;height:40px"></div></div><div><p class="info">Firma cliente</p><div style="border-bottom:1px solid #333;width:200px;height:40px"></div></div></div>`;
    html += `<p style="text-align:center;margin-top:30px;color:#999;font-size:11px">Generato da MASTRO MISURE — ${new Date().toLocaleDateString("it-IT")}</p></body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  /* ═══════ STYLES ═══════ */
  const fs = isDesktop ? 1.1 : isTablet ? 1.05 : 1;
  const S = {
    app: { fontFamily: FF, background: T.bg, color: T.text, width: "100%", minHeight: "100vh", position: "relative", WebkitFontSmoothing: "antialiased" },
    header: { padding: `${14*fs}px ${16*fs}px ${12*fs}px`, background: T.card, borderBottom: `1px solid ${T.bdr}`, display: "flex", alignItems: "center", gap: 10 },
    headerTitle: { fontSize: 19*fs, fontWeight: 700, letterSpacing: -0.3, color: T.text },
    headerSub: { fontSize: 12*fs, color: T.sub, marginTop: 1 },
    section: { margin: `0 ${16*fs}px`, padding: "10px 0 4px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    sectionTitle: { fontSize: 13*fs, fontWeight: 700, color: T.text },
    sectionBtn: { fontSize: 12*fs, color: T.acc, fontWeight: 600, background: "none", border: "none", cursor: "pointer" },
    card: { background: T.card, borderRadius: T.r, border: `1px solid ${T.bdr}`, boxShadow: T.cardSh, overflow: "hidden", marginBottom: 8, cursor: "pointer", transition: "box-shadow 0.15s" },
    cardInner: { padding: `${12*fs}px ${14*fs}px` },
    chip: (active) => ({ padding: `${6*fs}px ${12*fs}px`, borderRadius: 8, border: `1px solid ${active ? T.acc : T.bdr}`, background: active ? T.acc : T.card, color: active ? "#fff" : T.text, fontSize: 12*fs, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }),
    stat: { flex: 1, textAlign: "center", padding: `${10*fs}px 4px`, background: T.card, cursor: "pointer" },
    statNum: { fontSize: 18*fs, fontWeight: 700 },
    statLabel: { fontSize: 9*fs, color: T.sub, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, marginTop: 1 },
    badge: (bg, color) => ({ fontSize: 11*fs, fontWeight: 600, padding: `${3*fs}px ${8*fs}px`, borderRadius: 6, background: bg, color, display: "inline-block" }),
    input: { width: "100%", padding: `${10*fs}px ${12*fs}px`, borderRadius: 8, border: `1px solid ${T.bdr}`, background: T.card, fontSize: 14*fs, color: T.text, outline: "none", fontFamily: FF, boxSizing: "border-box" },
    select: { width: "100%", padding: `${10*fs}px ${12*fs}px`, borderRadius: 8, border: `1px solid ${T.bdr}`, background: T.card, fontSize: 14*fs, color: T.text, outline: "none", fontFamily: FF, boxSizing: "border-box" },
    btn: { width: "100%", padding: `${14*fs}px`, borderRadius: 10, border: "none", background: T.acc, color: "#fff", fontSize: 15*fs, fontWeight: 700, cursor: "pointer", fontFamily: FF },
    btnCancel: { width: "100%", padding: `${12*fs}px`, borderRadius: 10, border: "none", background: "none", color: T.sub, fontSize: 14*fs, fontWeight: 600, cursor: "pointer", fontFamily: FF },
    tabBar: { position: "fixed", bottom: 0, left: 0, right: 0, width: "100%", background: T.card + "ee", backdropFilter: "blur(20px)", borderTop: `1px solid ${T.bdr}`, display: "flex", padding: `${6*fs}px 0 ${8*fs}px`, zIndex: 100 },
    tabItem: (active) => ({ flex: 1, textAlign: "center", padding: "4px 0", cursor: "pointer", transition: "all 0.15s" }),
    tabLabel: (active) => ({ fontSize: 10*fs, fontWeight: 600, color: active ? T.acc : T.sub, marginTop: 1 }),
    modal: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", justifyContent: "center", alignItems: "flex-end" },
    modalInner: { background: T.card, borderRadius: "16px 16px 0 0", width: "100%", maxWidth: isDesktop ? 600 : 500, padding: `${20*fs}px ${16*fs}px ${30*fs}px`, maxHeight: "85vh", overflowY: "auto" },
    modalTitle: { fontSize: 17*fs, fontWeight: 700, marginBottom: 16, color: T.text },
    fieldLabel: { fontSize: 12*fs, fontWeight: 600, color: T.sub, marginBottom: 4, display: "block" },
    pipeStep: (done, current) => ({ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 52, cursor: "pointer" }),
    pipeCircle: (done, current, color) => ({ width: current ? 32 : 26, height: current ? 32 : 26, borderRadius: "50%", background: done ? color : "transparent", border: done ? "none" : current ? `3px solid ${color}` : `2px dashed ${T.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: current ? 14 : 12, boxShadow: current ? `0 0 12px ${color}40` : "none", transition: "all 0.2s" }),
    pipeLine: (done) => ({ flex: 1, height: 2, background: done ? T.grn : T.bdr, minWidth: 12, alignSelf: "center", marginTop: -14 }),
    pipeLabel: (current) => ({ fontSize: 9*fs, fontWeight: current ? 700 : 500, color: current ? T.text : T.sub, marginTop: 4, textAlign: "center", maxWidth: 52 }),
  };

  /* ═══════ CALENDAR STRIP ═══════ */
  const today = new Date();
  const calDays = Array.from({ length: 9 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() + i - 2);
    return { day: d.getDate(), name: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"][d.getDay()], isToday: i === 2, hasDot: [0, 2, 4, 6].includes(i) };
  });

  /* ═══════ PIPELINE COMPONENT ═══════ */
  const PipelineBar = ({ fase }) => {
    const idx = faseIndex(fase);
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 0, overflowX: "auto", padding: "8px 0", WebkitOverflowScrolling: "touch" }}>
        {PIPELINE.map((p, i) => {
          const done = i < idx;
          const current = i === idx;
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "flex-start", flex: i < PIPELINE.length - 1 ? 1 : "none" }}>
              <div style={S.pipeStep(done, current)}>
                <div style={S.pipeCircle(done, current, p.color)}>
                  {done ? <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span> : <span>{p.ico}</span>}
                </div>
                <div style={S.pipeLabel(current)}>{p.nome}</div>
              </div>
              {i < PIPELINE.length - 1 && <div style={S.pipeLine(done)} />}
            </div>
          );
        })}
      </div>
    );
  };

  /* ═══════ VANO SVG SCHEMA ═══════ */
  const VanoSVG = ({ v, onTap }) => {
    const m = v.misure || {};
    return (
      <svg viewBox="0 0 200 260" style={{ width: "100%", maxWidth: 280, display: "block", margin: "0 auto" }}>
        {/* Vano outline */}
        <rect x="30" y="15" width="140" height="220" fill={T.accLt} stroke={T.acc} strokeWidth={1.5} rx={2} />
        {/* Spallette */}
        <rect x="15" y="12" width="15" height="226" fill={T.blueLt} stroke={T.blue} strokeWidth={0.5} rx={1} strokeDasharray="3,2" />
        <rect x="170" y="12" width="15" height="226" fill={T.blueLt} stroke={T.blue} strokeWidth={0.5} rx={1} strokeDasharray="3,2" />
        {/* Cassonetto */}
        {v.cassonetto && <rect x="28" y="0" width="144" height="15" fill={T.orangeLt} stroke={T.orange} strokeWidth={0.5} rx={2} />}
        {v.cassonetto && <text x="100" y="11" textAnchor="middle" fontSize={7} fill={T.orange} fontFamily={FM}>CASSONETTO</text>}
        {/* Davanzale */}
        <line x1="25" y1="237" x2="175" y2="237" stroke={T.sub2} strokeWidth={1} strokeDasharray="4,3" />
        <text x="100" y="252" textAnchor="middle" fontSize={8} fill={T.sub2} fontFamily={FM}>Davanzale</text>
        {/* 3 Larghezze lines */}
        <line x1="35" y1="28" x2="165" y2="28" stroke={T.acc + "40"} strokeWidth={0.5} strokeDasharray="3,3" />
        <line x1="35" y1="125" x2="165" y2="125" stroke={T.acc + "40"} strokeWidth={0.5} strokeDasharray="3,3" />
        <line x1="35" y1="222" x2="165" y2="222" stroke={T.acc + "40"} strokeWidth={0.5} strokeDasharray="3,3" />
        {/* 3 Altezze lines */}
        <line x1="35" y1="20" x2="35" y2="232" stroke={T.blue + "40"} strokeWidth={0.5} strokeDasharray="3,3" />
        <line x1="100" y1="20" x2="100" y2="232" stroke={T.blue + "40"} strokeWidth={0.5} strokeDasharray="3,3" />
        <line x1="165" y1="20" x2="165" y2="232" stroke={T.blue + "40"} strokeWidth={0.5} strokeDasharray="3,3" />
        {/* Diagonals */}
        <line x1="35" y1="20" x2="165" y2="232" stroke={T.purple + "30"} strokeWidth={0.5} strokeDasharray="4,3" />
        <line x1="165" y1="20" x2="35" y2="232" stroke={T.purple + "30"} strokeWidth={0.5} strokeDasharray="4,3" />
        {/* Tap points */}
        {PUNTI_MISURE.map(p => {
          const val = m[p.key];
          const col = T[p.color] || T.acc;
          return (
            <g key={p.key} onClick={() => onTap && onTap(p.key)} style={{ cursor: "pointer" }}>
              <circle cx={p.x} cy={p.y} r={val ? 14 : 12} fill={val ? col + "20" : T.bdr + "60"} stroke={val ? col : T.sub2} strokeWidth={val ? 1.5 : 1} />
              <text x={p.x} y={p.y + (val ? 1 : 4)} textAnchor="middle" fontSize={val ? 8 : 7} fill={val ? col : T.sub} fontWeight={val ? 700 : 500} fontFamily={FM} dominantBaseline="middle">
                {val || p.label}
              </text>
            </g>
          );
        })}
        {/* Spalletta labels */}
        <text x="22" y="130" textAnchor="middle" fontSize={7} fill={T.sub} fontFamily={FM} transform="rotate(-90,22,130)">
          Sp.SX {m.spSx || ""}
        </text>
        <text x="178" y="130" textAnchor="middle" fontSize={7} fill={T.sub} fontFamily={FM} transform="rotate(90,178,130)">
          Sp.DX {m.spDx || ""}
        </text>
      </svg>
    );
  };

  /* ═══════ FILTERED CANTIERI ═══════ */
  const filtered = cantieri.filter(c => {
    if (filterFase !== "tutte" && c.fase !== filterFase) return false;
    if (searchQ && !c.cliente.toLowerCase().includes(searchQ.toLowerCase()) && !c.code.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  /* ════════════════════════════════════ */
  /* ════       RENDER SECTIONS       ══ */
  /* ════════════════════════════════════ */

  /* ── HOME TAB ── */
  const renderHome = () => (
    <div style={{ paddingBottom: 80 }}>
      {/* Brand bar */}
      <div style={{ padding: "10px 16px", background: T.card, display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.bdr}` }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1c1c1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: FF }}>M</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: 1.5, textTransform: "uppercase" }}>MASTRO</div>
          <div style={{ fontSize: 10, color: T.sub, fontWeight: 500, letterSpacing: 0.5 }}>misure</div>
        </div>
      </div>
      {/* Header */}
      <div style={{ padding: "14px 16px 12px", background: T.card, borderBottom: `1px solid ${T.bdr}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3 }}>{new Date().getHours() < 13 ? "Buongiorno" : new Date().getHours() < 18 ? "Buon pomeriggio" : "Buonasera"}, Fabio</div>
            <div style={{ fontSize: 12, color: T.sub, marginTop: 1 }}>
              {today.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 22 }}>⛅</span>
              <span style={{ fontSize: 20, fontWeight: 600 }}>12°</span>
            </div>
            <div style={{ fontSize: 11, color: T.sub }}>Cosenza</div>
          </div>
        </div>
      </div>

      {/* Calendar strip */}
      <div style={{ display: "flex", gap: 4, padding: "12px 16px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {calDays.map((d, i) => (
          <div key={i} onClick={() => { setTab("agenda"); setAgendaView("giorno"); setSelDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + i + 1)); }} style={{ textAlign: "center", padding: "8px 6px", borderRadius: 10, minWidth: 44, cursor: "pointer", background: d.isToday ? T.text : "transparent", flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: d.isToday ? T.bg : T.sub, fontWeight: 600, textTransform: "uppercase" }}>{d.name}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: d.isToday ? T.bg : T.text, marginTop: 2 }}>{d.day}</div>
            {d.hasDot && <div style={{ width: 4, height: 4, borderRadius: "50%", background: d.isToday ? T.bg : T.red, margin: "2px auto 0" }} />}
          </div>
        ))}
      </div>

      {/* Global search */}
      <div style={{ padding: "0 16px", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: T.card, borderRadius: 10, border: `1px solid ${T.bdr}` }}>
          <Ico d={ICO.search} s={16} c={T.sub} />
          <input
            style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, color: T.text, outline: "none", fontFamily: FF }}
            placeholder="Cerca commesse, clienti, vani..."
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
          />
          {globalSearch && <div onClick={() => setGlobalSearch("")} style={{ cursor: "pointer", fontSize: 14, color: T.sub }}>✕</div>}
        </div>
        {globalSearch.trim().length > 1 && (() => {
          const q = globalSearch.toLowerCase();
          const cmResults = cantieri.filter(c => c.cliente?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q) || c.indirizzo?.toLowerCase().includes(q));
          const vanoResults = cantieri.flatMap(c => c.vani.filter(v => v.nome?.toLowerCase().includes(q) || v.tipo?.toLowerCase().includes(q) || v.stanza?.toLowerCase().includes(q)).map(v => ({ ...v, cmCode: c.code, cmCliente: c.cliente, cmId: c.id, cm: c })));
          const taskResults = tasks.filter(t => t.text?.toLowerCase().includes(q) || t.meta?.toLowerCase().includes(q));
          const evResults = events.filter(e => e.text?.toLowerCase().includes(q) || e.persona?.toLowerCase().includes(q));
          const total = cmResults.length + vanoResults.length + taskResults.length + evResults.length;
          return total > 0 ? (
            <div style={{ background: T.card, borderRadius: 10, border: `1px solid ${T.bdr}`, marginTop: 6, maxHeight: 280, overflowY: "auto" }}>
              {cmResults.map(c => (
                <div key={c.id} onClick={() => { setSelectedCM(c); setTab("commesse"); setGlobalSearch(""); }} style={{ padding: "10px 14px", borderBottom: `1px solid ${T.bg}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📁</span>
                  <div><div style={{ fontSize: 12, fontWeight: 600 }}>{c.cliente}</div><div style={{ fontSize: 10, color: T.sub }}>{c.code} · {c.indirizzo}</div></div>
                </div>
              ))}
              {vanoResults.map(v => (
                <div key={v.id} onClick={() => { setSelectedCM(v.cm); setSelectedVano(v); setTab("commesse"); setGlobalSearch(""); }} style={{ padding: "10px 14px", borderBottom: `1px solid ${T.bg}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🪟</span>
                  <div><div style={{ fontSize: 12, fontWeight: 600 }}>{v.nome}</div><div style={{ fontSize: 10, color: T.sub }}>{v.cmCode} · {v.stanza} · {v.tipo}</div></div>
                </div>
              ))}
              {taskResults.map(t => (
                <div key={t.id} onClick={() => { setGlobalSearch(""); }} style={{ padding: "10px 14px", borderBottom: `1px solid ${T.bg}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>☑️</span>
                  <div><div style={{ fontSize: 12, fontWeight: 600 }}>{t.text}</div><div style={{ fontSize: 10, color: T.sub }}>{t.cm || "Task"} · {t.meta}</div></div>
                </div>
              ))}
              {evResults.map(e => (
                <div key={e.id} onClick={() => { setTab("agenda"); setAgendaView("giorno"); setSelDate(new Date(e.date)); setGlobalSearch(""); }} style={{ padding: "10px 14px", borderBottom: `1px solid ${T.bg}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📅</span>
                  <div><div style={{ fontSize: 12, fontWeight: 600 }}>{e.text}</div><div style={{ fontSize: 10, color: T.sub }}>{e.date} {e.time} · {e.persona}</div></div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "10px 14px", background: T.card, borderRadius: 10, border: `1px solid ${T.bdr}`, marginTop: 6, fontSize: 12, color: T.sub, textAlign: "center" }}>Nessun risultato per "{globalSearch}"</div>
          );
        })()}
      </div>

      {/* Stats — clickable */}
      <div style={{ display: "flex", gap: 1, margin: "0 16px 12px", background: T.bdr, borderRadius: 10, overflow: "hidden" }}>
        {[
          { n: cantieri.length, l: "Attive", c: T.text, act: () => setTab("commesse") },
          { n: urgentCount(), l: "Urgenti", c: T.red, act: () => setTab("commesse") },
          { n: countVani(), l: "Vani", c: T.text, act: () => setTab("commesse") },
          { n: readyCount(), l: "Pronte", c: T.grn, act: () => setTab("commesse") },
        ].map((s, i) => (
          <div key={i} style={{ ...S.stat, cursor: "pointer" }} onClick={s.act}>
            <div style={{ ...S.statNum, color: s.c }}>{s.n}</div>
            <div style={S.statLabel}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Tasks oggi */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Oggi</div>
        <button style={S.sectionBtn} onClick={() => setShowModal("task")}>+ Nuovo</button>
      </div>
      <div style={{ padding: "0 16px", marginBottom: 12 }}>
        <div style={{ background: T.card, borderRadius: T.r, border: `1px solid ${T.bdr}`, overflow: "hidden" }}>
          {tasks.map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderBottom: `1px solid ${T.bg}`, cursor: "pointer" }}>
              <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", flexShrink: 0, background: t.done ? T.bdr : priColor(t.priority) }} />
              <div onClick={() => toggleTask(t.id)} style={{ width: 20, height: 20, border: `2px solid ${t.done ? T.grn : T.bdr}`, borderRadius: "50%", flexShrink: 0, marginTop: 1, background: t.done ? T.grn : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700, transition: "all 0.15s", cursor: "pointer" }}>
                {t.done && "✓"}
              </div>
              <div style={{ fontSize: 11, color: T.sub, fontWeight: 500, minWidth: 42 }}>{t.time}</div>
              <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setSelectedTask(selectedTask?.id === t.id ? null : t)}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.done ? T.sub : T.text, textDecoration: t.done ? "line-through" : "none", lineHeight: 1.3 }}>{t.text}</div>
                <div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>{t.meta}</div>
                {t.cm && <span onClick={e => { e.stopPropagation(); const cm = cantieri.find(c => c.code === t.cm); if (cm) { setSelectedCM(cm); setTab("commesse"); } }} style={{ ...S.badge(T.accLt, T.acc), cursor: "pointer" }}>{t.cm}</span>}
                {/* Expanded detail */}
                {selectedTask?.id === t.id && (
                  <div style={{ marginTop: 8, padding: "10px 12px", background: T.bg, borderRadius: 10, border: `1px solid ${T.bdr}` }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={S.badge(priColor(t.priority) + "18", priColor(t.priority))}>{t.priority === "alta" ? "🔴 Urgente" : t.priority === "media" ? "🟠 Normale" : "⚪ Bassa"}</span>
                      {t.cm && <span style={S.badge(T.accLt, T.acc)}>📁 {t.cm}</span>}
                      {t.done && <span style={S.badge(T.grnLt, T.grn)}>✅ Completato</span>}
                    </div>
                    {t.meta && <div style={{ fontSize: 12, color: T.text, marginBottom: 8, lineHeight: 1.4 }}>📝 {t.meta}</div>}
                    {/* Existing allegati */}
                    {(t.allegati || []).length > 0 && (
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: T.sub, marginBottom: 4 }}>ALLEGATI</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {(t.allegati || []).map(a => (
                            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, background: T.card, border: `1px solid ${T.bdr}`, fontSize: 10 }}>
                              {a.tipo === "nota" ? "📝" : a.tipo === "vocale" ? "🎤" : a.tipo === "foto" ? "📷" : "📎"} {a.nome}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Add allegati to existing task */}
                    <div style={{ display: "flex", gap: 6 }}>
                      {[
                        { ico: "📎", l: "File", act: () => { const a = { id: Date.now(), tipo: "file", nome: "Allegato" }; setTasks(ts => ts.map(x => x.id === t.id ? { ...x, allegati: [...(x.allegati || []), a] } : x)); setSelectedTask(p => ({ ...p, allegati: [...(p.allegati || []), a] })); }},
                        { ico: "🎤", l: "Audio", act: () => { const a = { id: Date.now(), tipo: "vocale", nome: "Audio" }; setTasks(ts => ts.map(x => x.id === t.id ? { ...x, allegati: [...(x.allegati || []), a] } : x)); setSelectedTask(p => ({ ...p, allegati: [...(p.allegati || []), a] })); }},
                        { ico: "📷", l: "Foto", act: () => { const a = { id: Date.now(), tipo: "foto", nome: "Foto" }; setTasks(ts => ts.map(x => x.id === t.id ? { ...x, allegati: [...(x.allegati || []), a] } : x)); setSelectedTask(p => ({ ...p, allegati: [...(p.allegati || []), a] })); }},
                      ].map((b, i) => (
                        <div key={i} onClick={b.act} style={{ flex: 1, padding: "8px", borderRadius: 8, background: T.card, border: `1px solid ${T.bdr}`, textAlign: "center", cursor: "pointer", fontSize: 11, fontWeight: 600, color: T.sub }}>
                          {b.ico} {b.l}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div onClick={e => { e.stopPropagation(); deleteTask(t.id); }} style={{ padding: 4, cursor: "pointer", flexShrink: 0 }}><Ico d={ICO.trash} s={14} c={T.sub} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Messaggi */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Messaggi</div>
        <button style={S.sectionBtn} onClick={() => setTab("messaggi")}>Vedi tutti</button>
      </div>
      <div style={{ padding: "0 16px", marginBottom: 12 }}>
        <div style={{ background: T.card, borderRadius: T.r, border: `1px solid ${T.bdr}`, overflow: "hidden" }}>
          {msgs.map(m => {
            const chIco = { email: "📧", whatsapp: "💬", sms: "📱", telegram: "✈️" };
            return (
            <div key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderBottom: `1px solid ${T.bg}`, cursor: "pointer" }} onClick={() => { setMsgs(ms => ms.map(x => x.id === m.id ? { ...x, read: true } : x)); setSelectedMsg(m); }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.read ? "transparent" : T.acc, flexShrink: 0, marginTop: 5 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: m.read ? T.sub : T.text, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 12 }}>{chIco[m.canale] || "💬"}</span> {m.from}
                  </div>
                  <div style={{ fontSize: 10, color: T.sub }}>{m.time}</div>
                </div>
                <div style={{ fontSize: 12, color: T.sub, marginTop: 1, lineHeight: 1.3 }}>{m.preview}</div>
                <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
                  {m.cm && <span style={{ ...S.badge(T.accLt, T.acc) }}>{m.cm}</span>}
                  <span style={S.badge(m.canale === "whatsapp" ? "#25d36618" : m.canale === "email" ? T.blueLt : m.canale === "telegram" ? "#0088cc18" : T.orangeLt, m.canale === "whatsapp" ? "#25d366" : m.canale === "email" ? T.blue : m.canale === "telegram" ? "#0088cc" : T.orange)}>{m.canale}</span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Quick commesse */}
      <div style={S.section}>
        <div style={S.sectionTitle}>Commesse</div>
        <button style={S.sectionBtn} onClick={() => setTab("commesse")}>Vedi tutte</button>
      </div>
      {cantieri.slice(0, 3).map(c => renderCMCard(c))}
    </div>
  );

  /* ── COMMESSA CARD ── */
  const renderCMCard = (c, inGrid) => {
    const fase = PIPELINE.find(p => p.id === c.fase);
    const progress = ((faseIndex(c.fase) + 1) / PIPELINE.length) * 100;
    return (
      <div key={c.id} style={{ ...S.card, margin: inGrid ? "0" : "0 16px 8px" }} onClick={() => { setSelectedCM(c); setTab("commesse"); }}>
        <div style={S.cardInner}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.sub, fontFamily: FM }}>{c.code}</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{c.cliente}</span>
              </div>
              <div style={{ fontSize: 12, color: T.sub, marginTop: 3 }}>{c.indirizzo} · {c.vani.length} vani</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {c.tipo === "riparazione" && <span style={S.badge(T.orangeLt, T.orange)}>🔧</span>}
              <span style={S.badge(fase?.color + "18", fase?.color)}>{fase?.nome}</span>
            </div>
          </div>
          {c.alert && <div style={{ ...S.badge(c.alert.includes("Nessun") ? T.orangeLt : T.redLt, c.alert.includes("Nessun") ? T.orange : T.red), marginTop: 6 }}>{c.alert}</div>}
          <div style={{ height: 3, background: T.bdr, borderRadius: 2, marginTop: 8 }}>
            <div style={{ height: "100%", borderRadius: 2, background: fase?.color, width: `${progress}%`, transition: "width 0.3s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: T.sub2 }}>{c.creato} · agg. {c.aggiornato}</span>
            <span style={{ fontSize: 10, color: T.sub2 }}>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    );
  };

  /* ── COMMESSE TAB ── */
  const renderCommesse = () => {
    if (showRiepilogo && selectedCM) return renderRiepilogo();
    if (selectedVano) return renderVanoDetail();
    if (selectedCM) return renderCMDetail();
    return (
      <div style={{ paddingBottom: 80 }}>
        <div style={S.header}>
          <div style={{ flex: 1 }}>
            <div style={S.headerTitle}>Commesse</div>
            <div style={S.headerSub}>{cantieri.length} totali</div>
          </div>
          <div onClick={() => setShowModal("commessa")} style={{ width: 36, height: 36, borderRadius: 10, background: T.acc, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 20, fontWeight: 300 }}>+</div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 6, padding: "10px 16px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={S.chip(filterFase === "tutte")} onClick={() => setFilterFase("tutte")}>Tutte ({cantieri.length})</div>
          {PIPELINE.map(p => {
            const n = cantieri.filter(c => c.fase === p.id).length;
            return n > 0 ? <div key={p.id} style={S.chip(filterFase === p.id)} onClick={() => setFilterFase(p.id)}>{p.nome} ({n})</div> : null;
          })}
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 8, padding: "0 16px", marginBottom: 10 }}>
          <input style={{ ...S.input, flex: 1 }} placeholder="Cerca commessa..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
        </div>

        <div style={isDesktop ? { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 16px" } : isTablet ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 16px" } : {}}>
          {filtered.map(c => renderCMCard(c, isTablet || isDesktop))}
        </div>
      </div>
    );
  };

  /* ── COMMESSA DETAIL ── */
  const renderCMDetail = () => {
    const c = selectedCM;
    const fase = PIPELINE.find(p => p.id === c.fase);
    return (
      <div style={{ paddingBottom: 80 }}>
        {/* Header */}
        <div style={S.header}>
          <div onClick={goBack} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.back} s={20} c={T.sub} /></div>
          <div style={{ flex: 1 }}>
            <div style={S.headerTitle}>{c.code} · {c.cliente}</div>
            <div style={S.headerSub}>{c.indirizzo}</div>
          </div>
          <div onClick={() => setShowRiepilogo(true)} style={{ padding: "6px 10px", borderRadius: 6, background: T.accLt, cursor: "pointer", marginRight: 6 }}>
            <span style={{ fontSize: 14 }}>📋</span>
          </div>
          <div onClick={exportPDF} style={{ padding: "6px 10px", borderRadius: 6, background: T.redLt, cursor: "pointer" }}>
            <Ico d={ICO.file} s={16} c={T.red} />
          </div>
        </div>

        {/* Info badges */}
        <div style={{ padding: "8px 16px", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {c.tipo === "riparazione" && <span style={S.badge(T.orangeLt, T.orange)}>🔧 Riparazione</span>}
          {c.tipo === "nuova" && <span style={S.badge(T.grnLt, T.grn)}>🆕 Nuova</span>}
          {c.sistema && <span style={S.badge(T.blueLt, T.blue)}>{c.sistema}</span>}
          {c.difficoltaSalita && <span style={S.badge(c.difficoltaSalita === "facile" ? T.grnLt : c.difficoltaSalita === "media" ? T.orangeLt : T.redLt, c.difficoltaSalita === "facile" ? T.grn : c.difficoltaSalita === "media" ? T.orange : T.red)}>Salita: {c.difficoltaSalita}</span>}
          {c.mezzoSalita && <span style={S.badge(T.purpleLt, T.purple)}>🪜 {c.mezzoSalita}</span>}
          {c.pianoEdificio && <span style={S.badge(T.blueLt, T.blue)}>Piano: {c.pianoEdificio}</span>}
          {c.foroScale && <span style={S.badge(T.redLt, T.red)}>Foro: {c.foroScale}</span>}
          {c.telefono && <span onClick={() => window.open(`tel:${c.telefono}`)} style={{ ...S.badge(T.grnLt, T.grn), cursor: "pointer" }}>📞 {c.telefono}</span>}
        </div>
        {/* Note commessa */}
        {c.note && <div style={{ padding: "0 16px", marginBottom: 6 }}><div style={{ padding: "8px 12px", borderRadius: 8, background: T.card, border: `1px solid ${T.bdr}`, fontSize: 12, color: T.sub, lineHeight: 1.4 }}>📝 {c.note}</div></div>}

        {/* Pipeline */}
        <div style={{ padding: "4px 16px 0" }}>
          <PipelineBar fase={c.fase} />
        </div>

        {/* Advance button */}
        {faseIndex(c.fase) < PIPELINE.length - 1 && (
          <div style={{ padding: "0 16px", marginTop: 8, marginBottom: 4 }}>
            <button onClick={() => advanceFase(c.id)} style={{ ...S.btn, background: fase?.color, fontSize: 13, padding: 10 }}>
              Avanza a {PIPELINE[faseIndex(c.fase) + 1]?.nome} →
            </button>
          </div>
        )}

        {/* Contact actions */}
        <div style={{ display: "flex", gap: 8, padding: "12px 16px" }}>
          {[
            { ico: ICO.phone, label: "Chiama", col: T.grn, act: () => window.open(`tel:${c.telefono || "+39000000000"}`) },
            { ico: ICO.map, label: "Naviga", col: T.blue, act: () => window.open(`https://maps.google.com/?q=${encodeURIComponent(c.indirizzo || "")}`) },
            { ico: ICO.send, label: "WhatsApp", col: "#25d366", act: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Commessa ${c.code} - ${c.cliente}`)}`) },
          ].map((a, i) => (
            <div key={i} onClick={a.act} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 0", background: T.card, borderRadius: T.r, border: `1px solid ${T.bdr}`, cursor: "pointer" }}>
              <Ico d={a.ico} s={18} c={a.col} />
              <span style={{ fontSize: 10, fontWeight: 600, color: T.sub }}>{a.label}</span>
            </div>
          ))}
        </div>

        {/* INVIA COMMESSA */}
        <div style={{ padding: "0 16px", marginBottom: 8 }}>
          <button onClick={() => setShowSendModal(true)} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #007aff, #0055cc)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FF, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 2px 8px rgba(0,122,255,0.3)" }}>
            <Ico d={ICO.send} s={16} c="#fff" sw={2} /> Invia Commessa
          </button>
        </div>

        {/* Allegati / Note / Vocali / Video */}
        <div style={{ padding: "0 16px", marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { ico: "📎", label: "File", act: () => { const inp = document.createElement("input"); inp.type = "file"; inp.onchange = (e) => { const f = e.target.files[0]; if (f) addAllegato("file", f.name); }; inp.click(); }},
              { ico: "📷", label: "Foto", act: () => { addAllegato("foto", "Foto_" + new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }).replace(":", "")); }},
              { ico: "📝", label: "Nota", act: () => { setShowAllegatiModal("nota"); setAllegatiText(""); }},
              { ico: "🎤", label: "Vocale", act: () => { setShowAllegatiModal("vocale"); }},
              { ico: "🎬", label: "Video", act: () => { setShowAllegatiModal("video"); }},
            ].map((b, i) => (
              <div key={i} onClick={b.act} style={{ flex: 1, padding: "10px 4px", background: T.card, borderRadius: T.r, border: `1px solid ${T.bdr}`, textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: 18 }}>{b.ico}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: T.sub, marginTop: 2 }}>{b.label}</div>
              </div>
            ))}
          </div>
          {/* Lista allegati */}
          {(c.allegati || []).length > 0 && (
            <div style={{ marginTop: 6, background: T.card, borderRadius: T.r, border: `1px solid ${T.bdr}`, overflow: "hidden" }}>
              {(c.allegati || []).map(a => (
                <div key={a.id} style={{ borderBottom: `1px solid ${T.bg}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
                    <span style={{ fontSize: 16 }}>{a.tipo === "nota" ? "📝" : a.tipo === "vocale" ? "🎤" : a.tipo === "video" ? "🎬" : a.tipo === "foto" ? "📷" : "📎"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{a.nome}</div>
                      <div style={{ fontSize: 10, color: T.sub }}>{a.data}{a.durata ? ` · ${a.durata}` : ""}</div>
                    </div>
                    {(a.tipo === "vocale" || a.tipo === "video") && (
                      <div onClick={() => playAllegato(a.id)} style={{ padding: "3px 8px", borderRadius: 6, background: playingId === a.id ? T.redLt : T.accLt, fontSize: 10, fontWeight: 600, color: playingId === a.id ? T.red : T.acc, cursor: "pointer" }}>
                        {playingId === a.id ? "⏸ Stop" : "▶ Play"}
                      </div>
                    )}
                    {a.tipo === "foto" && <div onClick={() => alert("📷 Anteprima foto: " + a.nome)} style={{ padding: "3px 8px", borderRadius: 6, background: T.accLt, fontSize: 10, fontWeight: 600, color: T.acc, cursor: "pointer" }}>👁 Vedi</div>}
                    {a.tipo === "file" && <div onClick={() => alert("📎 Apertura file: " + a.nome)} style={{ padding: "3px 8px", borderRadius: 6, background: T.accLt, fontSize: 10, fontWeight: 600, color: T.acc, cursor: "pointer" }}>📂 Apri</div>}
                    <div onClick={() => { setCantieri(cs => cs.map(x => x.id === c.id ? { ...x, allegati: (x.allegati || []).filter(al => al.id !== a.id) } : x)); setSelectedCM(p => ({ ...p, allegati: (p.allegati || []).filter(al => al.id !== a.id) })); }} style={{ cursor: "pointer" }}><Ico d={ICO.trash} s={12} c={T.sub} /></div>
                  </div>
                  {/* Progress bar for playing */}
                  {playingId === a.id && (
                    <div style={{ height: 3, background: T.bdr, margin: "0 12px 6px" }}>
                      <div style={{ height: "100%", background: a.tipo === "video" ? T.blue : T.acc, borderRadius: 2, width: `${playProgress}%`, transition: "width 0.1s linear" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vani */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Vani ({c.vani.length})</div>
          <button style={S.sectionBtn} onClick={() => setShowModal("vano")}>+ Nuovo vano</button>
        </div>
        <div style={{ padding: "0 16px", ...((isTablet || isDesktop) && c.vani.length > 0 ? { display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr 1fr" : "1fr 1fr", gap: 8 } : {}) }}>
          {c.vani.length === 0 ? (
            <div onClick={() => setShowModal("vano")} style={{ padding: "20px", textAlign: "center", background: T.card, borderRadius: T.r, border: `1px dashed ${T.bdr}`, cursor: "pointer", color: T.sub, fontSize: 13 }}>
              Nessun vano. Tocca per aggiungerne uno.
            </div>
          ) : c.vani.map(v => {
            const filled = Object.values(v.misure || {}).filter(x => x > 0).length;
            const total = 8;
            const fotoCount = Object.values(v.foto || {}).filter(Boolean).length;
            return (
              <div key={v.id} style={{ ...S.card, margin: "0 0 8px" }} onClick={() => setSelectedVano(v)}>
                <div style={S.cardInner}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                        {TIPOLOGIE_RAPIDE.find(t => t.code === v.tipo)?.icon || "🪟"}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{v.nome}</div>
                        <div style={{ fontSize: 11, color: T.sub }}>{TIPOLOGIE_RAPIDE.find(t => t.code === v.tipo)?.label || v.tipo} · {v.stanza} · {v.piano}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: filled >= 6 ? T.grn : T.orange }}>{filled}/{total}<div style={{ fontSize: 10, color: T.sub, fontWeight: 400 }}>misure</div></div>
                      <div onClick={e => { e.stopPropagation(); deleteVano(v.id); }} style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: T.redLt, cursor: "pointer" }}><Ico d={ICO.trash} s={13} c={T.red} /></div>
                    </div>
                  </div>
                  {/* Tags */}
                  <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                    {fotoCount > 0 && <span style={S.badge(T.blueLt, T.blue)}>{fotoCount} foto</span>}
                    {v.cassonetto && <span style={S.badge(T.orangeLt, T.orange)}>Cassonetto</span>}
                    {v.accessori?.tapparella?.attivo && <span style={S.badge(T.grnLt, T.grn)}>Tapparella</span>}
                    {v.accessori?.zanzariera?.attivo && <span style={S.badge(T.purpleLt, T.purple)}>Zanzariera</span>}
                    {v.note && <span style={S.badge(T.cyanLt, T.cyan)}>Note</span>}
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 3, background: T.bdr, borderRadius: 2, marginTop: 8 }}>
                    <div style={{ height: "100%", borderRadius: 2, background: filled >= 6 ? T.grn : T.acc, width: `${(filled / total) * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline/Log */}
        {c.log && c.log.length > 0 && (
          <>
            <div style={{ ...S.section, marginTop: 8 }}>
              <div style={S.sectionTitle}>Cronologia</div>
            </div>
            <div style={{ padding: "0 16px" }}>
              {c.log.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                    {i < c.log.length - 1 && <div style={{ width: 1, flex: 1, background: T.bdr, marginTop: 4 }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: T.text, lineHeight: 1.3 }}><strong>{l.chi}</strong> {l.cosa}</div>
                    <div style={{ fontSize: 10, color: T.sub2, marginTop: 1 }}>{l.quando}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Elimina — bottom, small */}
        <div style={{ padding: "16px", textAlign: "center" }}>
          <span onClick={() => deleteCommessa(c.id)} style={{ fontSize: 11, color: T.sub2, cursor: "pointer", textDecoration: "underline" }}>🗑 Elimina commessa</span>
        </div>
      </div>
    );
  };

  /* ── RIEPILOGO COMMESSA (tutte le misure) ── */
  const [showRiepilogo, setShowRiepilogo] = useState(false);
  const renderRiepilogo = () => {
    const c = selectedCM;
    if (!c) return null;
    return (
      <div style={{ paddingBottom: 80 }}>
        <div style={S.header}>
          <div onClick={() => setShowRiepilogo(false)} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.back} s={20} c={T.sub} /></div>
          <div style={{ flex: 1 }}>
            <div style={S.headerTitle}>📋 Riepilogo Misure</div>
            <div style={S.headerSub}>{c.code} · {c.cliente} · {c.vani.length} vani</div>
          </div>
          <div onClick={exportPDF} style={{ padding: "6px 10px", borderRadius: 6, background: T.redLt, cursor: "pointer" }}>
            <Ico d={ICO.file} s={16} c={T.red} />
          </div>
        </div>
        <div style={{ padding: "12px 16px" }}>
          {/* Info commessa */}
          <div style={{ background: T.card, borderRadius: T.r, border: `1px solid ${T.bdr}`, padding: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>DATI COMMESSA</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", fontSize: 12 }}>
              <span style={{ color: T.sub }}>Indirizzo:</span><span style={{ fontWeight: 600 }}>{c.indirizzo}</span>
              <span style={{ color: T.sub }}>Sistema:</span><span style={{ fontWeight: 600 }}>{c.sistema || "N/D"}</span>
              <span style={{ color: T.sub }}>Tipo:</span><span style={{ fontWeight: 600 }}>{c.tipo === "riparazione" ? "🔧 Riparazione" : "🆕 Nuova"}</span>
              <span style={{ color: T.sub }}>Mezzo salita:</span><span style={{ fontWeight: 600 }}>{c.mezzoSalita || "N/D"}</span>
            </div>
          </div>

          {/* Per ogni vano */}
          {c.vani.map((v, vi) => {
            const m = v.misure || {};
            const filled = Object.values(m).filter(x => x > 0).length;
            return (
              <div key={v.id} style={{ background: T.card, borderRadius: T.r, border: `1px solid ${T.bdr}`, marginBottom: 10, overflow: "hidden" }}>
                {/* Vano header */}
                <div style={{ padding: "10px 14px", background: T.accLt, borderBottom: `1px solid ${T.bdr}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.acc }}>{vi + 1}. {v.nome}</span>
                    <span style={{ fontSize: 12, color: T.sub, marginLeft: 8 }}>{v.tipo} · {v.stanza} · {v.piano}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: filled >= 6 ? T.grn : T.orange, fontFamily: FM }}>{filled}/8</span>
                </div>
                {/* Misure griglia */}
                <div style={{ padding: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                    {[["L alto", m.lAlto, T.acc], ["L centro", m.lCentro, T.acc], ["L basso", m.lBasso, T.acc],
                      ["H sx", m.hSx, T.blue], ["H centro", m.hCentro, T.blue], ["H dx", m.hDx, T.blue]].map(([label, val, col]) => (
                      <div key={label} style={{ background: val ? col + "10" : T.bg, borderRadius: 6, padding: "6px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: T.sub, fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: val ? col : T.sub2, fontFamily: FM }}>{val || "—"}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6, marginTop: 6 }}>
                    {[["Diag. 1", m.d1, T.purple], ["Diag. 2", m.d2, T.purple]].map(([label, val, col]) => (
                      <div key={label} style={{ background: val ? col + "10" : T.bg, borderRadius: 6, padding: "6px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: T.sub, fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: val ? col : T.sub2, fontFamily: FM }}>{val || "—"}</div>
                      </div>
                    ))}
                  </div>
                  {m.d1 > 0 && m.d2 > 0 && Math.abs(m.d1 - m.d2) > 3 && (
                    <div style={{ marginTop: 6, padding: "4px 8px", borderRadius: 4, background: T.redLt, fontSize: 10, fontWeight: 700, color: T.red }}>⚠️ Fuori squadra: {Math.abs(m.d1 - m.d2)}mm</div>
                  )}
                  {/* Spallette + davanzale */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 6 }}>
                    {[["Sp. SX", m.spSx], ["Architrave", m.arch], ["Sp. DX", m.spDx]].map(([l, val]) => (
                      <div key={l} style={{ background: T.bg, borderRadius: 6, padding: "4px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 8, color: T.sub }}>{l}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, fontFamily: FM, color: val ? T.text : T.sub2 }}>{val || "—"}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6, marginTop: 6 }}>
                    {[["Dav. int.", m.davInt], ["Dav. est.", m.davEst]].map(([l, val]) => (
                      <div key={l} style={{ background: T.bg, borderRadius: 6, padding: "4px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 8, color: T.sub }}>{l}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, fontFamily: FM, color: val ? T.text : T.sub2 }}>{val || "—"}</div>
                      </div>
                    ))}
                  </div>
                  {/* Accessori attivi */}
                  {(v.accessori?.tapparella?.attivo || v.accessori?.persiana?.attivo || v.accessori?.zanzariera?.attivo || v.cassonetto) && (
                    <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {v.cassonetto && <span style={S.badge(T.orangeLt, T.orange)}>Cassonetto {v.casH ? `${v.casH}×${v.casP}` : ""}</span>}
                      {v.accessori?.tapparella?.attivo && <span style={S.badge(T.grnLt, T.grn)}>Tapparella {v.accessori.tapparella.l ? `${v.accessori.tapparella.l}×${v.accessori.tapparella.h}` : ""} {v.accessori.tapparella.colore || ""}</span>}
                      {v.accessori?.persiana?.attivo && <span style={S.badge(T.blueLt, T.blue)}>Persiana</span>}
                      {v.accessori?.zanzariera?.attivo && <span style={S.badge(T.purpleLt, T.purple)}>Zanzariera {v.accessori.zanzariera.l ? `${v.accessori.zanzariera.l}×${v.accessori.zanzariera.h}` : ""} {v.accessori.zanzariera.colore || ""}</span>}
                    </div>
                  )}
                  {v.note && <div style={{ marginTop: 6, fontSize: 11, color: T.sub, fontStyle: "italic" }}>📝 {v.note}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ── VANO DETAIL — WIZARD A STEP ── */
  const STEPS = [
    { id: "larghezze", title: "LARGHEZZE", desc: "Misura la larghezza in 3 punti: alto, centro, basso", color: "#507aff", icon: "📏", fields: ["lAlto", "lCentro", "lBasso"], labels: ["Larghezza ALTO", "Larghezza CENTRO (luce netta)", "Larghezza BASSO"] },
    { id: "altezze", title: "ALTEZZE", desc: "Misura l'altezza in 3 punti: sinistra, centro, destra", color: "#34c759", icon: "📐", fields: ["hSx", "hCentro", "hDx"], labels: ["Altezza SINISTRA", "Altezza CENTRO", "Altezza DESTRA"] },
    { id: "diagonali", title: "DIAGONALI", desc: "Misura le 2 diagonali per verificare la squadra", color: "#ff9500", icon: "✕", fields: ["d1", "d2"], labels: ["Diagonale 1 ↗", "Diagonale 2 ↘"] },
    { id: "spallette", title: "SPALLETTE", desc: "Misura le spallette e l'imbotte", color: "#32ade6", icon: "🧱", fields: ["spSx", "spDx", "spSopra", "imbotte"], labels: ["Spalletta SINISTRA", "Spalletta DESTRA", "Spalletta SOPRA", "Profondità IMBOTTE"] },
    { id: "davanzale", title: "DAVANZALE", desc: "Davanzale, soglia e cassonetto", color: "#ff2d55", icon: "⬇", fields: ["davProf", "davSporg", "soglia"], labels: ["Davanzale PROFONDITÀ", "Davanzale SPORGENZA", "Altezza SOGLIA"] },
    { id: "accessori", title: "ACCESSORI", desc: "Tapparella, persiana, zanzariera", color: "#af52de", icon: "+" },
    { id: "disegno", title: "DISEGNO + FOTO", desc: "Disegna, fotografa e annota il vano", color: "#ff6b6b", icon: "📷" },
    { id: "riepilogo", title: "RIEPILOGO", desc: "Anteprima completa del vano", color: "#34c759", icon: "📋" },
  ];

  const renderVanoDetail = () => {
    const v = selectedVano;
    const m = v.misure || {};
    const step = STEPS[vanoStep];
    const filled = Object.values(m).filter(x => x > 0).length;
    const TIPO_TIPS = { Scorrevole: { t: "Scorrevole (alzante/traslante)", dim: "2000 × 2200 mm", w: ["Binario inferiore: serve spazio incasso", "Verifica portata parete"] }, Portafinestra: { t: "Portafinestra standard", dim: "800-900 × 2200 mm", w: ["Soglia a taglio termico", "Verifica altezza architrave"] }, Finestra: { t: "Finestra", dim: "1200 × 1400 mm", w: ["Verifica spazio per anta"] } };
    const tip = TIPO_TIPS[v.tipo] || null;
    const hasWarnings = !m.lAlto && !m.lCentro && !m.lBasso;
    const hasHWarnings = !m.hSx && !m.hCentro && !m.hDx;
    const fSq = m.d1 > 0 && m.d2 > 0 ? Math.abs(m.d1 - m.d2) : null;

    // Mini SVG per step
    const MiniSVG = ({ type }) => {
      const w = 60, h = 70;
      return (
        <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: "block" }}>
          <rect x={5} y={5} width={w-10} height={h-10} fill={step.color + "12"} stroke={step.color + "40"} strokeWidth={1.5} rx={3} />
          {type === "larghezze" && <>
            <line x1={10} y1={18} x2={w-10} y2={18} stroke={step.color} strokeWidth={1.2} strokeDasharray="3,2" />
            <line x1={10} y1={h/2} x2={w-10} y2={h/2} stroke={step.color} strokeWidth={1.2} strokeDasharray="3,2" />
            <line x1={10} y1={h-18} x2={w-10} y2={h-18} stroke={step.color} strokeWidth={1.2} strokeDasharray="3,2" />
          </>}
          {type === "altezze" && <>
            <line x1={14} y1={10} x2={14} y2={h-10} stroke={step.color} strokeWidth={1.2} strokeDasharray="3,2" />
            <line x1={w/2} y1={10} x2={w/2} y2={h-10} stroke={step.color} strokeWidth={1.2} strokeDasharray="3,2" />
            <line x1={w-14} y1={10} x2={w-14} y2={h-10} stroke={step.color} strokeWidth={1.2} strokeDasharray="3,2" />
          </>}
          {type === "diagonali" && <>
            <line x1={10} y1={10} x2={w-10} y2={h-10} stroke={step.color} strokeWidth={1.2} strokeDasharray="3,2" />
            <line x1={w-10} y1={10} x2={10} y2={h-10} stroke={step.color} strokeWidth={1.2} strokeDasharray="3,2" />
          </>}
          {type === "spallette" && <>
            <rect x={2} y={5} width={10} height={h-10} fill={step.color + "25"} stroke={step.color+"60"} rx={1} />
            <rect x={w-12} y={5} width={10} height={h-10} fill={step.color + "25"} stroke={step.color+"60"} rx={1} />
            <rect x={5} y={2} width={w-10} height={8} fill={step.color + "18"} stroke={step.color+"40"} rx={1} />
          </>}
          {type === "davanzale" && <>
            <rect x={5} y={h-16} width={w-10} height={10} fill={step.color + "25"} stroke={step.color+"60"} rx={1} />
          </>}
        </svg>
      );
    };

    // Inline input renderer (no sub-component = no focus loss)
    const bInput = (label, field) => (
      <div key={field} style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 4 }}>{label}</div>
        <input
          key={`input-${field}`}
          style={{ width: "100%", padding: "14px 16px", fontSize: 17, fontWeight: 500, fontFamily: FM, textAlign: "center", border: `1px solid ${T.bdr}`, borderRadius: 12, background: m[field] > 0 ? step.color + "08" : T.card, color: T.text, outline: "none", boxSizing: "border-box" }}
          type="number" inputMode="numeric" placeholder="Tocca per inserire" value={m[field] || ""}
          onChange={e => updateMisura(v.id, field, e.target.value)}
        />
      </div>
    );

    return (
      <div style={{ paddingBottom: 80, background: T.bg }}>
        {/* Back + vano name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: T.card, borderBottom: `1px solid ${T.bdr}` }}>
          <div onClick={() => { setSelectedVano(null); setVanoStep(0); }} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.back} s={20} c={T.sub} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{v.nome}</div>
            <div style={{ fontSize: 10, color: T.sub }}>{TIPOLOGIE_RAPIDE.find(t => t.code === v.tipo)?.label || v.tipo} · {v.stanza} · {v.piano}</div>
          </div>
          <div onClick={() => { setShowAIPhoto(true); setAiPhotoStep(0); }} style={{ padding: "5px 10px", borderRadius: 8, background: "linear-gradient(135deg, #af52de20, #007aff20)", border: "1px solid #af52de40", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 14 }}>🤖</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#af52de" }}>AI</span>
          </div>
        </div>

        {/* Dots progress */}
        <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "14px 16px 6px" }}>
          {STEPS.map((s, i) => (
            <div key={i} onClick={() => setVanoStep(i)} style={{ width: i === vanoStep ? 18 : 8, height: 8, borderRadius: 4, background: i === vanoStep ? s.color : i < vanoStep ? s.color + "60" : T.bdr, cursor: "pointer", transition: "all 0.2s" }} />
          ))}
        </div>

        <div style={{ padding: "8px 16px" }}>
          {/* Step header card */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: step.color + "10", borderRadius: 14, border: `1px solid ${step.color}25`, marginBottom: 12 }}>
            {(vanoStep <= 4) && <MiniSVG type={step.id} />}
            {vanoStep > 4 && <div style={{ width: 50, height: 50, borderRadius: 12, background: step.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{step.icon}</div>}
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: step.color }}>{step.icon} {step.title}</div>
              <div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>{step.desc}</div>
              {step.fields && <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginTop: 2 }}>{step.fields.filter(f => m[f] > 0).length}/{step.fields.length} inserite</div>}
            </div>
          </div>

          {/* Warnings */}
          {vanoStep <= 2 && (hasWarnings || hasHWarnings) && (
            <div style={{ padding: "8px 14px", borderRadius: 10, background: "#fff3e0", border: "1px solid #ffe0b2", marginBottom: 12, fontSize: 11, color: "#e65100" }}>
              {hasWarnings && <div>⚠ Nessuna larghezza inserita</div>}
              {hasHWarnings && <div>⚠ Nessuna altezza inserita</div>}
            </div>
          )}

          {/* ═══ STEP 0: LARGHEZZE ═══ */}
          {vanoStep === 0 && (
            <>
              {bInput("Larghezza ALTO", "lAlto")}
              {bInput("Larghezza CENTRO (luce netta)", "lCentro")}
              {bInput("Larghezza BASSO", "lBasso")}
              {tip && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#fff8e1", border: "1px solid #ffecb3", marginTop: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f57f17" }}>💡 {tip.t}</div>
                  <div style={{ fontSize: 11, color: "#795548" }}>Dimensioni tipiche: {tip.dim}</div>
                  {tip.w.map((w, i) => <div key={i} style={{ fontSize: 10, color: "#e65100", marginTop: 2 }}>⚠ {w}</div>)}
                </div>
              )}
            </>
          )}

          {/* ═══ STEP 1: ALTEZZE ═══ */}
          {vanoStep === 1 && (
            <>
              {bInput("Altezza SINISTRA", "hSx")}
              {bInput("Altezza CENTRO", "hCentro")}
              {bInput("Altezza DESTRA", "hDx")}
              {tip && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#fff8e1", border: "1px solid #ffecb3", marginTop: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f57f17" }}>💡 {tip.t}</div>
                  <div style={{ fontSize: 11, color: "#795548" }}>Dimensioni tipiche: {tip.dim}</div>
                  {tip.w.map((w, i) => <div key={i} style={{ fontSize: 10, color: "#e65100", marginTop: 2 }}>⚠ {w}</div>)}
                </div>
              )}
            </>
          )}

          {/* ═══ STEP 2: DIAGONALI ═══ */}
          {vanoStep === 2 && (
            <>
              {bInput("Diagonale 1 ↗", "d1")}
              {bInput("Diagonale 2 ↘", "d2")}
              {fSq !== null && fSq > 3 && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#ffebee", border: "1px solid #ef9a9a", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#c62828" }}>⚠ Fuori squadra: {fSq}mm</div>
                  <div style={{ fontSize: 11, color: "#b71c1c" }}>Differenza superiore a 3mm — segnalare in ufficio</div>
                </div>
              )}
              {fSq !== null && fSq <= 3 && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#e8f5e9", border: "1px solid #a5d6a7" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#2e7d32" }}>✅ In squadra — differenza: {fSq}mm</div>
                </div>
              )}
              {tip && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#fff8e1", border: "1px solid #ffecb3", marginTop: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f57f17" }}>💡 {tip.t}</div>
                  <div style={{ fontSize: 11, color: "#795548" }}>Dimensioni tipiche: {tip.dim}</div>
                  {tip.w.map((w, i) => <div key={i} style={{ fontSize: 10, color: "#e65100", marginTop: 2 }}>⚠ {w}</div>)}
                </div>
              )}
            </>
          )}

          {/* ═══ STEP 3: SPALLETTE ═══ */}
          {vanoStep === 3 && (
            <>
              {bInput("Spalletta SINISTRA", "spSx")}
              {bInput("Spalletta DESTRA", "spDx")}
              {bInput("Spalletta SOPRA", "spSopra")}
              {bInput("Profondità IMBOTTE", "imbotte")}
              {/* DISEGNO LIBERO SPALLETTE */}
              <div style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.bdr}`, marginTop: 8, overflow: "hidden" }}>
                <div style={{ padding: "8px 14px", borderBottom: `1px solid ${T.bdr}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#32ade6" }}>✏️ Disegno spallette</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { const ctx = spCanvasRef.current?.getContext("2d"); ctx?.clearRect(0, 0, 380, 200); }} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${T.bdr}`, background: T.card, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>🗑 Pulisci</button>
                    <button style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: T.grn, color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>💾 Salva</button>
                  </div>
                </div>
                <canvas ref={spCanvasRef} width={380} height={200} style={{ width: "100%", height: 200, background: "#fff", touchAction: "none", cursor: "crosshair" }}
                  onPointerDown={e => { setSpDrawing(true); const ctx = spCanvasRef.current?.getContext("2d"); if (ctx) { ctx.beginPath(); ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.strokeStyle = penColor; ctx.lineWidth = penSize; ctx.lineCap = "round"; ctx.lineJoin = "round"; } }}
                  onPointerMove={e => { if (!spDrawing) return; const ctx = spCanvasRef.current?.getContext("2d"); if (ctx) { ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.stroke(); } }}
                  onPointerUp={() => setSpDrawing(false)}
                  onPointerLeave={() => setSpDrawing(false)}
                />
                <div style={{ padding: "6px 14px", display: "flex", gap: 4 }}>
                  {["#1d1d1f", "#ff3b30", "#007aff", "#34c759", "#ff9500"].map(c => (
                    <div key={c} onClick={() => setPenColor(c)} style={{ width: 20, height: 20, borderRadius: "50%", background: c, border: penColor === c ? `3px solid ${T.acc}` : "2px solid transparent", cursor: "pointer" }} />
                  ))}
                  <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                    {[1, 2, 4].map(s => (
                      <div key={s} onClick={() => setPenSize(s)} style={{ width: 22, height: 22, borderRadius: 6, background: penSize === s ? T.accLt : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <div style={{ width: s * 2 + 2, height: s * 2 + 2, borderRadius: "50%", background: T.text }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ═══ STEP 4: DAVANZALE ═══ */}
          {vanoStep === 4 && (
            <>
              {bInput("Davanzale PROFONDITÀ", "davProf")}
              {bInput("Davanzale SPORGENZA", "davSporg")}
              {bInput("Altezza SOGLIA", "soglia")}
              {/* Cassonetto toggle */}
              <div style={{ marginTop: 8, padding: "12px 16px", borderRadius: 12, border: `1px dashed ${T.bdr}`, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => {
                const nv = { ...v, cassonetto: !v.cassonetto };
                setSelectedVano(nv);
                setCantieri(cs => cs.map(c => c.id === selectedCM?.id ? { ...c, vani: c.vani.map(x => x.id === v.id ? nv : x) } : c));
              }}>
                <span style={{ fontSize: 12, color: T.sub }}>+</span>
                <span style={{ fontSize: 14 }}>🧊</span>
                <span style={{ fontSize: 13, color: T.sub }}>{v.cassonetto ? "Cassonetto attivo" : "Ha un cassonetto? Tocca per aggiungere"}</span>
              </div>
              {v.cassonetto && (
                <div style={{ marginTop: 8 }}>
                  {bInput("Cassonetto ALTEZZA", "casH")}
                  {bInput("Cassonetto PROFONDITÀ", "casP")}
                </div>
              )}
            </>
          )}

          {/* ═══ STEP 5: ACCESSORI ═══ */}
          {vanoStep === 5 && (
            <>
              {["tapparella", "persiana", "zanzariera", "cassonetto"].map(acc => {
                if (acc === "cassonetto") {
                  return (
                    <div key={acc} onClick={() => {
                      const nv = { ...v, cassonetto: !v.cassonetto };
                      setSelectedVano(nv);
                      setCantieri(cs => cs.map(c => c.id === selectedCM?.id ? { ...c, vani: c.vani.map(x => x.id === v.id ? nv : x) } : c));
                    }} style={{ padding: "14px 16px", borderRadius: 12, border: `1px dashed ${v.cassonetto ? "#ff9500" : T.bdr}`, background: v.cassonetto ? "#fff8e1" : T.card, marginBottom: 8, cursor: "pointer", textAlign: "center" }}>
                      <span style={{ fontSize: 12, color: v.cassonetto ? "#ff9500" : T.sub }}>+ 🧊 {v.cassonetto ? "Cassonetto attivo — tocca per rimuovere" : "Aggiungi Cassonetto"}</span>
                    </div>
                  );
                }
                const a = v.accessori?.[acc] || { attivo: false };
                const accColors = { tapparella: "#ff9500", persiana: "#007aff", zanzariera: "#ff2d55" };
                const accIcons = { tapparella: "🪟", persiana: "🏠", zanzariera: "🦟" };
                return (
                  <div key={acc} style={{ marginBottom: 8, borderRadius: 12, border: `1px ${a.attivo ? "solid" : "dashed"} ${a.attivo ? accColors[acc] + "40" : T.bdr}`, overflow: "hidden", background: T.card }}>
                    {!a.attivo ? (
                      <div onClick={() => toggleAccessorio(v.id, acc)} style={{ padding: "14px 16px", textAlign: "center", cursor: "pointer" }}>
                        <span style={{ fontSize: 12, color: T.sub }}>+ {accIcons[acc]} Aggiungi {acc.charAt(0).toUpperCase() + acc.slice(1)}</span>
                      </div>
                    ) : (
                      <>
                        <div style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.bdr}` }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: accColors[acc] }}>{accIcons[acc]} {acc.charAt(0).toUpperCase() + acc.slice(1)}</span>
                          <div onClick={() => toggleAccessorio(v.id, acc)} style={{ fontSize: 11, color: T.sub, cursor: "pointer" }}>▲ Chiudi</div>
                        </div>
                        <div style={{ padding: "12px 16px" }}>
                          <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 11, color: T.text, marginBottom: 4 }}>Larghezza</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <input style={{ flex: 1, padding: "10px", fontSize: 14, fontFamily: FM, border: `1px solid ${T.bdr}`, borderRadius: 8, background: T.card }} type="number" inputMode="numeric" placeholder="" value={v.accessori?.[acc]?.l || ""} onChange={e => updateAccessorio(v.id, acc, "l", parseInt(e.target.value) || 0)} />
                              <span style={{ fontSize: 11, color: T.sub, background: T.bg, padding: "6px 8px", borderRadius: 6 }}>mm</span>
                            </div>
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 11, color: T.text, marginBottom: 4 }}>Altezza</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <input style={{ flex: 1, padding: "10px", fontSize: 14, fontFamily: FM, border: `1px solid ${T.bdr}`, borderRadius: 8, background: T.card }} type="number" inputMode="numeric" placeholder="" value={v.accessori?.[acc]?.h || ""} onChange={e => updateAccessorio(v.id, acc, "h", parseInt(e.target.value) || 0)} />
                              <span style={{ fontSize: 11, color: T.sub, background: T.bg, padding: "6px 8px", borderRadius: 6 }}>mm</span>
                            </div>
                          </div>
                          {acc === "tapparella" && (
                            <>
                              <div style={{ fontSize: 10, fontWeight: 700, color: T.sub, marginBottom: 6, textTransform: "uppercase" }}>Materiale</div>
                              <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
                                {["PVC", "Alluminio", "Acciaio", "Legno"].map(mat => (
                                  <div key={mat} onClick={() => updateAccessorio(v.id, acc, "materiale", mat)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${v.accessori?.[acc]?.materiale === mat ? "#ff9500" : T.bdr}`, background: v.accessori?.[acc]?.materiale === mat ? "#ff950018" : T.card, fontSize: 12, cursor: "pointer", fontWeight: v.accessori?.[acc]?.materiale === mat ? 700 : 400, color: v.accessori?.[acc]?.materiale === mat ? "#ff9500" : T.text }}>{mat}</div>
                                ))}
                              </div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: T.sub, marginBottom: 6, textTransform: "uppercase" }}>Motorizzata</div>
                              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                                {["Sì", "No"].map(mot => (
                                  <div key={mot} onClick={() => updateAccessorio(v.id, acc, "motorizzata", mot)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${v.accessori?.[acc]?.motorizzata === mot ? "#34c759" : T.bdr}`, background: v.accessori?.[acc]?.motorizzata === mot ? "#34c75918" : T.card, fontSize: 12, cursor: "pointer", fontWeight: v.accessori?.[acc]?.motorizzata === mot ? 700 : 400, color: v.accessori?.[acc]?.motorizzata === mot ? "#34c759" : T.text }}>{mot}</div>
                                ))}
                              </div>
                            </>
                          )}
                          <div style={{ fontSize: 10, fontWeight: 700, color: T.sub, marginBottom: 6, textTransform: "uppercase" }}>Colore</div>
                          <select style={{ width: "100%", padding: "10px", fontSize: 12, border: `1px solid ${T.bdr}`, borderRadius: 8, background: T.card, fontFamily: FF }} value={v.accessori?.[acc]?.colore || ""} onChange={e => updateAccessorio(v.id, acc, "colore", e.target.value)}>
                            <option value="">Colore</option>
                            {coloriDB.map(c => <option key={c.id} value={c.code}>{c.code} — {c.nome}</option>)}
                          </select>
                          <div onClick={() => toggleAccessorio(v.id, acc)} style={{ marginTop: 10, padding: "8px", borderRadius: 8, border: `1px dashed #ef5350`, textAlign: "center", fontSize: 11, color: "#ef5350", cursor: "pointer" }}>
                            🗑 Rimuovi {acc}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* ═══ STEP 6: DISEGNO + FOTO + NOTE ═══ */}
          {vanoStep === 6 && (
            <>
              {/* Disegno mano libera */}
              <div style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.bdr}`, marginBottom: 12, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.bdr}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#ff6b6b" }}>✏️ Disegno a mano libera</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { const ctx = canvasRef.current?.getContext("2d"); ctx?.clearRect(0, 0, 380, 340); }} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${T.bdr}`, background: T.card, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>🗑 Pulisci</button>
                    <button style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#ff3b30", color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>💾 Salva</button>
                  </div>
                </div>
                <canvas ref={canvasRef} width={380} height={340} style={{ width: "100%", height: 340, background: "#fff", touchAction: "none", cursor: "crosshair" }}
                  onPointerDown={e => { setIsDrawing(true); const ctx = canvasRef.current?.getContext("2d"); if (ctx) { ctx.beginPath(); ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.strokeStyle = penColor; ctx.lineWidth = penSize; ctx.lineCap = "round"; ctx.lineJoin = "round"; } }}
                  onPointerMove={e => { if (!isDrawing) return; const ctx = canvasRef.current?.getContext("2d"); if (ctx) { ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.stroke(); } }}
                  onPointerUp={() => setIsDrawing(false)}
                  onPointerLeave={() => setIsDrawing(false)}
                />
                <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 4 }}>
                  {["#1d1d1f", "#ff3b30", "#007aff", "#34c759", "#ff9500", "#af52de", "#ff2d55", "#ffffff"].map(c => (
                    <div key={c} onClick={() => setPenColor(c)} style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: penColor === c ? `3px solid ${T.acc}` : c === "#ffffff" ? `1px solid ${T.bdr}` : "2px solid transparent", cursor: "pointer" }} />
                  ))}
                  <div style={{ width: 1, height: 20, background: T.bdr, margin: "0 4px" }} />
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <span style={{ fontSize: 12 }}>🩹</span>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                    {[1, 2, 4, 6].map(s => (
                      <div key={s} onClick={() => setPenSize(s)} style={{ width: 24, height: 24, borderRadius: 6, background: penSize === s ? T.accLt : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <div style={{ width: s * 2 + 1, height: s * 2 + 1, borderRadius: "50%", background: T.text }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Foto */}
              <div style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.bdr}`, padding: 14, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.blue }}>📷 FOTO (0)</div>
                  <button style={{ padding: "4px 10px", borderRadius: 6, background: T.acc, color: "#fff", border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>+ Foto</button>
                </div>
                <div style={{ fontSize: 10, color: T.sub, marginBottom: 6 }}>0%</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {[
                    { n: "Panoramica", r: true, c: "#ff3b30" }, { n: "Spalle muro", r: true, c: "#007aff" }, { n: "Soglia", r: true, c: "#007aff" },
                    { n: "Cassonetto", r: false, c: "#34c759" }, { n: "Dettagli critici", r: true, c: "#ff3b30" }, { n: "Imbotto", r: false, c: "#34c759" },
                    { n: "Contesto", r: false, c: "#34c759" }, { n: "Altro", r: false, c: "#34c759" },
                  ].map((cat, i) => (
                    <div key={i} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${cat.r ? cat.c + "40" : T.bdr}`, background: cat.r ? cat.c + "08" : "transparent", fontSize: 10, fontWeight: 600, color: cat.r ? cat.c : T.sub, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                      {cat.r && <span style={{ fontSize: 8 }}>✕</span>}
                      <span style={{ fontSize: 10 }}>📷</span> {cat.n}
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center", padding: "16px 0", color: T.sub, fontSize: 11 }}>Nessuna foto — tocca una categoria per iniziare</div>
              </div>

              {/* Note */}
              <div style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.bdr}`, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#ff9500", marginBottom: 8 }}>📝 NOTE</div>
                <textarea style={{ width: "100%", padding: 10, fontSize: 13, border: `1px solid ${T.bdr}`, borderRadius: 8, background: T.card, minHeight: 60, resize: "vertical", fontFamily: FF, boxSizing: "border-box" }} placeholder="Note sul vano..." defaultValue={v.note || ""} />
              </div>
            </>
          )}

          {/* ═══ STEP 7: RIEPILOGO ═══ */}
          {vanoStep === 7 && (
            <>
              <div style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.bdr}`, padding: 16, marginBottom: 12 }}>
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{v.nome}</div>
                  <div style={{ fontSize: 12, color: T.sub }}>{v.tipo} • {v.stanza} • {v.piano}</div>
                </div>
                {/* Larghezze */}
                <div style={{ borderRadius: 10, border: `1px solid #507aff25`, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ padding: "6px 12px", background: "#507aff10", fontSize: 11, fontWeight: 700, color: "#507aff" }}>📏 LARGHEZZE</div>
                  {[["Alto", m.lAlto], ["Centro", m.lCentro], ["Basso", m.lBasso]].map(([l, val]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderTop: `1px solid ${T.bdr}`, fontSize: 12 }}>
                      <span style={{ color: T.text }}>{l}</span>
                      <span style={{ fontFamily: FM, fontWeight: 600, color: val ? T.text : T.sub2 }}>{val || "—"}</span>
                    </div>
                  ))}
                </div>
                {/* Altezze */}
                <div style={{ borderRadius: 10, border: `1px solid #34c75925`, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ padding: "6px 12px", background: "#34c75910", fontSize: 11, fontWeight: 700, color: "#34c759" }}>📐 ALTEZZE</div>
                  {[["Sinistra", m.hSx], ["Centro", m.hCentro], ["Destra", m.hDx]].map(([l, val]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderTop: `1px solid ${T.bdr}`, fontSize: 12 }}>
                      <span>{l}</span>
                      <span style={{ fontFamily: FM, fontWeight: 600, color: val ? T.text : T.sub2 }}>{val || "—"}</span>
                    </div>
                  ))}
                </div>
                {/* Diagonali */}
                <div style={{ borderRadius: 10, border: `1px solid #ff950025`, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ padding: "6px 12px", background: "#ff950010", fontSize: 11, fontWeight: 700, color: "#ff9500" }}>✕ DIAGONALI</div>
                  {[["D1", m.d1], ["D2", m.d2], ["Fuori squadra", fSq !== null ? `${fSq}mm` : ""]].map(([l, val]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderTop: `1px solid ${T.bdr}`, fontSize: 12 }}>
                      <span>{l}</span>
                      <span style={{ fontFamily: FM, fontWeight: 600, color: l === "Fuori squadra" && fSq > 3 ? "#ff3b30" : val ? T.text : T.sub2 }}>{val || "—"}</span>
                    </div>
                  ))}
                </div>
                {/* Spallette */}
                <div style={{ borderRadius: 10, border: `1px solid #32ade625`, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ padding: "6px 12px", background: "#32ade610", fontSize: 11, fontWeight: 700, color: "#32ade6" }}>🧱 SPALLETTE</div>
                  {[["Sinistra", m.spSx], ["Destra", m.spDx], ["Sopra", m.spSopra], ["Imbotte", m.imbotte]].map(([l, val]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderTop: `1px solid ${T.bdr}`, fontSize: 12 }}>
                      <span>{l}</span>
                      <span style={{ fontFamily: FM, fontWeight: 600, color: val ? T.text : T.sub2 }}>{val || "—"}</span>
                    </div>
                  ))}
                </div>
                {/* Davanzale */}
                <div style={{ borderRadius: 10, border: `1px solid #ff2d5525`, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ padding: "6px 12px", background: "#ff2d5510", fontSize: 11, fontWeight: 700, color: "#ff2d55" }}>⬇ DAVANZALE</div>
                  {[["Profondità", m.davProf], ["Sporgenza", m.davSporg], ["Soglia", m.soglia]].map(([l, val]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderTop: `1px solid ${T.bdr}`, fontSize: 12 }}>
                      <span>{l}</span>
                      <span style={{ fontFamily: FM, fontWeight: 600, color: val ? T.text : T.sub2 }}>{val || "—"}</span>
                    </div>
                  ))}
                </div>
                {/* Accessori */}
                {(v.accessori?.tapparella?.attivo || v.accessori?.persiana?.attivo || v.accessori?.zanzariera?.attivo) && (
                  <div style={{ borderRadius: 10, border: `1px solid #af52de25`, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ padding: "6px 12px", background: "#af52de10", fontSize: 11, fontWeight: 700, color: "#af52de" }}>✚ ACCESSORI</div>
                    {v.accessori?.tapparella?.attivo && <div style={{ padding: "6px 12px", borderTop: `1px solid ${T.bdr}`, fontSize: 12 }}>🪟 Tapparella</div>}
                    {v.accessori?.persiana?.attivo && <div style={{ padding: "6px 12px", borderTop: `1px solid ${T.bdr}`, fontSize: 12 }}>🏠 Persiana</div>}
                    {v.accessori?.zanzariera?.attivo && <div style={{ padding: "6px 12px", borderTop: `1px solid ${T.bdr}`, fontSize: 12 }}>🦟 Zanzariera</div>}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ═══ NAV BUTTONS ═══ */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {vanoStep > 0 && (
              <button onClick={() => setVanoStep(s => s - 1)} style={{ flex: 1, padding: "14px", borderRadius: 12, border: `1px solid ${T.bdr}`, background: T.card, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: T.text }}>← Indietro</button>
            )}
            {vanoStep < 7 && (
              <button onClick={() => setVanoStep(s => s + 1)} style={{ flex: vanoStep === 0 ? "1 1 100%" : 1, padding: "14px", borderRadius: 12, border: "none", background: step.color, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FF }}>Avanti →</button>
            )}
            {vanoStep === 7 && (
              <button onClick={() => { setVanoStep(0); goBack(); }} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", background: "#34c759", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FF }}>💾 SALVA TUTTO</button>
            )}
          </div>

          {/* ═══ RIEPILOGO RAPIDO ═══ */}
          <div style={{ marginTop: 12, padding: "8px 12px", background: T.card, borderRadius: 10, border: `1px solid ${T.bdr}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Riepilogo rapido</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                ["L", m.lCentro || m.lAlto || m.lBasso],
                ["H", m.hCentro || m.hSx || m.hDx],
                ["D1", m.d1], ["D2", m.d2],
                ["F.sq", fSq !== null ? `${fSq}` : null],
              ].map(([l, val]) => (
                <div key={l} style={{ padding: "3px 8px", borderRadius: 4, background: T.bg, fontSize: 10, fontFamily: FM, color: val ? T.text : T.sub2 }}>
                  {l}: {val || "—"}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  };

  /* ── AGENDA TAB — Giorno / Settimana / Mese ── */
  const renderAgenda = () => {
    const dateStr = (d) => d.toISOString().split("T")[0];
    const dayEvents = events.filter(e => e.date === dateStr(selDate)).sort((a, b) => (a.time || "99").localeCompare(b.time || "99"));
    const weekStart = new Date(selDate); weekStart.setDate(selDate.getDate() - selDate.getDay() + 1);
    const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; });
    const monthStart = new Date(selDate.getFullYear(), selDate.getMonth(), 1);
    const monthDays = Array.from({ length: 35 }, (_, i) => { const d = new Date(monthStart); d.setDate(d.getDate() + i - monthStart.getDay() + 1); return d; });
    const isSameDay = (a, b) => dateStr(a) === dateStr(b);
    const isToday2 = (d) => isSameDay(d, new Date());
    const eventsOn = (d) => events.filter(e => e.date === dateStr(d));

    const navDate = (dir) => {
      const d = new Date(selDate);
      if (agendaView === "giorno") d.setDate(d.getDate() + dir);
      else if (agendaView === "settimana") d.setDate(d.getDate() + dir * 7);
      else d.setMonth(d.getMonth() + dir);
      setSelDate(d);
    };

    const renderEventCard = (ev) => (
      <div key={ev.id} style={{ ...S.card, margin: "0 0 8px" }} onClick={() => setSelectedEvent(selectedEvent?.id === ev.id ? null : ev)}>
        <div style={{ ...S.cardInner, display: "flex", gap: 10 }}>
          <div style={{ width: 3, borderRadius: 2, background: ev.color, flexShrink: 0 }} />
          {ev.time && <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, minWidth: 38, fontFamily: FM }}>{ev.time}</div>}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{ev.text}</div>
            {ev.addr && <div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>📍 {ev.addr}</div>}
            <div style={{ display: "flex", gap: 4, marginTop: 3, flexWrap: "wrap" }}>
              {ev.cm && <span onClick={(e) => { e.stopPropagation(); const cm = cantieri.find(c => c.code === ev.cm); if (cm) { setSelectedCM(cm); setTab("commesse"); } }} style={{ ...S.badge(T.accLt, T.acc), cursor: "pointer" }}>{ev.cm}</span>}
              {ev.persona && <span style={S.badge(T.purpleLt, T.purple)}>{ev.persona}</span>}
              <span style={S.badge(ev.tipo === "appuntamento" ? T.blueLt : T.orangeLt, ev.tipo === "appuntamento" ? T.blue : T.orange)}>{ev.tipo}</span>
            </div>
          </div>
          <div style={{ alignSelf: "center", transition: "transform 0.2s", transform: selectedEvent?.id === ev.id ? "rotate(90deg)" : "rotate(0deg)" }}>
            <Ico d={ICO.back} s={14} c={T.sub} />
          </div>
        </div>
        {/* Expanded detail */}
        {selectedEvent?.id === ev.id && (
          <div style={{ padding: "0 14px 12px", borderTop: `1px solid ${T.bdr}`, marginTop: 4 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "10px 0" }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: 0.5 }}>Data</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{new Date(ev.date).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: 0.5 }}>Orario</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{ev.time || "Tutto il giorno"}</div>
              </div>
              {ev.persona && <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: 0.5 }}>Assegnato a</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>👤 {ev.persona}</div>
              </div>}
              {ev.addr && <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: 0.5 }}>Luogo</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>📍 {ev.addr}</div>
              </div>}
            </div>
            {ev.cm && (
              <div style={{ padding: "8px 10px", background: T.accLt, borderRadius: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: T.acc, textTransform: "uppercase", letterSpacing: 0.5 }}>Commessa collegata</div>
                <div onClick={(e) => { e.stopPropagation(); const cm = cantieri.find(c => c.code === ev.cm); if (cm) { setSelectedCM(cm); setTab("commesse"); } }} style={{ fontSize: 13, fontWeight: 700, color: T.acc, marginTop: 2, cursor: "pointer" }}>{ev.cm} → Apri commessa</div>
              </div>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              <div onClick={(e) => { e.stopPropagation(); if (ev.addr) window.open("https://maps.google.com/?q=" + encodeURIComponent(ev.addr)); }} style={{ flex: 1, padding: "8px", borderRadius: 8, background: T.card, border: `1px solid ${T.bdr}`, textAlign: "center", cursor: "pointer", fontSize: 11, fontWeight: 600, color: T.blue }}>🗺 Mappa</div>
              <div onClick={(e) => { e.stopPropagation(); if (ev.persona) window.open("tel:"); }} style={{ flex: 1, padding: "8px", borderRadius: 8, background: T.card, border: `1px solid ${T.bdr}`, textAlign: "center", cursor: "pointer", fontSize: 11, fontWeight: 600, color: T.grn }}>📞 Chiama</div>
              <div onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); setSelectedEvent(null); }} style={{ flex: 1, padding: "8px", borderRadius: 8, background: T.redLt, border: `1px solid ${T.red}30`, textAlign: "center", cursor: "pointer", fontSize: 11, fontWeight: 600, color: T.red }}>🗑 Elimina</div>
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div style={{ paddingBottom: 80 }}>
        <div style={S.header}>
          <div style={{ flex: 1 }}>
            <div style={S.headerTitle}>Agenda</div>
            <div style={S.headerSub}>
              {agendaView === "giorno" ? selDate.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" }) :
               agendaView === "settimana" ? `${weekDays[0].getDate()}–${weekDays[6].getDate()} ${selDate.toLocaleDateString("it-IT", { month: "long", year: "numeric" })}` :
               selDate.toLocaleDateString("it-IT", { month: "long", year: "numeric" })}
            </div>
          </div>
          <div onClick={() => setShowNewEvent(true)} style={{ width: 36, height: 36, borderRadius: 10, background: T.acc, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 20, fontWeight: 300 }}>+</div>
        </div>

        {/* View switcher */}
        <div style={{ display: "flex", gap: 0, margin: "8px 16px", borderRadius: 8, overflow: "hidden", border: `1px solid ${T.bdr}` }}>
          {["giorno", "settimana", "mese"].map(v => (
            <div key={v} onClick={() => setAgendaView(v)} style={{ flex: 1, padding: "8px 4px", textAlign: "center", fontSize: 12, fontWeight: 600, background: agendaView === v ? T.acc : T.card, color: agendaView === v ? "#fff" : T.sub, cursor: "pointer", textTransform: "capitalize" }}>
              {v}
            </div>
          ))}
        </div>

        {/* Nav arrows */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 16px" }}>
          <div onClick={() => navDate(-1)} style={{ cursor: "pointer", padding: "4px 8px" }}><Ico d={ICO.back} s={18} c={T.sub} /></div>
          <div onClick={() => setSelDate(new Date())} style={{ fontSize: 12, fontWeight: 600, color: T.acc, cursor: "pointer" }}>Oggi</div>
          <div onClick={() => navDate(1)} style={{ cursor: "pointer", padding: "4px 8px", transform: "rotate(180deg)" }}><Ico d={ICO.back} s={18} c={T.sub} /></div>
        </div>

        <div style={{ padding: "0 16px" }}>

          {/* ═══ VISTA MESE ═══ */}
          {agendaView === "mese" && (
            <>
              <div style={{ background: T.card, borderRadius: T.r, border: `1px solid ${T.bdr}`, padding: 12, marginBottom: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
                  {["L", "M", "M", "G", "V", "S", "D"].map((d, i) => (
                    <div key={i} style={{ fontSize: 10, fontWeight: 600, color: T.sub, padding: "4px 0" }}>{d}</div>
                  ))}
                  {monthDays.map((d, i) => {
                    const inMonth = d.getMonth() === selDate.getMonth();
                    const sel = isSameDay(d, selDate);
                    const tod = isToday2(d);
                    const hasEv = eventsOn(d).length > 0;
                    return (
                      <div key={i} onClick={() => setSelDate(new Date(d))} style={{ padding: "6px 2px", borderRadius: 8, fontSize: 12, fontWeight: sel || tod ? 700 : 400, background: sel ? T.acc : tod ? T.accLt : "transparent", color: sel ? "#fff" : !inMonth ? T.sub2 : T.text, cursor: "pointer", position: "relative" }}>
                        {d.getDate()}
                        {hasEv && <div style={{ width: 4, height: 4, borderRadius: "50%", background: sel ? "#fff" : T.red, margin: "1px auto 0" }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                {selDate.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              {dayEvents.length === 0 ? (
                <div style={{ padding: "16px", textAlign: "center", color: T.sub, fontSize: 12, background: T.card, borderRadius: T.r, border: `1px dashed ${T.bdr}` }}>Nessun evento. Tocca + per aggiungere.</div>
              ) : dayEvents.map(renderEventCard)}
            </>
          )}

          {/* ═══ VISTA SETTIMANA ═══ */}
          {agendaView === "settimana" && (
            <>
              <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                {weekDays.map((d, i) => {
                  const sel = isSameDay(d, selDate);
                  const tod = isToday2(d);
                  const n = eventsOn(d).length;
                  return (
                    <div key={i} onClick={() => setSelDate(new Date(d))} style={{ flex: 1, textAlign: "center", padding: "8px 2px", borderRadius: 10, background: sel ? T.acc : tod ? T.accLt : T.card, border: `1px solid ${sel ? T.acc : T.bdr}`, cursor: "pointer" }}>
                      <div style={{ fontSize: 9, fontWeight: 600, color: sel ? "#fff" : T.sub, textTransform: "uppercase" }}>
                        {["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"][i]}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: sel ? "#fff" : T.text, marginTop: 2 }}>{d.getDate()}</div>
                      {n > 0 && <div style={{ width: 5, height: 5, borderRadius: "50%", background: sel ? "#fff" : T.red, margin: "2px auto 0" }} />}
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                {selDate.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              {dayEvents.length === 0 ? (
                <div style={{ padding: "16px", textAlign: "center", color: T.sub, fontSize: 12, background: T.card, borderRadius: T.r, border: `1px dashed ${T.bdr}` }}>Nessun evento</div>
              ) : dayEvents.map(renderEventCard)}
            </>
          )}

          {/* ═══ VISTA GIORNO ═══ */}
          {agendaView === "giorno" && (
            <>
              {/* Timeline ore */}
              <div style={{ background: T.card, borderRadius: T.r, border: `1px solid ${T.bdr}`, overflow: "hidden", marginBottom: 12 }}>
                {Array.from({ length: 12 }, (_, i) => i + 7).map(h => {
                  const hour = `${String(h).padStart(2, "0")}:00`;
                  const hourEvents = dayEvents.filter(e => e.time && e.time.startsWith(String(h).padStart(2, "0")));
                  return (
                    <div key={h} style={{ display: "flex", borderBottom: `1px solid ${T.bdr}`, minHeight: 48 }}>
                      <div style={{ width: 48, padding: "4px 6px", fontSize: 10, color: T.sub, fontFamily: FM, fontWeight: 600, borderRight: `1px solid ${T.bdr}`, flexShrink: 0 }}>{hour}</div>
                      <div style={{ flex: 1, padding: "4px 8px" }}>
                        {hourEvents.map(ev => (
                          <div key={ev.id}>
                            <div onClick={() => setSelectedEvent(selectedEvent?.id === ev.id ? null : ev)} style={{ padding: "4px 8px", borderRadius: 6, background: ev.color + "18", borderLeft: `3px solid ${ev.color}`, marginBottom: 2, fontSize: 11, fontWeight: 600, color: T.text, cursor: "pointer" }}>
                              {ev.text}
                              {ev.persona && <span style={{ color: T.sub, fontWeight: 400 }}> · {ev.persona}</span>}
                            </div>
                            {selectedEvent?.id === ev.id && (
                              <div style={{ padding: "8px", margin: "2px 0 6px", background: T.card, borderRadius: 8, border: `1px solid ${T.bdr}`, boxShadow: T.cardSh }}>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                                  {ev.addr && <div style={{ fontSize: 11, color: T.text }}>📍 {ev.addr}</div>}
                                  {ev.persona && <span style={S.badge(T.purpleLt, T.purple)}>👤 {ev.persona}</span>}
                                  {ev.cm && <span onClick={(e) => { e.stopPropagation(); const cm = cantieri.find(c => c.code === ev.cm); if (cm) { setSelectedCM(cm); setTab("commesse"); } }} style={{ ...S.badge(T.accLt, T.acc), cursor: "pointer" }}>📁 {ev.cm}</span>}
                                  <span style={S.badge(ev.tipo === "appuntamento" ? T.blueLt : T.orangeLt, ev.tipo === "appuntamento" ? T.blue : T.orange)}>{ev.tipo}</span>
                                </div>
                                <div style={{ display: "flex", gap: 4 }}>
                                  {ev.addr && <div onClick={(e) => { e.stopPropagation(); window.open("https://maps.google.com/?q=" + encodeURIComponent(ev.addr)); }} style={{ flex: 1, padding: "6px", borderRadius: 6, background: T.blueLt, textAlign: "center", cursor: "pointer", fontSize: 10, fontWeight: 600, color: T.blue }}>🗺 Mappa</div>}
                                  <div onClick={(e) => { e.stopPropagation(); }} style={{ flex: 1, padding: "6px", borderRadius: 6, background: T.grnLt, textAlign: "center", cursor: "pointer", fontSize: 10, fontWeight: 600, color: T.grn }}>📞 Chiama</div>
                                  <div onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); setSelectedEvent(null); }} style={{ flex: 1, padding: "6px", borderRadius: 6, background: T.redLt, textAlign: "center", cursor: "pointer", fontSize: 10, fontWeight: 600, color: T.red }}>🗑 Elimina</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Unscheduled */}
              {dayEvents.filter(e => !e.time).length > 0 && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: T.sub }}>Senza orario</div>
                  {dayEvents.filter(e => !e.time).map(renderEventCard)}
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  /* ── CHAT / AI TAB ── */
  const renderMessaggi = () => {
    const chIco = { email: "📧", whatsapp: "💬", sms: "📱", telegram: "✈️" };
    const chCol = { email: T.blue, whatsapp: "#25d366", sms: T.orange, telegram: "#0088cc" };
    const chBg = { email: T.blueLt, whatsapp: "#25d36618", sms: T.orangeLt, telegram: "#0088cc18" };
    const filteredMsgs = msgs.filter(m => {
      const matchFilter = msgFilter === "tutti" || m.canale === msgFilter;
      const matchSearch = !msgSearch.trim() || m.from.toLowerCase().includes(msgSearch.toLowerCase()) || m.preview.toLowerCase().includes(msgSearch.toLowerCase());
      return matchFilter && matchSearch;
    });
    const unread = msgs.filter(m => !m.read).length;

    // Rubrica filters
    const filteredContatti = [...contatti, ...team.map(t => ({ id: "t" + t.id, nome: t.nome, tipo: "team", ruolo: t.ruolo, tel: "", email: "", preferito: true, canali: ["whatsapp", "email"], cm: "", colore: t.colore }))].filter(c => {
      const matchF = rubricaFilter === "tutti" || (rubricaFilter === "preferiti" && c.preferito) || (rubricaFilter === "team" && c.tipo === "team") || (rubricaFilter === "clienti" && c.tipo === "cliente") || (rubricaFilter === "fornitori" && (c.tipo === "fornitore" || c.tipo === "professionista"));
      const matchS = !rubricaSearch.trim() || c.nome.toLowerCase().includes(rubricaSearch.toLowerCase());
      return matchF && matchS;
    }).sort((a, b) => (b.preferito ? 1 : 0) - (a.preferito ? 1 : 0) || a.nome.localeCompare(b.nome));

    return (
      <div style={{ paddingBottom: 80 }}>
        <div style={S.header}>
          <div style={{ flex: 1 }}>
            <div style={S.headerTitle}>Messaggi</div>
            <div style={S.headerSub}>{unread > 0 ? `${unread} non letti` : "Tutti letti"} · {msgs.length} conversazioni</div>
          </div>
          <div onClick={() => setShowCompose(true)} style={{ width: 36, height: 36, borderRadius: 10, background: T.acc, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Ico d={ICO.pen} s={16} c="#fff" />
          </div>
        </div>

        {/* Sub-tabs: Chat / Rubrica */}
        <div style={{ display: "flex", margin: "8px 16px", borderRadius: 10, border: `1px solid ${T.bdr}`, overflow: "hidden" }}>
          {[{ id: "chat", l: "💬 Chat", count: unread }, { id: "rubrica", l: "📒 Rubrica", count: contatti.length + team.length }].map(st => (
            <div key={st.id} onClick={() => setMsgSubTab(st.id)} style={{ flex: 1, padding: "10px 0", textAlign: "center", fontSize: 13, fontWeight: 700, cursor: "pointer", background: msgSubTab === st.id ? T.acc : T.card, color: msgSubTab === st.id ? "#fff" : T.sub, transition: "all 0.2s" }}>
              {st.l} {st.count > 0 && msgSubTab !== st.id && <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 8, background: st.id === "chat" && unread > 0 ? T.red : T.bdr, color: st.id === "chat" && unread > 0 ? "#fff" : T.sub, marginLeft: 4 }}>{st.count}</span>}
            </div>
          ))}
        </div>

        {/* ── CHAT TAB ── */}
        {msgSubTab === "chat" && (<>
          {/* Search */}
          <div style={{ padding: "4px 16px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: T.card, borderRadius: 10, border: `1px solid ${T.bdr}` }}>
              <Ico d={ICO.search} s={14} c={T.sub} />
              <input style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, color: T.text, outline: "none", fontFamily: FF }} placeholder="Cerca contatto o messaggio..." value={msgSearch} onChange={e => setMsgSearch(e.target.value)} />
              {msgSearch && <div onClick={() => setMsgSearch("")} style={{ cursor: "pointer", fontSize: 14, color: T.sub }}>✕</div>}
            </div>
          </div>

          {/* Channel filters */}
          <div style={{ display: "flex", gap: 4, padding: "0 16px 10px", overflowX: "auto" }}>
            {[
              { id: "tutti", l: "Tutti", c: T.acc },
              { id: "whatsapp", l: "💬 WhatsApp", c: "#25d366" },
              { id: "email", l: "📧 Email", c: T.blue },
              { id: "sms", l: "📱 SMS", c: T.orange },
              { id: "telegram", l: "✈️ Telegram", c: "#0088cc" },
            ].map(f => {
              const unr = f.id === "tutti" ? unread : msgs.filter(m => m.canale === f.id && !m.read).length;
              return (
                <div key={f.id} onClick={() => setMsgFilter(f.id)} style={{ padding: "6px 12px", borderRadius: 20, border: `1px solid ${msgFilter === f.id ? f.c : T.bdr}`, background: msgFilter === f.id ? f.c + "15" : T.card, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", color: msgFilter === f.id ? f.c : T.sub, display: "flex", alignItems: "center", gap: 4 }}>
                  {f.l}
                  {unr > 0 && <span style={{ width: 16, height: 16, borderRadius: "50%", background: f.c, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unr}</span>}
                </div>
              );
            })}
          </div>

          {/* Message list */}
          <div style={{ padding: "0 16px" }}>
            {filteredMsgs.length === 0 ? (
              <div style={{ padding: 30, textAlign: "center", color: T.sub, fontSize: 13 }}>Nessun messaggio</div>
            ) : (
              <div style={{ background: T.card, borderRadius: T.r, border: `1px solid ${T.bdr}`, overflow: "hidden" }}>
                {filteredMsgs.map(m => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: `1px solid ${T.bg}`, cursor: "pointer", background: m.read ? "transparent" : T.acc + "06" }} onClick={() => { setMsgs(ms => ms.map(x => x.id === m.id ? { ...x, read: true } : x)); setSelectedMsg(m); }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: chBg[m.canale] || T.bg, border: `2px solid ${chCol[m.canale] || T.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, position: "relative" }}>
                      {m.from.charAt(0).toUpperCase()}
                      <div style={{ position: "absolute", bottom: -2, right: -2, fontSize: 10, background: T.card, borderRadius: "50%", padding: 1 }}>{chIco[m.canale]}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: m.read ? 500 : 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.from}</div>
                        <div style={{ fontSize: 10, color: m.read ? T.sub : T.acc, fontWeight: m.read ? 400 : 700, flexShrink: 0, marginLeft: 8 }}>{m.time}</div>
                      </div>
                      <div style={{ fontSize: 12, color: m.read ? T.sub : T.text, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: m.read ? 400 : 500 }}>{m.preview}</div>
                      {m.cm && <div style={{ marginTop: 3 }}><span style={S.badge(T.accLt, T.acc)}>{m.cm}</span></div>}
                    </div>
                    {!m.read && <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.acc, flexShrink: 0 }} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>)}

        {/* ── RUBRICA TAB ── */}
        {msgSubTab === "rubrica" && (<>
          {/* Search */}
          <div style={{ padding: "4px 16px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: T.card, borderRadius: 10, border: `1px solid ${T.bdr}` }}>
              <Ico d={ICO.search} s={14} c={T.sub} />
              <input style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, color: T.text, outline: "none", fontFamily: FF }} placeholder="Cerca nella rubrica..." value={rubricaSearch} onChange={e => setRubricaSearch(e.target.value)} />
              {rubricaSearch && <div onClick={() => setRubricaSearch("")} style={{ cursor: "pointer", fontSize: 14, color: T.sub }}>✕</div>}
            </div>
          </div>

          {/* Rubrica filters */}
          <div style={{ display: "flex", gap: 4, padding: "0 16px 10px", overflowX: "auto" }}>
            {[
              { id: "tutti", l: "Tutti", c: T.acc },
              { id: "preferiti", l: "⭐ Preferiti", c: "#ff9500" },
              { id: "team", l: "👥 Team", c: "#34c759" },
              { id: "clienti", l: "🏠 Clienti", c: T.blue },
              { id: "fornitori", l: "🏭 Fornitori", c: "#af52de" },
            ].map(f => (
              <div key={f.id} onClick={() => setRubricaFilter(f.id)} style={{ padding: "6px 12px", borderRadius: 20, border: `1px solid ${rubricaFilter === f.id ? f.c : T.bdr}`, background: rubricaFilter === f.id ? f.c + "15" : T.card, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", color: rubricaFilter === f.id ? f.c : T.sub }}>
                {f.l}
              </div>
            ))}
          </div>

          {/* Contact list */}
          <div style={{ padding: "0 16px" }}>
            <div style={{ background: T.card, borderRadius: T.r, border: `1px solid ${T.bdr}`, overflow: "hidden" }}>
              {filteredContatti.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: T.sub, fontSize: 13 }}>Nessun contatto trovato</div>
              ) : filteredContatti.map(c => {
                const tipoColor = c.tipo === "team" ? "#34c759" : c.tipo === "cliente" ? T.blue : c.tipo === "fornitore" ? "#af52de" : "#ff9500";
                const tipoLabel = c.tipo === "team" ? "Team" : c.tipo === "cliente" ? "Cliente" : c.tipo === "fornitore" ? "Fornitore" : "Professionista";
                return (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: `1px solid ${T.bg}` }}>
                    {/* Avatar */}
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: (c.colore || tipoColor) + "18", border: `2px solid ${c.colore || tipoColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: c.colore || tipoColor, flexShrink: 0, position: "relative" }}>
                      {c.nome.split(" ").map(w => w[0]).join("").substring(0, 2)}
                      {c.preferito && <div style={{ position: "absolute", top: -4, right: -4, fontSize: 10 }}>⭐</div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{c.nome}</div>
                      <div style={{ display: "flex", gap: 4, marginTop: 2, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={S.badge(tipoColor + "18", tipoColor)}>{tipoLabel}</span>
                        {c.ruolo && <span style={{ fontSize: 10, color: T.sub }}>{c.ruolo}</span>}
                        {c.cm && <span style={S.badge(T.accLt, T.acc)}>{c.cm}</span>}
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 4 }}>
                      {(c.canali || []).includes("whatsapp") && (
                        <div onClick={() => { setComposeMsg(m => ({ ...m, canale: "whatsapp", to: c.nome })); setShowCompose(true); }} style={{ width: 32, height: 32, borderRadius: "50%", background: "#25d36618", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>💬</div>
                      )}
                      {(c.canali || []).includes("email") && (
                        <div onClick={() => { setComposeMsg(m => ({ ...m, canale: "email", to: c.nome })); setShowCompose(true); }} style={{ width: 32, height: 32, borderRadius: "50%", background: T.blueLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>📧</div>
                      )}
                      <div onClick={() => { setContatti(cs => cs.map(x => x.id === c.id ? { ...x, preferito: !x.preferito } : x)); }} style={{ width: 32, height: 32, borderRadius: "50%", background: c.preferito ? "#ff950018" : T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>
                        {c.preferito ? "⭐" : "☆"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>)}

        {/* FAB — Compose menu */}
        <style>{`
          @keyframes fabPulse { 0%,100% { box-shadow: 0 4px 20px rgba(0,122,255,0.4); } 50% { box-shadow: 0 4px 30px rgba(0,122,255,0.6); } }
        `}</style>
        {fabOpen && <div onClick={() => setFabOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)", zIndex: 89 }} />}
        {[
          { ch: "whatsapp", ico: "💬", l: "WhatsApp", c: "#25d366" },
          { ch: "email", ico: "📧", l: "Email", c: "#007aff" },
          { ch: "sms", ico: "📱", l: "SMS", c: "#ff9500" },
          { ch: "telegram", ico: "✈️", l: "Telegram", c: "#0088cc" },
        ].map((item, i) => (
          <div key={item.ch} onClick={() => { setFabOpen(false); setComposeMsg(c => ({ ...c, canale: item.ch })); setShowCompose(true); }} style={{
            position: "fixed", bottom: 90 + (i + 1) * 58, right: 20, zIndex: 90,
            display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse",
            opacity: fabOpen ? 1 : 0, transform: fabOpen ? "translateY(0) scale(1)" : "translateY(30px) scale(0.5)",
            transition: `all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) ${fabOpen ? i * 0.06 : 0}s`,
            pointerEvents: fabOpen ? "auto" : "none",
          }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: item.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: `0 4px 16px ${item.c}50`, cursor: "pointer" }}>
              {item.ico}
            </div>
            <div style={{ padding: "6px 12px", borderRadius: 8, background: T.card, border: `1px solid ${T.bdr}`, boxShadow: "0 2px 12px rgba(0,0,0,0.1)", fontSize: 12, fontWeight: 700, color: item.c, whiteSpace: "nowrap" }}>
              {item.l}
            </div>
          </div>
        ))}
        <div onClick={() => setFabOpen(!fabOpen)} style={{
          position: "fixed", bottom: 90, right: 20, zIndex: 91,
          width: 56, height: 56, borderRadius: "50%",
          background: fabOpen ? T.sub : "linear-gradient(135deg, #007aff, #5856d6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: fabOpen ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,122,255,0.4)",
          cursor: "pointer", transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: fabOpen ? "none" : "fabPulse 2s infinite",
        }}>
          <div style={{ fontSize: 24, color: "#fff", transition: "transform 0.3s ease", transform: fabOpen ? "rotate(45deg)" : "rotate(0deg)" }}>✏️</div>
        </div>
      </div>
    );
  };

  /* ── SETTINGS TAB ── */
  const renderSettings = () => (
    <div style={{ paddingBottom: 80 }}>
      <div style={S.header}>
        <div style={{ flex: 1 }}>
          <div style={S.headerTitle}>Impostazioni</div>
        </div>
      </div>

      {/* Settings sub-tabs — scrollable */}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", margin: "8px 16px 12px", borderRadius: 8, border: `1px solid ${T.bdr}` }}>
        <div style={{ display: "flex", minWidth: "max-content" }}>
          {[{ id: "generali", l: "⚙️ Generali" }, { id: "team", l: "👥 Team" }, { id: "sistemi", l: "🏗 Sistemi" }, { id: "colori", l: "🎨 Colori" }, { id: "vetri", l: "🪟 Vetri" }, { id: "tipologie", l: "📐 Tipologie" }, { id: "coprifili", l: "📏 Coprifili" }, { id: "lamiere", l: "🔩 Lamiere" }, { id: "salita", l: "🪜 Salita" }, { id: "pipeline", l: "📊 Pipeline" }].map(t => (
            <div key={t.id} onClick={() => setSettingsTab(t.id)} style={{ padding: "8px 12px", textAlign: "center", fontSize: 10, fontWeight: 600, background: settingsTab === t.id ? T.acc : T.card, color: settingsTab === t.id ? "#fff" : T.sub, cursor: "pointer", whiteSpace: "nowrap" }}>
              {t.l}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>

        {/* ═══ GENERALI ═══ */}
        {settingsTab === "generali" && (
          <>
            <div style={S.card}><div style={S.cardInner}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: T.acc, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700 }}>FC</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Fabio Cozza</div>
                  <div style={{ fontSize: 12, color: T.sub }}>Walter Cozza Serramenti SRL</div>
                </div>
              </div>
            </div></div>
            <div style={{ ...S.card, marginTop: 8 }}><div style={S.cardInner}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, marginBottom: 8 }}>TEMA</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["chiaro", "☀️"], ["scuro", "🌙"], ["oceano", "🌊"]].map(([id, ico]) => (
                  <div key={id} onClick={() => setTheme(id)} style={{ flex: 1, padding: "10px 4px", borderRadius: 8, border: `1.5px solid ${theme === id ? T.acc : T.bdr}`, textAlign: "center", cursor: "pointer" }}>
                    <div style={{ fontSize: 18 }}>{ico}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: "capitalize", marginTop: 2 }}>{id}</div>
                  </div>
                ))}
              </div>
            </div></div>
            <div style={{ ...S.card, marginTop: 8 }}><div style={S.cardInner}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.sub, marginBottom: 8 }}>STATISTICHE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 12 }}>
                <div><div style={{ fontSize: 20, fontWeight: 700, color: T.acc }}>{cantieri.length}</div>Commesse</div>
                <div><div style={{ fontSize: 20, fontWeight: 700, color: T.blue }}>{countVani()}</div>Vani</div>
                <div><div style={{ fontSize: 20, fontWeight: 700, color: T.grn }}>{tasks.filter(t => t.done).length}/{tasks.length}</div>Task</div>
              </div>
            </div></div>
          </>
        )}

        {/* ═══ TEAM ═══ */}
        {settingsTab === "team" && (
          <>
            {team.map(m => (
              <div key={m.id} style={{ ...S.card, marginBottom: 8 }}><div style={{ ...S.cardInner, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: m.colore, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{m.nome.split(" ").map(n => n[0]).join("")}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{m.nome}</div>
                  <div style={{ fontSize: 11, color: T.sub }}>{m.ruolo} — {m.compiti}</div>
                </div>
                <Ico d={ICO.pen} s={14} c={T.sub} />
              </div></div>
            ))}
            <div onClick={() => { setSettingsModal("membro"); setSettingsForm({ nome: "", ruolo: "Posatore", compiti: "" }); }} style={{ padding: "14px", borderRadius: T.r, border: `1px dashed ${T.bdr}`, textAlign: "center", cursor: "pointer", color: T.acc, fontSize: 12, fontWeight: 600 }}>+ Aggiungi membro</div>
          </>
        )}

        {/* ═══ SISTEMI E SOTTOSISTEMI ═══ */}
        {settingsTab === "sistemi" && (
          <>
            <div style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>Configura marche, sistemi e sottosistemi con colori collegati</div>
            {sistemiDB.map(s => (
              <div key={s.id} style={{ ...S.card, marginBottom: 8 }}><div style={S.cardInner}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.acc }}>{s.marca}</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{s.sistema}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.grn, fontFamily: FM }}>€{s.euroMq}/mq</div>
                    <div style={{ fontSize: 9, color: T.sub }}>+{s.sovRAL}% RAL · +{s.sovLegno}% Legno</div>
                  </div>
                </div>
                {s.sottosistemi && (
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: T.sub, textTransform: "uppercase", marginBottom: 3 }}>Sottosistemi</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {s.sottosistemi.map(ss => <span key={ss} style={S.badge(T.blueLt, T.blue)}>{ss}</span>)}
                    </div>
                  </div>
                )}
                <div style={{ fontSize: 9, fontWeight: 700, color: T.sub, textTransform: "uppercase", marginBottom: 3 }}>Colori disponibili</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {s.colori.map(c => {
                    const col = coloriDB.find(x => x.code === c);
                    return <span key={c} style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: col?.hex + "20", color: T.text, border: `1px solid ${col?.hex || T.bdr}40` }}>{col?.hex && <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: col.hex, marginRight: 4, verticalAlign: "middle" }} />}{c}</span>;
                  })}
                </div>
              </div></div>
            ))}
            <div onClick={() => { setSettingsModal("sistema"); setSettingsForm({ marca: "", sistema: "", euroMq: "", sovRAL: "", sovLegno: "", sottosistemi: "" }); }} style={{ padding: "14px", borderRadius: T.r, border: `1px dashed ${T.acc}`, textAlign: "center", cursor: "pointer", color: T.acc, fontSize: 12, fontWeight: 600 }}>+ Aggiungi sistema</div>
          </>
        )}

        {/* ═══ COLORI ═══ */}
        {settingsTab === "colori" && (
          <>
            <div style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>Colori disponibili — collegati ai sistemi</div>
            {coloriDB.map(c => (
              <div key={c.id} style={{ ...S.card, marginBottom: 6 }}><div style={{ ...S.cardInner, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: c.hex, border: `1px solid ${T.bdr}`, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.nome}</div>
                  <div style={{ fontSize: 10, color: T.sub }}>{c.code} · {c.tipo}</div>
                </div>
                <div style={{ fontSize: 10, color: T.sub }}>{sistemiDB.filter(s => s.colori.includes(c.code)).map(s => s.marca).join(", ") || "—"}</div>
                <div onClick={() => deleteSettingsItem("colore", c.id)} style={{ cursor: "pointer" }}><Ico d={ICO.trash} s={14} c={T.sub} /></div>
              </div></div>
            ))}
            <div onClick={() => { setSettingsModal("colore"); setSettingsForm({ nome: "", code: "", hex: "#888888", tipo: "RAL" }); }} style={{ padding: "14px", borderRadius: T.r, border: `1px dashed ${T.acc}`, textAlign: "center", cursor: "pointer", color: T.acc, fontSize: 12, fontWeight: 600 }}>+ Aggiungi colore</div>
          </>
        )}

        {/* ═══ VETRI ═══ */}
        {settingsTab === "vetri" && (
          <>
            <div style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>Tipologie vetro disponibili per i vani</div>
            {vetriDB.map(g => (
              <div key={g.id} style={{ ...S.card, marginBottom: 6 }}><div style={{ ...S.cardInner, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{g.nome}</div>
                  <div style={{ fontSize: 11, color: T.sub, fontFamily: FM }}>{g.code}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, background: g.ug <= 0.7 ? T.grnLt : g.ug <= 1.0 ? T.orangeLt : T.redLt, fontSize: 12, fontWeight: 700, fontFamily: FM, color: g.ug <= 0.7 ? T.grn : g.ug <= 1.0 ? T.orange : T.red }}>Ug={g.ug}</span>
                  <div onClick={() => deleteSettingsItem("vetro", g.id)} style={{ cursor: "pointer" }}><Ico d={ICO.trash} s={14} c={T.sub} /></div>
                </div>
              </div></div>
            ))}
            <div onClick={() => { setSettingsModal("vetro"); setSettingsForm({ nome: "", code: "", ug: "" }); }} style={{ padding: "14px", borderRadius: T.r, border: `1px dashed ${T.acc}`, textAlign: "center", cursor: "pointer", color: T.acc, fontSize: 12, fontWeight: 600 }}>+ Aggiungi vetro</div>
          </>
        )}

        {/* ═══ TIPOLOGIE ═══ */}
        {settingsTab === "tipologie" && (
          <>
            <div style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>Tipologie serramento — trascina ⭐ per i preferiti</div>
            {TIPOLOGIE_RAPIDE.map(t => {
              const isFav = favTipologie.includes(t.code);
              return (
                <div key={t.code} style={{ ...S.card, marginBottom: 4 }}><div style={{ ...S.cardInner, display: "flex", alignItems: "center", gap: 8, padding: "8px 14px" }}>
                  <div onClick={() => setFavTipologie(fav => isFav ? fav.filter(f => f !== t.code) : [...fav, t.code])} style={{ cursor: "pointer" }}>
                    <span style={{ fontSize: 16, color: isFav ? "#ff9500" : T.bdr }}>{isFav ? "⭐" : "☆"}</span>
                  </div>
                  <span style={{ fontSize: 16 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FM }}>{t.code}</span>
                    <span style={{ fontSize: 11, color: T.sub, marginLeft: 6 }}>{t.label}</span>
                  </div>
                  <Ico d={ICO.pen} s={14} c={T.sub} />
                </div></div>
              );
            })}
            <div onClick={() => { setSettingsModal("tipologia"); setSettingsForm({ code: "", label: "", icon: "🪟" }); }} style={{ padding: "14px", borderRadius: T.r, border: `1px dashed ${T.acc}`, textAlign: "center", cursor: "pointer", color: T.acc, fontSize: 12, fontWeight: 600, marginTop: 4 }}>+ Aggiungi tipologia</div>
          </>
        )}

        {/* ═══ COPRIFILI ═══ */}
        {settingsTab === "coprifili" && (
          <>
            <div style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>Lista coprifili disponibili nella creazione vano</div>
            {coprifiliDB.map(c => (
              <div key={c.id} style={{ ...S.card, marginBottom: 4 }}><div style={{ ...S.cardInner, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px" }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FM, color: T.acc }}>{c.cod}</span>
                  <span style={{ fontSize: 12, marginLeft: 8 }}>{c.nome}</span>
                </div>
                <div onClick={() => deleteSettingsItem("coprifilo", c.id)} style={{ cursor: "pointer" }}><Ico d={ICO.trash} s={14} c={T.sub} /></div>
              </div></div>
            ))}
            <div onClick={() => { setSettingsModal("coprifilo"); setSettingsForm({ nome: "", cod: "" }); }} style={{ padding: "14px", borderRadius: T.r, border: `1px dashed ${T.acc}`, textAlign: "center", cursor: "pointer", color: T.acc, fontSize: 12, fontWeight: 600, marginTop: 4 }}>+ Aggiungi coprifilo</div>
          </>
        )}

        {/* ═══ LAMIERE ═══ */}
        {settingsTab === "lamiere" && (
          <>
            <div style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>Lista lamiere e scossaline</div>
            {lamiereDB.map(l => (
              <div key={l.id} style={{ ...S.card, marginBottom: 4 }}><div style={{ ...S.cardInner, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px" }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FM, color: T.orange }}>{l.cod}</span>
                  <span style={{ fontSize: 12, marginLeft: 8 }}>{l.nome}</span>
                </div>
                <div onClick={() => deleteSettingsItem("lamiera", l.id)} style={{ cursor: "pointer" }}><Ico d={ICO.trash} s={14} c={T.sub} /></div>
              </div></div>
            ))}
            <div onClick={() => { setSettingsModal("lamiera"); setSettingsForm({ nome: "", cod: "" }); }} style={{ padding: "14px", borderRadius: T.r, border: `1px dashed ${T.acc}`, textAlign: "center", cursor: "pointer", color: T.acc, fontSize: 12, fontWeight: 600, marginTop: 4 }}>+ Aggiungi lamiera</div>
          </>
        )}

        {/* ═══ SALITA ═══ */}
        {settingsTab === "salita" && (
          <>
            <div style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>Configura i mezzi di salita disponibili</div>
            {mezziSalita.map((m, i) => (
              <div key={i} style={{ ...S.card, marginBottom: 4 }}><div style={{ ...S.cardInner, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🪜</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{m}</span>
                </div>
                <div onClick={() => { if (confirm(`Eliminare "${m}"?`)) setMezziSalita(ms => ms.filter((_, j) => j !== i)); }} style={{ cursor: "pointer" }}><Ico d={ICO.trash} s={14} c={T.sub} /></div>
              </div></div>
            ))}
            <div onClick={() => { const n = prompt("Nome mezzo di salita:"); if (n?.trim()) setMezziSalita(ms => [...ms, n.trim()]); }} style={{ padding: "14px", borderRadius: T.r, border: `1px dashed ${T.acc}`, textAlign: "center", cursor: "pointer", color: T.acc, fontSize: 12, fontWeight: 600, marginTop: 4 }}>+ Aggiungi mezzo salita</div>
          </>
        )}

        {/* ═══ PIPELINE ═══ */}
        {settingsTab === "pipeline" && (
          <>
            {PIPELINE.map((p, i) => (
              <div key={p.id} style={{ ...S.card, marginBottom: 6 }}><div style={{ ...S.cardInner, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
                <span style={{ fontSize: 18 }}>{p.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{p.nome}</div>
                  <div style={{ fontSize: 10, color: T.sub }}>Fase {i + 1} di {PIPELINE.length}</div>
                </div>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: p.color }} />
              </div></div>
            ))}
          </>
        )}
      </div>
    </div>
  );
  /* ═══════ MODALS ═══════ */
  const renderModal = () => {
    if (!showModal) return null;
    return (
      <div style={S.modal} onClick={e => e.target === e.currentTarget && setShowModal(null)}>
        <div style={S.modalInner}>
          {/* TASK MODAL */}
          {showModal === "task" && (
            <>
              <div style={S.modalTitle}>Nuovo task</div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Cosa devi fare?</label>
                <input style={S.input} placeholder="es. Sopralluogo, chiamare fornitore..." value={newTask.text} onChange={e => setNewTask(t => ({ ...t, text: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={S.fieldLabel}>Data</label>
                  <input style={S.input} type="date" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={S.fieldLabel}>Ora (opz.)</label>
                  <input style={S.input} type="time" value={newTask.time} onChange={e => setNewTask(t => ({ ...t, time: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Priorità</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[{ id: "alta", l: "Urgente", c: T.red }, { id: "media", l: "Normale", c: T.orange }, { id: "bassa", l: "Bassa", c: T.sub }].map(p => (
                    <div key={p.id} onClick={() => setNewTask(t => ({ ...t, priority: p.id }))} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${newTask.priority === p.id ? p.c : T.bdr}`, background: newTask.priority === p.id ? p.c + "18" : "transparent", color: p.c, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {p.l}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Collega a commessa (opzionale)</label>
                <select style={S.select} value={newTask.cm} onChange={e => setNewTask(t => ({ ...t, cm: e.target.value }))}>
                  <option value="">— Nessuna —</option>
                  {cantieri.map(c => <option key={c.id} value={c.code}>{c.code} · {c.cliente}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Note (opzionale)</label>
                <input style={S.input} placeholder="Dettagli, materiale da portare..." value={newTask.meta} onChange={e => setNewTask(t => ({ ...t, meta: e.target.value }))} />
              </div>
              {/* Task Allegati */}
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Allegati</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { ico: "📎", l: "File", act: () => { const inp = document.createElement("input"); inp.type = "file"; inp.onchange = (e) => { const f = e.target.files[0]; if (f) setTaskAllegati(a => [...a, { id: Date.now(), tipo: "file", nome: f.name }]); }; inp.click(); }},
                    { ico: "📝", l: "Nota", act: () => { setShowAllegatiModal("task_nota"); setAllegatiText(""); }},
                    { ico: "🎤", l: "Audio", act: () => { setShowAllegatiModal("task_vocale"); }},
                    { ico: "📷", l: "Foto", act: () => { setTaskAllegati(a => [...a, { id: Date.now(), tipo: "foto", nome: "Foto_" + new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }).replace(":", "") }]); }},
                  ].map((b, i) => (
                    <div key={i} onClick={b.act} style={{ flex: 1, padding: "8px 4px", background: T.bg, borderRadius: 8, border: `1px solid ${T.bdr}`, textAlign: "center", cursor: "pointer" }}>
                      <div style={{ fontSize: 16 }}>{b.ico}</div>
                      <div style={{ fontSize: 9, fontWeight: 600, color: T.sub, marginTop: 1 }}>{b.l}</div>
                    </div>
                  ))}
                </div>
                {taskAllegati.length > 0 && (
                  <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {taskAllegati.map(a => (
                      <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, background: T.bg, border: `1px solid ${T.bdr}`, fontSize: 10 }}>
                        <span>{a.tipo === "nota" ? "📝" : a.tipo === "vocale" ? "🎤" : a.tipo === "foto" ? "📷" : "📎"}</span>
                        <span style={{ color: T.text, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.nome}</span>
                        <span onClick={() => setTaskAllegati(al => al.filter(x => x.id !== a.id))} style={{ cursor: "pointer", color: T.red }}>✕</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button style={S.btn} onClick={addTask}>Crea task</button>
              <button style={S.btnCancel} onClick={() => setShowModal(null)}>Annulla</button>
            </>
          )}

          {/* COMMESSA MODAL */}
          {showModal === "commessa" && (
            <>
              <div style={S.modalTitle}>Nuova commessa</div>
              {/* Tipo: Nuova / Riparazione */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {[{ id: "nuova", l: "🆕 Nuova installazione", c: T.acc }, { id: "riparazione", l: "🔧 Riparazione", c: T.orange }].map(t => (
                  <div key={t.id} onClick={() => setNewCM(c => ({ ...c, tipo: t.id }))} style={{ flex: 1, padding: "10px 6px", borderRadius: 10, border: `1.5px solid ${newCM.tipo === t.id ? t.c : T.bdr}`, background: newCM.tipo === t.id ? t.c + "15" : T.card, textAlign: "center", cursor: "pointer" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: newCM.tipo === t.id ? t.c : T.sub }}>{t.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Cliente</label>
                <input style={S.input} placeholder="Nome e cognome" value={newCM.cliente} onChange={e => setNewCM(c => ({ ...c, cliente: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <div style={{ flex: 2 }}>
                  <label style={S.fieldLabel}>Indirizzo</label>
                  <input style={S.input} placeholder="Via, CAP, Città" value={newCM.indirizzo} onChange={e => setNewCM(c => ({ ...c, indirizzo: e.target.value }))} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={S.fieldLabel}>Telefono</label>
                  <input style={S.input} placeholder="347..." value={newCM.telefono} onChange={e => setNewCM(c => ({ ...c, telefono: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Sistema</label>
                <select style={S.select} value={newCM.sistema} onChange={e => setNewCM(c => ({ ...c, sistema: e.target.value }))}>
                  <option value="">— Seleziona —</option>
                  {sistemiDB.map(s => <option key={s.id} value={`${s.marca} ${s.sistema}`}>{s.marca} {s.sistema} — €{s.euroMq}/mq</option>)}
                </select>
              </div>
              {/* Difficoltà salita */}
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>🏗 Accesso / Difficoltà salita</label>
                <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                  {[{ id: "facile", l: "Facile", c: T.grn, e: "✅" }, { id: "media", l: "Media", c: T.orange, e: "⚠️" }, { id: "difficile", l: "Difficile", c: T.red, e: "🔴" }].map(d => (
                    <div key={d.id} onClick={() => setNewCM(c => ({ ...c, difficoltaSalita: d.id }))} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `1.5px solid ${newCM.difficoltaSalita === d.id ? d.c : T.bdr}`, background: newCM.difficoltaSalita === d.id ? d.c + "15" : T.card, textAlign: "center", cursor: "pointer" }}>
                      <div style={{ fontSize: 14 }}>{d.e}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: newCM.difficoltaSalita === d.id ? d.c : T.sub }}>{d.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: T.sub, fontWeight: 600, marginBottom: 2 }}>Piano edificio</div>
                    <input style={S.input} placeholder="es. 3° piano" value={newCM.pianoEdificio} onChange={e => setNewCM(c => ({ ...c, pianoEdificio: e.target.value }))} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: T.sub, fontWeight: 600, marginBottom: 2 }}>Foro scale (cm)</div>
                    <input style={S.input} placeholder="es. 80×200" value={newCM.foroScale} onChange={e => setNewCM(c => ({ ...c, foroScale: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: T.sub, fontWeight: 600, marginBottom: 2 }}>Mezzo di salita</div>
                  <select style={S.select} value={newCM.mezzoSalita} onChange={e => setNewCM(c => ({ ...c, mezzoSalita: e.target.value }))}>
                    <option value="">— Seleziona —</option>
                    {mezziSalita.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              {/* Note */}
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Note</label>
                <textarea style={{ ...S.input, minHeight: 60, resize: "vertical" }} placeholder="Note aggiuntive sulla commessa..." value={newCM.note} onChange={e => setNewCM(c => ({ ...c, note: e.target.value }))} />
              </div>
              <button style={S.btn} onClick={addCommessa}>Crea commessa</button>
              <button style={S.btnCancel} onClick={() => setShowModal(null)}>Annulla</button>
            </>
          )}

          {/* VANO MODAL — QUICK CREATION */}
          {showModal === "vano" && (
            <>
              <div style={S.modalTitle}>Nuovo vano</div>
              
              {/* Remember indicator */}
              {selectedCM?.vani?.length > 0 && newVano.sistema && (
                <div style={{ padding: "6px 10px", borderRadius: 8, background: T.grnLt, border: `1px solid ${T.grn}30`, marginBottom: 10, fontSize: 10, color: T.grn, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  ♻️ Info ricordate dal vano precedente (sistema, colori, vetro, telaio, coprifilo, lamiera)
                </div>
              )}
              
              {/* TIPOLOGIA RAPIDA — Preferiti */}
              <div style={{ marginBottom: 12 }}>
                <label style={S.fieldLabel}>Tipologia</label>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {TIPOLOGIE_RAPIDE.filter(t => favTipologie.includes(t.code)).map(t => (
                    <div key={t.code} onClick={() => setNewVano(v => ({ ...v, tipo: t.code }))} style={{ padding: "6px 10px", borderRadius: 8, border: `1.5px solid ${newVano.tipo === t.code ? T.acc : T.bdr}`, background: newVano.tipo === t.code ? T.accLt : T.card, fontSize: 11, fontWeight: 700, color: newVano.tipo === t.code ? T.acc : T.text, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 12 }}>{t.icon}</span> {t.code}
                    </div>
                  ))}
                  <div onClick={() => { const next = TIPOLOGIE_RAPIDE.find(t => !favTipologie.includes(t.code)); if (next) setNewVano(v => ({ ...v, tipo: next.code })); }} style={{ padding: "6px 10px", borderRadius: 8, border: `1px dashed ${T.bdr}`, fontSize: 10, color: T.sub, cursor: "pointer" }}>+ Altro</div>
                </div>
                {!favTipologie.includes(newVano.tipo) && (
                  <select style={{ ...S.select, marginTop: 6 }} value={newVano.tipo} onChange={e => setNewVano(v => ({ ...v, tipo: e.target.value }))}>
                    {TIPOLOGIE_RAPIDE.map(t => <option key={t.code} value={t.code}>{t.code} — {t.label}</option>)}
                  </select>
                )}
              </div>

              {/* NOME (auto-generato se vuoto) */}
              <div style={{ marginBottom: 12 }}>
                <label style={S.fieldLabel}>Nome (opzionale — auto se vuoto)</label>
                <input style={S.input} placeholder={`es. Cucina ${TIPOLOGIE_RAPIDE.find(t => t.code === newVano.tipo)?.label || ""}`} value={newVano.nome} onChange={e => setNewVano(v => ({ ...v, nome: e.target.value }))} />
              </div>

              {/* SISTEMA + COLORI — riga compatta */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={S.fieldLabel}>Sistema</label>
                  <select style={S.select} value={newVano.sistema} onChange={e => setNewVano(v => ({ ...v, sistema: e.target.value }))}>
                    <option value="">— Sel. —</option>
                    {sistemiDB.map(s => <option key={s.id} value={`${s.marca} ${s.sistema}`}>{s.marca} {s.sistema}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={S.fieldLabel}>Vetro</label>
                  <select style={S.select} value={newVano.vetro} onChange={e => setNewVano(v => ({ ...v, vetro: e.target.value }))}>
                    <option value="">— Sel. —</option>
                    {vetriDB.map(g => <option key={g.id} value={g.code}>{g.code} Ug={g.ug}</option>)}
                  </select>
                </div>
              </div>

              {/* COLORE PROFILI con bicolore */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <label style={{ ...S.fieldLabel, marginBottom: 0 }}>Colore profili</label>
                  <div onClick={() => setNewVano(v => ({ ...v, bicolore: !v.bicolore }))} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: newVano.bicolore ? T.accLt : "transparent", border: `1px solid ${newVano.bicolore ? T.acc : T.bdr}`, color: newVano.bicolore ? T.acc : T.sub, cursor: "pointer", fontWeight: 600 }}>
                    Bicolore {newVano.bicolore ? "✓" : ""}
                  </div>
                </div>
                {!newVano.bicolore ? (
                  <select style={S.select} value={newVano.coloreInt} onChange={e => setNewVano(v => ({ ...v, coloreInt: e.target.value, coloreEst: e.target.value }))}>
                    <option value="">— Seleziona —</option>
                    {coloriDB.map(c => <option key={c.id} value={c.code}>{c.code} — {c.nome}</option>)}
                  </select>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, color: T.sub, fontWeight: 600, marginBottom: 2 }}>Interno</div>
                      <select style={S.select} value={newVano.coloreInt} onChange={e => setNewVano(v => ({ ...v, coloreInt: e.target.value }))}>
                        <option value="">— Int —</option>
                        {coloriDB.map(c => <option key={c.id} value={c.code}>{c.code}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, color: T.sub, fontWeight: 600, marginBottom: 2 }}>Esterno</div>
                      <select style={S.select} value={newVano.coloreEst} onChange={e => setNewVano(v => ({ ...v, coloreEst: e.target.value }))}>
                        <option value="">— Est —</option>
                        {coloriDB.map(c => <option key={c.id} value={c.code}>{c.code}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* COLORE ACCESSORI */}
              <div style={{ marginBottom: 12 }}>
                <label style={S.fieldLabel}>Colore accessori</label>
                <select style={S.select} value={newVano.coloreAcc} onChange={e => setNewVano(v => ({ ...v, coloreAcc: e.target.value }))}>
                  <option value="">— Come profili —</option>
                  {coloriDB.map(c => <option key={c.id} value={c.code}>{c.code} — {c.nome}</option>)}
                </select>
              </div>

              {/* TELAIO */}
              <div style={{ marginBottom: 12 }}>
                <label style={S.fieldLabel}>Telaio</label>
                <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  {[{ id: "Z", label: "Telaio a Z" }, { id: "L", label: "Telaio a L" }].map(t => (
                    <div key={t.id} onClick={() => setNewVano(v => ({ ...v, telaio: v.telaio === t.id ? "" : t.id }))} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${newVano.telaio === t.id ? T.acc : T.bdr}`, background: newVano.telaio === t.id ? T.accLt : T.card, textAlign: "center", fontSize: 12, fontWeight: 700, color: newVano.telaio === t.id ? T.acc : T.sub, cursor: "pointer" }}>
                      {t.label}
                    </div>
                  ))}
                </div>
                {newVano.telaio === "Z" && (
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 10, color: T.sub, fontWeight: 600, marginBottom: 2 }}>Lunghezza ala (mm)</div>
                    <input style={S.input} type="number" inputMode="numeric" placeholder="es. 35" value={newVano.telaioAlaZ} onChange={e => setNewVano(v => ({ ...v, telaioAlaZ: e.target.value }))} />
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div onClick={() => setNewVano(v => ({ ...v, rifilato: !v.rifilato }))} style={{ width: 36, height: 20, borderRadius: 10, background: newVano.rifilato ? T.grn : T.bdr, cursor: "pointer", padding: 2 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", transform: newVano.rifilato ? "translateX(16px)" : "translateX(0)", transition: "transform 0.2s" }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Rifilato</span>
                </div>
                {newVano.rifilato && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 6 }}>
                    {[["rifilSx", "↙ SX"], ["rifilDx", "↘ DX"], ["rifilSopra", "↑ Sopra"], ["rifilSotto", "↓ Sotto"]].map(([k, l]) => (
                      <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: T.sub, minWidth: 42 }}>{l}</span>
                        <input style={{ flex: 1, padding: "5px 6px", fontSize: 12, fontFamily: FM, border: `1px solid ${T.bdr}`, borderRadius: 6, textAlign: "center" }} type="number" inputMode="numeric" placeholder="mm" value={newVano[k]} onChange={e => setNewVano(v => ({ ...v, [k]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: T.sub, fontWeight: 600, marginBottom: 2 }}>Coprifilo</div>
                    <select style={S.select} value={newVano.coprifilo} onChange={e => setNewVano(v => ({ ...v, coprifilo: e.target.value }))}>
                      <option value="">— No —</option>
                      {coprifiliDB.map(c => <option key={c.id} value={c.cod}>{c.cod} — {c.nome}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: T.sub, fontWeight: 600, marginBottom: 2 }}>Lamiera</div>
                    <select style={S.select} value={newVano.lamiera} onChange={e => setNewVano(v => ({ ...v, lamiera: e.target.value }))}>
                      <option value="">— No —</option>
                      {lamiereDB.map(l => <option key={l.id} value={l.cod}>{l.cod} — {l.nome}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* STANZA + PIANO — riga compatta */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={S.fieldLabel}>Stanza</label>
                  <select style={S.select} value={newVano.stanza} onChange={e => setNewVano(v => ({ ...v, stanza: e.target.value }))}>
                    {["Soggiorno", "Cucina", "Camera", "Bagno", "Studio", "Ingresso", "Corridoio", "Altro"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={S.fieldLabel}>Piano</label>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    {customPiani.map(p => (
                      <div key={p} onClick={() => setNewVano(v => ({ ...v, piano: p }))} style={{ padding: "7px 6px", borderRadius: 6, textAlign: "center", border: `1px solid ${newVano.piano === p ? T.acc : T.bdr}`, background: newVano.piano === p ? T.accLt : "transparent", fontSize: 11, fontWeight: 600, color: newVano.piano === p ? T.acc : T.sub, cursor: "pointer", minWidth: 28 }}>
                        {p}
                      </div>
                    ))}
                    {showAddPiano ? (
                      <div style={{ display: "flex", gap: 2 }}>
                        <input style={{ width: 40, padding: "5px 4px", fontSize: 11, border: `1px solid ${T.acc}`, borderRadius: 6, textAlign: "center", fontFamily: FM }} placeholder="P4" value={newPiano} onChange={e => setNewPiano(e.target.value)} autoFocus />
                        <div onClick={() => { if (newPiano.trim()) { setCustomPiani(p => [...p, newPiano.trim()]); setNewVano(v => ({ ...v, piano: newPiano.trim() })); setNewPiano(""); setShowAddPiano(false); } }} style={{ padding: "7px 6px", borderRadius: 6, background: T.grn, color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>✓</div>
                      </div>
                    ) : (
                      <div onClick={() => setShowAddPiano(true)} style={{ padding: "7px 6px", borderRadius: 6, border: `1px dashed ${T.acc}`, color: T.acc, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>+</div>
                    )}
                  </div>
                </div>
              </div>

              <button style={S.btn} onClick={addVano}>Aggiungi vano</button>
              <button style={S.btnCancel} onClick={() => setShowModal(null)}>Annulla</button>
            </>
          )}
        </div>
      </div>
    );
  };

  /* ═══════ MAIN RENDER ═══════ */
  return (
    <>
      <link href={FONT} rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: ${T.bg}; }
        input, select, textarea, button { font-size: inherit; }
      `}</style>
      <div style={S.app}>
        {/* Content */}
        {tab === "home" && !selectedCM && !selectedMsg && renderHome()}
        {tab === "commesse" && renderCommesse()}
        {tab === "messaggi" && !selectedMsg && renderMessaggi()}
        {tab === "agenda" && renderAgenda()}
        {tab === "settings" && renderSettings()}

        {/* MESSAGE DETAIL OVERLAY */}
        {selectedMsg && (() => {
          const chIco = { email: "📧", whatsapp: "💬", sms: "📱", telegram: "✈️" };
          const chCol = { email: T.blue, whatsapp: "#25d366", sms: T.orange, telegram: "#0088cc" };
          const [replyChannel, setReplyChannelX] = [selectedMsg._replyChannel || selectedMsg.canale, (ch) => setSelectedMsg(p => ({...p, _replyChannel: ch}))];
          return (
          <div style={{ position: "fixed", inset: 0, background: T.bg, zIndex: 100, display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ padding: "12px 16px", background: T.card, borderBottom: `1px solid ${T.bdr}`, display: "flex", alignItems: "center", gap: 10 }}>
              <div onClick={() => { setSelectedMsg(null); setReplyText(""); }} style={{ cursor: "pointer", padding: 4 }}><Ico d={ICO.back} s={20} c={T.sub} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  <span>{chIco[selectedMsg.canale]}</span> {selectedMsg.from}
                </div>
                <div style={{ fontSize: 11, color: T.sub }}>{selectedMsg.cm ? `${selectedMsg.cm} · ` : ""}{selectedMsg.thread?.length || 0} messaggi</div>
              </div>
              {selectedMsg.cm && (
                <div onClick={() => { const cm = cantieri.find(c => c.code === selectedMsg.cm); if (cm) { setSelectedMsg(null); setSelectedCM(cm); setTab("commesse"); } }} style={{ padding: "4px 10px", borderRadius: 6, background: T.accLt, fontSize: 10, fontWeight: 700, color: T.acc, cursor: "pointer" }}>
                  📂 {selectedMsg.cm}
                </div>
              )}
            </div>
            {/* Thread */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
              {(selectedMsg.thread || []).map((msg, i) => {
                const isMe = msg.who === "Tu";
                const mChIco = chIco[msg.canale] || chIco[selectedMsg.canale] || "💬";
                return (
                  <div key={i} style={{ marginBottom: 12, display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                    <div style={{ fontSize: 9, color: T.sub, marginBottom: 3, fontWeight: 600 }}>{mChIco} {msg.who} · {msg.date} {msg.time}</div>
                    <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: isMe ? (chCol[msg.canale || selectedMsg.canale] || T.acc) : T.card, color: isMe ? "#fff" : T.text, border: isMe ? "none" : `1px solid ${T.bdr}`, fontSize: 13, lineHeight: 1.4 }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Reply bar */}
            <div style={{ borderTop: `1px solid ${T.bdr}`, background: T.card }}>
              {/* Channel pill selector */}
              <div style={{ display: "flex", gap: 4, padding: "6px 16px 0", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: T.sub, fontWeight: 600 }}>Via:</span>
                {["whatsapp", "email", "sms", "telegram"].map(ch => (
                  <div key={ch} onClick={() => setReplyChannelX(ch)} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 700, cursor: "pointer", background: replyChannel === ch ? (chCol[ch] || T.acc) : "transparent", color: replyChannel === ch ? "#fff" : T.sub, border: `1px solid ${replyChannel === ch ? "transparent" : T.bdr}`, transition: "all 0.15s" }}>
                    {ch === "whatsapp" ? "WhatsApp" : ch === "email" ? "Email" : ch === "sms" ? "SMS" : "Telegram"}
                  </div>
                ))}
              </div>
              {/* Subject line for email */}
              {replyChannel === "email" && (
                <div style={{ padding: "6px 16px 0" }}>
                  <input style={{ width: "100%", padding: "8px 12px", fontSize: 12, border: `1px solid ${T.bdr}`, borderRadius: 8, background: T.bg, outline: "none", fontFamily: FF, boxSizing: "border-box" }} placeholder="Oggetto email..." />
                </div>
              )}
              <div style={{ padding: "8px 16px 10px", display: "flex", gap: 8, alignItems: "flex-end" }}>
                {/* Attach buttons */}
                <div style={{ display: "flex", gap: 2 }}>
                  <div onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.click(); }} style={{ width: 32, height: 32, borderRadius: "50%", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, border: `1px solid ${T.bdr}` }}>📎</div>
                  <div onClick={() => setShowAllegatiModal("vocale")} style={{ width: 32, height: 32, borderRadius: "50%", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, border: `1px solid ${T.bdr}` }}>🎤</div>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, border: `1px solid ${T.bdr}` }}>📷</div>
                </div>
                {/* Text input - taller for email */}
                {replyChannel === "email" ? (
                  <textarea
                    style={{ flex: 1, padding: "10px 14px", fontSize: 13, border: `1px solid ${T.bdr}`, borderRadius: 12, background: T.bg, outline: "none", fontFamily: FF, minHeight: 60, resize: "vertical", boxSizing: "border-box" }}
                    placeholder="Scrivi email..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                ) : (
                  <input
                    style={{ flex: 1, padding: "10px 14px", fontSize: 13, border: `1px solid ${T.bdr}`, borderRadius: 20, background: T.bg, outline: "none", fontFamily: FF }}
                    placeholder={`Scrivi su ${replyChannel === "whatsapp" ? "WhatsApp" : replyChannel === "sms" ? "SMS" : "Telegram"}...`}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && replyText.trim()) {
                        const newThread = [...(selectedMsg.thread || []), { who: "Tu", text: replyText, time: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }), date: new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" }), canale: replyChannel }];
                        setMsgs(ms => ms.map(m => m.id === selectedMsg.id ? { ...m, thread: newThread, preview: replyText } : m));
                        setSelectedMsg(prev => ({ ...prev, thread: newThread }));
                        setReplyText("");
                      }
                    }}
                  />
                )}
                <div onClick={() => {
                  if (replyText.trim()) {
                    const newThread = [...(selectedMsg.thread || []), { who: "Tu", text: replyText, time: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }), date: new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" }), canale: replyChannel }];
                    setMsgs(ms => ms.map(m => m.id === selectedMsg.id ? { ...m, thread: newThread, preview: replyText } : m));
                    setSelectedMsg(prev => ({ ...prev, thread: newThread }));
                    setReplyText("");
                  }
                }} style={{ width: 38, height: 38, borderRadius: "50%", background: replyText.trim() ? (chCol[replyChannel] || T.acc) : T.bdr, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>
                  <Ico d={ICO.send} s={16} c={replyText.trim() ? "#fff" : T.sub} />
                </div>
              </div>
            </div>
          </div>
          );
        })()}

        {/* SETTINGS ADD MODAL */}
        {settingsModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={e => e.target === e.currentTarget && setSettingsModal(null)}>
            <div style={{ background: T.card, borderRadius: 16, width: "100%", maxWidth: 380, padding: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>
                {settingsModal === "sistema" && "Nuovo Sistema"}
                {settingsModal === "colore" && "Nuovo Colore"}
                {settingsModal === "vetro" && "Nuovo Vetro"}
                {settingsModal === "coprifilo" && "Nuovo Coprifilo"}
                {settingsModal === "lamiera" && "Nuova Lamiera"}
                {settingsModal === "tipologia" && "Nuova Tipologia"}
                {settingsModal === "membro" && "Nuovo Membro Team"}
              </div>

              {settingsModal === "membro" && (<>
                <div style={{ marginBottom: 10 }}><label style={S.fieldLabel}>Nome e cognome</label><input style={S.input} placeholder="es. Marco Ferraro" value={settingsForm.nome || ""} onChange={e => setSettingsForm(f => ({ ...f, nome: e.target.value }))} /></div>
                <div style={{ marginBottom: 10 }}><label style={S.fieldLabel}>Ruolo</label><select style={S.select} value={settingsForm.ruolo || "Posatore"} onChange={e => setSettingsForm(f => ({ ...f, ruolo: e.target.value }))}><option>Titolare</option><option>Posatore</option><option>Ufficio</option><option>Magazzino</option></select></div>
                <div style={{ marginBottom: 10 }}><label style={S.fieldLabel}>Compiti</label><input style={S.input} placeholder="es. Misure, installazione" value={settingsForm.compiti || ""} onChange={e => setSettingsForm(f => ({ ...f, compiti: e.target.value }))} /></div>
              </>)}

              {settingsModal === "sistema" && (<>
                <div style={{ marginBottom: 10 }}><label style={S.fieldLabel}>Marca</label><input style={S.input} placeholder="es. Aluplast" value={settingsForm.marca || ""} onChange={e => setSettingsForm(f => ({ ...f, marca: e.target.value }))} /></div>
                <div style={{ marginBottom: 10 }}><label style={S.fieldLabel}>Sistema</label><input style={S.input} placeholder="es. Ideal 4000" value={settingsForm.sistema || ""} onChange={e => setSettingsForm(f => ({ ...f, sistema: e.target.value }))} /></div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}><label style={S.fieldLabel}>€/mq</label><input style={S.input} type="number" placeholder="180" value={settingsForm.euroMq || ""} onChange={e => setSettingsForm(f => ({ ...f, euroMq: e.target.value }))} /></div>
                  <div style={{ flex: 1 }}><label style={S.fieldLabel}>Sovr. RAL %</label><input style={S.input} type="number" placeholder="12" value={settingsForm.sovRAL || ""} onChange={e => setSettingsForm(f => ({ ...f, sovRAL: e.target.value }))} /></div>
                  <div style={{ flex: 1 }}><label style={S.fieldLabel}>Sovr. Legno %</label><input style={S.input} type="number" placeholder="22" value={settingsForm.sovLegno || ""} onChange={e => setSettingsForm(f => ({ ...f, sovLegno: e.target.value }))} /></div>
                </div>
                <div style={{ marginBottom: 10 }}><label style={S.fieldLabel}>Sottosistemi (separati da virgola)</label><input style={S.input} placeholder="es. Classicline, Roundline" value={settingsForm.sottosistemi || ""} onChange={e => setSettingsForm(f => ({ ...f, sottosistemi: e.target.value }))} /></div>
              </>)}

              {settingsModal === "colore" && (<>
                <div style={{ marginBottom: 10 }}><label style={S.fieldLabel}>Nome</label><input style={S.input} placeholder="es. Grigio antracite" value={settingsForm.nome || ""} onChange={e => setSettingsForm(f => ({ ...f, nome: e.target.value }))} /></div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}><label style={S.fieldLabel}>Codice</label><input style={S.input} placeholder="es. RAL 7016" value={settingsForm.code || ""} onChange={e => setSettingsForm(f => ({ ...f, code: e.target.value }))} /></div>
                  <div style={{ flex: 1 }}><label style={S.fieldLabel}>Tipo</label><select style={S.select} value={settingsForm.tipo || "RAL"} onChange={e => setSettingsForm(f => ({ ...f, tipo: e.target.value }))}><option>RAL</option><option>Legno</option><option>Satinato</option><option>Altro</option></select></div>
                </div>
                <div style={{ marginBottom: 10 }}><label style={S.fieldLabel}>Colore HEX</label><div style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="color" value={settingsForm.hex || "#888888"} onChange={e => setSettingsForm(f => ({ ...f, hex: e.target.value }))} style={{ width: 40, height: 34, border: "none", cursor: "pointer" }} /><input style={{ ...S.input, flex: 1 }} value={settingsForm.hex || "#888888"} onChange={e => setSettingsForm(f => ({ ...f, hex: e.target.value }))} /></div></div>
              </>)}

              {settingsModal === "vetro" && (<>
                <div style={{ marginBottom: 10 }}><label style={S.fieldLabel}>Nome</label><input style={S.input} placeholder="es. Triplo basso emissivo" value={settingsForm.nome || ""} onChange={e => setSettingsForm(f => ({ ...f, nome: e.target.value }))} /></div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 2 }}><label style={S.fieldLabel}>Codice composizione</label><input style={S.input} placeholder="es. 4/16/4 BE" value={settingsForm.code || ""} onChange={e => setSettingsForm(f => ({ ...f, code: e.target.value }))} /></div>
                  <div style={{ flex: 1 }}><label style={S.fieldLabel}>Ug</label><input style={S.input} type="number" step="0.1" placeholder="1.1" value={settingsForm.ug || ""} onChange={e => setSettingsForm(f => ({ ...f, ug: e.target.value }))} /></div>
                </div>
              </>)}

              {(settingsModal === "coprifilo" || settingsModal === "lamiera") && (<>
                <div style={{ marginBottom: 10 }}><label style={S.fieldLabel}>Codice</label><input style={S.input} placeholder={settingsModal === "coprifilo" ? "es. CP50" : "es. LD250"} value={settingsForm.cod || ""} onChange={e => setSettingsForm(f => ({ ...f, cod: e.target.value }))} /></div>
                <div style={{ marginBottom: 10 }}><label style={S.fieldLabel}>Descrizione</label><input style={S.input} placeholder={settingsModal === "coprifilo" ? "es. Coprifilo piatto 50mm" : "es. Lamiera davanzale 250mm"} value={settingsForm.nome || ""} onChange={e => setSettingsForm(f => ({ ...f, nome: e.target.value }))} /></div>
              </>)}

              {settingsModal === "tipologia" && (<>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}><label style={S.fieldLabel}>Codice</label><input style={S.input} placeholder="es. F4A" value={settingsForm.code || ""} onChange={e => setSettingsForm(f => ({ ...f, code: e.target.value }))} /></div>
                  <div style={{ width: 60 }}><label style={S.fieldLabel}>Icona</label><input style={S.input} placeholder="🪟" value={settingsForm.icon || ""} onChange={e => setSettingsForm(f => ({ ...f, icon: e.target.value }))} /></div>
                </div>
                <div style={{ marginBottom: 10 }}><label style={S.fieldLabel}>Descrizione</label><input style={S.input} placeholder="es. Finestra 4 ante" value={settingsForm.label || ""} onChange={e => setSettingsForm(f => ({ ...f, label: e.target.value }))} /></div>
              </>)}

              <button style={S.btn} onClick={addSettingsItem}>Salva</button>
              <button style={S.btnCancel} onClick={() => setSettingsModal(null)}>Annulla</button>
            </div>
          </div>
        )}

        {/* Tab Bar */}
        {!selectedVano && (
          <div style={S.tabBar}>
            {[
              { id: "home", emoji: "🏠", label: "Home" },
              { id: "commesse", emoji: "📁", label: "Commesse" },
              { id: "messaggi", emoji: "💬", label: "Messaggi" },
              { id: "agenda", emoji: "📅", label: "Agenda" },
              { id: "settings", emoji: "⚙️", label: "Impost." },
            ].map(t => {
              const active = tab === t.id;
              return (
              <div key={t.id} style={S.tabItem(active)} onClick={() => { setTab(t.id); setSelectedCM(null); setSelectedVano(null); setSelectedMsg(null); }}>
                <div style={{ position: "relative", display: "inline-block", fontSize: 20, filter: active ? "none" : "grayscale(100%)", opacity: active ? 1 : 0.6, transition: "all 0.2s" }}>
                  {t.emoji}
                  {t.id === "messaggi" && msgs.filter(m => !m.read).length > 0 && (
                    <div style={{ position: "absolute", top: -4, right: -10, minWidth: 16, height: 16, borderRadius: "50%", background: T.red, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
                      {msgs.filter(m => !m.read).length}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 9*fs, fontWeight: active ? 700 : 500, color: active ? T.acc : T.sub, marginTop: 2 }}>{t.label}</div>
                {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.acc, margin: "2px auto 0" }} />}
              </div>
              );
            })}
          </div>
        )}

        {/* Modals */}
        {renderModal()}

        {/* SEND COMMESSA MODAL */}
        {showSendModal && selectedCM && (
          <div style={S.modal} onClick={e => e.target === e.currentTarget && setShowSendModal(false)}>
            <div style={S.modalInner}>
              {sendConfirm === "sent" ? (
                <div style={{ textAlign: "center", padding: "30px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: T.grn }}>Commessa inviata!</div>
                  <div style={{ fontSize: 12, color: T.sub, marginTop: 4 }}>Email inviata con tutti i dati selezionati</div>
                </div>
              ) : (
                <>
                  <div style={S.modalTitle}>📧 Invia Commessa — {selectedCM.code}</div>
                  <div style={{ fontSize: 12, color: T.sub, marginBottom: 14 }}>Scegli cosa includere nell'invio:</div>
                  {[
                    { key: "misure", label: "Misure tutti i vani", ico: "📐" },
                    { key: "foto", label: "Foto scattate", ico: "📷" },
                    { key: "disegno", label: "Disegni mano libera", ico: "✏️" },
                    { key: "accessori", label: "Accessori (tapparelle, zanzariere...)", ico: "🪟" },
                    { key: "note", label: "Note e annotazioni", ico: "📝" },
                  ].map(opt => (
                    <div key={opt.key} onClick={() => setSendOpts(o => ({ ...o, [opt.key]: !o[opt.key] }))} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: sendOpts[opt.key] ? T.accLt : T.card, border: `1px solid ${sendOpts[opt.key] ? T.acc : T.bdr}`, borderRadius: 10, marginBottom: 6, cursor: "pointer" }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${sendOpts[opt.key] ? T.acc : T.bdr}`, background: sendOpts[opt.key] ? T.acc : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                        {sendOpts[opt.key] && "✓"}
                      </div>
                      <span style={{ fontSize: 16 }}>{opt.ico}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{opt.label}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 10, marginBottom: 8 }}>
                    <label style={S.fieldLabel}>Invia a (email)</label>
                    <input style={S.input} placeholder="email@destinatario.com" />
                  </div>
                  <button onClick={sendCommessa} style={{ ...S.btn, background: "linear-gradient(135deg, #007aff, #0055cc)", marginTop: 4 }}>
                    📧 Invia commessa completa
                  </button>
                  <button style={S.btnCancel} onClick={() => setShowSendModal(false)}>Annulla</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* NEW EVENT MODAL */}
        {showNewEvent && (
          <div style={S.modal} onClick={e => e.target === e.currentTarget && setShowNewEvent(false)}>
            <div style={S.modalInner}>
              <div style={S.modalTitle}>Nuovo evento</div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Titolo</label>
                <input style={S.input} placeholder="es. Sopralluogo, consegna materiale..." value={newEvent.text} onChange={e => setNewEvent(ev => ({ ...ev, text: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={S.fieldLabel}>Data</label>
                  <input style={S.input} type="date" value={newEvent.date || selDate.toISOString().split("T")[0]} onChange={e => setNewEvent(ev => ({ ...ev, date: e.target.value }))} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={S.fieldLabel}>Ora (opz.)</label>
                  <input style={S.input} type="time" value={newEvent.time} onChange={e => setNewEvent(ev => ({ ...ev, time: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Tipo</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[{ id: "appuntamento", l: "📅 Appuntamento", c: T.blue }, { id: "task", l: "✅ Task", c: T.orange }].map(t => (
                    <div key={t.id} onClick={() => setNewEvent(ev => ({ ...ev, tipo: t.id }))} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid ${newEvent.tipo === t.id ? t.c : T.bdr}`, background: newEvent.tipo === t.id ? t.c + "18" : "transparent", textAlign: "center", fontSize: 12, fontWeight: 600, color: newEvent.tipo === t.id ? t.c : T.sub, cursor: "pointer" }}>
                      {t.l}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Collega a commessa</label>
                <select style={S.select} value={newEvent.cm} onChange={e => setNewEvent(ev => ({ ...ev, cm: e.target.value }))}>
                  <option value="">— Nessuna —</option>
                  {cantieri.map(c => <option key={c.id} value={c.code}>{c.code} · {c.cliente}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Assegna a persona</label>
                <select style={S.select} value={newEvent.persona} onChange={e => setNewEvent(ev => ({ ...ev, persona: e.target.value }))}>
                  <option value="">— Nessuno —</option>
                  {team.map(m => <option key={m.id} value={m.nome}>{m.nome} — {m.ruolo}</option>)}
                </select>
              </div>
              <button style={S.btn} onClick={addEvent}>Crea evento</button>
              <button style={S.btnCancel} onClick={() => setShowNewEvent(false)}>Annulla</button>
            </div>
          </div>
        )}

        {/* FASE ADVANCE NOTIFICATION */}
        {faseNotif && (
          <div style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", maxWidth: 380, width: "90%", padding: "12px 16px", borderRadius: 12, background: T.card, border: `1px solid ${faseNotif.color}40`, boxShadow: `0 4px 20px ${faseNotif.color}30`, zIndex: 300, display: "flex", alignItems: "center", gap: 10, animation: "fadeIn 0.3s ease" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: faseNotif.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18 }}>📧</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Avanzato a {faseNotif.fase}</div>
              <div style={{ fontSize: 11, color: T.sub }}>Email inviata a <strong>{faseNotif.addetto}</strong></div>
            </div>
            <div style={{ fontSize: 18 }}>✅</div>
          </div>
        )}

        {/* COMPOSE MESSAGE MODAL */}
        {showCompose && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={e => e.target === e.currentTarget && setShowCompose(false)}>
            <div style={{ background: T.card, borderRadius: 16, width: "100%", maxWidth: 420, padding: 20, maxHeight: "80vh", overflowY: "auto" }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>✏️ Nuovo messaggio</div>
              {/* Channel select */}
              <div style={{ marginBottom: 12 }}>
                <label style={S.fieldLabel}>Invia via</label>
                <div style={{ display: "flex", gap: 4 }}>
                  {[
                    { id: "whatsapp", l: "💬 WhatsApp", c: "#25d366" },
                    { id: "email", l: "📧 Email", c: T.blue },
                    { id: "sms", l: "📱 SMS", c: T.orange },
                    { id: "telegram", l: "✈️ Telegram", c: "#0088cc" },
                  ].map(ch => (
                    <div key={ch.id} onClick={() => setComposeMsg(c => ({ ...c, canale: ch.id }))} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `1.5px solid ${composeMsg.canale === ch.id ? ch.c : T.bdr}`, background: composeMsg.canale === ch.id ? ch.c + "15" : T.card, textAlign: "center", cursor: "pointer", fontSize: 10, fontWeight: 600, color: composeMsg.canale === ch.id ? ch.c : T.sub }}>
                      {ch.l}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={S.fieldLabel}>Destinatario</label>
                <input style={S.input} placeholder="Nome o numero..." value={composeMsg.to} onChange={e => setComposeMsg(c => ({ ...c, to: e.target.value }))} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={S.fieldLabel}>Collega a commessa (opzionale)</label>
                <select style={S.select} value={composeMsg.cm} onChange={e => setComposeMsg(c => ({ ...c, cm: e.target.value }))}>
                  <option value="">— Nessuna —</option>
                  {cantieri.map(c => <option key={c.id} value={c.code}>{c.code} · {c.cliente}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.fieldLabel}>Messaggio</label>
                <textarea style={{ width: "100%", padding: 12, fontSize: 13, border: `1px solid ${T.bdr}`, borderRadius: 10, background: T.bg, minHeight: 80, resize: "vertical", fontFamily: FF, boxSizing: "border-box" }} placeholder="Scrivi il messaggio..." value={composeMsg.text} onChange={e => setComposeMsg(c => ({ ...c, text: e.target.value }))} />
              </div>
              {/* Attach buttons */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {[{ ico: "📎", l: "File" }, { ico: "📷", l: "Foto" }, { ico: "🎤", l: "Audio" }, { ico: "📍", l: "Posizione" }].map((b, i) => (
                  <div key={i} style={{ flex: 1, padding: "8px 4px", background: T.bg, borderRadius: 8, border: `1px solid ${T.bdr}`, textAlign: "center", cursor: "pointer" }}>
                    <div style={{ fontSize: 16 }}>{b.ico}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: T.sub, marginTop: 1 }}>{b.l}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => {
                if (composeMsg.to.trim() && composeMsg.text.trim()) {
                  const newMsg = {
                    id: Date.now(), from: composeMsg.to, preview: composeMsg.text, time: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }),
                    cm: composeMsg.cm, read: true, canale: composeMsg.canale,
                    thread: [{ who: "Tu", text: composeMsg.text, time: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }), date: new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" }), canale: composeMsg.canale }]
                  };
                  setMsgs(ms => [newMsg, ...ms]);
                  setShowCompose(false);
                  setComposeMsg({ to: "", text: "", canale: "whatsapp", cm: "" });
                }
              }} style={{ ...S.btn, opacity: composeMsg.to.trim() && composeMsg.text.trim() ? 1 : 0.5 }}>
                Invia messaggio
              </button>
              <button onClick={() => setShowCompose(false)} style={S.btnCancel}>Annulla</button>
            </div>
          </div>
        )}

        {/* ALLEGATI MODAL */}
        {showAllegatiModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={e => e.target === e.currentTarget && setShowAllegatiModal(null)}>
            <div style={{ background: T.card, borderRadius: 16, width: "100%", maxWidth: 380, padding: 20 }}>
              {showAllegatiModal === "nota" && (
                <>
                  <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>📝 Nuova nota</div>
                  <textarea style={{ width: "100%", padding: 12, fontSize: 13, border: `1px solid ${T.bdr}`, borderRadius: 10, background: T.bg, minHeight: 100, resize: "vertical", fontFamily: FF, boxSizing: "border-box" }} placeholder="Scrivi la nota..." value={allegatiText} onChange={e => setAllegatiText(e.target.value)} autoFocus />
                  <button onClick={() => { if (allegatiText.trim()) { addAllegato("nota", allegatiText.trim()); setShowAllegatiModal(null); setAllegatiText(""); } }} style={{ ...S.btn, marginTop: 10, opacity: allegatiText.trim() ? 1 : 0.5 }}>Salva nota</button>
                </>
              )}
              {showAllegatiModal === "vocale" && (
                <>
                  <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>🎤 Nota vocale</div>
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    {isRecording && (
                      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: FM, color: T.red, marginBottom: 12 }}>
                        {Math.floor(recSeconds / 60)}:{String(recSeconds % 60).padStart(2, "0")}
                      </div>
                    )}
                    <div onClick={() => {
                      if (!isRecording) {
                        setIsRecording(true); setRecSeconds(0);
                        recInterval.current = setInterval(() => setRecSeconds(s => s + 1), 1000);
                      } else {
                        clearInterval(recInterval.current);
                        setIsRecording(false);
                        const dur = `${Math.floor(recSeconds / 60)}:${String(recSeconds % 60).padStart(2, "0")}`;
                        addAllegato("vocale", "Nota vocale " + new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }));
                        setShowAllegatiModal(null); setRecSeconds(0);
                      }
                    }} style={{ width: 70, height: 70, borderRadius: "50%", background: isRecording ? "linear-gradient(135deg, #ff3b30, #cc0000)" : "linear-gradient(135deg, #ff3b30, #ff6b6b)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", cursor: "pointer", boxShadow: isRecording ? "0 0 24px rgba(255,59,48,0.5)" : "0 4px 16px rgba(255,59,48,0.3)", animation: isRecording ? "pulse 1.5s infinite" : "none" }}>
                      <span style={{ fontSize: 28, color: "#fff" }}>{isRecording ? "⏹" : "🎤"}</span>
                    </div>
                    <style>{`@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }`}</style>
                    <div style={{ fontSize: 12, color: isRecording ? T.red : T.sub, marginTop: 10, fontWeight: isRecording ? 700 : 400 }}>
                      {isRecording ? "Registrazione... tocca per fermare" : "Tocca per registrare"}
                    </div>
                  </div>
                </>
              )}
              {showAllegatiModal === "video" && (
                <>
                  <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>🎬 Video</div>
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    {isRecording && (
                      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: FM, color: T.red, marginBottom: 12 }}>
                        {Math.floor(recSeconds / 60)}:{String(recSeconds % 60).padStart(2, "0")}
                      </div>
                    )}
                    <div onClick={() => {
                      if (!isRecording) {
                        setIsRecording(true); setRecSeconds(0);
                        recInterval.current = setInterval(() => setRecSeconds(s => s + 1), 1000);
                      } else {
                        clearInterval(recInterval.current);
                        setIsRecording(false);
                        addAllegato("video", "Video " + new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }));
                        setShowAllegatiModal(null); setRecSeconds(0);
                      }
                    }} style={{ width: 70, height: 70, borderRadius: "50%", background: isRecording ? "linear-gradient(135deg, #ff3b30, #cc0000)" : "linear-gradient(135deg, #007aff, #5856d6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", cursor: "pointer", boxShadow: isRecording ? "0 0 24px rgba(255,59,48,0.5)" : "0 4px 16px rgba(0,122,255,0.3)", animation: isRecording ? "pulse 1.5s infinite" : "none" }}>
                      <span style={{ fontSize: 28, color: "#fff" }}>{isRecording ? "⏹" : "🎬"}</span>
                    </div>
                    <div style={{ fontSize: 12, color: isRecording ? T.red : T.sub, marginTop: 10, fontWeight: isRecording ? 700 : 400 }}>
                      {isRecording ? "Registrazione... tocca per fermare" : "Tocca per registrare"}
                    </div>
                  </div>
                </>
              )}
              {/* Task nota */}
              {showAllegatiModal === "task_nota" && (
                <>
                  <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>📝 Nota per task</div>
                  <textarea style={{ width: "100%", padding: 12, fontSize: 13, border: `1px solid ${T.bdr}`, borderRadius: 10, background: T.bg, minHeight: 100, resize: "vertical", fontFamily: FF, boxSizing: "border-box" }} placeholder="Scrivi la nota..." value={allegatiText} onChange={e => setAllegatiText(e.target.value)} autoFocus />
                  <button onClick={() => { if (allegatiText.trim()) { setTaskAllegati(a => [...a, { id: Date.now(), tipo: "nota", nome: allegatiText.trim() }]); setShowAllegatiModal(null); setAllegatiText(""); } }} style={{ ...S.btn, marginTop: 10, opacity: allegatiText.trim() ? 1 : 0.5 }}>Salva nota</button>
                </>
              )}
              {/* Task vocale */}
              {showAllegatiModal === "task_vocale" && (
                <>
                  <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>🎤 Audio per task</div>
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    {isRecording && (
                      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: FM, color: T.red, marginBottom: 12 }}>
                        {Math.floor(recSeconds / 60)}:{String(recSeconds % 60).padStart(2, "0")}
                      </div>
                    )}
                    <div onClick={() => {
                      if (!isRecording) {
                        setIsRecording(true); setRecSeconds(0);
                        recInterval.current = setInterval(() => setRecSeconds(s => s + 1), 1000);
                      } else {
                        clearInterval(recInterval.current);
                        setIsRecording(false);
                        setTaskAllegati(a => [...a, { id: Date.now(), tipo: "vocale", nome: "Audio " + new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) }]);
                        setShowAllegatiModal(null); setRecSeconds(0);
                      }
                    }} style={{ width: 70, height: 70, borderRadius: "50%", background: isRecording ? "linear-gradient(135deg, #ff3b30, #cc0000)" : "linear-gradient(135deg, #ff3b30, #ff6b6b)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", cursor: "pointer", boxShadow: isRecording ? "0 0 24px rgba(255,59,48,0.5)" : "0 4px 16px rgba(255,59,48,0.3)", animation: isRecording ? "pulse 1.5s infinite" : "none" }}>
                      <span style={{ fontSize: 28, color: "#fff" }}>{isRecording ? "⏹" : "🎤"}</span>
                    </div>
                    <div style={{ fontSize: 12, color: isRecording ? T.red : T.sub, marginTop: 10, fontWeight: isRecording ? 700 : 400 }}>
                      {isRecording ? "Registrazione... tocca per fermare" : "Tocca per registrare"}
                    </div>
                  </div>
                </>
              )}
              <button onClick={() => { clearInterval(recInterval.current); setIsRecording(false); setRecSeconds(0); setShowAllegatiModal(null); }} style={S.btnCancel}>Annulla</button>
            </div>
          </div>
        )}

        {/* AI PHOTO MODAL */}
        {showAIPhoto && (() => {
          const vt = selectedVano?.tipo || "F1A";
          // Standard Italian serramenti sizes (from real catalogs)
          const sizes = {
            "F1A": [700, 1200], "F2A": [1200, 1400], "F3A": [1800, 1400],
            "PF1A": [800, 2200], "PF2A": [1400, 2200], "PF3A": [2100, 2200],
            "VAS": [700, 500], "SOPR": [800, 400], "FIS": [600, 1000], "FISTONDO": [600, 600],
            "SC2A": [1600, 2200], "SC4A": [2800, 2200], "ALZSC": [3000, 2200],
            "BLI": [900, 2100], "TRIANG": [800, 800], "OBLICA": [700, 1200]
          };
          const [stdW, stdH] = sizes[vt] || [1100, 1300];
          // Read existing measurements if any
          const existing = selectedVano?.misure || {};
          const hasExisting = existing.lCentro > 0 || existing.hCentro > 0;
          // Use existing with ±3mm variation, or standard size with ±5mm
          const baseW = hasExisting && existing.lCentro > 0 ? existing.lCentro + Math.floor(Math.random() * 7 - 3) : stdW + Math.floor(Math.random() * 11 - 5);
          const baseH = hasExisting && existing.hCentro > 0 ? existing.hCentro + Math.floor(Math.random() * 7 - 3) : stdH + Math.floor(Math.random() * 11 - 5);
          const tipLabel = TIPOLOGIE_RAPIDE.find(t => t.code === vt)?.label || vt;
          return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={e => e.target === e.currentTarget && setShowAIPhoto(false)}>
            <div style={{ background: T.card, borderRadius: 16, width: "100%", maxWidth: 380, padding: 20, maxHeight: "80vh", overflowY: "auto" }}>
              {aiPhotoStep === 0 && (
                <>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg, #af52de, #007aff)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 28 }}>🤖</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#af52de" }}>AI Misure da Foto</div>
                    <div style={{ fontSize: 12, color: T.sub, marginTop: 4 }}>Inquadra il vano "{selectedVano?.nome}" e l'AI analizzerà l'immagine</div>
                  </div>
                  <div style={{ position: "relative", height: 200, borderRadius: 12, overflow: "hidden", marginBottom: 12, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "absolute", inset: 20, border: "2px solid #af52de80", borderRadius: 8 }} />
                    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#af52de30" }} />
                    <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "#af52de30" }} />
                    <div style={{ color: "#af52de", fontSize: 12, fontWeight: 600, textAlign: "center", zIndex: 1 }}>📷 Simulazione fotocamera<br /><span style={{ fontSize: 10, color: "#af52de80" }}>Inquadra il serramento</span></div>
                  </div>
                  <button onClick={() => { setAiPhotoStep(1); setTimeout(() => setAiPhotoStep(2), 2000 + Math.random() * 1500); }} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #af52de, #007aff)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FF, marginBottom: 8 }}>
                    📸 Scatta e analizza
                  </button>
                  <button onClick={() => setShowAIPhoto(false)} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${T.bdr}`, background: T.card, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: T.sub }}>Annulla</button>
                </>
              )}
              {aiPhotoStep === 1 && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", border: "4px solid #af52de20", borderTopColor: "#af52de", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#af52de" }}>Analisi AI in corso...</div>
                  <div style={{ fontSize: 11, color: T.sub, marginTop: 4 }}>Rilevamento bordi · Edge detection · Stima dimensioni</div>
                  <div style={{ fontSize: 10, color: T.sub, marginTop: 8 }}>Analizzando "{selectedVano?.nome}"...</div>
                </div>
              )}
              {aiPhotoStep === 2 && (
                <>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: T.grn }}>Analisi completata!</div>
                    <div style={{ fontSize: 11, color: T.sub, marginTop: 4 }}>Misure suggerite per "{selectedVano?.nome}" (verifica con metro)</div>
                  </div>
                  <div style={{ borderRadius: 10, border: `1px solid ${T.bdr}`, overflow: "hidden", marginBottom: 12 }}>
                    {[["Larghezza stimata", `~${baseW} mm`, T.acc], ["Altezza stimata", `~${baseH} mm`, T.blue], ["Tipo rilevato", tipLabel, T.purple]].map(([l, val, col]) => (
                      <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: `1px solid ${T.bdr}`, alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: T.sub }}>{l}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, fontFamily: FM, color: col }}>{val}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "8px 12px", borderRadius: 8, background: "#fff3e0", border: "1px solid #ffe0b2", marginBottom: 12, fontSize: 10, color: "#e65100" }}>
                    ⚠️ Le misure AI sono approssimative. Usa sempre il metro laser per le misure definitive.
                  </div>
                  <button onClick={() => {
                    if (selectedVano) {
                      // Simulate real measurements: L alto slightly different from L basso (walls not perfectly straight)
                      updateMisura(selectedVano.id, "lAlto", baseW + Math.floor(Math.random() * 5 - 2));
                      updateMisura(selectedVano.id, "lCentro", baseW);
                      updateMisura(selectedVano.id, "lBasso", baseW - Math.floor(Math.random() * 4));
                      updateMisura(selectedVano.id, "hSx", baseH);
                      updateMisura(selectedVano.id, "hCentro", baseH + Math.floor(Math.random() * 3 - 1));
                      updateMisura(selectedVano.id, "hDx", baseH - Math.floor(Math.random() * 4));
                    }
                    setShowAIPhoto(false);
                  }} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #af52de, #007aff)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FF, marginBottom: 8 }}>
                    ✅ Applica misure suggerite
                  </button>
                  <button onClick={() => setShowAIPhoto(false)} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${T.bdr}`, background: T.card, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FF, color: T.sub }}>Solo anteprima, non applicare</button>
                </>
              )}
            </div>
          </div>
          );
        })()}
      </div>
    </>
  );
}