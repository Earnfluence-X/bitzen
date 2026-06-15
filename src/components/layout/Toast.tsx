import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToastContainer() {
  const toasts = useStore(s => s.toasts);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#00FF7F" fillOpacity="0.15"/>
          <path d="M5 8l2 2 4-4" stroke="#00FF7F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case 'error': return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#FF6B6B" fillOpacity="0.15"/>
          <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#FF6B6B" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
      default: return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#FFD700" fillOpacity="0.15"/>
          <circle cx="8" cy="5" r="1" fill="#FFD700"/>
          <path d="M8 7.5v4" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 100,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'center',
      pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              background: '#1c212e',
              border: '1px solid #232732',
              borderRadius: 60,
              padding: '12px 24px',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              pointerEvents: 'auto',
              whiteSpace: 'nowrap',
              maxWidth: 360,
            }}
          >
            {getIcon(toast.type)}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
