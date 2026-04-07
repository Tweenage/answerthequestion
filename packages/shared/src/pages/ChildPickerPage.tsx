import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';
import { AVATAR_CHARACTERS, AVATAR_COLOURS, CHARACTER_EMOJIS, CHARACTER_LABELS } from '../types/user';
import type { AvatarConfig } from '../types/user';
import { useAppBrand } from '../context/AppBrandContext';
import { LogOut } from 'lucide-react';

interface ChildProfile {
  id: string;
  name: string;
  avatar: AvatarConfig;
  programme_start_date: string;
  exam_date?: string | null;
  has_seen_onboarding: boolean;
  has_seen_tutorial?: boolean;
  has_paid?: boolean;
  has_paid_spelling?: boolean;
  referral_code?: string;
  created_at: string;
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1 for readability
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function ChildPickerPage() {
  const navigate = useNavigate();
  const brand = useAppBrand();
  const { selectChild, setChildren, logout } = useAuthStore();
  const [children, setLocalChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add child form state — pre-fill from payment success page if available
  const [name, setName] = useState(() => {
    const saved = localStorage.getItem('atq_child_name');
    if (saved) localStorage.removeItem('atq_child_name');
    return saved ?? '';
  });
  const [selectedCharacter, setSelectedCharacter] = useState<typeof AVATAR_CHARACTERS[number]>(AVATAR_CHARACTERS[0]);
  const [selectedColour, setSelectedColour] = useState<typeof AVATAR_COLOURS[number]>(AVATAR_COLOURS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Try to claim any guest checkout payments first (gives webhook extra time),
    // then fetch children. Non-blocking if claim fails.
    // Both ATQ and Spelling claim functions are called — each is a no-op
    // if the corresponding table doesn't exist or has no unclaimed payments.
    Promise.all([
      supabase.functions.invoke('claim-payment').catch(() => {}),
      supabase.functions.invoke('claim-spelling-payment').catch(() => {}),
    ]).finally(() => {
      fetchChildren();
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchChildren = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: fetchError } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const profiles = (data ?? []) as ChildProfile[];
      setLocalChildren(profiles);
      setChildren(profiles.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        createdAt: p.created_at,
        programmeStartDate: p.programme_start_date,
        examDate: p.exam_date ?? null,
        hasSeenOnboarding: p.has_seen_onboarding || localStorage.getItem(`atq_onboarding_seen_${p.id}`) === 'true',
        hasSeenTutorial: (p.has_seen_tutorial ?? false) || localStorage.getItem(`atq_tutorial_seen_${p.id}`) === 'true',
        hasPaid: p.has_paid ?? false,
        hasPaidSpelling: p.has_paid_spelling ?? false,
        referralCode: p.referral_code ?? undefined,
      })));

      // Auto-show add form if no children yet
      if (profiles.length === 0) {
        setIsAdding(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChild = (childId: string) => {
    selectChild(childId);
    navigate('/home');
  };

  const handleAddChild = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);

    const avatar: AvatarConfig = {
      baseCharacter: selectedCharacter,
      colour: selectedColour,
      accessories: [],
      background: 'bg-focus-100',
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate a unique referral code for this child
      const referralCode = generateReferralCode();

      // Check if this signup was referred by another user
      const referredBy = localStorage.getItem('atq_referral_code') ?? undefined;

      const { data, error: insertError } = await supabase
        .from('child_profiles')
        .insert({
          parent_id: user.id,
          name: name.trim(),
          avatar,
          programme_start_date: new Date().toISOString().split('T')[0],
          exam_date: null,
          referral_code: referralCode,
          ...(referredBy ? { referred_by: referredBy } : {}),
        })
        .select()
        .single();

      // Clear the referral code from localStorage after use
      if (referredBy) {
        localStorage.removeItem('atq_referral_code');
      }

      if (insertError) throw insertError;

      const newChild = data as ChildProfile;

      // Try to claim any guest checkout payment for this email.
      // This links unclaimed payments and marks child profiles as paid.
      let claimedPayment = false;
      try {
        const { data: claimData } = await supabase.functions.invoke('claim-payment');
        if (claimData?.claimed) {
          claimedPayment = true;
          newChild.has_paid = true;
          // Crib sheet flag is now sourced from Supabase payments table — no localStorage needed
        }
      } catch {
        // Non-critical — if claim fails, the user can still use the app (just not paid)
        console.warn('claim-payment call failed (non-critical)');
      }

      // Update local state
      setLocalChildren(prev => [...prev, newChild]);
      setChildren([...children.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        createdAt: p.created_at,
        programmeStartDate: p.programme_start_date,
        examDate: p.exam_date ?? null,
        hasSeenOnboarding: p.has_seen_onboarding,
        hasSeenTutorial: p.has_seen_tutorial ?? false,
        hasPaid: claimedPayment || (p.has_paid ?? false),
        hasPaidSpelling: p.has_paid_spelling ?? false,
        referralCode: p.referral_code ?? undefined,
      })), {
        id: newChild.id,
        name: newChild.name,
        avatar: newChild.avatar,
        createdAt: newChild.created_at,
        programmeStartDate: newChild.programme_start_date,
        examDate: newChild.exam_date ?? null,
        hasSeenOnboarding: newChild.has_seen_onboarding,
        hasSeenTutorial: newChild.has_seen_tutorial ?? false,
        hasPaid: newChild.has_paid ?? false,
        hasPaidSpelling: newChild.has_paid_spelling ?? false,
        referralCode: newChild.referral_code ?? undefined,
      }]);

