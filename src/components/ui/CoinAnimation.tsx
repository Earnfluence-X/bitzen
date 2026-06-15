import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoinAnimation() {
  const active = useStore(s => s.coinAnimationActive);

  const coins = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    delay: Math.random() * 0.3,
  }));

  return (
    <AnimatePresence>
      {active && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 300,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {coins.map(coin => (
            <motion.div
              key={coin.id}
              initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              animate={{
                opacity: 0,
                y: -120 - Math.random() * 60,
                x: coin.x,
                scale: 0.3,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: coin.delay, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #FFD700 0%, #FFC107 30%, #E6C200 60%, #BF9B00 100%)',
                boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 900,
                color: '#8B6914',
              }}
            >
              B
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
