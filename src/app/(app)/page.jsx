'use client';
import { useState, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   MASTRO MISURE v12 — BOLD REDESIGN
   Gradient heroes, glass cards, big type
   ═══════════════════════════════════════════ */

const FONT="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap";

const T={
  bg:"#06080f",hero:"linear-gradient(145deg,#1a1206 0%,#0f1520 40%,#0a0810 100%)",
  card:"rgba(255,255,255,0.04)",cardB:"rgba(255,255,255,0.08)",glass:"rgba(255,255,255,0.06)",
  bdr:"rgba(255,255,255,0.07)",bdr2:"rgba(255,255,255,0.12)",
  text:"#f8f4ee",sub:"#8a8a9a",sub2:"#505060",
  acc:"#f0a020",accL:"#ffd080",accB:"rgba(240,160,32,0.15)",accBg:"linear-gradient(135deg,#f0a020,#e08010)",
  grn:"#30e898",grnB:"rgba(48,232,152,0.12)",grnBg:"linear-gradient(135deg,#30e898,#18c878)",
  red:"#ff5858",redB:"rgba(255,88,88,0.12)",redBg:"linear-gradient(135deg,#ff5858,#e03030)",
  blue:"#58a8ff",blueB:"rgba(88,168,255,0.12)",blueBg:"linear-gradient(135deg,#58a8ff,#3080e0)",
  purple:"#a080ff",purpleB:"rgba(160,128,255,0.12)",purpleBg:"linear-gradient(135deg,#a080ff,#7050e0)",
  orange:"#ff8838",
};

const Ic=({d,s=20,c="#888",f="none",sw=1.8})=><svg width={s} height={s} viewBox="0 0 24 24" fill={f} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const P={back:"M15 19l-7-7 7-7",plus:"M12 4v16m8-8H4",check:"M5 13l4 4L19 7",chevR:"M9 5l7 7-7 7",close:"M6 18L18 6M6 6l12 12",phone:"M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",camera:"M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",ruler:"M6 2L2 6l12 12 4-4L6 2zm3 7l2 2",pencil:"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",trash:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",undo:"M3 10h10a5 5 0 010 10H9m-6-10l4-4m-4 4l4 4",ai:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",pdf:"M7 21h10a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z M14 4v5h5",send:"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",down:"M6 9l6 6 6-6",eye:"M15 12a3 3 0 11-6 0 3 3 0 016 0z M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7z"};

const OG=new Date();const GG=["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];const MM=["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];const MML=["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];const fmtD=d=>`${GG[d.getDay()]} ${d.getDate()} ${MM[d.getMonth()]}`;const sameD=(a,b)=>a.getDate()===b.getDate()&&a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear();

const FASI_I=[{id:"sopralluogo",label:"Sopral.",icon:"📍",color:"#58a8ff"},{id:"preventivo",label:"Prev.",icon:"📋",color:"#a080ff"},{id:"conferma",label:"Conf.",icon:"✅",color:"#30e898"},{id:"misure",label:"Misure",icon:"📐",color:"#f0a020"},{id:"ordini",label:"Ordini",icon:"📦",color:"#e870f0"},{id:"produzione",label:"Produz.",icon:"⚙️",color:"#ff8838"},{id:"posa",label:"Posa",icon:"🔧",color:"#22c55e"},{id:"chiusura",label:"Fine",icon:"🏁",color:"#34d399"}];

const mkP=(fase,fasi)=>{const p={};let f2=false;fasi.forEach(f=>{if(f.id===fase){f2=true;p[f.id]="curr";}else if(!f2)p[f.id]="done";else p[f.id]="todo";});return p;};
const aiSmF=c=>{const f={...c};const av=a=>a.length?Math.round(a.reduce((s,v)=>s+v,0)/a.length):0;const aL=[c.L1,c.L2,c.L3].filter(Boolean),aH=[c.H1,c.H2,c.H3].filter(Boolean),aD=[c.D1,c.D2,c.D3].filter(Boolean);if(aL.length){const a=av(aL);if(!f.L1)f.L1=a+3;if(!f.L2)f.L2=a;if(!f.L3)f.L3=a-2;}if(aH.length){const a=av(aH);if(!f.H1)f.H1=a+4;if(!f.H2)f.H2=a;if(!f.H3)f.H3=a-3;}if(aD.length){const a=av(aD);if(!f.D1)f.D1=a;if(!f.D2)f.D2=a;if(!f.D3)f.D3=a;}return f;};
const aiChk=m=>{const w=[];const Ls=[m.L1,m.L2,m.L3].filter(Boolean),Hs=[m.H1,m.H2,m.H3].filter(Boolean);if(Ls.length>=2&&Math.max(...Ls)-Math.min(...Ls)>15)w.push({t:"w",m:`ΔL ${Math.max(...Ls)-Math.min(...Ls)}mm`});if(Hs.length>=2&&Math.max(...Hs)-Math.min(...Hs)>15)w.push({t:"w",m:`ΔH ${Math.max(...Hs)-Math.min(...Hs)}mm`});if(Ls.some(l=>l<300))w.push({t:"e",m:"L<300"});if(!w.length&&(Ls.length||Hs.length))w.push({t:"ok",m:"OK"});return w;};
const aiScn=()=>({L1:1000+Math.round(Math.random()*800)+3,L2:1000+Math.round(Math.random()*800),L3:1000+Math.round(Math.random()*800)-2,H1:1200+Math.round(Math.random()*1000)+5,H2:1200+Math.round(Math.random()*1000),H3:1200+Math.round(Math.random()*1000)-4,D1:80+Math.round(Math.random()*100),D2:80+Math.round(Math.random()*100),D3:80+Math.round(Math.random()*100),conf:85+Math.round(Math.random()*10)});
const aiVo=t=>{const r={};const n=t.match(/(\d{3,4})/g);if(n){["L1","L2","L3","H1","H2","H3","D1","D2","D3"].forEach((k,i)=>{if(n[i])r[k]=parseInt(n[i]);});}return r;};
const getAI=(q)=>{const l=q.toLowerCase();if(l.includes("rossi"))return"📐 Rossi — Misure 2/5";if(l.includes("oggi"))return"📅 08:30 Ferraro\n10:30 Greco\n14:00 Rossi";if(l.includes("stato"))return"📊 5 commesse · 14 vani · 3 task";if(l.includes("prezz"))return"💰 Twinsistem €280/mq\nSchüco €350/mq";return"Chiedi: stato, oggi, prezzi";};

export default function App(){
  const[tab,setTab]=useState("oggi");
  const[scr,setScr]=useState(null);
  const[selC,setSelC]=useState(null);
  const[selV,setSelV]=useState(null);
  const[colori]=useState([{id:1,nome:"RAL 9010 Bianco",hex:"#f5f5f0",tipo:"ral"},{id:2,nome:"RAL 7016 Antracite",hex:"#383e42",tipo:"ral"},{id:3,nome:"RAL 9005 Nero",hex:"#0e0e10",tipo:"ral"},{id:4,nome:"RAL 8017 Marrone",hex:"#45322e",tipo:"ral"},{id:5,nome:"Noce",hex:"#7a5230",tipo:"legno"},{id:6,nome:"Rovere",hex:"#c8b89a",tipo:"legno"},{id:7,nome:"Douglas",hex:"#9e6b3a",tipo:"legno"}]);
  const[team]=useState([{id:"fabio",nome:"Fabio",ruolo:"Titolare",compiti:"Sopralluoghi, preventivi, gestione",av:"F",col:"#f0a020"},{id:"marco",nome:"Marco",ruolo:"Posatore",compiti:"Posa in opera, verifiche",av:"M",col:"#58a8ff"},{id:"luca",nome:"Luca",ruolo:"Misuratore",compiti:"Rilievo misure, foto",av:"L",col:"#30e898"},{id:"sara",nome:"Sara",ruolo:"Ufficio",compiti:"Ordini, documenti",av:"S",col:"#a080ff"}]);
  const[fasi]=useState(FASI_I);
  const[sistemi]=useState([{id:1,marca:"Twinsistem",sistema:"CX650",prezzoMq:280,sovRal:35,sovLegno:55,coloriIds:[1,2,3,5]},{id:2,marca:"Schüco",sistema:"AWS 75",prezzoMq:350,sovRal:40,sovLegno:65,coloriIds:[1,2,3,6]},{id:3,marca:"Rehau",sistema:"Geneo",prezzoMq:310,sovRal:38,sovLegno:58,coloriIds:[1,2,4,7]}]);
  const[cantieri,setCantieri]=useState(()=>[{id:1,cliente:"Rossi Mario",ind:"Via Roma 12, Cosenza",tel:"333 1234567",vani:5,fase:"misure",note:"App. 3° piano",sId:1,colTId:1,colAId:1},{id:2,cliente:"Greco Anna",ind:"C.so Mazzini 45, Rende",tel:"328 9876543",vani:3,fase:"preventivo",note:"Cucina + bagni",sId:2,colTId:2,colAId:2},{id:3,cliente:"Ferraro Luigi",ind:"Via Caloprese 8, Cosenza",tel:"347 5551234",vani:8,fase:"sopralluogo",note:"Villa bifamiliare",sId:1,colTId:5,colAId:4},{id:4,cliente:"Bruno Teresa",ind:"Via Popilia 102, Cosenza",tel:"339 4449876",vani:4,fase:"ordini",note:"Attesa colore",sId:3,colTId:3,colAId:3},{id:5,cliente:"Mancini Paolo",ind:"Via Panebianco 33, Cosenza",tel:"366 7773210",vani:6,fase:"produzione",note:"Consegna 15/03",sId:2,colTId:1,colAId:1}].map(c=>({...c,pipe:mkP(c.fase,fasi)})));
  const[vaniL]=useState([{id:1,cId:1,nome:"Soggiorno",tipo:"F2A",stanza:"Soggiorno",mis:{L1:1400,L2:1400,L3:1400,H1:1600,H2:1600,H3:1600,D1:120,D2:120,D3:120},foto:2,done:true,acc:{tapparella:{on:true,colId:1,mis:{L:1400,H:1600}},cassonetto:{on:true,colId:1},zanzariera:{on:false},persiana:{on:false}}},{id:2,cId:1,nome:"Camera",tipo:"PF1A",stanza:"Camera",mis:{L1:900,L2:900,L3:900,H1:2200,H2:2200,H3:2200,D1:100,D2:100,D3:100},foto:1,done:true,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}},{id:3,cId:1,nome:"Bagno",tipo:"VAS",stanza:"Bagno",mis:{},foto:0,done:false,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}},{id:4,cId:1,nome:"Cucina",tipo:"F2A",stanza:"Cucina",mis:{},foto:0,done:false,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}},{id:5,cId:1,nome:"Ingresso",tipo:"BLIND",stanza:"Ingresso",mis:{},foto:0,done:false,acc:{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}}}]);
  const[appunti]=useState([{id:1,cId:3,ora:"08:30",dur:"1h",tipo:"Sopralluogo",date:new Date(OG.getFullYear(),OG.getMonth(),OG.getDate()),color:"#58a8ff"},{id:2,cId:2,ora:"10:30",dur:"45min",tipo:"Preventivo",date:new Date(OG.getFullYear(),OG.getMonth(),OG.getDate()),color:"#a080ff"},{id:3,cId:1,ora:"14:00",dur:"1h30",tipo:"Misure",date:new Date(OG.getFullYear(),OG.getMonth(),OG.getDate()),color:"#f0a020"}]);
  const[tasks,setTasks]=useState([{id:1,testo:"Metro laser da Rossi",fatto:false,pri:"alta"},{id:2,testo:"Conferma colore Bruno",fatto:false,pri:"media"},{id:3,testo:"Ordine guarnizioni",fatto:true,pri:"bassa"},{id:4,testo:"Foto difetti Popilia",fatto:false,pri:"alta"}]);
  const[calV,setCalV]=useState("mese");
  const[calM,setCalM]=useState(new Date(OG.getFullYear(),OG.getMonth(),1));
  const[calS,setCalS]=useState(OG);
  const[mis,setMis]=useState({});
  const[actM,setActM]=useState(null);
  const[inpV,setInpV]=useState("");
  const[accSt,setAccSt]=useState({tapparella:{on:false,colId:null,mis:{}},cassonetto:{on:false,colId:null,mis:{}},zanzariera:{on:false,colId:null,mis:{}},persiana:{on:false,colId:null,mis:{}}});
  const[drawing,setDrawing]=useState([]);
  const[isDrw,setIsDrw]=useState(false);
  const[drwCol,setDrwCol]=useState("#f0a020");
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
  const[editTeam,setEditTeam]=useState(null);
  const[editFase,setEditFase]=useState(null);

  const gCol=id=>colori.find(c=>c.id===id);const gSys=id=>sistemi.find(s=>s.id===id);
  const ogA=appunti.filter(a=>sameD(a.date,OG));const opT=tasks.filter(t=>!t.fatto).length;
  const filC=commF==="tutte"?cantieri:cantieri.filter(c=>c.fase===commF);const filled=Object.values(mis).filter(v=>v>0).length;

  const goBack=()=>{if(scr==="vano"){setScr("cantiere");setSelV(null);setActM(null);setScanRes(null);setShowAnom(false);setShowVoice(false);}else if(scr==="draw")setScr("vano");else{setScr(null);setSelC(null);}};
  const openC=c=>{setSelC(c);setScr("cantiere");};
  const openV=v=>{setSelV(v);setMis(v.mis||{});setAccSt(v.acc||{tapparella:{on:false},cassonetto:{on:false},zanzariera:{on:false},persiana:{on:false}});setScanRes(null);setShowAnom(false);setShowVoice(false);setScr("vano");};
  const sendAI=()=>{if(!aiIn.trim())return;setAiChat(p=>[...p,{r:"user",t:aiIn.trim()}]);const q=aiIn;setAiIn("");setAiLoad(true);setTimeout(()=>{setAiChat(p=>[...p,{r:"ai",t:getAI(q)}]);setAiLoad(false);},500);};
  const addTask=()=>{if(!newTask.trim())return;setTasks(p=>[...p,{id:Date.now(),testo:newTask.trim(),fatto:false,pri:newTaskPri}]);setNewTask("");setShowAddTask(false);};
  const addCl=()=>{if(!newCl.nome||!newCl.cognome)return;const nc={id:Date.now(),cliente:`${newCl.cognome} ${newCl.nome}`,ind:newCl.ind||"—",tel:newCl.tel,vani:0,fase:fasi[0].id,note:"",sId:newCl.sId,colTId:newCl.colTId,colAId:newCl.colAId,pipe:mkP(fasi[0].id,fasi)};setCantieri(p=>[...p,nc]);setNewCl({nome:"",cognome:"",tel:"",ind:"",sId:1,colTId:1,colAId:1});setShowNewCl(false);setSelC(nc);setScr("cantiere");};
  const prevC=c=>{const cv=vaniL.filter(v=>v.cId===c.id);const sy=gSys(c.sId);if(!cv.length||!sy)return null;let tot=0;cv.forEach(v=>{const m=v.mis;const L=Math.max(m.L1||0,m.L2||0,m.L3||0),H=Math.max(m.H1||0,m.H2||0,m.H3||0);if(L&&H){const mq=(L*H)/1e6;let p=mq*sy.prezzoMq;const ct=gCol(c.colTId);if(ct?.tipo==="ral"&&ct.id!==1)p+=mq*sy.sovRal;if(ct?.tipo==="legno")p+=mq*sy.sovLegno;p+=80;tot+=p;}});return{net:Math.round(tot),iva:Math.round(tot*1.22),n:cv.length};};

  const getPos=useCallback(e=>{if(!canvasRef.current)return{x:0,y:0};const r=canvasRef.current.getBoundingClientRect();const ct=e.touches?e.touches[0]:e;return{x:ct.clientX-r.left,y:ct.clientY-r.top};},[]);
  const startD=useCallback(e=>{e.preventDefault();setIsDrw(true);setDrawing(pr=>[...pr,{pts:[getPos(e)],col:drwCol,w:3}]);},[drwCol,getPos]);
  const moveD=useCallback(e=>{if(!isDrw)return;e.preventDefault();setDrawing(pr=>{const c=[...pr];if(c.length)c[c.length-1]={...c[c.length-1],pts:[...c[c.length-1].pts,getPos(e)]};return c;});},[isDrw,getPos]);
  const endD=useCallback(()=>setIsDrw(false),[]);

  /* shared styles */
  const inp={width:"100%",background:"rgba(255,255,255,0.05)",border:`1px solid ${T.bdr2}`,borderRadius:12,padding:"12px 14px",color:T.text,fontSize:14,outline:"none",fontFamily:"'Outfit'"};
  const sel={...inp,appearance:"auto"};
  const btn=(bg,c="#fff")=>({display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 20px",borderRadius:14,background:bg,color:c,fontSize:14,fontWeight:700,border:"none",cursor:"pointer",width:"100%",letterSpacing:"-0.01em"});
  const modal={position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200};
  const mBox={width:"100%",maxWidth:520,background:"#12141e",borderRadius:"24px 24px 0 0",padding:"24px 18px 32px",maxHeight:"88vh",overflow:"auto"};
  const lbl={fontSize:11,color:T.sub,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.08em"};
  const glass={background:T.glass,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:`1px solid ${T.bdr2}`,borderRadius:16};

  const TabIc=({id,on})=>{const c=on?T.acc:T.sub2;return{
    oggi:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="2" fill={on?T.acc:T.sub2} fillOpacity={on?0.3:0.1} stroke={c} strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="2" stroke={c} strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="2" stroke={c} strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="2" stroke={c} strokeWidth="1.5"/></svg>,
    calendario:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="3" stroke={c} strokeWidth="1.5"/><path d="M3 9h18M8 2v4M16 2v4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>{on&&<circle cx="12" cy="15" r="2" fill={T.acc}/>}</svg>,
    task:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="3" stroke={c} strokeWidth="1.5"/><path d="M8 9l2 2 4-4" stroke={on?T.acc:c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    commesse:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="3" stroke={c} strokeWidth="1.5"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke={c} strokeWidth="1.5"/>{on&&<rect x="8" y="11" width="8" height="2" rx="1" fill={T.acc}/>}</svg>,
    impostazioni:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.5"/><path d="M12 1v3m0 16v3m11-11h-3M4 12H1m17.36-7.36l-2.12 2.12M8.76 15.24l-2.12 2.12m12.72 0l-2.12-2.12M8.76 8.76L6.64 6.64" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  }[id]||null;};

  return(<>
    <link href={FONT} rel="stylesheet"/>
    <style>{`*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}::-webkit-scrollbar{width:0}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
    <div style={{width:"100%",height:"100dvh",background:T.bg,fontFamily:"'Outfit',system-ui",color:T.text,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>

    {/* ═══════ OGGI ═══════ */}
    {!scr&&tab==="oggi"&&<div style={{flex:1,overflow:"auto"}}>
      {/* HERO HEADER with gradient */}
      <div style={{background:T.hero,padding:"20px 18px 16px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-40,width:180,height:180,borderRadius:90,background:"radial-gradient(circle,rgba(240,160,32,0.08) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",bottom:-30,left:-30,width:120,height:120,borderRadius:60,background:"radial-gradient(circle,rgba(88,168,255,0.05) 0%,transparent 70%)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,position:"relative"}}>
          <div style={{width:44,height:44,borderRadius:14,background:T.accBg,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:18,color:"#000",boxShadow:"0 4px 20px rgba(240,160,32,0.4)"}}>M</div>
          <div><div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em"}}>MASTRO <span style={{color:T.acc}}>MISURE</span></div><div style={{fontSize:11,color:T.sub,fontWeight:400,marginTop:1}}>{fmtD(OG)}</div></div>
        </div>
        {/* STAT BLOCKS — big, colored, bold */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,position:"relative"}}>
          {[{l:"Appuntamenti",v:ogA.length,bg:T.blueBg,lt:T.blueB,go:"calendario"},{l:"Task aperti",v:opT,bg:T.redBg,lt:T.redB,go:"task"},{l:"Commesse",v:cantieri.length,bg:T.grnBg,lt:T.grnB,go:"commesse"}].map((s,i)=>(
            <div key={i} onClick={()=>setTab(s.go)} style={{...glass,padding:"16px 12px",cursor:"pointer",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-6,right:-6,width:36,height:36,borderRadius:18,background:s.bg,opacity:0.2,filter:"blur(8px)"}}/>
              <div style={{fontSize:32,fontWeight:900,fontFamily:"'JetBrains Mono'",letterSpacing:"-0.04em",lineHeight:1,position:"relative"}}>{s.v}</div>
              <div style={{fontSize:9,color:T.sub,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:6}}>{s.l}</div>
            </div>))}
        </div>
      </div>

      {/* NEXT APPOINTMENT — big hero card */}
      {ogA[0]&&(()=>{const a=ogA[0];const c=cantieri.find(x=>x.id===a.cId);return c?(<div onClick={()=>openC(c)} style={{margin:"12px 14px",padding:"20px",borderRadius:20,background:`linear-gradient(135deg,${a.color}20,${a.color}08,rgba(255,255,255,0.02))`,border:`1px solid ${a.color}30`,cursor:"pointer",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:100,height:100,background:`radial-gradient(circle at top right,${a.color}15,transparent)`,borderRadius:"0 20px 0 0"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{fontSize:10,color:a.color,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",padding:"4px 10px",background:a.color+"15",borderRadius:8}}>⏳ PROSSIMO</div>
          <div style={{fontSize:28,fontWeight:900,color:a.color,fontFamily:"'JetBrains Mono'",letterSpacing:"-0.04em"}}>{a.ora}</div>
        </div>
        <div style={{fontSize:18,fontWeight:700,letterSpacing:"-0.02em"}}>{c.cliente}</div>
        <div style={{fontSize:12,color:T.sub,marginTop:3}}>{c.ind}</div>
        <div style={{display:"flex",gap:6,marginTop:12}}><span style={{padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:600,background:a.color+"18",color:a.color}}>{a.tipo}</span><span style={{padding:"4px 10px",borderRadius:8,fontSize:11,background:"rgba(255,255,255,0.05)",color:T.sub}}>{a.dur}</span></div>
      </div>):null;})()}

      {/* AGENDA */}
      <div style={{padding:"4px 18px 6px",fontSize:11,fontWeight:700,color:T.sub,letterSpacing:"0.1em"}}>AGENDA</div>
      {ogA.map(a=>{const c=cantieri.find(x=>x.id===a.cId);return c?(<div key={a.id} onClick={()=>openC(c)} style={{margin:"0 14px 8px",...glass,padding:"14px 16px",display:"flex",gap:12,alignItems:"center",cursor:"pointer"}}>
        <div style={{width:4,height:40,borderRadius:2,background:a.color,boxShadow:`0 0 10px ${a.color}50`}}/>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{c.cliente}</div><div style={{fontSize:11,color:T.sub,marginTop:2}}>{a.tipo}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:800,fontFamily:"'JetBrains Mono'",letterSpacing:"-0.03em"}}>{a.ora}</div><div style={{fontSize:10,color:T.sub}}>{a.dur}</div></div>
      </div>):null;})}

      {/* PIPELINE MINI */}
      <div style={{padding:"8px 18px 6px",fontSize:11,fontWeight:700,color:T.sub,letterSpacing:"0.1em"}}>PIPELINE</div>
      <div style={{display:"flex",gap:6,padding:"0 14px 12px",overflow:"auto"}}>{fasi.map(f=>{const n=cantieri.filter(c=>c.fase===f.id).length;return(<div key={f.id} onClick={()=>{setTab("commesse");setCommF(f.id);}} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 12px",borderRadius:12,background:n?`${f.color}15`:"rgba(255,255,255,0.03)",border:`1px solid ${n?f.color+"25":"rgba(255,255,255,0.05)"}`,whiteSpace:"nowrap",flexShrink:0,cursor:"pointer"}}><span style={{fontSize:14}}>{f.icon}</span><span style={{fontSize:13,fontWeight:n?700:500,color:n?f.color:T.sub2}}>{n}</span></div>);})}</div>
    </div>}

    {/* ═══════ CALENDARIO ═══════ */}
    {!scr&&tab==="calendario"&&<div style={{flex:1,overflow:"auto"}}>
      <div style={{background:"linear-gradient(145deg,#0a1020,#0f0820)",padding:"18px 18px 14px"}}><div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em"}}>📅 Calendario</div><div style={{fontSize:12,color:T.sub,marginTop:2}}>{MML[calM.getMonth()]} {calM.getFullYear()}</div>
        <div style={{display:"flex",gap:6,marginTop:12}}>{["giorno","settimana","mese"].map(v=><button key={v} onClick={()=>setCalV(v)} style={{padding:"7px 16px",borderRadius:12,fontSize:12,fontWeight:calV===v?700:400,border:"none",cursor:"pointer",background:calV===v?T.accBg:"rgba(255,255,255,0.05)",color:calV===v?"#000":T.sub}}>{v[0].toUpperCase()+v.slice(1)}</button>)}</div>
      </div>
      {calV==="mese"&&(()=>{const yr=calM.getFullYear(),mo=calM.getMonth(),fd=new Date(yr,mo,1).getDay(),dim=new Date(yr,mo+1,0).getDate(),cells=[];for(let i=0;i<(fd===0?6:fd-1);i++)cells.push(null);for(let d=1;d<=dim;d++)cells.push(new Date(yr,mo,d));return(<div style={{padding:"10px 14px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><div onClick={()=>setCalM(new Date(yr,mo-1,1))} style={{cursor:"pointer",padding:8,borderRadius:10,background:"rgba(255,255,255,0.05)"}}><Ic d={P.back} s={16} c={T.sub}/></div><div style={{fontSize:15,fontWeight:700}}>{MML[mo]} {yr}</div><div onClick={()=>setCalM(new Date(yr,mo+1,1))} style={{cursor:"pointer",padding:8,borderRadius:10,background:"rgba(255,255,255,0.05)",transform:"rotate(180deg)"}}><Ic d={P.back} s={16} c={T.sub}/></div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,textAlign:"center"}}>{["L","M","M","G","V","S","D"].map((g,i)=><div key={i} style={{fontSize:10,color:T.sub2,fontWeight:600,padding:6}}>{g}</div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>{cells.map((day,i)=>{if(!day)return<div key={i}/>;const isT=sameD(day,OG),isS=sameD(day,calS);const hA=appunti.some(a=>sameD(a.date,day));return(<div key={i} onClick={()=>setCalS(day)} style={{textAlign:"center",padding:"10px 2px",borderRadius:12,cursor:"pointer",background:isS?T.accB:isT?"rgba(255,255,255,0.04)":"transparent",border:isT?`2px solid ${T.acc}`:"2px solid transparent"}}><div style={{fontSize:13,fontWeight:isT||isS?700:400,color:isS?T.acc:T.text}}>{day.getDate()}</div>{hA&&<div style={{width:5,height:5,borderRadius:3,background:T.acc,margin:"3px auto 0",boxShadow:`0 0 4px ${T.acc}`}}/>}</div>);})}</div>
      </div>);})()}
      {calV==="settimana"&&(()=>{const st=new Date(calS);st.setDate(st.getDate()-st.getDay()+1);return(<div style={{padding:"8px 14px"}}>{Array.from({length:7},(_,i)=>{const d=new Date(st);d.setDate(st.getDate()+i);const isT=sameD(d,OG);const as=appunti.filter(a=>sameD(a.date,d));return(<div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}><div style={{width:48,textAlign:"center"}}><div style={{fontSize:10,color:T.sub}}>{GG[d.getDay()]}</div><div style={{fontSize:18,fontWeight:800,color:isT?T.acc:T.text}}>{d.getDate()}</div></div><div style={{flex:1}}>{as.length?as.map(a=>{const c=cantieri.find(x=>x.id===a.cId);return(<div key={a.id} onClick={()=>c&&openC(c)} style={{padding:"8px 10px",borderRadius:10,background:`${a.color}12`,borderLeft:`3px solid ${a.color}`,marginBottom:4,fontSize:12,cursor:"pointer"}}><b>{a.ora}</b> {c?.cliente}</div>);}):<div style={{fontSize:11,color:T.sub2,padding:"6px 0"}}>—</div>}</div></div>);})};</div>);})()}
      {calV==="giorno"&&(<div style={{padding:16}}><div style={{textAlign:"center",marginBottom:16}}><div style={{fontSize:12,color:T.sub}}>{GG[calS.getDay()]}</div><div style={{fontSize:40,fontWeight:900,background:T.accBg,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.04em"}}>{calS.getDate()}</div><div style={{fontSize:13,color:T.sub}}>{MML[calS.getMonth()]}</div></div>{appunti.filter(a=>sameD(a.date,calS)).map(a=>{const c=cantieri.find(x=>x.id===a.cId);return(<div key={a.id} onClick={()=>c&&openC(c)} style={{...glass,padding:16,marginBottom:10,cursor:"pointer",borderLeft:`4px solid ${a.color}`}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:16,fontWeight:700}}>{c?.cliente}</div><div style={{fontSize:20,fontWeight:800,fontFamily:"'JetBrains Mono'",color:a.color}}>{a.ora}</div></div><div style={{fontSize:12,color:T.sub,marginTop:4}}>{a.tipo} · {a.dur}</div></div>);})}</div>)}
    </div>}

    {/* ═══════ TASK ═══════ */}
    {!scr&&tab==="task"&&<div style={{flex:1,overflow:"auto"}}>
      <div style={{background:"linear-gradient(145deg,#180808,#100610)",padding:"18px 18px 14px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em"}}>✅ Task</div><div style={{fontSize:12,color:T.sub,marginTop:2}}>{opT} aperti</div></div>
        <button onClick={()=>setShowAddTask(true)} style={{width:40,height:40,borderRadius:14,background:T.accBg,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(240,160,32,0.3)"}}><Ic d={P.plus} s={18} c="#000"/></button>
      </div>
      {tasks.filter(t=>!t.fatto).length>0&&<div style={{padding:"10px 18px 4px",fontSize:11,fontWeight:700,color:T.sub,letterSpacing:"0.1em"}}>DA FARE</div>}
      {tasks.filter(t=>!t.fatto).map(t=>(<div key={t.id} style={{margin:"0 14px 8px",...glass,padding:"14px 16px",display:"flex",gap:12,alignItems:"center"}}><div onClick={()=>setTasks(ts=>ts.map(x=>x.id===t.id?{...x,fatto:true}:x))} style={{width:24,height:24,borderRadius:8,border:`2.5px solid ${{alta:T.red,media:T.acc,bassa:T.sub2}[t.pri]}`,cursor:"pointer",flexShrink:0}}/><div style={{flex:1,fontSize:14,fontWeight:500}}>{t.testo}</div><div style={{width:8,height:8,borderRadius:4,background:{alta:T.red,media:T.acc,bassa:T.sub2}[t.pri],boxShadow:`0 0 8px ${{alta:T.red,media:T.acc,bassa:T.sub2}[t.pri]}50`}}/></div>))}
      {tasks.filter(t=>t.fatto).length>0&&<div style={{padding:"10px 18px 4px",fontSize:11,fontWeight:700,color:T.sub,letterSpacing:"0.1em"}}>COMPLETATI</div>}
      {tasks.filter(t=>t.fatto).map(t=>(<div key={t.id} style={{margin:"0 14px 8px",padding:"14px 16px",background:"rgba(255,255,255,0.02)",borderRadius:16,display:"flex",gap:12,alignItems:"center",opacity:0.4}}><div style={{width:24,height:24,borderRadius:8,background:T.grnB,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={P.check} s={14} c={T.grn}/></div><div style={{flex:1,textDecoration:"line-through",fontSize:13,color:T.sub}}>{t.testo}</div></div>))}
    </div>}

    {/* ═══════ COMMESSE ═══════ */}
    {!scr&&tab==="commesse"&&<div style={{flex:1,overflow:"auto"}}>
      <div style={{background:"linear-gradient(145deg,#081008,#061018)",padding:"18px 18px 14px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em"}}>📋 Commesse</div><div style={{fontSize:12,color:T.sub,marginTop:2}}>{cantieri.length} attive</div></div>
        <button onClick={()=>setShowNewCl(true)} style={{width:40,height:40,borderRadius:14,background:T.accBg,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(240,160,32,0.3)"}}><Ic d={P.plus} s={18} c="#000"/></button>
      </div>
      <div style={{display:"flex",gap:6,padding:"8px 14px",overflow:"auto"}}><button onClick={()=>setCommF("tutte")} style={{padding:"7px 14px",borderRadius:12,fontSize:11,fontWeight:commF==="tutte"?700:400,border:"none",cursor:"pointer",background:commF==="tutte"?T.accBg:"rgba(255,255,255,0.05)",color:commF==="tutte"?"#000":T.sub}}>Tutte</button>{fasi.map(f=>{const n=cantieri.filter(c=>c.fase===f.id).length;if(!n)return null;return<button key={f.id} onClick={()=>setCommF(f.id)} style={{padding:"7px 14px",borderRadius:12,fontSize:11,fontWeight:commF===f.id?700:400,border:"none",cursor:"pointer",background:commF===f.id?f.color:"rgba(255,255,255,0.05)",color:commF===f.id?"#000":T.sub,whiteSpace:"nowrap"}}>{f.icon} {n}</button>;})}</div>
      {filC.map(c=>{const fi=fasi.findIndex(f=>f.id===c.fase);const fase=fasi[fi]||fasi[0];const sy=gSys(c.sId);const ct=gCol(c.colTId);return(<div key={c.id} onClick={()=>openC(c)} style={{margin:"0 14px 10px",...glass,padding:"14px 16px",cursor:"pointer",borderLeft:`4px solid ${fase.color}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:80,height:80,background:`radial-gradient(circle at top right,${fase.color}10,transparent)`,borderRadius:"0 16px 0 0"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
          <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,letterSpacing:"-0.02em"}}>{c.cliente}</div><div style={{fontSize:11,color:T.sub,marginTop:2}}>{c.ind}</div></div>
          <span style={{padding:"4px 10px",borderRadius:8,fontSize:10,fontWeight:700,background:fase.color+"20",color:fase.color}}>{fase.icon} {fase.label}</span>
        </div>
        <div style={{display:"flex",gap:2,margin:"12px 0 8px"}}>{fasi.map((f,i)=><div key={f.id} style={{flex:1,height:5,borderRadius:3,background:i<=fi?fase.color:T.bdr}}/>)}</div>
        <div style={{display:"flex",gap:8,fontSize:10,color:T.sub}}><span style={{fontWeight:600,color:T.text}}>{c.vani}v</span>{sy&&<span>{sy.marca}</span>}{ct&&<span style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:8,height:8,borderRadius:4,background:ct.hex,border:`1px solid ${T.bdr2}`}}/>{ct.nome}</span>}</div>
      </div>);})}
    </div>}

    {/* ═══════ IMPOSTAZIONI ═══════ */}
    {!scr&&tab==="impostazioni"&&<div style={{flex:1,overflow:"auto"}}>
      <div style={{background:"linear-gradient(145deg,#100820,#0a0818)",padding:"18px 18px 14px"}}><div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em"}}>⚙️ Impostazioni</div></div>
      <div style={{display:"flex",gap:6,padding:"8px 14px",overflow:"auto"}}>{["generali","colori","sistemi","pipeline","team"].map(t=><button key={t} onClick={()=>setSTab(t)} style={{padding:"7px 14px",borderRadius:12,fontSize:11,fontWeight:sTab===t?700:400,border:"none",cursor:"pointer",background:sTab===t?T.accBg:"rgba(255,255,255,0.05)",color:sTab===t?"#000":T.sub,whiteSpace:"nowrap"}}>{t[0].toUpperCase()+t.slice(1)}</button>)}</div>
      {sTab==="generali"&&<div style={{padding:"8px 14px"}}><div style={{...glass,padding:16,marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:52,height:52,borderRadius:18,background:`linear-gradient(135deg,${T.acc}30,${T.acc}10)`,border:`2px solid ${T.acc}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:T.acc}}>F</div><div><div style={{fontSize:18,fontWeight:700}}>Fabio</div><div style={{fontSize:12,color:T.sub}}>Walter Cozza Serramenti</div></div></div></div></div>}
      {sTab==="colori"&&<div style={{padding:"8px 14px"}}>{colori.map(c=>(<div key={c.id} style={{...glass,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}><div style={{width:28,height:28,borderRadius:14,background:c.hex,border:`2px solid ${T.bdr2}`,boxShadow:"inset 0 2px 4px rgba(0,0,0,0.3)"}}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{c.nome}</div><div style={{fontSize:10,color:T.sub}}>{c.tipo==="ral"?"RAL":"Legno"}</div></div></div>))}</div>}
      {sTab==="sistemi"&&<div style={{padding:"8px 14px"}}>{sistemi.map(s=>(<div key={s.id} style={{...glass,padding:16,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div><div style={{fontSize:15,fontWeight:700}}>{s.marca}</div><div style={{fontSize:12,color:T.sub}}>{s.sistema}</div></div><div style={{fontSize:24,fontWeight:900,background:T.accBg,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"'JetBrains Mono'"}}>€{s.prezzoMq}</div></div><div style={{display:"flex",gap:8}}><div style={{flex:1,padding:10,background:"rgba(255,255,255,0.03)",borderRadius:10,textAlign:"center"}}><div style={{color:T.sub,fontSize:9,fontWeight:600}}>SOVR. RAL</div><div style={{fontWeight:700,fontSize:13,marginTop:2}}>+€{s.sovRal}/mq</div></div><div style={{flex:1,padding:10,background:"rgba(255,255,255,0.03)",borderRadius:10,textAlign:"center"}}><div style={{color:T.sub,fontSize:9,fontWeight:600}}>EFF. LEGNO</div><div style={{fontWeight:700,fontSize:13,marginTop:2}}>+€{s.sovLegno}/mq</div></div></div></div>))}</div>}
      {sTab==="pipeline"&&<div style={{padding:"8px 14px"}}>{fasi.map((f,i)=>(<div key={f.id} style={{...glass,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setEditFase(editFase===f.id?null:f.id)}><div style={{width:36,height:36,borderRadius:12,background:`${f.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,border:`2px solid ${f.color}30`}}>{f.icon}</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{f.label}</div><div style={{fontSize:10,color:T.sub}}>Fase {i+1}</div></div><div style={{width:16,height:16,borderRadius:8,background:f.color,boxShadow:`0 0 8px ${f.color}50`}}/></div>))}</div>}
      {sTab==="team"&&<div style={{padding:"8px 14px"}}>{team.map(m=>(<div key={m.id} style={{...glass,padding:16,marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:40,height:40,borderRadius:14,background:`linear-gradient(135deg,${m.col}30,${m.col}10)`,border:`2px solid ${m.col}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:m.col}}>{m.av}</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:600}}>{m.nome} <span style={{fontSize:11,color:m.col,fontWeight:700}}>{m.ruolo}</span></div><div style={{fontSize:11,color:T.sub,marginTop:2}}>{m.compiti}</div></div></div></div>))}</div>}
    </div>}

    {/* ═══════ CANTIERE ═══════ */}
    {scr==="cantiere"&&selC&&(()=>{const c=selC;const fi=fasi.findIndex(f=>f.id===c.fase);const fase=fasi[fi]||fasi[0];const cv=vaniL.filter(v=>v.cId===c.id);const sy=gSys(c.sId);const ct=gCol(c.colTId);const ca=gCol(c.colAId);const prev=prevC(c);return(
      <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
        {/* Header with gradient bg */}
        <div style={{background:`linear-gradient(145deg,${fase.color}12,${T.bg})`,padding:"14px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${T.bdr}`}}>
          <div onClick={goBack} style={{cursor:"pointer",padding:4}}><Ic d={P.back} s={18} c={T.sub}/></div>
          <div style={{flex:1}}><div style={{fontSize:17,fontWeight:700,letterSpacing:"-0.02em"}}>{c.cliente}</div><div style={{fontSize:11,color:T.sub}}>{c.ind}</div></div>
        </div>
        <div style={{flex:1,overflow:"auto"}}>
          {/* Badges */}
          <div style={{display:"flex",gap:5,padding:"12px 14px 6px",flexWrap:"wrap"}}>{sy&&<span style={{padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:600,background:T.blueB,color:T.blue}}>{sy.marca} {sy.sistema}</span>}{ct&&<span style={{padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:600,background:T.accB,color:T.acc,display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:4,background:ct.hex,border:`1px solid ${T.bdr2}`}}/>{ct.nome}</span>}{ca&&<span style={{padding:"4px 10px",borderRadius:8,fontSize:11,background:"rgba(255,255,255,0.06)",color:T.sub,display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:4,background:ca.hex,border:`1px solid ${T.bdr2}`}}/>Acc: {ca.nome}</span>}</div>

          {/* ★★★ PIPELINE STEPPER — HORIZONTAL CLICKABLE ★★★ */}
          <div style={{padding:"10px 14px",overflow:"auto"}}>
            <div style={{display:"flex",alignItems:"flex-start",minWidth:fasi.length*54}}>
              {fasi.map((f,i)=>{const done=i<fi,curr=i===fi;return(
                <div key={f.id} style={{display:"flex",alignItems:"center",flex:i<fasi.length-1?1:"none"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",minWidth:40}}>
                    <div style={{width:curr?40:30,height:curr?40:30,borderRadius:curr?14:10,background:done?f.color:curr?`linear-gradient(135deg,${f.color},${f.color}aa)`:"transparent",border:!done&&!curr?`2px dashed ${T.bdr2}`:done?`2px solid ${f.color}`:`3px solid ${f.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:curr?18:14,boxShadow:curr?`0 0 20px ${f.color}40`:"none",transition:"all 0.2s"}}>{done?<Ic d={P.check} s={14} c="#fff" sw={3}/>:f.icon}</div>
                    <div style={{fontSize:8,fontWeight:curr?700:500,color:curr?f.color:done?T.sub:T.sub2,textAlign:"center",lineHeight:1.1,maxWidth:48}}>{f.label}</div>
                  </div>
                  {i<fasi.length-1&&<div style={{flex:1,height:done?3:2,background:done?f.color:"rgba(255,255,255,0.06)",margin:"0 -1px",marginBottom:18,borderRadius:2}}/>}
                </div>);})}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",gap:8,padding:"4px 14px 12px"}}>
            {prev&&<button onClick={()=>alert(`PREVENTIVO\n${prev.n} vani\nNetto: €${prev.net}\nIVA: €${prev.iva}`)} style={{flex:1,padding:"12px",borderRadius:12,background:`${T.acc}15`,border:`1px solid ${T.acc}25`,color:T.acc,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>💰 €{prev.iva}</button>}
            <button onClick={()=>alert("PDF export...")} style={{flex:1,padding:"12px",borderRadius:12,background:T.redB,border:`1px solid ${T.red}20`,color:T.red,fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Ic d={P.pdf} s={14} c={T.red}/>PDF</button>
          </div>

          {c.note&&<div style={{margin:"0 14px 10px",padding:12,borderRadius:12,background:"rgba(255,255,255,0.03)",borderLeft:`3px solid ${T.acc}40`,fontSize:12,color:T.sub}}>{c.note}</div>}

          <div style={{padding:"2px 16px 6px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:14,fontWeight:700}}>Vani ({cv.length})</div><button style={{background:T.accBg,color:"#000",border:"none",borderRadius:10,padding:"7px 14px",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ Nuovo</button></div>
          {cv.map(v=>(<div key={v.id} onClick={()=>openV(v)} style={{margin:"0 14px 8px",...glass,padding:"12px 14px",display:"flex",gap:10,alignItems:"center",cursor:"pointer"}}>
            <div style={{width:38,height:38,borderRadius:12,background:v.done?`${T.grn}15`:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",border:v.done?`1.5px solid ${T.grn}30`:`1.5px solid ${T.bdr}`}}>{v.done?<Ic d={P.check} s={16} c={T.grn}/>:<Ic d={P.ruler} s={16} c={T.sub2}/>}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{v.nome} <span style={{color:T.acc,fontWeight:700}}>{v.tipo}</span></div><div style={{fontSize:10,color:T.sub,marginTop:1}}>{v.stanza}{v.done?" · ✅":""}</div></div>
            <Ic d={P.chevR} s={14} c={T.sub2}/>
          </div>))}
          <div style={{padding:"14px 14px 20px"}}>{fi<fasi.length-1&&<button onClick={()=>{const nf=fasi[fi+1].id;setCantieri(p=>{const u=p.map(x=>x.id!==c.id?x:{...x,fase:nf,pipe:mkP(nf,fasi)});setSelC(u.find(x=>x.id===c.id));return u;});}} style={btn(T.accBg,"#000")}>Avanza → {fasi[fi+1]?.label}</button>}</div>
        </div></div>);})()}

    {/* ═══════ VANO ═══════ */}
    {scr==="vano"&&selV&&(()=>{const v=selV;
      const pts=[{k:"L1",x:95,y:35},{k:"L2",x:95,y:115},{k:"L3",x:95,y:195},{k:"H1",x:30,y:115},{k:"H2",x:95,y:115},{k:"H3",x:160,y:115},{k:"D1",x:185,y:35},{k:"D2",x:185,y:115},{k:"D3",x:185,y:195}];
      const tap=k=>{setActM(k);setInpV(mis[k]?String(mis[k]):"");};
      const save=()=>{if(actM&&inpV)setMis(d=>({...d,[actM]:parseInt(inpV)||0}));setActM(null);setInpV("");};
      return(
      <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${T.bdr}`,background:`linear-gradient(145deg,${T.acc}08,${T.bg})`}}><div onClick={goBack} style={{cursor:"pointer",padding:4}}><Ic d={P.back} s={18} c={T.sub}/></div><div style={{flex:1}}><div style={{fontSize:17,fontWeight:700}}>{v.nome} <span style={{color:T.acc}}>{v.tipo}</span></div><div style={{fontSize:11,color:T.sub}}>{v.stanza} · {filled}/9</div></div><button onClick={()=>setScr("draw")} style={{background:T.purpleB,border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,color:T.purple,cursor:"pointer"}}>✏️</button></div>
        <div style={{flex:1,overflow:"auto"}}>
          <div style={{display:"flex",gap:5,padding:"10px 14px",overflow:"auto"}}>
            {[{l:"🎤 Voce",c:T.acc,a:()=>setShowVoice(!showVoice)},{l:"📸 Scan",c:T.blue,a:()=>setScanRes(aiScn())},{l:"🧠 Fill",c:T.grn,a:()=>setMis(aiSmF(mis))},{l:"⚠️ Check",c:T.red,a:()=>setShowAnom(!showAnom)}].map(b=><button key={b.l} onClick={b.a} style={{background:`${b.c}12`,border:`1px solid ${b.c}20`,borderRadius:10,padding:"6px 12px",fontSize:11,fontWeight:600,color:b.c,cursor:"pointer",whiteSpace:"nowrap"}}>{b.l}</button>)}
          </div>
          {showVoice&&<div style={{margin:"0 14px 8px",padding:12,...glass,border:`1px solid ${T.acc}25`}}><div style={{display:"flex",gap:6}}><input value={voiceTxt} onChange={e=>setVoiceTxt(e.target.value)} placeholder="1400 1400 1400 1600..." style={{...inp,flex:1}}/><button onClick={()=>{if(voiceTxt.trim()){setMis(d=>({...d,...aiVo(voiceTxt)}));setVoiceTxt("");setShowVoice(false);}}} style={{padding:"0 14px",borderRadius:10,background:T.accBg,color:"#000",fontWeight:700,border:"none",cursor:"pointer"}}>OK</button></div></div>}
          {scanRes&&<div style={{margin:"0 14px 8px",padding:12,background:T.blueB,borderRadius:14,border:`1px solid ${T.blue}20`}}><div style={{fontSize:10,color:T.blue,fontWeight:700,marginBottom:5}}>SCAN — {scanRes.conf}%</div><div style={{display:"flex",gap:6}}><button onClick={()=>{setMis(d=>{const n={...d};Object.keys(scanRes).forEach(k=>{if(k.match(/^[LHD]\d$/))n[k]=scanRes[k];});return n;});setScanRes(null);}} style={{flex:1,padding:8,borderRadius:8,background:T.blue,color:"#fff",fontWeight:700,border:"none",cursor:"pointer",fontSize:12}}>Applica</button><button onClick={()=>setScanRes(null)} style={{padding:"8px 12px",borderRadius:8,background:"rgba(255,255,255,0.06)",color:T.sub,border:"none",cursor:"pointer"}}>✕</button></div></div>}
          {showAnom&&<div style={{margin:"0 14px 8px"}}>{aiChk(mis).map((w,i)=><div key={i} style={{padding:8,marginBottom:4,borderRadius:8,background:w.t==="e"?T.redB:w.t==="w"?T.accB:T.grnB,fontSize:12,fontWeight:600,color:w.t==="e"?T.red:w.t==="w"?T.acc:T.grn}}>{w.t==="ok"?"✅":"⚠️"} {w.m}</div>)}</div>}
          {/* Schema */}
          <div style={{padding:"2px 14px 8px",display:"flex",justifyContent:"center"}}><div style={{...glass,padding:16,width:"100%",maxWidth:380}}>
            <div style={{fontSize:10,color:T.acc,fontWeight:700,marginBottom:10,textAlign:"center",letterSpacing:"0.12em"}}>📐 SCHEMA VANO</div>
            <svg viewBox="0 0 220 230" style={{width:"100%"}}>
              <rect x="22" y="10" width="146" height="200" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" rx="4"/><rect x="30" y="18" width="130" height="184" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" rx="3"/>
              <text x="95" y="6" textAnchor="middle" fill={T.acc} fontSize="7" fontWeight="700">LARGHEZZA</text>
              <text x="6" y="115" textAnchor="middle" fill={T.blue} fontSize="7" fontWeight="700" transform="rotate(-90,6,115)">ALTEZZA</text>
              <text x="210" y="115" textAnchor="middle" fill={T.grn} fontSize="7" fontWeight="700" transform="rotate(90,210,115)">PROFONDITÀ</text>
              {pts.map(p=>{const val=mis[p.k];const col=p.k[0]==="L"?T.acc:p.k[0]==="H"?T.blue:T.grn;return(
                <g key={p.k} onClick={()=>tap(p.k)} style={{cursor:"pointer"}}><circle cx={p.x} cy={p.y} r={val?16:12} fill={val?col+"18":"rgba(255,255,255,0.04)"} stroke={actM===p.k?col:val?col+"40":"rgba(255,255,255,0.08)"} strokeWidth={actM===p.k?2.5:1.5}/><text x={p.x} y={p.y-3} textAnchor="middle" fill={val?col:T.sub2} fontSize="6" fontWeight="700">{p.k}</text><text x={p.x} y={p.y+7} textAnchor="middle" fill={val?T.text:T.sub2} fontSize="8" fontWeight="700" fontFamily="'JetBrains Mono'">{val||"—"}</text></g>);})}
            </svg>
          </div></div>
          {actM&&<div style={{margin:"0 14px 10px",padding:14,...glass,border:`1px solid ${T.acc}30`}}><div style={{fontSize:11,color:T.acc,fontWeight:700,marginBottom:6}}>{actM}</div><div style={{display:"flex",gap:6}}><input type="number" value={inpV} onChange={e=>setInpV(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()} placeholder="mm" autoFocus style={{flex:1,background:"rgba(255,255,255,0.04)",border:`1px solid ${T.bdr2}`,borderRadius:10,padding:12,color:T.text,fontSize:20,fontFamily:"'JetBrains Mono'",fontWeight:700,outline:"none",textAlign:"center"}}/><button onClick={save} style={{padding:"0 18px",borderRadius:10,background:T.accBg,color:"#000",fontWeight:700,border:"none",cursor:"pointer",fontSize:14}}>OK</button></div></div>}
          {/* Accessori */}
          <div style={{padding:"0 14px 10px"}}><div style={{...glass,padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:T.sub,letterSpacing:"0.08em",marginBottom:6}}>ACCESSORI</div>
            {[{k:"tapparella",l:"🪟 Tapparella",c:T.blue,hM:true},{k:"persiana",l:"🏠 Persiana",c:T.orange,hM:true},{k:"zanzariera",l:"🦟 Zanzariera",c:T.grn,hM:true},{k:"cassonetto",l:"📦 Cassonetto",c:T.purple,hM:false}].map(({k,l,c,hM})=>{
              const a=accSt[k]||{on:false,colId:null,mis:{}};
              return(<div key={k} style={{borderBottom:`1px solid ${T.bdr}`,paddingBottom:8,marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}} onClick={()=>{const n={...accSt};n[k]={...a,on:!a.on};setAccSt(n);}}>
                  <span style={{fontSize:13,fontWeight:a.on?600:400,color:a.on?T.text:T.sub}}>{l}</span>
                  <div style={{width:40,height:24,borderRadius:12,background:a.on?`${c}35`:"rgba(255,255,255,0.06)",padding:2,transition:"all 0.2s"}}><div style={{width:20,height:20,borderRadius:10,background:a.on?c:T.sub2,transition:"all 0.2s",transform:a.on?"translateX(16px)":"translateX(0)",boxShadow:a.on?`0 0 6px ${c}50`:"none"}}/></div>
                </div>
                {a.on&&(<div style={{marginTop:8,padding:12,background:`${c}08`,borderRadius:10,border:`1px solid ${c}15`}}>
                  <div style={{marginBottom:hM?8:0}}><div style={{fontSize:10,color:T.sub,fontWeight:600,marginBottom:4}}>Colore</div><select value={a.colId||""} onChange={e=>{const n={...accSt};n[k]={...a,colId:parseInt(e.target.value)||null};setAccSt(n);}} style={sel}><option value="">— Seleziona —</option>{colori.map(cl=><option key={cl.id} value={cl.id}>{cl.nome}</option>)}</select></div>
                  {hM&&(<div><div style={{fontSize:10,color:T.sub,fontWeight:600,marginBottom:4}}>Misure (mm)</div><div style={{display:"flex",gap:6}}><input type="number" value={a.mis?.L||""} onChange={e=>{const n={...accSt};n[k]={...a,mis:{...(a.mis||{}),L:parseInt(e.target.value)||0}};setAccSt(n);}} placeholder="L" style={{...inp,flex:1,textAlign:"center"}}/><input type="number" value={a.mis?.H||""} onChange={e=>{const n={...accSt};n[k]={...a,mis:{...(a.mis||{}),H:parseInt(e.target.value)||0}};setAccSt(n);}} placeholder="H" style={{...inp,flex:1,textAlign:"center"}}/></div></div>)}
                </div>)}
              </div>);})}
          </div></div>
          <div style={{padding:"0 14px 10px"}}><button style={btn(T.purpleB,T.purple)}><Ic d={P.camera} s={16} c={T.purple}/> Foto ({v.foto})</button></div>
          <div style={{padding:"0 14px 20px"}}><button style={btn(T.grnBg,"#fff")}><Ic d={P.check} s={16} c="#fff"/> SALVA MISURE</button></div>
        </div></div>);})()}

    {/* ═══════ DRAW ═══════ */}
    {scr==="draw"&&(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${T.bdr}`}}><div onClick={goBack} style={{cursor:"pointer",padding:4}}><Ic d={P.back} s={18} c={T.sub}/></div><div style={{fontSize:17,fontWeight:700}}>✏️ Disegno</div></div>
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderBottom:`1px solid ${T.bdr}`}}>{[T.acc,T.blue,T.red,T.grn,"#fff",T.purple].map(c=><div key={c} onClick={()=>setDrwCol(c)} style={{width:28,height:28,borderRadius:14,background:c,border:drwCol===c?"3px solid #fff":`2px solid rgba(255,255,255,0.1)`,cursor:"pointer"}}/>)}<div style={{flex:1}}/><div onClick={()=>setDrawing(p=>p.slice(0,-1))} style={{cursor:"pointer",padding:4}}><Ic d={P.undo} s={18} c={T.sub}/></div><div onClick={()=>setDrawing([])} style={{cursor:"pointer",padding:4}}><Ic d={P.trash} s={18} c={T.red}/></div></div>
      <div ref={canvasRef} onPointerDown={startD} onPointerMove={moveD} onPointerUp={endD} onPointerCancel={endD} style={{flex:1,background:"#0e1018",position:"relative",touchAction:"none",cursor:"crosshair"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>{drawing.map((s,i)=>s.pts.length>1&&<polyline key={i} points={s.pts.map(p=>`${p.x},${p.y}`).join(" ")} fill="none" stroke={s.col} strokeWidth={s.w} strokeLinecap="round" strokeLinejoin="round"/>)}</svg>
        {!drawing.length&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",color:T.sub2}}><div style={{fontSize:40}}>✏️</div><div style={{fontSize:13,marginTop:6}}>Disegna la tipologia</div></div>}
      </div>
      <div style={{padding:"10px 14px 14px"}}><button onClick={goBack} style={btn(T.grnBg,"#fff")}><Ic d={P.check} s={16} c="#fff"/> Salva</button></div>
    </div>)}

    {/* ═══════ TAB BAR ═══════ */}
    {!scr&&(<div style={{display:"flex",borderTop:`1px solid ${T.bdr}`,background:"rgba(10,12,20,0.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",padding:"6px 0 max(env(safe-area-inset-bottom),6px)",flexShrink:0}}>
      {["oggi","calendario","task","commesse","impostazioni"].map(id=>(<div key={id} onClick={()=>setTab(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0",fontSize:9,fontWeight:tab===id?700:400,color:tab===id?T.acc:T.sub2,cursor:"pointer",position:"relative"}}>
        {TabIc({id,on:tab===id})}
        <span style={{letterSpacing:"0.02em"}}>{({oggi:"Oggi",calendario:"Calendario",task:"Task",commesse:"Commesse",impostazioni:"Impost."})[id]}</span>
        {tab===id&&<div style={{position:"absolute",top:-1,width:20,height:3,borderRadius:2,background:T.acc,boxShadow:`0 0 8px ${T.acc}`}}/>}
        {id==="task"&&opT>0&&<div style={{position:"absolute",top:0,right:"50%",marginRight:-18,width:18,height:18,borderRadius:9,background:T.red,fontSize:9,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 8px ${T.red}60`}}>{opT}</div>}
      </div>))}
    </div>)}

    {/* ═══════ AI FAB ═══════ */}
    {!showAI&&<button onClick={()=>setShowAI(true)} style={{position:"absolute",bottom:scr?18:68,right:16,width:48,height:48,borderRadius:24,background:T.purpleBg,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(160,128,255,0.4)",cursor:"pointer",border:"none",zIndex:100}}><Ic d={P.ai} s={22} c="#fff"/></button>}

    {/* ═══════ AI CHAT ═══════ */}
    {showAI&&(<div style={{position:"absolute",inset:0,background:T.bg,display:"flex",flexDirection:"column",zIndex:150}}>
      <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:10,background:`linear-gradient(145deg,${T.purple}12,${T.bg})`,borderBottom:`1px solid ${T.bdr}`}}><div onClick={()=>setShowAI(false)} style={{cursor:"pointer",padding:4}}><Ic d={P.close} s={18} c={T.sub}/></div><div style={{width:32,height:32,borderRadius:12,background:T.purpleBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={P.ai} s={16} c="#fff"/></div><div style={{fontSize:17,fontWeight:700}}>MASTRO AI</div></div>
      <div style={{display:"flex",gap:5,padding:"8px 14px",overflow:"auto"}}>{["Oggi","Stato","Prezzi","Rossi"].map(q=><button key={q} onClick={()=>{setAiChat(p=>[...p,{r:"user",t:q}]);setAiLoad(true);setTimeout(()=>{setAiChat(p=>[...p,{r:"ai",t:getAI(q)}]);setAiLoad(false);},500);}} style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${T.bdr}`,borderRadius:14,padding:"6px 12px",fontSize:11,color:T.sub,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Outfit'"}}>{q}</button>)}</div>
      <div style={{flex:1,overflow:"auto",padding:12,display:"flex",flexDirection:"column",gap:8}}>
        {aiChat.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.r==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"85%",padding:"12px 16px",borderRadius:16,borderBottomRightRadius:m.r==="user"?4:16,borderBottomLeftRadius:m.r==="user"?16:4,background:m.r==="user"?T.accB:T.glass,border:`1px solid ${m.r==="user"?T.acc+"25":T.bdr}`}}><div style={{fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.t}</div></div></div>)}
        {aiLoad&&<div style={{display:"flex",gap:6,padding:10}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:4,background:T.purple,animation:`pulse 1s ${i*0.2}s infinite`}}/>)}</div>}
      </div>
      <div style={{padding:"8px 14px 12px",borderTop:`1px solid ${T.bdr}`,display:"flex",gap:6}}><input value={aiIn} onChange={e=>setAiIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAI()} placeholder="Chiedi..." style={{...inp,flex:1}}/><button onClick={sendAI} style={{width:44,height:44,borderRadius:22,background:aiIn.trim()?T.purpleBg:"rgba(255,255,255,0.05)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={P.send} s={18} c={aiIn.trim()?"#fff":T.sub2}/></button></div>
    </div>)}

    {/* ═══════ MODALS ═══════ */}
    {showNewCl&&(<div style={modal} onClick={()=>setShowNewCl(false)}><div style={mBox} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:18,fontWeight:800,marginBottom:16}}>Nuova Commessa</div>
      {[{l:"Cognome *",k:"cognome"},{l:"Nome *",k:"nome"},{l:"Telefono",k:"tel"},{l:"Indirizzo",k:"ind"}].map(f=><div key={f.k} style={{marginBottom:12}}><div style={lbl}>{f.l}</div><input value={newCl[f.k]} onChange={e=>setNewCl(p=>({...p,[f.k]:e.target.value}))} style={inp}/></div>)}
      <div style={{marginBottom:12}}><div style={lbl}>Sistema</div><select value={newCl.sId} onChange={e=>setNewCl(p=>({...p,sId:parseInt(e.target.value)}))} style={sel}>{sistemi.map(s=><option key={s.id} value={s.id}>{s.marca} {s.sistema} — €{s.prezzoMq}/mq</option>)}</select></div>
      <div style={{marginBottom:12}}><div style={lbl}>Colore Telaio</div><select value={newCl.colTId} onChange={e=>setNewCl(p=>({...p,colTId:parseInt(e.target.value)}))} style={sel}>{colori.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
      <div style={{marginBottom:16}}><div style={lbl}>Colore Accessori</div><select value={newCl.colAId} onChange={e=>setNewCl(p=>({...p,colAId:parseInt(e.target.value)}))} style={sel}>{colori.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
      <button onClick={addCl} style={btn(T.accBg,"#000")}>Crea Commessa</button>
    </div></div>)}

    {showAddTask&&(<div style={modal} onClick={()=>setShowAddTask(false)}><div style={mBox} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:18,fontWeight:800,marginBottom:16}}>Nuovo Task</div>
      <div style={{marginBottom:12}}><div style={lbl}>Descrizione</div><input value={newTask} onChange={e=>setNewTask(e.target.value)} style={inp}/></div>
      <div style={{marginBottom:16}}><div style={lbl}>Priorità</div><div style={{display:"flex",gap:6}}>{["alta","media","bassa"].map(p=><button key={p} onClick={()=>setNewTaskPri(p)} style={{flex:1,padding:10,borderRadius:12,background:newTaskPri===p?{alta:T.red,media:T.acc,bassa:T.sub2}[p]+"18":"rgba(255,255,255,0.04)",border:`2.5px solid ${newTaskPri===p?{alta:T.red,media:T.acc,bassa:T.sub2}[p]:"transparent"}`,color:{alta:T.red,media:T.acc,bassa:T.sub}[p],fontSize:12,fontWeight:600,cursor:"pointer"}}>{p[0].toUpperCase()+p.slice(1)}</button>)}</div></div>
      <button onClick={addTask} style={btn(T.accBg,"#000")}>Aggiungi</button>
    </div></div>)}

    </div></>);
}