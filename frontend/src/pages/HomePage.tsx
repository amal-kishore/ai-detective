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
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="text-center pt-12 pb-8 px-6">
        <h1 className="text-5xl font-bold tracking-tight" style={{ color: 'var(--accent)' }}>
          AI DETECTIVE
        </h1>
        <p className="text-xs mt-3 tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
          Interactive Detective Mysteries
        </p>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-12">
        <p className="text-xs uppercase tracking-widest mb-6 text-center" style={{ color: 'var(--text-dim)' }}>
          Choose Your Investigation
        </p>

        <div className="space-y-4">
          {allCases.map((c) => {
            const saved = loadGame(c.id);
            const hasSave = saved && saved.status === 'active';

            return (
              <div
                key={c.id}
                className="p-5 rounded-lg"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{c.title}</p>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-dim)' }}>{c.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DifficultyStars value={c.difficulty} />
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-dim)' }}>
                      <Clock size={11} />
                      {c.estimatedMinutes} min
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasSave && (
                      <button
                        onClick={() => handleResume(c.id)}
                        className="px-3 py-1.5 rounded text-xs uppercase tracking-widest flex items-center gap-1.5 transition-opacity hover:opacity-80"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-dim)' }}
                      >
                        <RotateCcw size={11} />
                        Resume
                      </button>
                    )}
                    <button
                      onClick={() => handleStart(c.id)}
                      className="px-4 py-1.5 rounded text-xs uppercase tracking-widest font-semibold transition-opacity hover:opacity-80"
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
          Progress is saved automatically on your device.
        </p>
      </main>
    </div>
  );
}
