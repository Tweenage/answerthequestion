import { NavLink, useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { supabase } from '../../lib/supabase';
import { Flame, Star, LogOut, Users, BarChart3 } from 'lucide-react';
import { HootInline } from '../mascot/ProfessorHoot';
import { SoundToggle } from '../settings/SoundToggle';
import { navItems } from '../../data/navItems';

const CHARACTER_EMOJIS: Record<string, string> = {
  cat: '🐱',
  owl: '🦉',
  robot: '🤖',
  unicorn: '🦄',
  dragon: '🐉',
  fox: '🦊',
};

export function Header() {
  const currentUser = useCurrentUser();
  const logout = useAuthStore(s => s.logout);
  const getProgress = useProgressStore(s => s.getProgress);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  if (!currentUser) return null;

  const progress = getProgress(currentUser.id);

  const handleSwitchChild = () => {
    setShowMenu(false);
    navigate('/select-child');
  };

  const handleLogout = async () => {
    setShowMenu(false);
    await supabase.auth.signOut();
    logout();
    navigate('/auth');
  };

  return (
    <header className="bg-white/20 backdrop-blur-md border-b border-white/20 px-4 py-2 sticky top-0 z-40 safe-area-top">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 shrink-0">
          <HootInline size="sm" />
          <h1 className="font-display font-bold text-lg text-white drop-shadow-sm whitespace-nowrap">
            Read the Question!
          </h1>
        </div>

        {/* Desktop navigation */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-display font-bold transition-all focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${
                  isActive
                    ? 'text-purple-700 bg-white/90 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/20'
                }`
              }
            >
              <span className="text-base" aria-hidden="true">{item.emoji}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {/* Streak */}
          <div className="flex items-center gap-1 text-yellow-300 font-display font-bold text-sm drop-shadow-sm">
            <Flame className="w-4 h-4" />
            <span>{progress.streak.currentStreak}</span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-1 text-white font-display font-bold text-sm drop-shadow-sm">
            <Star className="w-4 h-4 text-yellow-300" />
            <span>Lv {progress.level}</span>
          </div>

          {/* Avatar with dropdown menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              aria-expanded={showMenu}
              aria-haspopup="true"
              aria-label="User menu"
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm bg-white/30 border-2 border-white/50 hover:bg-white/40 transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            >
              {CHARACTER_EMOJIS[currentUser.avatar.baseCharacter] || currentUser.name[0]}
            </button>

            {showMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                {/* Menu */}
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50" role="menu" aria-label="User menu">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="font-display font-bold text-gray-800 text-base">
                      {currentUser.name}
                    </p>
                  </div>
                  <SoundToggle />
                  <button
                    role="menuitem"
                    onClick={() => { setShowMenu(false); navigate('/parent-dashboard'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 font-display font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-[-2px]"
                  >
                    <BarChart3 className="w-5 h-5 text-purple-500" aria-hidden="true" />
                    Progress Report
                  </button>
                  <div className="border-t border-gray-100 my-1" role="separator" />
                  <button
                    role="menuitem"
                    onClick={handleSwitchChild}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 font-display font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-[-2px]"
                  >
                    <Users className="w-5 h-5 text-purple-500" aria-hidden="true" />
                    Switch Player
                  </button>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 font-display font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-[-2px]"
                  >
                    <LogOut className="w-5 h-5 text-red-400" aria-hidden="true" />
                    Sign Out
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
