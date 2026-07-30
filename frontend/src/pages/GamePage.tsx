import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../store/game';
import { Spinner } from '../components/ui/Spinner';
import { ArrowLeft, Send, BookOpen } from 'lucide-react';
import type { Clue } from '../game/types';

function ClueFlash({ clues }: { clues: Clue[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="px-4 py-3 text-sm flex flex-wrap gap-2 items-center"
      style={{
        background: 'rgba(34,211,238,0.08)',
        borderBottom: '1px solid rgba(34,211,238,0.25)',
      }}
    >
      <span style={{ color: 'var(--text-dim)' }}>Evidence found —</span>
      {clues.map((c) => (
        <span
          key={c.id}
          className="px-2 py-0.5 rounded font-semibold"
          style={{
            background: 'rgba(34,211,238,0.12)',
            border: '1px solid rgba(34,211,238,0.35)',
            color: 'var(--success)',
          }}
        >
          ✓ {c.name}
        </span>
      ))}
    </motion.div>
  );
}

export function GamePage() {
  const { game, activeCase, sendAction, reset } = useGame();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashClues, setFlashClues] = useState<Clue[]>([]);
  const [collectedClues, setCollectedClues] = useState<Clue[]>([]);
  const [showClues, setShowClues] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!game || !activeCase) navigate('/');
  }, [game, activeCase, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [game?.messages]);

  if (!game || !activeCase) return null;

  const isOver = game.status !== 'active';

  const submit = (text: string) => {
    if (!text.trim() || isProcessing || isOver) return;
    setInput('');
    setIsProcessing(true);
    setTimeout(() => {
      const result = sendAction(text.trim());
      if (result.newClues.length > 0) {
        setCollectedClues((prev) => {
          const ids = new Set(prev.map((c) => c.id));
          return [...prev, ...result.newClues.filter((c) => !ids.has(c.id))];
        });
        setFlashClues(result.newClues);
        setTimeout(() => setFlashClues([]), 2500);
      }
      setIsProcessing(false);
    }, 80);
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: 'transparent' }}>

      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'rgba(12,10,8,0.85)', backdropFilter: 'blur(8px)' }}
      >
        <button
          onClick={() => { reset(); navigate('/'); }}
          className="flex items-center gap-1.5 text-sm uppercase tracking-wider py-1 pr-2"
          style={{ color: 'var(--text-dim)' }}
        >
          <ArrowLeft size={15} />
          Cases
        </button>

        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
          {activeCase.title}
        </p>

        <button
          onClick={() => setShowClues(!showClues)}
          className="flex items-center gap-1.5 text-sm py-1 pl-2"
          style={{ color: collectedClues.length > 0 ? 'var(--success)' : 'var(--text-dim)' }}
        >
          <BookOpen size={15} />
          <span className="text-xs">{collectedClues.length}/{activeCase.clues.length}</span>
        </button>
      </header>

      {/* Clue notebook panel */}
      <AnimatePresence>
        {showClues && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden shrink-0"
            style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
          >
            <div className="px-4 py-3 max-h-48 overflow-y-auto">
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>
                Evidence Collected
              </p>
              {collectedClues.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--text-dim)' }}>No evidence yet. Start investigating.</p>
              ) : (
                <div className="space-y-2">
                  {collectedClues.map((c) => (
                    <div key={c.id}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--success)' }}>✓ {c.name}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>{c.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clue flash banner */}
      <AnimatePresence>
        {flashClues.length > 0 && <ClueFlash clues={flashClues} />}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        {game.messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${msg.role === 'player' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'player' ? (
              <div
                className="max-w-[80%] px-4 py-3 rounded-lg text-base"
                style={{ background: 'var(--accent-dim)', color: '#fff' }}
              >
                {msg.content}
              </div>
            ) : (
              <div
                className="max-w-xl text-base leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--text)' }}
              >
                {msg.content}
              </div>
            )}
          </motion.div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <span style={{ color: 'var(--text-dim)' }}><Spinner /></span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Hint chips */}
      {game.messages.length <= 1 && !isOver && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
          {['Inspect the body', 'Go to the Library', 'Search the room', 'Show clues', 'Help'].map((h) => (
            <button
              key={h}
              onClick={() => submit(h)}
              className="text-sm px-3 py-1.5 rounded-full transition-opacity hover:opacity-80 active:opacity-60"
              style={{ border: '1px solid var(--border)', color: 'var(--text-dim)', background: 'var(--surface)' }}
            >
              {h}
            </button>
          ))}
        </div>
      )}

      {/* Game over */}
      {isOver && (
        <div
          className="px-5 py-5 text-center shrink-0"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <p
            className="text-base font-bold mb-1 tracking-wider"
            style={{ color: game.status === 'won' ? 'var(--success)' : 'var(--danger)' }}
          >
            {game.status === 'won' ? '— Case Closed —' : '— Investigation Failed —'}
          </p>
          {game.score != null && (
            <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
              Score: <span style={{ color: 'var(--accent)' }}>{game.score}</span>
            </p>
          )}
          <button
            onClick={() => { reset(); navigate('/'); }}
            className="px-8 py-3 rounded text-sm uppercase tracking-widest font-bold"
            style={{ background: 'var(--accent-dim)', color: '#fff' }}
          >
            Back to Cases
          </button>
        </div>
      )}

      {/* Input */}
      {!isOver && (
        <form
          onSubmit={(e) => { e.preventDefault(); submit(input); }}
          className="flex gap-2 px-4 py-3 shrink-0"
          style={{ borderTop: '1px solid var(--border)', background: 'rgba(12,10,8,0.9)' }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What do you do?"
            disabled={isProcessing}
            className="flex-1 px-4 py-3 rounded-lg text-base outline-none disabled:opacity-50"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontSize: '16px',
            }}
            autoFocus
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="px-4 py-3 rounded-lg disabled:opacity-40 transition-opacity hover:opacity-80 active:opacity-60"
            style={{ background: 'var(--accent-dim)', color: '#fff' }}
          >
            <Send size={18} />
          </button>
        </form>
      )}
    </div>
  );
}
