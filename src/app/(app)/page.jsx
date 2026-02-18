'use client';
import { useState, useRef, useCallback } from "react";

/* ══════════════════════ FONTS & THEMES ══════════════════════ */
const FONT="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap";

const THEMES={
  chiaro:{name:"Chiaro",emoji:"☀️",
    bg:"#f0f2f5",bg2:"#ffffff",card:"#ffffff",card2:"#f8f9fb",
    bdr:"#e2e5ea",bdrL:"#d0d4db",
    text:"#111827",sub:"#6b7280",sub2:"#9ca3af",
    acc:"#e67e22",accD:"#d35400",accLt:"rgba(230,126,34,0.08)",accBg:"rgba(230,126,34,0.12)",
    grn:"#059669",grnLt:"rgba(5,150,105,0.08)",
    red:"#dc2626",redLt:"rgba(220,38,38,0.06)",
    blue:"#2563eb",blueLt:"rgba(37,99,235,0.06)",
    purple:"#7c3aed",purpleLt:"rgba(124,58,237,0.06)",
    w08:"rgba(0,0,0,0.04)",w04:"rgba(0,0,0,0.02)",
    shadow:"0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)",
    shadowL:"0 4px 12px rgba(0,0,0,0.08)",
    grad:"linear-gradient(135deg,#e67e22,#d35400)"},
  dark:{name:"Scuro",emoji:"🌙",
    bg:"#111318",bg2:"#1a1d25",card:"#1e222c",card2:"#252a36",
    bdr:"#2a2f3c",bdrL:"#353b4a",
    text:"#f1f3f6",sub:"#8890a0",sub2:"#555d70",
    acc:"#f0a820",accD:"#d4910e",accLt:"rgba(240,168,32,0.10)",accBg:"rgba(240,168,32,0.15)",
    grn:"#34d399",grnLt:"rgba(52,211,153,0.10)",
    red:"#f87171",redLt:"rgba(248,113,113,0.08)",
    blue:"#60a5fa",blueLt:"rgba(96,165,250,0.08)",
    purple:"#a78bfa",purpleLt:"rgba(167,139,250,0.08)",
    w08:"rgba(255,255,255,0.06)",w04:"rgba(255,255,255,0.03)",
    shadow:"0 1px 3px rgba(0,0,0,0.3)",
    shadowL:"0 4px 12px rgba(0,0,0,0.4)",
    grad:"linear-gradient(135deg,#f0a820,#d4910e)"},
  ocean:{name:"Oceano",emoji:"🌊",
    bg:"#0c1929",bg2:"#132238",card:"#18304e",card2:"#1d3860",
    bdr:"#1e4070",bdrL:"#265090",
    text:"#e8f0ff",sub:"#7da0cc",sub2:"#4a6890",
    acc:"#38bdf8",accD:"#0ea5e9",accLt:"rgba(56,189,248,0.10)",accBg:"rgba(56,189,248,0.15)",
    grn:"#34d399",grnLt:"rgba(52,211,153,0.10)",
    red:"#fb7185",redLt:"rgba(251,113,133,0.08)",
    blue:"#60a5fa",blueLt:"rgba(96,165,250,0.08)",
    purple:"#a78bfa",purpleLt:"rgba(167,139,250,0.08)",
    w08:"rgba(255,255,255,0.06)",w04:"rgba(255,255,255,0.03)",
    shadow:"0 1px 3px rgba(0,0,0,0.3)",
    shadowL:"0 4px 12px rgba(0,0,0,0.4)",
    grad:"linear-gradient(135deg,#38bdf8,#0ea5e9)"},
};

/* ══════════════════════ ICONS ══════════════════════ */
const Ic=({d,s=20,c="#888",f="none",sw=1.8})=><svg width={s} height={s} viewBox="0 0 24 24" fill={f} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const P={back:"M15 19l-7-7 7-7",plus:"M12 4v16m8-8H4",check:"M5 13l4 4L19 7",chevR:"M9 5l7 7-7 7",close:"M6 18L18 6M6 6l12 12",phone:"M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",camera:"M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",ruler:"M6 2L2 6l12 12 4-4L6 2zm3 7l2 2",pencil:"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",trash:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",undo:"M3 10h10a5 5 0 010 10H9m-6-10l4-4m-4 4l4 4",ai:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",pdf:"M7 21h10a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z M14 4v5h5",send:"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",down:"M6 9l6 6 6-6",eye:"M15 12a3 3 0 11-6 0 3 3 0 016 0z M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7z",settings:"M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"};

