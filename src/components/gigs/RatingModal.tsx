import { useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import type { Gig } from '@/types';

export default function RatingModal({ gig }: { gig: Gig }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const closeModal = useStore(s => s.closeModal);
  const rateGig = useStore(s => s.rateGig);

  const handleSubmit = () => {
    if (rating === 0) return;
    rateGig(gig.id, rating, comment);
    closeModal();
  };

  const displayRating = hoverRating || rating;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          background: '#0f1219',
          borderRadius: '24px 24px 0 0',
          border: '1px solid #232732',
          borderBottom: 'none',
          padding: '24px 20px 40px',
          width: '100%',
          maxWidth: 420,
        }}
      >
        <div style={{ width: 36, height: 4, background: '#2a3142', borderRadius: 2, margin: '0 auto 20px' }} />

        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 4, textAlign: 'center' }}>
          Rate this Gig
        </h2>
        <p style={{ fontSize: 13, color: '#6f7a91', marginBottom: 24, textAlign: 'center' }}>
          How was the work on &quot;{gig.title}&quot;?
        </p>

        {/* Star rating */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              className="star-btn"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{ padding: 4 }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill={star <= displayRating ? '#FFD700' : 'none'}
                stroke={star <= displayRating ? '#FFD700' : '#4c5468'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#8e96a3', marginBottom: 8, fontWeight: 500 }}>
            Comment (optional)
          </label>
          <textarea
            className="input-dark"
            placeholder="Share your experience..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
          />
        </div>

        <button
          className="btn btn-primary"
          disabled={rating === 0}
          onClick={handleSubmit}
        >
          Submit Rating
        </button>
      </motion.div>
    </div>
  );
}
