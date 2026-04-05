import { NavLink } from 'react-router';
import { navItems } from '../../data/navItems';

export function BottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 backdrop-blur-lg border-t border-rose-200/60 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 lg:hidden safe-area-bottom"
    >
      <div className="flex justify-around items-center py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]" role="menubar">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            role="menuitem"
            aria-label={item.label}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all min-w-[60px] min-h-[48px] justify-center focus-visible:outline-2 focus-visible:outline-rose-500 focus-visible:outline-offset-2 ${
                isActive
                  ? 'text-rose-600 font-bold bg-rose-100/80 scale-105'
                  : 'text-gray-500 hover:text-rose-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl leading-none" aria-hidden="true">{item.emoji}</span>
                <span className={`text-xs font-display font-bold ${isActive ? 'text-rose-600' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
