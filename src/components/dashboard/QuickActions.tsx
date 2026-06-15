import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function QuickActions() {
  const openModal = useStore(s => s.openModal);

  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => openModal('send')}
        style={{
          flex: 1,
          background: '#141824',
          border: '1px solid #1e2330',
          borderRadius: 18,
          padding: '16px 0',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 700,
          background: 'rgba(255, 107, 107, 0.08)',
          color: '#FF6B6B',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="5 12 12 5 19 12"/>
          </svg>
        </div>
        Send
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => openModal('receive')}
        style={{
          flex: 1,
          background: '#141824',
          border: '1px solid #1e2330',
          borderRadius: 18,
          padding: '16px 0',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 700,
          background: 'rgba(0, 255, 127, 0.08)',
          color: '#00FF7F',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="19 12 12 19 5 12"/>
          </svg>
        </div>
        Receive
      </motion.button>
    </div>
  );
}
