import { useStore } from '@/lib/store';
import { formatTimeAgo } from '@/lib/utils';
import type { Gig } from '@/types';
import { motion } from 'framer-motion';

export default function GigCard({ gig, index = 0 }: { gig: Gig; index?: number }) {
  const currentUser = useStore(s => s.currentUser);
  const claimGig = useStore(s => s.claimGig);
  const completeGig = useStore(s => s.completeGig);
  const openModal = useStore(s => s.openModal);

  const isOwner = currentUser?.uid === gig.postedBy;
  const isClaimer = currentUser?.uid === gig.claimedBy;

  const handleAction = () => {
    if (gig.status === 'open' && !isOwner) {
      claimGig(gig.id);
    } else if (gig.status === 'claimed' && (isOwner || isClaimer)) {
      completeGig(gig.id);
    } else if (gig.status === 'completed' && isOwner) {
      openModal('rating', { gig });
    }
  };

  const getStatusLabel = () => {
    switch (gig.status) {
      case 'open': return isOwner ? 'Your listing' : 'Claim';
      case 'claimed': return (isOwner || isClaimer) ? 'Mark Complete' : 'In Progress';
      case 'completed': return isOwner ? 'Rate' : 'Completed';
      case 'rated': return 'Rated';
      default: return '';
    }
  };

  const canAct = (gig.status === 'open' && !isOwner) ||
                 (gig.status === 'claimed' && (isOwner || isClaimer)) ||
                 (gig.status === 'completed' && isOwner);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        background: '#0b0e14',
        border: '1px solid #1a1f2c',
        borderRadius: 18,
        padding: 16,
        cursor: 'pointer',
        transition: '0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span className={`gig-badge ${gig.type}`}>
          {gig.type === 'needed' ? 'Help Needed' : 'Offering'}
        </span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontWeight: 700,
          fontSize: 14,
          color: '#FFD700',
        }}>
          <div className="coin-b-small" />
          {gig.reward}
        </div>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#eef2ff', marginBottom: 6, lineHeight: 1.3 }}>
        {gig.title}
      </h3>
      <p style={{ fontSize: 13, color: '#6f7a91', lineHeight: 1.4, marginBottom: 10 }}>
        {gig.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 11,
            color: '#4c5468',
            background: '#141824',
            padding: '3px 8px',
            borderRadius: 20,
          }}>
            {gig.category}
          </span>
          <span style={{ fontSize: 11, color: '#4c5468' }}>
            {formatTimeAgo(gig.createdAt)}
          </span>
        </div>
        <span style={{ fontSize: 12, color: '#6f7a91' }}>
          {gig.postedByName.split(' ')[0]}
        </span>
      </div>

      {gig.status === 'claimed' && gig.claimedByName && (
        <div style={{
          marginTop: 10,
          padding: '8px 12px',
          background: 'rgba(0, 255, 127, 0.05)',
          borderRadius: 10,
          fontSize: 12,
          color: '#8e96a3',
        }}>
          Claimed by <span style={{ color: '#00FF7F', fontWeight: 600 }}>{gig.claimedByName}</span>
        </div>
      )}

      {gig.status === 'rated' && gig.rating && (
        <div style={{
          marginTop: 10,
          padding: '8px 12px',
          background: 'rgba(255, 215, 0, 0.05)',
          borderRadius: 10,
          fontSize: 12,
          color: '#8e96a3',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{ color: '#FFD700' }}>
            {'*'.repeat(gig.rating)}
          </span>
          {gig.ratingComment && <span>- {gig.ratingComment}</span>}
        </div>
      )}

      {canAct && (
        <button
          onClick={(e) => { e.stopPropagation(); handleAction(); }}
          style={{
            marginTop: 12,
            padding: '10px 0',
            borderRadius: 14,
            fontWeight: 600,
            fontSize: 13,
            textAlign: 'center',
            cursor: 'pointer',
            border: '1.5px solid #00FF7F',
            color: '#00FF7F',
            background: 'transparent',
            width: '100%',
            fontFamily: 'inherit',
            transition: '0.15s',
          }}
        >
          {getStatusLabel()}
        </button>
      )}
    </motion.div>
  );
}
