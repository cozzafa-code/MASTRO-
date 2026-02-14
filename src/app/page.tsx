'use client'

import React, { useState, useEffect } from 'react'
import { supabase, AZIENDA_ID } from '@/lib/supabase'
import { Commessa, Cliente, Evento, Fattura, Pagamento, Scadenza, STATI_COMMESSA, ArticoloMagazzino, CategoriaMagazzino, MovimentoMagazzino, Fornitore, FaseProduzione, CentroLavoro, Lavorazione, Dipendente, CommessaAttivita, MACRO_FASI, OrdineFornitore, Promemoria } from '@/lib/types'

export default function Dashboard() {
  const [commesse, setCommesse] = useState<(Commessa & { cliente?: Cliente })[]>([])
  const [eventiOggi, setEventiOggi] = useState<Evento[]>([])
  const [fatture, setFatture] = useState<(Fattura & { cliente?: Cliente; commessa?: Commessa })[]>([])
  const [pagamenti, setPagamenti] = useState<(Pagamento & { cliente?: Cliente })[]>([])
  const [scadenze, setScadenze] = useState<(Scadenza & { cliente?: Cliente; commessa?: Commessa })[]>([])
  const [stats, setStats] = useState({ attive: 0, valore: 0, oggi: 0, inbox: 0 })
  const [finStats, setFinStats] = useState({ fatturato: 0, incassato: 0, daIncassare: 0, scadute: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('home')
  const [activeCommessa, setActiveCommessa] = useState<string | null>(null)
  const [contabView, setContabView] = useState<string>('overview')
  const [showNewFattura, setShowNewFattura] = useState(false)
  const [showNewPagamento, setShowNewPagamento] = useState(false)

  // Magazzino state
  const [articoli, setArticoli] = useState<(ArticoloMagazzino & { fornitore?: Fornitore; categoria?: CategoriaMagazzino })[]>([])
  const [movimenti, setMovimenti] = useState<(MovimentoMagazzino & { articolo?: ArticoloMagazzino })[]>([])
  const [fornitori, setFornitori] = useState<Fornitore[]>([])
  const [magView, setMagView] = useState<string>('articoli')
  const [magFilter, setMagFilter] = useState<string>('tutti')
  const [showNewMovimento, setShowNewMovimento] = useState(false)
  const [newMovimento, setNewMovimento] = useState({ articolo_id: '', tipo: 'carico', causale: 'acquisto', quantita: 0, prezzo_unitario: 0, documento_rif: '', note: '' })

  // Produzione state
  const [fasi, setFasi] = useState<FaseProduzione[]>([])
  const [centriLavoro, setCentriLavoro] = useState<CentroLavoro[]>([])
  const [lavorazioni, setLavorazioni] = useState<(Lavorazione & { fase?: FaseProduzione; centro_lavoro?: CentroLavoro; commessa?: Commessa })[]>([])
  const [dipendenti, setDipendenti] = useState<Dipendente[]>([])
  const [prodView, setProdView] = useState<string>('lavorazioni')

  // Commesse & Clienti state
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [commessaFilter, setCommessaFilter] = useState<string>('tutti')
  const [clienteFilter, setClienteFilter] = useState<string>('tutti')
  const [selectedCommessa, setSelectedCommessa] = useState<string | null>(null)
  const [showNewCommessa, setShowNewCommessa] = useState(false)
  const [showNewCliente, setShowNewCliente] = useState(false)
  const [newCommessa, setNewCommessa] = useState({ titolo: '', cliente_id: '', indirizzo: '', citta: '', valore_preventivo: 0, note: '' })
  const [newCliente, setNewCliente] = useState({ nome: '', cognome: '', telefono: '', email: '', indirizzo: '', citta: '', tipo: 'privato' })

  // Vista Progetto state
  const [commessaAttivita, setCommessaAttivita] = useState<CommessaAttivita[]>([])
  const [progettoLoading, setProgettoLoading] = useState(false)
  const [expandedFase, setExpandedFase] = useState<string | null>(null)
  const [expandedAttivita, setExpandedAttivita] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<{ id: string; note: string } | null>(null)

  // Calendario state
  const [calView, setCalView] = useState<string>('settimana')
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calWeekStart, setCalWeekStart] = useState(() => {
    const d = new Date(); const day = d.getDay(); const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff)).toISOString().split('T')[0]
  })
  const [calSelectedDate, setCalSelectedDate] = useState<string | null>(null)
  const [calEventi, setCalEventi] = useState<(Evento & { cliente?: Cliente })[]>([])
  const [showNewEvento, setShowNewEvento] = useState(false)
  const [newEvento, setNewEvento] = useState({ titolo: '', tipo: 'sopralluogo', data: new Date().toISOString().split('T')[0], ora_inizio: '09:00', durata_min: 60, cliente_id: '', commessa_id: '', note: '' })

  // Enhanced Dashboard & Calendar state
  const [globalSearch, setGlobalSearch] = useState('')
  const [calFilterTipo, setCalFilterTipo] = useState<string[]>([])
  const [calZoom, setCalZoom] = useState(2) // 1=compact, 2=normal, 3=expanded
  const [dashView, setDashView] = useState<string>('kanban')

  // Ordini state
  const [ordini, setOrdini] = useState<(OrdineFornitore & { fornitore?: Fornitore; commessa?: Commessa })[]>([])
  const [showNewOrdine, setShowNewOrdine] = useState(false)
  const [newOrdine, setNewOrdine] = useState({ codice: '', fornitore_id: '', commessa_id: '', tipo: 'materiale', descrizione: '', importo_totale: 0, data_ordine: new Date().toISOString().split('T')[0], data_consegna_prevista: '', note: '' })

  // Promemoria state
  const [promemoria, setPromemoria] = useState<(Promemoria & { commessa?: Commessa; cliente?: Cliente })[]>([])
  const [newPromemoriaText, setNewPromemoriaText] = useState('')
  const [newPromemoriaPriorita, setNewPromemoriaPriorita] = useState('normale')
  const [newPromemoriaCommessa, setNewPromemoriaCommessa] = useState('')
  const [showPromemoriaForm, setShowPromemoriaForm] = useState(false)
  const [newFattura, setNewFattura] = useState({
    cliente_id: '', commessa_id: '', numero: '', tipo: 'fattura', direzione: 'emessa',
    data_emissione: new Date().toISOString().split('T')[0], data_scadenza: '',
    imponibile: 0, aliquota_iva: 10, note: '', metodo_pagamento: 'bonifico'
  })

  // New Pagamento form
  const [newPagamento, setNewPagamento] = useState({
    cliente_id: '', commessa_id: '', fattura_id: '', tipo: 'incasso',
    importo: 0, data_pagamento: new Date().toISOString().split('T')[0],
    metodo: 'bonifico', riferimento: '', note: ''
  })

  useEffect(() => { loadAll() }, [])

  // Load attività when selected commessa changes + Realtime subscription
  useEffect(() => {
    if (selectedCommessa) {
      loadCommessaAttivita(selectedCommessa)
      // Realtime subscription
      const channel = supabase
        .channel(`attivita-${selectedCommessa}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'commessa_attivita', filter: `commessa_id=eq.${selectedCommessa}` },
          () => { loadCommessaAttivita(selectedCommessa) }
        ).subscribe()
      return () => { supabase.removeChannel(channel) }
    } else {
      setCommessaAttivita([])
      setExpandedFase(null)
      setExpandedAttivita(null)
    }
  }, [selectedCommessa])

  async function loadAll() {
    setLoading(true)
    await Promise.all([loadDashboard(), loadContabilita(), loadMagazzino(), loadProduzione(), loadClienti(), loadOrdini(), loadPromemoria()])
    setLoading(false)
  }

  async function loadDashboard() {
    const { data: commData } = await supabase
      .from('commesse').select('*, cliente:clienti(*)').eq('azienda_id', AZIENDA_ID)
      .neq('stato', 'chiusura').order('updated_at', { ascending: false })

    const oggi = new Date().toISOString().split('T')[0]
    const { data: evData } = await supabase
      .from('eventi').select('*, cliente:clienti(*)').eq('azienda_id', AZIENDA_ID)
      .eq('data', oggi).order('ora_inizio', { ascending: true })

    const { count: inboxCount } = await supabase
      .from('inbox').select('*', { count: 'exact', head: true })
      .eq('azienda_id', AZIENDA_ID).eq('letto', false)

    const comm = (commData || []) as (Commessa & { cliente?: Cliente })[]
    setCommesse(comm)
    setEventiOggi((evData || []) as Evento[])
    setStats({
      attive: comm.length,
      valore: comm.reduce((s, c) => s + (c.valore_preventivo || 0), 0),
      oggi: (evData || []).length,
      inbox: inboxCount || 0,
    })
  }

  async function loadContabilita() {
    const { data: fatData } = await supabase
      .from('fatture').select('*, cliente:clienti(*), commessa:commesse(*)')
      .eq('azienda_id', AZIENDA_ID).order('data_emissione', { ascending: false })

    const { data: pagData } = await supabase
      .from('pagamenti').select('*, cliente:clienti(*)')
      .eq('azienda_id', AZIENDA_ID).order('data_pagamento', { ascending: false })

    const { data: scadData } = await supabase
      .from('scadenze').select('*, cliente:clienti(*), commessa:commesse(*)')
      .eq('azienda_id', AZIENDA_ID).order('data_scadenza', { ascending: true })

    const fat = (fatData || []) as (Fattura & { cliente?: Cliente; commessa?: Commessa })[]
    const pag = (pagData || []) as (Pagamento & { cliente?: Cliente })[]
    const scad = (scadData || []) as (Scadenza & { cliente?: Cliente; commessa?: Commessa })[]

    setFatture(fat)
    setPagamenti(pag)
    setScadenze(scad)

    const emesse = fat.filter(f => f.direzione === 'emessa')
    const incassato = pag.filter(p => p.tipo === 'incasso').reduce((s, p) => s + p.importo, 0)
    const oggiStr = new Date().toISOString().split('T')[0]
    const scadute = scad.filter(s => s.stato === 'aperta' && s.data_scadenza < oggiStr)

    setFinStats({
      fatturato: emesse.reduce((s, f) => s + f.totale, 0),
      incassato,
      daIncassare: emesse.reduce((s, f) => s + f.totale, 0) - incassato,
      scadute: scadute.reduce((s, sc) => s + sc.importo, 0),
    })
  }

  async function loadMagazzino() {
    const { data: artData } = await supabase
      .from('articoli_magazzino').select('*')
      .eq('azienda_id', AZIENDA_ID).order('codice', { ascending: true })

    const { data: movData } = await supabase
      .from('movimenti_magazzino').select('*, articolo:articoli_magazzino(*)')
      .eq('azienda_id', AZIENDA_ID).order('created_at', { ascending: false }).limit(50)

    const { data: forData } = await supabase
      .from('fornitori').select('*')
      .eq('azienda_id', AZIENDA_ID).order('ragione_sociale', { ascending: true })

    setArticoli((artData || []) as any[])
    setMovimenti((movData || []) as any[])
    setFornitori((forData || []) as Fornitore[])
  }

  async function loadProduzione() {
    const { data: fasiData } = await supabase
      .from('fasi_produzione').select('*')
      .eq('azienda_id', AZIENDA_ID).order('ordine', { ascending: true })

    const { data: centriData } = await supabase
      .from('centri_lavoro').select('*')
      .eq('azienda_id', AZIENDA_ID)

    const { data: lavData } = await supabase
      .from('lavorazioni').select('*, fase:fasi_produzione(*), commessa:commesse(*)')
      .eq('azienda_id', AZIENDA_ID).order('created_at', { ascending: false })

    const { data: dipData } = await supabase
      .from('dipendenti').select('*')
      .eq('azienda_id', AZIENDA_ID).eq('attivo', true)

    setFasi((fasiData || []) as FaseProduzione[])
    setCentriLavoro((centriData || []) as CentroLavoro[])
    setLavorazioni((lavData || []) as any[])
    setDipendenti((dipData || []) as Dipendente[])
  }

  async function updateLavorazioneStato(id: string, nuovoStato: string) {
    const updates: any = { stato: nuovoStato }
    if (nuovoStato === 'in_corso') updates.data_inizio = new Date().toISOString()
    if (nuovoStato === 'completata') updates.data_fine = new Date().toISOString()
    await supabase.from('lavorazioni').update(updates).eq('id', id)
    await loadProduzione()
  }

  async function loadClienti() {
    const { data } = await supabase.from('clienti').select('*').eq('azienda_id', AZIENDA_ID).order('cognome', { ascending: true })
    setClienti((data || []) as Cliente[])
  }

  // ==================== VISTA PROGETTO: Load & Update ====================
  async function loadCommessaAttivita(commessaId: string) {
    setProgettoLoading(true)
    const { data, error } = await supabase
      .from('commessa_attivita')
      .select('*')
      .eq('commessa_id', commessaId)
      .order('macro_fase_ordine', { ascending: true })
      .order('ordine', { ascending: true })
    if (!error) {
      setCommessaAttivita((data || []) as CommessaAttivita[])
      // Auto-expand first non-complete fase
      const firstActive = (data || []).find((a: any) => a.stato !== 'completata')
      if (firstActive) setExpandedFase((firstActive as any).macro_fase)
    }
    setProgettoLoading(false)
  }

  async function updateAttivitaStato(id: string, nuovoStato: string) {
    const updates: any = { stato: nuovoStato }
    if (nuovoStato === 'in_corso') {
      updates.data_inizio = new Date().toISOString()
      updates.percentuale = 10
    }
    if (nuovoStato === 'completata') {
      updates.data_fine = new Date().toISOString()
      updates.percentuale = 100
    }
    if (nuovoStato === 'da_fare') {
      updates.percentuale = 0
      updates.data_inizio = null
      updates.data_fine = null
    }
    await supabase.from('commessa_attivita').update(updates).eq('id', id)
    if (selectedCommessa) await loadCommessaAttivita(selectedCommessa)
  }

  async function updateAttivitaPercentuale(id: string, perc: number) {
    const updates: any = { percentuale: perc }
    if (perc === 100) {
      updates.stato = 'completata'
      updates.data_fine = new Date().toISOString()
    } else if (perc > 0) {
      updates.stato = 'in_corso'
      const att = commessaAttivita.find(a => a.id === id)
      if (att && !att.data_inizio) updates.data_inizio = new Date().toISOString()
    } else {
      updates.stato = 'da_fare'
    }
    await supabase.from('commessa_attivita').update(updates).eq('id', id)
    if (selectedCommessa) await loadCommessaAttivita(selectedCommessa)
  }

  async function updateAttivitaField(id: string, field: string, value: any) {
    await supabase.from('commessa_attivita').update({ [field]: value }).eq('id', id)
    if (selectedCommessa) await loadCommessaAttivita(selectedCommessa)
  }

  async function saveAttivitaNote(id: string, note: string) {
    await supabase.from('commessa_attivita').update({ note }).eq('id', id)
    setEditingNote(null)
    if (selectedCommessa) await loadCommessaAttivita(selectedCommessa)
  }


  async function createCommessa() {
    const count = commesse.length
    const codice = `WC-${String(count + 257).padStart(4, '0')}`
    const { error } = await supabase.from('commesse').insert({
      azienda_id: AZIENDA_ID, codice, titolo: newCommessa.titolo,
      cliente_id: newCommessa.cliente_id || null, indirizzo: newCommessa.indirizzo,
      citta: newCommessa.citta, valore_preventivo: newCommessa.valore_preventivo,
      note: newCommessa.note || null, stato: 'sopralluogo',
    })
    if (!error) {
      setShowNewCommessa(false)
      setNewCommessa({ titolo: '', cliente_id: '', indirizzo: '', citta: '', valore_preventivo: 0, note: '' })
      await loadAll()
    }
  }

  async function createCliente() {
    const { error } = await supabase.from('clienti').insert({
      azienda_id: AZIENDA_ID, nome: newCliente.nome, cognome: newCliente.cognome,
      telefono: newCliente.telefono, email: newCliente.email,
      indirizzo: newCliente.indirizzo, citta: newCliente.citta, tipo: newCliente.tipo,
    })
    if (!error) {
      setShowNewCliente(false)
      setNewCliente({ nome: '', cognome: '', telefono: '', email: '', indirizzo: '', citta: '', tipo: 'privato' })
      await loadClienti()
    }
  }

  async function updateCommessaStato(id: string, nuovoStato: string) {
    await supabase.from('commesse').update({ stato: nuovoStato }).eq('id', id)
    await loadDashboard()
  }

  async function loadCalendario() {
    const d1 = new Date(calYear, calMonth - 1, 1)
    const d2 = new Date(calYear, calMonth + 2, 1)
    const startDate = d1.toISOString().split('T')[0]
    const endDate = d2.toISOString().split('T')[0]
    const { data } = await supabase
      .from('eventi').select('*, cliente:clienti(*)')
      .eq('azienda_id', AZIENDA_ID)
      .gte('data', startDate).lt('data', endDate)
      .order('ora_inizio', { ascending: true })
    setCalEventi((data || []) as any[])
  }

  useEffect(() => { if (activeTab === 'calendario') loadCalendario() }, [calMonth, calYear, calWeekStart, activeTab])

  // ============= ORDINI =============
  async function loadOrdini() {
    const { data } = await supabase
      .from('ordini_fornitore').select('*, fornitore:fornitori(*), commessa:commesse(*)')
      .eq('azienda_id', AZIENDA_ID)
      .order('created_at', { ascending: false })
    if (data) setOrdini(data as any[])
  }

  async function createOrdine() {
    const nextNum = ordini.length + 1
    const codice = newOrdine.codice || `ORD-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`
    const { error } = await supabase.from('ordini_fornitore').insert({
      azienda_id: AZIENDA_ID, codice, stato: 'bozza', tipo: newOrdine.tipo,
      fornitore_id: newOrdine.fornitore_id || null, commessa_id: newOrdine.commessa_id || null,
      descrizione: newOrdine.descrizione || null, importo_totale: newOrdine.importo_totale,
      data_ordine: newOrdine.data_ordine || null, data_consegna_prevista: newOrdine.data_consegna_prevista || null,
      note: newOrdine.note || null,
    })
    if (!error) {
      setShowNewOrdine(false)
      setNewOrdine({ codice: '', fornitore_id: '', commessa_id: '', tipo: 'materiale', descrizione: '', importo_totale: 0, data_ordine: new Date().toISOString().split('T')[0], data_consegna_prevista: '', note: '' })
      await loadOrdini()
    }
  }

  async function updateOrdineStato(id: string, stato: string) {
    const updates: any = { stato }
    if (stato === 'consegnato') updates.data_consegna_effettiva = new Date().toISOString().split('T')[0]
    await supabase.from('ordini_fornitore').update(updates).eq('id', id)
    await loadOrdini()
  }

  // ============= PROMEMORIA =============
  async function loadPromemoria() {
    const { data } = await supabase
      .from('promemoria').select('*, commessa:commesse(*), cliente:clienti(*)')
      .eq('azienda_id', AZIENDA_ID)
      .order('created_at', { ascending: false })
    if (data) setPromemoria(data as any[])
  }

  async function createPromemoria() {
    if (!newPromemoriaText.trim()) return
    const { error } = await supabase.from('promemoria').insert({
      azienda_id: AZIENDA_ID, testo: newPromemoriaText.trim(),
      priorita: newPromemoriaPriorita, stato: 'aperto',
      commessa_id: newPromemoriaCommessa || null,
    })
    if (!error) {
      setNewPromemoriaText('')
      setNewPromemoriaPriorita('normale')
      setNewPromemoriaCommessa('')
      setShowPromemoriaForm(false)
      await loadPromemoria()
    }
  }

  async function togglePromemoria(id: string, stato: string) {
    const updates: any = { stato: stato === 'aperto' ? 'completato' : 'aperto' }
    if (stato === 'aperto') updates.completato_at = new Date().toISOString()
    else updates.completato_at = null
    await supabase.from('promemoria').update(updates).eq('id', id)
    await loadPromemoria()
  }

  async function deletePromemoria(id: string) {
    await supabase.from('promemoria').delete().eq('id', id)
    await loadPromemoria()
  }

  async function createEvento() {
    const { error } = await supabase.from('eventi').insert({
      azienda_id: AZIENDA_ID, titolo: newEvento.titolo, tipo: newEvento.tipo,
      data: newEvento.data, ora_inizio: newEvento.ora_inizio, durata_min: newEvento.durata_min,
      cliente_id: newEvento.cliente_id || null, commessa_id: newEvento.commessa_id || null,
      note: newEvento.note || null,
    })
    if (!error) {
      setShowNewEvento(false)
      setNewEvento({ titolo: '', tipo: 'sopralluogo', data: new Date().toISOString().split('T')[0], ora_inizio: '09:00', durata_min: 60, cliente_id: '', commessa_id: '', note: '' })
      await loadCalendario()
      await loadDashboard()
    }
  }

  async function createMovimento() {
    const art = articoli.find(a => a.id === newMovimento.articolo_id)
    const { error } = await supabase.from('movimenti_magazzino').insert({
      azienda_id: AZIENDA_ID,
      articolo_id: newMovimento.articolo_id,
      tipo: newMovimento.tipo,
      causale: newMovimento.causale,
      quantita: newMovimento.quantita,
      prezzo_unitario: newMovimento.prezzo_unitario || null,
      documento_rif: newMovimento.documento_rif || null,
      note: newMovimento.note || null,
    })
    if (!error && art) {
      const delta = newMovimento.tipo === 'carico' ? newMovimento.quantita : -newMovimento.quantita
      await supabase.from('articoli_magazzino').update({ scorta_attuale: art.scorta_attuale + delta }).eq('id', art.id)
      setShowNewMovimento(false)
      setNewMovimento({ articolo_id: '', tipo: 'carico', causale: 'acquisto', quantita: 0, prezzo_unitario: 0, documento_rif: '', note: '' })
      await loadMagazzino()
    }
  }

  async function createFattura() {
    const iva = newFattura.imponibile * (newFattura.aliquota_iva / 100)
    const totale = newFattura.imponibile + iva
    const { error } = await supabase.from('fatture').insert({
      azienda_id: AZIENDA_ID,
      cliente_id: newFattura.cliente_id || null,
      commessa_id: newFattura.commessa_id || null,
      numero: newFattura.numero,
      tipo: newFattura.tipo,
      direzione: newFattura.direzione,
      data_emissione: newFattura.data_emissione,
      data_scadenza: newFattura.data_scadenza || null,
      imponibile: newFattura.imponibile,
      aliquota_iva: newFattura.aliquota_iva,
      importo_iva: iva,
      totale,
      stato: 'emessa',
      metodo_pagamento: newFattura.metodo_pagamento,
      note: newFattura.note || null,
    })
    if (!error) {
      setShowNewFattura(false)
      setNewFattura({ cliente_id: '', commessa_id: '', numero: '', tipo: 'fattura', direzione: 'emessa', data_emissione: new Date().toISOString().split('T')[0], data_scadenza: '', imponibile: 0, aliquota_iva: 10, note: '', metodo_pagamento: 'bonifico' })
      await loadContabilita()
    }
  }

  async function createPagamento() {
    const { error } = await supabase.from('pagamenti').insert({
      azienda_id: AZIENDA_ID,
      fattura_id: newPagamento.fattura_id || null,
      commessa_id: newPagamento.commessa_id || null,
      cliente_id: newPagamento.cliente_id || null,
      tipo: newPagamento.tipo,
      importo: newPagamento.importo,
      data_pagamento: newPagamento.data_pagamento,
      metodo: newPagamento.metodo,
      riferimento: newPagamento.riferimento || null,
      note: newPagamento.note || null,
    })
    if (!error) {
      setShowNewPagamento(false)
      setNewPagamento({ cliente_id: '', commessa_id: '', fattura_id: '', tipo: 'incasso', importo: 0, data_pagamento: new Date().toISOString().split('T')[0], metodo: 'bonifico', riferimento: '', note: '' })
      await loadContabilita()
    }
  }

  const fmt = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
  const fmtDec = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(n)
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'
  const getStato = (stato: string) => STATI_COMMESSA.find(s => s.value === stato) || STATI_COMMESSA[0]
  const oggi = new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const oggiISO = new Date().toISOString().split('T')[0]

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#08090d' }}>
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-extrabold mx-auto mb-3 animate-pulse" style={{ background: 'linear-gradient(135deg, #f5a623, #a78bfa)', color: '#08090d' }}>M</div>
        <p style={{ color: '#8b90a8', fontSize: 14 }}>Caricamento...</p>
      </div>
    </div>
  )

  // ==================== SHARED COMPONENTS ====================
  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-2xl p-5 ${className}`} style={{ background: '#0d0f17', border: '1px solid #1a1e2e' }}>{children}</div>
  )

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: { label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
    <div>
      <label style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: '#181b27', border: '1px solid #252a3d', color: '#eae8e3' }} />
    </div>
  )

  const SelectField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
    <div>
      <label style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: '#181b27', border: '1px solid #252a3d', color: '#eae8e3' }}>
        <option value="">— Seleziona —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )

  const Badge = ({ text, color }: { text: string; color: string }) => (
    <span className="px-2 py-0.5 rounded-md" style={{ background: color + '20', color, fontSize: 10, fontWeight: 600 }}>{text}</span>
  )


  // ==================== MOBILE LAYOUT ====================
  const MobileLayout = () => (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto lg:hidden" style={{ background: '#08090d', color: '#eae8e3' }}>
      <header className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-extrabold" style={{ background: 'linear-gradient(135deg, #f5a623, #a78bfa)', color: '#08090d' }}>M</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">MASTRO</h1>
              <p style={{ fontSize: 10, color: '#8b90a8', letterSpacing: 1.5, textTransform: 'uppercase' as const }}>Walter Cozza Serramenti</p>
            </div>
          </div>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-sm" style={{ background: '#181b27', border: '1px solid #252a3d' }}>🔔</button>
        </div>
      </header>
      <div className="px-5 py-3 grid grid-cols-4 gap-2">
        {[
          { label: 'Commesse', value: stats.attive, icon: '📋', bg: '#5b9cf615' },
          { label: 'Valore', value: fmt(stats.valore), icon: '💰', bg: '#34d39915' },
          { label: 'Oggi', value: stats.oggi, icon: '📅', bg: '#f5a62315' },
          { label: 'Inbox', value: stats.inbox, icon: '📥', bg: '#f472b615' },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-2.5 text-center" style={{ background: s.bg }}>
            <div style={{ fontSize: 18 }}>{s.icon}</div>
            <div className="font-bold mt-0.5" style={{ fontSize: s.label === 'Valore' ? 11 : 14 }}>{s.value}</div>
            <div style={{ fontSize: 8, color: '#8b90a8' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="px-5 py-2 flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2 style={{ fontSize: 11, fontWeight: 600, color: '#8b90a8', textTransform: 'uppercase' as const, letterSpacing: 1.5 }}>Commesse attive</h2>
          <button style={{ fontSize: 10, color: '#f5a623', fontWeight: 600 }}>+ Nuova</button>
        </div>
        <div className="space-y-2">{commesse.map(c => <CommessaCard key={c.id} c={c} />)}</div>
      </div>
      <nav className="sticky bottom-0 px-4 py-2" style={{ background: '#08090dee', backdropFilter: 'blur(10px)', borderTop: '1px solid #252a3d' }}>
        <div className="flex justify-around">
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'contabilita', icon: '💰', label: 'Contabilità' },
            { id: 'misure', icon: '📐', label: 'Misure' },
            { id: 'cattura', icon: '🎤', label: 'Cattura' },
            { id: 'altro', icon: '⚙️', label: 'Altro' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex flex-col items-center gap-0.5 min-w-[48px]">
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: activeTab === tab.id ? '#f5a623' : '#5a5f75' }}>{tab.label}</span>
              {activeTab === tab.id && <div className="w-4 h-0.5 rounded-full" style={{ background: '#f5a623' }} />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )

  // ==================== COMMESSA CARD ====================
  const CommessaCard = ({ c }: { c: Commessa & { cliente?: Cliente } }) => {
    const si = getStato(c.stato)
    const idx = STATI_COMMESSA.findIndex(s => s.value === c.stato)
    return (
      <div className={`rounded-xl p-3 cursor-pointer transition-all ${activeCommessa === c.id ? 'ring-1' : ''}`}
        style={{ background: '#181b27', border: `1px solid ${activeCommessa === c.id ? si.color : '#252a3d'}` }}
        onClick={() => setActiveCommessa(activeCommessa === c.id ? null : c.id)}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#5a5f75' }}>{c.codice}</span>
            <span className="text-sm font-semibold">{c.titolo}</span>
          </div>
          <Badge text={`${si.icon} ${si.label}`} color={si.color} />
        </div>
        <div className="flex items-center justify-between mb-1.5" style={{ fontSize: 10, color: '#8b90a8' }}>
          <span>{c.cliente?.nome} {c.cliente?.cognome}</span>
          {c.valore_preventivo > 0 && <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#34d399' }}>{fmt(c.valore_preventivo)}</span>}
        </div>
        <div className="flex gap-0.5">
          {STATI_COMMESSA.map((s, i) => <div key={s.value} className="h-1 rounded-full flex-1" style={{ background: i <= idx ? si.color : '#252a3d' }} />)}
        </div>
      </div>
    )
  }


  // ==================== CONTABILITÀ VIEWS ====================
  const ContabilitaOverview = () => (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Fatturato', value: fmtDec(finStats.fatturato), sub: 'fatture emesse', icon: '📄', color: '#5b9cf6' },
          { label: 'Incassato', value: fmtDec(finStats.incassato), sub: 'pagamenti ricevuti', icon: '✅', color: '#34d399' },
          { label: 'Da Incassare', value: fmtDec(finStats.daIncassare), sub: 'crediti aperti', icon: '⏳', color: '#f5a623' },
          { label: 'Scaduto', value: fmtDec(finStats.scadute), sub: 'pagamenti scaduti', icon: '🔴', color: '#f87171' },
        ].map((s, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1.5, fontWeight: 600 }}>{s.label}</span>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#5a5f75' }}>{s.sub}</div>
          </Card>
        ))}
      </div>
      <div className="flex gap-2 mb-6">
        {[
          { id: 'fatture', label: '📄 Fatture', count: fatture.length },
          { id: 'pagamenti', label: '💳 Pagamenti', count: pagamenti.length },
          { id: 'scadenze', label: '📅 Scadenzario', count: scadenze.filter(s => s.stato === 'aperta').length },
        ].map(tab => (
          <button key={tab.id} onClick={() => setContabView(tab.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: contabView === tab.id ? '#f5a62320' : '#0d0f17',
              color: contabView === tab.id ? '#f5a623' : '#8b90a8',
              border: `1px solid ${contabView === tab.id ? '#f5a62340' : '#1a1e2e'}`,
            }}>
            {tab.label} <span style={{ fontFamily: 'monospace', marginLeft: 4 }}>{tab.count}</span>
          </button>
        ))}
      </div>
      {contabView === 'overview' && <FattureList />}
      {contabView === 'fatture' && <FattureList />}
      {contabView === 'pagamenti' && <PagamentiList />}
      {contabView === 'scadenze' && <ScadenzeList />}
    </div>
  )

  const FattureList = () => (
    <Card>
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}>
        <h3 className="font-semibold text-sm">Fatture</h3>
        <button onClick={() => setShowNewFattura(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#f5a623', color: '#08090d' }}>+ Nuova Fattura</button>
      </div>
      {showNewFattura && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: '#181b27', border: '1px solid #252a3d' }}>
          <h4 className="text-sm font-semibold mb-3">Nuova Fattura</h4>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <InputField label="Numero" value={newFattura.numero} onChange={v => setNewFattura({ ...newFattura, numero: v })} placeholder="2025/003" />
            <SelectField label="Tipo" value={newFattura.tipo} onChange={v => setNewFattura({ ...newFattura, tipo: v })}
              options={[{ value: 'fattura', label: 'Fattura' }, { value: 'acconto', label: 'Acconto' }, { value: 'nota_credito', label: 'Nota di credito' }]} />
            <SelectField label="Direzione" value={newFattura.direzione} onChange={v => setNewFattura({ ...newFattura, direzione: v })}
              options={[{ value: 'emessa', label: 'Emessa (vendita)' }, { value: 'ricevuta', label: 'Ricevuta (acquisto)' }]} />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <SelectField label="Cliente" value={newFattura.cliente_id} onChange={v => setNewFattura({ ...newFattura, cliente_id: v })}
              options={commesse.filter(c => c.cliente).map(c => ({ value: c.cliente!.id, label: `${c.cliente!.nome} ${c.cliente!.cognome}` })).filter((v, i, a) => a.findIndex(t => t.value === v.value) === i)} />
            <SelectField label="Commessa" value={newFattura.commessa_id} onChange={v => setNewFattura({ ...newFattura, commessa_id: v })}
              options={commesse.map(c => ({ value: c.id, label: `${c.codice} - ${c.titolo}` }))} />
            <SelectField label="Metodo Pagamento" value={newFattura.metodo_pagamento} onChange={v => setNewFattura({ ...newFattura, metodo_pagamento: v })}
              options={[{ value: 'bonifico', label: 'Bonifico' }, { value: 'contanti', label: 'Contanti' }, { value: 'assegno', label: 'Assegno' }, { value: 'carta', label: 'Carta' }, { value: 'riba', label: 'Ri.Ba.' }]} />
          </div>
          <div className="grid grid-cols-4 gap-3 mb-3">
            <InputField label="Data Emissione" value={newFattura.data_emissione} onChange={v => setNewFattura({ ...newFattura, data_emissione: v })} type="date" />
            <InputField label="Data Scadenza" value={newFattura.data_scadenza} onChange={v => setNewFattura({ ...newFattura, data_scadenza: v })} type="date" />
            <InputField label="Imponibile €" value={newFattura.imponibile} onChange={v => setNewFattura({ ...newFattura, imponibile: parseFloat(v) || 0 })} type="number" />
            <SelectField label="IVA %" value={String(newFattura.aliquota_iva)} onChange={v => setNewFattura({ ...newFattura, aliquota_iva: parseFloat(v) })}
              options={[{ value: '22', label: '22% (ordinaria)' }, { value: '10', label: '10% (ristrutturazione)' }, { value: '4', label: '4% (prima casa)' }, { value: '0', label: 'Esente' }]} />
          </div>
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #252a3d' }}>
            <div>
              <span style={{ fontSize: 11, color: '#5a5f75' }}>Totale: </span>
              <span className="text-lg font-bold" style={{ color: '#34d399', fontFamily: 'monospace' }}>
                {fmtDec(newFattura.imponibile + newFattura.imponibile * (newFattura.aliquota_iva / 100))}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowNewFattura(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: '#8b90a8', border: '1px solid #252a3d' }}>Annulla</button>
              <button onClick={createFattura} className="px-4 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#34d399', color: '#08090d' }}>Salva Fattura</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-12 px-4 py-2 gap-2" style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600, borderBottom: '1px solid #1a1e2e' }}>
        <div className="col-span-2">Numero</div><div className="col-span-2">Data</div><div className="col-span-2">Cliente</div><div className="col-span-2">Commessa</div><div className="col-span-1">Stato</div><div className="col-span-1">IVA</div><div className="col-span-2 text-right">Totale</div>
      </div>
      {fatture.map(f => (
        <div key={f.id} className="grid grid-cols-12 px-4 py-3 gap-2 items-center" style={{ borderBottom: '1px solid #1a1e2e' }}>
          <div className="col-span-2"><div className="text-sm font-medium" style={{ fontFamily: 'monospace' }}>{f.numero}</div><div style={{ fontSize: 9, color: '#5a5f75' }}>{f.direzione === 'emessa' ? '📤 Emessa' : '📥 Ricevuta'} · {f.tipo}</div></div>
          <div className="col-span-2" style={{ fontSize: 12, color: '#8b90a8' }}><div>{fmtDate(f.data_emissione)}</div>{f.data_scadenza && <div style={{ fontSize: 10, color: f.data_scadenza < oggiISO && f.stato !== 'pagata' ? '#f87171' : '#5a5f75' }}>Scad. {fmtDate(f.data_scadenza)}</div>}</div>
          <div className="col-span-2" style={{ fontSize: 12, color: '#8b90a8' }}>{f.cliente ? `${f.cliente.nome} ${f.cliente.cognome}` : '—'}</div>
          <div className="col-span-2" style={{ fontSize: 11, color: '#5a5f75' }}>{f.commessa?.codice || '—'}</div>
          <div className="col-span-1"><Badge text={f.stato === 'pagata' ? '✅ Pagata' : f.stato === 'emessa' ? '📄 Emessa' : f.stato} color={f.stato === 'pagata' ? '#34d399' : f.stato === 'emessa' ? '#f5a623' : '#8b90a8'} /></div>
          <div className="col-span-1" style={{ fontSize: 11, color: '#5a5f75', fontFamily: 'monospace' }}>{f.aliquota_iva}%</div>
          <div className="col-span-2 text-right" style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 13, color: f.direzione === 'emessa' ? '#34d399' : '#f87171' }}>{f.direzione === 'ricevuta' ? '-' : ''}{fmtDec(f.totale)}</div>
        </div>
      ))}
      {fatture.length === 0 && <div className="text-center py-8"><div style={{ fontSize: 32 }}>📄</div><p style={{ fontSize: 12, color: '#5a5f75', marginTop: 8 }}>Nessuna fattura registrata</p></div>}
    </Card>
  )

  const PagamentiList = () => (
    <Card>
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}>
        <h3 className="font-semibold text-sm">Pagamenti</h3>
        <button onClick={() => setShowNewPagamento(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#34d399', color: '#08090d' }}>+ Registra Pagamento</button>
      </div>
      {showNewPagamento && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: '#181b27', border: '1px solid #252a3d' }}>
          <h4 className="text-sm font-semibold mb-3">Registra Pagamento</h4>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <SelectField label="Tipo" value={newPagamento.tipo} onChange={v => setNewPagamento({ ...newPagamento, tipo: v })} options={[{ value: 'incasso', label: '📥 Incasso' }, { value: 'pagamento', label: '📤 Pagamento' }]} />
            <InputField label="Importo €" value={newPagamento.importo} onChange={v => setNewPagamento({ ...newPagamento, importo: parseFloat(v) || 0 })} type="number" />
            <InputField label="Data" value={newPagamento.data_pagamento} onChange={v => setNewPagamento({ ...newPagamento, data_pagamento: v })} type="date" />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <SelectField label="Metodo" value={newPagamento.metodo} onChange={v => setNewPagamento({ ...newPagamento, metodo: v })} options={[{ value: 'bonifico', label: 'Bonifico' }, { value: 'contanti', label: 'Contanti' }, { value: 'assegno', label: 'Assegno' }, { value: 'carta', label: 'Carta' }, { value: 'riba', label: 'Ri.Ba.' }]} />
            <SelectField label="Fattura" value={newPagamento.fattura_id} onChange={v => setNewPagamento({ ...newPagamento, fattura_id: v })} options={fatture.map(f => ({ value: f.id, label: `${f.numero} - ${fmtDec(f.totale)}` }))} />
            <InputField label="Riferimento" value={newPagamento.riferimento || ''} onChange={v => setNewPagamento({ ...newPagamento, riferimento: v })} placeholder="es. CRO/TRN" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowNewPagamento(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: '#8b90a8', border: '1px solid #252a3d' }}>Annulla</button>
            <button onClick={createPagamento} className="px-4 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#34d399', color: '#08090d' }}>Salva Pagamento</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-12 px-4 py-2 gap-2" style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600, borderBottom: '1px solid #1a1e2e' }}>
        <div className="col-span-2">Data</div><div className="col-span-2">Tipo</div><div className="col-span-2">Metodo</div><div className="col-span-3">Riferimento</div><div className="col-span-3 text-right">Importo</div>
      </div>
      {pagamenti.map(p => (
        <div key={p.id} className="grid grid-cols-12 px-4 py-3 gap-2 items-center" style={{ borderBottom: '1px solid #1a1e2e' }}>
          <div className="col-span-2" style={{ fontSize: 12, color: '#8b90a8' }}>{fmtDate(p.data_pagamento)}</div>
          <div className="col-span-2"><Badge text={p.tipo === 'incasso' ? '📥 Incasso' : '📤 Pagamento'} color={p.tipo === 'incasso' ? '#34d399' : '#f87171'} /></div>
          <div className="col-span-2" style={{ fontSize: 12, color: '#8b90a8' }}>{p.metodo}</div>
          <div className="col-span-3" style={{ fontSize: 11, color: '#5a5f75' }}>{p.riferimento || '—'}</div>
          <div className="col-span-3 text-right" style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 14, color: p.tipo === 'incasso' ? '#34d399' : '#f87171' }}>{p.tipo === 'pagamento' ? '-' : '+'}{fmtDec(p.importo)}</div>
        </div>
      ))}
      {pagamenti.length === 0 && <div className="text-center py-8"><div style={{ fontSize: 32 }}>💳</div><p style={{ fontSize: 12, color: '#5a5f75', marginTop: 8 }}>Nessun pagamento registrato</p></div>}
    </Card>
  )

  const ScadenzeList = () => (
    <Card>
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}>
        <h3 className="font-semibold text-sm">Scadenzario</h3>
        <div className="flex gap-2">
          <Badge text={`🔴 ${scadenze.filter(s => s.stato === 'aperta' && s.data_scadenza < oggiISO).length} scadute`} color="#f87171" />
          <Badge text={`⏳ ${scadenze.filter(s => s.stato === 'aperta' && s.data_scadenza >= oggiISO).length} in scadenza`} color="#f5a623" />
        </div>
      </div>
      <div className="grid grid-cols-12 px-4 py-2 gap-2" style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600, borderBottom: '1px solid #1a1e2e' }}>
        <div className="col-span-2">Scadenza</div><div className="col-span-3">Descrizione</div><div className="col-span-2">Cliente</div><div className="col-span-2">Commessa</div><div className="col-span-1">Stato</div><div className="col-span-2 text-right">Importo</div>
      </div>
      {scadenze.map(s => {
        const isScaduta = s.stato === 'aperta' && s.data_scadenza < oggiISO
        const giorniMancanti = Math.ceil((new Date(s.data_scadenza).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return (
          <div key={s.id} className="grid grid-cols-12 px-4 py-3 gap-2 items-center" style={{ borderBottom: '1px solid #1a1e2e', borderLeft: isScaduta ? '3px solid #f87171' : '3px solid transparent' }}>
            <div className="col-span-2"><div style={{ fontSize: 12, fontWeight: 600, color: isScaduta ? '#f87171' : '#eae8e3' }}>{fmtDate(s.data_scadenza)}</div><div style={{ fontSize: 9, color: isScaduta ? '#f87171' : '#5a5f75' }}>{isScaduta ? `⚠️ ${Math.abs(giorniMancanti)} gg fa` : s.stato === 'aperta' ? `tra ${giorniMancanti} gg` : ''}</div></div>
            <div className="col-span-3" style={{ fontSize: 12 }}>{s.descrizione || '—'}</div>
            <div className="col-span-2" style={{ fontSize: 12, color: '#8b90a8' }}>{s.cliente ? `${s.cliente.nome} ${s.cliente.cognome}` : '—'}</div>
            <div className="col-span-2" style={{ fontSize: 11, color: '#5a5f75' }}>{s.commessa?.codice || '—'}</div>
            <div className="col-span-1"><Badge text={s.stato === 'pagata' ? '✅' : isScaduta ? '🔴' : '⏳'} color={s.stato === 'pagata' ? '#34d399' : isScaduta ? '#f87171' : '#f5a623'} /></div>
            <div className="col-span-2 text-right" style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 14, color: isScaduta ? '#f87171' : '#f5a623' }}>{fmtDec(s.importo)}</div>
          </div>
        )
      })}
      {scadenze.length === 0 && <div className="text-center py-8"><div style={{ fontSize: 32 }}>📅</div><p style={{ fontSize: 12, color: '#5a5f75', marginTop: 8 }}>Nessuna scadenza</p></div>}
    </Card>
  )


  // ==================== MAGAZZINO CONTENT ====================
  const magStats = {
    totArticoli: articoli.length,
    sottoScorta: articoli.filter(a => a.scorta_attuale <= a.scorta_minima && a.scorta_minima > 0).length,
    valoreStock: articoli.reduce((s, a) => s + (a.scorta_attuale * a.prezzo_acquisto), 0),
    movOggi: movimenti.filter(m => m.created_at?.startsWith(oggiISO)).length,
  }
  const tipiArticolo = ['tutti', 'profilo', 'accessorio', 'vetro', 'guarnizione']
  const articoliFiltrati = magFilter === 'tutti' ? articoli : articoli.filter(a => a.tipo === magFilter)

  const MagazzinoContent = () => (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Articoli', value: magStats.totArticoli, sub: 'a catalogo', icon: '📦', color: '#5b9cf6' },
          { label: 'Sotto Scorta', value: magStats.sottoScorta, sub: 'da riordinare', icon: '⚠️', color: '#f87171' },
          { label: 'Valore Stock', value: fmt(magStats.valoreStock), sub: 'al costo', icon: '💰', color: '#34d399' },
          { label: 'Fornitori', value: fornitori.length, sub: 'attivi', icon: '🏭', color: '#a78bfa' },
        ].map((s, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1.5, fontWeight: 600 }}>{s.label}</span>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#5a5f75' }}>{s.sub}</div>
          </Card>
        ))}
      </div>
      <div className="flex gap-2 mb-6">
        {[
          { id: 'articoli', label: '📦 Articoli', count: articoli.length },
          { id: 'movimenti', label: '↕️ Movimenti', count: movimenti.length },
          { id: 'fornitori', label: '🏭 Fornitori', count: fornitori.length },
        ].map(tab => (
          <button key={tab.id} onClick={() => setMagView(tab.id)} className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: magView === tab.id ? '#a78bfa20' : '#0d0f17', color: magView === tab.id ? '#a78bfa' : '#8b90a8', border: `1px solid ${magView === tab.id ? '#a78bfa40' : '#1a1e2e'}` }}>
            {tab.label} <span style={{ fontFamily: 'monospace', marginLeft: 4 }}>{tab.count}</span>
          </button>
        ))}
      </div>
      {magView === 'articoli' && <ArticoliList />}
      {magView === 'movimenti' && <MovimentiList />}
      {magView === 'fornitori' && <FornitoriList />}
    </div>
  )

  const ArticoliList = () => (
    <Card>
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}>
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-sm">Articoli Magazzino</h3>
          <div className="flex gap-1">
            {tipiArticolo.map(t => (
              <button key={t} onClick={() => setMagFilter(t)} className="px-2 py-1 rounded text-xs"
                style={{ background: magFilter === t ? '#a78bfa20' : 'transparent', color: magFilter === t ? '#a78bfa' : '#5a5f75', fontWeight: magFilter === t ? 600 : 400 }}>
                {t === 'tutti' ? 'Tutti' : t.charAt(0).toUpperCase() + t.slice(1) + 'i'}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowNewMovimento(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#a78bfa', color: '#08090d' }}>+ Movimento</button>
      </div>
      {showNewMovimento && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: '#181b27', border: '1px solid #252a3d' }}>
          <h4 className="text-sm font-semibold mb-3">Nuovo Movimento</h4>
          <div className="grid grid-cols-4 gap-3 mb-3">
            <SelectField label="Articolo" value={newMovimento.articolo_id} onChange={v => setNewMovimento({ ...newMovimento, articolo_id: v })} options={articoli.map(a => ({ value: a.id, label: `${a.codice} - ${a.nome}` }))} />
            <SelectField label="Tipo" value={newMovimento.tipo} onChange={v => setNewMovimento({ ...newMovimento, tipo: v })} options={[{ value: 'carico', label: '📥 Carico' }, { value: 'scarico', label: '📤 Scarico' }, { value: 'rettifica', label: '🔧 Rettifica' }]} />
            <SelectField label="Causale" value={newMovimento.causale} onChange={v => setNewMovimento({ ...newMovimento, causale: v })} options={[{ value: 'acquisto', label: 'Acquisto' }, { value: 'produzione', label: 'Produzione' }, { value: 'reso', label: 'Reso' }, { value: 'inventario', label: 'Inventario' }]} />
            <InputField label="Quantità" value={newMovimento.quantita} onChange={v => setNewMovimento({ ...newMovimento, quantita: parseFloat(v) || 0 })} type="number" />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <InputField label="Prezzo Unitario €" value={newMovimento.prezzo_unitario} onChange={v => setNewMovimento({ ...newMovimento, prezzo_unitario: parseFloat(v) || 0 })} type="number" />
            <InputField label="Documento Rif." value={newMovimento.documento_rif} onChange={v => setNewMovimento({ ...newMovimento, documento_rif: v })} placeholder="DDT/Fattura" />
            <InputField label="Note" value={newMovimento.note} onChange={v => setNewMovimento({ ...newMovimento, note: v })} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowNewMovimento(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: '#8b90a8', border: '1px solid #252a3d' }}>Annulla</button>
            <button onClick={createMovimento} className="px-4 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#a78bfa', color: '#08090d' }}>Salva Movimento</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-12 px-4 py-2 gap-2" style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600, borderBottom: '1px solid #1a1e2e' }}>
        <div className="col-span-1">Cod.</div><div className="col-span-3">Articolo</div><div className="col-span-1">Tipo</div><div className="col-span-1">U.M.</div><div className="col-span-1">Scorta</div><div className="col-span-1">Min.</div><div className="col-span-1">€ Acq.</div><div className="col-span-1">Ubicaz.</div><div className="col-span-2">Fornitore</div>
      </div>
      {articoliFiltrati.map(a => {
        const sottoScorta = a.scorta_minima > 0 && a.scorta_attuale <= a.scorta_minima
        const tipoColors: Record<string, string> = { profilo: '#5b9cf6', accessorio: '#f5a623', vetro: '#34d399', guarnizione: '#f472b6' }
        return (
          <div key={a.id} className="grid grid-cols-12 px-4 py-3 gap-2 items-center" style={{ borderBottom: '1px solid #1a1e2e', borderLeft: sottoScorta ? '3px solid #f87171' : '3px solid transparent' }}>
            <div className="col-span-1" style={{ fontSize: 10, fontFamily: 'monospace', color: '#5a5f75' }}>{a.codice}</div>
            <div className="col-span-3"><div className="text-sm font-medium">{a.nome}</div>{a.lunghezza_standard && <div style={{ fontSize: 9, color: '#5a5f75' }}>Barra {a.lunghezza_standard}mm · {a.peso_metro} kg/m</div>}</div>
            <div className="col-span-1"><Badge text={a.tipo} color={tipoColors[a.tipo] || '#8b90a8'} /></div>
            <div className="col-span-1" style={{ fontSize: 11, color: '#8b90a8' }}>{a.unita_misura}</div>
            <div className="col-span-1"><span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: sottoScorta ? '#f87171' : '#eae8e3' }}>{a.scorta_attuale}</span>{sottoScorta && <span style={{ fontSize: 9, color: '#f87171', display: 'block' }}>⚠️ SOTTO</span>}</div>
            <div className="col-span-1" style={{ fontSize: 11, fontFamily: 'monospace', color: '#5a5f75' }}>{a.scorta_minima || '—'}</div>
            <div className="col-span-1" style={{ fontSize: 11, fontFamily: 'monospace', color: '#8b90a8' }}>{a.prezzo_acquisto > 0 ? `€${a.prezzo_acquisto}` : '—'}</div>
            <div className="col-span-1" style={{ fontSize: 10, fontFamily: 'monospace', color: '#5a5f75' }}>{a.ubicazione || '—'}</div>
            <div className="col-span-2" style={{ fontSize: 11, color: '#8b90a8' }}>{a.fornitore?.ragione_sociale || '—'}</div>
          </div>
        )
      })}
      {articoliFiltrati.length === 0 && <div className="text-center py-8"><div style={{ fontSize: 32 }}>📦</div><p style={{ fontSize: 12, color: '#5a5f75', marginTop: 8 }}>Nessun articolo trovato</p></div>}
    </Card>
  )

  const MovimentiList = () => (
    <Card>
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}>
        <h3 className="font-semibold text-sm">Movimenti Magazzino</h3>
        <button onClick={() => { setShowNewMovimento(true); setMagView('articoli') }} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#a78bfa', color: '#08090d' }}>+ Movimento</button>
      </div>
      <div className="grid grid-cols-12 px-4 py-2 gap-2" style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600, borderBottom: '1px solid #1a1e2e' }}>
        <div className="col-span-2">Data</div><div className="col-span-3">Articolo</div><div className="col-span-1">Tipo</div><div className="col-span-2">Causale</div><div className="col-span-1">Qtà</div><div className="col-span-1">€ Unit.</div><div className="col-span-2">Doc. Rif.</div>
      </div>
      {movimenti.map(m => (
        <div key={m.id} className="grid grid-cols-12 px-4 py-3 gap-2 items-center" style={{ borderBottom: '1px solid #1a1e2e' }}>
          <div className="col-span-2" style={{ fontSize: 11, color: '#8b90a8' }}>{m.created_at ? fmtDate(m.created_at.split('T')[0]) : '—'}</div>
          <div className="col-span-3" style={{ fontSize: 12 }}>{m.articolo?.nome || '—'}</div>
          <div className="col-span-1"><Badge text={m.tipo === 'carico' ? '📥 Carico' : m.tipo === 'scarico' ? '📤 Scarico' : '🔧 Rett.'} color={m.tipo === 'carico' ? '#34d399' : m.tipo === 'scarico' ? '#f87171' : '#f5a623'} /></div>
          <div className="col-span-2" style={{ fontSize: 11, color: '#5a5f75' }}>{m.causale || '—'}</div>
          <div className="col-span-1" style={{ fontFamily: 'monospace', fontWeight: 700, color: m.tipo === 'carico' ? '#34d399' : '#f87171' }}>{m.tipo === 'carico' ? '+' : '-'}{m.quantita}</div>
          <div className="col-span-1" style={{ fontSize: 11, fontFamily: 'monospace', color: '#8b90a8' }}>{m.prezzo_unitario ? `€${m.prezzo_unitario}` : '—'}</div>
          <div className="col-span-2" style={{ fontSize: 10, fontFamily: 'monospace', color: '#5a5f75' }}>{m.documento_rif || '—'}</div>
        </div>
      ))}
      {movimenti.length === 0 && <div className="text-center py-8"><div style={{ fontSize: 32 }}>↕️</div><p style={{ fontSize: 12, color: '#5a5f75', marginTop: 8 }}>Nessun movimento registrato</p></div>}
    </Card>
  )

  const FornitoriList = () => (
    <Card>
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}><h3 className="font-semibold text-sm">Fornitori</h3></div>
      <div className="grid grid-cols-12 px-4 py-2 gap-2" style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600, borderBottom: '1px solid #1a1e2e' }}>
        <div className="col-span-4">Ragione Sociale</div><div className="col-span-2">Città</div><div className="col-span-2">Telefono</div><div className="col-span-2">Email</div><div className="col-span-2">Articoli</div>
      </div>
      {fornitori.map(f => (
        <div key={f.id} className="grid grid-cols-12 px-4 py-3 gap-2 items-center" style={{ borderBottom: '1px solid #1a1e2e' }}>
          <div className="col-span-4"><div className="text-sm font-medium">{f.ragione_sociale}</div><div style={{ fontSize: 9, color: '#5a5f75' }}>P.IVA {f.partita_iva || '—'}</div></div>
          <div className="col-span-2" style={{ fontSize: 12, color: '#8b90a8' }}>{f.citta || '—'}</div>
          <div className="col-span-2" style={{ fontSize: 11, color: '#8b90a8' }}>{f.telefono || '—'}</div>
          <div className="col-span-2" style={{ fontSize: 11, color: '#5b9cf6' }}>{f.email || '—'}</div>
          <div className="col-span-2" style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>{articoli.filter(a => a.fornitore_id === f.id).length} art.</div>
        </div>
      ))}
      {fornitori.length === 0 && <div className="text-center py-8"><div style={{ fontSize: 32 }}>🏭</div><p style={{ fontSize: 12, color: '#5a5f75', marginTop: 8 }}>Nessun fornitore registrato</p></div>}
    </Card>
  )


  // ==================== PRODUZIONE CONTENT ====================
  const prodStats = {
    totLavorazioni: lavorazioni.length,
    inCorso: lavorazioni.filter(l => l.stato === 'in_corso').length,
    inAttesa: lavorazioni.filter(l => l.stato === 'attesa').length,
    completate: lavorazioni.filter(l => l.stato === 'completata').length,
    tempoTotale: lavorazioni.reduce((s, l) => s + (l.tempo_effettivo_min || 0), 0),
  }
  const statoLavColors: Record<string, { color: string; icon: string; label: string }> = {
    attesa: { color: '#8b90a8', icon: '⏳', label: 'In Attesa' },
    in_corso: { color: '#5b9cf6', icon: '🔧', label: 'In Corso' },
    pausa: { color: '#f5a623', icon: '⏸️', label: 'In Pausa' },
    completata: { color: '#34d399', icon: '✅', label: 'Completata' },
    problema: { color: '#f87171', icon: '🔴', label: 'Problema' },
  }
  const lavPerCommessa = lavorazioni.reduce((acc, l) => {
    const key = l.commessa_id
    if (!acc[key]) acc[key] = { commessa: l.commessa, lavorazioni: [] }
    acc[key].lavorazioni.push(l)
    return acc
  }, {} as Record<string, { commessa?: Commessa; lavorazioni: typeof lavorazioni }>)

  const ProduzioneContent = () => (
    <div>
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Lavorazioni', value: prodStats.totLavorazioni, sub: 'totali', icon: '🔧', color: '#5b9cf6' },
          { label: 'In Corso', value: prodStats.inCorso, sub: 'adesso', icon: '⚡', color: '#f5a623' },
          { label: 'In Attesa', value: prodStats.inAttesa, sub: 'da avviare', icon: '⏳', color: '#8b90a8' },
          { label: 'Completate', value: prodStats.completate, sub: 'fatte', icon: '✅', color: '#34d399' },
          { label: 'Tempo Totale', value: `${Math.floor(prodStats.tempoTotale / 60)}h ${prodStats.tempoTotale % 60}m`, sub: 'effettivo', icon: '⏱️', color: '#a78bfa' },
        ].map((s, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1.5, fontWeight: 600 }}>{s.label}</span>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#5a5f75' }}>{s.sub}</div>
          </Card>
        ))}
      </div>
      <div className="flex gap-2 mb-6">
        {[
          { id: 'lavorazioni', label: '🔧 Lavorazioni', count: lavorazioni.length },
          { id: 'fasi', label: '📋 Fasi Standard', count: fasi.length },
          { id: 'centri', label: '🏭 Centri Lavoro', count: centriLavoro.length },
          { id: 'dipendenti', label: '👷 Dipendenti', count: dipendenti.length },
        ].map(tab => (
          <button key={tab.id} onClick={() => setProdView(tab.id)} className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: prodView === tab.id ? '#5b9cf620' : '#0d0f17', color: prodView === tab.id ? '#5b9cf6' : '#8b90a8', border: `1px solid ${prodView === tab.id ? '#5b9cf640' : '#1a1e2e'}` }}>
            {tab.label} <span style={{ fontFamily: 'monospace', marginLeft: 4 }}>{tab.count}</span>
          </button>
        ))}
      </div>
      {prodView === 'lavorazioni' && <LavorazioniView />}
      {prodView === 'fasi' && <FasiView />}
      {prodView === 'centri' && <CentriView />}
      {prodView === 'dipendenti' && <DipendentiView />}
    </div>
  )

  const LavorazioniView = () => (
    <div className="space-y-4">
      {Object.entries(lavPerCommessa).map(([commessaId, group]) => {
        const completate = group.lavorazioni.filter(l => l.stato === 'completata').length
        const totali = group.lavorazioni.length
        const perc = totali > 0 ? Math.round((completate / totali) * 100) : 0
        return (
          <Card key={commessaId}>
            <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#f5a623', fontWeight: 700 }}>{group.commessa?.codice || '—'}</span>
                <span className="font-semibold text-sm">{group.commessa?.titolo || 'Commessa'}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 rounded-full" style={{ background: '#252a3d' }}><div className="h-2 rounded-full transition-all" style={{ background: perc === 100 ? '#34d399' : '#5b9cf6', width: `${perc}%` }} /></div>
                <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: perc === 100 ? '#34d399' : '#5b9cf6' }}>{perc}%</span>
              </div>
            </div>
            <div className="space-y-2">
              {group.lavorazioni.sort((a, b) => (a.fase?.ordine || 0) - (b.fase?.ordine || 0)).map(l => {
                const sl = statoLavColors[l.stato] || statoLavColors.attesa
                const tempoPerc = l.tempo_stimato_min > 0 ? Math.min(100, Math.round((l.tempo_effettivo_min / l.tempo_stimato_min) * 100)) : 0
                const overTime = l.tempo_effettivo_min > l.tempo_stimato_min
                return (
                  <div key={l.id} className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: l.stato === 'in_corso' ? '#5b9cf608' : '#181b27', border: `1px solid ${l.stato === 'in_corso' ? '#5b9cf630' : '#252a3d'}` }}>
                    <div style={{ minWidth: 140 }}><div className="flex items-center gap-2"><span style={{ fontSize: 10, fontFamily: 'monospace', color: '#5a5f75', fontWeight: 600 }}>{l.fase?.codice}</span><span className="text-sm font-medium">{l.fase?.nome || '—'}</span></div></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1"><span style={{ fontSize: 10, color: '#5a5f75' }}>{l.tempo_effettivo_min > 0 ? `${l.tempo_effettivo_min} min` : '—'} / {l.tempo_stimato_min} min stimati</span>{overTime && <span style={{ fontSize: 9, color: '#f87171', fontWeight: 600 }}>⚠️ OVER +{l.tempo_effettivo_min - l.tempo_stimato_min}min</span>}</div>
                      <div className="h-1.5 rounded-full" style={{ background: '#252a3d' }}><div className="h-1.5 rounded-full transition-all" style={{ background: overTime ? '#f87171' : sl.color, width: `${tempoPerc}%` }} /></div>
                    </div>
                    <div style={{ minWidth: 100 }}><Badge text={`${sl.icon} ${sl.label}`} color={sl.color} /></div>
                    <div className="flex gap-1">
                      {l.stato === 'attesa' && <button onClick={() => updateLavorazioneStato(l.id, 'in_corso')} className="px-2 py-1 rounded text-xs font-semibold" style={{ background: '#5b9cf620', color: '#5b9cf6' }}>▶ Avvia</button>}
                      {l.stato === 'in_corso' && (<><button onClick={() => updateLavorazioneStato(l.id, 'pausa')} className="px-2 py-1 rounded text-xs font-semibold" style={{ background: '#f5a62320', color: '#f5a623' }}>⏸ Pausa</button><button onClick={() => updateLavorazioneStato(l.id, 'completata')} className="px-2 py-1 rounded text-xs font-semibold" style={{ background: '#34d39920', color: '#34d399' }}>✅ Fine</button></>)}
                      {l.stato === 'pausa' && <button onClick={() => updateLavorazioneStato(l.id, 'in_corso')} className="px-2 py-1 rounded text-xs font-semibold" style={{ background: '#5b9cf620', color: '#5b9cf6' }}>▶ Riprendi</button>}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )
      })}
      {lavorazioni.length === 0 && <Card><div className="text-center py-8"><div style={{ fontSize: 32 }}>🔧</div><p style={{ fontSize: 12, color: '#5a5f75', marginTop: 8 }}>Nessuna lavorazione in corso</p></div></Card>}
    </div>
  )

  const FasiView = () => (
    <Card>
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}><h3 className="font-semibold text-sm">Fasi Standard di Produzione</h3><span style={{ fontSize: 11, color: '#5a5f75' }}>{fasi.length} fasi configurate</span></div>
      <div className="space-y-2">
        {fasi.map((f, i) => (
          <div key={f.id} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: '#181b27' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: '#5b9cf620', color: '#5b9cf6' }}>{i + 1}</div>
            <div className="flex-1"><div className="flex items-center gap-2"><span style={{ fontSize: 11, fontFamily: 'monospace', color: '#f5a623', fontWeight: 600 }}>{f.codice}</span><span className="text-sm font-medium">{f.nome}</span></div><span style={{ fontSize: 10, color: '#5a5f75' }}>{f.tipo}</span></div>
            <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#a78bfa' }}>{f.tempo_stimato_min} min</div>
          </div>
        ))}
      </div>
    </Card>
  )

  const CentriView = () => (
    <Card>
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}><h3 className="font-semibold text-sm">Centri di Lavoro</h3></div>
      <div className="grid grid-cols-12 px-4 py-2 gap-2" style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600, borderBottom: '1px solid #1a1e2e' }}>
        <div className="col-span-3">Nome</div><div className="col-span-2">Tipo</div><div className="col-span-2">Marca</div><div className="col-span-2">Modello</div><div className="col-span-1">Stato</div><div className="col-span-2 text-right">€/ora</div>
      </div>
      {centriLavoro.map(c => (
        <div key={c.id} className="grid grid-cols-12 px-4 py-3 gap-2 items-center" style={{ borderBottom: '1px solid #1a1e2e' }}>
          <div className="col-span-3 text-sm font-medium">{c.nome}</div>
          <div className="col-span-2"><Badge text={c.tipo || '—'} color="#5b9cf6" /></div>
          <div className="col-span-2" style={{ fontSize: 12, color: '#8b90a8' }}>{c.marca || '—'}</div>
          <div className="col-span-2" style={{ fontSize: 12, color: '#8b90a8' }}>{c.modello || '—'}</div>
          <div className="col-span-1"><Badge text={c.stato === 'attivo' ? '🟢' : '🔴'} color={c.stato === 'attivo' ? '#34d399' : '#f87171'} /></div>
          <div className="col-span-2 text-right" style={{ fontFamily: 'monospace', fontWeight: 600, color: '#a78bfa' }}>€{c.costo_orario}/h</div>
        </div>
      ))}
    </Card>
  )

  const DipendentiView = () => (
    <Card>
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}><h3 className="font-semibold text-sm">Dipendenti</h3></div>
      <div className="grid grid-cols-12 px-4 py-2 gap-2" style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600, borderBottom: '1px solid #1a1e2e' }}>
        <div className="col-span-3">Nome</div><div className="col-span-2">Ruolo</div><div className="col-span-2">Reparto</div><div className="col-span-2 text-right">Costo Orario</div><div className="col-span-3 text-right">Lavorazioni Attive</div>
      </div>
      {dipendenti.map(d => (
        <div key={d.id} className="grid grid-cols-12 px-4 py-3 gap-2 items-center" style={{ borderBottom: '1px solid #1a1e2e' }}>
          <div className="col-span-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#5b9cf620', color: '#5b9cf6' }}>{d.nome[0]}{d.cognome[0]}</div><span className="text-sm font-medium">{d.nome} {d.cognome}</span></div></div>
          <div className="col-span-2"><Badge text={d.ruolo || '—'} color={d.ruolo === 'operaio' ? '#5b9cf6' : d.ruolo === 'posatore' ? '#34d399' : '#f5a623'} /></div>
          <div className="col-span-2" style={{ fontSize: 12, color: '#8b90a8' }}>{d.reparto || '—'}</div>
          <div className="col-span-2 text-right" style={{ fontFamily: 'monospace', fontWeight: 600, color: '#a78bfa' }}>€{d.costo_orario}/h</div>
          <div className="col-span-3 text-right" style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: '#f5a623' }}>—</div>
        </div>
      ))}
    </Card>
  )


  // ==================== COMMESSE CONTENT + VISTA PROGETTO ====================
  const commesseFiltrate = commessaFilter === 'tutti' ? commesse : commesse.filter(c => c.stato === commessaFilter)

  // Attivita helpers
  const attivitaPerFase = MACRO_FASI.map(mf => {
    const acts = commessaAttivita.filter(a => a.macro_fase === mf.value)
    const completate = acts.filter(a => a.stato === 'completata').length
    const percMedia = acts.length > 0 ? Math.round(acts.reduce((s, a) => s + a.percentuale, 0) / acts.length) : 0
    return { ...mf, attivita: acts, completate, totale: acts.length, percMedia }
  }).filter(mf => mf.totale > 0)

  const overallPerc = commessaAttivita.length > 0
    ? Math.round(commessaAttivita.reduce((s, a) => s + a.percentuale, 0) / commessaAttivita.length)
    : 0

  const statoAttColors: Record<string, { color: string; icon: string; label: string }> = {
    da_fare: { color: '#5a5f75', icon: '○', label: 'Da fare' },
    in_corso: { color: '#5b9cf6', icon: '◐', label: 'In corso' },
    completata: { color: '#34d399', icon: '●', label: 'Fatto' },
    bloccata: { color: '#f87171', icon: '⊘', label: 'Bloccata' },
  }

  const CommesseContent = () => (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setCommessaFilter('tutti')} className="px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: commessaFilter === 'tutti' ? '#f5a62320' : '#0d0f17', color: commessaFilter === 'tutti' ? '#f5a623' : '#8b90a8', border: `1px solid ${commessaFilter === 'tutti' ? '#f5a62340' : '#1a1e2e'}` }}>
          Tutte <span style={{ fontFamily: 'monospace', marginLeft: 4 }}>{commesse.length}</span>
        </button>
        {STATI_COMMESSA.map(s => {
          const count = commesse.filter(c => c.stato === s.value).length
          return (
            <button key={s.value} onClick={() => setCommessaFilter(s.value)} className="px-3 py-2 rounded-lg text-sm font-medium"
              style={{ background: commessaFilter === s.value ? s.color + '20' : '#0d0f17', color: commessaFilter === s.value ? s.color : '#8b90a8', border: `1px solid ${commessaFilter === s.value ? s.color + '40' : '#1a1e2e'}` }}>
              {s.icon} {s.label} <span style={{ fontFamily: 'monospace', marginLeft: 4 }}>{count}</span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: selectedCommessa ? '1fr 420px' : '1fr 300px' }}>
        {/* Commesse List */}
        <div>
          <Card>
            <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}>
              <h3 className="font-semibold text-sm">Commesse ({commesseFiltrate.length})</h3>
              <button onClick={() => setShowNewCommessa(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#f5a623', color: '#08090d' }}>+ Nuova Commessa</button>
            </div>
            {showNewCommessa && (
              <div className="mb-4 p-4 rounded-xl" style={{ background: '#181b27', border: '1px solid #252a3d' }}>
                <h4 className="text-sm font-semibold mb-3">Nuova Commessa</h4>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <InputField label="Titolo" value={newCommessa.titolo} onChange={v => setNewCommessa({ ...newCommessa, titolo: v })} placeholder="es. Villa Rossi" />
                  <SelectField label="Cliente" value={newCommessa.cliente_id} onChange={v => setNewCommessa({ ...newCommessa, cliente_id: v })} options={clienti.map(c => ({ value: c.id, label: `${c.nome} ${c.cognome}` }))} />
                  <InputField label="Valore €" value={newCommessa.valore_preventivo} onChange={v => setNewCommessa({ ...newCommessa, valore_preventivo: parseFloat(v) || 0 })} type="number" />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <InputField label="Indirizzo" value={newCommessa.indirizzo} onChange={v => setNewCommessa({ ...newCommessa, indirizzo: v })} />
                  <InputField label="Città" value={newCommessa.citta} onChange={v => setNewCommessa({ ...newCommessa, citta: v })} />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowNewCommessa(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: '#8b90a8', border: '1px solid #252a3d' }}>Annulla</button>
                  <button onClick={createCommessa} className="px-4 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#f5a623', color: '#08090d' }}>Crea Commessa</button>
                </div>
              </div>
            )}
            {commesseFiltrate.map(c => {
              const si = getStato(c.stato)
              const idx = STATI_COMMESSA.findIndex(s => s.value === c.stato)
              const isSelected = selectedCommessa === c.id
              return (
                <div key={c.id} className="p-4 cursor-pointer transition-all" onClick={() => setSelectedCommessa(isSelected ? null : c.id)}
                  style={{ borderBottom: '1px solid #1a1e2e', background: isSelected ? '#f5a62308' : 'transparent', borderLeft: isSelected ? `3px solid ${si.color}` : '3px solid transparent' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#f5a623', fontWeight: 700 }}>{c.codice}</span>
                      <span className="font-semibold">{c.titolo}</span>
                    </div>
                    <Badge text={`${si.icon} ${si.label}`} color={si.color} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: 12, color: '#8b90a8' }}>👤 {c.cliente?.nome} {c.cliente?.cognome} · 📍 {c.citta}</span>
                    {c.valore_preventivo > 0 && <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#34d399' }}>{fmt(c.valore_preventivo)}</span>}
                  </div>
                  <div className="flex gap-0.5">
                    {STATI_COMMESSA.map((s, i) => <div key={s.value} className="h-1 rounded-full flex-1" style={{ background: i <= idx ? si.color : '#252a3d' }} />)}
                  </div>
                </div>
              )
            })}
          </Card>
        </div>

        {/* ==================== VISTA PROGETTO (Right Panel) ==================== */}
        <div>
          {selectedCommessa && commesse.find(c => c.id === selectedCommessa) ? (() => {
            const sel = commesse.find(c => c.id === selectedCommessa)!
            const si = getStato(sel.stato)
            const idx = STATI_COMMESSA.findIndex(s => s.value === sel.stato)
            const commFatture = fatture.filter(f => f.commessa_id === sel.id)

            return (
              <div className="space-y-3">
                {/* Header commessa */}
                <Card>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: 'monospace', color: '#f5a623', fontWeight: 700, fontSize: 13 }}>{sel.codice}</span>
                      <span className="font-semibold">{sel.titolo}</span>
                    </div>
                    <button onClick={() => setSelectedCommessa(null)} style={{ color: '#5a5f75', fontSize: 12 }}>✕</button>
                  </div>
                  <div className="flex items-center gap-4 mb-3" style={{ fontSize: 12, color: '#8b90a8' }}>
                    <span>👤 {sel.cliente?.nome} {sel.cliente?.cognome}</span>
                    <span>📍 {sel.citta}</span>
                    {sel.valore_preventivo > 0 && <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#34d399' }}>{fmt(sel.valore_preventivo)}</span>}
                  </div>
                  {/* Stato pipeline + avanza */}
                  <div className="flex gap-1 mb-2">
                    {STATI_COMMESSA.map((s, i) => (
                      <div key={s.value} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                        <div className="w-full h-1.5 rounded-full" style={{ background: i <= idx ? si.color : '#252a3d' }} />
                        <span style={{ fontSize: 7, color: s.value === sel.stato ? si.color : '#5a5f75', fontWeight: s.value === sel.stato ? 700 : 400 }}>{s.icon}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {idx > 0 && <button onClick={() => updateCommessaStato(sel.id, STATI_COMMESSA[idx - 1].value)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#252a3d', color: '#8b90a8' }}>← Indietro</button>}
                    {idx < STATI_COMMESSA.length - 1 && <button onClick={() => updateCommessaStato(sel.id, STATI_COMMESSA[idx + 1].value)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold" style={{ background: si.color + '20', color: si.color, border: `1px solid ${si.color}40` }}>Avanza →</button>}
                  </div>
                </Card>

                {/* Overall progress */}
                <Card>
                  <div className="flex items-center justify-between mb-3">
                    <h4 style={{ fontSize: 11, color: '#5a5f75', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1 }}>📊 VISTA PROGETTO</h4>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: overallPerc === 100 ? '#34d399' : overallPerc > 50 ? '#5b9cf6' : '#f5a623' }}>{overallPerc}%</span>
                      <span style={{ fontSize: 10, color: '#5a5f75' }}>{commessaAttivita.filter(a => a.stato === 'completata').length}/{commessaAttivita.length} attività</span>
                    </div>
                  </div>
                  {/* Overall bar */}
                  <div className="h-3 rounded-full mb-4" style={{ background: '#252a3d' }}>
                    <div className="h-3 rounded-full transition-all" style={{ background: `linear-gradient(90deg, #f5a623, #5b9cf6, #34d399)`, width: `${overallPerc}%` }} />
                  </div>

                  {progettoLoading ? (
                    <div className="text-center py-4"><span style={{ fontSize: 12, color: '#5a5f75' }}>Caricamento attività...</span></div>
                  ) : commessaAttivita.length === 0 ? (
                    <div className="text-center py-6">
                      <div style={{ fontSize: 28 }}>📋</div>
                      <p style={{ fontSize: 12, color: '#5a5f75', marginTop: 8 }}>Nessuna attività generata</p>
                      <p style={{ fontSize: 10, color: '#5a5f75', marginTop: 4 }}>Esegui genera_attivita_commessa() da Supabase</p>
                    </div>
                  ) : (
                    /* Macro-fasi accordion */
                    <div className="space-y-1.5">
                      {attivitaPerFase.map(fase => {
                        const isExpanded = expandedFase === fase.value
                        const allDone = fase.completate === fase.totale
                        return (
                          <div key={fase.value}>
                            {/* Fase header - clickable */}
                            <div className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all"
                              onClick={() => setExpandedFase(isExpanded ? null : fase.value)}
                              style={{ background: isExpanded ? fase.color + '10' : '#181b27', border: `1px solid ${isExpanded ? fase.color + '30' : '#252a3d'}` }}>
                              <span style={{ fontSize: 14 }}>{fase.icon}</span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span style={{ fontSize: 12, fontWeight: 600, color: allDone ? '#34d399' : '#eae8e3' }}>{fase.label}</span>
                                  <div className="flex items-center gap-2">
                                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#5a5f75' }}>{fase.completate}/{fase.totale}</span>
                                    <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: allDone ? '#34d399' : fase.color }}>{fase.percMedia}%</span>
                                  </div>
                                </div>
                                <div className="h-1 rounded-full mt-1.5" style={{ background: '#252a3d' }}>
                                  <div className="h-1 rounded-full transition-all" style={{ background: allDone ? '#34d399' : fase.color, width: `${fase.percMedia}%` }} />
                                </div>
                              </div>
                              <span style={{ fontSize: 10, color: '#5a5f75', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                            </div>

                            {/* Expanded activities */}
                            {isExpanded && (
                              <div className="ml-4 mt-1 space-y-1">
                                {fase.attivita.map(att => {
                                  const sa = statoAttColors[att.stato] || statoAttColors.da_fare
                                  const isAttExpanded = expandedAttivita === att.id
                                  const operatore = dipendenti.find((p: any) => p.id === att.assegnato_a)
                                  return (
                                    <div key={att.id} className="rounded-lg overflow-hidden"
                                      style={{ background: att.stato === 'in_corso' ? '#5b9cf608' : '#0d0f17', border: `1px solid ${isAttExpanded ? '#5b9cf640' : att.stato === 'in_corso' ? '#5b9cf620' : '#1a1e2e'}`, transition: 'border-color 0.2s' }}>
                                      
                                      {/* Activity row - clickable */}
                                      <div className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                                        onClick={() => setExpandedAttivita(isAttExpanded ? null : att.id)}>
                                        {/* Status toggle button */}
                                        <button onClick={(e) => { e.stopPropagation()
                                          if (att.stato === 'da_fare') updateAttivitaStato(att.id, 'in_corso')
                                          else if (att.stato === 'in_corso') updateAttivitaStato(att.id, 'completata')
                                          else if (att.stato === 'completata') updateAttivitaStato(att.id, 'da_fare')
                                        }}
                                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                          style={{ border: `2px solid ${sa.color}`, background: att.stato === 'completata' ? '#34d399' : 'transparent', fontSize: 10, color: att.stato === 'completata' ? '#08090d' : sa.color, fontWeight: 700 }}>
                                          {att.stato === 'completata' ? '✓' : att.stato === 'in_corso' ? '◐' : ''}
                                        </button>

                                        {/* Activity info */}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5">
                                            <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#5a5f75' }}>{att.codice}</span>
                                            <span className="truncate" style={{ fontSize: 11, fontWeight: att.stato === 'in_corso' ? 600 : 400, color: att.stato === 'completata' ? '#5a5f75' : '#eae8e3', textDecoration: att.stato === 'completata' ? 'line-through' : 'none' }}>{att.titolo}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {att.reparto && <span style={{ fontSize: 8, color: '#5a5f75', textTransform: 'uppercase' as const }}>{att.reparto}</span>}
                                            {operatore && <span style={{ fontSize: 8, color: '#5b9cf6' }}>👤 {(operatore as any).nome} {((operatore as any).cognome || '')[0]}.</span>}
                                          </div>
                                        </div>

                                        {/* Percentage */}
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                          <div className="w-12 h-1 rounded-full" style={{ background: '#252a3d' }}>
                                            <div className="h-1 rounded-full transition-all" style={{ background: att.percentuale === 100 ? '#34d399' : '#5b9cf6', width: `${att.percentuale}%` }} />
                                          </div>
                                          <button onClick={(e) => { e.stopPropagation()
                                            const next = att.percentuale >= 100 ? 0 : Math.min(100, att.percentuale + 25)
                                            updateAttivitaPercentuale(att.id, next)
                                          }}
                                            style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: att.percentuale === 100 ? '#34d399' : att.percentuale > 0 ? '#5b9cf6' : '#5a5f75', minWidth: 28, textAlign: 'right' as const, cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}>
                                            {att.percentuale}%
                                          </button>
                                        </div>

                                        {att.tempo_stimato_min > 0 && (
                                          <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#5a5f75', flexShrink: 0 }}>{att.tempo_stimato_min}′</span>
                                        )}
                                        <span style={{ fontSize: 8, color: '#5a5f75', transition: 'transform 0.2s', transform: isAttExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                                      </div>

                                      {/* Expanded detail panel */}
                                      {isAttExpanded && (
                                        <div className="px-3 pb-3 pt-1 space-y-3" style={{ borderTop: '1px solid #1a1e2e', background: '#0a0c14' }}>
                                          
                                          {/* Status buttons row */}
                                          <div className="flex gap-1">
                                            {['da_fare', 'in_corso', 'completata'].map(s => (
                                              <button key={s} onClick={() => updateAttivitaStato(att.id, s)}
                                                style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, border: 'none', cursor: 'pointer',
                                                  background: att.stato === s ? (statoAttColors[s]?.color || '#5a5f75') : '#1a1e2e',
                                                  color: att.stato === s ? '#08090d' : '#8a8fa5' }}>
                                                {s === 'da_fare' ? '⏳ Da fare' : s === 'in_corso' ? '🔄 In corso' : '✅ Completata'}
                                              </button>
                                            ))}
                                          </div>

                                          {/* Percentage slider */}
                                          <div>
                                            <div style={{ fontSize: 9, color: '#5a5f75', marginBottom: 4 }}>AVANZAMENTO</div>
                                            <div className="flex items-center gap-2">
                                              <div className="flex gap-1 flex-1">
                                                {[0, 25, 50, 75, 100].map(p => (
                                                  <button key={p} onClick={() => updateAttivitaPercentuale(att.id, p)}
                                                    style={{ flex: 1, padding: '4px 0', borderRadius: 4, fontSize: 10, fontWeight: 600, border: 'none', cursor: 'pointer',
                                                      background: att.percentuale >= p ? (p === 100 ? '#34d399' : '#5b9cf6') : '#1a1e2e',
                                                      color: att.percentuale >= p ? '#08090d' : '#5a5f75' }}>
                                                    {p}%
                                                  </button>
                                                ))}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Info grid */}
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <div style={{ fontSize: 9, color: '#5a5f75', marginBottom: 2 }}>REPARTO</div>
                                              <div style={{ fontSize: 11, color: '#eae8e3' }}>{att.reparto || '—'}</div>
                                            </div>
                                            <div>
                                              <div style={{ fontSize: 9, color: '#5a5f75', marginBottom: 2 }}>TEMPO STIMATO</div>
                                              <div style={{ fontSize: 11, color: '#eae8e3' }}>{att.tempo_stimato_min > 0 ? `${att.tempo_stimato_min} min` : '—'}</div>
                                            </div>
                                            <div>
                                              <div style={{ fontSize: 9, color: '#5a5f75', marginBottom: 2 }}>INIZIO</div>
                                              <div style={{ fontSize: 11, color: att.data_inizio ? '#5b9cf6' : '#5a5f75' }}>
                                                {att.data_inizio ? new Date(att.data_inizio).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                              </div>
                                            </div>
                                            <div>
                                              <div style={{ fontSize: 9, color: '#5a5f75', marginBottom: 2 }}>FINE</div>
                                              <div style={{ fontSize: 11, color: att.data_fine ? '#34d399' : '#5a5f75' }}>
                                                {att.data_fine ? new Date(att.data_fine).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Assegnazione */}
                                          <div>
                                            <div style={{ fontSize: 9, color: '#5a5f75', marginBottom: 4 }}>ASSEGNATO A</div>
                                            <div className="flex gap-1 flex-wrap">
                                              <button onClick={() => updateAttivitaField(att.id, 'assegnato_a', null)}
                                                style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, border: 'none', cursor: 'pointer',
                                                  background: !att.assegnato_a ? '#f5a623' : '#1a1e2e', color: !att.assegnato_a ? '#08090d' : '#5a5f75' }}>
                                                Nessuno
                                              </button>
                                              {dipendenti.slice(0, 6).map((op: any) => (
                                                <button key={op.id} onClick={() => updateAttivitaField(att.id, 'assegnato_a', op.id)}
                                                  style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, border: 'none', cursor: 'pointer',
                                                    background: att.assegnato_a === op.id ? '#5b9cf6' : '#1a1e2e', color: att.assegnato_a === op.id ? '#08090d' : '#8a8fa5' }}>
                                                  👤 {op.nome} {op.cognome?.[0] || ''}.
                                                </button>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Note */}
                                          <div>
                                            <div style={{ fontSize: 9, color: '#5a5f75', marginBottom: 4 }}>NOTE</div>
                                            {editingNote?.id === att.id ? (
                                              <div className="flex gap-1">
                                                <textarea value={editingNote.note} onChange={(e) => setEditingNote({ id: att.id, note: e.target.value })}
                                                  rows={2} style={{ flex: 1, background: '#1a1e2e', border: '1px solid #5b9cf640', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: '#eae8e3', resize: 'none', outline: 'none' }}
                                                  placeholder="Aggiungi note..." autoFocus />
                                                <div className="flex flex-col gap-1">
                                                  <button onClick={() => saveAttivitaNote(att.id, editingNote.note)}
                                                    style={{ padding: '4px 8px', borderRadius: 4, fontSize: 10, border: 'none', cursor: 'pointer', background: '#34d399', color: '#08090d', fontWeight: 600 }}>✓</button>
                                                  <button onClick={() => setEditingNote(null)}
                                                    style={{ padding: '4px 8px', borderRadius: 4, fontSize: 10, border: 'none', cursor: 'pointer', background: '#1a1e2e', color: '#5a5f75' }}>✕</button>
                                                </div>
                                              </div>
                                            ) : (
                                              <button onClick={() => setEditingNote({ id: att.id, note: att.note || '' })}
                                                style={{ width: '100%', textAlign: 'left' as const, padding: '6px 8px', borderRadius: 6, fontSize: 11, border: '1px dashed #1a1e2e', cursor: 'pointer', background: 'transparent', color: att.note ? '#eae8e3' : '#5a5f75' }}>
                                                {att.note || 'Clicca per aggiungere note...'}
                                              </button>
                                            )}
                                          </div>

                                          {/* Obbligatoria badge */}
                                          {att.obbligatoria && (
                                            <div style={{ fontSize: 9, color: '#f5a623', display: 'flex', alignItems: 'center', gap: 4 }}>
                                              ⚠️ Attività obbligatoria{att.dipende_da ? ` · Dipende da: ${att.dipende_da}` : ''}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>

                {/* Mini stats */}
                <Card>
                  <h4 style={{ fontSize: 11, color: '#5a5f75', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8 }}>Riepilogo</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span style={{ fontSize: 12, color: '#8b90a8' }}>Fatture</span><span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 600 }}>{commFatture.length}</span></div>
                    <div className="flex justify-between"><span style={{ fontSize: 12, color: '#8b90a8' }}>Fatturato</span><span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 600, color: '#34d399' }}>{fmtDec(commFatture.reduce((s, f) => s + f.totale, 0))}</span></div>
                    <div className="flex justify-between"><span style={{ fontSize: 12, color: '#8b90a8' }}>Tempo stimato</span><span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 600 }}>{Math.floor(commessaAttivita.reduce((s, a) => s + a.tempo_stimato_min, 0) / 60)}h {commessaAttivita.reduce((s, a) => s + a.tempo_stimato_min, 0) % 60}m</span></div>
                  </div>
                </Card>
              </div>
            )
          })() : (
            <Card>
              <div className="text-center py-12">
                <div style={{ fontSize: 40 }}>📋</div>
                <p style={{ fontSize: 12, color: '#5a5f75', marginTop: 8 }}>Seleziona una commessa</p>
                <p style={{ fontSize: 10, color: '#5a5f75', marginTop: 4 }}>per vedere la Vista Progetto</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )


  // ==================== CLIENTI CONTENT ====================
  const clientiFiltrati = clienteFilter === 'tutti' ? clienti : clienti.filter(c => c.tipo === clienteFilter)

  const ClientiContent = () => (
    <div>
      <div className="flex gap-2 mb-6">
        {['tutti', 'privato', 'impresa', 'architetto', 'rivenditore'].map(t => (
          <button key={t} onClick={() => setClienteFilter(t)} className="px-3 py-2 rounded-lg text-sm font-medium"
            style={{ background: clienteFilter === t ? '#34d39920' : '#0d0f17', color: clienteFilter === t ? '#34d399' : '#8b90a8', border: `1px solid ${clienteFilter === t ? '#34d39940' : '#1a1e2e'}` }}>
            {t === 'tutti' ? 'Tutti' : t.charAt(0).toUpperCase() + t.slice(1)} <span style={{ fontFamily: 'monospace', marginLeft: 4 }}>{t === 'tutti' ? clienti.length : clienti.filter(c => c.tipo === t).length}</span>
          </button>
        ))}
      </div>
      <Card>
        <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}>
          <h3 className="font-semibold text-sm">Clienti ({clientiFiltrati.length})</h3>
          <button onClick={() => setShowNewCliente(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#34d399', color: '#08090d' }}>+ Nuovo Cliente</button>
        </div>
        {showNewCliente && (
          <div className="mb-4 p-4 rounded-xl" style={{ background: '#181b27', border: '1px solid #252a3d' }}>
            <h4 className="text-sm font-semibold mb-3">Nuovo Cliente</h4>
            <div className="grid grid-cols-4 gap-3 mb-3">
              <InputField label="Nome" value={newCliente.nome} onChange={v => setNewCliente({ ...newCliente, nome: v })} />
              <InputField label="Cognome" value={newCliente.cognome} onChange={v => setNewCliente({ ...newCliente, cognome: v })} />
              <InputField label="Telefono" value={newCliente.telefono} onChange={v => setNewCliente({ ...newCliente, telefono: v })} />
              <SelectField label="Tipo" value={newCliente.tipo} onChange={v => setNewCliente({ ...newCliente, tipo: v })} options={[{ value: 'privato', label: 'Privato' }, { value: 'impresa', label: 'Impresa' }, { value: 'architetto', label: 'Architetto' }, { value: 'rivenditore', label: 'Rivenditore' }]} />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <InputField label="Email" value={newCliente.email} onChange={v => setNewCliente({ ...newCliente, email: v })} />
              <InputField label="Indirizzo" value={newCliente.indirizzo} onChange={v => setNewCliente({ ...newCliente, indirizzo: v })} />
              <InputField label="Città" value={newCliente.citta} onChange={v => setNewCliente({ ...newCliente, citta: v })} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNewCliente(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: '#8b90a8', border: '1px solid #252a3d' }}>Annulla</button>
              <button onClick={createCliente} className="px-4 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#34d399', color: '#08090d' }}>Salva Cliente</button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-12 px-4 py-2 gap-2" style={{ fontSize: 10, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1, fontWeight: 600, borderBottom: '1px solid #1a1e2e' }}>
          <div className="col-span-3">Nome</div><div className="col-span-1">Tipo</div><div className="col-span-2">Telefono</div><div className="col-span-2">Email</div><div className="col-span-2">Città</div><div className="col-span-2 text-right">Commesse</div>
        </div>
        {clientiFiltrati.map(c => {
          const numComm = commesse.filter(co => co.cliente_id === c.id).length
          const valoreComm = commesse.filter(co => co.cliente_id === c.id).reduce((s, co) => s + (co.valore_preventivo || 0), 0)
          const tipoColors: Record<string, string> = { privato: '#5b9cf6', impresa: '#f5a623', architetto: '#a78bfa', rivenditore: '#34d399' }
          return (
            <div key={c.id} className="grid grid-cols-12 px-4 py-3 gap-2 items-center" style={{ borderBottom: '1px solid #1a1e2e' }}>
              <div className="col-span-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: (tipoColors[c.tipo || 'privato'] || '#5b9cf6') + '20', color: tipoColors[c.tipo || 'privato'] || '#5b9cf6' }}>{c.nome?.[0]}{c.cognome?.[0]}</div><div><div className="text-sm font-medium">{c.nome} {c.cognome}</div>{c.ragione_sociale && <div style={{ fontSize: 9, color: '#5a5f75' }}>{c.ragione_sociale}</div>}</div></div></div>
              <div className="col-span-1"><Badge text={c.tipo || 'privato'} color={tipoColors[c.tipo || 'privato'] || '#5b9cf6'} /></div>
              <div className="col-span-2" style={{ fontSize: 12, color: '#8b90a8' }}>{c.telefono || '—'}</div>
              <div className="col-span-2" style={{ fontSize: 11, color: '#5b9cf6' }}>{c.email || '—'}</div>
              <div className="col-span-2" style={{ fontSize: 12, color: '#8b90a8' }}>{c.citta || '—'}</div>
              <div className="col-span-2 text-right"><span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f5a623' }}>{numComm}</span>{valoreComm > 0 && <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#34d399' }}>{fmt(valoreComm)}</div>}</div>
            </div>
          )
        })}
        {clientiFiltrati.length === 0 && <div className="text-center py-8"><div style={{ fontSize: 32 }}>👥</div><p style={{ fontSize: 12, color: '#5a5f75', marginTop: 8 }}>Nessun cliente trovato</p></div>}
      </Card>
    </div>
  )


  // ==================== CALENDARIO (4 VISTE) ====================
  const mesiNomi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
  const giorniNomiCorti = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
  const giorniNomiFull = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì']
  const tipoEventoColors: Record<string, { color: string; icon: string }> = {
    sopralluogo: { color: '#5b9cf6', icon: '🔍' }, misure: { color: '#a78bfa', icon: '📐' },
    consegna: { color: '#34d399', icon: '🚛' }, posa: { color: '#f5a623', icon: '🔧' },
    riunione: { color: '#f472b6', icon: '👥' }, scadenza: { color: '#f87171', icon: '⏰' }, altro: { color: '#8b90a8', icon: '📌' },
  }

  const getWeekDates = (startStr: string) => {
    const start = new Date(startStr)
    return Array.from({ length: 5 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d.toISOString().split('T')[0] })
  }
  const weekDates = getWeekDates(calWeekStart)
  const shiftWeek = (dir: number) => { const d = new Date(calWeekStart); d.setDate(d.getDate() + (dir * 7)); setCalWeekStart(d.toISOString().split('T')[0]) }
  const formatWeekLabel = () => { const start = new Date(calWeekStart); const end = new Date(calWeekStart); end.setDate(end.getDate() + 4); return `${start.getDate()} ${mesiNomi[start.getMonth()].slice(0, 3)} — ${end.getDate()} ${mesiNomi[end.getMonth()].slice(0, 3)} ${end.getFullYear()}` }

  const getDaysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate()
  const getFirstDayOfMonth = (m: number, y: number) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1 }
  const calDays = (() => { const daysInMonth = getDaysInMonth(calMonth, calYear); const firstDay = getFirstDayOfMonth(calMonth, calYear); const days: (number | null)[] = []; for (let i = 0; i < firstDay; i++) days.push(null); for (let i = 1; i <= daysInMonth; i++) days.push(i); return days })()

  const eventiPerData = (dateStr: string) => calEventi.filter(e => e.data === dateStr)
  const filteredEventiPerData = (dateStr: string) => filteredCalEventi.filter(e => e.data === dateStr)
  const scadenzePerData = (dateStr: string) => scadenze.filter(s => s.data_scadenza === dateStr)
  const getConflicts = (dateStr: string) => { const evts = eventiPerData(dateStr); const poseStessoGiorno = evts.filter(e => e.tipo === 'posa'); const misureStessoGiorno = evts.filter(e => e.tipo === 'misure'); const conflicts: string[] = []; if (poseStessoGiorno.length > 1) conflicts.push(`⚠️ ${poseStessoGiorno.length} pose nello stesso giorno`); if (misureStessoGiorno.length > 0 && poseStessoGiorno.length > 0) conflicts.push('⚠️ Misure + Posa nello stesso giorno'); return conflicts }

  const risorse = [
    ...dipendenti.map(d => ({ id: d.id, nome: `${d.nome} ${d.cognome[0]}.`, tipo: 'persona', icon: '👷', color: d.reparto === 'officina' ? '#5b9cf6' : d.reparto === 'posa' ? '#34d399' : '#f5a623' })),
    ...centriLavoro.filter(c => c.stato === 'attivo').map(c => ({ id: c.id, nome: c.nome, tipo: 'macchina', icon: '🏭', color: '#a78bfa' })),
  ]
  const ore = Array.from({ length: 10 }, (_, i) => `${String(7 + i).padStart(2, '0')}:00`)
  const commesseAttive = commesse.filter(c => c.stato !== 'chiusura')

  const tipiEvento = ['sopralluogo', 'misure', 'consegna', 'posa', 'riunione', 'altro']
  const filteredCalEventi = calFilterTipo.length > 0 ? calEventi.filter(e => calFilterTipo.includes(e.tipo || '')) : calEventi
  const filteredEventiOggi = calFilterTipo.length > 0 ? eventiOggi.filter(e => calFilterTipo.includes(e.tipo || '')) : eventiOggi
  const calZoomSizes = { 1: { cell: 36, font: 8, event: 7 }, 2: { cell: 56, font: 10, event: 9 }, 3: { cell: 80, font: 12, event: 11 } }
  const zs = calZoomSizes[calZoom as keyof typeof calZoomSizes] || calZoomSizes[2]

  const CalendarioContent = () => (
    <div>
      {/* Top bar: view tabs + filters + zoom */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-1.5">
          {[
            { id: 'oggi', label: '📍 Oggi' },
            { id: 'settimana', label: '📅 Settimana' },
            { id: 'mese', label: '🗓️ Mese' },
            { id: 'timeline', label: '📊 Timeline' },
          ].map(v => (
            <button key={v.id} onClick={() => setCalView(v.id)} className="px-3 py-2 rounded-lg text-xs font-semibold"
              style={{ background: calView === v.id ? '#5b9cf620' : '#0d0f17', border: `1px solid ${calView === v.id ? '#5b9cf640' : '#1a1e2e'}`, color: calView === v.id ? '#5b9cf6' : '#8b90a8' }}>
              {v.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {/* Type filters */}
          <div className="flex gap-1">
            {tipiEvento.map(t => {
              const tc = tipoEventoColors[t]
              const isActive = calFilterTipo.includes(t)
              return (
                <button key={t} onClick={() => setCalFilterTipo(prev => isActive ? prev.filter(x => x !== t) : [...prev, t])}
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{ background: isActive ? tc.color + '25' : '#0d0f17', border: `1px solid ${isActive ? tc.color + '60' : '#1a1e2e'}`, color: isActive ? tc.color : '#5a5f75', cursor: 'pointer' }}>
                  {tc.icon}
                </button>
              )
            })}
            {calFilterTipo.length > 0 && (
              <button onClick={() => setCalFilterTipo([])} className="px-2 py-1 rounded text-xs"
                style={{ background: '#f8717115', border: '1px solid #f8717130', color: '#f87171', cursor: 'pointer' }}>✕</button>
            )}
          </div>
          {/* Zoom controls */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: '#0d0f17', border: '1px solid #1a1e2e' }}>
            <button onClick={() => setCalZoom(Math.max(1, calZoom - 1))} style={{ background: 'transparent', border: 'none', color: calZoom > 1 ? '#eae8e3' : '#5a5f75', cursor: 'pointer', fontSize: 14, padding: '0 4px' }}>−</button>
            <span style={{ fontSize: 9, color: '#5a5f75', width: 30, textAlign: 'center' as const }}>{['S', 'M', 'L'][calZoom - 1]}</span>
            <button onClick={() => setCalZoom(Math.min(3, calZoom + 1))} style={{ background: 'transparent', border: 'none', color: calZoom < 3 ? '#eae8e3' : '#5a5f75', cursor: 'pointer', fontSize: 14, padding: '0 4px' }}>+</button>
          </div>
        </div>
      </div>
      {calView === 'oggi' && <OggiView />}
      {calView === 'settimana' && <SettimanaView />}
      {calView === 'mese' && <MeseView />}
      {calView === 'timeline' && <TimelineView />}
    </div>
  )

  const OggiView = () => (
    <Card>
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}>
        <div><h3 className="font-semibold">Oggi — {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}</h3><div style={{ fontSize: 11, color: '#5a5f75' }}>{filteredEventiOggi.length} eventi{calFilterTipo.length > 0 ? ` (filtrati)` : ''} · {lavorazioni.filter(l => l.stato === 'in_corso').length} lavorazioni in corso</div></div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${risorse.length}, minmax(${zs.cell * 2.5}px, 1fr))`, gap: 0 }}>
          <div style={{ borderBottom: '2px solid #252a3d', padding: '8px 4px' }} />
          {risorse.map(r => (<div key={r.id} className="text-center" style={{ borderBottom: '2px solid #252a3d', padding: `${zs.cell / 8}px 4px`, borderLeft: '1px solid #1a1e2e' }}><div style={{ fontSize: zs.font + 4 }}>{r.icon}</div><div style={{ fontSize: zs.font, fontWeight: 600, color: r.color, marginTop: 2 }}>{r.nome}</div></div>))}
          {ore.map(ora => (
            <React.Fragment key={`ora-${ora}`}>
              <div style={{ padding: `${zs.cell / 5}px 4px`, fontSize: zs.font, color: '#5a5f75', fontFamily: 'monospace', fontWeight: 600, borderBottom: '1px solid #1a1e2e', height: zs.cell }}>{ora}</div>
              {risorse.map(r => {
                const cellEvents = filteredEventiOggi.filter(e => e.ora_inizio?.startsWith(ora.slice(0, 2)))
                const cellLav = lavorazioni.filter(l => l.stato === 'in_corso' && (l.centro_lavoro_id === r.id || l.operatore_id === r.id))
                return (
                  <div key={`${ora}-${r.id}`} style={{ padding: 4, borderBottom: '1px solid #1a1e2e', borderLeft: '1px solid #1a1e2e', minHeight: zs.cell }}>
                    {cellEvents.map(e => { const tc = tipoEventoColors[(e.tipo || 'altro') as string]; return (<div key={e.id} className="rounded px-2 py-1 mb-1" style={{ background: tc.color + '15', borderLeft: `3px solid ${tc.color}`, fontSize: zs.event }}><div style={{ fontWeight: 600, color: tc.color }}>{tc.icon} {e.titolo}</div>{calZoom >= 2 && e.cliente && <div style={{ color: '#5a5f75' }}>{e.cliente.nome}</div>}</div>) })}
                    {cellLav.map(l => (<div key={l.id} className="rounded px-2 py-1 mb-1" style={{ background: '#f5a62315', borderLeft: '3px solid #f5a623', fontSize: zs.event }}><div style={{ fontWeight: 600, color: '#f5a623' }}>🔧 {l.fase?.nome}</div>{calZoom >= 2 && <div style={{ color: '#5a5f75' }}>{l.commessa?.codice}</div>}</div>))}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </Card>
  )


  // ============= SETTIMANA VIEW =============
  const SettimanaView = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => shiftWeek(-1)} className="px-3 py-2 rounded-lg" style={{ background: '#181b27', border: '1px solid #252a3d', color: '#8b90a8' }}>← Sett. prec.</button>
        <h3 className="text-lg font-bold">{formatWeekLabel()}</h3>
        <div className="flex gap-2">
          <button onClick={() => { const d = new Date(); const day = d.getDay(); const diff = d.getDate() - day + (day === 0 ? -6 : 1); setCalWeekStart(new Date(d.setDate(diff)).toISOString().split('T')[0]) }} className="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: '#5b9cf620', color: '#5b9cf6', border: '1px solid #5b9cf640' }}>Questa settimana</button>
          <button onClick={() => shiftWeek(1)} className="px-3 py-2 rounded-lg" style={{ background: '#181b27', border: '1px solid #252a3d', color: '#8b90a8' }}>Sett. succ. →</button>
        </div>
      </div>
      {weekDates.some(d => getConflicts(d).length > 0) && (
        <div className="mb-4 p-3 rounded-xl" style={{ background: '#f8717110', border: '1px solid #f8717130' }}>
          <div className="flex items-center gap-2 mb-1"><span style={{ fontWeight: 700, color: '#f87171', fontSize: 12 }}>⚠️ CONFLITTI RILEVATI</span></div>
          <div className="flex gap-4">{weekDates.map((d, i) => { const c = getConflicts(d); return c.length > 0 ? <span key={d} style={{ fontSize: 10, color: '#f87171' }}>{giorniNomiFull[i]}: {c.join(', ')}</span> : null })}</div>
        </div>
      )}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(5, 1fr)', gap: 0 }}>
            <div style={{ padding: '12px 8px', borderBottom: '2px solid #252a3d', borderRight: '2px solid #252a3d' }}><span style={{ fontSize: 10, color: '#5a5f75', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1 }}>COMMESSA</span></div>
            {weekDates.map((d, i) => { const isToday = d === oggiISO; const dayNum = new Date(d).getDate(); const hasConflict = getConflicts(d).length > 0; return (
              <div key={d} className="text-center" style={{ padding: '8px 4px', borderBottom: `2px solid ${hasConflict ? '#f87171' : '#252a3d'}`, borderRight: '1px solid #1a1e2e', background: isToday ? '#5b9cf608' : 'transparent' }}>
                <div style={{ fontSize: 10, color: isToday ? '#5b9cf6' : '#5a5f75', fontWeight: 600, textTransform: 'uppercase' as const }}>{giorniNomiFull[i]}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: isToday ? '#5b9cf6' : '#eae8e3' }}>{dayNum}</div>
              </div>
            ) })}

            {commesseAttive.map(comm => {
              const si = getStato(comm.stato)
              const commLav = lavorazioni.filter(l => l.commessa_id === comm.id)
              return (
                <React.Fragment key={`comm-${comm.id}`}>
                  <div style={{ padding: '10px 8px', borderBottom: '1px solid #1a1e2e', borderRight: '2px solid #252a3d', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 4, height: 32, borderRadius: 2, background: si.color }} />
                    <div><div style={{ fontSize: 11, fontFamily: 'monospace', color: '#f5a623', fontWeight: 700 }}>{comm.codice}</div><div className="text-sm font-medium truncate" style={{ maxWidth: 150 }}>{comm.titolo}</div><div style={{ fontSize: 9, color: '#5a5f75' }}>{comm.cliente?.nome} {comm.cliente?.cognome}</div></div>
                  </div>
                  {weekDates.map((d) => {
                    const dayEvents = filteredEventiPerData(d).filter(e => e.commessa_id === comm.id)
                    const dayLavs = commLav.filter(l => l.data_inizio?.split('T')[0] === d)
                    const isToday = d === oggiISO
                    return (
                      <div key={`${comm.id}-${d}`} className="relative"
                        onClick={() => { setCalSelectedDate(d); setNewEvento({ ...newEvento, data: d, commessa_id: comm.id, cliente_id: comm.cliente_id || '' }) }}
                        style={{ padding: 4, borderBottom: '1px solid #1a1e2e', borderRight: '1px solid #1a1e2e', minHeight: 56, background: isToday ? '#5b9cf605' : 'transparent', cursor: 'pointer' }}>
                        {dayEvents.map(e => { const tc = tipoEventoColors[(e.tipo || 'altro') as string]; return (<div key={e.id} className="rounded-md px-2 py-1.5 mb-1" style={{ background: tc.color + '18', borderLeft: `3px solid ${tc.color}` }}><div style={{ fontSize: 9, fontWeight: 700, color: tc.color }}>{tc.icon} {e.ora_inizio?.slice(0, 5)} {e.tipo}</div><div className="truncate" style={{ fontSize: 10, color: '#eae8e3' }}>{e.titolo}</div></div>) })}
                        {dayLavs.map(l => { const statoC = statoLavColors[l.stato] || statoLavColors.attesa; return (<div key={l.id} className="rounded-md px-2 py-1.5 mb-1" style={{ background: statoC.color + '18', borderLeft: `3px solid ${statoC.color}` }}><div style={{ fontSize: 9, fontWeight: 700, color: statoC.color }}>{statoC.icon} {l.fase?.codice}</div><div className="truncate" style={{ fontSize: 10, color: '#eae8e3' }}>{l.fase?.nome}</div></div>) })}
                        {dayEvents.length === 0 && dayLavs.length === 0 && (<div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><span style={{ fontSize: 16, color: '#252a3d' }}>+</span></div>)}
                      </div>
                    )
                  })}
                </React.Fragment>
              )
            })}

            {/* Scadenze row */}
            <div style={{ padding: '10px 8px', borderBottom: '1px solid #1a1e2e', borderRight: '2px solid #252a3d', display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 4, height: 32, borderRadius: 2, background: '#f87171' }} /><div><div style={{ fontSize: 11, fontWeight: 700, color: '#f87171' }}>⏰ SCADENZE</div><div style={{ fontSize: 9, color: '#5a5f75' }}>pagamenti in scadenza</div></div></div>
            {weekDates.map(d => { const dayScad = scadenzePerData(d); return (<div key={`scad-${d}`} style={{ padding: 4, borderBottom: '1px solid #1a1e2e', borderRight: '1px solid #1a1e2e', minHeight: 40 }}>{dayScad.map(s => (<div key={s.id} className="rounded-md px-2 py-1.5 mb-1" style={{ background: '#f8717118', borderLeft: '3px solid #f87171' }}><div style={{ fontSize: 9, fontWeight: 700, color: '#f87171' }}>⏰ {fmtDec(s.importo)}</div><div className="truncate" style={{ fontSize: 10, color: '#eae8e3' }}>{s.cliente?.cognome}</div></div>))}</div>) })}

            {/* Dipendenti rows */}
            <div style={{ padding: '10px 8px', borderTop: '2px solid #252a3d', borderRight: '2px solid #252a3d', gridColumn: 'span 6' }}><span style={{ fontSize: 10, color: '#5a5f75', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1 }}>👷 CARICO RISORSE</span></div>
            {dipendenti.map(dip => (
              <React.Fragment key={`dip-row-${dip.id}`}>
                <div style={{ padding: '8px 8px', borderBottom: '1px solid #1a1e2e', borderRight: '2px solid #252a3d', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#5b9cf620', color: '#5b9cf6', fontSize: 8 }}>{dip.nome[0]}{dip.cognome[0]}</div>
                  <div><div style={{ fontSize: 11, fontWeight: 600 }}>{dip.nome} {dip.cognome[0]}.</div><div style={{ fontSize: 9, color: '#5a5f75' }}>{dip.reparto}</div></div>
                </div>
                {weekDates.map(d => { const dipEvents = eventiPerData(d); const caricoOre = dipEvents.filter(e => e.tipo === 'posa' || e.tipo === 'misure').length; const level = caricoOre === 0 ? '#1a1e2e' : caricoOre === 1 ? '#34d39940' : caricoOre >= 2 ? '#f8717140' : '#f5a62340'; return (<div key={`${dip.id}-${d}`} style={{ padding: 4, borderBottom: '1px solid #1a1e2e', borderRight: '1px solid #1a1e2e', background: level, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{caricoOre > 0 && <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: caricoOre >= 2 ? '#f87171' : '#34d399' }}>{caricoOre}</span>}</div>) })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Card>

      {calSelectedDate && (
        <div className="mt-4"><Card>
          <h4 className="text-sm font-semibold mb-3">Aggiungi attività per il {parseInt(calSelectedDate!.split('-')[2])} {mesiNomi[parseInt(calSelectedDate!.split('-')[1]) - 1]}</h4>
          <div className="grid grid-cols-4 gap-2">
            {[{ tipo: 'sopralluogo', label: '🔍 Sopralluogo' }, { tipo: 'misure', label: '📐 Misure' }, { tipo: 'consegna', label: '🚛 Consegna' }, { tipo: 'posa', label: '🔧 Posa' }].map(t => (
              <button key={t.tipo} onClick={() => { setShowNewEvento(true); setNewEvento({ ...newEvento, data: calSelectedDate || '', tipo: t.tipo }) }} className="py-3 rounded-lg text-sm font-medium" style={{ background: (tipoEventoColors[t.tipo]?.color || '#8b90a8') + '15', color: tipoEventoColors[t.tipo]?.color, border: `1px solid ${(tipoEventoColors[t.tipo]?.color || '#8b90a8')}30` }}>{t.label}</button>
            ))}
          </div>
        </Card></div>
      )}

      {showNewEvento && (
        <div className="mt-4"><Card>
          <h4 className="text-sm font-semibold mb-3">Nuovo Evento</h4>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <InputField label="Titolo" value={newEvento.titolo} onChange={v => setNewEvento({ ...newEvento, titolo: v })} placeholder="es. Sopralluogo" />
            <SelectField label="Tipo" value={newEvento.tipo} onChange={v => setNewEvento({ ...newEvento, tipo: v })} options={[{ value: 'sopralluogo', label: '🔍 Sopralluogo' }, { value: 'misure', label: '📐 Misure' }, { value: 'consegna', label: '🚛 Consegna' }, { value: 'posa', label: '🔧 Posa' }, { value: 'riunione', label: '👥 Riunione' }, { value: 'altro', label: '📌 Altro' }]} />
            <div className="grid grid-cols-2 gap-2">
              <InputField label="Data" value={newEvento.data} onChange={v => setNewEvento({ ...newEvento, data: v })} type="date" />
              <InputField label="Ora" value={newEvento.ora_inizio} onChange={v => setNewEvento({ ...newEvento, ora_inizio: v })} type="time" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <SelectField label="Cliente" value={newEvento.cliente_id} onChange={v => setNewEvento({ ...newEvento, cliente_id: v })} options={[{ value: '', label: '— Nessuno —' }, ...clienti.map(c => ({ value: c.id, label: `${c.nome} ${c.cognome}` }))]} />
            <SelectField label="Commessa" value={newEvento.commessa_id} onChange={v => setNewEvento({ ...newEvento, commessa_id: v })} options={[{ value: '', label: '— Nessuna —' }, ...commesse.map(c => ({ value: c.id, label: `${c.codice} - ${c.titolo}` }))]} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowNewEvento(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: '#8b90a8', border: '1px solid #252a3d' }}>Annulla</button>
            <button onClick={createEvento} className="px-4 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#5b9cf6', color: '#08090d' }}>Salva</button>
          </div>
        </Card></div>
      )}
    </div>
  )


  // ============= MESE VIEW =============
  const MeseView = () => (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) } else setCalMonth(calMonth - 1) }} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#181b27', border: '1px solid #252a3d', color: '#8b90a8' }}>←</button>
            <h3 className="text-lg font-bold">{mesiNomi[calMonth]} {calYear}</h3>
            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) } else setCalMonth(calMonth + 1) }} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#181b27', border: '1px solid #252a3d', color: '#8b90a8' }}>→</button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">{giorniNomiCorti.map(g => <div key={g} className="text-center py-1" style={{ fontSize: zs.font, color: '#5a5f75', fontWeight: 600 }}>{g}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {calDays.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const evts = filteredEventiPerData(dateStr); const scds = scadenzePerData(dateStr)
              const isToday = dateStr === oggiISO; const isSelected = dateStr === calSelectedDate
              return (
                <div key={day} onClick={() => setCalSelectedDate(isSelected ? null : dateStr)} className="rounded-lg cursor-pointer"
                  style={{ minHeight: zs.cell + 20, padding: calZoom >= 2 ? 6 : 3, background: isSelected ? '#f5a62315' : isToday ? '#5b9cf608' : '#0d0f17', border: `1px solid ${isSelected ? '#f5a62350' : isToday ? '#5b9cf630' : '#1a1e2e'}` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: zs.font + 1, fontWeight: isToday ? 800 : 400, color: isToday ? '#5b9cf6' : '#eae8e3' }}>{day}</span>
                    <div className="flex gap-0.5">{evts.length > 0 && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#5b9cf6' }} />}{scds.length > 0 && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f87171' }} />}</div>
                  </div>
                  {evts.slice(0, calZoom >= 3 ? 4 : 2).map(e => { const tc = tipoEventoColors[(e.tipo || 'altro') as string]; return <div key={e.id} className="truncate rounded px-1 mb-0.5" style={{ fontSize: zs.event - 1, background: tc.color + '15', color: tc.color }}>{calZoom >= 2 ? `${e.ora_inizio?.slice(0, 5)} ` : ''}{tc.icon} {e.titolo}</div> })}
                  {evts.length > (calZoom >= 3 ? 4 : 2) && <div style={{ fontSize: 7, color: '#5a5f75', textAlign: 'center' as const }}>+{evts.length - (calZoom >= 3 ? 4 : 2)}</div>}
                </div>
              )
            })}
          </div>
        </Card>
      </div>
      <div>
        {calSelectedDate ? (
          <Card>
            <h4 className="text-sm font-semibold mb-3">📅 {parseInt(calSelectedDate!.split('-')[2])} {mesiNomi[parseInt(calSelectedDate!.split('-')[1]) - 1]}</h4>
            {filteredEventiPerData(calSelectedDate!).map(e => { const tc = tipoEventoColors[(e.tipo || 'altro') as string]; return <div key={e.id} className="p-3 rounded-lg mb-2" style={{ background: tc.color + '10', border: `1px solid ${tc.color}30` }}><div style={{ fontSize: 11, fontWeight: 700, color: tc.color }}>{tc.icon} {e.ora_inizio?.slice(0, 5)} {e.titolo}</div>{e.cliente && <div style={{ fontSize: 10, color: '#8b90a8' }}>{e.cliente.nome} {e.cliente.cognome}</div>}{e.commessa_id && <div style={{ fontSize: 9, color: '#f5a623', marginTop: 2 }}>📋 {commesse.find(c => c.id === e.commessa_id)?.codice}</div>}</div> })}
            {scadenzePerData(calSelectedDate!).map(s => (<div key={s.id} className="p-3 rounded-lg mb-2" style={{ background: '#f8717110', border: '1px solid #f8717130' }}><div style={{ fontSize: 11, fontWeight: 700, color: '#f87171' }}>⏰ Scadenza {fmtDec(s.importo)}</div></div>))}
            {filteredEventiPerData(calSelectedDate!).length === 0 && scadenzePerData(calSelectedDate!).length === 0 && <p style={{ fontSize: 12, color: '#5a5f75' }}>Nessun evento{calFilterTipo.length > 0 ? ' (con filtri attivi)' : ''}</p>}
          </Card>
        ) : (
          <Card>
            <h4 className="text-sm font-semibold mb-3">📋 Riepilogo</h4>
            <div className="space-y-2">
              <div className="flex justify-between"><span style={{ fontSize: 12, color: '#8b90a8' }}>Eventi mese</span><span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#5b9cf6' }}>{filteredCalEventi.length}{calFilterTipo.length > 0 ? ` / ${calEventi.length}` : ''}</span></div>
              <div className="flex justify-between"><span style={{ fontSize: 12, color: '#8b90a8' }}>Scadenze aperte</span><span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#f87171' }}>{scadenze.filter(s => s.stato === 'aperta').length}</span></div>
              {tipiEvento.map(t => { const tc = tipoEventoColors[t]; const count = calEventi.filter(e => e.tipo === t).length; return count > 0 ? (
                <div key={t} className="flex justify-between"><span style={{ fontSize: 11, color: tc.color }}>{tc.icon} {t}</span><span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: '#8b90a8' }}>{count}</span></div>
              ) : null })}
            </div>
          </Card>
        )}
      </div>
    </div>
  )

  // ============= TIMELINE VIEW =============
  const timelineWeeks = Array.from({ length: 12 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1 + (i * 7)); return { start: d.toISOString().split('T')[0], label: `S${i + 1}`, weekNum: Math.ceil((d.getDate()) / 7) + (d.getMonth() * 4) } })
  const fasiTimeline = [
    { stato: 'sopralluogo', label: 'Sopr.', color: '#5b9cf6' }, { stato: 'preventivo', label: 'Prev.', color: '#8b90a8' },
    { stato: 'misure', label: 'Mis.', color: '#a78bfa' }, { stato: 'ordini', label: 'Ord.', color: '#f472b6' },
    { stato: 'produzione', label: 'Prod.', color: '#f5a623' }, { stato: 'posa', label: 'Posa', color: '#60a5fa' },
    { stato: 'chiusura', label: 'OK', color: '#34d399' },
  ]

  const TimelineView = () => (
    <Card>
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 12 }}>
        <h3 className="font-semibold">📊 Timeline Commesse — prossime 12 settimane</h3>
        <div className="flex gap-2">{fasiTimeline.map(f => (<div key={f.stato} className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ background: f.color }} /><span style={{ fontSize: 9, color: '#5a5f75' }}>{f.label}</span></div>))}</div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(12, minmax(60px, 1fr))`, gap: 0 }}>
          <div style={{ padding: 8, borderBottom: '2px solid #252a3d', borderRight: '2px solid #252a3d' }} />
          {timelineWeeks.map((w, i) => { const d = new Date(w.start); const isThisWeek = oggiISO >= w.start && oggiISO < (timelineWeeks[i + 1]?.start || '9999'); return (
            <div key={i} className="text-center" style={{ padding: '6px 2px', borderBottom: '2px solid #252a3d', borderRight: '1px solid #1a1e2e', background: isThisWeek ? '#5b9cf608' : 'transparent' }}>
              <div style={{ fontSize: 8, color: '#5a5f75' }}>{mesiNomi[d.getMonth()].slice(0, 3)}</div>
              <div style={{ fontSize: 12, fontWeight: isThisWeek ? 800 : 500, color: isThisWeek ? '#5b9cf6' : '#eae8e3' }}>{d.getDate()}</div>
            </div>
          ) })}
          {commesse.map(comm => {
            const statoIdx = STATI_COMMESSA.findIndex(s => s.value === comm.stato)
            return (
              <React.Fragment key={`tl-row-${comm.id}`}>
                <div style={{ padding: '8px 8px', borderBottom: '1px solid #1a1e2e', borderRight: '2px solid #252a3d' }}><div style={{ fontSize: 10, fontFamily: 'monospace', color: '#f5a623', fontWeight: 700 }}>{comm.codice}</div><div className="text-sm font-medium truncate" style={{ maxWidth: 160 }}>{comm.titolo}</div></div>
                {timelineWeeks.map((w, wi) => { const showBlock = wi >= Math.max(0, statoIdx - 1) && wi <= statoIdx + 2; const fase = showBlock ? fasiTimeline[Math.min(statoIdx, fasiTimeline.length - 1)] : null; const isActive = showBlock && wi === statoIdx; return (
                  <div key={`${comm.id}-${wi}`} style={{ padding: 2, borderBottom: '1px solid #1a1e2e', borderRight: '1px solid #1a1e2e', display: 'flex', alignItems: 'center' }}>
                    {fase && <div className="w-full rounded" style={{ height: 20, background: isActive ? fase.color + '40' : fase.color + '15', border: isActive ? `2px solid ${fase.color}` : `1px solid ${fase.color}30` }} />}
                  </div>
                ) })}
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <div className="mt-4 p-3 rounded-lg flex items-center gap-6" style={{ background: '#181b27' }}>
        <span style={{ fontSize: 10, color: '#5a5f75', fontWeight: 600 }}>LEGENDA:</span>
        <div className="flex items-center gap-1"><div className="w-6 h-3 rounded" style={{ background: '#5b9cf640', border: '2px solid #5b9cf6' }} /><span style={{ fontSize: 10, color: '#8b90a8' }}>Fase attuale</span></div>
        <div className="flex items-center gap-1"><div className="w-6 h-3 rounded" style={{ background: '#5b9cf615' }} /><span style={{ fontSize: 10, color: '#8b90a8' }}>Prevista</span></div>
      </div>
    </Card>
  )


  // ==================== DASHBOARD CONTENT ====================
  const searchResults = globalSearch.length > 1 ? {
    commesse: commesse.filter(c => [c.codice, c.titolo, c.cliente?.nome, c.cliente?.cognome, c.citta].join(' ').toLowerCase().includes(globalSearch.toLowerCase())),
    eventi: calEventi.filter(e => [e.titolo, e.cliente?.nome, e.tipo].join(' ').toLowerCase().includes(globalSearch.toLowerCase())),
    clienti: clienti.filter(c => [c.nome, c.cognome, c.citta, c.telefono].join(' ').toLowerCase().includes(globalSearch.toLowerCase())),
  } : null

  const DashboardContent = () => (
    <div>
      {/* Global Search Bar */}
      <div className="mb-5 relative">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: '#0d0f17', border: '1px solid #252a3d' }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Cerca commesse, clienti, eventi..." 
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#eae8e3', fontSize: 14 }} />
          {globalSearch && <button onClick={() => setGlobalSearch('')} style={{ background: 'transparent', border: 'none', color: '#5a5f75', cursor: 'pointer', fontSize: 14 }}>✕</button>}
        </div>
        {searchResults && (
          <div className="absolute z-50 mt-1 w-full rounded-xl p-3 space-y-3" style={{ background: '#0d0f17', border: '1px solid #252a3d', maxHeight: 400, overflowY: 'auto' }}>
            {searchResults.commesse.length > 0 && (<div>
              <div style={{ fontSize: 9, color: '#5a5f75', fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>COMMESSE ({searchResults.commesse.length})</div>
              {searchResults.commesse.slice(0, 5).map(c => {
                const si = getStato(c.stato)
                return (<div key={c.id} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:opacity-80" style={{ background: '#181b27' }}
                  onClick={() => { setGlobalSearch(''); setActiveTab('commesse'); setSelectedCommessa(c.id) }}>
                  <div className="w-2 h-8 rounded" style={{ background: si.color }} />
                  <div className="flex-1"><div style={{ fontSize: 11, fontFamily: 'monospace', color: '#f5a623' }}>{c.codice}</div><div className="text-sm">{c.titolo}</div></div>
                  <Badge text={si.label} color={si.color} />
                  {c.valore_preventivo > 0 && <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#34d399' }}>{fmtDec(c.valore_preventivo)}</span>}
                </div>)
              })}
            </div>)}
            {searchResults.clienti.length > 0 && (<div>
              <div style={{ fontSize: 9, color: '#5a5f75', fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>CLIENTI ({searchResults.clienti.length})</div>
              {searchResults.clienti.slice(0, 5).map(c => (
                <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:opacity-80" style={{ background: '#181b27' }}
                  onClick={() => { setGlobalSearch(''); setActiveTab('clienti') }}>
                  <span>👤</span><div className="flex-1"><div className="text-sm">{c.nome} {c.cognome}</div><div style={{ fontSize: 10, color: '#5a5f75' }}>{c.citta} · {c.telefono}</div></div>
                </div>
              ))}
            </div>)}
            {searchResults.eventi.length > 0 && (<div>
              <div style={{ fontSize: 9, color: '#5a5f75', fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>EVENTI ({searchResults.eventi.length})</div>
              {searchResults.eventi.slice(0, 5).map(e => {
                const tc = tipoEventoColors[(e.tipo || 'altro') as string]
                return (<div key={e.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: '#181b27' }}>
                  <span>{tc.icon}</span><div className="flex-1"><div className="text-sm">{e.titolo}</div><div style={{ fontSize: 10, color: '#5a5f75' }}>{e.data} · {e.ora_inizio?.slice(0, 5)}</div></div>
                  <Badge text={e.tipo || ''} color={tc.color} />
                </div>)
              })}
            </div>)}
            {searchResults.commesse.length === 0 && searchResults.clienti.length === 0 && searchResults.eventi.length === 0 && (
              <p style={{ fontSize: 12, color: '#5a5f75', textAlign: 'center', padding: 16 }}>Nessun risultato per "{globalSearch}"</p>
            )}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { label: 'Commesse Attive', value: stats.attive, icon: '📋', color: '#5b9cf6' },
          { label: 'Valore Totale', value: fmt(stats.valore), icon: '💰', color: '#34d399' },
          { label: 'Eventi Oggi', value: stats.oggi, icon: '📅', color: '#f5a623' },
          { label: 'Fatturato', value: fmtDec(finStats.fatturato), icon: '📄', color: '#a78bfa' },
          { label: 'Da Incassare', value: fmtDec(finStats.daIncassare), icon: '⏳', color: '#f87171' },
        ].map((s, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontSize: 9, color: '#5a5f75', textTransform: 'uppercase' as const, letterSpacing: 1.5, fontWeight: 600 }}>{s.label}</span>
              <span style={{ fontSize: 14 }}>{s.icon}</span>
            </div>
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Promemoria + Ordini quick bar */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* PROMEMORIA */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#f5a623' }}>📌 PROMEMORIA</h4>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 10, color: '#5a5f75' }}>{promemoria.filter(p => p.stato === 'aperto').length} aperti</span>
              <button onClick={() => setShowPromemoriaForm(!showPromemoriaForm)} style={{ background: '#f5a62320', border: '1px solid #f5a62340', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: '#f5a623', cursor: 'pointer', fontWeight: 600 }}>+</button>
            </div>
          </div>
          {showPromemoriaForm && (
            <div className="mb-3 p-2 rounded-lg" style={{ background: '#0d0f17', border: '1px solid #1a1e2e' }}>
              <div className="flex gap-2 mb-2">
                <input value={newPromemoriaText} onChange={(e) => setNewPromemoriaText(e.target.value)} placeholder="Cosa devi ricordare?"
                  onKeyDown={(e) => e.key === 'Enter' && createPromemoria()}
                  style={{ flex: 1, background: '#181b27', border: '1px solid #252a3d', borderRadius: 6, padding: '6px 8px', fontSize: 12, color: '#eae8e3', outline: 'none' }} autoFocus />
                <button onClick={createPromemoria} style={{ background: '#f5a623', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 11, color: '#08090d', fontWeight: 700, cursor: 'pointer' }}>Salva</button>
              </div>
              <div className="flex gap-1 items-center">
                <span style={{ fontSize: 9, color: '#5a5f75' }}>Priorità:</span>
                {['bassa', 'normale', 'alta', 'urgente'].map(p => (
                  <button key={p} onClick={() => setNewPromemoriaPriorita(p)} style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9, border: 'none', cursor: 'pointer',
                    background: newPromemoriaPriorita === p ? (p === 'urgente' ? '#f87171' : p === 'alta' ? '#f5a623' : p === 'normale' ? '#5b9cf6' : '#5a5f75') + '30' : '#1a1e2e',
                    color: newPromemoriaPriorita === p ? (p === 'urgente' ? '#f87171' : p === 'alta' ? '#f5a623' : p === 'normale' ? '#5b9cf6' : '#8b90a8') : '#5a5f75' }}>
                    {p}
                  </button>
                ))}
                <select value={newPromemoriaCommessa} onChange={(e) => setNewPromemoriaCommessa(e.target.value)}
                  style={{ marginLeft: 8, background: '#181b27', border: '1px solid #252a3d', borderRadius: 4, padding: '2px 4px', fontSize: 9, color: '#8b90a8', outline: 'none' }}>
                  <option value="">Nessuna commessa</option>
                  {commesse.map(c => <option key={c.id} value={c.id}>{c.codice}</option>)}
                </select>
              </div>
            </div>
          )}
          <div className="space-y-1" style={{ maxHeight: 200, overflowY: 'auto' }}>
            {promemoria.filter(p => p.stato === 'aperto').slice(0, 8).map(p => {
              const priColors: Record<string, string> = { urgente: '#f87171', alta: '#f5a623', normale: '#5b9cf6', bassa: '#5a5f75' }
              return (
                <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: '#0d0f17' }}>
                  <button onClick={() => togglePromemoria(p.id, p.stato)} className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ border: `2px solid ${priColors[p.priorita] || '#5a5f75'}`, background: 'transparent', cursor: 'pointer', fontSize: 8, color: priColors[p.priorita] }}>
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className="truncate block" style={{ fontSize: 11, color: '#eae8e3' }}>{p.testo}</span>
                    {p.commessa && <span style={{ fontSize: 8, color: '#f5a623' }}>{(p.commessa as any).codice}</span>}
                  </div>
                  <button onClick={() => deletePromemoria(p.id)} style={{ background: 'transparent', border: 'none', color: '#5a5f75', cursor: 'pointer', fontSize: 10, padding: 0 }}>✕</button>
                </div>
              )
            })}
            {promemoria.filter(p => p.stato === 'aperto').length === 0 && <p style={{ fontSize: 11, color: '#5a5f75', textAlign: 'center', padding: 8 }}>Nessun promemoria</p>}
          </div>
          {promemoria.filter(p => p.stato === 'completato').length > 0 && (
            <div style={{ fontSize: 9, color: '#5a5f75', marginTop: 6, textAlign: 'center' }}>
              ✅ {promemoria.filter(p => p.stato === 'completato').length} completati
            </div>
          )}
        </Card>

        {/* ORDINI ATTIVI */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa' }}>📦 ORDINI FORNITORE</h4>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 10, color: '#5a5f75' }}>{ordini.filter(o => o.stato !== 'consegnato' && o.stato !== 'annullato').length} attivi</span>
              <button onClick={() => setShowNewOrdine(!showNewOrdine)} style={{ background: '#a78bfa20', border: '1px solid #a78bfa40', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: '#a78bfa', cursor: 'pointer', fontWeight: 600 }}>+</button>
            </div>
          </div>
          {showNewOrdine && (
            <div className="mb-3 p-2 rounded-lg space-y-2" style={{ background: '#0d0f17', border: '1px solid #1a1e2e' }}>
              <div className="grid grid-cols-2 gap-2">
                <select value={newOrdine.fornitore_id} onChange={(e) => setNewOrdine({ ...newOrdine, fornitore_id: e.target.value })}
                  style={{ background: '#181b27', border: '1px solid #252a3d', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: '#eae8e3', outline: 'none' }}>
                  <option value="">Fornitore...</option>
                  {fornitori.map(f => <option key={f.id} value={f.id}>{f.ragione_sociale}</option>)}
                </select>
                <select value={newOrdine.commessa_id} onChange={(e) => setNewOrdine({ ...newOrdine, commessa_id: e.target.value })}
                  style={{ background: '#181b27', border: '1px solid #252a3d', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: '#eae8e3', outline: 'none' }}>
                  <option value="">Commessa...</option>
                  {commesse.map(c => <option key={c.id} value={c.id}>{c.codice} - {c.titolo}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <select value={newOrdine.tipo} onChange={(e) => setNewOrdine({ ...newOrdine, tipo: e.target.value })}
                  style={{ background: '#181b27', border: '1px solid #252a3d', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: '#eae8e3', outline: 'none' }}>
                  {['materiale', 'profili', 'vetri', 'accessori', 'ferramenta', 'altro'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input value={newOrdine.descrizione} onChange={(e) => setNewOrdine({ ...newOrdine, descrizione: e.target.value })} placeholder="Descrizione"
                  style={{ background: '#181b27', border: '1px solid #252a3d', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: '#eae8e3', outline: 'none' }} />
                <input type="number" value={newOrdine.importo_totale || ''} onChange={(e) => setNewOrdine({ ...newOrdine, importo_totale: parseFloat(e.target.value) || 0 })} placeholder="Importo €"
                  style={{ background: '#181b27', border: '1px solid #252a3d', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: '#eae8e3', outline: 'none' }} />
              </div>
              <div className="flex gap-2 items-center">
                <input type="date" value={newOrdine.data_consegna_prevista} onChange={(e) => setNewOrdine({ ...newOrdine, data_consegna_prevista: e.target.value })}
                  style={{ background: '#181b27', border: '1px solid #252a3d', borderRadius: 6, padding: '4px 8px', fontSize: 10, color: '#eae8e3', outline: 'none' }} />
                <span style={{ fontSize: 9, color: '#5a5f75' }}>consegna prevista</span>
                <div className="flex-1" />
                <button onClick={() => setShowNewOrdine(false)} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, border: '1px solid #252a3d', background: 'transparent', color: '#5a5f75', cursor: 'pointer' }}>Annulla</button>
                <button onClick={createOrdine} style={{ padding: '4px 12px', borderRadius: 6, fontSize: 10, border: 'none', background: '#a78bfa', color: '#08090d', fontWeight: 700, cursor: 'pointer' }}>Crea Ordine</button>
              </div>
            </div>
          )}
          <div className="space-y-1" style={{ maxHeight: 200, overflowY: 'auto' }}>
            {ordini.filter(o => o.stato !== 'consegnato' && o.stato !== 'annullato').slice(0, 8).map(o => {
              const statoOrdColors: Record<string, { color: string; label: string }> = {
                bozza: { color: '#5a5f75', label: 'Bozza' }, inviato: { color: '#5b9cf6', label: 'Inviato' },
                confermato: { color: '#a78bfa', label: 'Confermato' }, in_consegna: { color: '#f5a623', label: 'In consegna' },
                consegnato: { color: '#34d399', label: 'Consegnato' }, annullato: { color: '#f87171', label: 'Annullato' },
              }
              const so = statoOrdColors[o.stato] || statoOrdColors.bozza
              const statiFlow = ['bozza', 'inviato', 'confermato', 'in_consegna', 'consegnato']
              const nextStato = statiFlow[statiFlow.indexOf(o.stato) + 1]
              return (
                <div key={o.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: '#0d0f17' }}>
                  <div className="w-1.5 h-8 rounded" style={{ background: so.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#a78bfa', fontWeight: 700 }}>{o.codice}</span>
                      <span className="truncate" style={{ fontSize: 10, color: '#eae8e3' }}>{o.descrizione || o.tipo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {o.fornitore && <span style={{ fontSize: 8, color: '#5a5f75' }}>🏭 {(o.fornitore as any).ragione_sociale}</span>}
                      {o.commessa && <span style={{ fontSize: 8, color: '#f5a623' }}>📋 {(o.commessa as any).codice}</span>}
                    </div>
                  </div>
                  {o.importo_totale > 0 && <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#34d399' }}>{fmtDec(o.importo_totale)}</span>}
                  {o.data_consegna_prevista && <span style={{ fontSize: 8, color: new Date(o.data_consegna_prevista) < new Date() ? '#f87171' : '#5a5f75' }}>📅 {new Date(o.data_consegna_prevista).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}</span>}
                  <Badge text={so.label} color={so.color} />
                  {nextStato && <button onClick={() => updateOrdineStato(o.id, nextStato)} style={{ padding: '2px 6px', borderRadius: 4, fontSize: 8, border: 'none', background: '#252a3d', color: '#8b90a8', cursor: 'pointer' }}>→</button>}
                </div>
              )
            })}
            {ordini.filter(o => o.stato !== 'consegnato' && o.stato !== 'annullato').length === 0 && <p style={{ fontSize: 11, color: '#5a5f75', textAlign: 'center', padding: 8 }}>Nessun ordine attivo</p>}
          </div>
        </Card>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ background: '#0d0f17', display: 'inline-flex' }}>
        {[{ id: 'kanban', label: '▦ Kanban' }, { id: 'overview', label: '📊 Pipeline' }, { id: 'timeline', label: '📅 Oggi' }].map(v => (
          <button key={v.id} onClick={() => setDashView(v.id)} className="px-3 py-1.5 rounded-md text-xs font-semibold"
            style={{ background: dashView === v.id ? '#5b9cf620' : 'transparent', color: dashView === v.id ? '#5b9cf6' : '#5a5f75', border: 'none', cursor: 'pointer' }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* KANBAN VIEW - Asana style */}
      {dashView === 'kanban' && (
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <div className="flex gap-3" style={{ minWidth: STATI_COMMESSA.length * 220 }}>
            {STATI_COMMESSA.map(stato => {
              const stCommesse = commesse.filter(c => c.stato === stato.value)
              return (
                <div key={stato.value} className="flex-1 rounded-xl" style={{ background: '#0d0f17', border: '1px solid #1a1e2e', minWidth: 200, maxWidth: 280 }}>
                  {/* Column header */}
                  <div className="p-3 flex items-center justify-between" style={{ borderBottom: `2px solid ${stato.color}30` }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 14 }}>{stato.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: stato.color }}>{stato.label}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 10, fontWeight: 700, background: stato.color + '20', color: stato.color }}>{stCommesse.length}</span>
                  </div>
                  {/* Cards */}
                  <div className="p-2 space-y-2" style={{ maxHeight: 500, overflowY: 'auto' }}>
                    {stCommesse.map(comm => {
                      const attivita = commessaAttivita.filter(a => a.commessa_id === comm.id)
                      const completate = attivita.filter(a => a.stato === 'completata').length
                      const totAtt = attivita.length
                      const percProgetto = totAtt > 0 ? Math.round((completate / totAtt) * 100) : 0
                      const prossEvento = calEventi.find(e => e.commessa_id === comm.id && e.data >= oggiISO)
                      return (
                        <div key={comm.id} className="p-3 rounded-lg cursor-pointer transition-all"
                          onClick={() => { setActiveTab('commesse'); setSelectedCommessa(comm.id) }}
                          style={{ background: '#181b27', border: '1px solid #252a3d' }}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#f5a623' }}>{comm.codice}</span>
                            {comm.valore_preventivo > 0 && <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#34d399' }}>{fmtDec(comm.valore_preventivo)}</span>}
                          </div>
                          <div className="text-sm font-medium mb-1 truncate">{comm.titolo}</div>
                          <div style={{ fontSize: 10, color: '#5a5f75', marginBottom: 6 }}>
                            👤 {comm.cliente?.nome} {comm.cliente?.cognome} {comm.citta ? `· 📍 ${comm.citta}` : ''}
                          </div>
                          {/* Progress bar */}
                          {totAtt > 0 && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex-1 h-1.5 rounded-full" style={{ background: '#252a3d' }}>
                                <div className="h-1.5 rounded-full transition-all" style={{ background: percProgetto === 100 ? '#34d399' : '#5b9cf6', width: `${percProgetto}%` }} />
                              </div>
                              <span style={{ fontSize: 9, fontFamily: 'monospace', color: percProgetto === 100 ? '#34d399' : '#5b9cf6' }}>{percProgetto}%</span>
                            </div>
                          )}
                          {/* Tags row */}
                          <div className="flex items-center gap-1 flex-wrap">
                            {prossEvento && (
                              <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 8, background: '#5b9cf615', color: '#5b9cf6' }}>
                                📅 {new Date(prossEvento.data).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                              </span>
                            )}
                            {comm.data_consegna_prevista && (
                              <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 8, background: new Date(comm.data_consegna_prevista) < new Date() ? '#f8717115' : '#34d39915', color: new Date(comm.data_consegna_prevista) < new Date() ? '#f87171' : '#34d399' }}>
                                🏁 {new Date(comm.data_consegna_prevista).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                              </span>
                            )}
                            {totAtt > 0 && <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 8, background: '#f5a62315', color: '#f5a623' }}>{completate}/{totAtt} att.</span>}
                          </div>
                        </div>
                      )
                    })}
                    {stCommesse.length === 0 && (
                      <div className="text-center py-6" style={{ fontSize: 10, color: '#5a5f75' }}>Nessuna commessa</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* PIPELINE VIEW */}
      {dashView === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <h4 className="text-sm font-semibold mb-3" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 8 }}>Pipeline Commesse</h4>
            <div className="space-y-2">
              {STATI_COMMESSA.map(s => {
                const count = commesse.filter(c => c.stato === s.value).length
                const perc = commesse.length > 0 ? Math.round((count / commesse.length) * 100) : 0
                const valore = commesse.filter(c => c.stato === s.value).reduce((sum, c) => sum + (c.valore_preventivo || 0), 0)
                return (
                  <div key={s.value} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer" style={{ background: '#181b27' }}
                    onClick={() => { setActiveTab('commesse'); setCommessaFilter(s.value) }}>
                    <span style={{ fontSize: 14, width: 24 }}>{s.icon}</span>
                    <span style={{ fontSize: 12, width: 90, color: '#8b90a8' }}>{s.label}</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: '#252a3d' }}>
                      <div className="h-2 rounded-full" style={{ background: s.color, width: `${perc}%` }} />
                    </div>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: s.color, minWidth: 20, textAlign: 'right' as const }}>{count}</span>
                    {valore > 0 && <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#34d399', minWidth: 60, textAlign: 'right' as const }}>{fmtDec(valore)}</span>}
                  </div>
                )
              })}
            </div>
          </Card>
          <Card>
            <h4 className="text-sm font-semibold mb-3" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 8 }}>Interconnessioni</h4>
            <div className="space-y-2">
              {commesse.filter(c => c.stato !== 'chiusura').slice(0, 6).map(c => {
                const si = getStato(c.stato)
                const evts = calEventi.filter(e => e.commessa_id === c.id).length
                const fatt = fatture.filter(f => f.commessa_id === c.id).length
                const lavs = lavorazioni.filter(l => l.commessa_id === c.id).length
                return (
                  <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer" style={{ background: '#181b27' }}
                    onClick={() => { setActiveTab('commesse'); setSelectedCommessa(c.id) }}>
                    <div className="w-1.5 h-8 rounded" style={{ background: si.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1"><span style={{ fontSize: 9, fontFamily: 'monospace', color: '#f5a623' }}>{c.codice}</span><span className="text-xs truncate">{c.titolo}</span></div>
                    </div>
                    <div className="flex gap-1">
                      {evts > 0 && <span className="px-1 py-0.5 rounded" style={{ fontSize: 8, background: '#5b9cf615', color: '#5b9cf6' }}>📅{evts}</span>}
                      {fatt > 0 && <span className="px-1 py-0.5 rounded" style={{ fontSize: 8, background: '#a78bfa15', color: '#a78bfa' }}>📄{fatt}</span>}
                      {lavs > 0 && <span className="px-1 py-0.5 rounded" style={{ fontSize: 8, background: '#f5a62315', color: '#f5a623' }}>🔧{lavs}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* TODAY VIEW */}
      {dashView === 'timeline' && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <h4 className="text-sm font-semibold mb-3" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 8 }}>📅 Eventi Oggi</h4>
            <div className="space-y-2">
              {eventiOggi.map(e => {
                const tc = tipoEventoColors[(e.tipo || 'altro') as string]
                return (<div key={e.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: '#181b27' }}>
                  <span style={{ fontSize: 14 }}>{tc.icon}</span>
                  <div className="flex-1"><div className="text-sm">{e.titolo}</div><div style={{ fontSize: 10, color: '#5a5f75' }}>{e.ora_inizio?.slice(0, 5)} · {e.cliente?.nome}</div></div>
                  <Badge text={e.tipo || 'altro'} color={tc.color} />
                </div>)
              })}
              {eventiOggi.length === 0 && <p style={{ fontSize: 12, color: '#5a5f75', textAlign: 'center', padding: 16 }}>Nessun evento oggi</p>}
            </div>
          </Card>
          <Card>
            <h4 className="text-sm font-semibold mb-3" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 8 }}>🔧 Lavorazioni Attive</h4>
            <div className="space-y-2">
              {lavorazioni.filter(l => l.stato === 'in_corso').slice(0, 8).map(l => (
                <div key={l.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: '#181b27' }}>
                  <span style={{ fontSize: 10 }}>🔧</span>
                  <div className="flex-1"><div style={{ fontSize: 11, fontWeight: 600 }}>{l.fase?.nome}</div><div style={{ fontSize: 9, color: '#5a5f75' }}>{l.commessa?.codice}</div></div>
                  <Badge text="in corso" color="#f5a623" />
                </div>
              ))}
              {lavorazioni.filter(l => l.stato === 'in_corso').length === 0 && <p style={{ fontSize: 12, color: '#5a5f75', textAlign: 'center', padding: 16 }}>Nessuna lavorazione attiva</p>}
            </div>
          </Card>
          <Card>
            <h4 className="text-sm font-semibold mb-3" style={{ borderBottom: '1px solid #1a1e2e', paddingBottom: 8 }}>⏰ Scadenze Imminenti</h4>
            <div className="space-y-2">
              {scadenze.filter(s => s.stato === 'aperta').slice(0, 8).map(s => (
                <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: '#f8717108' }}>
                  <span>⏰</span>
                  <div className="flex-1"><div style={{ fontSize: 11, fontWeight: 600, color: '#f87171' }}>{fmtDec(s.importo)}</div><div style={{ fontSize: 9, color: '#5a5f75' }}>{new Date(s.data_scadenza).toLocaleDateString('it-IT')}</div></div>
                </div>
              ))}
              {scadenze.filter(s => s.stato === 'aperta').length === 0 && <p style={{ fontSize: 12, color: '#5a5f75', textAlign: 'center', padding: 16 }}>Nessuna scadenza</p>}
            </div>
          </Card>
        </div>
      )}
    </div>
  )


  // ==================== DESKTOP LAYOUT ====================
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'commesse', label: 'Commesse', icon: '📋' },
    { id: 'contabilita', label: 'Contabilità', icon: '💰' },
    { id: 'magazzino', label: 'Magazzino', icon: '📦' },
    { id: 'produzione', label: 'Produzione', icon: '🔧' },
    { id: 'clienti', label: 'Clienti', icon: '👥' },
    { id: 'calendario', label: 'Calendario', icon: '📅' },
  ]

  return (
    <>
      <MobileLayout />
      <div className="hidden lg:flex min-h-screen" style={{ background: '#08090d', color: '#eae8e3' }}>
        {/* Sidebar */}
        <aside className="w-56 flex flex-col" style={{ background: '#0d0f17', borderRight: '1px solid #1a1e2e' }}>
          <div className="px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-extrabold" style={{ background: 'linear-gradient(135deg, #f5a623, #a78bfa)', color: '#08090d' }}>M</div>
              <div>
                <h1 className="text-base font-bold tracking-tight">MASTRO</h1>
                <p style={{ fontSize: 8, color: '#5a5f75', letterSpacing: 2, textTransform: 'uppercase' as const }}>Walter Cozza Srl</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id === 'contabilita') loadContabilita(); if (tab.id === 'magazzino') loadMagazzino(); if (tab.id === 'produzione') loadProduzione(); if (tab.id === 'clienti') loadClienti(); if (tab.id === 'calendario') loadCalendario() }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: activeTab === tab.id ? '#f5a62315' : 'transparent', color: activeTab === tab.id ? '#f5a623' : '#8b90a8' }}>
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#f5a623' }} />}
              </button>
            ))}
          </nav>
          <div className="p-4" style={{ borderTop: '1px solid #1a1e2e' }}>
            <div className="text-center">
              <p style={{ fontSize: 9, color: '#5a5f75', letterSpacing: 1 }}>FRAMEFLOW ERP</p>
              <p style={{ fontSize: 8, color: '#5a5f75' }}>v0.9.0 · Vista Progetto</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <header className="px-8 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #1a1e2e' }}>
            <div>
              <h2 className="text-xl font-bold">{tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label}</h2>
              <p style={{ fontSize: 11, color: '#5a5f75' }}>{oggi}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-3 py-2 rounded-lg text-xs" style={{ background: '#181b27', border: '1px solid #252a3d', color: '#8b90a8' }}>🔔 Notifiche</button>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#f5a62320', color: '#f5a623' }}>WC</div>
            </div>
          </header>
          <div className="p-8">
            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'commesse' && <CommesseContent />}
            {activeTab === 'contabilita' && <ContabilitaOverview />}
            {activeTab === 'magazzino' && <MagazzinoContent />}
            {activeTab === 'produzione' && <ProduzioneContent />}
            {activeTab === 'clienti' && <ClientiContent />}
            {activeTab === 'calendario' && <CalendarioContent />}
          </div>
        </main>
      </div>
    </>
  )
}
