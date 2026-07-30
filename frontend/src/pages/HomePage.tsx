import { useNavigate } from 'react-router-dom';
import { useGame } from '../store/game';
import { DifficultyStars } from '../components/ui/DifficultyStars';
import { Clock, RotateCcw } from 'lucide-react';
import { loadGame } from '../game/storage';

export function HomePage() {
  const { allCases, startGame, resumeGame } = useGame();
  const navigate = useNavigate();

  const handleStart = (caseId: string) => {
    startGame(caseId);
    navigate('/play');
  };

  const handleResume = (caseId: string) => {
    resumeGame(caseId);
    navigate('/play');
  };

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <header className="text-center pt-14 pb-10 px-6">
        <p className="text-xs tracking-[0.5em] uppercase mb-3" style={{ color: 'var(--text-dim)' }}>
          ── CASE FILES ──
        </p>
        <h1 className="text-5xl font-bold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
          AI Detective
        </h1>
        <p className="text-sm mt-4 tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
          Solve the mystery. Find the truth.
        </p>
      </header>

      <main className="max-w-lg mx-auto px-5 pb-16">
        <p className="text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--text-dim)' }}>
          Active Cases
        </p>

        <div className="space-y-4">
          {allCases.map((c) => {
            const saved = loadGame(c.id);
            const hasSave = saved && saved.status === 'active';

            return (
              <div
                key={c.id}
                className="rounded-lg p-5"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                }}
              >
                <div
                  className="text-xs uppercase tracking-widest mb-2 pb-2"
                  style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}
                >
                  Case #{String(c.id).padStart(3, '0')}
                </div>

                <p className="font-bold text-lg mb-2 leading-snug" style={{ color: 'var(--text)' }}>
                  {c.title}
                </p>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                  {c.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DifficultyStars value={c.difficulty} />
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-dim)' }}>
                      <Clock size={12} />
                      {c.estimatedMinutes} min
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasSave && (
                      <button
                        onClick={() => handleResume(c.id)}
                        className="px-3 py-2 rounded text-xs uppercase tracking-wider flex items-center gap-1.5 transition-opacity hover:opacity-80 active:opacity-60"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-dim)' }}
                      >
                        <RotateCcw size={12} />
                        Resume
                      </button>
                    )}
                    <button
                      onClick={() => handleStart(c.id)}
                      className="px-5 py-2 rounded text-sm uppercase tracking-wider font-bold transition-opacity hover:opacity-80 active:opacity-60"
                      style={{ background: 'var(--accent-dim)', color: '#fff' }}
                    >
                      {hasSave ? 'Restart' : 'Investigate'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs mt-10" style={{ color: 'var(--text-dim)' }}>
          Progress saved automatically · Offline
        </p>
      </main>
    </div>
  );
}
