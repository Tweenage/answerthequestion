import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content" className="flex-1 px-4 pb-24 lg:pb-6 pt-4 max-w-3xl mx-auto w-full">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
