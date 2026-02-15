// MASTRO — Sessione 1 Patch Automatico
// Uso: node patch-sessione1.js
// Eseguire dalla cartella del progetto MASTRO-

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'page.tsx');

console.log('\n🔧 MASTRO — Sessione 1: Patch Calendario CRUD');
console.log('================================================\n');

// Check file exists
if (!fs.existsSync(filePath)) {
  console.log('❌ File non trovato: ' + filePath);
  console.log('   Assicurati di eseguire questo script dalla cartella MASTRO-');
  console.log('   Es: cd C:\\Users\\Fabio\\Desktop\\MASTRO-');
  console.log('       node patch-sessione1.js\n');
  process.exit(1);
}

// Backup
const backup = filePath + '.backup-sessione1';
fs.copyFileSync(filePath, backup);
console.log('✅ Backup creato: page.tsx.backup-sessione1');

let code = fs.readFileSync(filePath, 'utf8');
let changes = 0;

// ═══════════════════════════════════════════
// MODIFICA 1: Aggiungi state editingEvento
// ═══════════════════════════════════════════
const stateSearch = 'const [showNewEvento, setShowNewEvento]';
const stateIdx = code.indexOf(stateSearch);
if (stateIdx === -1) {
  console.log('⚠️  State showNewEvento non trovato — cerco alternativa...');
  // Try finding it with useState
  const alt = code.indexOf('showNewEvento');
  if (alt === -1) {
    console.log('❌ Impossibile trovare showNewEvento nel codice');
  } else {
    console.log('   Trovato showNewEvento, ma in formato diverso. Aggiungo state manualmente...');
  }
} else {
  // Find end of this line
  const lineEnd = code.indexOf('\n', stateIdx);
  if (lineEnd !== -1 && !code.includes('editingEvento')) {
    code = code.slice(0, lineEnd + 1) + '  const [editingEvento, setEditingEvento] = useState<any>(null)\n' + code.slice(lineEnd + 1);
    changes++;
    console.log('✅ Modifica 1: State editingEvento aggiunto');
  } else if (code.includes('editingEvento')) {
    console.log('ℹ️  Modifica 1: editingEvento già presente, skip');
  }
}

// ═══════════════════════════════════════════
// MODIFICA 2: Aggiungi funzioni updateEvento e deleteEvento
// ═══════════════════════════════════════════
const newFunctions = `

  async function updateEvento(id: string, updates: any) {
    const { error } = await supabase
      .from('eventi')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) {
      setEditingEvento(null)
      await loadCalendario()
      await loadDashboard()
    }
  }

  async function deleteEvento(id: string) {
    if (!confirm('Eliminare questo evento?')) return
    const { error } = await supabase
      .from('eventi')
      .delete()
      .eq('id', id)
    if (!error) {
      await loadCalendario()
      await loadDashboard()
    }
  }
`;

if (!code.includes('async function updateEvento')) {
  // Find end of createEvento function
  const createEventoIdx = code.indexOf('async function createEvento()');
  if (createEventoIdx !== -1) {
    // Find the closing of createEvento - count braces
    let braceCount = 0;
    let started = false;
    let endIdx = createEventoIdx;
    for (let i = createEventoIdx; i < code.length; i++) {
      if (code[i] === '{') { braceCount++; started = true; }
      if (code[i] === '}') { braceCount--; }
      if (started && braceCount === 0) { endIdx = i + 1; break; }
    }
    code = code.slice(0, endIdx) + newFunctions + code.slice(endIdx);
    changes++;
    console.log('✅ Modifica 2: Funzioni updateEvento + deleteEvento aggiunte');
  } else {
    console.log('⚠️  createEvento non trovato — aggiungo funzioni dopo loadCalendario...');
    const loadCalIdx = code.indexOf('async function loadCalendario()');
    if (loadCalIdx !== -1) {
      let braceCount = 0; let started = false; let endIdx = loadCalIdx;
      for (let i = loadCalIdx; i < code.length; i++) {
        if (code[i] === '{') { braceCount++; started = true; }
        if (code[i] === '}') { braceCount--; }
        if (started && braceCount === 0) { endIdx = i + 1; break; }
      }
      code = code.slice(0, endIdx) + newFunctions + code.slice(endIdx);
      changes++;
      console.log('✅ Modifica 2: Funzioni aggiunte dopo loadCalendario');
    }
  }
} else {
  console.log('ℹ️  Modifica 2: updateEvento già presente, skip');
}

