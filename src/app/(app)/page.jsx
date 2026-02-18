'use client';
import { useState, useRef, useCallback } from "react";

const FONT="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,300&family=JetBrains+Mono:wght@400;600&display=swap";

const THEMES={
  dark:{name:"Cantiere Dark",emoji:"🌙",bg:"#0b0d12",bg2:"#10131a",card:"#161a24",card2:"#1c2130",bdr:"#222839",bdrL:"#2c3347",text:"#eeeae4",sub:"#858b9f",sub2:"#4f5568",acc:"#f0a820",accD:"#c48418",accLt:"rgba(240,168,32,0.12)",grn:"#2dd4a0",grnLt:"rgba(45,212,160,0.10)",red:"#ef6868",redLt:"rgba(239,104,104,0.10)",blue:"#5c9ff8",blueLt:"rgba(92,159,248,0.10)",purple:"#a07cf8",purpleLt:"rgba(160,124,248,0.10)",w08:"rgba(255,255,255,0.08)",w04:"rgba(255,255,255,0.04)"},
  light:{name:"Chiaro",emoji:"☀️",bg:"#f5f5f0",bg2:"#ffffff",card:"#ffffff",card2:"#f8f8f5",bdr:"#e0ddd5",bdrL:"#d0cdc5",text:"#1a1a1a",sub:"#666660",sub2:"#999990",acc:"#e09010",accD:"#c07808",accLt:"rgba(224,144,16,0.10)",grn:"#1a9e73",grnLt:"rgba(26,158,115,0.08)",red:"#dc4444",redLt:"rgba(220,68,68,0.08)",blue:"#3b7fe0",blueLt:"rgba(59,127,224,0.08)",purple:"#7c5ce0",purpleLt:"rgba(124,92,224,0.08)",w08:"rgba(0,0,0,0.06)",w04:"rgba(0,0,0,0.03)"},
  midnight:{name:"Blu Notte",emoji:"🌊",bg:"#0a1628",bg2:"#0e1d35",card:"#132444",card2:"#162a50",bdr:"#1e3a6a",bdrL:"#264880",text:"#e8eef8",sub:"#7a95c0",sub2:"#4a6590",acc:"#50a0ff",accD:"#3080e0",accLt:"rgba(80,160,255,0.12)",grn:"#40d8a8",grnLt:"rgba(64,216,168,0.10)",red:"#ff6070",redLt:"rgba(255,96,112,0.10)",blue:"#60b0ff",blueLt:"rgba(96,176,255,0.10)",purple:"#a08fff",purpleLt:"rgba(160,143,255,0.10)",w08:"rgba(255,255,255,0.08)",w04:"rgba(255,255,255,0.04)"},
};

const Ic=({d,s=20,c="#888",f="none",sw=1.8})=><svg width={s} height={s} viewBox="0 0 24 24" fill={f} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const P={back:"M15 19l-7-7 7-7",plus:"M12 4v16m8-8H4",check:"M5 13l4 4L19 7",chevR:"M9 5l7 7-7 7",close:"M6 18L18 6M6 6l12 12",phone:"M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",camera:"M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",ruler:"M6 2L2 6l12 12 4-4L6 2zm3 7l2 2",pencil:"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",trash:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",undo:"M3 10h10a5 5 0 010 10H9m-6-10l4-4m-4 4l4 4",ai:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",pdf:"M7 21h10a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z M14 4v5h5",send:"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",down:"M6 9l6 6 6-6",eye:"M15 12a3 3 0 11-6 0 3 3 0 016 0z M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7z"};

