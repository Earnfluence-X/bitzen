import BalanceCard from './BalanceCard';
import QuickActions from './QuickActions';
import ActivityFeed from './ActivityFeed';

export default function Dashboard() {
  return (
    <div>
      <BalanceCard />
      <QuickActions />
      <ActivityFeed limit={5} showHeader={true} />
    </div>
  );
}