// ═══════════════════════════════════════════
// MODIFICA 3A: Bottoni edit/delete nella Vista OGGI
// ═══════════════════════════════════════════
const buttonsOggi = `
                              <div className="flex gap-1 mt-1">
                                <button onClick={(ev) => { ev.stopPropagation(); setEditingEvento({...e}) }}
                                  style={{ padding: '2px 6px', background: TH.blue + '10', border: \`1px solid \${TH.blue}30\`, borderRadius: 4, fontSize: 8, fontWeight: 600, color: TH.blue, cursor: 'pointer' }}>
                                  ✏️ Modifica
                                </button>
                                <button onClick={(ev) => { ev.stopPropagation(); deleteEvento(e.id) }}
                                  style={{ padding: '2px 6px', background: TH.red + '10', border: \`1px solid \${TH.red}30\`, borderRadius: 4, fontSize: 8, fontWeight: 600, color: TH.red, cursor: 'pointer' }}>
                                  🗑️ Elimina
                                </button>
                              </div>`;

// Find the pattern in today view - look for durata_min}min in event cards
const durataPattern = "{e.ora_inizio} · {e.durata_min}min";
let durataIdx = code.indexOf(durataPattern);
if (durataIdx !== -1 && !code.includes('setEditingEvento')) {
  // Find the closing </div> after this line
  const afterDurata = code.indexOf('</div>', durataIdx);
  if (afterDurata !== -1) {
    code = code.slice(0, afterDurata) + buttonsOggi + '\n                              ' + code.slice(afterDurata);
    changes++;
    console.log('✅ Modifica 3A: Bottoni edit/delete aggiunti in Vista Oggi');
  }
} else if (code.includes('setEditingEvento')) {
  console.log('ℹ️  Modifica 3A: Bottoni già presenti, skip');
} else {
  console.log('⚠️  Pattern vista oggi non trovato — bottoni non aggiunti in questa vista');
}

// ═══════════════════════════════════════════
// MODIFICA 3B: Bottoni nella Vista SETTIMANA
// ═══════════════════════════════════════════
const buttonsSett = `
                                    <div className="flex gap-0.5 mt-0.5">
                                      <button onClick={(ev) => { ev.stopPropagation(); setEditingEvento({...e}) }}
                                        style={{ padding: '1px 4px', background: 'transparent', border: 'none', fontSize: 8, cursor: 'pointer', color: TH.blue }}>✏️</button>
                                      <button onClick={(ev) => { ev.stopPropagation(); deleteEvento(e.id) }}
                                        style={{ padding: '1px 4px', background: 'transparent', border: 'none', fontSize: 8, cursor: 'pointer', color: TH.red }}>🗑️</button>
                                    </div>`;

const titoloPattern = "fontWeight: 500 }}>{e.titolo}</div>";
const titoloIdx = code.indexOf(titoloPattern);
if (titoloIdx !== -1 && code.indexOf('setEditingEvento', titoloIdx) > titoloIdx + 200) {
  // Not yet added near this location
  const insertAt = titoloIdx + titoloPattern.length;
  code = code.slice(0, insertAt) + buttonsSett + code.slice(insertAt);
  changes++;
  console.log('✅ Modifica 3B: Bottoni edit/delete aggiunti in Vista Settimana');
} else if (titoloIdx !== -1) {
  // Check if already has buttons nearby
  const nearby = code.substring(titoloIdx, titoloIdx + 500);
  if (nearby.includes('setEditingEvento')) {
    console.log('ℹ️  Modifica 3B: Bottoni già presenti, skip');
  } else {
    const insertAt = titoloIdx + titoloPattern.length;
    code = code.slice(0, insertAt) + buttonsSett + code.slice(insertAt);
    changes++;
    console.log('✅ Modifica 3B: Bottoni aggiunti in Vista Settimana');
  }
} else {
  console.log('⚠️  Pattern vista settimana non trovato');
}

