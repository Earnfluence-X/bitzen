import { useStore } from '@/lib/store';
import StatsGrid from './StatsGrid';
import DailyBonus from './DailyBonus';
import ReferralCard from './ReferralCard';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';

export default function ProfileScreen() {
  const currentUser = useStore(s => s.currentUser);
  const logout = useStore(s => s.logout);

  if (!currentUser) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Profile header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1c212e, #2a3142)',
          border: '2px solid #232732',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 26,
          color: '#eef2ff',
          margin: '0 auto 14px',
        }}>
          {currentUser.initials}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
          {currentUser.displayName}
        </h2>
        <p style={{ fontSize: 13, color: '#6f7a91' }}>
          {currentUser.email}
        </p>
        <p style={{ fontSize: 11, color: '#4c5468', marginTop: 4 }}>
          Member since {formatDate(currentUser.createdAt)}
        </p>
      </div>

      <DailyBonus />
      <StatsGrid />
      <ReferralCard />

      {/* Settings */}
      <div style={{
        background: '#0b0e14',
        border: '1px solid #1a1f2c',
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 16,
      }}>
        <SettingItem label="Set Transaction PIN" onClick={() => {
          const pin = prompt('Enter a 4-digit PIN:');
          if (pin && pin.length === 4 && /^\d+$/.test(pin)) {
            useStore.getState().setPin(pin);
            useStore.getState().addToast('PIN set successfully', 'success');
          } else if (pin) {
            useStore.getState().addToast('PIN must be 4 digits', 'error');
          }
        }} />
        <SettingItem label="About Bitzen" onClick={() => {
          useStore.getState().addToast('Bitzen v1.0 - Campus Coin Exchange', 'info');
        }} />
      </div>

      <button
        onClick={logout}
        style={{
          width: '100%',
          padding: '14px 0',
          borderRadius: 14,
          background: 'rgba(255, 107, 107, 0.08)',
          border: '1px solid rgba(255, 107, 107, 0.15)',
          color: '#FF6B6B',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Sign Out
      </button>
    </motion.div>
  );
}

function SettingItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '16px 20px',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid #1a1f2c',
        color: '#eef2ff',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {label}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4c5468" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );
}
