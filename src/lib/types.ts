// MASTRO Types

export type StatoCommessa = {
    value: string
    label: string
    icon: string
    color: string
  }
  
  export const STATI_COMMESSA: StatoCommessa[] = [
    { value: 'sopralluogo', label: 'Sopralluogo', icon: '🔍', color: '#f5a623' },
    { value: 'preventivo', label: 'Preventivo', icon: '📄', color: '#8b90a8' },
    { value: 'misure', label: 'Misure', icon: '📐', color: '#5b9cf6' },
    { value: 'ordini', label: 'Ordini', icon: '📦', color: '#a78bfa' },
    { value: 'produzione', label: 'Produzione', icon: '🔧', color: '#34d399' },
    { value: 'posa', label: 'Posa', icon: '🏗️', color: '#60a5fa' },
    { value: 'chiusura', label: 'Chiusura', icon: '✅', color: '#10b981' },
  ]
  
  export type Cliente = {
    id: string
    azienda_id: string
    nome: string
    cognome: string
    tipo?: string
    ragione_sociale?: string
    partita_iva?: string
    codice_fiscale?: string
    pec?: string
    telefono?: string
    email?: string
    indirizzo?: string
    citta?: string
  }
  
  export type Commessa = {
    id: string
    azienda_id: string
    cliente_id?: string
    codice?: string
    titolo?: string
    tipo?: string
    stato: string
    indirizzo?: string
    citta?: string
    priorita?: string
    note?: string
    valore_preventivo: number
    data_inizio?: string
    data_consegna_prevista?: string
    assegnato_a?: string
    created_at?: string
    updated_at?: string
    cliente?: Cliente
  }
  
  export type Evento = {
    id: string
    azienda_id: string
    commessa_id?: string
    cliente_id?: string
    titolo: string
    tipo?: string
    data: string
    ora_inizio?: string
    ora_fine?: string
    durata_minuti?: number
    assegnato_a?: string
    indirizzo?: string
    note?: string
    stato?: string
    cliente?: Cliente
  }
  
  export type Fattura = {
    id: string
    azienda_id: string
    commessa_id?: string
    cliente_id?: string
    numero: string
    tipo: string
    direzione: string
    data_emissione: string
    data_scadenza?: string
    imponibile: number
    aliquota_iva: number
    importo_iva: number
    totale: number
    stato: string
    metodo_pagamento?: string
    note?: string
    created_at?: string
    cliente?: Cliente
    commessa?: Commessa
  }
  
  export type FatturaRiga = {
    id: string
    fattura_id: string
    descrizione: string
    quantita: number
    unita: string
    prezzo_unitario: number
    sconto_perc: number
    totale_riga: number
    ordinamento: number
  }
  
  export type Pagamento = {
    id: string
    azienda_id: string
    fattura_id?: string
    commessa_id?: string
    cliente_id?: string
    tipo: string
    importo: number
    data_pagamento: string
    metodo: string
    riferimento?: string
    note?: string
    created_at?: string
    cliente?: Cliente
    commessa?: Commessa
    fattura?: Fattura
  }
  
  export type Scadenza = {
    id: string
    azienda_id: string
    fattura_id?: string
    commessa_id?: string
    cliente_id?: string
    descrizione?: string
    importo: number
    data_scadenza: string
    stato: string
    data_pagamento?: string
    note?: string
    created_at?: string
    cliente?: Cliente
    commessa?: Commessa
  }

  // MAGAZZINO TYPES

  export type Fornitore = {
    id: string
    azienda_id: string
    ragione_sociale: string
    partita_iva?: string
    citta?: string
    telefono?: string
    email?: string
    tipo: string
    rating?: number
    attivo?: boolean
  }
  
  export type ArticoloMagazzino = {
    id: string
    azienda_id: string
    categoria_id?: string
    codice?: string
    nome: string
    tipo: string
    unita_misura: string
    lunghezza_standard?: number
    peso_metro?: number
    prezzo_acquisto: number
    prezzo_vendita: number
    scorta_minima: number
    scorta_attuale: number
    fornitore_id?: string
    ubicazione?: string
    attivo?: boolean
    fornitore?: Fornitore
    categoria?: CategoriaMagazzino
  }
  
  export type CategoriaMagazzino = {
    id: string
    azienda_id: string
    nome: string
    tipo: string
  }
  
  export type MovimentoMagazzino = {
    id: string
    azienda_id: string
    articolo_id: string
    commessa_id?: string
    tipo: string
    causale?: string
    quantita: number
    prezzo_unitario?: number
    documento_rif?: string
    note?: string
    created_at?: string
    articolo?: ArticoloMagazzino
  }

  // PRODUZIONE TYPES

  export type FaseProduzione = {
    id: string
    azienda_id: string
    nome: string
    codice?: string
    tipo?: string
    ordine: number
    tempo_stimato_min: number
  }
  
  export type CentroLavoro = {
    id: string
    azienda_id: string
    nome: string
    tipo?: string
    marca?: string
    modello?: string
    stato: string
    costo_orario: number
  }
  
  export type Lavorazione = {
    id: string
    azienda_id: string
    commessa_id: string
    fase_id?: string
    centro_lavoro_id?: string
    operatore_id?: string
    stato: string
    tempo_stimato_min: number
    tempo_effettivo_min: number
    data_inizio?: string
    data_fine?: string
    note?: string
    problema?: string
    fase?: FaseProduzione
    centro_lavoro?: CentroLavoro
    commessa?: Commessa
  }
  
  export type Dipendente = {
    id: string
    azienda_id: string
    nome: string
    cognome: string
    ruolo?: string
    reparto?: string
    costo_orario: number
    attivo?: boolean
  }

  // VISTA PROGETTO TYPES

  export type CommessaAttivita = {
    id: string
    azienda_id: string
    commessa_id: string
    template_id: string
    macro_fase: string
    macro_fase_ordine: number
    ordine: number
    codice: string
    titolo: string
    reparto: string
    assegnato_a?: string
    stato: string
    percentuale: number
    tempo_stimato_min: number
    tempo_effettivo_min: number
    data_prevista?: string
    data_inizio?: string
    data_fine?: string
    bloccata_da?: string
    obbligatoria?: boolean
    dipende_da?: string
    note?: string
    created_at?: string
  }

  export type TemplateAttivita = {
    id: string
    azienda_id: string
    macro_fase: string
    macro_fase_ordine: number
    ordine: number
    codice: string
    titolo: string
    descrizione?: string
    reparto: string
    ruolo_default?: string
    tempo_stimato_min: number
    obbligatoria: boolean
    dipende_da?: string
    created_at?: string
  }

  // Macro-fase metadata for Vista Progetto
  export const MACRO_FASI: { value: string; label: string; icon: string; color: string; ordine: number }[] = [
    { value: 'sopralluogo', label: 'Sopralluogo', icon: '🔍', color: '#f5a623', ordine: 1 },
    { value: 'preventivo', label: 'Preventivo', icon: '📄', color: '#8b90a8', ordine: 2 },
    { value: 'misure', label: 'Misure', icon: '📐', color: '#5b9cf6', ordine: 3 },
    { value: 'ordini', label: 'Ordini', icon: '📦', color: '#a78bfa', ordine: 4 },
    { value: 'produzione', label: 'Produzione', icon: '🔧', color: '#34d399', ordine: 5 },
    { value: 'posa', label: 'Posa', icon: '🏗️', color: '#60a5fa', ordine: 6 },
    { value: 'chiusura', label: 'Chiusura', icon: '✅', color: '#10b981', ordine: 7 },
  ]

  export type OrdineFornitore = {
    id: string
    azienda_id: string
    commessa_id?: string
    fornitore_id?: string
    codice: string
    stato: string
    tipo: string
    descrizione?: string
    importo_totale: number
    data_ordine?: string
    data_consegna_prevista?: string
    data_consegna_effettiva?: string
    note?: string
    created_at?: string
    updated_at?: string
  }

  export type Promemoria = {
    id: string
    azienda_id: string
    commessa_id?: string
    cliente_id?: string
    testo: string
    priorita: string
    stato: string
    data_scadenza?: string
    assegnato_a?: string
    created_at?: string
    completato_at?: string
  }

  export type Serramento = {
    id: string
    azienda_id: string
    commessa_id: string
    posizione: string
    ambiente: string
    piano: string
    tipo: string
    larghezza: number
    altezza: number
    profondita_muro: number
    num_ante: number
    configurazione: string
    divisione_ante?: string
    ha_traverso: boolean
    altezza_sopraluce: number
    tipo_sopraluce: string
    sistema_profilo: string
    materiale: string
    larghezza_profilo: number
    colore_esterno: string
    colore_interno: string
    nome_colore_esterno: string
    nome_colore_interno: string
    finitura: string
    tipo_vetro: string
    composizione_vetro: string
    vetro_basso_emissivo: boolean
    vetro_temperato: boolean
    vetro_stratificato: boolean
    gas_camera: string
    ug_valore: number
    tipo_ferramenta: string
    classe_antieffrazione: string
    maniglia: string
    colore_maniglia: string
    posizione_maniglia: string
    cerniere: string
    cassonetto: boolean
    tipo_cassonetto: string
    avvolgibile: boolean
    tipo_avvolgibile: string
    motorizzato: boolean
    zanzariera: boolean
    tipo_zanzariera: string
    persiana: boolean
    tipo_persiana: string
    davanzale_interno: boolean
    davanzale_esterno: boolean
    soglia: string
    uw_valore?: number
    peso_kg?: number
    superficie_mq?: number
    prezzo_profilo: number
    prezzo_vetro: number
    prezzo_ferramenta: number
    prezzo_accessori: number
    prezzo_posa: number
    sconto_percentuale: number
    prezzo_totale: number
    note?: string
    ordine: number
    created_at?: string
    updated_at?: string
  }

  export const TIPI_SERRAMENTO = [
    { value: 'finestra', label: 'Finestra', icon: '🪟' },
    { value: 'portafinestra', label: 'Portafinestra', icon: '🚪' },
    { value: 'scorrevole', label: 'Scorrevole', icon: '↔️' },
    { value: 'alzante_scorrevole', label: 'Alzante Scorrevole', icon: '⬆️' },
    { value: 'fisso', label: 'Fisso', icon: '⬜' },
    { value: 'porta_ingresso', label: 'Porta Ingresso', icon: '🚪' },
    { value: 'vasistas', label: 'Vasistas', icon: '🔽' },
  ]

  export const MATERIALI_PROFILO = [
    { value: 'pvc', label: 'PVC', color: '#FFFFFF' },
    { value: 'alluminio', label: 'Alluminio', color: '#A8A8A8' },
    { value: 'legno_alluminio', label: 'Legno/Alluminio', color: '#8B6914' },
    { value: 'legno', label: 'Legno', color: '#A0522D' },
    { value: 'acciaio', label: 'Acciaio', color: '#71797E' },
  ]

  export const COLORI_SERRAMENTO = [
    { value: '#FFFFFF', label: 'Bianco', ral: '9016' },
    { value: '#F5F5DC', label: 'Avorio', ral: '1015' },
    { value: '#808080', label: 'Grigio', ral: '7035' },
    { value: '#474747', label: 'Grigio Scuro', ral: '7016' },
    { value: '#3B3B3B', label: 'Antracite', ral: '7021' },
    { value: '#1C1C1C', label: 'Nero', ral: '9005' },
    { value: '#8B6914', label: 'Rovere Dorato', ral: '' },
    { value: '#5C4033', label: 'Noce', ral: '' },
    { value: '#A0522D', label: 'Ciliegio', ral: '' },
    { value: '#4A6741', label: 'Verde Muschio', ral: '6005' },
    { value: '#003153', label: 'Blu Notte', ral: '5011' },
    { value: '#800020', label: 'Bordeaux', ral: '3005' },
  ]
