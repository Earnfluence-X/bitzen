import { useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useStore(s => s.login);
  const setAuthScreen = useStore(s => s.setAuthScreen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '40px 24px' }}>
        <button
          onClick={() => setAuthScreen('onboarding')}
          style={{
            background: 'none',
            border: 'none',
            color: '#8e96a3',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: -0.5,
            marginBottom: 8,
          }}>
            Welcome back
          </h1>
          <p style={{ color: '#6f7a91', fontSize: 14, marginBottom: 32 }}>
            Sign in to your Bitzen account
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#8e96a3', marginBottom: 8, fontWeight: 500 }}>
                Email
              </label>
              <input
                className="input-dark"
                type="email"
                placeholder="you@campus.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#8e96a3', marginBottom: 8, fontWeight: 500 }}>
                Password
              </label>
              <input
                className="input-dark"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!email || !password || loading}
              style={{ marginTop: 8 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ color: '#6f7a91', fontSize: 13, textAlign: 'center', marginTop: 24 }}>
            No account?{' '}
            <button
              onClick={() => setAuthScreen('signup')}
              style={{
                background: 'none',
                border: 'none',
                color: '#00FF7F',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Create one
            </button>
          </p>

          <div style={{
            marginTop: 32,
            padding: 16,
            background: '#0b0e14',
            borderRadius: 14,
            border: '1px solid #1e2330',
          }}>
            <p style={{ fontSize: 12, color: '#6f7a91', marginBottom: 8 }}>Demo accounts:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['alex@campus.edu', 'jordan@campus.edu', 'maya@campus.edu'].map(e => (
                <button
                  key={e}
                  onClick={() => { setEmail(e); setPassword('demo123'); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#00FF7F',
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    textAlign: 'left',
                    padding: '4px 0',
                  }}
                >
                  {e}
                </button>
              ))}
              <p style={{ fontSize: 11, color: '#4c5468', marginTop: 4 }}>Password: demo123</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
