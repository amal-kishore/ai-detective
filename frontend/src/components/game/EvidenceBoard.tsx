import { motion } from 'framer-motion'
import { X, BookOpen } from 'lucide-react'
import type { CaseData, GameState } from '../../game/types'

interface Props {
  game: GameState
  caseData: CaseData
  onClose: () => void
}

export function EvidenceBoard({ game, caseData, onClose }: Props) {
  const found = caseData.clues.filter(c => game.foundClueIds.includes(c.id))
  const missing = caseData.clues.length - found.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'var(--bg)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <BookOpen size={16} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Evidence Board</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{found.length}/{caseData.clues.length} found</span>
          <button onClick={onClose} style={{ color: 'var(--text-dim)' }}><X size={20} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Clue cards */}
        {found.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔎</p>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>No evidence collected yet.</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Inspect objects and interrogate suspects.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {found.map(clue => {
              const linked = caseData.suspects.filter(s => clue.linkedSuspectIds.includes(s.id))
              return (
                <div key={clue.id} className="rounded-lg p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--success)' }}>✓ {clue.name}</p>
                    <span className="text-xs shrink-0" style={{ color: 'var(--text-dim)' }}>Room {clue.roomId}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text)' }}>{clue.description}</p>
                  {linked.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs" style={{ color: 'var(--text-dim)' }}>Links to:</span>
                      {linked.map(s => (
                        <span key={s.id} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.3)', color: 'var(--accent)' }}>
                          {s.emoji} {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Notebook insights */}
        {game.notebookEntries.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>
              — Detective's Observations —
            </p>
            <div className="space-y-2">
              {game.notebookEntries.map((entry, i) => (
                <div key={i} className="rounded-lg p-3" style={{ background: 'rgba(192,132,252,0.06)', border: '1px solid rgba(192,132,252,0.2)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{entry}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {missing > 0 && (
          <p className="text-center text-xs" style={{ color: 'var(--text-dim)' }}>
            {missing} piece{missing !== 1 ? 's' : ''} of evidence still undiscovered.
          </p>
        )}

        {/* Timeline */}
        {caseData.timeline.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>
              — Known Timeline —
            </p>
            <div className="space-y-0">
              {caseData.timeline.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--accent-dim)' }} />
                    {i < caseData.timeline.length - 1 && (
                      <div className="w-px flex-1 mt-1" style={{ background: 'var(--border)' }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{event.time}</p>
                    <p className="text-sm leading-snug" style={{ color: 'var(--text)' }}>{event.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
