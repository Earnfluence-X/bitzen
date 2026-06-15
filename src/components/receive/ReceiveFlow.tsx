import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function ReceiveFlow() {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [claiming, setClaiming] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const closeModal = useStore(s => s.closeModal);
  const claimTransferCode = useStore(s => s.claimTransferCode);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const code = digits.join('');
  const isComplete = code.length === 6;

  const handleClaim = () => {
    if (!isComplete) return;
    setClaiming(true);
    setTimeout(() => {
      const success = claimTransferCode(code);
      setClaiming(false);
      if (success) {
        closeModal();
      } else {
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 800);
  };

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
        }}
      >
        <div style={{ width: 36, height: 4, background: '#2a3142', borderRadius: 2, margin: '0 auto 20px' }} />

        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 4, textAlign: 'center' }}>
          Receive Coins
        </h2>
        <p style={{ fontSize: 13, color: '#6f7a91', marginBottom: 28, textAlign: 'center' }}>
          Enter the 6-digit transfer code
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
          {digits.map((digit, i) => (
            <div
              key={i}
              style={{
                width: 48,
                height: 58,
                background: '#0b0e14',
                border: `2px solid ${digit ? '#00FF7F' : '#1e2330'}`,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: digit ? '0 0 15px rgba(0, 255, 127, 0.15)' : 'none',
                transition: '0.2s',
              }}
            >
              <input
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleDigitChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  textAlign: 'center',
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#00FF7F',
                  fontFamily: 'var(--font-mono)',
                  caretColor: '#00FF7F',
                }}
              />
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary"
          disabled={!isComplete || claiming}
          onClick={handleClaim}
        >
          {claiming ? 'Claiming...' : 'Claim Coins'}
        </button>
      </motion.div>
    </div>
  );
}
