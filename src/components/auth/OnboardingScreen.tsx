import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function OnboardingScreen() {
  const setAuthScreen = useStore(s => s.setAuthScreen);

  return (
    <div className="app-container" style={{ minHeight: '100vh' }}>
      <div style={{
        padding: '60px 24px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00FF7F, #00CC66)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: 36,
            color: '#0b0e14',
            boxShadow: '0 0 40px rgba(0, 255, 127, 0.3)',
            marginBottom: 32,
          }}
        >
          B
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: -1,
            marginBottom: 8,
          }}
        >
          Bit<span style={{ color: '#00FF7F' }}>zen</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            color: '#8e96a3',
            fontSize: 15,
            lineHeight: 1.5,
            maxWidth: 280,
            marginBottom: 48,
          }}
        >
          Campus coin exchange. Trade services with your peers using virtual coins.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <button
            className="btn btn-primary"
            onClick={() => setAuthScreen('signup')}
          >
            Create Account
          </button>
          <button
            className="btn btn-outline"
            onClick={() => setAuthScreen('login')}
          >
            Sign In
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: 40,
            display: 'flex',
            gap: 32,
            color: '#6f7a91',
            fontSize: 12,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#00FF7F', marginBottom: 4 }}>50</div>
            <div>Free coins</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#FFD700', marginBottom: 4 }}>P2P</div>
            <div>Transfers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#FF6B6B', marginBottom: 4 }}>Gigs</div>
            <div>Marketplace</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
