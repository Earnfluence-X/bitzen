import { useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { getTodayString } from '@/lib/utils';

export default function DailyBonus() {
  const currentUser = useStore(s => s.currentUser);
  const claimDailyBonus = useStore(s => s.claimDailyBonus);
  const [claimed, setClaimed] = useState(false);
  const [result, setResult] = useState<{ amount: number; streak: number } | null>(null);

  if (!currentUser) return null;

  const alreadyClaimed = currentUser.lastBonusDate === getTodayString();

  const handleClaim = () => {
    const res = claimDailyBonus();
    if (res) {
      setClaimed(true);
      setResult(res);
    }
  };

  return (
    <div style={{
      background: '#0b0e14',
      border: '1px solid #1a1f2c',
      borderRadius: 18,
      padding: 20,
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#eef2ff', marginBottom: 2 }}>Daily Bonus</h3>
          <p style={{ fontSize: 12, color: '#6f7a91' }}>
            {currentUser.streak > 0 ? `${currentUser.streak} day streak` : 'Start your streak!'}
          </p>
        </div>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'rgba(255, 215, 0, 0.08)',
          border: '1px solid rgba(255, 215, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
      </div>

      {/* Streak dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background: i < currentUser.streak ? '#FFD700' : '#1e2330',
              transition: '0.3s',
            }}
          />
        ))}
      </div>

      {claimed && result ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '12px 0',
            color: '#FFD700',
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          +{result.amount} BZN claimed!
        </motion.div>
      ) : (
        <button
          onClick={handleClaim}
          disabled={alreadyClaimed}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 14,
            background: alreadyClaimed ? '#1c212e' : 'rgba(255, 215, 0, 0.1)',
            border: `1.5px solid ${alreadyClaimed ? '#1e2330' : 'rgba(255, 215, 0, 0.2)'}`,
            color: alreadyClaimed ? '#4c5468' : '#FFD700',
            fontSize: 14,
            fontWeight: 600,
            cursor: alreadyClaimed ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {alreadyClaimed ? 'Come back tomorrow' : 'Claim Daily Bonus'}
        </button>
      )}
    </div>
  );
}
