import { useStore } from '@/lib/store';

export default function ReferralCard() {
  const currentUser = useStore(s => s.currentUser);
  const addToast = useStore(s => s.addToast);

  if (!currentUser) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentUser.referralCode).then(() => {
      addToast('Referral code copied!', 'success');
    }).catch(() => {
      addToast('Code: ' + currentUser.referralCode, 'info');
    });
  };

  return (
    <div style={{
      background: '#0b0e14',
      border: '1px solid #1a1f2c',
      borderRadius: 18,
      padding: 20,
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#eef2ff', marginBottom: 2 }}>Invite Friends</h3>
          <p style={{ fontSize: 12, color: '#6f7a91' }}>
            Both of you get 25 bonus coins
          </p>
        </div>
        <div style={{
          background: 'rgba(0, 255, 127, 0.08)',
          borderRadius: 20,
          padding: '4px 10px',
          fontSize: 12,
          fontWeight: 600,
          color: '#00FF7F',
        }}>
          {currentUser.referralCount} invited
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          flex: 1,
          background: '#141824',
          borderRadius: 12,
          padding: '12px 16px',
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 4,
          color: '#00FF7F',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
        }}>
          {currentUser.referralCode}
        </div>
        <button
          onClick={handleCopy}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(0, 255, 127, 0.08)',
            border: '1px solid rgba(0, 255, 127, 0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00FF7F',
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
