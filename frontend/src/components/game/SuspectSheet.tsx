import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { CaseData, GameState, Suspect } from '../../game/types'
import { getSuspicionScore } from '../../game/engine'

interface Props {
  suspect: Suspect
  game: GameState
  caseData: CaseData
  onTalk: (suspectId: number) => void
  onTopic: (suspectId: number, topicIndex: number) => void
  onClose: () => void
}

export function SuspectSheet({ suspect, game, caseData, onTalk, onTopic, onClose }: Props) {
  const topicsDiscussed = game.suspectTopicsDiscussed[suspect.id] ?? []
  const suspicion = getSuspicionScore(suspect.id, game.foundClueIds, caseData)
  const hasSpoken = suspect.id in game.suspectTopicsDiscussed

  const availableTopics = suspect.topics.map((t, i) => ({
    ...t, index: i,
    locked: t.requiresClueId != null && !game.foundClueIds.includes(t.requiresClueId),
    done: topicsDiscussed.includes(i),
  }))

  const suspicionColor = suspicion > 60 ? 'var(--danger)' : suspicion > 30 ? '#f59e0b' : 'var(--success)'

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-40 rounded-t-2xl flex flex-col"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', maxHeight: '80vh' }}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1 shrink-0">
        <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border)' }} />
      </div>

      {/* Suspect header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{suspect.emoji}</span>
          <div>
            <p className="font-bold text-base" style={{ color: 'var(--text)' }}>{suspect.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{suspect.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {suspicion > 0 && (
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Suspicion</p>
              <p className="text-sm font-bold" style={{ color: suspicionColor }}>{suspicion}%</p>
            </div>
          )}
          <button onClick={onClose} style={{ color: 'var(--text-dim)' }}><X size={18} /></button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 px-4 py-4 space-y-4">
        {/* Approach button */}
        {!hasSpoken && (
          <button
            onClick={() => onTalk(suspect.id)}
            className="w-full py-3 rounded-xl text-sm font-semibold uppercase tracking-wider"
            style={{ background: 'var(--accent-dim)', color: '#fff' }}
          >
            Approach
          </button>
        )}

        {/* Topics */}
        {availableTopics.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>
              {hasSpoken ? 'Ask about' : 'Available topics after approaching'}
            </p>
            <div className="space-y-2">
              {availableTopics.map(t => (
                <button
                  key={t.index}
                  disabled={t.locked}
                  onClick={() => !t.locked && onTopic(suspect.id, t.index)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-opacity"
                  style={{
                    background: t.done ? 'rgba(52,211,153,0.06)' : 'var(--bg)',
                    border: `1px solid ${t.done ? 'rgba(52,211,153,0.3)' : t.locked ? 'transparent' : 'var(--border)'}`,
                    color: t.locked ? 'var(--text-dim)' : 'var(--text)',
                    opacity: t.locked ? 0.4 : 1,
                  }}
                >
                  <span className="mr-2">{t.done ? '✓' : t.locked ? '🔒' : '→'}</span>
                  {t.label}
                  {t.locked && <span className="ml-2 text-xs" style={{ color: 'var(--text-dim)' }}>(find more evidence first)</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {topicsDiscussed.length > 0 && (
          <p className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>
            {topicsDiscussed.length}/{suspect.topics.length} topics discussed
          </p>
        )}
      </div>
    </motion.div>
  )
}
