import { useState } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function SendFlow() {
  const [step, setStep] = useState<'amount' | 'code'>('amount');
  const [amount, setAmount] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const closeModal = useStore(s => s.closeModal);
  const createTransferCode = useStore(s => s.createTransferCode);
  const currentUser = useStore(s => s.currentUser);

  const handleGenerate = () => {
    const num = parseInt(amount);
    if (!num || num <= 0) return;
    const code = createTransferCode(num);
    if (code) {
      setGeneratedCode(code.code);
      setStep('code');
    }
  };

  const quickAmounts = [10, 25, 50, 100];

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          background: '#0f1219',
          borderRadius: '24px 24px 0 0',
          border: '1px solid #232732',
          borderBottom: 'none',
          padding: '24px 20px 40px',
          width: '100%',
          maxWidth: 420,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: 36, height: 4, background: '#2a3142', borderRadius: 2, margin: '0 auto 20px' }} />

        <AnimatePresence mode="wait">
          {step === 'amount' ? (
            <motion.div
              key="amount"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Send Coins</h2>
              <p style={{ fontSize: 13, color: '#6f7a91', marginBottom: 24 }}>
                Generate a 6-digit code for the recipient
              </p>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#8e96a3', marginBottom: 8, fontWeight: 500 }}>
                  Amount
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input-dark"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', padding: '20px 16px' }}
                    min="1"
                    max={currentUser?.balance || 0}
                  />
                </div>
                <div style={{
                  fontSize: 12,
                  color: '#6f7a91',
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                  Available: {currentUser?.balance || 0} BZN
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {quickAmounts.map(qa => (
                  <button
                    key={qa}
                    onClick={() => setAmount(qa.toString())}
                    style={{
                      flex: 1,
                      background: amount === qa.toString() ? 'rgba(0, 255, 127, 0.08)' : '#0b0e14',
                      border: `1px solid ${amount === qa.toString() ? 'rgba(0, 255, 127, 0.15)' : '#1e2330'}`,
                      borderRadius: 12,
                      padding: '10px 0',
                      color: amount === qa.toString() ? '#00FF7F' : '#8e96a3',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: '0.15s',
                    }}
                  >
                    {qa}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-primary"
                disabled={!amount || parseInt(amount) <= 0 || parseInt(amount) > (currentUser?.balance || 0)}
                onClick={handleGenerate}
              >
                Generate Code
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(0, 255, 127, 0.08)',
                border: '1px solid rgba(0, 255, 127, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Code Generated</h2>
              <p style={{ fontSize: 13, color: '#6f7a91', marginBottom: 24 }}>
                Share this code with the recipient
              </p>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
                {generatedCode.split('').map((digit, i) => (
                  <div key={i} className="code-digit">{digit}</div>
                ))}
              </div>

              <div style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#FF6B6B',
                marginBottom: 24,
              }}>
                -{amount} BZN
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  navigator.clipboard?.writeText(generatedCode).then(() => {
                    useStore.getState().addToast('Code copied to clipboard', 'success');
                  }).catch(() => {
                    useStore.getState().addToast('Code: ' + generatedCode, 'info');
                  });
                }}
                style={{ marginBottom: 12 }}
              >
                Copy Code
              </button>

              <button
                className="btn btn-outline"
                onClick={closeModal}
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
