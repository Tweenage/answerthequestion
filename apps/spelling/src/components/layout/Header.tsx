import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuthStore, useCurrentUser } from '@atq/shared';
import { useSpellingProgressStore } from '../../stores/useSpellingProgressStore';
import { supabase } from '@atq/shared/lib/supabase';
import { Flame, LogOut, Users } from 'lucide-react';
import { navItems } from '../../data/navItems';
import { BeeChar } from '../mascot/BeeChar';

export function Header() {
  const currentUser = useCurrentUser();
  const logout = useAuthStore(s => s.logout);
  const getData = useSpellingProgressStore(s => s.getData);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  if (!currentUser) return null;

  const data = getData(currentUser.id);

  const handleSwitchChild = () => {
    setShowMenu(false);
    navigate('/select-child');
  };

  const handleLogout = async () => {
    setShowMenu(false);
    await supabase.auth.signOut();
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-amber-200/50 sticky top-0 z-40 safe-area-top">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <NavLink to="/home" className="flex items-center gap-2 font-display font-extrabold text-amber-600">
          <BeeChar mood="happy" size="xs" />
          <span className="hidden sm:inline">ATQ Spelling</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Desktop navigation">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-display font-bold transition-colors ${
                  isActive ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:text-amber-600'
                }`
              }
            >
              <span className="mr-1">{item.emoji}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1 text-sm font-bold text-amber-600" title="Current streak">
            <Flame size={16} />
            <span>{data.streak.currentStreak}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-700"
            >
              {currentUser.name?.charAt(0).toUpperCase() ?? '?'}
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-1">
                  <p className="px-3 py-2 text-sm font-bold text-gray-700 border-b border-gray-100">
                    {currentUser.name}
                  </p>
                  <button
                    onClick={handleSwitchChild}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Users size={14} /> Switch child
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
