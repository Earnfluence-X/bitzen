import { useStore } from '@/lib/store';
import Header from './Header';
import BottomNav from './BottomNav';
import Dashboard from '@/components/dashboard/Dashboard';
import GigsBoard from '@/components/gigs/GigsBoard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import ProfileScreen from '@/components/profile/ProfileScreen';
import SendFlow from '@/components/send/SendFlow';
import ReceiveFlow from '@/components/receive/ReceiveFlow';
import GigForm from '@/components/gigs/GigForm';
import RatingModal from '@/components/gigs/RatingModal';
import { AnimatePresence, motion } from 'framer-motion';
import type { Gig } from '@/types';

export default function AppShell() {
  const activeTab = useStore(s => s.activeTab);
  const activeModal = useStore(s => s.activeModal);
  const modalData = useStore(s => s.modalData);

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <Dashboard />;
      case 'gigs': return <GigsBoard />;
      case 'activity': return (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', letterSpacing: -0.5, marginBottom: 20 }}>
            Activity
          </h2>
          <ActivityFeed limit={50} showHeader={false} />
        </div>
      );
      case 'profile': return <ProfileScreen />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <div className="app-inner">
        <Header />
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTab()}
        </motion.div>
      </div>
      <BottomNav />

      <AnimatePresence>
        {activeModal === 'send' && <SendFlow />}
        {activeModal === 'receive' && <ReceiveFlow />}
        {activeModal === 'gig-form' && <GigForm />}
        {activeModal === 'rating' && modalData && 'gig' in modalData && (
          <RatingModal gig={modalData.gig as Gig} />
        )}
      </AnimatePresence>
    </div>
  );
}
