import { useStore } from '@/lib/store';

export default function StatsGrid() {
  const user = useStore(s => s.currentUser);
  if (!user) return null;

  const stats = [
    { label: 'Balance', value: user.balance.toString(), color: '#00FF7F' },
    { label: 'Reputation', value: user.ratingCount > 0 ? user.reputation.toFixed(1) : '5.0', color: '#FFD700' },
    { label: 'Gigs Done', value: user.gigsCompleted.toString(), color: '#eef2ff' },
    { label: 'Gigs Posted', value: user.gigsPosted.toString(), color: '#eef2ff' },
    { label: 'Total Earned', value: `+${user.totalEarned}`, color: '#00FF7F' },
    { label: 'Total Spent', value: `-${user.totalSpent}`, color: '#FF6B6B' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 10,
      marginBottom: 16,
    }}>
      {stats.map(stat => (
        <div
          key={stat.label}
          style={{
            background: '#0b0e14',
            border: '1px solid #1a1f2c',
            borderRadius: 14,
            padding: '14px 12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: stat.color, marginBottom: 4 }}>
            {stat.value}
          </div>
          <div style={{ fontSize: 10, color: '#6f7a91', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 500 }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