      // Auto-select the new child
      selectChild(newChild.id);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-4xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex justify-center mb-3">
            {brand.mascot}
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white drop-shadow-lg mb-1">
            Who's practising today?
          </h1>
          <p className="text-white/90 font-display text-sm">
            Choose a player or add a new one
          </p>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-sm font-display font-semibold bg-red-50 p-3 rounded-lg mb-4"
          >
            {error}
          </motion.p>
        )}

        {!isAdding ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-card p-6 shadow-lg border border-white/30"
          >
            {/* Existing children */}
            <div className="space-y-3 mb-5">
              {children.map((child, i) => (
                <motion.button
                  key={child.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleSelectChild(child.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all text-left group"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: (child.avatar.colour || '#8b5cf6') + '25',
                      borderColor: child.avatar.colour || '#8b5cf6',
                      borderWidth: 2,
                    }}
                  >
                    {CHARACTER_EMOJIS[child.avatar.baseCharacter] || child.name[0]}
                  </div>
                  <span className="font-display font-bold text-lg flex-1 text-gray-800">
                    {child.name}
                  </span>
                  <span className={`${brand.accentColor} font-display text-sm font-semibold`}>
                    Play →
                  </span>
                </motion.button>
              ))}
            </div>

            <button
              onClick={() => setIsAdding(true)}
              className={`w-full py-3 rounded-button font-display font-bold ${brand.accentColor} border-2 border-dashed border-current hover:bg-white/50 transition-all`}
            >
              + Add New Player
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full mt-4 py-2 text-center text-sm text-gray-400 hover:text-gray-600 font-display font-semibold flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-card p-6 shadow-lg border border-white/30"
          >
            <h2 className={`font-display text-xl font-bold ${brand.headingColor} mb-5 text-center`}>
              Create a Player Profile
            </h2>

            <div className="space-y-5">
              {/* Name input */}
              <div>
                <label htmlFor="child-name" className="block text-sm font-display font-semibold text-gray-600 mb-1.5">
                  What's your name?
                </label>
                <input
                  id="child-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Type your name here..."
                  maxLength={30}
                  className={`w-full px-4 py-3 rounded-button border border-gray-300 text-lg font-display focus:outline-none focus:ring-2 ${brand.focusRing}`}
                  autoFocus
                />
              </div>

              {/* Character selection */}
              <div>
                <label className="block text-sm font-display font-semibold text-gray-600 mb-2">
                  Choose your lucky charm!
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {AVATAR_CHARACTERS.map((char, i) => (
                    <motion.button
                      key={char}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedCharacter(char)}
                      className={`relative flex flex-col items-center gap-1 py-3 px-2 rounded-2xl transition-all ${
                        selectedCharacter === char
                          ? 'ring-3 ring-current bg-white/50 scale-105 shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100 hover:shadow-sm'
                      }`}
                    >
                      <span className="text-4xl">{CHARACTER_EMOJIS[char]}</span>
                      <span className="text-xs font-display font-semibold text-gray-500">
                        {CHARACTER_LABELS[char]}
                      </span>
                      {selectedCharacter === char && (
                        <motion.div
                          layoutId="character-check"
                          className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-xs">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Colour selection */}
              <div>
                <label className="block text-sm font-display font-semibold text-gray-600 mb-2">
                  Choose your colour!
                </label>
                <div className="flex gap-3 justify-center">
                  {AVATAR_COLOURS.map(colour => (
                    <motion.button
                      key={colour}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColour(colour)}
                      aria-label={`Select colour ${colour}`}
                      aria-pressed={selectedColour === colour}
                      className={`w-11 h-11 rounded-full transition-all shadow-sm ${
                        selectedColour === colour
                          ? 'ring-3 ring-offset-2 ring-current scale-110'
                          : 'hover:shadow-md'
                      }`}
                      style={{ backgroundColor: colour }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="flex justify-center">
                <motion.div
                  key={`${selectedCharacter}-${selectedColour}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shadow-inner"
                  style={{
                    backgroundColor: selectedColour + '25',
                    borderColor: selectedColour,
                    borderWidth: 2,
                  }}
                >
                  {CHARACTER_EMOJIS[selectedCharacter]}
                </motion.div>
              </div>

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddChild}
                disabled={!name.trim() || saving}
                className={`w-full py-4 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r ${brand.buttonGradient} ${brand.buttonGradientHover} transition-opacity disabled:opacity-50 shadow-md`}
              >
                {saving ? 'Creating...' : "Let's Go!"}
              </motion.button>

              {children.length > 0 && (
                <button
                  onClick={() => setIsAdding(false)}
                  className={`w-full text-center text-sm ${brand.accentColor} ${brand.accentHoverColor} font-display font-semibold`}
                >
                  ← Back to player list
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
