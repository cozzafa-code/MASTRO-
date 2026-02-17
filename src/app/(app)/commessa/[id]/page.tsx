'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { FASI, getFaseInfo, getTipoInfo } from '@/types/database';

export default function CommessaDetail(){
  const{id}=useParams<{id:string}>();const r=useRouter();
  const{getCommessa,getMisureByCommessa,getMember,updateCommessa}=useApp();
  const c=getCommessa(id);
  const[editSC,setEditSC]=useState(false);
  const[sys,setSys]=useState(c?.sistema||'');
  const[col,setCol]=useState(c?.colore||'');

  if(!c)return<div className="p-5 text-center" style={{color:'var(--text-muted)'}}>Commessa non trovata</div>;
  const ms=getMisureByCommessa(id);const fi=getFaseInfo(c.fase);

  const saveSC=()=>{updateCommessa(id,{sistema:sys||null,colore:col||null});setEditSC(false);};

  return(<div className="px-5 animate-fade-in">
    <button onClick={()=>r.push('/')} className="bg-transparent border-none text-sm font-semibold cursor-pointer py-3.5" style={{color:'var(--accent)'}}>← Commesse</button>

    {/* Header */}
    <div className="rounded-[14px] p-5 border mb-3" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
      <div className="flex justify-between items-start mb-2"><span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md" style={{color:'var(--accent)',background:'var(--accent-soft)'}}>{c.codice}</span><span className="text-[11px] font-semibold px-2.5 py-1 rounded-2xl" style={{background:(fi?.order??0)<=2?'var(--accent-soft)':'rgba(46,204,113,0.15)',color:(fi?.order??0)<=2?'var(--accent)':'var(--success)'}}>{fi?.icon} {fi?.label}</span></div>
      <h1 className="text-[22px] font-bold mb-0.5">{c.cliente?c.cliente.cognome+' '+c.cliente.nome:'-'}</h1>
      <div className="text-sm mb-1" style={{color:'var(--text-muted)'}}>{c.indirizzo_cantiere}{c.citta_cantiere?', '+c.citta_cantiere:''}</div>
      {c.cliente?.telefono&&<a href={'tel:'+c.cliente.telefono} className="text-sm font-semibold no-underline" style={{color:'var(--accent)'}}>📞 {c.cliente.telefono}</a>}
    </div>

    {/* Sistema & Colore */}
    <div className="rounded-[14px] p-4 border mb-3" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
      <div className="flex justify-between items-center mb-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide" style={{color:'var(--accent)'}}>🎨 Sistema & Colore</div>
        <button onClick={()=>{if(editSC)saveSC();else{setSys(c.sistema||'');setCol(c.colore||'');setEditSC(true);}}} className="bg-transparent border-none text-[12px] font-semibold cursor-pointer" style={{color:'var(--accent)'}}>{editSC?'✓ Salva':'✏️ Modifica'}</button>
      </div>
      {editSC?(<div className="flex flex-col gap-2.5">
        <div><label className="block text-[11px] font-semibold mb-1.5" style={{color:'var(--text-muted)'}}>Sistema (profilo)</label><input placeholder="es. Schüco AWS 75, Rehau Geneo..." value={sys} onChange={e=>setSys(e.target.value)} className="w-full p-3 rounded-[10px] text-sm" style={{background:'var(--bg)',border:'1px solid var(--border)',color:'var(--text)',fontFamily:'inherit'}}/></div>
        <div><label className="block text-[11px] font-semibold mb-1.5" style={{color:'var(--text-muted)'}}>Colore</label><input placeholder="es. RAL 7016 Grigio Antracite..." value={col} onChange={e=>setCol(e.target.value)} className="w-full p-3 rounded-[10px] text-sm" style={{background:'var(--bg)',border:'1px solid var(--border)',color:'var(--text)',fontFamily:'inherit'}}/></div>
        <button onClick={()=>setEditSC(false)} className="bg-transparent border-none text-xs cursor-pointer self-start" style={{color:'var(--text-dim)'}}>Annulla</button>
      </div>):(
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-[10px] p-3" style={{background:'var(--bg)'}}>
            <div className="text-[10px] mb-1" style={{color:'var(--text-dim)'}}>🏭 Sistema</div>
            <div className="text-[13px] font-semibold" style={{color:c.sistema?'var(--text)':'var(--text-dim)'}}>{c.sistema||'Non impostato'}</div>
          </div>
          <div className="rounded-[10px] p-3" style={{background:'var(--bg)'}}>
            <div className="text-[10px] mb-1" style={{color:'var(--text-dim)'}}>🎨 Colore</div>
            <div className="text-[13px] font-semibold" style={{color:c.colore?'var(--text)':'var(--text-dim)'}}>{c.colore||'Non impostato'}</div>
          </div>
        </div>
      )}
    </div>

    {/* Fasi workflow */}
    <div className="rounded-[14px] p-4 border mb-3" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
      <div className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{color:'var(--text-muted)'}}>Workflow</div>
      <div className="flex gap-1">{FASI.map(f=>{const cur=fi?.order??0;const done=f.order<cur;const act=f.order===cur;return<div key={f.fase} className="flex-1 text-center"><div className="h-[6px] rounded-full mb-1" style={{background:done?'var(--success)':act?'var(--accent)':'var(--border)'}}></div><div className="text-[10px]" style={{color:act?'var(--accent)':done?'var(--success)':'var(--text-dim)'}}>{f.icon}</div></div>;})}</div>
    </div>

    {/* Misure */}
    <div className="flex justify-between items-center mb-3"><h2 className="text-base font-bold">📐 Misure ({ms.length})</h2><button onClick={()=>r.push('/commessa/'+id+'/misure')} className="text-sm font-bold py-2.5 px-4 rounded-[10px] border-none cursor-pointer text-white" style={{background:'var(--accent)',fontFamily:'inherit'}}>+ Aggiungi</button></div>
    {ms.map(m=>{const ti=getTipoInfo(m.tipo_prodotto);return(
      <div key={m.id} className="rounded-[10px] p-3 border mb-2" style={{background:'var(--surface)',borderColor:'var(--border)'}}>
        <div className="flex justify-between items-start"><div><span className="text-sm font-semibold">{ti?.icon} {ti?.label}</span><span className="text-xs ml-2" style={{color:'var(--text-muted)'}}>— {m.ambiente}</span></div><div className="font-mono text-sm font-bold" style={{color:'var(--accent)'}}>{m.larghezza}×{m.altezza}</div></div>
        {m.note&&<div className="text-xs mt-1" style={{color:'var(--text-dim)'}}>{m.note}</div>}
      </div>);})}
    {ms.length===0&&<div className="rounded-[14px] py-7 border text-center" style={{background:'var(--surface)',borderColor:'var(--border)',color:'var(--text-dim)'}}>Nessuna misura. Inizia dal sopralluogo!</div>}
  </div>);
}
