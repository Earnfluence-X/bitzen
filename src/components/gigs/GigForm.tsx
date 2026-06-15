import { useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

const CATEGORIES = ['Tutoring', 'Design', 'Coding', 'Writing', 'Moving', 'Errands', 'Photography', 'Music', 'Other'];

export default function GigForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'needed' | 'offered'>('needed');
  const [reward, setReward] = useState('');
  const closeModal = useStore(s => s.closeModal);
  const postGig = useStore(s => s.postGig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !reward) return;
    const success = postGig(title, description, category, type, parseInt(reward));
    if (success) closeModal();
  };

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
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: 36, height: 4, background: '#2a3142', borderRadius: 2, margin: '0 auto 20px' }} />

        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 24 }}>Post a Gig</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Type toggle */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
            <button
              type="button"
              onClick={() => setType('needed')}
              style={{
                flex: 1,
                padding: '12px 0',
                borderRadius: 12,
                background: type === 'needed' ? 'rgba(255, 107, 107, 0.1)' : '#0b0e14',
                border: `1px solid ${type === 'needed' ? 'rgba(255, 107, 107, 0.15)' : '#1e2330'}`,
                color: type === 'needed' ? '#FF6B6B' : '#6f7a91',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Help Needed
            </button>
            <button
              type="button"
              onClick={() => setType('offered')}
              style={{
                flex: 1,
                padding: '12px 0',
                borderRadius: 12,
                background: type === 'offered' ? 'rgba(0, 255, 127, 0.1)' : '#0b0e14',
                border: `1px solid ${type === 'offered' ? 'rgba(0, 255, 127, 0.15)' : '#1e2330'}`,
                color: type === 'offered' ? '#00FF7F' : '#6f7a91',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Offering
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#8e96a3', marginBottom: 8, fontWeight: 500 }}>
              Title
            </label>
            <input
              className="input-dark"
              placeholder="What do you need help with?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={60}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#8e96a3', marginBottom: 8, fontWeight: 500 }}>
              Description
            </label>
            <textarea
              className="input-dark"
              placeholder="Describe the task in detail..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#8e96a3', marginBottom: 8, fontWeight: 500 }}>
              Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 40,
                    background: category === cat ? 'rgba(0, 255, 127, 0.08)' : '#0b0e14',
                    border: `1px solid ${category === cat ? 'rgba(0, 255, 127, 0.15)' : '#1e2330'}`,
                    color: category === cat ? '#00FF7F' : '#8e96a3',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: '0.15s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#8e96a3', marginBottom: 8, fontWeight: 500 }}>
              Reward (BZN)
            </label>
            <input
              className="input-dark"
              type="number"
              placeholder="How many coins?"
              value={reward}
              onChange={e => setReward(e.target.value)}
              min="1"
              max="500"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!title || !description || !category || !reward}
            style={{ marginTop: 8 }}
          >
            Post Gig
          </button>
        </form>
      </motion.div>
    </div>
  );
}
