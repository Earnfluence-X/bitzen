import { useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, db, doc, setDoc } from '@/lib/firebase';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referral, setReferral] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuthScreen = useStore(s => s.setAuthScreen);
  const addToast = useStore(s => s.addToast);
  const setCurrentUser = useStore(s => s.setCurrentUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      console.log("✅ Firebase signup successful:", firebaseUser.uid);
      
      // Save user data to Firestore
      const userData = {
        uid: firebaseUser.uid,
        name: name,
        email: email,
        balance: 100,
        referralCode: name.slice(0, 6).toUpperCase() + Math.floor(Math.random() * 1000),
        streak: 0,
        reputation: 50,
        createdAt: Date.now(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      // Create local user
      const localUser = {
        uid: firebaseUser.uid,
        email: email,
        displayName: name,
        initials: name.split(' ').map(n => n[0]).join('').toUpperCase(),
        balance: 100,
        totalEarned: 100,
        totalSpent: 0,
        gigsCompleted: 0,
        gigsPosted: 0,
        reputation: 5.0,
        ratingSum: 0,
        ratingCount: 0,
        streak: 0,
        lastBonusDate: null,
        referralCode: userData.referralCode,
        referredBy: referral || null,
        referralCount: 0,
        pin: '',
        createdAt: Date.now(),
      };
      
      setCurrentUser(localUser);
      addToast(`Welcome to Bitzen! 100 coins added`, 'success');
      
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.code === 'auth/email-already-in-use') {
        addToast('Email already registered', 'error');
      } else {
        addToast(error.message || 'Signup failed', 'error');
      }
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
            Create account
          </h1>
          <p style={{ color: '#6f7a91', fontSize: 14, marginBottom: 32 }}>
            Get 100 free coins when you sign up
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
