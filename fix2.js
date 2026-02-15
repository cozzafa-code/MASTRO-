const fs = require('fs');
let f = fs.readFileSync('src/app/page.tsx', 'utf8');
if (f.indexOf('Apri Configuratore') > -1) { console.log('Gia fatto!'); process.exit(0); }

// 1. Sostituisci toggle con bottone
var tm = '{/* View toggle: Progetto / Configuratore */}';
var ti = f.indexOf(tm);
if (ti < 0) { console.log('ERR toggle'); process.exit(1); }
var td1 = f.indexOf('<div', ti);
var td2 = f.indexOf('</div>', td1) + 6;
var btn = '<button onClick={() => setCommessaView("configuratore")} className="w-full py-3 rounded-xl text-sm font-semibold" style={{background:"linear-gradient(135deg,#5b9cf620,#34d39920)",border:"1px solid #5b9cf640",color:"#5b9cf6",cursor:"pointer"}}>Apri Configuratore Serramenti</button>';
f = f.slice(0, ti) + btn + f.slice(td2);
console.log('1. Bottone OK');

// 2. Overlay full-screen
var cm = '{/* ===== CONFIGURATORE SERRAMENTI ===== */}';
var ci = f.indexOf(cm);
if (ci < 0) { console.log('ERR conf'); process.exit(1); }
var cond = "{commessaView === 'configuratore' && (";
var condI = f.lastIndexOf(cond, ci);
var afterCond = condI + cond.length;
var ov = '\n<div style={{position:"fixed",inset:0,zIndex:9999,background:"#08090d",display:"flex",flexDirection:"column"}}>';
ov += '<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 16px",background:"#0d0f17",borderBottom:"1px solid #1a1e2e",minHeight:48}}>';
ov += '<button onClick={()=>setCommessaView("progetto")} style={{background:"#252a3d",color:"#8b90a8",border:"none",borderRadius:8,padding:"6px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>X Chiudi</button>';
ov += '<span style={{color:"#f5a623",fontSize:13,fontWeight:700}}>Configuratore Serramenti</span>';
ov += '<span style={{fontSize:11,color:"#5a5f75"}}>{serramenti.length} elementi</span>';
ov += '</div>';
ov += '<div style={{flex:1,overflow:"hidden"}}>\n';
f = f.slice(0, afterCond) + ov + f.slice(afterCond);
console.log('2. Overlay OK');

// 3. Grid piu grande
f = f.replace("gridTemplateColumns: '240px 1fr 320px'", "gridTemplateColumns: '220px 1fr 340px', height: '100%'");
console.log('3. Grid OK');

// 4. Chiudi overlay
var vp = '{/* ===== VISTA PROGETTO ===== */}';
var vi = f.indexOf(vp);
var cl = f.lastIndexOf(')}', vi);
f = f.slice(0, cl) + '</div></div>\n' + f.slice(cl);
console.log('4. Chiusura OK');

fs.writeFileSync('src/app/page.tsx', f);
console.log('\nTUTTO OK! Ricarica localhost:3002');
