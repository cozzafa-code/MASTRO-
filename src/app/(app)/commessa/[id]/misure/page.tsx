'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { TIPI_PRODOTTO, type TipoProdotto } from '@/types/database';

export default function MisurePage(){
  const{id}=useParams<{id:string}>();const r=useRouter();
  const{getCommessa,addMisura,currentUser}=useApp();
  const c=getCommessa(id);
  const[tipo,setTipo]=useState<TipoProdotto>('finestra');const[amb,setAmb]=useState('');
  const[w,setW]=useState('');const[h,setH]=useState('');const[d,setD]=useState('');
  const[q,setQ]=useState('1');const[note,setNote]=useState('');const[ok,setOk]=useState(false);

  if(!c)return null;

  const save=()=>{if(!amb||!w||!h)return;addMisura({commessa_id:id,tipo_prodotto:tipo,ambiente:amb,larghezza:Number(w),altezza:Number(h),profondita:d?Number(d):null,quantita:Number(q)||1,note:note||null,foto_urls:null,rilevata_da:currentUser.id});
    setOk(true);setTimeout(()=>{setOk(false);setAmb('');setW('');setH('');setD('');setQ('1');setNote('');},1200);};

  return(<div className="px-5 animate-fade-in">
    <button onClick={()=>r.push('/commessa/'+id)} className="bg-transparent border-none text-sm font-semibold cursor-pointer py-3.5" style={{color:'var(--accent)'}}>← {c.codice}</button>
    <h2 className="text-xl font-bold mb-3">📐 Nuova Misura</h2>

    {/* Sistema & Colore reference */}
    {(c.sistema||c.colore)&&<div className="rounded-[10px] p-3 border mb-4 flex gap-3" style={{background:'var(--accent-soft)',borderColor:'rgba(255,107,43,0.2)'}}>
      {c.sistema&&<div className="flex-1"><div className="text-[10px] font-semibold" style={{color:'var(--accent)'}}>🏭 Sistema</div><div className="text-[13px] font-bold">{c.sistema}</div></div>}
      {c.colore&&<div className="flex-1"><div className="text-[10px] font-semibold" style={{color:'var(--accent)'}}>🎨 Colore</div><div className="text-[13px] font-bold">{c.colore}</div></div>}
    </div>}

    {ok&&<div className="text-center py-10 animate-fade-in"><div className="text-5xl mb-2">✅</div><div className="text-lg font-bold" style={{color:'var(--success)'}}>Misura salvata!</div><div className="text-sm mt-1" style={{color:'var(--text-muted)'}}>Puoi aggiungerne un'altra</div></div>}
    {!ok&&(<>
    <div className="mb-4"><label className="block text-[11px] font-semibold mb-2" style={{color:'var(--text-muted)'}}>Tipo prodotto</label><div className="grid grid-cols-3 gap-1.5">{TIPI_PRODOTTO.map(t=>(
      <button key={t.tipo} onClick={()=>setTipo(t.tipo)} className="py-2.5 px-1.5 rounded-[10px] text-[12px] font-bold cursor-pointer text-center" style={{background:tipo===t.tipo?'var(--accent-soft)':'var(--surface)',border:'2px solid '+(tipo===t.tipo?'var(--accent)':'var(--border)'),color:tipo===t.tipo?'var(--accent)':'var(--text-muted)',fontFamily:'inherit'}}>{t.icon}<br/>{t.label}</button>))}</div></div>
    <div className="mb-3.5"><label className="block text-[11px] font-semibold mb-1.5" style={{color:'var(--text-muted)'}}>Ambiente *</label><input placeholder="Soggiorno, Camera 1, Bagno..." value={amb} onChange={e=>setAmb(e.target.value)} className="w-full p-3 rounded-[10px] text-sm" style={{background:'var(--surface)',border:'1px solid var(--border)',color:'var(--text)',fontFamily:'inherit'}}/></div>
    <div className="grid grid-cols-3 gap-2.5 mb-3.5">{[{l:'Larghezza *',v:w,s:setW,ph:'mm'},{l:'Altezza *',v:h,s:setH,ph:'mm'},{l:'Profondità',v:d,s:setD,ph:'mm'}].map(x=>(
      <div key={x.l}><label className="block text-[11px] font-semibold mb-1.5" style={{color:'var(--text-muted)'}}>{x.l}</label><input placeholder={x.ph} type="number" inputMode="numeric" value={x.v} onChange={e=>x.s(e.target.value)} className="w-full p-3 rounded-[10px] text-sm font-mono text-center" style={{background:'var(--surface)',border:'1px solid var(--border)',color:'var(--text)',fontFamily:'inherit'}}/></div>))}</div>
    <div className="grid grid-cols-2 gap-2.5 mb-3.5">
      <div><label className="block text-[11px] font-semibold mb-1.5" style={{color:'var(--text-muted)'}}>Quantità</label><input type="number" inputMode="numeric" value={q} onChange={e=>setQ(e.target.value)} className="w-full p-3 rounded-[10px] text-sm font-mono text-center" style={{background:'var(--surface)',border:'1px solid var(--border)',color:'var(--text)',fontFamily:'inherit'}}/></div>
      <div className="flex items-end"><div className="w-full rounded-[10px] p-3 text-center text-sm font-mono font-bold" style={{background:'var(--accent-soft)',color:'var(--accent)',border:'1px solid rgba(255,107,43,0.2)'}}>{w&&h?`${w} × ${h}`:'-'} mm</div></div></div>
    <div className="mb-4"><label className="block text-[11px] font-semibold mb-1.5" style={{color:'var(--text-muted)'}}>Note</label><input placeholder="Davanzale, spalletta, ostacoli..." value={note} onChange={e=>setNote(e.target.value)} className="w-full p-3 rounded-[10px] text-sm" style={{background:'var(--surface)',border:'1px solid var(--border)',color:'var(--text)',fontFamily:'inherit'}}/></div>
    <button onClick={save} className="w-full py-4 rounded-[10px] text-white text-base font-bold cursor-pointer border-none" style={{background:(amb&&w&&h)?'var(--accent)':'var(--border)',fontFamily:'inherit'}}>✓ Salva Misura</button>
    </>)}
  </div>);
}
