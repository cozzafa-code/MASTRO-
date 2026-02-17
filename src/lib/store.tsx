'use client';
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { TeamMember, Commessa, Cliente, Misura, Evento, Notifica, StatoEvento, FaseCommessa } from '@/types/database';

const AZ_ID='00000000-0000-0000-0000-000000000001';
const MY_ID='00000000-0000-0000-0000-000000000020'; // Marco - misuratore
let _cnum=1;

interface AppStore{
  loading:boolean;
  currentUser:TeamMember;team:TeamMember[];commesse:Commessa[];clienti:Cliente[];misure:Misura[];eventi:Evento[];notifiche:Notifica[];
  getMisureByCommessa:(id:string)=>Misura[];getMyEventi:()=>Evento[];getMyEventiByDate:(d:string)=>Evento[];
  getCommessa:(id:string)=>Commessa|undefined;getMember:(id:string)=>TeamMember|undefined;getUnreadCount:()=>number;
  addMisura:(d:Omit<Misura,'id'|'created_at'>)=>void;
  addEvento:(d:Omit<Evento,'id'|'created_at'|'azienda_id'>)=>void;updateEvento:(id:string,d:Partial<Evento>)=>void;deleteEvento:(id:string)=>void;
  acceptEvento:(id:string)=>void;markNotificaRead:(id:string)=>void;markAllNotificheRead:()=>void;
  addCommessa:(cliente:Omit<Cliente,'id'|'azienda_id'>,indirizzo:string,citta:string,note:string)=>Commessa;
  updateCommessa:(id:string,d:Partial<Commessa>)=>void;
  refresh:()=>void;
}

const AppContext=createContext<AppStore|null>(null);

