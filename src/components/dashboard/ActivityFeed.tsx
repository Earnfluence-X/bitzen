import { useStore } from '@/lib/store';
import { formatTimeAgo } from '@/lib/utils';
import { motion } from 'framer-motion';

function TxIcon({ type }: { type: string }) {
  const isReceive = type === 'received' || type === 'gig_earned' || type === 'referral';
  const isSystem = type === 'bonus' || type === 'signup';
  const isSent = type === 'sent' || type === 'gig_paid';

  const cls = isSystem ? 'system' : isReceive ? 'received' : isSent ? 'sent' : 'received';

  const getArrow = () => {
    if (isSystem) return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    );
    if (isReceive) return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <polyline points="19 12 12 19 5 12"/>
      </svg>
    );
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <polyline points="5 12 12 5 19 12"/>
      </svg>
    );
  };

  return (
    <div className={`tx-icon ${cls}`}>
      {getArrow()}
    </div>
  );
}

function getAmountClass(type: string): string {
  if (type === 'sent' || type === 'gig_paid') return 'sent';
  if (type === 'bonus' || type === 'signup') return 'system';
  return 'received';
}

function getAmountPrefix(type: string): string {
  if (type === 'sent' || type === 'gig_paid') return '-';
  return '+';
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'sent': return 'Sent';
    case 'received': return 'Received';
    case 'bonus': return 'Daily Bonus';
    case 'gig_earned': return 'Gig Payment';
    case 'gig_paid': return 'Gig Payment';
    case 'referral': return 'Referral Bonus';
    case 'signup': return 'Welcome Bonus';
    default: return 'Transaction';
  }
}

export default function ActivityFeed({ limit = 5, showHeader = true }: { limit?: number; showHeader?: boolean }) {
  const transactions = useStore(s => s.transactions);
  const currentUser = useStore(s => s.currentUser);
  const setActiveTab = useStore(s => s.setActiveTab);

  const userTxs = transactions
    .filter(tx => tx.fromUid === currentUser?.uid || tx.toUid === currentUser?.uid || tx.fromUid === 'system')
    .slice(0, limit);

  if (userTxs.length === 0) {
    return (
      <div>
        {showHeader && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#eef2ff', letterSpacing: -0.3 }}>
              Recent Activity
            </span>
          </div>
        )}
        <div style={{
          background: '#0b0e14',
          border: '1px solid #1a1f2c',
          borderRadius: 18,
          padding: '32px 16px',
          textAlign: 'center',
          color: '#4c5468',
          fontSize: 14,
        }}>
          No transactions yet. Send or receive coins to get started.
        </div>
      </div>
    );
  }

  return (
    <div>
      {showHeader && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#eef2ff', letterSpacing: -0.3 }}>
            Recent Activity
          </span>
          <button
            onClick={() => setActiveTab('activity')}
            style={{
              fontSize: 13,
              color: '#00FF7F',
              cursor: 'pointer',
              fontWeight: 500,
              background: 'none',
              border: 'none',
              fontFamily: 'inherit',
            }}
          >
            View all
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {userTxs.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: '#0b0e14',
              padding: '14px 16px',
              borderRadius: 18,
              border: '1px solid #1a1f2c',
              cursor: 'pointer',
              transition: '0.15s',
            }}
          >
            <TxIcon type={tx.type} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#eef2ff' }}>
                {tx.type === 'sent' ? tx.toName : tx.fromName}
              </div>
              <div style={{ fontSize: 12, color: '#6f7a91', marginTop: 2 }}>
                {getTypeLabel(tx.type)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontWeight: 700,
                fontSize: 15,
                color: getAmountClass(tx.type) === 'sent' ? '#FF6B6B'
                  : getAmountClass(tx.type) === 'system' ? '#FFD700'
                  : '#00FF7F',
              }}>
                {getAmountPrefix(tx.type)}{tx.amount}
              </div>
              <div style={{ fontSize: 11, color: '#4c5468', marginTop: 2 }}>
                {formatTimeAgo(tx.timestamp)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
