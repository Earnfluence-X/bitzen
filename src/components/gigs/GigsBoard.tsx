import { useState } from 'react';
import { useStore } from '@/lib/store';
import GigCard from './GigCard';
import { motion } from 'framer-motion';

const FILTER_OPTIONS = ['All', 'Needed', 'Offered', 'My Gigs'];
const CATEGORY_FILTERS = ['All', 'Tutoring', 'Design', 'Coding', 'Writing', 'Moving', 'Errands'];

export default function GigsBoard() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const gigs = useStore(s => s.gigs);
  const currentUser = useStore(s => s.currentUser);
  const openModal = useStore(s => s.openModal);

  const filteredGigs = gigs.filter(gig => {
    if (typeFilter === 'Needed' && gig.type !== 'needed') return false;
    if (typeFilter === 'Offered' && gig.type !== 'offered') return false;
    if (typeFilter === 'My Gigs' && gig.postedBy !== currentUser?.uid) return false;
    if (categoryFilter !== 'All' && gig.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', letterSpacing: -0.5 }}>
          Gigs Board
        </h2>
        <button
          onClick={() => openModal('gig-form')}
          style={{
            background: '#00FF7F',
            color: '#0b0e14',
            border: 'none',
            borderRadius: 60,
            padding: '10px 20px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Post
        </button>
      </div>

      {/* Type filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt}
            onClick={() => setTypeFilter(opt)}
            style={{
              padding: '8px 16px',
              borderRadius: 40,
              background: typeFilter === opt ? 'rgba(0, 255, 127, 0.08)' : 'transparent',
              border: `1px solid ${typeFilter === opt ? 'rgba(0, 255, 127, 0.15)' : '#1e2330'}`,
              color: typeFilter === opt ? '#00FF7F' : '#6f7a91',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              transition: '0.15s',
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {CATEGORY_FILTERS.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              background: categoryFilter === cat ? '#141824' : 'transparent',
              border: 'none',
              color: categoryFilter === cat ? '#eef2ff' : '#4c5468',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gig list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredGigs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: '#0b0e14',
              border: '1px solid #1a1f2c',
              borderRadius: 18,
              padding: '40px 16px',
              textAlign: 'center',
              color: '#4c5468',
              fontSize: 14,
            }}
          >
            No gigs found. Be the first to post one!
          </motion.div>
        ) : (
          filteredGigs.map((gig, i) => <GigCard key={gig.id} gig={gig} index={i} />)
        )}
      </div>
    </div>
  );
}
