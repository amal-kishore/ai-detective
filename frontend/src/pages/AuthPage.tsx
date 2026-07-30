import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { Spinner } from '../components/ui/Spinner';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, username, password);
      }
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: 'var(--text-dim)' }}>
            CASE
          </p>
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--accent)' }}>
            ZERO
          </h1>
          <p className="text-xs mt-3 tracking-widest uppercase" style={{ color: 'var(--text-dim)' }}>
            Interactive Detective Mysteries
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {error && (
            <p className="text-sm text-center py-2 px-3 rounded" style={{ color: 'var(--danger)', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-dim)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded text-sm outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-dim)' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 rounded text-sm outline-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-dim)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded text-sm outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded text-sm uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
            style={{ background: 'var(--accent-dim)', color: '#fff' }}
          >
            {loading && <Spinner />}
            {mode === 'login' ? 'Enter' : 'Create Account'}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="w-full text-xs py-2 transition-colors"
            style={{ color: 'var(--text-dim)' }}
          >
            {mode === 'login' ? "Don't have an account? Register" : 'Already registered? Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