export function AppProvider({children}:{children:ReactNode}){
  const[loading,setLoading]=useState(true);
  const[team,setTeam]=useState<TeamMember[]>([]);
  const[currentUser,setCurrentUser]=useState<TeamMember>({id:MY_ID,auth_id:null,azienda_id:AZ_ID,nome:'Marco',cognome:'G.',ruolo:'misuratore',telefono:null,email:null,avatar_color:'#3498DB',attivo:true,created_at:''});
  const[clienti,setClienti]=useState<Cliente[]>([]);
  const[commesse,setCommesse]=useState<Commessa[]>([]);
  const[misure,setMisure]=useState<Misura[]>([]);
  const[eventi,setEventi]=useState<Evento[]>([]);
  const[notifiche,setNotifiche]=useState<Notifica[]>([]);

  const fetchAll=useCallback(async()=>{
    try{
      const[tRes,clRes,cmRes,mRes,evRes,nRes]=await Promise.all([
        supabase.from('team_members').select('*').eq('azienda_id',AZ_ID),
        supabase.from('clienti').select('*').eq('azienda_id',AZ_ID),
        supabase.from('commesse').select('*, clienti(*)').eq('azienda_id',AZ_ID).order('created_at',{ascending:false}),
        supabase.from('misure').select('*'),
        supabase.from('eventi').select('*').eq('azienda_id',AZ_ID).order('data',{ascending:true}),
        supabase.from('notifiche').select('*').eq('destinatario_id',MY_ID)
      ]);
      if(tRes.data){setTeam(tRes.data as any);const me=tRes.data.find((m:any)=>m.id===MY_ID);if(me)setCurrentUser(me as any);}
      if(clRes.data)setClienti(clRes.data as any);
      if(cmRes.data){
        const cms=cmRes.data.map((c:any)=>({...c,cliente:c.clienti,_misure_count:0}));
        // count misure per commessa
        if(mRes.data){
          const counts:Record<string,number>={};
          mRes.data.forEach((m:any)=>{counts[m.commessa_id]=(counts[m.commessa_id]||0)+1;});
          cms.forEach((c:any)=>{c._misure_count=counts[c.id]||0;});
        }
        setCommesse(cms);
        // set codice counter
        const nums=cms.map((c:any)=>{const m=c.codice?.match(/(\d+)$/);return m?parseInt(m[1]):0;});
        _cnum=Math.max(...nums,0)+1;
      }
      if(mRes.data)setMisure(mRes.data as any);
      if(evRes.data)setEventi(evRes.data.map((e:any)=>({...e,data:e.data,ora_inizio:e.ora_inizio?.slice(0,5)||'09:00'})) as any);
      if(nRes.data)setNotifiche(nRes.data as any);
    }catch(e){console.error('Fetch error:',e);}
    setLoading(false);
  },[]);

  useEffect(()=>{fetchAll();},[fetchAll]);

  const getMisureByCommessa=useCallback((id:string)=>misure.filter(m=>m.commessa_id===id),[misure]);
  const getMyEventi=useCallback(()=>eventi.filter(e=>e.assegnato_a===currentUser.id),[eventi,currentUser]);
  const getMyEventiByDate=useCallback((d:string)=>eventi.filter(e=>e.assegnato_a===currentUser.id&&e.data===d).sort((a,b)=>(a.ora_inizio||'').localeCompare(b.ora_inizio||'')),[eventi,currentUser]);
  const getCommessa=useCallback((id:string)=>commesse.find(c=>c.id===id),[commesse]);
  const getMember=useCallback((id:string)=>team.find(m=>m.id===id),[team]);
  const getUnreadCount=useCallback(()=>notifiche.filter(n=>!n.letta&&n.destinatario_id===currentUser.id).length,[notifiche,currentUser]);

  const addMisura=useCallback(async(d:Omit<Misura,'id'|'created_at'>)=>{
    const{data,error}=await supabase.from('misure').insert({commessa_id:d.commessa_id,tipo_prodotto:d.tipo_prodotto,ambiente:d.ambiente,larghezza:d.larghezza,altezza:d.altezza,profondita:d.profondita,quantita:d.quantita,note:d.note,foto_urls:d.foto_urls,rilevata_da:d.rilevata_da}).select().single();
    if(data){setMisure(p=>[...p,data as any]);setCommesse(p=>p.map(c=>c.id===d.commessa_id?{...c,_misure_count:(c._misure_count||0)+1}:c));}
    if(error)console.error('addMisura error:',error);
  },[]);

  const addEvento=useCallback(async(d:Omit<Evento,'id'|'created_at'|'azienda_id'>)=>{
    const ins={azienda_id:AZ_ID,commessa_id:d.commessa_id||null,tipo:d.tipo,stato:d.stato,data:d.data,ora_inizio:d.ora_inizio,durata_minuti:d.durata_minuti,cliente_nome:d.cliente_nome,cliente_indirizzo:d.cliente_indirizzo,cliente_telefono:d.cliente_telefono,assegnato_a:d.assegnato_a,assegnato_da:d.assegnato_da,note:d.note};
    const{data,error}=await supabase.from('eventi').insert(ins).select().single();
    if(data)setEventi(p=>[...p,{...data,ora_inizio:data.ora_inizio?.slice(0,5)||'09:00'} as any]);
    if(error)console.error('addEvento error:',error);
  },[]);

  const updateEvento=useCallback(async(id:string,d:Partial<Evento>)=>{
    const upd:any={...d};delete upd.id;delete upd.created_at;
    const{error}=await supabase.from('eventi').update(upd).eq('id',id);
    if(!error)setEventi(p=>p.map(e=>e.id===id?{...e,...d}:e));
    else console.error('updateEvento error:',error);
  },[]);

  const deleteEvento=useCallback(async(id:string)=>{
    const{error}=await supabase.from('eventi').delete().eq('id',id);
    if(!error)setEventi(p=>p.filter(e=>e.id!==id));
    else console.error('deleteEvento error:',error);
  },[]);

  const acceptEvento=useCallback(async(id:string)=>{
    await supabase.from('eventi').update({stato:'confirmed'}).eq('id',id);
    setEventi(p=>p.map(e=>e.id===id?{...e,stato:'confirmed' as StatoEvento}:e));
    await supabase.from('notifiche').update({letta:true}).eq('evento_id',id);
    setNotifiche(p=>p.map(n=>n.evento_id===id?{...n,letta:true}:n));
  },[]);

  const markNotificaRead=useCallback(async(id:string)=>{
    await supabase.from('notifiche').update({letta:true}).eq('id',id);
    setNotifiche(p=>p.map(n=>n.id===id?{...n,letta:true}:n));
  },[]);

  const markAllNotificheRead=useCallback(async()=>{
    await supabase.from('notifiche').update({letta:true}).eq('destinatario_id',currentUser.id).eq('letta',false);
    setNotifiche(p=>p.map(n=>n.destinatario_id===currentUser.id?{...n,letta:true}:n));
  },[currentUser]);

  const addCommessa=useCallback((clienteData:Omit<Cliente,'id'|'azienda_id'>,indirizzo:string,citta:string,note:string)=>{
    const codice=`C-2025-${String(_cnum++).padStart(3,'0')}`;
    const tempId='temp-'+Date.now();
    const tempClId='tempcl-'+Date.now();
    const tempCl:Cliente={...clienteData,id:tempClId,azienda_id:AZ_ID};
    const tempCm:Commessa={id:tempId,azienda_id:AZ_ID,cliente_id:tempClId,codice,fase:'sopralluogo' as FaseCommessa,indirizzo_cantiere:indirizzo||null,citta_cantiere:citta||null,sistema:null,colore:null,note:note||null,created_at:new Date().toISOString(),updated_at:'',cliente:tempCl,_misure_count:0};
    // Optimistic update
    setClienti(p=>[...p,tempCl]);
    setCommesse(p=>[tempCm,...p]);
    // Async save
    (async()=>{
      const{data:cl}=await supabase.from('clienti').insert({azienda_id:AZ_ID,nome:clienteData.nome,cognome:clienteData.cognome,telefono:clienteData.telefono,email:clienteData.email,indirizzo:clienteData.indirizzo,citta:clienteData.citta,cap:clienteData.cap,note:clienteData.note}).select().single();
      if(cl){
        const{data:cm}=await supabase.from('commesse').insert({azienda_id:AZ_ID,cliente_id:cl.id,codice,fase:'sopralluogo',indirizzo_cantiere:indirizzo||null,citta_cantiere:citta||null,note:note||null}).select('*, clienti(*)').single();
        if(cm){
          setClienti(p=>p.map(c=>c.id===tempClId?{...cl} as any:c));
          setCommesse(p=>p.map(c=>c.id===tempId?{...cm,cliente:cm.clienti,_misure_count:0} as any:c));
        }
      }
    })();
    return tempCm;
  },[]);

  const updateCommessa=useCallback(async(id:string,d:Partial<Commessa>)=>{
    const upd:any={...d};delete upd.id;delete upd.created_at;delete upd.cliente;delete upd._misure_count;
    const{error}=await supabase.from('commesse').update(upd).eq('id',id);
    if(!error)setCommesse(p=>p.map(c=>c.id===id?{...c,...d}:c));
    else console.error('updateCommessa error:',error);
  },[]);

  return <AppContext.Provider value={{loading,currentUser,team,clienti,commesse,misure,eventi,notifiche,getMisureByCommessa,getMyEventi,getMyEventiByDate,getCommessa,getMember,getUnreadCount,addMisura,addEvento,updateEvento,deleteEvento,acceptEvento,markNotificaRead,markAllNotificheRead,addCommessa,updateCommessa,refresh:fetchAll}}>{children}</AppContext.Provider>;
}
export function useApp():AppStore{const c=useContext(AppContext);if(!c)throw new Error('wrap in AppProvider');return c;}