// ═══════════════════════════════════════════
// MODIFICA 3D: Modal di Modifica Evento
// ═══════════════════════════════════════════
const editModal = `
        {/* ═══ MODAL MODIFICA EVENTO ═══ */}
        {editingEvento && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setEditingEvento(null)}>
            <div className="rounded-xl" style={{ width: 520, background: BG.card, boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.4)' : TH.shadowMd, overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}>
              <div className="p-5" style={{ borderBottom: \`1px solid \${TX.border}\` }}>
                <div className="flex items-center justify-between">
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: TX.text }}>
                    <Ic n="calendar" s={16} c={AC}/> Modifica Evento
                  </h3>
                  <button onClick={() => setEditingEvento(null)}
                    style={{ background: BG.input, border: \`1px solid \${TX.border}\`, borderRadius: 8, padding: 6, cursor: 'pointer' }}>
                    <Ic n="x" s={14} c={TX.textMuted}/>
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <InputField label="Titolo" value={editingEvento.titolo || ''} onChange={(v: string) => setEditingEvento({...editingEvento, titolo: v})} />
                <div className="grid grid-cols-2 gap-3">
                  <SelectField label="Tipo" value={editingEvento.tipo || 'altro'} onChange={(v: string) => setEditingEvento({...editingEvento, tipo: v})}
                    options={[
                      { value: 'sopralluogo', label: 'Sopralluogo' },
                      { value: 'misure', label: 'Misure' },
                      { value: 'scadenza', label: 'Scadenza' },
                      { value: 'posa', label: 'Posa' },
                      { value: 'consegna', label: 'Consegna' },
                      { value: 'riunione', label: 'Riunione' },
                      { value: 'altro', label: 'Altro' },
                    ]} />
                  <InputField label="Data" value={editingEvento.data || ''} onChange={(v: string) => setEditingEvento({...editingEvento, data: v})} type="date" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Ora inizio" value={editingEvento.ora_inizio || ''} onChange={(v: string) => setEditingEvento({...editingEvento, ora_inizio: v})} type="time" />
                  <InputField label="Durata (min)" value={editingEvento.durata_min || 60} onChange={(v: string) => setEditingEvento({...editingEvento, durata_min: parseInt(v) || 60})} type="number" />
                </div>
                <SelectField label="Cliente" value={editingEvento.cliente_id || ''} onChange={(v: string) => setEditingEvento({...editingEvento, cliente_id: v})}
                  options={clienti.map((c: any) => ({ value: c.id, label: \`\${c.nome} \${c.cognome}\` }))} />
                <SelectField label="Commessa" value={editingEvento.commessa_id || ''} onChange={(v: string) => setEditingEvento({...editingEvento, commessa_id: v})}
                  options={commesse.map((c: any) => ({ value: c.id, label: \`\${c.codice} — \${c.titolo}\` }))} />
                <div>
                  <label style={{ fontSize: 10, color: TX.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Note</label>
                  <textarea value={editingEvento.note || ''} onChange={(e) => setEditingEvento({...editingEvento, note: e.target.value})}
                    rows={2} className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: BG.input, border: \`1px solid \${TX.border}\`, color: TX.text, resize: 'none' }} />
                </div>
              </div>
              <div className="p-5 flex gap-3" style={{ borderTop: \`1px solid \${TX.border}\`, background: BG.input }}>
                <button onClick={() => setEditingEvento(null)}
                  style={{ flex: 1, padding: '10px 0', background: 'transparent', border: \`1px solid \${TX.border}\`, borderRadius: 8, fontSize: 12, fontWeight: 600, color: TX.textSec, cursor: 'pointer' }}>
                  Annulla
                </button>
                <button onClick={() => deleteEvento(editingEvento.id)}
                  style={{ padding: '10px 16px', background: TH.red + '10', border: \`1px solid \${TH.red}30\`, borderRadius: 8, fontSize: 12, fontWeight: 700, color: TH.red, cursor: 'pointer' }}>
                  Elimina
                </button>
                <button onClick={() => updateEvento(editingEvento.id, {
                    titolo: editingEvento.titolo,
                    tipo: editingEvento.tipo,
                    data: editingEvento.data,
                    ora_inizio: editingEvento.ora_inizio,
                    durata_min: editingEvento.durata_min,
                    cliente_id: editingEvento.cliente_id || null,
                    commessa_id: editingEvento.commessa_id || null,
                    note: editingEvento.note || null,
                  })}
                  style={{ flex: 2, padding: '10px 0', background: AC, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
                  Salva Modifiche
                </button>
              </div>
            </div>
          </div>
        )}`;

