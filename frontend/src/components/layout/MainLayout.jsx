import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

export default function MainLayout() {
  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden bg-bg-subtle">
      {/* Desktop top navbar */}
      <TopNav />

      {/* Content area — extra bottom padding on mobile for BottomNav, top padding on desktop for TopNav */}
      <main className="flex-1 p-4 md:p-6 md:pt-8 pb-20 lg:pb-6 overflow-y-auto scroll-smooth">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
