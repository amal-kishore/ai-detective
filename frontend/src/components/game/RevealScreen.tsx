import { motion } from 'framer-motion'
import type { CaseData, GameState } from '../../game/types'

interface Props {
  game: GameState
  caseData: CaseData
  onBack: () => void
}

export function RevealScreen({ game, caseData, onBack }: Props) {
  const won = game.status === 'won'
  const murderer = caseData.suspects[caseData.murdererIndex]
  const found = game.foundClueIds.length
  const total = caseData.clues.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 overflow-y-auto flex flex-col"
      style={{ background: '#080606' }}
    >
      <div className="flex-1 px-5 py-10 pb-20 max-w-lg mx-auto w-full">

        {/* Status */}
        <div className="text-center mb-10">
          <p className="text-4xl mb-4">{won ? '⚖️' : '🕯️'}</p>
          <h1
            className="text-2xl font-bold uppercase tracking-widest mb-2"
            style={{ color: won ? 'var(--success)' : 'var(--danger)' }}
          >
            {won ? 'Case Closed' : 'Investigation Failed'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
            {won ? 'You identified the killer.' : 'The killer walks free.'}
          </p>
        </div>

        {/* Murderer reveal */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: won ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)',
            border: `1px solid ${won ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`,
          }}
        >
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>
            The Killer
          </p>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{murderer.emoji}</span>
            <div>
              <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{murderer.name}</p>
              <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{murderer.role}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text)' }}>
            {caseData.solution.reveal}
          </p>
        </div>

        {/* Method */}
        <div className="mb-4 rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>How It Was Done</p>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text)' }}>
            {caseData.solution.method}
          </p>
        </div>

        {/* Motive */}
        <div className="mb-6 rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>The Motive</p>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text)' }}>
            {caseData.solution.motive}
          </p>
        </div>

        {/* Score */}
        {won && game.score != null && (
          <div
            className="rounded-xl p-4 mb-8 text-center"
            style={{ background: 'rgba(192,132,252,0.06)', border: '1px solid rgba(192,132,252,0.2)' }}
          >
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>Your Performance</p>
            <p className="text-4xl font-bold mb-3" style={{ color: 'var(--accent)' }}>{game.score}</p>
            <div className="flex justify-center gap-8 text-sm" style={{ color: 'var(--text-dim)' }}>
              <div>
                <p className="font-semibold" style={{ color: 'var(--text)' }}>{found}/{total}</p>
                <p className="text-xs">clues found</p>
              </div>
              <div>
                <p className="font-semibold" style={{ color: 'var(--text)' }}>{game.actionCount}</p>
                <p className="text-xs">actions taken</p>
              </div>
              <div>
                <p className="font-semibold" style={{ color: game.wrongAccusations > 0 ? 'var(--danger)' : 'var(--text)' }}>
                  {game.wrongAccusations}
                </p>
                <p className="text-xs">wrong accusations</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onBack}
          className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest"
          style={{ background: 'var(--accent-dim)', color: '#fff' }}
        >
          Back to Cases
        </button>
      </div>
    </motion.div>
  )
}