if (!code.includes('MODAL MODIFICA EVENTO')) {
  // Find CalendarioContent closing - look for the component's return end
  // Strategy: find the last occurrence of timeline view closing, then insert before the next </div>
  const calContentSearch = 'const CalendarioContent';
  const calIdx = code.indexOf(calContentSearch);
  
  if (calIdx !== -1) {
    // Find "calView === 'timeline'" to locate the timeline section
    const timelineIdx = code.indexOf("calView === 'timeline'", calIdx);
    if (timelineIdx !== -1) {
      // From timeline, find the IIFE closing pattern `)()}` which closes the timeline view
      // Then find the next `</div>` which is the CalendarioContent return wrapper
      let searchFrom = timelineIdx;
      // Look for the pattern that closes the last calView section
      // Find multiple `)()}` patterns after timeline
      let lastIIFE = searchFrom;
      let pos = searchFrom;
      while (true) {
        const next = code.indexOf(')}', pos + 1);
        if (next === -1 || next > searchFrom + 5000) break;
        lastIIFE = next;
        pos = next + 1;
      }
      
      // Find the closing </div> of CalendarioContent's return
      // Look for pattern: newline + spaces + </div> + newline + spaces + ) + newline
      const closeDiv = code.indexOf('\n    </div>\n  )\n', timelineIdx);
      if (closeDiv !== -1) {
        code = code.slice(0, closeDiv) + '\n' + editModal + code.slice(closeDiv);
        changes++;
        console.log('✅ Modifica 3D: Modal modifica evento aggiunto');
      } else {
        // Alternative: find last </div> before CalendarioContent's closing
        // Look for the return ( ... ) pattern end
        const altClose = code.indexOf('\n      </div>\n    )\n', timelineIdx);
        if (altClose !== -1) {
          code = code.slice(0, altClose) + '\n' + editModal + code.slice(altClose);
          changes++;
          console.log('✅ Modifica 3D: Modal aggiunto (pattern alternativo)');
        } else {
          // Last resort: insert before the next component definition after CalendarioContent
          const nextComponent = code.indexOf('\n  // ====', timelineIdx + 100);
          if (nextComponent !== -1) {
            // Go back to find the closing of CalendarioContent
            const beforeNext = code.lastIndexOf('}\n', nextComponent);
            if (beforeNext !== -1) {
              // Insert the modal just before the closing of CalendarioContent return
              // Find the </div> + ) + } pattern
              let insertPoint = code.lastIndexOf('</div>', beforeNext);
              if (insertPoint !== -1) {
                code = code.slice(0, insertPoint) + editModal + '\n        ' + code.slice(insertPoint);
                changes++;
                console.log('✅ Modifica 3D: Modal aggiunto (terzo tentativo)');
              }
            }
          }
          if (!code.includes('MODAL MODIFICA EVENTO')) {
            console.log('⚠️  Non sono riuscito a posizionare il modal automaticamente.');
            console.log('    Dovrai aggiungerlo manualmente alla fine del CalendarioContent.');
          }
        }
      }
    }
  }
} else {
  console.log('ℹ️  Modifica 3D: Modal già presente, skip');
}

// ═══════════════════════════════════════════
// SALVA
// ═══════════════════════════════════════════
fs.writeFileSync(filePath, code, 'utf8');

console.log('\n================================================');
console.log(`✅ Patch completata! ${changes} modifiche applicate.`);
console.log('================================================');
console.log('\n📋 Prossimi passi:');
console.log('   1. Vai su http://localhost:3000');
console.log('   2. Apri Calendario');
console.log('   3. Crea un evento → Modifica → Elimina');
console.log('   4. Se funziona: git add . && git commit -m "Sessione 1" && git push');
console.log('\n⚠️  Se qualcosa non va, ripristina il backup:');
console.log('   copy src\\app\\page.tsx.backup-sessione1 src\\app\\page.tsx\n');
