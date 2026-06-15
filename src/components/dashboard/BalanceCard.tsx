import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function BalanceCard() {
  const user = useStore(s => s.currentUser);
  if (!user) return null;

  return (
    <motion.div
      className="balance-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{
        color: '#8e96a3',
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 500,
        marginBottom: 12,
        position: 'relative',
        zIndex: 1,
      }}>
        Available Balance
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="coin-b">B</div>
        <div style={{
          fontSize: 44,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: -1,
          lineHeight: 1,
        }}>
          {user.balance.toLocaleString()}
          <span style={{
            fontSize: 16,
            fontWeight: 500,
            color: '#b9c0cf',
            marginLeft: 4,
          }}>BZN</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: 28,
        marginTop: 20,
        paddingTop: 18,
        borderTop: '1px solid #1e2330',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{
            fontSize: 10,
            color: '#6f7a91',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            fontWeight: 500,
          }}>Earned</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#00FF7F' }}>
            +{user.totalEarned}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{
            fontSize: 10,
            color: '#6f7a91',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            fontWeight: 500,
          }}>Spent</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#FF6B6B' }}>
            -{user.totalSpent}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{
            fontSize: 10,
            color: '#6f7a91',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            fontWeight: 500,
          }}>Streak</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#FFD700' }}>
            {user.streak}d
          </span>
        </div>
      </div>
    </motion.div>
  );
}
