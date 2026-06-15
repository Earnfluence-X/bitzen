import { useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referral, setReferral] = useState('');
  const [loading, setLoading] = useState(false);
  const signup = useStore(s => s.signup);
  const setAuthScreen = useStore(s => s.setAuthScreen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 6) {
      useStore.getState().addToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      signup(email, password, name, referral || undefined);
      setLoading(false);
    }, 800);
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
            Create account
          </h1>
          <p style={{ color: '#6f7a91', fontSize: 14, marginBottom: 32 }}>
            Get 50 free coins when you sign up
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#8e96a3', marginBottom: 8, fontWeight: 500 }}>
                Full Name
              </label>
              <input
                className="input-dark"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

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
                placeholder="Min 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#8e96a3', marginBottom: 8, fontWeight: 500 }}>
                Referral Code (optional)
              </label>
              <input
                className="input-dark"
                type="text"
                placeholder="Enter code for bonus coins"
                value={referral}
                onChange={e => setReferral(e.target.value.toUpperCase())}
                maxLength={6}
                style={{ textTransform: 'uppercase', letterSpacing: 2 }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!name || !email || !password || loading}
              style={{ marginTop: 8 }}
            >
              {loading ? 'Creating account...' : 'Get Started'}
            </button>
          </form>

          <p style={{ color: '#6f7a91', fontSize: 13, textAlign: 'center', marginTop: 24 }}>
            Already have an account?{' '}
            <button
              onClick={() => setAuthScreen('login')}
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
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
