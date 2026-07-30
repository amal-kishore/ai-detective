import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'
import type { CaseData } from '../../game/types'

interface Props {
  caseData: CaseData
  wrongAccusations: number
  onAccuse: (suspectId: number) => void
  onClose: () => void
}

export function AccuseScreen({ caseData, wrongAccusations, onAccuse, onClose }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const remaining = 3 - wrongAccusations

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#080606' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 shrink-0">
        <div />
        <button onClick={onClose} style={{ color: 'var(--text-dim)' }}><X size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {/* Warning */}
        <div className="text-center mb-8">
          <p className="text-3xl mb-3">⚖️</p>
          <h2 className="text-xl font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--danger)' }}>
            Final Accusation
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-dim)' }}>
            Once submitted, the investigation ends.{'\n'}Choose carefully.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs" style={{ color: remaining <= 1 ? 'var(--danger)' : 'var(--text-dim)' }}>
            <AlertTriangle size={12} />
            <span>{remaining} wrong accusation{remaining !== 1 ? 's' : ''} remaining before case closed.</span>
          </div>
        </div>

        {/* Divider */}
        <div className="text-center text-xs tracking-widest mb-6" style={{ color: 'var(--border)' }}>
          ━━━━━━━━━━━━━━━━━━━━━━
        </div>

        {/* Suspect list */}
        <div className="space-y-3 mb-8">
          {caseData.suspects.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(selected === s.id ? null : s.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left"
              style={{
                background: selected === s.id ? 'rgba(248,113,113,0.12)' : 'var(--surface)',
                border: `1px solid ${selected === s.id ? 'var(--danger)' : 'var(--border)'}`,
              }}
            >
              <span className="text-2xl">{s.emoji}</span>
              <div className="flex-1">
                <p className="text-base font-semibold" style={{ color: 'var(--text)' }}>{s.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{s.role}</p>
              </div>
              {selected === s.id && (
                <span className="text-xs font-bold" style={{ color: 'var(--danger)' }}>SELECTED</span>
              )}
            </button>
          ))}
        </div>

        {/* Confirm button */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={() => onAccuse(selected)}
                className="w-full py-4 rounded-xl text-base font-bold uppercase tracking-widest"
                style={{ background: 'var(--danger)', color: '#fff' }}
              >
                Accuse {caseData.suspects.find(s => s.id === selected)?.name}
              </button>
              <button onClick={() => setSelected(null)} className="w-full py-3 text-sm mt-2" style={{ color: 'var(--text-dim)' }}>
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
