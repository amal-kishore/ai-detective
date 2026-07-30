import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../store/game';
import { Spinner } from '../components/ui/Spinner';
import { ArrowLeft, Send } from 'lucide-react';
import type { Clue } from '../game/types';

const HINTS = [
  'Inspect the body',
  'Go to the Library',
  'Search the room',
  'Show clues',
  'Help',
];

function ClueFlash({ clues }: { clues: Clue[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="px-4 py-2 text-xs flex flex-wrap gap-1.5 items-center"
      style={{
        background: 'rgba(34,211,238,0.07)',
        borderBottom: '1px solid rgba(34,211,238,0.2)',
      }}
    >
      <span style={{ color: 'var(--text-dim)' }}>New Evidence —</span>
      {clues.map((c) => (
        <span
          key={c.id}
          className="px-2 py-0.5 rounded"
          style={{
            background: 'rgba(34,211,238,0.12)',
            border: '1px solid rgba(34,211,238,0.3)',
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

    // Small delay so the UI updates before the engine runs synchronously
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(input);
  };

  const handleHint = (hint: string) => {
    submit(hint);
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={() => { reset(); navigate('/'); }}
          className="flex items-center gap-1.5 text-xs uppercase tracking-widest transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-dim)' }}
        >
          <ArrowLeft size={13} />
          Cases
        </button>

        <p className="text-xs font-semibold tracking-widest" style={{ color: 'var(--accent)' }}>
          {activeCase.title.toUpperCase()}
        </p>

        <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {collectedClues.length}/{activeCase.clues.length} clues · {game.actionCount} actions
        </div>
      </header>

      {/* Clue flash */}
      <AnimatePresence>
        {flashClues.length > 0 && <ClueFlash clues={flashClues} />}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {game.messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={`flex ${msg.role === 'player' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'player' ? (
              <div
                className="max-w-[75%] px-3 py-2 rounded text-sm"
                style={{ background: 'var(--accent-dim)', color: '#fff' }}
              >
                {msg.content}
              </div>
            ) : (
              <div
                className="max-w-xl text-sm leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--text)' }}
              >
                {msg.content}
              </div>
            )}
          </motion.div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <span style={{ color: 'var(--text-dim)' }}>
              <Spinner />
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Hint chips — shown only at the start */}
      {game.messages.length <= 1 && !isOver && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {HINTS.map((h) => (
            <button
              key={h}
              onClick={() => handleHint(h)}
              className="text-xs px-2 py-1 rounded transition-opacity hover:opacity-80"
              style={{ border: '1px solid var(--border)', color: 'var(--text-dim)' }}
            >
              {h}
            </button>
          ))}
        </div>
      )}

      {/* Game over bar */}
      {isOver && (
        <div
          className="px-4 py-4 text-center shrink-0"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: game.status === 'won' ? 'var(--success)' : 'var(--danger)' }}
          >
            {game.status === 'won' ? '— Case Closed —' : '— Investigation Failed —'}
          </p>
          {game.score != null && (
            <p className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}>
              Score: <span style={{ color: 'var(--accent)' }}>{game.score}</span>
            </p>
          )}
          <button
            onClick={() => { reset(); navigate('/'); }}
            className="px-6 py-2 rounded text-xs uppercase tracking-widest font-semibold"
            style={{ background: 'var(--accent-dim)', color: '#fff' }}
          >
            Back to Cases
          </button>
        </div>
      )}

      {/* Input */}
      {!isOver && (
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 px-4 py-3 shrink-0"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What do you do?"
            disabled={isProcessing}
            className="flex-1 px-3 py-2 rounded text-sm outline-none disabled:opacity-50"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
            autoFocus
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="px-3 py-2 rounded disabled:opacity-40 transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent-dim)', color: '#fff' }}
          >
            <Send size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
