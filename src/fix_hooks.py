#!/usr/bin/env python3
"""
FIX REACT HOOKS ORDERING - MASTRO ERP page.tsx
================================================
USO: python3 fix_hooks.py page.tsx
Produce: page_FIXED.tsx
"""
import sys, re, os

def find_return_block_end(lines, if_line_idx):
    total = len(lines)
    depth = 0
    tracking = False
    found_open = False
    for i in range(if_line_idx, total):
        line = lines[i]
        ret_pos = line.find('return')
        if ret_pos != -1 and not tracking:
            tracking = True
            substr = line[ret_pos + 6:]
            for ch in substr:
                if ch == '(':
                    depth += 1
                    found_open = True
                elif ch == ')':
                    depth -= 1
                    if depth == 0 and found_open:
                        return i
        elif tracking:
            for ch in line:
                if ch == '(':
                    depth += 1
                    found_open = True
                elif ch == ')':
                    depth -= 1
                    if depth == 0 and found_open:
                        return i
    return if_line_idx

def is_hook(line):
    s = line.strip()
    for p in [r'const\s+\[.*\]\s*=\s*useState', r'useState\s*[<(]', r'useEffect\s*\(',
              r'useCallback\s*\(', r'useMemo\s*\(', r'useRef\s*[<(]',
              r'const\s+\w+\s*=\s*useRef', r'const\s+\w+\s*=\s*useCallback', r'const\s+\w+\s*=\s*useMemo']:
        if re.search(p, s):
            return True
    return False

def count_hooks(lines, start, end):
    return sum(1 for i in range(start, min(end, len(lines))) if is_hook(lines[i]))

def fix(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.read().split('\n')
    N = len(lines)
    print(f"📄 File: {N} righe")

    # Find if (authLoading) return
    al_start = -1
    for i, l in enumerate(lines):
        if re.search(r'if\s*\(\s*authLoading\s*\)', l):
            al_start = i; break
    if al_start == -1:
        print("❌ 'if (authLoading)' non trovato"); return False
    al_end = find_return_block_end(lines, al_start)
    print(f"✅ if (authLoading): righe {al_start+1}–{al_end+1}")

    # Find if (!authUser) return
    au_start = -1
    for i in range(al_end + 1, N):
        if re.search(r'if\s*\(\s*!authUser\s*\)', lines[i]):
            au_start = i; break
    if au_start == -1:
        for i in range(al_end + 1, N):
            if re.search(r'if\s*\(\s*!(session|user)\s*\)', lines[i]):
                au_start = i; break
    if au_start == -1:
        print("❌ 'if (!authUser)' non trovato"); return False
    au_end = find_return_block_end(lines, au_start)
    print(f"✅ if (!authUser):   righe {au_start+1}–{au_end+1}")

    hb = count_hooks(lines, 0, al_start)
    ha = count_hooks(lines, au_end + 1, N)
    print(f"\n📊 Hooks prima dei returns: {hb}")
    print(f"📊 Hooks dopo i returns:   {ha}")
    if ha == 0:
        print("\n✅ File già corretto!"); return True
    print(f"\n⚠️  {ha} hooks dopo i returns → causa errore React")

    # Find insertion point: before 'if (loading)'
    ins = -1
    for i in range(au_end + 1, N):
        if re.search(r'if\s*\(\s*loading\s*\)', lines[i].strip()):
            ins = i; break
    if ins == -1:
        # fallback: after last hook
        for i in range(N - 1, au_end, -1):
            if is_hook(lines[i]):
                ins = i + 1; break
    if ins == -1:
        print("❌ Punto di inserimento non trovato"); return False
    print(f"📍 Inserimento: riga {ins+1}")

    # Extract early return block
    block = lines[al_start : au_end + 1]
    print(f"📦 Blocco: {len(block)} righe")

    # Rebuild
    out = []
    out.extend(lines[:al_start])
    out.append('  // [FIX] Auth guards spostati dopo gli hooks (vedi sotto)')
    out.append('')
    out.extend(lines[au_end + 1 : ins])
    out.append('')
    out.append('  // ═══ AUTH GUARDS (spostati qui per React Rules of Hooks) ═══')
    out.extend(block)
    out.append('')
    out.extend(lines[ins:])

    # Verify
    new_au = -1
    for i, l in enumerate(out):
        if re.search(r'if\s*\(\s*!authUser\s*\)', l):
            new_au = find_return_block_end(out, i); break
    remaining = count_hooks(out, new_au + 1 if new_au != -1 else 0, len(out))

    # Write
    name, ext = os.path.splitext(filepath)
    outpath = f"{name}_FIXED{ext}"
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))

    print(f"\n{'='*55}")
    print(f"✅ SALVATO: {outpath}")
    print(f"   Righe: {N} → {len(out)}")
    print(f"   Hooks totali: {count_hooks(out, 0, len(out))}")
    if remaining > 0:
        print(f"   ⚠️  {remaining} hooks ancora dopo returns - serve fix manuale")
    else:
        print(f"   ✅ VERIFICA OK: 0 hooks dopo i returns")
    print(f"{'='*55}")
    return True

if __name__ == '__main__':
    fp = sys.argv[1] if len(sys.argv) > 1 else None
    if not fp:
        for c in ['page.tsx', 'src/app/page.tsx', 'app/page.tsx']:
            if os.path.exists(c): fp = c; break
    if not fp or not os.path.exists(fp):
        print("USO: python3 fix_hooks.py page.tsx"); sys.exit(1)
    print("╔═══════════════════════════════════════════════════╗")
    print("║  FIX REACT HOOKS — MASTRO ERP                    ║")
    print("╚═══════════════════════════════════════════════════╝")
    fix(fp)
    print("\nPROSSIMI PASSI:")
    print("  1. Rinomina page_FIXED.tsx → page.tsx")
    print("  2. Deploy su Vercel")
    print("  3. Errore 'Rendered more hooks' risolto!")