const OG=new Date();const GG=["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];const MM=["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];const MML=["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];const fmtD=d=>`${GG[d.getDay()]} ${d.getDate()} ${MM[d.getMonth()]}`;const sameD=(a,b)=>a.getDate()===b.getDate()&&a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear();

const INIT_COLORI=[{id:1,nome:"RAL 9010 Bianco",hex:"#f5f5f0",tipo:"ral"},{id:2,nome:"RAL 7016 Antracite",hex:"#383e42",tipo:"ral"},{id:3,nome:"RAL 9005 Nero",hex:"#0e0e10",tipo:"ral"},{id:4,nome:"RAL 8017 Marrone",hex:"#45322e",tipo:"ral"},{id:5,nome:"Noce",hex:"#7a5230",tipo:"legno"},{id:6,nome:"Rovere",hex:"#c8b89a",tipo:"legno"},{id:7,nome:"Douglas",hex:"#9e6b3a",tipo:"legno"}];
const INIT_FASI=[{id:"sopralluogo",label:"Sopralluogo",icon:"📍",color:"#5c9ff8"},{id:"preventivo",label:"Preventivo",icon:"📋",color:"#a07cf8"},{id:"conferma",label:"Conferma",icon:"✅",color:"#2dd4a0"},{id:"misure",label:"Misure",icon:"📐",color:"#f0a820"},{id:"ordini",label:"Ordini",icon:"📦",color:"#e879f9"},{id:"produzione",label:"Produzione",icon:"⚙️",color:"#fb923c"},{id:"posa",label:"Posa",icon:"🔧",color:"#2dd4a0"},{id:"chiusura",label:"Chiusura",icon:"🏁",color:"#34d399"}];
const INIT_TEAM=[{id:"fabio",nome:"Fabio",ruolo:"Titolare",compiti:"Sopralluoghi, preventivi",av:"F",col:"#f0a820"},{id:"marco",nome:"Marco",ruolo:"Posatore",compiti:"Posa in opera",av:"M",col:"#5c9ff8"},{id:"luca",nome:"Luca",ruolo:"Misuratore",compiti:"Rilievo misure",av:"L",col:"#2dd4a0"},{id:"sara",nome:"Sara",ruolo:"Ufficio",compiti:"Ordini, documenti",av:"S",col:"#a07cf8"}];
const INIT_SISTEMI=[{id:1,marca:"Twinsistem",sistema:"CX650",prezzoMq:280,sovRal:35,sovLegno:55,coloriIds:[1,2,3,5]},{id:2,marca:"Schüco",sistema:"AWS 75",prezzoMq:350,sovRal:40,sovLegno:65,coloriIds:[1,2,3,6]},{id:3,marca:"Rehau",sistema:"Geneo",prezzoMq:310,sovRal:38,sovLegno:58,coloriIds:[1,2,4,7]}];

const mkP=(fase,fasi)=>{const p={};let f2=false;fasi.forEach(f=>{if(f.id===fase){f2=true;p[f.id]="curr";}else if(!f2)p[f.id]="done";else p[f.id]="todo";});return p;};
const aiSmF=c=>{const f={...c};const av=a=>a.length?Math.round(a.reduce((s,v)=>s+v,0)/a.length):0;const aL=[c.L1,c.L2,c.L3].filter(Boolean),aH=[c.H1,c.H2,c.H3].filter(Boolean),aD=[c.D1,c.D2,c.D3].filter(Boolean);if(aL.length){const a=av(aL);if(!f.L1)f.L1=a+3;if(!f.L2)f.L2=a;if(!f.L3)f.L3=a-2;}if(aH.length){const a=av(aH);if(!f.H1)f.H1=a+4;if(!f.H2)f.H2=a;if(!f.H3)f.H3=a-3;}if(aD.length){const a=av(aD);if(!f.D1)f.D1=a;if(!f.D2)f.D2=a;if(!f.D3)f.D3=a;}return f;};
const aiChk=m=>{const w=[];const Ls=[m.L1,m.L2,m.L3].filter(Boolean),Hs=[m.H1,m.H2,m.H3].filter(Boolean);if(Ls.length>=2&&Math.max(...Ls)-Math.min(...Ls)>15)w.push({t:"w",m:`ΔL ${Math.max(...Ls)-Math.min(...Ls)}mm`});if(Hs.length>=2&&Math.max(...Hs)-Math.min(...Hs)>15)w.push({t:"w",m:`ΔH ${Math.max(...Hs)-Math.min(...Hs)}mm`});if(Ls.some(l=>l<300))w.push({t:"e",m:"L<300"});if(!w.length&&(Ls.length||Hs.length))w.push({t:"ok",m:"OK"});return w;};
const aiScn=()=>({L1:1000+Math.round(Math.random()*800)+3,L2:1000+Math.round(Math.random()*800),L3:1000+Math.round(Math.random()*800)-2,H1:1200+Math.round(Math.random()*1000)+5,H2:1200+Math.round(Math.random()*1000),H3:1200+Math.round(Math.random()*1000)-4,D1:80+Math.round(Math.random()*100),D2:80+Math.round(Math.random()*100),D3:80+Math.round(Math.random()*100),conf:85+Math.round(Math.random()*10)});
const aiVo=t=>{const r={};const n=t.match(/(\d{3,4})/g);if(n){["L1","L2","L3","H1","H2","H3","D1","D2","D3"].forEach((k,i)=>{if(n[i])r[k]=parseInt(n[i]);});}return r;};
const getAI=(q)=>{const l=q.toLowerCase();if(l.includes("rossi"))return"📐 Rossi — Misure 2/5";if(l.includes("oggi"))return"📅 08:30 Ferraro\n10:30 Greco\n14:00 Rossi";if(l.includes("stato"))return"📊 5 commesse · 14 vani · 3 task";if(l.includes("prezz"))return"💰 Twinsistem €280/mq\nSchüco €350/mq";return"Chiedi: stato, oggi, prezzi";};

const TabIc=({id,on,T})=>{const c=on?T.acc:T.sub2;return{
  oggi:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="2" fill={on?T.acc:"none"} stroke={c} strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="2" stroke={c} strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="2" stroke={c} strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="2" stroke={c} strokeWidth="1.5"/></svg>,
  calendario:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="3" stroke={c} strokeWidth="1.5"/><path d="M3 9h18M8 2v4M16 2v4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  task:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="3" stroke={c} strokeWidth="1.5"/><path d="M8 9l2 2 4-4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  commesse:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="3" stroke={c} strokeWidth="1.5"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke={c} strokeWidth="1.5"/></svg>,
  impostazioni:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.5"/><path d="M12 1v3m0 16v3m11-11h-3M4 12H1m17.36-7.36l-2.12 2.12M8.76 15.24l-2.12 2.12m12.72 0l-2.12-2.12M8.76 8.76L6.64 6.64" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
}[id]||null;};

export default function App(){
  const[theme,setTheme]=useState("dark");
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
  const[vaniL]=useState([
    {id:1,cId:1,nome:"Soggiorno",tipo:"F2A",stanza:"Soggiorno",mis:{L1:1400,L2:1400,L3:1400,H1:1600,H2:1600,H3:1600,D1:120,D2:120,D3:120},foto:2,done:true,acc:{tapparella:{on:true,colId:1,mis:{L:1400,H:1600}},cassonetto:{on:true,colId:1},zanzariera:{on:false},persiana:{on:false}}},
    {id:2,cId:1,nome:"Camera",tipo:"PF1A",stanza:"Camera",mis:{L1:900,L2:900,L3:900,H1:2200,H2:2200,H3:2200,D1:100,D2:100,D3:100},foto:1,done:true,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}},
    {id:3,cId:1,nome:"Bagno",tipo:"VAS",stanza:"Bagno",mis:{},foto:0,done:false,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}},
    {id:4,cId:1,nome:"Cucina",tipo:"F2A",stanza:"Cucina",mis:{},foto:0,done:false,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}},
    {id:5,cId:1,nome:"Ingresso",tipo:"BLIND",stanza:"Ingresso",mis:{},foto:0,done:false,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}}
  ]);
  const[appunti]=useState([
    {id:1,cId:3,ora:"08:30",dur:"1h",tipo:"Sopralluogo",date:new Date(OG.getFullYear(),OG.getMonth(),OG.getDate()),color:"#5c9ff8"},
    {id:2,cId:2,ora:"10:30",dur:"45min",tipo:"Preventivo",date:new Date(OG.getFullYear(),OG.getMonth(),OG.getDate()),color:"#a07cf8"},
    {id:3,cId:1,ora:"14:00",dur:"1h30",tipo:"Misure",date:new Date(OG.getFullYear(),OG.getMonth(),OG.getDate()),color:"#f0a820"}
  ]);
  const[tasks,setTasks]=useState([{id:1,testo:"Metro laser da Rossi",fatto:false,pri:"alta"},{id:2,testo:"Conferma colore Bruno",fatto:false,pri:"media"},{id:3,testo:"Ordine guarnizioni",fatto:true,pri:"bassa"},{id:4,testo:"Foto difetti Popilia",fatto:false,pri:"alta"}]);
  const[calV,setCalV]=useState("mese");
  const[calM,setCalM]=useState(new Date(OG.getFullYear(),OG.getMonth(),1));
  const[calS,setCalS]=useState(OG);
  const[mis,setMis]=useState({});
  const[actM,setActM]=useState(null);
  const[inpV,setInpV]=useState("");
  const[accSt,setAccSt]=useState({tapparella:{on:false,colId:null,mis:{}},cassonetto:{on:false,colId:null},zanzariera:{on:false,colId:null,mis:{}},persiana:{on:false,colId:null,mis:{}}});
  const[drawing,setDrawing]=useState([]);
  const[isDrw,setIsDrw]=useState(false);
  const[drwCol,setDrwCol]=useState("#f0a820");
  const canvasRef=useRef(null);
  const[showNewCl,setShowNewCl]=useState(false);
  const[newCl,setNewCl]=useState({nome:"",cognome:"",tel:"",ind:"",sId:1,colTId:1,colAId:1});
  const[showAI,setShowAI]=useState(false);
  const[aiIn,setAiIn]=useState("");
  const[aiChat,setAiChat]=useState([{r:"ai",t:"Ciao! MASTRO AI — chiedi stato, programma, prezzi..."}]);
  const[aiLoad,setAiLoad]=useState(false);
  const[showVoice,setShowVoice]=useState(false);
  const[voiceTxt,setVoiceTxt]=useState("");
  const[scanRes,setScanRes]=useState(null);
  const[showAnom,setShowAnom]=useState(false);
  const[showAddTask,setShowAddTask]=useState(false);
  const[newTask,setNewTask]=useState("");
  const[newTaskPri,setNewTaskPri]=useState("media");
  const[commF,setCommF]=useState("tutte");
  const[sTab,setSTab]=useState("generali");
  const[editTeamId,setEditTeamId]=useState(null);
  const[editTeamData,setEditTeamData]=useState({});
  const[newColor,setNewColor]=useState({nome:"",hex:"#ffffff",tipo:"ral"});
  const[showAddColor,setShowAddColor]=useState(false);
  const[showAddTeam,setShowAddTeam]=useState(false);
  const[newTeamD,setNewTeamD]=useState({nome:"",ruolo:"",compiti:"",col:"#f0a820"});

  const gCol=id=>colori.find(c=>c.id===id);const gSys=id=>sistemi.find(s=>s.id===id);
  const ogA=appunti.filter(a=>sameD(a.date,OG));const opT=tasks.filter(t=>!t.fatto).length;
  const filC=commF==="tutte"?cantieri:cantieri.filter(c=>c.fase===commF);const filled=Object.values(mis).filter(v=>v>0).length;

  /* Styles - MASTRO v8 clean */
  const S={
    header:{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,background:T.bg2,borderBottom:`1px solid ${T.bdr}`,minHeight:56,flexShrink:0},
    hT:{fontSize:17,fontWeight:700,letterSpacing:"-0.02em"},
    hS:{fontSize:11,color:T.sub,marginTop:1},
    card:{background:T.card,borderRadius:14,border:`1px solid ${T.bdr}`,margin:"0 12px 10px",padding:14,cursor:"pointer"},
    badge:(bg,c)=>({display:"inline-flex",padding:"3px 8px",borderRadius:6,fontSize:10,fontWeight:600,background:bg,color:c}),
    btn:(bg,c="#fff")=>({display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"12px 20px",borderRadius:12,background:bg,color:c,fontSize:14,fontWeight:600,border:"none",cursor:"pointer",width:"100%"}),
    inp:{width:"100%",background:T.bg,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"10px 14px",color:T.text,fontSize:14,outline:"none",fontFamily:"'DM Sans'"},
    sel:{width:"100%",background:T.bg,border:`1px solid ${T.bdr}`,borderRadius:10,padding:"10px 14px",color:T.text,fontSize:14,outline:"none",fontFamily:"'DM Sans'",appearance:"auto"},
    modal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200},
    mBox:{width:"100%",maxWidth:500,background:T.bg2,borderRadius:"20px 20px 0 0",padding:"20px 16px 24px",maxHeight:"85vh",overflow:"auto"},
    pill:on=>({padding:"6px 16px",borderRadius:20,fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:on?T.acc:T.w08,color:on?"#000":T.sub}),
    lbl:{fontSize:11,color:T.sub,fontWeight:600,marginBottom:4},
  };

  const goBack=()=>{if(scr==="vano"){setScr("cantiere");setSelV(null);setActM(null);setScanRes(null);setShowAnom(false);setShowVoice(false);}else if(scr==="draw")setScr("vano");else{setScr(null);setSelC(null);}};
  const openC=c=>{setSelC(c);setScr("cantiere");};
  const openV=v=>{setSelV(v);setMis(v.mis||{});setAccSt(v.acc||{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}});setScanRes(null);setShowAnom(false);setShowVoice(false);setScr("vano");};
  const sendAI=()=>{if(!aiIn.trim())return;setAiChat(p=>[...p,{r:"user",t:aiIn.trim()}]);const q=aiIn;setAiIn("");setAiLoad(true);setTimeout(()=>{setAiChat(p=>[...p,{r:"ai",t:getAI(q)}]);setAiLoad(false);},500);};
  const addTask=()=>{if(!newTask.trim())return;setTasks(p=>[...p,{id:Date.now(),testo:newTask.trim(),fatto:false,pri:newTaskPri}]);setNewTask("");setShowAddTask(false);};
  const addCl=()=>{if(!newCl.nome||!newCl.cognome)return;const nc={id:Date.now(),cliente:`${newCl.cognome} ${newCl.nome}`,ind:newCl.ind||"—",tel:newCl.tel,vani:0,fase:fasi[0].id,note:"",sId:newCl.sId,colTId:newCl.colTId,colAId:newCl.colAId,pipe:mkP(fasi[0].id,fasi)};setCantieri(p=>[...p,nc]);setNewCl({nome:"",cognome:"",tel:"",ind:"",sId:1,colTId:1,colAId:1});setShowNewCl(false);setSelC(nc);setScr("cantiere");};
  const prevC=c=>{const cv=vaniL.filter(v=>v.cId===c.id);const sy=gSys(c.sId);if(!cv.length||!sy)return null;let tot=0;cv.forEach(v=>{const m=v.mis;const L=Math.max(m.L1||0,m.L2||0,m.L3||0),H=Math.max(m.H1||0,m.H2||0,m.H3||0);if(L&&H){const mq=(L*H)/1e6;let p=mq*sy.prezzoMq;const ct=gCol(c.colTId);if(ct?.tipo==="ral"&&ct.id!==1)p+=mq*sy.sovRal;if(ct?.tipo==="legno")p+=mq*sy.sovLegno;p+=80;tot+=p;}});return{net:Math.round(tot),iva:Math.round(tot*1.22),n:cv.length};};
  const exportPDF=c=>{const cv=vaniL.filter(v=>v.cId===c.id);const sy=gSys(c.sId);const ct=gCol(c.colTId);const prev=prevC(c);let txt=`MASTRO MISURE - REPORT\n${"=".repeat(40)}\n\nCliente: ${c.cliente}\nIndirizzo: ${c.ind}\nTel: ${c.tel}\nFase: ${c.fase}\nSistema: ${sy?sy.marca+" "+sy.sistema:"—"}\nColore: ${ct?ct.nome:"—"}\n\nVANI (${cv.length}):\n`;cv.forEach(v=>{txt+=`\n  ${v.nome} (${v.tipo}) - ${v.stanza}`;const m=v.mis;if(m.L1)txt+=`\n    L: ${m.L1}/${m.L2||"—"}/${m.L3||"—"} mm`;if(m.H1)txt+=`\n    H: ${m.H1}/${m.H2||"—"}/${m.H3||"—"} mm`;if(m.D1)txt+=`\n    D: ${m.D1}/${m.D2||"—"}/${m.D3||"—"} mm`;txt+=`\n    Stato: ${v.done?"✅":"⏳"}`;});if(prev)txt+=`\n\nPREVENTIVO:\n  Netto: €${prev.net}\n  IVA: €${prev.iva}`;txt+=`\n\n${"=".repeat(40)}\nGenerato: ${new Date().toLocaleString("it-IT")}`;const blob=new Blob([txt],{type:"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${c.cliente.replace(/\s/g,"_")}_report.txt`;a.click();URL.revokeObjectURL(url);};

  const getPos=useCallback(e=>{if(!canvasRef.current)return{x:0,y:0};const r=canvasRef.current.getBoundingClientRect();const ct=e.touches?e.touches[0]:e;return{x:ct.clientX-r.left,y:ct.clientY-r.top};},[]);
  const startD=useCallback(e=>{e.preventDefault();setIsDrw(true);setDrawing(pr=>[...pr,{pts:[getPos(e)],col:drwCol,w:3}]);},[drwCol,getPos]);
  const moveD=useCallback(e=>{if(!isDrw)return;e.preventDefault();setDrawing(pr=>{const c=[...pr];if(c.length)c[c.length-1]={...c[c.length-1],pts:[...c[c.length-1].pts,getPos(e)]};return c;});},[isDrw,getPos]);
  const endD=useCallback(()=>setIsDrw(false),[]);

  return(<>
    <link href={FONT} rel="stylesheet"/>
    <style>{`*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}::-webkit-scrollbar{width:0}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    <div style={{width:"100%",height:"100dvh",background:T.bg,fontFamily:"'DM Sans',system-ui",color:T.text,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>

    {/* ═══ OGGI ═══ */}
    {!scr&&tab==="oggi"&&<><div style={S.header}>
      <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.acc},${T.accD})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:"#000"}}>M</div>
      <div style={{flex:1}}><div style={S.hT}>MASTRO MISURE</div><div style={S.hS}>{fmtD(OG)} {OG.getFullYear()}</div></div>
    </div>
    <div style={{flex:1,overflow:"auto",paddingBottom:8}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,padding:"12px 12px 8px"}}>
        {[{l:"Appuntamenti",v:ogA.length,c:T.acc,ico:"📅",go:"calendario"},{l:"Task aperti",v:opT,c:T.red,ico:"📋",go:"task"},{l:"Commesse",v:cantieri.length,c:T.grn,ico:"📦",go:"commesse"}].map((s,i)=>(
          <div key={i} onClick={()=>setTab(s.go)} style={{background:T.card,borderRadius:14,border:`1px solid ${T.bdr}`,padding:"14px 12px",cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:18}}>{s.ico}</span><span style={{fontSize:24,fontWeight:700,color:s.c,fontFamily:"'JetBrains Mono'"}}>{s.v}</span></div>
            <div style={{fontSize:10,color:T.sub,fontWeight:500}}>{s.l}</div>
          </div>))}
      </div>
      {ogA[0]&&(()=>{const a=ogA[0];const c=cantieri.find(x=>x.id===a.cId);return c?(<div onClick={()=>openC(c)} style={{margin:"4px 12px 10px",padding:16,background:`linear-gradient(135deg,${T.card},${T.card2})`,borderRadius:16,border:`1px solid ${T.acc}30`,cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div><div style={{fontSize:10,color:T.acc,fontWeight:700,letterSpacing:"0.08em",marginBottom:4}}>PROSSIMO</div><div style={{fontSize:16,fontWeight:700}}>{c.cliente}</div></div>
          <div style={{fontSize:22,fontWeight:700,color:T.acc,fontFamily:"'JetBrains Mono'"}}>{a.ora}</div></div>
        <div style={{fontSize:12,color:T.sub}}>{c.ind}</div>
        <div style={{marginTop:8,display:"flex",gap:6}}><span style={S.badge(a.color+"20",a.color)}>{a.tipo}</span><span style={S.badge(T.w08,T.sub)}>{a.dur}</span></div>
      </div>):null;})()}
      <div style={{padding:"4px 12px 4px"}}><div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Agenda</div></div>
      {ogA.map(a=>{const c=cantieri.find(x=>x.id===a.cId);return c?(<div key={a.id} onClick={()=>openC(c)} style={{margin:"0 12px 8px",display:"flex",gap:12,alignItems:"center",padding:"12px 14px",background:T.card,borderRadius:12,border:`1px solid ${T.bdr}`,cursor:"pointer"}}>
        <div style={{width:4,height:40,borderRadius:2,background:a.color,flexShrink:0}}/>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{c.cliente}</div><div style={{fontSize:11,color:T.sub}}>{a.tipo}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:700,fontFamily:"'JetBrains Mono'"}}>{a.ora}</div><div style={{fontSize:10,color:T.sub}}>{a.dur}</div></div>
      </div>):null;})}
      <div style={{padding:"12px 12px 4px"}}><div style={{fontSize:13,fontWeight:700}}>Pipeline</div></div>
      {fasi.map(f=>{const n=cantieri.filter(c=>c.fase===f.id).length;if(!n)return null;return(<div key={f.id} onClick={()=>{setTab("commesse");setCommF(f.id);}} style={{margin:"0 12px 6px",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.card,borderRadius:10,border:`1px solid ${T.bdr}`,cursor:"pointer"}}>
        <span style={{fontSize:16}}>{f.icon}</span><span style={{flex:1,fontSize:13,fontWeight:500}}>{f.label}</span><span style={{fontSize:16,fontWeight:700,color:f.color,fontFamily:"'JetBrains Mono'"}}>{n}</span>
      </div>);})}
    </div></>}

    {/* ═══ CALENDARIO ═══ */}
    {!scr&&tab==="calendario"&&<><div style={S.header}>
      <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.acc},${T.accD})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:"#000"}}>M</div>
      <div style={{flex:1}}><div style={S.hT}>Calendario</div><div style={S.hS}>{MML[calM.getMonth()]} {calM.getFullYear()}</div></div>
    </div>
    <div style={{flex:1,overflow:"auto"}}>
      <div style={{display:"flex",gap:6,padding:"12px 12px 8px"}}>{["giorno","settimana","mese"].map(v=><button key={v} onClick={()=>setCalV(v)} style={S.pill(calV===v)}>{v[0].toUpperCase()+v.slice(1)}</button>)}</div>
      {calV==="mese"&&(()=>{const yr=calM.getFullYear(),mo=calM.getMonth(),fd=new Date(yr,mo,1).getDay(),dim=new Date(yr,mo+1,0).getDate(),cells=[];for(let i=0;i<(fd===0?6:fd-1);i++)cells.push(null);for(let d=1;d<=dim;d++)cells.push(new Date(yr,mo,d));return(<>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 16px 8px"}}><div onClick={()=>setCalM(new Date(yr,mo-1,1))} style={{cursor:"pointer",padding:8}}><Ic d={P.back} s={18} c={T.sub}/></div><div style={{fontSize:15,fontWeight:700}}>{MML[mo]} {yr}</div><div onClick={()=>setCalM(new Date(yr,mo+1,1))} style={{cursor:"pointer",padding:8,transform:"rotate(180deg)"}}><Ic d={P.back} s={18} c={T.sub}/></div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,padding:"0 12px",textAlign:"center"}}>{["L","M","M","G","V","S","D"].map((g,i)=><div key={i} style={{fontSize:10,color:T.sub2,fontWeight:600,padding:4}}>{g}</div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,padding:"0 12px 12px"}}>{cells.map((day,i)=>{if(!day)return<div key={i}/>;const isT=sameD(day,OG),isS=sameD(day,calS);const hA=appunti.some(a=>sameD(a.date,day));return(<div key={i} onClick={()=>setCalS(day)} style={{textAlign:"center",padding:"8px 2px",borderRadius:10,cursor:"pointer",background:isS?T.acc+"20":"transparent",border:isT?`2px solid ${T.acc}`:"2px solid transparent"}}><div style={{fontSize:13,fontWeight:isT||isS?700:400,color:isS?T.acc:T.sub}}>{day.getDate()}</div>{hA&&<div style={{width:4,height:4,borderRadius:2,background:T.acc,margin:"2px auto 0"}}/>}</div>);})}</div></>);})()}
      {calV==="settimana"&&(()=>{const st=new Date(calS);st.setDate(st.getDate()-st.getDay()+1);return(<div style={{padding:"8px 12px"}}>{Array.from({length:7},(_,i)=>{const d=new Date(st);d.setDate(st.getDate()+i);const isT=sameD(d,OG);const as=appunti.filter(a=>sameD(a.date,d));return(<div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.bdr}`}}><div style={{width:50,textAlign:"center"}}><div style={{fontSize:10,color:T.sub}}>{GG[d.getDay()]}</div><div style={{fontSize:18,fontWeight:700,color:isT?T.acc:T.text}}>{d.getDate()}</div></div><div style={{flex:1}}>{as.length?as.map(a=>{const c=cantieri.find(x=>x.id===a.cId);return(<div key={a.id} onClick={()=>c&&openC(c)} style={{padding:"6px 10px",borderRadius:8,background:a.color+"15",borderLeft:`3px solid ${a.color}`,marginBottom:4,cursor:"pointer"}}><div style={{fontSize:12,fontWeight:600}}>{a.ora} — {c?.cliente}</div></div>);}):<div style={{fontSize:11,color:T.sub2,padding:"6px 0"}}>—</div>}</div></div>);})};</div>);})()}
      {calV==="giorno"&&(<div style={{padding:12}}><div style={{textAlign:"center",marginBottom:16}}><div style={{fontSize:12,color:T.sub}}>{GG[calS.getDay()]}</div><div style={{fontSize:32,fontWeight:700,color:T.acc}}>{calS.getDate()}</div><div style={{fontSize:13,color:T.sub}}>{MML[calS.getMonth()]}</div></div>{appunti.filter(a=>sameD(a.date,calS)).map(a=>{const c=cantieri.find(x=>x.id===a.cId);return(<div key={a.id} onClick={()=>c&&openC(c)} style={{padding:14,background:T.card,borderRadius:12,border:`1px solid ${T.bdr}`,marginBottom:8,cursor:"pointer",borderLeft:`4px solid ${a.color}`}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:15,fontWeight:700}}>{c?.cliente}</div><div style={{fontSize:18,fontWeight:700,fontFamily:"'JetBrains Mono'",color:a.color}}>{a.ora}</div></div><div style={{fontSize:12,color:T.sub,marginTop:4}}>{a.tipo} · {a.dur}</div></div>);})}</div>)}
    </div></>}

    {/* ═══ TASK ═══ */}
    {!scr&&tab==="task"&&<><div style={S.header}>
      <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.acc},${T.accD})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:"#000"}}>M</div>
      <div style={{flex:1}}><div style={S.hT}>Task</div><div style={S.hS}>{opT} aperti</div></div>
      <button onClick={()=>setShowAddTask(true)} style={{width:36,height:36,borderRadius:18,background:T.acc,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={P.plus} s={18} c="#000"/></button>
    </div>
    <div style={{flex:1,overflow:"auto"}}>
      {tasks.filter(t=>!t.fatto).length>0&&<div style={{padding:"12px 12px 4px",fontSize:11,fontWeight:600,color:T.sub}}>DA FARE</div>}
      {tasks.filter(t=>!t.fatto).map(t=>(<div key={t.id} style={{margin:"0 12px 8px",display:"flex",gap:12,alignItems:"center",padding:"12px 14px",background:T.card,borderRadius:12,border:`1px solid ${T.bdr}`}}>
        <div onClick={()=>setTasks(ts=>ts.map(x=>x.id===t.id?{...x,fatto:true}:x))} style={{width:24,height:24,borderRadius:8,border:`2px solid ${{alta:T.red,media:T.acc,bassa:T.sub2}[t.pri]}`,cursor:"pointer",flexShrink:0}}/>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500}}>{t.testo}</div></div>
        <div style={{width:8,height:8,borderRadius:4,background:{alta:T.red,media:T.acc,bassa:T.sub2}[t.pri]}}/>
      </div>))}
      {tasks.filter(t=>t.fatto).length>0&&<div style={{padding:"12px 12px 4px",fontSize:11,fontWeight:600,color:T.sub}}>COMPLETATI</div>}
      {tasks.filter(t=>t.fatto).map(t=>(<div key={t.id} style={{margin:"0 12px 8px",display:"flex",gap:12,alignItems:"center",padding:"12px 14px",background:T.w04,borderRadius:12,border:`1px solid ${T.bdr}`,opacity:0.5}}>
        <div style={{width:24,height:24,borderRadius:8,background:T.grn+"30",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={P.check} s={14} c={T.grn}/></div>
        <div style={{flex:1,textDecoration:"line-through",fontSize:13,color:T.sub}}>{t.testo}</div>
      </div>))}
    </div></>}

    {/* ═══ COMMESSE ═══ */}
    {!scr&&tab==="commesse"&&<><div style={S.header}>
      <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.acc},${T.accD})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:"#000"}}>M</div>
      <div style={{flex:1}}><div style={S.hT}>Commesse</div><div style={S.hS}>{cantieri.length} attive</div></div>
      <button onClick={()=>setShowNewCl(true)} style={{width:36,height:36,borderRadius:18,background:T.acc,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={P.plus} s={18} c="#000"/></button>
    </div>
    <div style={{flex:1,overflow:"auto"}}>
      <div style={{display:"flex",gap:6,padding:"8px 12px",overflow:"auto"}}><button onClick={()=>setCommF("tutte")} style={S.pill(commF==="tutte")}>Tutte</button>{fasi.map(f=>{const n=cantieri.filter(c=>c.fase===f.id).length;if(!n)return null;return<button key={f.id} onClick={()=>setCommF(f.id)} style={{...S.pill(commF===f.id),background:commF===f.id?f.color:T.w08,whiteSpace:"nowrap"}}>{f.icon} {n}</button>;})}</div>
      {filC.map(c=>{const fi=fasi.findIndex(f=>f.id===c.fase);const fase=fasi[fi]||fasi[0];const sy=gSys(c.sId);const ct=gCol(c.colTId);return(<div key={c.id} onClick={()=>openC(c)} style={{margin:"0 12px 8px",padding:14,background:T.card,borderRadius:14,border:`1px solid ${T.bdr}`,cursor:"pointer",borderLeft:`4px solid ${fase.color}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
          <div><div style={{fontSize:15,fontWeight:700}}>{c.cliente}</div><div style={{fontSize:11,color:T.sub,marginTop:2}}>{c.ind}</div></div>
          <span style={S.badge(fase.color+"20",fase.color)}>{fase.icon} {fase.label}</span>
        </div>
        <div style={{display:"flex",gap:3,marginTop:8}}>{fasi.map((f,i)=><div key={f.id} style={{flex:1,height:4,borderRadius:2,background:i<=fi?fase.color:T.w08}}/>)}</div>
        <div style={{display:"flex",gap:8,marginTop:8,fontSize:11,color:T.sub}}><span style={{fontWeight:600,color:T.text}}>{c.vani}v</span>{sy&&<span>{sy.marca}</span>}{ct&&<span style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:8,height:8,borderRadius:4,background:ct.hex,border:`1px solid ${T.bdr}`}}/>{ct.nome}</span>}</div>
      </div>);})}
    </div></>}

    {/* ═══ IMPOSTAZIONI ═══ */}
    {!scr&&tab==="impostazioni"&&<><div style={S.header}>
      <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.acc},${T.accD})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:"#000"}}>M</div>
      <div style={{flex:1}}><div style={S.hT}>Impostazioni</div></div>
    </div>
    <div style={{flex:1,overflow:"auto"}}>
      {/* Profile */}
      <div style={{padding:20,textAlign:"center"}}><div style={{width:72,height:72,borderRadius:36,background:T.acc+"25",border:`2px solid ${T.acc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:700,color:T.acc,margin:"0 auto 12px"}}>F</div><div style={{fontSize:20,fontWeight:700}}>Fabio</div><div style={{fontSize:13,color:T.sub}}>Walter Cozza Serramenti</div></div>

      {/* Sub-tabs */}
      <div style={{display:"flex",gap:6,padding:"0 12px 12px",overflow:"auto"}}>
        {[{id:"generali",l:"Generali"},{id:"team",l:"Team"},{id:"colori",l:"Colori"},{id:"pipeline",l:"Pipeline"},{id:"sistemi",l:"Sistemi"}].map(st=><button key={st.id} onClick={()=>setSTab(st.id)} style={S.pill(sTab===st.id)}>{st.l}</button>)}
      </div>

      {/* GENERALI - Temi + Stats */}
      {sTab==="generali"&&<>
        <div style={S.card}><div style={S.lbl}>TEMA</div>
          <div style={{display:"flex",gap:8}}>{Object.entries(THEMES).map(([k,th])=><div key={k} onClick={()=>setTheme(k)} style={{flex:1,padding:12,borderRadius:12,background:th.bg,border:`2px solid ${theme===k?th.acc:th.bdr}`,cursor:"pointer",textAlign:"center"}}><div style={{fontSize:18,marginBottom:4}}>{th.emoji}</div><div style={{fontSize:10,fontWeight:600,color:th.text}}>{th.name}</div></div>)}</div>
        </div>
        <div style={S.card}><div style={S.lbl}>STATISTICHE</div>
          {[{l:"Commesse",v:cantieri.length},{l:"Vani totali",v:cantieri.reduce((s,c)=>s+c.vani,0)},{l:"Task aperti",v:opT},{l:"Colori",v:colori.length}].map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<3?`1px solid ${T.bdr}`:"none"}}><span style={{fontSize:13,color:T.sub}}>{s.l}</span><span style={{fontSize:14,fontWeight:700,fontFamily:"'JetBrains Mono'"}}>{s.v}</span></div>)}
        </div>
      </>}

      {/* TEAM - Add/Edit/Delete */}
      {sTab==="team"&&<>
        <div style={{padding:"0 12px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13,fontWeight:700}}>Team ({team.length})</div><button onClick={()=>setShowAddTeam(true)} style={{background:T.accLt,color:T.acc,border:"none",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Aggiungi</button></div>
        {team.map(m=><div key={m.id} style={{margin:"0 12px 8px",padding:14,background:T.card,borderRadius:14,border:`1px solid ${T.bdr}`}}>
          {editTeamId===m.id?<>
            <div style={{marginBottom:8}}><div style={S.lbl}>Nome</div><input value={editTeamData.nome||""} onChange={e=>setEditTeamData(p=>({...p,nome:e.target.value}))} style={S.inp}/></div>
            <div style={{marginBottom:8}}><div style={S.lbl}>Ruolo</div><input value={editTeamData.ruolo||""} onChange={e=>setEditTeamData(p=>({...p,ruolo:e.target.value}))} style={S.inp}/></div>
            <div style={{marginBottom:8}}><div style={S.lbl}>Compiti</div><input value={editTeamData.compiti||""} onChange={e=>setEditTeamData(p=>({...p,compiti:e.target.value}))} style={S.inp}/></div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setTeam(p=>p.map(x=>x.id===m.id?{...x,...editTeamData,av:editTeamData.nome?editTeamData.nome[0].toUpperCase():m.av}:x));setEditTeamId(null);}} style={{...S.btn(T.acc,"#000"),flex:1,padding:10,fontSize:12}}>Salva</button>
              <button onClick={()=>setEditTeamId(null)} style={{...S.btn(T.w08,T.sub),flex:1,padding:10,fontSize:12}}>Annulla</button>
            </div>
          </>:<div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:20,background:m.col+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:m.col,border:`1.5px solid ${m.col}40`,flexShrink:0}}>{m.av}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{m.nome}</div><div style={{fontSize:11,color:T.sub}}>{m.ruolo} · {m.compiti}</div></div>
            <div style={{display:"flex",gap:4}}>
              <div onClick={()=>{setEditTeamId(m.id);setEditTeamData({nome:m.nome,ruolo:m.ruolo,compiti:m.compiti});}} style={{cursor:"pointer",padding:6}}><Ic d={P.pencil} s={16} c={T.sub}/></div>
              {m.id!=="fabio"&&<div onClick={()=>setTeam(p=>p.filter(x=>x.id!==m.id))} style={{cursor:"pointer",padding:6}}><Ic d={P.trash} s={16} c={T.red}/></div>}
            </div>
          </div>}
        </div>)}
      </>}

      {/* COLORI - Add/Delete */}
      {sTab==="colori"&&<>
        <div style={{padding:"0 12px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13,fontWeight:700}}>Catalogo Colori ({colori.length})</div><button onClick={()=>setShowAddColor(true)} style={{background:T.accLt,color:T.acc,border:"none",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Aggiungi</button></div>
        {["ral","legno"].map(tipo=>{const items=colori.filter(c=>c.tipo===tipo);if(!items.length)return null;return<div key={tipo}>
          <div style={{padding:"4px 16px 4px",fontSize:11,fontWeight:600,color:T.sub}}>{tipo==="ral"?"RAL":"EFFETTO LEGNO"}</div>
          {items.map(c=><div key={c.id} style={{margin:"0 12px 6px",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.card,borderRadius:10,border:`1px solid ${T.bdr}`}}>
            <div style={{width:32,height:32,borderRadius:8,background:c.hex,border:`1px solid ${T.bdr}`,flexShrink:0}}/>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{c.nome}</div><div style={{fontSize:10,color:T.sub}}>{c.hex}</div></div>
            <div onClick={()=>setColori(p=>p.filter(x=>x.id!==c.id))} style={{cursor:"pointer",padding:6}}><Ic d={P.trash} s={16} c={T.red}/></div>
          </div>)}
        </div>;})}
      </>}

      {/* PIPELINE - Reorder */}
      {sTab==="pipeline"&&<>
        <div style={{padding:"0 12px 8px"}}><div style={{fontSize:13,fontWeight:700}}>Fasi Pipeline ({fasi.length})</div><div style={{fontSize:11,color:T.sub,marginTop:2}}>Usa ▲▼ per riordinare</div></div>
        {fasi.map((f,i)=><div key={f.id} style={{margin:"0 12px 6px",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.card,borderRadius:10,border:`1px solid ${T.bdr}`}}>
          <span style={{fontSize:16}}>{f.icon}</span>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:f.color}}>{f.label}</div></div>
          <div style={{display:"flex",gap:2}}>
            {i>0&&<div onClick={()=>{const n=[...fasi];[n[i-1],n[i]]=[n[i],n[i-1]];setFasi(n);}} style={{cursor:"pointer",padding:4,transform:"rotate(180deg)"}}><Ic d={P.down} s={16} c={T.sub}/></div>}
            {i<fasi.length-1&&<div onClick={()=>{const n=[...fasi];[n[i],n[i+1]]=[n[i+1],n[i]];setFasi(n);}} style={{cursor:"pointer",padding:4}}><Ic d={P.down} s={16} c={T.sub}/></div>}
          </div>
        </div>)}
      </>}

      {/* SISTEMI */}
      {sTab==="sistemi"&&<>
        <div style={{padding:"0 12px 8px"}}><div style={{fontSize:13,fontWeight:700}}>Sistemi ({sistemi.length})</div></div>
        {sistemi.map(s=><div key={s.id} style={{margin:"0 12px 8px",padding:14,background:T.card,borderRadius:14,border:`1px solid ${T.bdr}`}}>
          <div style={{fontSize:15,fontWeight:700}}>{s.marca}</div>
          <div style={{fontSize:12,color:T.sub,marginTop:2}}>{s.sistema}</div>
          <div style={{display:"flex",gap:12,marginTop:8,fontSize:12}}>
            <span style={{color:T.acc,fontWeight:700}}>€{s.prezzoMq}/mq</span>
            <span style={{color:T.sub}}>+€{s.sovRal} RAL</span>
            <span style={{color:T.sub}}>+€{s.sovLegno} legno</span>
          </div>
          <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>{s.coloriIds.map(cid=>{const cl=gCol(cid);return cl?<div key={cid} style={{display:"flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:6,background:T.w08,fontSize:10}}><div style={{width:8,height:8,borderRadius:4,background:cl.hex,border:`1px solid ${T.bdr}`}}/>{cl.nome}</div>:null;})}</div>
        </div>)}
      </>}
    </div></>}

    {/* ═══ CANTIERE ═══ */}
    {scr==="cantiere"&&selC&&(()=>{const c=selC;const fi=fasi.findIndex(f=>f.id===c.fase);const fase=fasi[fi]||fasi[0];const cv=vaniL.filter(v=>v.cId===c.id);const sy=gSys(c.sId);const ct=gCol(c.colTId);const ca=gCol(c.colAId);const prev=prevC(c);return(
      <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={S.header}><div onClick={goBack} style={{cursor:"pointer",padding:4}}><Ic d={P.back} s={20} c={T.sub}/></div><div style={{flex:1}}><div style={S.hT}>{c.cliente}</div><div style={S.hS}>{c.ind}</div></div>
          <button onClick={()=>exportPDF(c)} style={{background:T.redLt,border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Ic d={P.pdf} s={16} c={T.red}/><span style={{fontSize:11,fontWeight:600,color:T.red}}>PDF</span></button>
        </div>
        <div style={{flex:1,overflow:"auto"}}>
          {/* Progress */}
          <div style={{padding:"14px 12px 8px"}}>
            <div style={{display:"flex",gap:4,marginBottom:10}}>{fasi.map((f,i)=><div key={f.id} style={{flex:1,textAlign:"center"}}><div style={{height:6,borderRadius:3,background:i<=fi?fase.color:T.w08,marginBottom:4}}/><div style={{fontSize:11}}>{f.icon}</div></div>)}</div>
            <span style={S.badge(fase.color+"20",fase.color)}>{fase.icon} {fase.label}</span>
          </div>
          {/* Info */}
          <div style={{margin:"0 12px 10px",padding:14,background:T.card,borderRadius:14,border:`1px solid ${T.bdr}`}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12}}>
              <div><div style={S.lbl}>Sistema</div><div style={{fontWeight:600}}>{sy?`${sy.marca} ${sy.sistema}`:"—"}</div></div>
              <div><div style={S.lbl}>Colore Telaio</div><div style={{display:"flex",alignItems:"center",gap:4}}>{ct&&<div style={{width:12,height:12,borderRadius:4,background:ct.hex,border:`1px solid ${T.bdr}`}}/>}<span style={{fontWeight:600}}>{ct?.nome||"—"}</span></div></div>
              <div><div style={S.lbl}>Colore Accessori</div><div style={{display:"flex",alignItems:"center",gap:4}}>{ca&&<div style={{width:12,height:12,borderRadius:4,background:ca.hex,border:`1px solid ${T.bdr}`}}/>}<span style={{fontWeight:600}}>{ca?.nome||"—"}</span></div></div>
              <div><div style={S.lbl}>Tel</div><div style={{fontWeight:600}}>{c.tel||"—"}</div></div>
            </div>
            {c.note&&<div style={{marginTop:8,padding:8,background:T.w04,borderRadius:8,fontSize:12,color:T.sub}}>{c.note}</div>}
          </div>
          {/* Preventivo */}
          {prev&&<div style={{margin:"0 12px 10px",padding:14,background:T.purpleLt,borderRadius:14,border:`1px solid ${T.purple}30`}}>
            <div style={{fontSize:11,fontWeight:600,color:T.purple,marginBottom:8}}>💰 PREVENTIVO ({prev.n} vani)</div>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:T.sub}}>Netto</span><span style={{fontSize:16,fontWeight:700}}>€{prev.net}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:13,color:T.sub}}>IVA incl.</span><span style={{fontSize:20,fontWeight:700,color:T.purple}}>€{prev.iva}</span></div>
          </div>}
          {/* Vani */}
          <div style={{padding:"4px 12px 4px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13,fontWeight:700}}>Vani ({cv.length})</div></div>
          {cv.map(v=><div key={v.id} onClick={()=>openV(v)} style={{margin:"0 12px 8px",display:"flex",gap:10,alignItems:"center",padding:"12px 14px",background:T.card,borderRadius:12,border:`1px solid ${T.bdr}`,cursor:"pointer"}}>
            <div style={{width:40,height:40,borderRadius:10,background:v.done?T.grnLt:T.w08,display:"flex",alignItems:"center",justifyContent:"center"}}>{v.done?<Ic d={P.check} s={20} c={T.grn}/>:<Ic d={P.ruler} s={20} c={T.sub2}/>}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{v.nome}</div><div style={{fontSize:11,color:T.sub}}>{v.tipo} · {v.stanza}</div></div><Ic d={P.chevR} s={16} c={T.sub2}/>
          </div>)}
          {/* Advance */}
          <div style={{padding:12}}>{fi<fasi.length-1?<button onClick={()=>{const nf=fasi[fi+1].id;const upd=cantieri.map(x=>{if(x.id!==c.id)return x;const np={...x.pipe};np[c.fase]="done";np[nf]="curr";return{...x,fase:nf,pipe:np};});setCantieri(upd);setSelC(upd.find(x=>x.id===c.id));}} style={S.btn(`linear-gradient(135deg,${T.acc},${T.accD})`,"#000")}>✅ {fase.label.toUpperCase()} → {fasi[fi+1].label.toUpperCase()}</button>:<div style={S.btn(T.grnLt,T.grn)}>✅ COMPLETATA</div>}</div>
        </div></div>);})()}

    {/* ═══ VANO ═══ */}
    {scr==="vano"&&selV&&(()=>{const v=selV;
      const pts=[{k:"L1",x:95,y:35},{k:"L2",x:95,y:115},{k:"L3",x:95,y:195},{k:"H1",x:30,y:115},{k:"H2",x:95,y:115},{k:"H3",x:160,y:115},{k:"D1",x:185,y:35},{k:"D2",x:185,y:115},{k:"D3",x:185,y:195}];
      const tap=k=>{setActM(k);setInpV(mis[k]?String(mis[k]):"");};
      const save=()=>{if(actM&&inpV)setMis(d=>({...d,[actM]:parseInt(inpV)||0}));setActM(null);setInpV("");};
      return(
      <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={S.header}><div onClick={goBack} style={{cursor:"pointer",padding:4}}><Ic d={P.back} s={20} c={T.sub}/></div><div style={{flex:1}}><div style={S.hT}>{v.nome}</div><div style={S.hS}>{v.tipo} · {filled}/9</div></div><button onClick={()=>setScr("draw")} style={{background:T.purpleLt,border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,color:T.purple,cursor:"pointer"}}>✏️ Disegna</button></div>
        <div style={{flex:1,overflow:"auto"}}>
          {/* AI tools */}
          <div style={{display:"flex",gap:6,padding:"10px 12px",overflow:"auto",flexShrink:0}}>
            <button onClick={()=>setShowVoice(true)} style={{background:T.accLt,border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,color:T.acc,cursor:"pointer",whiteSpace:"nowrap"}}>🎤 Voce</button>
            <button onClick={()=>setScanRes(aiScn())} style={{background:T.blueLt,border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,color:T.blue,cursor:"pointer",whiteSpace:"nowrap"}}>📸 Scan</button>
            <button onClick={()=>setMis(aiSmF(mis))} style={{background:T.grnLt,border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,color:T.grn,cursor:"pointer",whiteSpace:"nowrap"}}>🧠 Fill</button>
            <button onClick={()=>setShowAnom(!showAnom)} style={{background:T.redLt,border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,color:T.red,cursor:"pointer",whiteSpace:"nowrap"}}>⚠️ Check</button>
          </div>
          {showVoice&&<div style={{margin:"0 12px 8px",padding:12,background:T.card2,borderRadius:12,border:`1px solid ${T.acc}40`}}><div style={{fontSize:11,color:T.acc,fontWeight:700,marginBottom:6}}>🎤 DETTATURA</div><div style={{display:"flex",gap:8}}><input value={voiceTxt} onChange={e=>setVoiceTxt(e.target.value)} placeholder="1400 1400 1400 1600..." style={{...S.inp,flex:1,fontSize:13}}/><button onClick={()=>{if(voiceTxt.trim()){setMis(d=>({...d,...aiVo(voiceTxt)}));setVoiceTxt("");setShowVoice(false);}}} style={{padding:"0 14px",borderRadius:8,background:T.acc,color:"#000",fontWeight:700,border:"none",cursor:"pointer"}}>OK</button></div></div>}
          {scanRes&&<div style={{margin:"0 12px 8px",padding:12,background:T.blueLt,borderRadius:12,border:`1px solid ${T.blue}30`}}><div style={{fontSize:11,color:T.blue,fontWeight:700,marginBottom:6}}>📸 SCAN — {scanRes.conf}%</div><div style={{display:"flex",gap:8,marginTop:6}}><button onClick={()=>{setMis(d=>{const n={...d};Object.keys(scanRes).forEach(k=>{if(k.match(/^[LHD]\d$/))n[k]=scanRes[k];});return n;});setScanRes(null);}} style={{flex:1,padding:8,borderRadius:8,background:T.blue,color:"#fff",fontWeight:700,border:"none",cursor:"pointer",fontSize:12}}>Applica</button><button onClick={()=>setScanRes(null)} style={{padding:"8px 14px",borderRadius:8,background:T.w08,color:T.sub,border:"none",cursor:"pointer",fontSize:12}}>Ignora</button></div></div>}
          {showAnom&&<div style={{margin:"0 12px 8px"}}>{aiChk(mis).map((w,i)=><div key={i} style={{padding:8,marginBottom:4,borderRadius:8,background:w.t==="e"?T.redLt:w.t==="w"?T.accLt:T.grnLt,fontSize:12,color:w.t==="e"?T.red:w.t==="w"?T.acc:T.grn}}>{w.t==="ok"?"✅":w.t==="e"?"🔴":"⚠️"} {w.m}</div>)}</div>}
          {/* Schema */}
          <div style={{padding:"4px 12px 8px",display:"flex",justifyContent:"center"}}><div style={{background:`linear-gradient(180deg,${T.card},${T.card2})`,borderRadius:20,border:`1px solid ${T.bdr}`,padding:16,width:"100%",maxWidth:400}}>
            <div style={{fontSize:11,color:T.acc,fontWeight:700,marginBottom:14,textAlign:"center",letterSpacing:"0.1em"}}>📐 SCHEMA VANO</div>
            <svg viewBox="0 0 220 230" style={{width:"100%"}}>
              <rect x="22" y="10" width="146" height="200" fill="none" stroke={T.bdrL} strokeWidth="8" rx="3" opacity="0.5"/><rect x="30" y="18" width="130" height="184" fill={T.bg+"60"} stroke={T.bdrL} strokeWidth="1.5" rx="2"/>
              <text x="95" y="6" textAnchor="middle" fill={T.acc} fontSize="9" fontWeight="700">LARGHEZZA</text>
              <text x="6" y="115" textAnchor="middle" fill={T.blue} fontSize="9" fontWeight="700" transform="rotate(-90,6,115)">ALTEZZA</text>
              <text x="210" y="115" textAnchor="middle" fill={T.grn} fontSize="9" fontWeight="700" transform="rotate(90,210,115)">PROFONDITÀ</text>
              {pts.map(p=>{const val=mis[p.k];const col=p.k[0]==="L"?T.acc:p.k[0]==="H"?T.blue:T.grn;return(
                <g key={p.k} onClick={()=>tap(p.k)} style={{cursor:"pointer"}}>
                  <circle cx={p.x} cy={p.y} r={val?16:14} fill={val?col+"20":T.w08} stroke={actM===p.k?col:val?col+"50":T.bdr} strokeWidth={actM===p.k?2:1.2}/>
                  <text x={p.x} y={p.y-4} textAnchor="middle" fill={val?col:T.sub2} fontSize="7" fontWeight="700">{p.k}</text>
                  <text x={p.x} y={p.y+7} textAnchor="middle" fill={val?T.text:T.sub2} fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono'">{val||"—"}</text>
                </g>);})}
            </svg>
          </div></div>
          {actM&&<div style={{margin:"0 12px 12px",padding:14,background:T.card2,borderRadius:14,border:`1px solid ${T.acc}40`}}><div style={{fontSize:12,color:T.acc,fontWeight:600,marginBottom:8}}>{actM}</div><div style={{display:"flex",gap:8}}><input type="number" value={inpV} onChange={e=>setInpV(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()} placeholder="mm" autoFocus style={{flex:1,background:T.bg,border:`1px solid ${T.bdr}`,borderRadius:10,padding:12,color:T.text,fontSize:20,fontFamily:"'JetBrains Mono'",fontWeight:700,outline:"none",textAlign:"center"}}/><button onClick={save} style={{padding:"0 20px",borderRadius:10,background:T.acc,color:"#000",fontWeight:700,border:"none",cursor:"pointer"}}>OK</button></div></div>}
          {/* Accessori con colori e misure */}
          <div style={{padding:"0 12px 12px"}}><div style={{background:T.card,borderRadius:14,border:`1px solid ${T.bdr}`,padding:14}}>
            <div style={{fontSize:11,fontWeight:600,color:T.sub,marginBottom:6}}>ACCESSORI</div>
            {["tapparella","persiana","zanzariera","cassonetto"].map(acc=>{const a=accSt[acc]||{on:false};const labels={tapparella:"🪟 Tapparella",persiana:"🏠 Persiana",zanzariera:"🦟 Zanzariera",cassonetto:"📦 Cassonetto"};const colors={tapparella:T.blue,persiana:"#fb923c",zanzariera:T.grn,cassonetto:T.purple};return(<div key={acc}>
              <div onClick={()=>setAccSt(p=>({...p,[acc]:{...p[acc],on:!p[acc]?.on}}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",cursor:"pointer"}}>
                <span style={{fontSize:13,color:a.on?T.text:T.sub}}>{labels[acc]}</span>
                <div style={{width:44,height:24,borderRadius:12,background:a.on?colors[acc]+"40":T.w08,padding:2}}><div style={{width:20,height:20,borderRadius:10,background:a.on?colors[acc]:T.sub2,transition:"all 0.2s",transform:a.on?"translateX(20px)":"translateX(0)"}}/></div>
              </div>
              {a.on&&<div style={{paddingBottom:8,paddingLeft:8,borderLeft:`2px solid ${colors[acc]}30`,marginLeft:8,marginBottom:4}}>
                <div style={{marginBottom:4}}><div style={{fontSize:10,color:T.sub}}>Colore</div><select value={a.colId||""} onChange={e=>setAccSt(p=>({...p,[acc]:{...p[acc],colId:parseInt(e.target.value)}}))} style={{...S.sel,padding:"6px 10px",fontSize:12}}>
                  <option value="">—</option>{colori.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
                </select></div>
                {(acc==="tapparella"||acc==="zanzariera")&&<div style={{display:"flex",gap:8,marginTop:4}}>
                  <div style={{flex:1}}><div style={{fontSize:10,color:T.sub}}>L (mm)</div><input type="number" value={a.mis?.L||""} onChange={e=>setAccSt(p=>({...p,[acc]:{...p[acc],mis:{...p[acc].mis,L:parseInt(e.target.value)||0}}}))} style={{...S.inp,padding:"6px 10px",fontSize:12}}/></div>
                  <div style={{flex:1}}><div style={{fontSize:10,color:T.sub}}>H (mm)</div><input type="number" value={a.mis?.H||""} onChange={e=>setAccSt(p=>({...p,[acc]:{...p[acc],mis:{...p[acc].mis,H:parseInt(e.target.value)||0}}}))} style={{...S.inp,padding:"6px 10px",fontSize:12}}/></div>
                </div>}
              </div>}
            </div>);})}
          </div></div>
          <div style={{padding:"0 12px 12px"}}><button style={{...S.btn(T.purpleLt,T.purple),borderRadius:12}}><Ic d={P.camera} s={18} c={T.purple}/> Foto ({v.foto})</button></div>
          <div style={{padding:"0 12px 20px"}}><button style={S.btn(`linear-gradient(135deg,${T.grn},#1a9e73)`)}><Ic d={P.check} s={18} c="#fff"/> SALVA MISURE</button></div>
        </div></div>);})()}

    {/* ═══ DRAW ═══ */}
    {scr==="draw"&&<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={S.header}><div onClick={goBack} style={{cursor:"pointer",padding:4}}><Ic d={P.back} s={20} c={T.sub}/></div><div style={{flex:1}}><div style={S.hT}>Disegno</div></div></div>
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",background:T.bg2,borderBottom:`1px solid ${T.bdr}`}}>
        {[T.acc,T.blue,T.red,T.grn,"#fff",T.purple].map(c=><div key={c} onClick={()=>setDrwCol(c)} style={{width:28,height:28,borderRadius:14,background:c,border:drwCol===c?"3px solid #fff":`2px solid ${T.bdr}`,cursor:"pointer"}}/>)}
        <div style={{flex:1}}/><div onClick={()=>setDrawing(p=>p.slice(0,-1))} style={{cursor:"pointer",padding:4}}><Ic d={P.undo} s={20} c={T.sub}/></div><div onClick={()=>setDrawing([])} style={{cursor:"pointer",padding:4}}><Ic d={P.trash} s={20} c={T.red}/></div>
      </div>
      <div ref={canvasRef} onMouseDown={startD} onMouseMove={moveD} onMouseUp={endD} onTouchStart={startD} onTouchMove={moveD} onTouchEnd={endD} style={{flex:1,background:T.card,position:"relative",touchAction:"none",cursor:"crosshair"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>{drawing.map((s,i)=>s.pts.length>1&&<polyline key={i} points={s.pts.map(p=>`${p.x},${p.y}`).join(" ")} fill="none" stroke={s.col} strokeWidth={s.w} strokeLinecap="round" strokeLinejoin="round"/>)}</svg>
        {!drawing.length&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",color:T.sub2}}><div style={{fontSize:40}}>✏️</div><div style={{fontSize:14,marginTop:8}}>Disegna</div></div>}
      </div>
      <div style={{padding:"8px 12px 12px",background:T.bg2}}><button onClick={goBack} style={S.btn(`linear-gradient(135deg,${T.grn},#1a9e73)`)}><Ic d={P.check} s={18} c="#fff"/> Salva</button></div>
    </div>}

    {/* ═══ TAB BAR ═══ */}
    {!scr&&<div style={{display:"flex",borderTop:`1px solid ${T.bdr}`,background:T.bg2,padding:"4px 0 max(env(safe-area-inset-bottom),6px)",flexShrink:0}}>
      {["oggi","calendario","task","commesse","impostazioni"].map(id=><div key={id} onClick={()=>setTab(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px 0",fontSize:9,fontWeight:tab===id?600:400,color:tab===id?T.acc:T.sub2,cursor:"pointer",position:"relative"}}>
        <TabIc id={id} on={tab===id} T={T}/>{id==="impostazioni"?"Imp.":id[0].toUpperCase()+id.slice(1)}
        {id==="task"&&opT>0&&<div style={{position:"absolute",top:0,right:"50%",marginRight:-18,width:16,height:16,borderRadius:8,background:T.red,fontSize:9,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{opT}</div>}
      </div>)}
    </div>}

    {/* ═══ AI FAB ═══ */}
    {!showAI&&<button onClick={()=>setShowAI(true)} style={{position:"absolute",bottom:scr?20:68,right:16,width:48,height:48,borderRadius:24,background:`linear-gradient(135deg,${T.purple},#7040d0)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(160,124,248,0.4)",cursor:"pointer",border:"none",zIndex:100}}><Ic d={P.ai} s={22} c="#fff"/></button>}

    {/* ═══ AI CHAT ═══ */}
    {showAI&&<div style={{position:"absolute",inset:0,background:T.bg,display:"flex",flexDirection:"column",zIndex:150}}>
      <div style={{...S.header,background:`linear-gradient(135deg,${T.purple}15,${T.bg2})`}}><div onClick={()=>setShowAI(false)} style={{cursor:"pointer",padding:4}}><Ic d={P.close} s={20} c={T.sub}/></div><div style={{width:32,height:32,borderRadius:16,background:`linear-gradient(135deg,${T.purple},#7040d0)`,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={P.ai} s={18} c="#fff"/></div><div style={{flex:1}}><div style={S.hT}>MASTRO AI</div></div></div>
      <div style={{display:"flex",gap:6,padding:"8px 12px",overflow:"auto",flexShrink:0}}>
        {["Oggi","Stato","Rossi","Prezzi"].map(q=><button key={q} onClick={()=>{setAiChat(p=>[...p,{r:"user",t:q}]);setAiLoad(true);setTimeout(()=>{setAiChat(p=>[...p,{r:"ai",t:getAI(q)}]);setAiLoad(false);},500);}} style={{background:T.w08,border:`1px solid ${T.bdr}`,borderRadius:20,padding:"6px 12px",fontSize:11,color:T.sub,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'DM Sans'"}}>{q}</button>)}
      </div>
      <div style={{flex:1,overflow:"auto",padding:12,display:"flex",flexDirection:"column",gap:10}}>
        {aiChat.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.r==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"85%",padding:"12px 16px",borderRadius:16,borderBottomRightRadius:m.r==="user"?4:16,borderBottomLeftRadius:m.r==="user"?16:4,background:m.r==="user"?T.acc+"20":T.card,border:`1px solid ${m.r==="user"?T.acc+"30":T.bdr}`}}><div style={{fontSize:13,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.t}</div></div></div>)}
        {aiLoad&&<div style={{display:"flex",gap:6,padding:12}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:4,background:T.purple,animation:`pulse 1s ${i*0.2}s infinite`}}/>)}</div>}
      </div>
      <div style={{padding:"8px 12px 12px",background:T.bg2,borderTop:`1px solid ${T.bdr}`,display:"flex",gap:8}}><input value={aiIn} onChange={e=>setAiIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI()} placeholder="Chiedi..." style={{...S.inp,flex:1,borderRadius:12}}/><button onClick={sendAI} style={{width:44,height:44,borderRadius:22,background:aiIn.trim()?T.purple:T.w08,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={P.send} s={20} c={aiIn.trim()?"#fff":T.sub2}/></button></div>
    </div>}

    {/* ═══ MODAL: Nuovo Cliente ═══ */}
    {showNewCl&&<div style={S.modal} onClick={()=>setShowNewCl(false)}><div style={S.mBox} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Nuova Commessa</div>
      {[{l:"Cognome *",k:"cognome"},{l:"Nome *",k:"nome"},{l:"Telefono",k:"tel"},{l:"Indirizzo",k:"ind"}].map(f=><div key={f.k} style={{marginBottom:12}}><div style={S.lbl}>{f.l}</div><input value={newCl[f.k]} onChange={e=>setNewCl(p=>({...p,[f.k]:e.target.value}))} style={S.inp}/></div>)}
      <div style={{marginBottom:12}}><div style={S.lbl}>Sistema</div><select value={newCl.sId} onChange={e=>setNewCl(p=>({...p,sId:parseInt(e.target.value)}))} style={S.sel}>{sistemi.map(s=><option key={s.id} value={s.id}>{s.marca} {s.sistema}</option>)}</select></div>
      <div style={{marginBottom:12}}><div style={S.lbl}>Colore Telaio</div><select value={newCl.colTId} onChange={e=>setNewCl(p=>({...p,colTId:parseInt(e.target.value)}))} style={S.sel}>{colori.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
      <div style={{marginBottom:16}}><div style={S.lbl}>Colore Accessori</div><select value={newCl.colAId} onChange={e=>setNewCl(p=>({...p,colAId:parseInt(e.target.value)}))} style={S.sel}>{colori.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
      <button onClick={addCl} style={S.btn(`linear-gradient(135deg,${T.acc},${T.accD})`,"#000")}>Crea Commessa</button>
    </div></div>}

    {/* ═══ MODAL: Add Task ═══ */}
    {showAddTask&&<div style={S.modal} onClick={()=>setShowAddTask(false)}><div style={S.mBox} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Nuovo Task</div>
      <div style={{marginBottom:12}}><div style={S.lbl}>Descrizione *</div><input value={newTask} onChange={e=>setNewTask(e.target.value)} style={S.inp}/></div>
      <div style={{marginBottom:16}}><div style={S.lbl}>Priorità</div><div style={{display:"flex",gap:8}}>{["alta","media","bassa"].map(p=><button key={p} onClick={()=>setNewTaskPri(p)} style={{flex:1,padding:10,borderRadius:10,background:newTaskPri===p?{alta:T.red,media:T.acc,bassa:T.sub2}[p]+"20":T.w08,border:`2px solid ${newTaskPri===p?{alta:T.red,media:T.acc,bassa:T.sub2}[p]:"transparent"}`,color:{alta:T.red,media:T.acc,bassa:T.sub}[p],fontSize:12,fontWeight:600,cursor:"pointer"}}>{p[0].toUpperCase()+p.slice(1)}</button>)}</div></div>
      <button onClick={addTask} style={S.btn(`linear-gradient(135deg,${T.acc},${T.accD})`,"#000")}>Aggiungi</button>
    </div></div>}

    {/* ═══ MODAL: Add Team ═══ */}
    {showAddTeam&&<div style={S.modal} onClick={()=>setShowAddTeam(false)}><div style={S.mBox} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Nuovo Membro</div>
      {[{l:"Nome *",k:"nome"},{l:"Ruolo",k:"ruolo"},{l:"Compiti",k:"compiti"}].map(f=><div key={f.k} style={{marginBottom:12}}><div style={S.lbl}>{f.l}</div><input value={newTeamD[f.k]} onChange={e=>setNewTeamD(p=>({...p,[f.k]:e.target.value}))} style={S.inp}/></div>)}
      <div style={{marginBottom:16}}><div style={S.lbl}>Colore</div><div style={{display:"flex",gap:8}}>{["#f0a820","#5c9ff8","#2dd4a0","#a07cf8","#fb923c","#ef6868"].map(c=><div key={c} onClick={()=>setNewTeamD(p=>({...p,col:c}))} style={{width:36,height:36,borderRadius:18,background:c,border:newTeamD.col===c?"3px solid #fff":`2px solid ${T.bdr}`,cursor:"pointer"}}/>)}</div></div>
      <button onClick={()=>{if(!newTeamD.nome)return;setTeam(p=>[...p,{id:Date.now().toString(),nome:newTeamD.nome,ruolo:newTeamD.ruolo,compiti:newTeamD.compiti,av:newTeamD.nome[0].toUpperCase(),col:newTeamD.col}]);setNewTeamD({nome:"",ruolo:"",compiti:"",col:"#f0a820"});setShowAddTeam(false);}} style={S.btn(`linear-gradient(135deg,${T.acc},${T.accD})`,"#000")}>Aggiungi</button>
    </div></div>}

    {/* ═══ MODAL: Add Color ═══ */}
    {showAddColor&&<div style={S.modal} onClick={()=>setShowAddColor(false)}><div style={S.mBox} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Nuovo Colore</div>
      <div style={{marginBottom:12}}><div style={S.lbl}>Nome *</div><input value={newColor.nome} onChange={e=>setNewColor(p=>({...p,nome:e.target.value}))} placeholder="RAL 9016 Bianco" style={S.inp}/></div>
      <div style={{marginBottom:12}}><div style={S.lbl}>Hex</div><div style={{display:"flex",gap:8}}><input type="color" value={newColor.hex} onChange={e=>setNewColor(p=>({...p,hex:e.target.value}))} style={{width:48,height:40,border:"none",borderRadius:8,cursor:"pointer"}}/><input value={newColor.hex} onChange={e=>setNewColor(p=>({...p,hex:e.target.value}))} style={{...S.inp,flex:1}}/></div></div>
      <div style={{marginBottom:16}}><div style={S.lbl}>Tipo</div><div style={{display:"flex",gap:8}}>{["ral","legno"].map(t=><button key={t} onClick={()=>setNewColor(p=>({...p,tipo:t}))} style={{flex:1,padding:10,borderRadius:10,background:newColor.tipo===t?T.accLt:T.w08,border:`2px solid ${newColor.tipo===t?T.acc:"transparent"}`,color:newColor.tipo===t?T.acc:T.sub,fontSize:12,fontWeight:600,cursor:"pointer"}}>{t==="ral"?"RAL":"Legno"}</button>)}</div></div>
      <button onClick={()=>{if(!newColor.nome)return;setColori(p=>[...p,{id:Date.now(),nome:newColor.nome,hex:newColor.hex,tipo:newColor.tipo}]);setNewColor({nome:"",hex:"#ffffff",tipo:"ral"});setShowAddColor(false);}} style={S.btn(`linear-gradient(135deg,${T.acc},${T.accD})`,"#000")}>Aggiungi</button>
    </div></div>}

    </div></>);
}