/* ══════════════════════ DATE UTILS ══════════════════════ */
const OG=new Date();const GG=["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];const MM=["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];const MML=["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];const fmtD=d=>`${GG[d.getDay()]} ${d.getDate()} ${MM[d.getMonth()]}`;const sameD=(a,b)=>a.getDate()===b.getDate()&&a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear();

/* ══════════════════════ INIT DATA ══════════════════════ */
const INIT_COLORI=[{id:1,nome:"RAL 9010 Bianco",hex:"#f5f5f0",tipo:"ral"},{id:2,nome:"RAL 7016 Antracite",hex:"#383e42",tipo:"ral"},{id:3,nome:"RAL 9005 Nero",hex:"#0e0e10",tipo:"ral"},{id:4,nome:"RAL 8017 Marrone",hex:"#45322e",tipo:"ral"},{id:5,nome:"Noce",hex:"#7a5230",tipo:"legno"},{id:6,nome:"Rovere",hex:"#c8b89a",tipo:"legno"},{id:7,nome:"Douglas",hex:"#9e6b3a",tipo:"legno"}];
const INIT_FASI=[{id:"sopralluogo",label:"Sopralluogo",icon:"📍",color:"#2563eb"},{id:"preventivo",label:"Preventivo",icon:"📋",color:"#7c3aed"},{id:"conferma",label:"Conferma",icon:"✅",color:"#059669"},{id:"misure",label:"Misure",icon:"📐",color:"#e67e22"},{id:"ordini",label:"Ordini",icon:"📦",color:"#ec4899"},{id:"produzione",label:"Produzione",icon:"⚙️",color:"#f59e0b"},{id:"posa",label:"Posa",icon:"🔧",color:"#059669"},{id:"chiusura",label:"Chiusura",icon:"🏁",color:"#10b981"}];
const INIT_TEAM=[{id:"fabio",nome:"Fabio",ruolo:"Titolare",compiti:"Sopralluoghi, preventivi",av:"F",col:"#e67e22"},{id:"marco",nome:"Marco",ruolo:"Posatore",compiti:"Posa in opera",av:"M",col:"#2563eb"},{id:"luca",nome:"Luca",ruolo:"Misuratore",compiti:"Rilievo misure",av:"L",col:"#059669"},{id:"sara",nome:"Sara",ruolo:"Ufficio",compiti:"Ordini, documenti",av:"S",col:"#7c3aed"}];
const INIT_SISTEMI=[{id:1,marca:"Twinsistem",sistema:"CX650",prezzoMq:280,sovRal:35,sovLegno:55,coloriIds:[1,2,3,5]},{id:2,marca:"Schüco",sistema:"AWS 75",prezzoMq:350,sovRal:40,sovLegno:65,coloriIds:[1,2,3,6]},{id:3,marca:"Rehau",sistema:"Geneo",prezzoMq:310,sovRal:38,sovLegno:58,coloriIds:[1,2,4,7]}];

const mkP=(fase,fasi)=>{const p={};let f2=false;fasi.forEach(f=>{if(f.id===fase){f2=true;p[f.id]="curr";}else if(!f2)p[f.id]="done";else p[f.id]="todo";});return p;};
const aiSmF=c=>{const f={...c};const av=a=>a.length?Math.round(a.reduce((s,v)=>s+v,0)/a.length):0;const aL=[c.L1,c.L2,c.L3].filter(Boolean),aH=[c.H1,c.H2,c.H3].filter(Boolean),aD=[c.D1,c.D2,c.D3].filter(Boolean);if(aL.length){const a=av(aL);if(!f.L1)f.L1=a+3;if(!f.L2)f.L2=a;if(!f.L3)f.L3=a-2;}if(aH.length){const a=av(aH);if(!f.H1)f.H1=a+4;if(!f.H2)f.H2=a;if(!f.H3)f.H3=a-3;}if(aD.length){const a=av(aD);if(!f.D1)f.D1=a;if(!f.D2)f.D2=a;if(!f.D3)f.D3=a;}return f;};
const aiChk=m=>{const w=[];const Ls=[m.L1,m.L2,m.L3].filter(Boolean),Hs=[m.H1,m.H2,m.H3].filter(Boolean);if(Ls.length>=2&&Math.max(...Ls)-Math.min(...Ls)>15)w.push({t:"w",m:`ΔL ${Math.max(...Ls)-Math.min(...Ls)}mm`});if(Hs.length>=2&&Math.max(...Hs)-Math.min(...Hs)>15)w.push({t:"w",m:`ΔH ${Math.max(...Hs)-Math.min(...Hs)}mm`});if(Ls.some(l=>l<300))w.push({t:"e",m:"L<300"});if(!w.length&&(Ls.length||Hs.length))w.push({t:"ok",m:"OK"});return w;};
const aiScn=()=>({L1:1000+Math.round(Math.random()*800)+3,L2:1000+Math.round(Math.random()*800),L3:1000+Math.round(Math.random()*800)-2,H1:1200+Math.round(Math.random()*1000)+5,H2:1200+Math.round(Math.random()*1000),H3:1200+Math.round(Math.random()*1000)-4,D1:80+Math.round(Math.random()*100),D2:80+Math.round(Math.random()*100),D3:80+Math.round(Math.random()*100),conf:85+Math.round(Math.random()*10)});
const aiVo=t=>{const r={};const n=t.match(/(\d{3,4})/g);if(n){["L1","L2","L3","H1","H2","H3","D1","D2","D3"].forEach((k,i)=>{if(n[i])r[k]=parseInt(n[i]);});}return r;};
const getAI=(q)=>{const l=q.toLowerCase();if(l.includes("rossi"))return"📐 Rossi — Misure 2/5";if(l.includes("oggi"))return"📅 08:30 Ferraro\n10:30 Greco\n14:00 Rossi";if(l.includes("stato"))return"📊 5 commesse · 14 vani · 3 task";if(l.includes("prezz"))return"💰 Twinsistem €280/mq\nSchüco €350/mq";return"Chiedi: stato, oggi, prezzi";};

export default function App(){
  const[theme,setTheme]=useState("chiaro");
  const T=THEMES[theme];
  const[tab,setTab]=useState("oggi");
  const[scr,setScr]=useState(null);
  const[selC,setSelC]=useState(null);
  const[selV,setSelV]=useState(null);
  const[colori,setColori]=useState(INIT_COLORI);
  const[team,setTeam]=useState(INIT_TEAM);
  const[fasi,setFasi]=useState(INIT_FASI);
  const[sistemi]=useState(INIT_SISTEMI);
  const[cantieri,setCantieri]=useState(()=>[
    {id:1,cliente:"Rossi Mario",ind:"Via Roma 12, Cosenza",tel:"333 1234567",vani:5,fase:"misure",note:"App. 3° piano",sId:1,colTId:1,colAId:1},
    {id:2,cliente:"Greco Anna",ind:"C.so Mazzini 45, Rende",tel:"328 9876543",vani:3,fase:"preventivo",note:"Cucina + bagni",sId:2,colTId:2,colAId:2},
    {id:3,cliente:"Ferraro Luigi",ind:"Via Caloprese 8, Cosenza",tel:"347 5551234",vani:8,fase:"sopralluogo",note:"Villa bifamiliare",sId:1,colTId:5,colAId:4},
    {id:4,cliente:"Bruno Teresa",ind:"Via Popilia 102, Cosenza",tel:"339 4449876",vani:4,fase:"ordini",note:"Attesa colore",sId:3,colTId:3,colAId:3},
    {id:5,cliente:"Mancini Paolo",ind:"Via Panebianco 33, Cosenza",tel:"366 7773210",vani:6,fase:"produzione",note:"Consegna 15/03",sId:2,colTId:1,colAId:1}
  ].map(c=>({...c,pipe:mkP(c.fase,INIT_FASI)})));
  const[vaniL,setVaniL]=useState([
    {id:1,cId:1,nome:"Soggiorno",tipo:"F2A",stanza:"Soggiorno",mis:{L1:1400,L2:1400,L3:1400,H1:1600,H2:1600,H3:1600,D1:120,D2:120,D3:120},foto:2,done:true,acc:{tapparella:{on:true,colId:1,mis:{L:1400,H:1600}},cassonetto:{on:true,colId:1},zanzariera:{on:false},persiana:{on:false}}},
    {id:2,cId:1,nome:"Camera",tipo:"PF1A",stanza:"Camera",mis:{L1:900,L2:900,L3:900,H1:2200,H2:2200,H3:2200,D1:100,D2:100,D3:100},foto:1,done:true,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}},
    {id:3,cId:1,nome:"Bagno",tipo:"VAS",stanza:"Bagno",mis:{},foto:0,done:false,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}},
    {id:4,cId:1,nome:"Cucina",tipo:"F2A",stanza:"Cucina",mis:{},foto:0,done:false,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}},
    {id:5,cId:1,nome:"Ingresso",tipo:"BLIND",stanza:"Ingresso",mis:{},foto:0,done:false,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}}
  ]);
  const[appunti]=useState([
    {id:1,cId:3,ora:"08:30",dur:"1h",tipo:"Sopralluogo",date:new Date(OG.getFullYear(),OG.getMonth(),OG.getDate()),color:"#2563eb"},
    {id:2,cId:2,ora:"10:30",dur:"45min",tipo:"Preventivo",date:new Date(OG.getFullYear(),OG.getMonth(),OG.getDate()),color:"#7c3aed"},
    {id:3,cId:1,ora:"14:00",dur:"1h30",tipo:"Misure",date:new Date(OG.getFullYear(),OG.getMonth(),OG.getDate()),color:"#e67e22"}
  ]);
  const[tasks,setTasks]=useState([{id:1,testo:"Metro laser da Rossi",fatto:false,pri:"alta"},{id:2,testo:"Conferma colore Bruno",fatto:false,pri:"media"},{id:3,testo:"Ordine guarnizioni",fatto:true,pri:"bassa"},{id:4,testo:"Foto difetti Popilia",fatto:false,pri:"alta"}]);
  const[calV,setCalV]=useState("mese");
  const[calM,setCalM]=useState(new Date(OG.getFullYear(),OG.getMonth(),1));
  const[calS,setCalS]=useState(OG);
  const[mis,setMis]=useState({});
  const[actM,setActM]=useState(null);
  const[inpV,setInpV]=useState("");
  const[accSt,setAccSt]=useState({tapparella:{on:false,colId:null,mis:{}},cassonetto:{on:false,colId:null},zanzariera:{on:false,colId:null,mis:{}},persiana:{on:false,colId:null,mis:{}}});
  const[drawing,setDrawing]=useState([]);const[isDrw,setIsDrw]=useState(false);const[drwCol,setDrwCol]=useState("#e67e22");const canvasRef=useRef(null);
  const[showNewCl,setShowNewCl]=useState(false);const[newCl,setNewCl]=useState({nome:"",cognome:"",tel:"",ind:"",sId:1,colTId:1,colAId:1});
  const[showAI,setShowAI]=useState(false);const[aiIn,setAiIn]=useState("");const[aiChat,setAiChat]=useState([{r:"ai",t:"Ciao! MASTRO AI — chiedi stato, programma, prezzi..."}]);const[aiLoad,setAiLoad]=useState(false);
  const[showVoice,setShowVoice]=useState(false);const[voiceTxt,setVoiceTxt]=useState("");const[scanRes,setScanRes]=useState(null);const[showAnom,setShowAnom]=useState(false);
  const[showAddTask,setShowAddTask]=useState(false);const[newTask,setNewTask]=useState("");const[newTaskPri,setNewTaskPri]=useState("media");
  const[commF,setCommF]=useState("tutte");
  const[sTab,setSTab]=useState("generali");
  const[editTeamId,setEditTeamId]=useState(null);const[editTeamData,setEditTeamData]=useState({});
  const[newColor,setNewColor]=useState({nome:"",hex:"#ffffff",tipo:"ral"});const[showAddColor,setShowAddColor]=useState(false);
  const[showAddTeam,setShowAddTeam]=useState(false);const[newTeamD,setNewTeamD]=useState({nome:"",ruolo:"",compiti:"",col:"#e67e22"});
  const[showNewVano,setShowNewVano]=useState(false);const[newVano,setNewVano]=useState({nome:"",tipo:"F2A",stanza:""});

  const gCol=id=>colori.find(c=>c.id===id);const gSys=id=>sistemi.find(s=>s.id===id);
  const ogA=appunti.filter(a=>sameD(a.date,OG));const opT=tasks.filter(t=>!t.fatto).length;
  const filC=commF==="tutte"?cantieri:cantieri.filter(c=>c.fase===commF);const filled=Object.values(mis).filter(v=>v>0).length;

  const goBack=()=>{if(scr==="vano"){setScr("cantiere");setSelV(null);setActM(null);setScanRes(null);setShowAnom(false);setShowVoice(false);}else if(scr==="draw")setScr("vano");else{setScr(null);setSelC(null);}};
  const openC=c=>{setSelC(c);setScr("cantiere");};
  const openV=v=>{setSelV(v);setMis(v.mis||{});setAccSt(v.acc||{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}});setScanRes(null);setShowAnom(false);setShowVoice(false);setScr("vano");};
  const sendAI=()=>{if(!aiIn.trim())return;setAiChat(p=>[...p,{r:"user",t:aiIn.trim()}]);const q=aiIn;setAiIn("");setAiLoad(true);setTimeout(()=>{setAiChat(p=>[...p,{r:"ai",t:getAI(q)}]);setAiLoad(false);},500);};
  const addTask=()=>{if(!newTask.trim())return;setTasks(p=>[...p,{id:Date.now(),testo:newTask.trim(),fatto:false,pri:newTaskPri}]);setNewTask("");setShowAddTask(false);};
  const addCl=()=>{if(!newCl.nome||!newCl.cognome)return;const nc={id:Date.now(),cliente:`${newCl.cognome} ${newCl.nome}`,ind:newCl.ind||"—",tel:newCl.tel,vani:0,fase:fasi[0].id,note:"",sId:newCl.sId,colTId:newCl.colTId,colAId:newCl.colAId,pipe:mkP(fasi[0].id,fasi)};setCantieri(p=>[...p,nc]);setNewCl({nome:"",cognome:"",tel:"",ind:"",sId:1,colTId:1,colAId:1});setShowNewCl(false);setSelC(nc);setScr("cantiere");};
  const addVano=()=>{if(!newVano.nome||!selC)return;const nv={id:Date.now(),cId:selC.id,nome:newVano.nome,tipo:newVano.tipo,stanza:newVano.stanza||newVano.nome,mis:{},foto:0,done:false,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}};setVaniL(p=>[...p,nv]);setCantieri(p=>p.map(c=>c.id===selC.id?{...c,vani:c.vani+1}:c));setNewVano({nome:"",tipo:"F2A",stanza:""});setShowNewVano(false);};
  const prevC=c=>{const cv=vaniL.filter(v=>v.cId===c.id);const sy=gSys(c.sId);if(!cv.length||!sy)return null;let tot=0;cv.forEach(v=>{const m=v.mis;const L=Math.max(m.L1||0,m.L2||0,m.L3||0),H=Math.max(m.H1||0,m.H2||0,m.H3||0);if(L&&H){const mq=(L*H)/1e6;let p=mq*sy.prezzoMq;const ct=gCol(c.colTId);if(ct?.tipo==="ral"&&ct.id!==1)p+=mq*sy.sovRal;if(ct?.tipo==="legno")p+=mq*sy.sovLegno;p+=80;tot+=p;}});return{net:Math.round(tot),iva:Math.round(tot*1.22),n:cv.length};};
  const exportPDF=c=>{const cv=vaniL.filter(v=>v.cId===c.id);const sy=gSys(c.sId);const ct=gCol(c.colTId);const prev=prevC(c);let html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Report ${c.cliente}</title><style>*{margin:0;padding:0;box-sizing:border-box;font-family:system-ui}body{padding:40px;color:#111;font-size:14px}h1{font-size:24px;color:#e67e22;margin-bottom:4px}h2{font-size:16px;margin:20px 0 8px;padding-bottom:6px;border-bottom:2px solid #e67e22}.info{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.info div{padding:8px;background:#f5f5f5;border-radius:6px}.info label{font-size:11px;color:#888;display:block}.info span{font-weight:600}.vano{margin:8px 0;padding:12px;border:1px solid #ddd;border-radius:8px}.vano h3{font-size:14px;margin-bottom:4px}.mis{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:6px 0}.mis div{text-align:center;padding:4px;background:#f0f0f0;border-radius:4px;font-size:12px}.mis div span{font-weight:700;font-family:monospace}.prev{margin:16px 0;padding:16px;background:#fef3c7;border-radius:8px;text-align:center}.prev .tot{font-size:28px;font-weight:800;color:#e67e22}.footer{margin-top:24px;text-align:center;font-size:11px;color:#aaa}</style></head><body>`;
    html+=`<h1>MASTRO MISURE</h1><p style="color:#888">Report — ${c.cliente}</p><h2>Dati Cliente</h2><div class="info"><div><label>Cliente</label><span>${c.cliente}</span></div><div><label>Indirizzo</label><span>${c.ind}</span></div><div><label>Telefono</label><span>${c.tel||"—"}</span></div><div><label>Fase</label><span>${c.fase}</span></div><div><label>Sistema</label><span>${sy?sy.marca+" "+sy.sistema:"—"}</span></div><div><label>Colore</label><span>${ct?ct.nome:"—"}</span></div></div>`;
    html+=`<h2>Vani (${cv.length})</h2>`;
    cv.forEach(v=>{const m=v.mis;html+=`<div class="vano"><h3>${v.done?"✅":"⏳"} ${v.nome} — ${v.tipo}</h3><div class="mis">`;
      ["L1","L2","L3","H1","H2","H3","D1","D2","D3"].forEach(k=>{html+=`<div>${k}: <span>${m[k]||"—"}</span> mm</div>`;});
      html+=`</div></div>`;});
    if(prev)html+=`<div class="prev"><div style="font-size:12px;color:#888">Preventivo (${prev.n} vani)</div><div class="tot">€${prev.iva}</div><div style="font-size:12px;color:#888">IVA inclusa · Netto €${prev.net}</div></div>`;
    html+=`<div class="footer">Generato: ${new Date().toLocaleString("it-IT")} · MASTRO MISURE</div></body></html>`;
    const w=window.open("","_blank");if(w){w.document.write(html);w.document.close();setTimeout(()=>w.print(),400);}};

  const getPos=useCallback(e=>{if(!canvasRef.current)return{x:0,y:0};const r=canvasRef.current.getBoundingClientRect();const ct=e.touches?e.touches[0]:e;return{x:ct.clientX-r.left,y:ct.clientY-r.top};},[]);
  const startD=useCallback(e=>{e.preventDefault();setIsDrw(true);setDrawing(pr=>[...pr,{pts:[getPos(e)],col:drwCol,w:3}]);},[drwCol,getPos]);
  const moveD=useCallback(e=>{if(!isDrw)return;e.preventDefault();setDrawing(pr=>{const c=[...pr];if(c.length)c[c.length-1]={...c[c.length-1],pts:[...c[c.length-1].pts,getPos(e)]};return c;});},[isDrw,getPos]);
  const endD=useCallback(()=>setIsDrw(false),[]);

  /* ══════════════════════ STYLES ══════════════════════ */
  const S={
    page:{width:"100%",height:"100dvh",background:T.bg,fontFamily:"'Inter',system-ui",color:T.text,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"},
    hdr:{padding:"14px 20px",display:"flex",alignItems:"center",gap:14,background:T.bg2,borderBottom:`1px solid ${T.bdr}`,minHeight:60,flexShrink:0},
    card:{background:T.card,borderRadius:16,border:`1px solid ${T.bdr}`,boxShadow:T.shadow,margin:"0 16px 12px",padding:16},
    badge:(bg,c)=>({display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:600,background:bg,color:c}),
    btn:(bg,c="#fff")=>({display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 24px",borderRadius:14,background:bg,color:c,fontSize:15,fontWeight:700,border:"none",cursor:"pointer",width:"100%",boxShadow:T.shadow}),
    btnSm:(bg,c)=>({display:"flex",alignItems:"center",gap:4,padding:"8px 14px",borderRadius:10,background:bg,color:c,fontSize:12,fontWeight:600,border:"none",cursor:"pointer"}),
    inp:{width:"100%",background:T.bg,border:`1px solid ${T.bdr}`,borderRadius:12,padding:"12px 16px",color:T.text,fontSize:14,outline:"none",fontFamily:"'Inter'"},
    sel:{width:"100%",background:T.bg,border:`1px solid ${T.bdr}`,borderRadius:12,padding:"12px 16px",color:T.text,fontSize:14,outline:"none",fontFamily:"'Inter'",appearance:"auto"},
    modal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,backdropFilter:"blur(4px)"},
    mBox:{width:"100%",maxWidth:500,background:T.bg2,borderRadius:"24px 24px 0 0",padding:"24px 20px 32px",maxHeight:"85vh",overflow:"auto"},
    pill:on=>({padding:"8px 18px",borderRadius:24,fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:on?T.acc:T.w08,color:on?"#fff":T.sub,boxShadow:on?T.shadow:"none",transition:"all 0.2s"}),
    lbl:{fontSize:11,color:T.sub,fontWeight:600,marginBottom:6,letterSpacing:"0.04em",textTransform:"uppercase"},
    stat:(accent)=>({background:T.card,borderRadius:16,border:`1px solid ${T.bdr}`,boxShadow:T.shadow,padding:16,flex:1,borderLeft:`4px solid ${accent}`,cursor:"pointer"}),
  };

  return(<>
    <link href={FONT} rel="stylesheet"/>
    <style>{`*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}::-webkit-scrollbar{width:0}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    <div style={S.page}>

    {/* ═══ HEADER GLOBALE ═══ */}
    {!scr&&<div style={{padding:"16px 20px 12px",background:T.grad,display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
      <div style={{width:42,height:42,borderRadius:14,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:18,color:"#fff",backdropFilter:"blur(8px)"}}>M</div>
      <div style={{flex:1}}><div style={{fontSize:18,fontWeight:800,color:"#fff",letterSpacing:"-0.02em"}}>MASTRO MISURE</div><div style={{fontSize:12,color:"rgba(255,255,255,0.7)",fontWeight:500}}>{fmtD(OG)} {OG.getFullYear()}</div></div>
    </div>}

    {/* ═══ OGGI ═══ */}
    {!scr&&tab==="oggi"&&<div style={{flex:1,overflow:"auto",padding:"16px 0 8px"}}>
      {/* Stat cards */}
      <div style={{display:"flex",gap:10,padding:"0 16px 14px"}}>
        {[{l:"Appuntamenti",v:ogA.length,c:T.blue,go:"calendario"},{l:"Task aperti",v:opT,c:T.red,go:"task"},{l:"Commesse",v:cantieri.length,c:T.grn,go:"commesse"}].map((s,i)=>(
          <div key={i} onClick={()=>setTab(s.go)} style={S.stat(s.c)}>
            <div style={{fontSize:28,fontWeight:800,color:s.c,fontFamily:"'JetBrains Mono'",lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:11,color:T.sub,fontWeight:500,marginTop:6}}>{s.l}</div>
          </div>))}
      </div>
      {/* Next appointment */}
      {ogA[0]&&(()=>{const a=ogA[0];const c=cantieri.find(x=>x.id===a.cId);return c?(<div onClick={()=>openC(c)} style={{margin:"0 16px 14px",padding:18,background:T.card,borderRadius:16,boxShadow:T.shadowL,cursor:"pointer",border:`1px solid ${T.bdr}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,bottom:0,width:5,background:a.color,borderRadius:"16px 0 0 16px"}}/>
        <div style={{paddingLeft:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div><div style={{fontSize:10,color:T.acc,fontWeight:700,letterSpacing:"0.1em",marginBottom:4}}>PROSSIMO APPUNTAMENTO</div><div style={{fontSize:18,fontWeight:700}}>{c.cliente}</div></div>
            <div style={{fontSize:24,fontWeight:800,color:a.color,fontFamily:"'JetBrains Mono'"}}>{a.ora}</div>
          </div>
          <div style={{fontSize:13,color:T.sub}}>{c.ind}</div>
          <div style={{marginTop:10,display:"flex",gap:6}}><span style={S.badge(a.color+"15",a.color)}>{a.tipo}</span><span style={S.badge(T.w08,T.sub)}>{a.dur}</span></div>
        </div>
      </div>):null;})()}
      {/* Agenda */}
      <div style={{padding:"6px 20px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:14,fontWeight:700}}>Agenda oggi</div><div style={{fontSize:11,color:T.acc,fontWeight:600,cursor:"pointer"}} onClick={()=>setTab("calendario")}>Vedi tutto →</div></div>
      {ogA.map(a=>{const c=cantieri.find(x=>x.id===a.cId);return c?(<div key={a.id} onClick={()=>openC(c)} style={{...S.card,display:"flex",gap:14,alignItems:"center",cursor:"pointer",padding:14}}>
        <div style={{width:48,height:48,borderRadius:14,background:a.color+"12",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{fasi.find(f=>f.id===a.tipo?.toLowerCase())?.icon||"📅"}</div>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{c.cliente}</div><div style={{fontSize:12,color:T.sub,marginTop:2}}>{a.tipo} · {c.ind}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:800,fontFamily:"'JetBrains Mono'",color:a.color}}>{a.ora}</div><div style={{fontSize:10,color:T.sub}}>{a.dur}</div></div>
      </div>):null;})}
      {/* Pipeline summary */}
      <div style={{padding:"12px 20px 8px"}}><div style={{fontSize:14,fontWeight:700}}>Pipeline</div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"0 16px 16px"}}>
      {fasi.map(f=>{const n=cantieri.filter(c=>c.fase===f.id).length;return(<div key={f.id} onClick={()=>{setTab("commesse");setCommF(f.id);}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:T.card,borderRadius:14,border:`1px solid ${T.bdr}`,boxShadow:T.shadow,cursor:"pointer",opacity:n?1:0.4}}>
        <span style={{fontSize:18}}>{f.icon}</span><span style={{flex:1,fontSize:13,fontWeight:500}}>{f.label}</span>{n>0&&<span style={{fontSize:16,fontWeight:800,color:f.color,fontFamily:"'JetBrains Mono'",background:f.color+"12",padding:"2px 8px",borderRadius:8}}>{n}</span>}
      </div>);})}
      </div>
    </div>}

    {/* ═══ CALENDARIO ═══ */}
    {!scr&&tab==="calendario"&&<><div style={S.hdr}>
      <div style={{flex:1}}><div style={{fontSize:17,fontWeight:800}}>Calendario</div><div style={{fontSize:12,color:T.sub}}>{MML[calM.getMonth()]} {calM.getFullYear()}</div></div>
    </div>
    <div style={{flex:1,overflow:"auto"}}>
      <div style={{display:"flex",gap:6,padding:"12px 16px 8px"}}>{["giorno","settimana","mese"].map(v=><button key={v} onClick={()=>setCalV(v)} style={S.pill(calV===v)}>{v[0].toUpperCase()+v.slice(1)}</button>)}</div>
      {calV==="mese"&&(()=>{const yr=calM.getFullYear(),mo=calM.getMonth(),fd=new Date(yr,mo,1).getDay(),dim=new Date(yr,mo+1,0).getDate(),cells=[];for(let i=0;i<(fd===0?6:fd-1);i++)cells.push(null);for(let d=1;d<=dim;d++)cells.push(new Date(yr,mo,d));return(<>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 20px 10px"}}><div onClick={()=>setCalM(new Date(yr,mo-1,1))} style={{cursor:"pointer",padding:8,borderRadius:10,background:T.w08}}><Ic d={P.back} s={18} c={T.sub}/></div><div style={{fontSize:16,fontWeight:700}}>{MML[mo]} {yr}</div><div onClick={()=>setCalM(new Date(yr,mo+1,1))} style={{cursor:"pointer",padding:8,borderRadius:10,background:T.w08,transform:"rotate(180deg)"}}><Ic d={P.back} s={18} c={T.sub}/></div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,padding:"0 16px",textAlign:"center"}}>{["L","M","M","G","V","S","D"].map((g,i)=><div key={i} style={{fontSize:11,color:T.sub2,fontWeight:600,padding:6}}>{g}</div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,padding:"0 16px 16px"}}>{cells.map((day,i)=>{if(!day)return<div key={i}/>;const isT=sameD(day,OG),isS=sameD(day,calS);const hA=appunti.some(a=>sameD(a.date,day));return(<div key={i} onClick={()=>setCalS(day)} style={{textAlign:"center",padding:"10px 2px",borderRadius:12,cursor:"pointer",background:isS?T.accBg:isT?T.w08:"transparent"}}><div style={{fontSize:14,fontWeight:isT||isS?700:400,color:isS?T.acc:T.text}}>{day.getDate()}</div>{hA&&<div style={{width:5,height:5,borderRadius:3,background:T.acc,margin:"3px auto 0"}}/>}</div>);})}</div></>);})()}
      {calV==="settimana"&&(()=>{const st=new Date(calS);st.setDate(st.getDate()-st.getDay()+1);return(<div style={{padding:"8px 16px"}}>{Array.from({length:7},(_,i)=>{const d=new Date(st);d.setDate(st.getDate()+i);const isT=sameD(d,OG);const as=appunti.filter(a=>sameD(a.date,d));return(<div key={i} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:`1px solid ${T.bdr}`}}><div style={{width:50,textAlign:"center"}}><div style={{fontSize:11,color:T.sub}}>{GG[d.getDay()]}</div><div style={{fontSize:20,fontWeight:800,color:isT?T.acc:T.text}}>{d.getDate()}</div></div><div style={{flex:1}}>{as.length?as.map(a=>{const c=cantieri.find(x=>x.id===a.cId);return(<div key={a.id} onClick={()=>c&&openC(c)} style={{padding:"8px 12px",borderRadius:10,background:a.color+"10",borderLeft:`3px solid ${a.color}`,marginBottom:4,cursor:"pointer"}}><div style={{fontSize:13,fontWeight:600}}>{a.ora} — {c?.cliente}</div></div>);}):<div style={{fontSize:12,color:T.sub2,padding:"8px 0"}}>—</div>}</div></div>);})};</div>);})()}
      {calV==="giorno"&&(<div style={{padding:16}}><div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:13,color:T.sub}}>{GG[calS.getDay()]}</div><div style={{fontSize:40,fontWeight:900,color:T.acc}}>{calS.getDate()}</div><div style={{fontSize:14,color:T.sub}}>{MML[calS.getMonth()]}</div></div>{appunti.filter(a=>sameD(a.date,calS)).map(a=>{const c=cantieri.find(x=>x.id===a.cId);return(<div key={a.id} onClick={()=>c&&openC(c)} style={{...S.card,cursor:"pointer",borderLeft:`4px solid ${a.color}`}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:16,fontWeight:700}}>{c?.cliente}</div><div style={{fontSize:20,fontWeight:800,fontFamily:"'JetBrains Mono'",color:a.color}}>{a.ora}</div></div><div style={{fontSize:13,color:T.sub,marginTop:4}}>{a.tipo} · {a.dur}</div></div>);})}</div>)}
    </div></>}

    {/* ═══ TASK ═══ */}
    {!scr&&tab==="task"&&<><div style={S.hdr}>
      <div style={{flex:1}}><div style={{fontSize:17,fontWeight:800}}>Task</div><div style={{fontSize:12,color:T.sub}}>{opT} aperti</div></div>
      <button onClick={()=>setShowAddTask(true)} style={{width:40,height:40,borderRadius:14,background:T.grad,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:T.shadow}}><Ic d={P.plus} s={20} c="#fff"/></button>
    </div>
    <div style={{flex:1,overflow:"auto",padding:"8px 0"}}>
      {tasks.filter(t=>!t.fatto).length>0&&<div style={{padding:"8px 20px 4px",fontSize:11,fontWeight:700,color:T.sub,letterSpacing:"0.06em"}}>DA FARE</div>}
      {tasks.filter(t=>!t.fatto).map(t=>(<div key={t.id} style={{...S.card,display:"flex",gap:12,alignItems:"center",padding:14}}>
        <div onClick={()=>setTasks(ts=>ts.map(x=>x.id===t.id?{...x,fatto:true}:x))} style={{width:26,height:26,borderRadius:9,border:`2.5px solid ${{alta:T.red,media:T.acc,bassa:T.sub2}[t.pri]}`,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}/>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500}}>{t.testo}</div></div>
        <span style={S.badge({alta:T.redLt,media:T.accLt,bassa:T.w08}[t.pri],{alta:T.red,media:T.acc,bassa:T.sub2}[t.pri])}>{t.pri}</span>
      </div>))}
      {tasks.filter(t=>t.fatto).length>0&&<div style={{padding:"12px 20px 4px",fontSize:11,fontWeight:700,color:T.sub,letterSpacing:"0.06em"}}>COMPLETATI</div>}
      {tasks.filter(t=>t.fatto).map(t=>(<div key={t.id} style={{...S.card,display:"flex",gap:12,alignItems:"center",padding:14,opacity:0.45}}>
        <div style={{width:26,height:26,borderRadius:9,background:T.grnLt,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={P.check} s={14} c={T.grn}/></div>
        <div style={{flex:1,textDecoration:"line-through",fontSize:13,color:T.sub}}>{t.testo}</div>
      </div>))}
    </div></>}

    {/* ═══ COMMESSE ═══ */}
    {!scr&&tab==="commesse"&&<><div style={S.hdr}>
      <div style={{flex:1}}><div style={{fontSize:17,fontWeight:800}}>Commesse</div><div style={{fontSize:12,color:T.sub}}>{cantieri.length} attive</div></div>
      <button onClick={()=>setShowNewCl(true)} style={{width:40,height:40,borderRadius:14,background:T.grad,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:T.shadow}}><Ic d={P.plus} s={20} c="#fff"/></button>
    </div>
    <div style={{flex:1,overflow:"auto",padding:"8px 0"}}>
      <div style={{display:"flex",gap:6,padding:"4px 16px 10px",overflow:"auto",flexShrink:0}}><button onClick={()=>setCommF("tutte")} style={S.pill(commF==="tutte")}>Tutte ({cantieri.length})</button>{fasi.map(f=>{const n=cantieri.filter(c=>c.fase===f.id).length;if(!n)return null;return<button key={f.id} onClick={()=>setCommF(f.id)} style={{...S.pill(commF===f.id),background:commF===f.id?f.color:"",color:commF===f.id?"#fff":T.sub,whiteSpace:"nowrap"}}>{f.icon} {f.label} ({n})</button>;})}</div>
      {filC.map(c=>{const fi=fasi.findIndex(f=>f.id===c.fase);const fase=fasi[fi]||fasi[0];const sy=gSys(c.sId);const ct=gCol(c.colTId);return(<div key={c.id} onClick={()=>openC(c)} style={{...S.card,cursor:"pointer",borderLeft:`4px solid ${fase.color}`,padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div><div style={{fontSize:16,fontWeight:700}}>{c.cliente}</div><div style={{fontSize:12,color:T.sub,marginTop:2}}>{c.ind}</div></div>
          <span style={S.badge(fase.color+"15",fase.color)}>{fase.icon} {fase.label}</span>
        </div>
        <div style={{display:"flex",gap:3,marginTop:10}}>{fasi.map((f,i)=><div key={f.id} style={{flex:1,height:5,borderRadius:3,background:i<=fi?fase.color+"80":T.w08}}/>)}</div>
        <div style={{display:"flex",gap:10,marginTop:10,fontSize:12,color:T.sub}}><span style={{fontWeight:700,color:T.text}}>{c.vani} vani</span>{sy&&<span>{sy.marca}</span>}{ct&&<span style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:10,height:10,borderRadius:5,background:ct.hex,border:`1px solid ${T.bdr}`}}/>{ct.nome}</span>}</div>
      </div>);})}
    </div></>}

    {/* ═══ IMPOSTAZIONI ═══ */}
    {!scr&&tab==="impostazioni"&&<><div style={S.hdr}>
      <div style={{flex:1}}><div style={{fontSize:17,fontWeight:800}}>Impostazioni</div></div>
    </div>
    <div style={{flex:1,overflow:"auto",padding:"8px 0"}}>
      {/* Profile */}
      <div style={{padding:"16px 16px 20px",textAlign:"center"}}><div style={{width:72,height:72,borderRadius:24,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:900,color:"#fff",margin:"0 auto 12px",boxShadow:T.shadowL}}>F</div><div style={{fontSize:20,fontWeight:800}}>Fabio</div><div style={{fontSize:13,color:T.sub,marginTop:2}}>Walter Cozza Serramenti</div></div>
      <div style={{display:"flex",gap:6,padding:"0 16px 14px",overflow:"auto",flexShrink:0}}>
        {[{id:"generali",l:"⚙️ Generali"},{id:"team",l:"👥 Team"},{id:"colori",l:"🎨 Colori"},{id:"pipeline",l:"📊 Pipeline"},{id:"sistemi",l:"🪟 Sistemi"}].map(st=><button key={st.id} onClick={()=>setSTab(st.id)} style={S.pill(sTab===st.id)}>{st.l}</button>)}
      </div>

      {sTab==="generali"&&<>
        <div style={S.card}><div style={S.lbl}>TEMA</div>
          <div style={{display:"flex",gap:10}}>{Object.entries(THEMES).map(([k,th])=><div key={k} onClick={()=>setTheme(k)} style={{flex:1,padding:14,borderRadius:14,background:th.bg,border:`3px solid ${theme===k?th.acc:"transparent"}`,cursor:"pointer",textAlign:"center",boxShadow:theme===k?th.shadowL:"none",transition:"all 0.2s"}}><div style={{fontSize:22,marginBottom:6}}>{th.emoji}</div><div style={{fontSize:12,fontWeight:700,color:th.text}}>{th.name}</div></div>)}</div>
        </div>
        <div style={S.card}><div style={S.lbl}>STATISTICHE</div>
          {[{l:"Commesse",v:cantieri.length,c:T.blue},{l:"Vani totali",v:cantieri.reduce((s,c)=>s+c.vani,0),c:T.grn},{l:"Task aperti",v:opT,c:T.red},{l:"Colori",v:colori.length,c:T.purple}].map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?`1px solid ${T.bdr}`:"none"}}><span style={{fontSize:14,color:T.sub}}>{s.l}</span><span style={{fontSize:16,fontWeight:800,fontFamily:"'JetBrains Mono'",color:s.c}}>{s.v}</span></div>)}
        </div>
      </>}

      {sTab==="team"&&<>
        <div style={{padding:"0 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:14,fontWeight:700}}>Team ({team.length})</div><button onClick={()=>setShowAddTeam(true)} style={S.btnSm(T.accBg,T.acc)}>+ Aggiungi</button></div>
        {team.map(m=><div key={m.id} style={S.card}>
          {editTeamId===m.id?<>
            <div style={{marginBottom:10}}><div style={S.lbl}>Nome</div><input value={editTeamData.nome||""} onChange={e=>setEditTeamData(p=>({...p,nome:e.target.value}))} style={S.inp}/></div>
            <div style={{marginBottom:10}}><div style={S.lbl}>Ruolo</div><input value={editTeamData.ruolo||""} onChange={e=>setEditTeamData(p=>({...p,ruolo:e.target.value}))} style={S.inp}/></div>
            <div style={{marginBottom:10}}><div style={S.lbl}>Compiti</div><input value={editTeamData.compiti||""} onChange={e=>setEditTeamData(p=>({...p,compiti:e.target.value}))} style={S.inp}/></div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setTeam(p=>p.map(x=>x.id===m.id?{...x,...editTeamData,av:editTeamData.nome?editTeamData.nome[0].toUpperCase():m.av}:x));setEditTeamId(null);}} style={{...S.btn(T.grad,"#fff"),flex:1,padding:12,fontSize:13}}>✅ Salva</button>
              <button onClick={()=>setEditTeamId(null)} style={{...S.btn(T.w08,T.sub),flex:1,padding:12,fontSize:13,boxShadow:"none"}}>Annulla</button>
            </div>
          </>:<div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:16,background:m.col+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:m.col,border:`2px solid ${m.col}30`,flexShrink:0}}>{m.av}</div>
            <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600}}>{m.nome}</div><div style={{fontSize:12,color:T.sub,marginTop:2}}>{m.ruolo} · {m.compiti}</div></div>
            <div style={{display:"flex",gap:6}}>
              <div onClick={()=>{setEditTeamId(m.id);setEditTeamData({nome:m.nome,ruolo:m.ruolo,compiti:m.compiti});}} style={{cursor:"pointer",padding:6,borderRadius:8,background:T.w08}}><Ic d={P.pencil} s={16} c={T.sub}/></div>
              {m.id!=="fabio"&&<div onClick={()=>setTeam(p=>p.filter(x=>x.id!==m.id))} style={{cursor:"pointer",padding:6,borderRadius:8,background:T.redLt}}><Ic d={P.trash} s={16} c={T.red}/></div>}
            </div>
          </div>}
        </div>)}
      </>}

      {sTab==="colori"&&<>
        <div style={{padding:"0 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:14,fontWeight:700}}>Catalogo Colori ({colori.length})</div><button onClick={()=>setShowAddColor(true)} style={S.btnSm(T.accBg,T.acc)}>+ Aggiungi</button></div>
        {["ral","legno"].map(tipo=>{const items=colori.filter(c=>c.tipo===tipo);if(!items.length)return null;return<div key={tipo}>
          <div style={{padding:"8px 20px 6px",fontSize:11,fontWeight:700,color:T.sub,letterSpacing:"0.06em"}}>{tipo==="ral"?"RAL":"EFFETTO LEGNO"}</div>
          {items.map(c=><div key={c.id} style={{...S.card,display:"flex",alignItems:"center",gap:12,padding:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:c.hex,border:`1px solid ${T.bdr}`,flexShrink:0,boxShadow:"inset 0 1px 3px rgba(0,0,0,0.1)"}}/>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{c.nome}</div><div style={{fontSize:11,color:T.sub}}>{c.hex}</div></div>
            <div onClick={()=>setColori(p=>p.filter(x=>x.id!==c.id))} style={{cursor:"pointer",padding:6,borderRadius:8,background:T.redLt}}><Ic d={P.trash} s={16} c={T.red}/></div>
          </div>)}
        </div>;})}
      </>}

      {sTab==="pipeline"&&<>
        <div style={{padding:"0 16px 10px"}}><div style={{fontSize:14,fontWeight:700}}>Fasi Pipeline ({fasi.length})</div><div style={{fontSize:12,color:T.sub,marginTop:2}}>Usa ▲▼ per riordinare</div></div>
        {fasi.map((f,i)=><div key={f.id} style={{...S.card,display:"flex",alignItems:"center",gap:12,padding:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:f.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{f.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:f.color}}>{f.label}</div></div>
          <div style={{display:"flex",gap:4}}>
            {i>0&&<div onClick={()=>{const n=[...fasi];[n[i-1],n[i]]=[n[i],n[i-1]];setFasi(n);}} style={{cursor:"pointer",padding:4,borderRadius:6,background:T.w08,transform:"rotate(180deg)"}}><Ic d={P.down} s={16} c={T.sub}/></div>}
            {i<fasi.length-1&&<div onClick={()=>{const n=[...fasi];[n[i],n[i+1]]=[n[i+1],n[i]];setFasi(n);}} style={{cursor:"pointer",padding:4,borderRadius:6,background:T.w08}}><Ic d={P.down} s={16} c={T.sub}/></div>}
          </div>
        </div>)}
      </>}

      {sTab==="sistemi"&&<>
        <div style={{padding:"0 16px 10px"}}><div style={{fontSize:14,fontWeight:700}}>Sistemi ({sistemi.length})</div></div>
        {sistemi.map(s=><div key={s.id} style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:16,fontWeight:700}}>{s.marca}</div><div style={{fontSize:13,color:T.sub}}>{s.sistema}</div></div><div style={{fontSize:18,fontWeight:800,color:T.acc,fontFamily:"'JetBrains Mono'"}}>{s.prezzoMq}€</div></div>
          <div style={{display:"flex",gap:10,marginTop:10,fontSize:12}}><span style={S.badge(T.w08,T.sub)}>+€{s.sovRal} RAL</span><span style={S.badge(T.w08,T.sub)}>+€{s.sovLegno} legno</span></div>
          <div style={{display:"flex",gap:4,marginTop:10,flexWrap:"wrap"}}>{s.coloriIds.map(cid=>{const cl=gCol(cid);return cl?<div key={cid} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:8,background:T.w08,fontSize:11}}><div style={{width:10,height:10,borderRadius:5,background:cl.hex,border:`1px solid ${T.bdr}`}}/>{cl.nome}</div>:null;})}</div>
        </div>)}
      </>}
    </div></>}

    {/* ═══ CANTIERE ═══ */}
    {scr==="cantiere"&&selC&&(()=>{const c=selC;const fi=fasi.findIndex(f=>f.id===c.fase);const fase=fasi[fi]||fasi[0];const cv=vaniL.filter(v=>v.cId===c.id);const sy=gSys(c.sId);const ct=gCol(c.colTId);const ca=gCol(c.colAId);const prev=prevC(c);return(
      <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:12,background:T.bg2,borderBottom:`1px solid ${T.bdr}`,flexShrink:0}}>
          <div onClick={goBack} style={{cursor:"pointer",padding:6,borderRadius:10,background:T.w08}}><Ic d={P.back} s={20} c={T.sub}/></div>
          <div style={{flex:1}}><div style={{fontSize:17,fontWeight:800}}>{c.cliente}</div><div style={{fontSize:12,color:T.sub}}>{c.ind}</div></div>
          <button onClick={()=>exportPDF(c)} style={S.btnSm(T.redLt,T.red)}>📄 PDF</button>
        </div>
        <div style={{flex:1,overflow:"auto",padding:"12px 0"}}>
          {/* Pipeline progress */}
          <div style={{margin:"0 16px 12px",padding:16,background:T.card,borderRadius:16,border:`1px solid ${T.bdr}`,boxShadow:T.shadow}}>
            <div style={{display:"flex",gap:4,marginBottom:10}}>{fasi.map((f,i)=><div key={f.id} style={{flex:1,textAlign:"center"}}><div style={{height:7,borderRadius:4,background:i<=fi?fase.color:T.w08,marginBottom:4,transition:"all 0.3s"}}/><div style={{fontSize:12}}>{f.icon}</div></div>)}</div>
            <span style={S.badge(fase.color+"15",fase.color)}>{fase.icon} {fase.label}</span>
          </div>
          {/* Info grid */}
          <div style={{margin:"0 16px 12px",padding:16,background:T.card,borderRadius:16,border:`1px solid ${T.bdr}`,boxShadow:T.shadow}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[{l:"Sistema",v:sy?`${sy.marca} ${sy.sistema}`:"—"},{l:"Colore Telaio",v:ct?.nome||"—",hex:ct?.hex},{l:"Colore Accessori",v:ca?.nome||"—",hex:ca?.hex},{l:"Telefono",v:c.tel||"—"}].map((f,i)=><div key={i} style={{padding:10,background:T.bg,borderRadius:12}}>
                <div style={{fontSize:10,color:T.sub,fontWeight:600,letterSpacing:"0.04em",marginBottom:4}}>{f.l.toUpperCase()}</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>{f.hex&&<div style={{width:14,height:14,borderRadius:6,background:f.hex,border:`1px solid ${T.bdr}`}}/>}<span style={{fontSize:13,fontWeight:600}}>{f.v}</span></div>
              </div>)}
            </div>
            {c.note&&<div style={{marginTop:10,padding:10,background:T.w04,borderRadius:10,fontSize:13,color:T.sub}}>📝 {c.note}</div>}
          </div>
          {/* Preventivo */}
          {prev&&<div style={{margin:"0 16px 12px",padding:16,background:T.purpleLt,borderRadius:16,border:`1px solid ${T.purple}20`,boxShadow:T.shadow}}>
            <div style={{fontSize:11,fontWeight:700,color:T.purple,letterSpacing:"0.06em",marginBottom:10}}>💰 PREVENTIVO ({prev.n} VANI)</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}><div><div style={{fontSize:13,color:T.sub}}>Netto</div><div style={{fontSize:18,fontWeight:700}}>€{prev.net}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:13,color:T.sub}}>IVA inclusa</div><div style={{fontSize:28,fontWeight:900,color:T.purple}}>€{prev.iva}</div></div></div>
          </div>}
          {/* Vani */}
          <div style={{padding:"8px 20px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:14,fontWeight:700}}>Vani ({cv.length})</div><button onClick={()=>setShowNewVano(true)} style={S.btnSm(T.accBg,T.acc)}>+ Nuovo vano</button></div>
          {cv.map(v=><div key={v.id} onClick={()=>openV(v)} style={{...S.card,display:"flex",gap:12,alignItems:"center",cursor:"pointer",padding:14}}>
            <div style={{width:44,height:44,borderRadius:14,background:v.done?T.grnLt:T.w08,display:"flex",alignItems:"center",justifyContent:"center"}}>{v.done?<Ic d={P.check} s={22} c={T.grn}/>:<Ic d={P.ruler} s={22} c={T.sub2}/>}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{v.nome}</div><div style={{fontSize:12,color:T.sub}}>{v.tipo} · {v.stanza}{v.done?"":" · ⏳ da misurare"}</div></div><Ic d={P.chevR} s={18} c={T.sub2}/>
          </div>)}
          {/* Advance */}
          <div style={{padding:"8px 16px 20px"}}>{fi<fasi.length-1?<button onClick={()=>{const nf=fasi[fi+1].id;const upd=cantieri.map(x=>{if(x.id!==c.id)return x;const np={...x.pipe};np[c.fase]="done";np[nf]="curr";return{...x,fase:nf,pipe:np};});setCantieri(upd);setSelC(upd.find(x=>x.id===c.id));}} style={S.btn(T.grad,"#fff")}>Avanza → {fasi[fi+1].label}</button>:<div style={S.btn(T.grnLt,T.grn)}>✅ COMPLETATA</div>}</div>
        </div></div>);})()}

    {/* ═══ VANO ═══ */}
    {scr==="vano"&&selV&&(()=>{const v=selV;
      const pts=[{k:"L1",x:95,y:35},{k:"L2",x:95,y:115},{k:"L3",x:95,y:195},{k:"H1",x:30,y:115},{k:"H2",x:95,y:115},{k:"H3",x:160,y:115},{k:"D1",x:185,y:35},{k:"D2",x:185,y:115},{k:"D3",x:185,y:195}];
      const tap=k=>{setActM(k);setInpV(mis[k]?String(mis[k]):"");};
      const save=()=>{if(actM&&inpV)setMis(d=>({...d,[actM]:parseInt(inpV)||0}));setActM(null);setInpV("");};
      return(
      <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:12,background:T.bg2,borderBottom:`1px solid ${T.bdr}`,flexShrink:0}}>
          <div onClick={goBack} style={{cursor:"pointer",padding:6,borderRadius:10,background:T.w08}}><Ic d={P.back} s={20} c={T.sub}/></div>
          <div style={{flex:1}}><div style={{fontSize:17,fontWeight:800}}>{v.nome}</div><div style={{fontSize:12,color:T.sub}}>{v.tipo} · {filled}/9 misure</div></div>
          <button onClick={()=>setScr("draw")} style={S.btnSm(T.purpleLt,T.purple)}>✏️ Disegna</button>
        </div>
        <div style={{flex:1,overflow:"auto",padding:"8px 0"}}>
          {/* AI tools */}
          <div style={{display:"flex",gap:6,padding:"8px 16px",overflow:"auto",flexShrink:0}}>
            <button onClick={()=>setShowVoice(true)} style={S.btnSm(T.accBg,T.acc)}>🎤 Voce</button>
            <button onClick={()=>setScanRes(aiScn())} style={S.btnSm(T.blueLt,T.blue)}>📸 Scan</button>
            <button onClick={()=>setMis(aiSmF(mis))} style={S.btnSm(T.grnLt,T.grn)}>🧠 Fill</button>
            <button onClick={()=>setShowAnom(!showAnom)} style={S.btnSm(T.redLt,T.red)}>⚠️ Check</button>
          </div>
          {showVoice&&<div style={{...S.card,background:T.card2,border:`1px solid ${T.acc}30`}}><div style={{fontSize:11,color:T.acc,fontWeight:700,marginBottom:8}}>🎤 DETTATURA MISURE</div><div style={{display:"flex",gap:8}}><input value={voiceTxt} onChange={e=>setVoiceTxt(e.target.value)} placeholder="1400 1400 1400 1600..." style={{...S.inp,flex:1}}/><button onClick={()=>{if(voiceTxt.trim()){setMis(d=>({...d,...aiVo(voiceTxt)}));setVoiceTxt("");setShowVoice(false);}}} style={S.btnSm(T.acc,"#fff")}>OK</button></div></div>}
          {scanRes&&<div style={{...S.card,background:T.blueLt,border:`1px solid ${T.blue}25`}}><div style={{fontSize:11,color:T.blue,fontWeight:700,marginBottom:8}}>📸 SCAN — Confidenza {scanRes.conf}%</div><div style={{display:"flex",gap:8}}><button onClick={()=>{setMis(d=>{const n={...d};Object.keys(scanRes).forEach(k=>{if(k.match(/^[LHD]\d$/))n[k]=scanRes[k];});return n;});setScanRes(null);}} style={{...S.btn(T.blue,"#fff"),flex:1,padding:10,fontSize:13}}>✅ Applica</button><button onClick={()=>setScanRes(null)} style={{...S.btn(T.w08,T.sub),flex:1,padding:10,fontSize:13,boxShadow:"none"}}>Ignora</button></div></div>}
          {showAnom&&<div style={{...S.card}}>{aiChk(mis).map((w,i)=><div key={i} style={{padding:10,marginBottom:4,borderRadius:10,background:w.t==="e"?T.redLt:w.t==="w"?T.accLt:T.grnLt,fontSize:13,fontWeight:600,color:w.t==="e"?T.red:w.t==="w"?T.acc:T.grn}}>{w.t==="ok"?"✅ Tutto OK":w.t==="e"?"🔴 Errore":"⚠️ Attenzione"}: {w.m}</div>)}</div>}
          {/* Schema vano */}
          <div style={{padding:"4px 16px 8px",display:"flex",justifyContent:"center"}}><div style={{background:T.card,borderRadius:20,border:`1px solid ${T.bdr}`,boxShadow:T.shadowL,padding:20,width:"100%",maxWidth:420}}>
            <div style={{fontSize:11,color:T.acc,fontWeight:700,marginBottom:16,textAlign:"center",letterSpacing:"0.1em"}}>📐 SCHEMA VANO</div>
            <svg viewBox="0 0 220 230" style={{width:"100%"}}>
              <rect x="22" y="10" width="146" height="200" fill="none" stroke={T.bdrL} strokeWidth="8" rx="3" opacity="0.4"/><rect x="30" y="18" width="130" height="184" fill={T.bg} stroke={T.bdrL} strokeWidth="1.5" rx="2"/>
              <text x="95" y="6" textAnchor="middle" fill={T.acc} fontSize="9" fontWeight="700">LARGHEZZA</text>
              <text x="6" y="115" textAnchor="middle" fill={T.blue} fontSize="9" fontWeight="700" transform="rotate(-90,6,115)">ALTEZZA</text>
              <text x="210" y="115" textAnchor="middle" fill={T.grn} fontSize="9" fontWeight="700" transform="rotate(90,210,115)">PROFONDITÀ</text>
              {pts.map(p=>{const val=mis[p.k];const col=p.k[0]==="L"?T.acc:p.k[0]==="H"?T.blue:T.grn;return(
                <g key={p.k} onClick={()=>tap(p.k)} style={{cursor:"pointer"}}>
                  <circle cx={p.x} cy={p.y} r={val?16:14} fill={val?col+"15":T.w08} stroke={actM===p.k?col:val?col+"50":T.bdr} strokeWidth={actM===p.k?2.5:1.2}/>
                  <text x={p.x} y={p.y-4} textAnchor="middle" fill={val?col:T.sub2} fontSize="7" fontWeight="700">{p.k}</text>
                  <text x={p.x} y={p.y+7} textAnchor="middle" fill={val?T.text:T.sub2} fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono'">{val||"—"}</text>
                </g>);})}
            </svg>
          </div></div>
          {/* Input misura */}
          {actM&&<div style={{...S.card,background:T.card2,border:`1px solid ${T.acc}30`}}><div style={{fontSize:12,color:T.acc,fontWeight:700,marginBottom:8}}>📏 {actM}</div><div style={{display:"flex",gap:8}}><input type="number" value={inpV} onChange={e=>setInpV(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()} placeholder="mm" autoFocus style={{flex:1,background:T.bg,border:`1px solid ${T.bdr}`,borderRadius:14,padding:14,color:T.text,fontSize:22,fontFamily:"'JetBrains Mono'",fontWeight:700,outline:"none",textAlign:"center"}}/><button onClick={save} style={{padding:"0 24px",borderRadius:14,background:T.grad,color:"#fff",fontWeight:700,border:"none",cursor:"pointer",fontSize:16,boxShadow:T.shadow}}>OK</button></div></div>}
          {/* Accessori */}
          <div style={S.card}>
            <div style={S.lbl}>ACCESSORI</div>
            {["tapparella","persiana","zanzariera","cassonetto"].map(acc=>{const a=accSt[acc]||{on:false};const labels={tapparella:"🪟 Tapparella",persiana:"🏠 Persiana",zanzariera:"🦟 Zanzariera",cassonetto:"📦 Cassonetto"};const colors={tapparella:T.blue,persiana:"#fb923c",zanzariera:T.grn,cassonetto:T.purple};return(<div key={acc}>
              <div onClick={()=>setAccSt(p=>({...p,[acc]:{...p[acc],on:!p[acc]?.on}}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",cursor:"pointer"}}>
                <span style={{fontSize:14,fontWeight:a.on?600:400,color:a.on?T.text:T.sub}}>{labels[acc]}</span>
                <div style={{width:48,height:26,borderRadius:13,background:a.on?colors[acc]:T.w08,padding:2,transition:"all 0.2s"}}><div style={{width:22,height:22,borderRadius:11,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.15)",transition:"all 0.2s",transform:a.on?"translateX(22px)":"translateX(0)"}}/></div>
              </div>
              {a.on&&<div style={{paddingBottom:10,paddingLeft:12,borderLeft:`2px solid ${colors[acc]}30`,marginLeft:10,marginBottom:6}}>
                <div style={{marginBottom:6}}><div style={{fontSize:11,color:T.sub}}>Colore</div><select value={a.colId||""} onChange={e=>setAccSt(p=>({...p,[acc]:{...p[acc],colId:parseInt(e.target.value)}}))} style={{...S.sel,padding:"8px 12px",fontSize:13}}>
                  <option value="">—</option>{colori.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
                </select></div>
                {(acc==="tapparella"||acc==="zanzariera")&&<div style={{display:"flex",gap:8,marginTop:6}}>
                  <div style={{flex:1}}><div style={{fontSize:11,color:T.sub}}>L (mm)</div><input type="number" value={a.mis?.L||""} onChange={e=>setAccSt(p=>({...p,[acc]:{...p[acc],mis:{...p[acc].mis,L:parseInt(e.target.value)||0}}}))} style={{...S.inp,padding:"8px 12px",fontSize:13}}/></div>
                  <div style={{flex:1}}><div style={{fontSize:11,color:T.sub}}>H (mm)</div><input type="number" value={a.mis?.H||""} onChange={e=>setAccSt(p=>({...p,[acc]:{...p[acc],mis:{...p[acc].mis,H:parseInt(e.target.value)||0}}}))} style={{...S.inp,padding:"8px 12px",fontSize:13}}/></div>
                </div>}
              </div>}
            </div>);})}
          </div>
          <div style={{padding:"0 16px 8px"}}><button style={{...S.btn(T.blueLt,T.blue),borderRadius:14,boxShadow:"none"}}><Ic d={P.camera} s={18} c={T.blue}/> Foto ({v.foto})</button></div>
          <div style={{padding:"0 16px 24px"}}><button style={S.btn(T.grad,"#fff")}>✅ SALVA MISURE</button></div>
        </div></div>);})()}

    {/* ═══ DRAW ═══ */}
    {scr==="draw"&&<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:12,background:T.bg2,borderBottom:`1px solid ${T.bdr}`,flexShrink:0}}>
        <div onClick={goBack} style={{cursor:"pointer",padding:6,borderRadius:10,background:T.w08}}><Ic d={P.back} s={20} c={T.sub}/></div>
        <div style={{flex:1}}><div style={{fontSize:17,fontWeight:800}}>Disegno Vano</div></div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",background:T.bg2,borderBottom:`1px solid ${T.bdr}`}}>
        {[T.acc,T.blue,T.red,T.grn,T.purple,"#333"].map(c=><div key={c} onClick={()=>setDrwCol(c)} style={{width:30,height:30,borderRadius:15,background:c,border:drwCol===c?"3px solid #fff":"2px solid transparent",cursor:"pointer",boxShadow:drwCol===c?T.shadow:"none"}}/>)}
        <div style={{flex:1}}/><div onClick={()=>setDrawing(p=>p.slice(0,-1))} style={{cursor:"pointer",padding:6,borderRadius:8,background:T.w08}}><Ic d={P.undo} s={20} c={T.sub}/></div><div onClick={()=>setDrawing([])} style={{cursor:"pointer",padding:6,borderRadius:8,background:T.redLt}}><Ic d={P.trash} s={20} c={T.red}/></div>
      </div>
      <div ref={canvasRef} onMouseDown={startD} onMouseMove={moveD} onMouseUp={endD} onTouchStart={startD} onTouchMove={moveD} onTouchEnd={endD} style={{flex:1,background:T.card,position:"relative",touchAction:"none",cursor:"crosshair"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>{drawing.map((s,i)=>s.pts.length>1&&<polyline key={i} points={s.pts.map(p=>`${p.x},${p.y}`).join(" ")} fill="none" stroke={s.col} strokeWidth={s.w} strokeLinecap="round" strokeLinejoin="round"/>)}</svg>
        {!drawing.length&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",color:T.sub2}}><div style={{fontSize:48}}>✏️</div><div style={{fontSize:15,marginTop:10}}>Tocca e disegna</div></div>}
      </div>
      <div style={{padding:"10px 16px 14px",background:T.bg2}}><button onClick={goBack} style={S.btn(T.grad,"#fff")}>✅ Salva disegno</button></div>
    </div>}

    {/* ═══ TAB BAR ═══ */}
    {!scr&&<div style={{display:"flex",borderTop:`1px solid ${T.bdr}`,background:T.bg2,padding:"6px 0 max(env(safe-area-inset-bottom),8px)",flexShrink:0,boxShadow:"0 -2px 8px rgba(0,0,0,0.04)"}}>
      {[{id:"oggi",l:"Oggi",em:"🏠"},{id:"calendario",l:"Calendario",em:"📅"},{id:"task",l:"Task",em:"📋"},{id:"commesse",l:"Commesse",em:"📦"},{id:"impostazioni",l:"Imp.",em:"⚙️"}].map(t=><div key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0",cursor:"pointer",position:"relative"}}>
        <div style={{fontSize:20,filter:tab===t.id?"none":"grayscale(0.7) opacity(0.5)",transition:"all 0.2s"}}>{t.em}</div>
        <div style={{fontSize:10,fontWeight:tab===t.id?700:400,color:tab===t.id?T.acc:T.sub2}}>{t.l}</div>
        {tab===t.id&&<div style={{position:"absolute",top:-1,left:"30%",right:"30%",height:3,borderRadius:2,background:T.acc}}/>}
        {t.id==="task"&&opT>0&&<div style={{position:"absolute",top:0,right:"50%",marginRight:-20,width:18,height:18,borderRadius:9,background:T.red,fontSize:10,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{opT}</div>}
      </div>)}
    </div>}

    {/* ═══ AI FAB ═══ */}
    {!showAI&&<button onClick={()=>setShowAI(true)} style={{position:"absolute",bottom:scr?24:76,right:20,width:52,height:52,borderRadius:18,background:`linear-gradient(135deg,${T.purple},#5b21b6)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(124,58,237,0.4)",cursor:"pointer",border:"none",zIndex:100}}><Ic d={P.ai} s={24} c="#fff"/></button>}

    {/* ═══ AI CHAT ═══ */}
    {showAI&&<div style={{position:"absolute",inset:0,background:T.bg,display:"flex",flexDirection:"column",zIndex:150}}>
      <div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:12,background:`linear-gradient(135deg,${T.purple}10,${T.bg2})`,borderBottom:`1px solid ${T.bdr}`}}>
        <div onClick={()=>setShowAI(false)} style={{cursor:"pointer",padding:6,borderRadius:10,background:T.w08}}><Ic d={P.close} s={20} c={T.sub}/></div>
        <div style={{width:36,height:36,borderRadius:14,background:`linear-gradient(135deg,${T.purple},#5b21b6)`,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={P.ai} s={20} c="#fff"/></div>
        <div style={{flex:1}}><div style={{fontSize:17,fontWeight:800}}>MASTRO AI</div></div>
      </div>
      <div style={{display:"flex",gap:6,padding:"10px 16px",overflow:"auto",flexShrink:0}}>
        {["Oggi","Stato","Rossi","Prezzi"].map(q=><button key={q} onClick={()=>{setAiChat(p=>[...p,{r:"user",t:q}]);setAiLoad(true);setTimeout(()=>{setAiChat(p=>[...p,{r:"ai",t:getAI(q)}]);setAiLoad(false);},500);}} style={S.btnSm(T.w08,T.sub)}>{q}</button>)}
      </div>
      <div style={{flex:1,overflow:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        {aiChat.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.r==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"85%",padding:"14px 18px",borderRadius:18,borderBottomRightRadius:m.r==="user"?4:18,borderBottomLeftRadius:m.r==="user"?18:4,background:m.r==="user"?T.accBg:T.card,border:`1px solid ${m.r==="user"?T.acc+"30":T.bdr}`,boxShadow:T.shadow}}><div style={{fontSize:14,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.t}</div></div></div>)}
        {aiLoad&&<div style={{display:"flex",gap:6,padding:12}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:4,background:T.purple,animation:`pulse 1s ${i*0.2}s infinite`}}/>)}</div>}
      </div>
      <div style={{padding:"10px 16px 14px",background:T.bg2,borderTop:`1px solid ${T.bdr}`,display:"flex",gap:8}}><input value={aiIn} onChange={e=>setAiIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI()} placeholder="Chiedi..." style={{...S.inp,flex:1}}/><button onClick={sendAI} style={{width:48,height:48,borderRadius:16,background:aiIn.trim()?T.purple:T.w08,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:aiIn.trim()?T.shadow:"none"}}><Ic d={P.send} s={20} c={aiIn.trim()?"#fff":T.sub2}/></button></div>
    </div>}

    {/* ═══ MODALS ═══ */}
    {showNewCl&&<div style={S.modal} onClick={()=>setShowNewCl(false)}><div style={S.mBox} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:18,fontWeight:800,marginBottom:20}}>Nuova Commessa</div>
      {[{l:"Cognome *",k:"cognome"},{l:"Nome *",k:"nome"},{l:"Telefono",k:"tel"},{l:"Indirizzo",k:"ind"}].map(f=><div key={f.k} style={{marginBottom:14}}><div style={S.lbl}>{f.l}</div><input value={newCl[f.k]} onChange={e=>setNewCl(p=>({...p,[f.k]:e.target.value}))} style={S.inp}/></div>)}
      <div style={{marginBottom:14}}><div style={S.lbl}>Sistema</div><select value={newCl.sId} onChange={e=>setNewCl(p=>({...p,sId:parseInt(e.target.value)}))} style={S.sel}>{sistemi.map(s=><option key={s.id} value={s.id}>{s.marca} {s.sistema}</option>)}</select></div>
      <div style={{marginBottom:14}}><div style={S.lbl}>Colore Telaio</div><select value={newCl.colTId} onChange={e=>setNewCl(p=>({...p,colTId:parseInt(e.target.value)}))} style={S.sel}>{colori.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
      <div style={{marginBottom:20}}><div style={S.lbl}>Colore Accessori</div><select value={newCl.colAId} onChange={e=>setNewCl(p=>({...p,colAId:parseInt(e.target.value)}))} style={S.sel}>{colori.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
      <button onClick={addCl} style={S.btn(T.grad,"#fff")}>Crea Commessa</button>
    </div></div>}

    {showAddTask&&<div style={S.modal} onClick={()=>setShowAddTask(false)}><div style={S.mBox} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:18,fontWeight:800,marginBottom:20}}>Nuovo Task</div>
      <div style={{marginBottom:14}}><div style={S.lbl}>Descrizione *</div><input value={newTask} onChange={e=>setNewTask(e.target.value)} style={S.inp}/></div>
      <div style={{marginBottom:20}}><div style={S.lbl}>Priorità</div><div style={{display:"flex",gap:8}}>{["alta","media","bassa"].map(p=><button key={p} onClick={()=>setNewTaskPri(p)} style={{flex:1,padding:12,borderRadius:12,background:newTaskPri===p?{alta:T.red,media:T.acc,bassa:T.sub2}[p]+"15":"transparent",border:`2px solid ${newTaskPri===p?{alta:T.red,media:T.acc,bassa:T.sub2}[p]:"transparent"}`,color:{alta:T.red,media:T.acc,bassa:T.sub}[p],fontSize:13,fontWeight:600,cursor:"pointer"}}>{p[0].toUpperCase()+p.slice(1)}</button>)}</div></div>
      <button onClick={addTask} style={S.btn(T.grad,"#fff")}>Aggiungi</button>
    </div></div>}

    {showAddTeam&&<div style={S.modal} onClick={()=>setShowAddTeam(false)}><div style={S.mBox} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:18,fontWeight:800,marginBottom:20}}>Nuovo Membro</div>
      {[{l:"Nome *",k:"nome"},{l:"Ruolo",k:"ruolo"},{l:"Compiti",k:"compiti"}].map(f=><div key={f.k} style={{marginBottom:14}}><div style={S.lbl}>{f.l}</div><input value={newTeamD[f.k]} onChange={e=>setNewTeamD(p=>({...p,[f.k]:e.target.value}))} style={S.inp}/></div>)}
      <div style={{marginBottom:20}}><div style={S.lbl}>Colore</div><div style={{display:"flex",gap:8}}>{["#e67e22","#2563eb","#059669","#7c3aed","#fb923c","#dc2626"].map(c=><div key={c} onClick={()=>setNewTeamD(p=>({...p,col:c}))} style={{width:40,height:40,borderRadius:14,background:c,border:newTeamD.col===c?"3px solid #fff":"2px solid transparent",cursor:"pointer",boxShadow:newTeamD.col===c?T.shadow:"none"}}/>)}</div></div>
      <button onClick={()=>{if(!newTeamD.nome)return;setTeam(p=>[...p,{id:Date.now().toString(),nome:newTeamD.nome,ruolo:newTeamD.ruolo,compiti:newTeamD.compiti,av:newTeamD.nome[0].toUpperCase(),col:newTeamD.col}]);setNewTeamD({nome:"",ruolo:"",compiti:"",col:"#e67e22"});setShowAddTeam(false);}} style={S.btn(T.grad,"#fff")}>Aggiungi</button>
    </div></div>}

    {showAddColor&&<div style={S.modal} onClick={()=>setShowAddColor(false)}><div style={S.mBox} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:18,fontWeight:800,marginBottom:20}}>Nuovo Colore</div>
      <div style={{marginBottom:14}}><div style={S.lbl}>Nome *</div><input value={newColor.nome} onChange={e=>setNewColor(p=>({...p,nome:e.target.value}))} placeholder="RAL 9016 Bianco" style={S.inp}/></div>
      <div style={{marginBottom:14}}><div style={S.lbl}>Hex</div><div style={{display:"flex",gap:10,alignItems:"center"}}><input type="color" value={newColor.hex} onChange={e=>setNewColor(p=>({...p,hex:e.target.value}))} style={{width:52,height:44,border:"none",borderRadius:12,cursor:"pointer"}}/><input value={newColor.hex} onChange={e=>setNewColor(p=>({...p,hex:e.target.value}))} style={{...S.inp,flex:1}}/></div></div>
      <div style={{marginBottom:20}}><div style={S.lbl}>Tipo</div><div style={{display:"flex",gap:8}}>{["ral","legno"].map(t=><button key={t} onClick={()=>setNewColor(p=>({...p,tipo:t}))} style={{flex:1,padding:12,borderRadius:12,background:newColor.tipo===t?T.accBg:"transparent",border:`2px solid ${newColor.tipo===t?T.acc:"transparent"}`,color:newColor.tipo===t?T.acc:T.sub,fontSize:13,fontWeight:600,cursor:"pointer"}}>{t==="ral"?"RAL":"Legno"}</button>)}</div></div>
      <button onClick={()=>{if(!newColor.nome)return;setColori(p=>[...p,{id:Date.now(),nome:newColor.nome,hex:newColor.hex,tipo:newColor.tipo}]);setNewColor({nome:"",hex:"#ffffff",tipo:"ral"});setShowAddColor(false);}} style={S.btn(T.grad,"#fff")}>Aggiungi</button>
    </div></div>}

    {/* ═══ MODAL: Nuovo Vano ═══ */}
    {showNewVano&&<div style={S.modal} onClick={()=>setShowNewVano(false)}><div style={S.mBox} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:18,fontWeight:800,marginBottom:20}}>Nuovo Vano</div>
      <div style={{marginBottom:14}}><div style={S.lbl}>Nome *</div><input value={newVano.nome} onChange={e=>setNewVano(p=>({...p,nome:e.target.value}))} placeholder="es. Soggiorno, Camera..." style={S.inp}/></div>
      <div style={{marginBottom:14}}><div style={S.lbl}>Tipo serramento</div><select value={newVano.tipo} onChange={e=>setNewVano(p=>({...p,tipo:e.target.value}))} style={S.sel}>
        {["F2A","PF1A","VAS","BLIND","SCOR","FISSA","PB"].map(t=><option key={t} value={t}>{t}</option>)}
      </select></div>
      <div style={{marginBottom:20}}><div style={S.lbl}>Stanza</div><input value={newVano.stanza} onChange={e=>setNewVano(p=>({...p,stanza:e.target.value}))} placeholder="es. Cucina, Bagno..." style={S.inp}/></div>
      <button onClick={addVano} style={S.btn(T.grad,"#fff")}>Crea Vano</button>
    </div></div>}

    </div></>);
}