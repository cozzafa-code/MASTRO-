const fs = require('fs');
let f = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Aggiungi useState per devLicenza
f = f.replace(
  "const userLicenza = profilo?.licenza || 'BASE'",
  "const [devLicenza, setDevLicenza] = useState<string | null>(null)\n  const userLicenza = devLicenza || profilo?.licenza || 'BASE'"
);

// 2. Aggiungi toolbar prima di </>
let L = f.split('\n');
let pos = -1;
for (let i = L.length - 1; i > 0; i--) {
  if (L[i].trim() === '</>') { pos = i; break; }
}

const tb = [
  '      {/* DEV TOOLBAR */}',
  '      <div style={{ position: "fixed", bottom: 12, right: 12, zIndex: 99999, background: "#1a1a2e", borderRadius: 12, padding: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.5)", maxWidth: 320, fontSize: 11 }}>',
  '        <div style={{ color: "#fff", fontWeight: 700, marginBottom: 6 }}>DEV TOOLBAR</div>',
  '        <div style={{ color: "#aaa", marginBottom: 4 }}>Licenza: <span style={{ color: "#0f0" }}>{userLicenza}</span></div>',
  '        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>',
  '          {Object.keys(licenzaConfig).map(k => (',
  '            <button key={k} onClick={() => setDevLicenza(k)} style={{ padding: "3px 8px", borderRadius: 6, border: k === userLicenza ? "2px solid #0f0" : "1px solid #444", background: k === userLicenza ? "#0f03" : "#333", color: "#fff", cursor: "pointer", fontSize: 10 }}>{k}</button>',
  '          ))}',
  '        </div>',
  '        <div style={{ color: "#aaa", fontSize: 10 }}>Tabs: {allowedTabs.join(", ")}</div>',
  '      </div>',
];

L.splice(pos, 0, ...tb);
fs.writeFileSync('src/app/page.tsx', L.join('\n'));
console.log('TUTTO FATTO! Righe:', L.length);