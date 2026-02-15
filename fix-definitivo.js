// MASTRO — Fix DEFINITIVO Sessione 1
// Uso: node fix-definitivo.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'page.tsx');

console.log('\n🔧 MASTRO — Fix DEFINITIVO Sessione 1\n');

if (!fs.existsSync(filePath)) {
  console.log('❌ File non trovato: ' + filePath);
  process.exit(1);
}

// Backup
const backup2 = filePath + '.backup-pre-fix';
fs.copyFileSync(filePath, backup2);
console.log('✅ Backup: page.tsx.backup-pre-fix');

let code = fs.readFileSync(filePath, 'utf8');
let fixes = 0;

// ═══════════════════════════════════════════
// FIX 1: Replace ALL select with clienti join
// Pattern: .select('*, cliente:clienti(*)') → .select('*')
// ═══════════════════════════════════════════
const patterns = [
  { find: ".select('*, cliente:clienti(*)')", replace: ".select('*')" },
  { find: '.select("*, cliente:clienti(*)")', replace: ".select('*')" },
];

for (const p of patterns) {
  while (code.includes(p.find)) {
    code = code.replace(p.find, p.replace);
    fixes++;
  }
}
console.log(`✅ FIX 1: ${fixes} select JOIN rimossi`);

// ═══════════════════════════════════════════
// FIX 2: Add editingEvento state
// ═══════════════════════════════════════════
if (!code.includes('editingEvento')) {
  const stateSearch = 'const [showNewEvento, setShowNewEvento]';
  const stateIdx = code.indexOf(stateSearch);
  if (stateIdx !== -1) {
    const lineEnd = code.indexOf('\n', stateIdx);
    code = code.slice(0, lineEnd + 1) + '  const [editingEvento, setEditingEvento] = useState<any>(null)\n' + code.slice(lineEnd + 1);
    fixes++;
    console.log('✅ FIX 2: State editingEvento aggiunto');
  }
} else {
  console.log('ℹ️  FIX 2: editingEvento già presente');
}

