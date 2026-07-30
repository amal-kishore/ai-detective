import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/game'
import { ArrowLeft, BookOpen, Target, ChevronDown, ChevronUp, Keyboard } from 'lucide-react'
import { EvidenceBoard } from '../components/game/EvidenceBoard'
import { AccuseScreen } from '../components/game/AccuseScreen'
import { SuspectSheet } from '../components/game/SuspectSheet'
import { RevealScreen } from '../components/game/RevealScreen'
import type { Suspect, Clue } from '../game/types'
import { Spinner } from '../components/ui/Spinner'

export function GamePage() {
  const { game, activeCase, dispatch, reset } = useGame()
  const navigate = useNavigate()

  const [narrative, setNarrative] = useState<string>('')
  const [flashClues, setFlashClues] = useState<Clue[]>([])
  const [flashInsights, setFlashInsights] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)
  const [showEvidence, setShowEvidence] = useState(false)
  const [showAccuse, setShowAccuse] = useState(false)
  const [activeSuspect, setActiveSuspect] = useState<Suspect | null>(null)
  const [showAllRooms, setShowAllRooms] = useState(false)
  const [showTypeInput, setShowTypeInput] = useState(false)
  const [typeText, setTypeText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (!game || !activeCase) navigate('/') }, [game, activeCase, navigate])
  useEffect(() => { if (game && narrative === '') setNarrative(activeCase?.openingScene ?? '') }, [game])

  if (!game || !activeCase) return null

  const isOver = game.status !== 'active'
  const currentRoom = activeCase.rooms.find(r => r.id === game.currentRoomId)
  const unlockedRooms = activeCase.rooms.filter(r => game.unlockedRoomIds.includes(r.id))
  const lockedRooms = activeCase.rooms.filter(r => !game.unlockedRoomIds.includes(r.id))

  const run = (action: Parameters<typeof dispatch>[0]) => {
    if (processing || isOver) return
    setProcessing(true)
    setTimeout(() => {
      const result = dispatch(action)
      setNarrative(result.text)
      if (result.newClues.length > 0) {
        setFlashClues(result.newClues)
        setTimeout(() => setFlashClues([]), 2500)
      }
      if (result.newInsights.length > 0) {
        setFlashInsights(result.newInsights)
        setTimeout(() => setFlashInsights([]), 8000)
      }
      setProcessing(false)
    }, 60)
  }

  const handleNavigate = (roomId: number) => {
    setActiveSuspect(null)
    run({ type: 'navigate', roomId })
  }
  const handleInspect = (roomId: number, inspectIndex: number) => run({ type: 'inspect', roomId, inspectIndex })
  const handleSearch = () => { if (currentRoom) run({ type: 'search', roomId: currentRoom.id }) }
  const handleTalk = (suspectId: number) => run({ type: 'talk', suspectId })
  const handleTopic = (suspectId: number, topicIndex: number) => run({ type: 'topic', suspectId, topicIndex })
  const handleAccuse = (suspectId: number) => { setShowAccuse(false); run({ type: 'accuse', suspectId }) }
  const handleFreeText = () => {
    if (!typeText.trim()) return
    run({ type: 'freeText', text: typeText.trim() })
    setTypeText('')
    setShowTypeInput(false)
  }

  const foundCount = game.foundClueIds.length
  const totalClues = activeCase.clues.length

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 py-3 shrink-0 sticky top-0 z-30"
        style={{ background: 'rgba(13,11,9,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => { reset(); navigate('/') }}
          className="flex items-center gap-1.5 text-sm py-1 pr-2" style={{ color: 'var(--text-dim)' }}>
          <ArrowLeft size={15} /> Cases
        </button>
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
          {activeCase.title}
        </p>
        <button onClick={() => setShowEvidence(true)}
          className="flex items-center gap-1.5 py-1 pl-2"
          style={{ color: foundCount > 0 ? 'var(--success)' : 'var(--text-dim)' }}>
          <BookOpen size={15} />
          <span className="text-xs font-semibold">{foundCount}/{totalClues}</span>
        </button>
      </header>

      {/* ── Flash banners ── */}
      <AnimatePresence>
        {flashClues.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2 shrink-0" style={{ background: 'rgba(52,211,153,0.08)', borderBottom: '1px solid rgba(52,211,153,0.2)' }}>
            <p className="text-sm" style={{ color: 'var(--success)' }}>
              ✓ Evidence found: {flashClues.map(c => c.name).join(', ')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {flashInsights.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2 shrink-0" style={{ background: 'rgba(192,132,252,0.08)', borderBottom: '1px solid rgba(192,132,252,0.25)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent)' }}>🔍 New observation</p>
            {flashInsights.map((ins, i) => <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{ins}</p>)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scrollable content ── */}
      <div className="flex-1 pb-32">

        {/* Narrative card */}
        <div className="mx-4 mt-4 rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {processing
            ? <div className="flex items-center gap-2"><Spinner /><span className="text-sm" style={{ color: 'var(--text-dim)' }}>...</span></div>
            : <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: 'var(--text)' }}>{narrative}</p>
          }
        </div>

        {/* ── Current room section ── */}
        {currentRoom ? (
          <div className="mx-4 mt-5">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>Current Location</p>
            <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--accent-dim)' }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentRoom.emoji}</span>
                  <p className="font-bold text-base" style={{ color: 'var(--text)' }}>{currentRoom.name}</p>
                </div>
                <button onClick={handleSearch} disabled={processing}
                  className="text-xs px-3 py-1.5 rounded-lg uppercase tracking-wide"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-dim)' }}>
                  Search
                </button>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{currentRoom.tagline}</p>
            </div>

            {/* Inspect buttons */}
            {currentRoom.inspectables.length > 0 && (
              <div className="mt-3">
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>Inspect</p>
                <div className="grid grid-cols-2 gap-2">
                  {currentRoom.inspectables.map((obj, i) => {
                    const key = `${currentRoom.id}-${i}`
                    const done = game.inspectedObjects.includes(key)
                    const revealed = obj.revealsClueId != null && game.foundClueIds.includes(obj.revealsClueId)
                    return (
                      <button key={i} onClick={() => handleInspect(currentRoom.id, i)} disabled={processing}
                        className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm text-left transition-opacity active:opacity-60"
                        style={{
                          background: done ? 'rgba(52,211,153,0.06)' : 'var(--bg)',
                          border: `1px solid ${revealed ? 'rgba(52,211,153,0.4)' : done ? 'rgba(52,211,153,0.2)' : 'var(--border)'}`,
                          color: done ? 'var(--text-dim)' : 'var(--text)',
                        }}>
                        <span className="text-lg">{obj.emoji}</span>
                        <span className="text-sm leading-tight">{obj.label}</span>
                        {revealed && <span className="ml-auto text-xs" style={{ color: 'var(--success)' }}>✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-4 mt-4 rounded-xl p-4 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-2xl mb-2">📍</p>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>You are at the entrance.</p>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Tap a room below to begin your investigation.</p>
          </div>
        )}

        {/* ── Room navigation ── */}
        <div className="mx-4 mt-5">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>Rooms</p>
          <div className="grid grid-cols-2 gap-2">
            {(showAllRooms ? unlockedRooms : unlockedRooms.slice(0, 4)).map(room => {
              const isCurrent = room.id === game.currentRoomId
              const visited = game.visitedRoomIds.includes(room.id)
              return (
                <button key={room.id} onClick={() => handleNavigate(room.id)} disabled={processing || isCurrent}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm text-left transition-opacity active:opacity-60"
                  style={{
                    background: isCurrent ? 'rgba(124,58,237,0.15)' : 'var(--surface)',
                    border: `1px solid ${isCurrent ? 'var(--accent-dim)' : 'var(--border)'}`,
                    color: isCurrent ? 'var(--accent)' : visited ? 'var(--text)' : 'var(--text-dim)',
                    opacity: isCurrent ? 1 : processing ? 0.6 : 1,
                  }}>
                  <span className="text-lg">{room.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm leading-tight">{room.name}</p>
                    {isCurrent && <p className="text-xs" style={{ color: 'var(--accent)' }}>● here</p>}
                    {!isCurrent && visited && <p className="text-xs" style={{ color: 'var(--text-dim)' }}>visited</p>}
                  </div>
                </button>
              )
            })}
          </div>

          {unlockedRooms.length > 4 && (
            <button onClick={() => setShowAllRooms(v => !v)} className="w-full mt-2 py-2 flex items-center justify-center gap-1 text-xs"
              style={{ color: 'var(--text-dim)' }}>
              {showAllRooms ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show all {unlockedRooms.length} rooms</>}
            </button>
          )}

          {lockedRooms.length > 0 && (
            <div className="mt-2 space-y-1">
              {lockedRooms.map(room => (
                <div key={room.id} className="flex items-center gap-2 px-3 py-2 rounded-xl opacity-40"
                  style={{ border: '1px solid var(--border)' }}>
                  <span>🔒</span>
                  <span className="text-sm" style={{ color: 'var(--text-dim)' }}>{room.name}</span>
                  <span className="text-xs ml-auto" style={{ color: 'var(--text-dim)' }}>locked</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Suspects ── */}
        <div className="mt-5">
          <p className="text-xs uppercase tracking-widest mb-2 px-4" style={{ color: 'var(--text-dim)' }}>Suspects</p>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
            {activeCase.suspects.map(suspect => {
              const discussed = game.suspectTopicsDiscussed[suspect.id]
              const topicCount = discussed?.length ?? 0
              const totalTopics = suspect.topics.length
              return (
                <button key={suspect.id} onClick={() => setActiveSuspect(suspect)}
                  className="flex-shrink-0 flex flex-col items-center p-3 rounded-xl w-24 transition-opacity active:opacity-60"
                  style={{ background: 'var(--surface)', border: `1px solid ${activeSuspect?.id === suspect.id ? 'var(--accent)' : 'var(--border)'}` }}>
                  <span className="text-2xl mb-1">{suspect.emoji}</span>
                  <p className="text-xs font-semibold text-center leading-tight" style={{ color: 'var(--text)' }}>
                    {suspect.name.split(' ')[0]}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                    {topicCount}/{totalTopics}
                  </p>
                  {topicCount === totalTopics && totalTopics > 0 && (
                    <span className="text-xs mt-0.5" style={{ color: 'var(--success)' }}>✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

      </div>

      {/* ── Fixed bottom bar ── */}
      {!isOver && (
        <div className="fixed bottom-0 inset-x-0 z-20 px-4 pb-5 pt-3"
          style={{ background: 'rgba(13,11,9,0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--border)' }}>
          <AnimatePresence>
            {showTypeInput && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="flex gap-2 mb-3">
                <input ref={inputRef} value={typeText} onChange={e => setTypeText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleFreeText()}
                  placeholder="Type any action..."
                  className="flex-1 px-3 py-2 rounded-lg text-base outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '16px' }}
                  autoFocus />
                <button onClick={handleFreeText} disabled={!typeText.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40"
                  style={{ background: 'var(--accent-dim)', color: '#fff' }}>
                  Go
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex gap-3">
            <button onClick={() => { setShowTypeInput(v => !v); setTimeout(() => inputRef.current?.focus(), 100) }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm flex-1"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-dim)' }}>
              <Keyboard size={16} />
              <span>Type freely</span>
            </button>
            <button onClick={() => setShowAccuse(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider"
              style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.4)', color: 'var(--danger)' }}>
              <Target size={16} />
              Accuse
            </button>
          </div>
        </div>
      )}

      {/* ── Overlays ── */}
      <AnimatePresence>
        {isOver && <RevealScreen game={game} caseData={activeCase} onBack={() => { reset(); navigate('/') }} />}
      </AnimatePresence>
      <AnimatePresence>
        {showEvidence && <EvidenceBoard game={game} caseData={activeCase} onClose={() => setShowEvidence(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showAccuse && <AccuseScreen caseData={activeCase} wrongAccusations={game.wrongAccusations} onAccuse={handleAccuse} onClose={() => setShowAccuse(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {activeSuspect && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-30" style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setActiveSuspect(null)} />
            <SuspectSheet suspect={activeSuspect} game={game} caseData={activeCase}
              onTalk={id => { handleTalk(id); }}
              onTopic={(id, idx) => { handleTopic(id, idx); }}
              onClose={() => setActiveSuspect(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
