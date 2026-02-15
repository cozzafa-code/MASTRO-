const fs = require('fs');

// Leggi il file
const f = fs.readFileSync('src/app/page.tsx', 'utf8');
const L = f.split('\n');
console.log('Righe totali:', L.length);

// Trova fine blocco return (traccia parentesi)
function findEnd(lines, start) {
  let depth = 0;
  let started = false;
  for (let i = start; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      const c = lines[i][j];
      if (c === '(') { depth++; started = true; }
      else if (c === ')') { depth--; if (started && depth === 0) return i; }
    }
  }
  return start;
}

// Trova if (authLoading) return
let s1 = -1;
for (let i = 0; i < L.length; i++) {
  if (L[i].includes('authLoading') && L[i].includes('return')) { s1 = i; break; }
}
if (s1 < 0) { console.log('ERROR: authLoading non trovato'); process.exit(1); }
let e1 = findEnd(L, s1);
console.log('if (authLoading): riga', s1 + 1, '-', e1 + 1, '(' + (e1 - s1 + 1) + ' righe)');

// Trova if (!authUser) return
let s2 = -1;
for (let i = e1 + 1; i < L.length; i++) {
  if (L[i].includes('!authUser') && L[i].includes('return')) { s2 = i; break; }
}
if (s2 < 0) {
  // prova senza 'return' sulla stessa riga
  for (let i = e1 + 1; i < L.length; i++) {
    if (L[i].includes('!authUser')) { s2 = i; break; }
  }
}
if (s2 < 0) { console.log('ERROR: !authUser non trovato'); process.exit(1); }
let e2 = findEnd(L, s2);
console.log('if (!authUser):   riga', s2 + 1, '-', e2 + 1, '(' + (e2 - s2 + 1) + ' righe)');

// Trova punto inserimento: if (loading)
let ins = -1;
for (let i = e2 + 1; i < L.length; i++) {
  if (/if\s*\(\s*loading\s*\)/.test(L[i])) { ins = i; break; }
}
if (ins < 0) {
  console.log('WARN: if (loading) non trovato, cerco ultimo hook...');
  for (let i = L.length - 1; i > e2; i--) {
    if (/useState|useEffect|useCallback|useMemo|useRef/.test(L[i])) { ins = i + 1; break; }
  }
}
if (ins < 0) { console.log('ERROR: punto inserimento non trovato'); process.exit(1); }
console.log('Punto inserimento: riga', ins + 1);

// Conta hooks prima e dopo
let hooksBefore = 0, hooksAfter = 0;
for (let i = 0; i < s1; i++) if (/useState|useEffect|useCallback|useMemo|useRef/.test(L[i])) hooksBefore++;
for (let i = e2 + 1; i < L.length; i++) if (/useState|useEffect|useCallback|useMemo|useRef/.test(L[i])) hooksAfter++;
console.log('Hooks prima dei returns:', hooksBefore);
console.log('Hooks dopo i returns:', hooksAfter);

// Estrai blocco
const block = L.slice(s1, e2 + 1);
console.log('Blocco da spostare:', block.length, 'righe');

// Ricostruisci
const out = [
  ...L.slice(0, s1),
  '  // [FIX] Auth guards spostati dopo tutti gli hooks (vedi sotto)',
  '',
  ...L.slice(e2 + 1, ins),
  '',
  '  // ======= AUTH GUARDS (spostati qui per React Rules of Hooks) =======',
  ...block,
  '',
  ...L.slice(ins)
];

// Salva
fs.writeFileSync('src/app/page_FIXED.tsx', out.join('\n'));
console.log('');
console.log('='.repeat(50));
console.log('SALVATO: src/app/page_FIXED.tsx');
console.log('Righe:', L.length, '->', out.length);
console.log('='.repeat(50));
console.log('');
console.log('PROSSIMI PASSI:');
console.log('  1. Apri page_FIXED.tsx e verifica');
console.log('  2. copy src\\app\\page.tsx src\\app\\page_BACKUP2.tsx');
console.log('  3. copy src\\app\\page_FIXED.tsx src\\app\\page.tsx');
console.log('  4. npm run dev');