// ═══════════════════════════════════════════
// FIX 3: Add updateEvento and deleteEvento functions
// ═══════════════════════════════════════════
if (!code.includes('async function updateEvento')) {
  const createIdx = code.indexOf('async function createEvento()');
  if (createIdx !== -1) {
    let braceCount = 0, started = false, endIdx = createIdx;
    for (let i = createIdx; i < code.length; i++) {
      if (code[i] === '{') { braceCount++; started = true; }
      if (code[i] === '}') { braceCount--; }
      if (started && braceCount === 0) { endIdx = i + 1; break; }
    }
    const newFuncs = `

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
    code = code.slice(0, endIdx) + newFuncs + code.slice(endIdx);
    fixes++;
    console.log('✅ FIX 3: Funzioni updateEvento + deleteEvento aggiunte');
  }
} else {
  console.log('ℹ️  FIX 3: Funzioni già presenti');
}

// ═══════════════════════════════════════════
// FIX 4: Add edit/delete buttons in event cards
// ═══════════════════════════════════════════

// 4A: Vista Oggi - find the durata_min pattern
const durataPattern = "{e.ora_inizio} · {e.durata_min}min";
const buttonsCode = `
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

if (!code.includes('setEditingEvento')) {
  // Find first occurrence of durata pattern
  let idx = code.indexOf(durataPattern);
  if (idx !== -1) {
    // Find the closing </div> after this
    const closeDiv = code.indexOf('</div>', idx + durataPattern.length);
    if (closeDiv !== -1) {
      code = code.slice(0, closeDiv) + buttonsCode + '\n                              ' + code.slice(closeDiv);
      fixes++;
      console.log('✅ FIX 4A: Bottoni edit/delete in Vista Oggi');
    }
  }
}

// ═══════════════════════════════════════════
// FIX 5: Add edit modal in CalendarioContent
// ═══════════════════════════════════════════
if (!code.includes('MODAL MODIFICA EVENTO')) {
  // Find CalendarioContent's return closing
  // Strategy: find "const CalendarioContent" then find the timeline view
  // and insert before the component's closing
  
  const calContentIdx = code.indexOf('const CalendarioContent');
  if (calContentIdx !== -1) {
    // Find the LAST `)()}` pattern before the next component definition
    // Look for the next "const XXXContent" or "// ===" after CalendarioContent
    let nextComp = code.indexOf('\n  // ==========', calContentIdx + 30);
    // Find the pattern where CalendarioContent returns
    // We need to find the last </div> before the next component
    
    if (nextComp !== -1) {
      // Go backwards from nextComp to find closing pattern
      // The component ends with:  </div>\n  )\n}\n
      // Let's find the "}\n" before nextComp that closes CalendarioContent
      let searchBack = nextComp - 1;
      while (searchBack > calContentIdx && code[searchBack] !== '}') {
        searchBack--;
      }
      // Now find the </div> before this }
      let divClose = code.lastIndexOf('</div>', searchBack);
      if (divClose !== -1 && divClose > calContentIdx) {
        const modal = `
        {/* ═══ MODAL MODIFICA EVENTO ═══ */}
        {editingEvento && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setEditingEvento(null)}>
            <div className="rounded-xl" style={{ width: 520, background: BG.card, boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.4)' : TH.shadowMd, overflow: 'hidden' }}
              onClick={(ev) => ev.stopPropagation()}>
              <div className="p-5" style={{ borderBottom: \`1px solid \${TX.border}\` }}>
                <div className="flex items-center justify-between">
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: TX.text }}>Modifica Evento</h3>
                  <button onClick={() => setEditingEvento(null)}
                    style={{ background: BG.input, border: \`1px solid \${TX.border}\`, borderRadius: 8, padding: 6, cursor: 'pointer' }}>
                    <Ic n="x" s={14} c={TX.textMuted}/>
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label style={{ fontSize: 10, color: TX.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 4 }}>Titolo</label>
                  <input value={editingEvento.titolo || ''} onChange={(ev) => setEditingEvento((prev: any) => ({...prev, titolo: ev.target.value}))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: BG.input, border: \`1px solid \${TX.border}\`, color: TX.text }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={{ fontSize: 10, color: TX.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 4 }}>Tipo</label>
                    <select value={editingEvento.tipo || 'altro'} onChange={(ev) => setEditingEvento((prev: any) => ({...prev, tipo: ev.target.value}))}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: BG.input, border: \`1px solid \${TX.border}\`, color: TX.text }}>
                      {['sopralluogo','misure','scadenza','posa','consegna','riunione','altro'].map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: TX.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 4 }}>Data</label>
                    <input type="date" value={editingEvento.data || ''} onChange={(ev) => setEditingEvento((prev: any) => ({...prev, data: ev.target.value}))}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: BG.input, border: \`1px solid \${TX.border}\`, color: TX.text }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={{ fontSize: 10, color: TX.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 4 }}>Ora inizio</label>
                    <input type="time" value={editingEvento.ora_inizio || ''} onChange={(ev) => setEditingEvento((prev: any) => ({...prev, ora_inizio: ev.target.value}))}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: BG.input, border: \`1px solid \${TX.border}\`, color: TX.text }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: TX.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 4 }}>Durata (min)</label>
                    <input type="number" value={editingEvento.durata_min || 60} onChange={(ev) => setEditingEvento((prev: any) => ({...prev, durata_min: parseInt(ev.target.value) || 60}))}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: BG.input, border: \`1px solid \${TX.border}\`, color: TX.text }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: TX.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 4 }}>Note</label>
                  <textarea value={editingEvento.note || ''} onChange={(ev) => setEditingEvento((prev: any) => ({...prev, note: ev.target.value}))}
                    rows={2} className="w-full px-3 py-2 rounded-lg text-sm outline-none"
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
                    titolo: editingEvento.titolo, tipo: editingEvento.tipo, data: editingEvento.data,
                    ora_inizio: editingEvento.ora_inizio, durata_min: editingEvento.durata_min,
                    cliente_id: editingEvento.cliente_id || null, commessa_id: editingEvento.commessa_id || null,
                    note: editingEvento.note || null,
                  })}
                  style={{ flex: 2, padding: '10px 0', background: AC, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
                  Salva Modifiche
                </button>
              </div>
            </div>
          </div>
        )}
`;
        code = code.slice(0, divClose) + modal + '\n        ' + code.slice(divClose);
        fixes++;
        console.log('✅ FIX 5: Modal modifica evento aggiunto');
      }
    }
  }
} else {
  console.log('ℹ️  FIX 5: Modal già presente');
}

// ═══════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════
fs.writeFileSync(filePath, code, 'utf8');

console.log(`\n✅ TOTALE: ${fixes} fix applicati!`);
console.log('\nOra fai:');
console.log('  npm run dev');
console.log('  Poi vai su localhost (la porta che dice il terminale)');
console.log('  Calendario → + Evento → Salva\n');
