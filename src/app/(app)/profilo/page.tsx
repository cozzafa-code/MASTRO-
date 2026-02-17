'use client';

import { useApp } from '@/lib/store';
import { getInitials } from '@/types/database';

export default function ProfiloPage() {
  const { currentUser, team } = useApp();

  return (
    <div className="px-5 animate-fade-in">
      <div className="pt-4 pb-2">
        <div className="text-[11px] text-accent font-semibold tracking-[2px] uppercase flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-accent" style={{ boxShadow: '0 0 8px var(--accent)' }} />
          PROFILO
        </div>
      </div>

      <div className="bg-surface rounded-[14px] p-6 border border-border mb-5 text-center">
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3"
          style={{ background: currentUser.avatar_color }}
        >
          {getInitials(currentUser.nome, currentUser.cognome)}
        </div>
        <div className="text-xl font-bold">{currentUser.nome} {currentUser.cognome}</div>
        <div className="text-sm text-text-muted mt-1 capitalize">{currentUser.ruolo}</div>
      </div>

      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Team</h3>
      {team.map(m => (
        <div
          key={m.id}
          className="bg-surface rounded-[10px] p-3 border border-border mb-2 flex items-center gap-3"
          style={{ opacity: m.id === currentUser.id ? 1 : 0.7 }}
        >
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
            style={{ background: m.avatar_color }}
          >
            {getInitials(m.nome, m.cognome)}
          </div>
          <div>
            <div className="text-sm font-semibold">
              {m.nome} {m.cognome}{' '}
              {m.id === currentUser.id && <span className="text-[11px] text-accent">(tu)</span>}
            </div>
            <div className="text-xs text-text-muted capitalize">{m.ruolo}</div>
          </div>
        </div>
      ))}

      <div className="mt-5">
        <button className="w-full py-3.5 bg-surface border border-border rounded-[10px] text-text-muted text-sm font-semibold cursor-pointer mb-2" style={{ fontFamily: 'inherit' }}>
          ⚙️ Impostazioni
        </button>
        <button className="w-full py-3.5 bg-surface rounded-[10px] text-danger text-sm font-semibold cursor-pointer" style={{ fontFamily: 'inherit', border: '1px solid rgba(231,76,60,0.2)' }}>
          Esci
        </button>
      </div>
    </div>
  );
}
