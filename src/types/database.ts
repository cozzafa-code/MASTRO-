// MASTRO - MISURE App Types

export type FaseCommessa = 'sopralluogo' | 'misure' | 'preventivo' | 'conferma' | 'produzione' | 'posa' | 'chiusura';
export type TipoProdotto = 'finestra' | 'porta' | 'portoncino' | 'scorrevole' | 'tapparella' | 'cassonetto' | 'controtelaio_singolo' | 'controtelaio_doppio' | 'persiana_alluminio';
export type TipoEvento = 'sopralluogo' | 'misure';
export type StatoEvento = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type Ruolo = 'titolare' | 'misuratore' | 'posatore' | 'ufficio';

export interface TeamMember { id:string; auth_id:string|null; azienda_id:string; nome:string; cognome:string; ruolo:Ruolo; telefono:string|null; email:string|null; avatar_color:string; attivo:boolean; created_at:string; }
export interface Cliente { id:string; azienda_id:string; nome:string; cognome:string; telefono:string|null; email:string|null; indirizzo:string|null; citta:string|null; cap:string|null; note:string|null; }
export interface Commessa { id:string; azienda_id:string; cliente_id:string; codice:string; fase:FaseCommessa; indirizzo_cantiere:string|null; citta_cantiere:string|null; sistema:string|null; colore:string|null; note:string|null; created_at:string; updated_at:string; cliente?:Cliente; _misure_count?:number; }
export interface Misura { id:string; commessa_id:string; tipo_prodotto:TipoProdotto; ambiente:string; larghezza:number; altezza:number; profondita:number|null; quantita:number; note:string|null; foto_urls:string[]|null; rilevata_da:string; created_at:string; }
export interface Evento { id:string; azienda_id:string; commessa_id:string|null; tipo:TipoEvento; stato:StatoEvento; data:string; ora_inizio:string; durata_minuti:number; cliente_nome:string; cliente_indirizzo:string|null; cliente_telefono:string|null; assegnato_a:string; assegnato_da:string; note:string|null; created_at:string; }
export interface Notifica { id:string; destinatario_id:string; tipo:'assignment'|'reminder'; titolo:string; messaggio:string; evento_id:string|null; letta:boolean; created_at:string; }

export const FASI:{ fase:FaseCommessa; label:string; icon:string; order:number }[] = [
  {fase:'sopralluogo',label:'Sopralluogo',icon:'📍',order:1},{fase:'misure',label:'Misure',icon:'📐',order:2},{fase:'preventivo',label:'Preventivo',icon:'📊',order:3},
  {fase:'conferma',label:'Conferma',icon:'✅',order:4},{fase:'produzione',label:'Produzione',icon:'🏭',order:5},{fase:'posa',label:'Posa',icon:'🔧',order:6},{fase:'chiusura',label:'Chiusura',icon:'🏁',order:7}];

export const TIPI_PRODOTTO:{tipo:TipoProdotto;label:string;icon:string}[] = [
  {tipo:'finestra',label:'Finestra',icon:'🪟'},{tipo:'porta',label:'Porta',icon:'🚪'},{tipo:'portoncino',label:'Portoncino',icon:'🚪'},
  {tipo:'scorrevole',label:'Scorrevole',icon:'↔️'},{tipo:'tapparella',label:'Tapparella',icon:'🔽'},{tipo:'cassonetto',label:'Cassonetto',icon:'📦'},
  {tipo:'controtelaio_singolo',label:'Controtelaio',icon:'🔲'},{tipo:'controtelaio_doppio',label:'Controtelaio Doppio',icon:'🔲'},{tipo:'persiana_alluminio',label:'Persiana Alu',icon:'🏠'}];

export const HOURS:string[] = Array.from({length:24},(_, i)=>[`${String(i).padStart(2,'0')}:00`,`${String(i).padStart(2,'0')}:30`]).flat().filter(h=>h>='07:00'&&h<='20:00');

export function getFaseInfo(fase:FaseCommessa){ return FASI.find(f=>f.fase===fase); }
export function getTipoInfo(tipo:TipoProdotto){ return TIPI_PRODOTTO.find(t=>t.tipo===tipo); }
export function getInitials(nome:string,cognome:string){ return (nome[0]||'')+(cognome[0]||''); }
