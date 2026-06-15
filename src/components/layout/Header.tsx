import { useStore } from '@/lib/store';

export default function Header() {
  const user = useStore(s => s.currentUser);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 28,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 22,
        fontWeight: 700,
        color: '#ffffff',
        letterSpacing: -0.5,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00FF7F, #00CC66)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 18,
          color: '#0b0e14',
          boxShadow: '0 0 15px rgba(0, 255, 127, 0.3)',
        }}>
          B
        </div>
        <span>Bit<span style={{ color: '#00FF7F' }}>zen</span></span>
      </div>

      <button
        onClick={() => useStore.getState().setActiveTab('profile')}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1c212e, #2a3142)',
          border: '1px solid #232732',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 16,
          color: '#eef2ff',
          cursor: 'pointer',
        }}
      >
        {user?.initials || '?'}
      </button>
    </div>
  );
}
