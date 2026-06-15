import { useStore } from '@/lib/store';
import type { TabId } from '@/types';

const tabs: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'gigs', label: 'Gigs' },
  { id: 'activity', label: 'Activity' },
  { id: 'profile', label: 'Profile' },
];

function NavIcon({ id, active }: { id: TabId; active: boolean }) {
  const color = active ? '#00FF7F' : '#4c5468';

  switch (id) {
    case 'home':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
    case 'gigs':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      );
    case 'activity':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      );
    case 'profile':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      );
  }
}

export default function BottomNav() {
  const activeTab = useStore(s => s.activeTab);
  const setActiveTab = useStore(s => s.setActiveTab);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      padding: '16px 20px 8px',
      borderTop: '1px solid #1e2330',
      marginTop: 28,
    }}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
              color: isActive ? '#00FF7F' : '#4c5468',
              fontSize: 11,
              fontWeight: 500,
              transition: '0.2s',
              background: 'none',
              border: 'none',
              fontFamily: 'inherit',
            }}
          >
            <NavIcon id={tab.id} active={isActive} />
            <span>{tab.label}</span>
            <div style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#00FF7F',
              opacity: isActive ? 1 : 0,
            }} />
          </button>
        );
      })}
    </div>
  );
}
