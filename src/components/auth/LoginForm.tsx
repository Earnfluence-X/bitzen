import { useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from '@/lib/firebase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuthScreen = useStore(s => s.setAuthScreen);
  const addToast = useStore(s => s.addToast);
  const setCurrentUser = useStore(s => s.setCurrentUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      console.log("✅ Firebase login successful:", firebaseUser.uid);
      
      // Create/update local user
      const localUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: email.split('@')[0],
        initials: email[0].toUpperCase(),
        balance: 100,
        totalEarned: 0,
        totalSpent: 0,
        gigsCompleted: 0,
        gigsPosted: 0,
        reputation: 5.0,
        ratingSum: 0,
        ratingCount: 0,
        streak: 0,
        lastBonusDate: null,
        referralCode: email.slice(0, 6).toUpperCase(),
        referredBy: null,
        referralCount: 0,
        pin: '',
        createdAt: Date.now(),
      };
      
      setCurrentUser(localUser);
      addToast(`Welcome back!`, 'success');
      
    } catch (error: any) {
      console.error("Login error:", error);
      addToast(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
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
        </motion.div>
      </div>
    </div>
  );
}
