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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Avatar creation state
  const [selectedCharacter, setSelectedCharacter] = useState<typeof AVATAR_CHARACTERS[number]>(AVATAR_CHARACTERS[0]);
  const [selectedColour, setSelectedColour] = useState<typeof AVATAR_COLOURS[number]>(AVATAR_COLOURS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Try to claim any guest checkout payments first (gives webhook extra time),
    // then fetch profile. Non-blocking if claim fails.
    Promise.all([
      supabase.functions.invoke('claim-payment').catch(() => {}),
      supabase.functions.invoke('claim-spelling-payment').catch(() => {}),
    ]).finally(() => {
      fetchProfile();
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: fetchError } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (data) {
        const profile = data as ChildProfile;
        setChildren([{
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
          createdAt: profile.created_at,
          programmeStartDate: profile.programme_start_date,
          examDate: profile.exam_date ?? null,
          hasSeenOnboarding: profile.has_seen_onboarding || localStorage.getItem(`atq_onboarding_seen_${profile.id}`) === 'true',
          hasSeenTutorial: (profile.has_seen_tutorial ?? false) || localStorage.getItem(`atq_tutorial_seen_${profile.id}`) === 'true',
          hasPaid: profile.has_paid ?? false,
          hasPaidSpelling: profile.has_paid_spelling ?? false,
          referralCode: profile.referral_code ?? undefined,
        }]);
        selectChild(profile.id);
        navigate('/home');
      }
      // No profile found — fall through to show creation form
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    setError(null);

    const avatar: AvatarConfig = {
      baseCharacter: selectedCharacter,
      colour: selectedColour,
      accessories: [],
      background: 'bg-focus-100',
    };

    // Use the character label as the stored name (no child name collected)
    const characterName = CHARACTER_LABELS[selectedCharacter];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const referralCode = generateReferralCode();
      const referredBy = localStorage.getItem('atq_referral_code') ?? undefined;

      const { data, error: insertError } = await supabase
        .from('child_profiles')
        .insert({
          parent_id: user.id,
          name: characterName,
          avatar,
          programme_start_date: new Date().toISOString().split('T')[0],
          exam_date: null,
          referral_code: referralCode,
          ...(referredBy ? { referred_by: referredBy } : {}),
        })
        .select()
        .single();

      if (referredBy) {
        localStorage.removeItem('atq_referral_code');
      }

      if (insertError) throw insertError;

      const newProfile = data as ChildProfile;

      let claimedPayment = false;
      try {
        const { data: claimData } = await supabase.functions.invoke('claim-payment');
        if (claimData?.claimed) {
          claimedPayment = true;
          newProfile.has_paid = true;
        }
      } catch {
        console.warn('claim-payment call failed (non-critical)');
      }

      setChildren([{
        id: newProfile.id,
        name: newProfile.name,
        avatar: newProfile.avatar,
        createdAt: newProfile.created_at,
        programmeStartDate: newProfile.programme_start_date,
        examDate: newProfile.exam_date ?? null,
        hasSeenOnboarding: newProfile.has_seen_onboarding,
        hasSeenTutorial: newProfile.has_seen_tutorial ?? false,
        hasPaid: claimedPayment || (newProfile.has_paid ?? false),
        hasPaidSpelling: newProfile.has_paid_spelling ?? false,
        referralCode: newProfile.referral_code ?? undefined,
      }]);

      selectChild(newProfile.id);
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
            Choose your character
          </h1>
          <p className="text-white/80 font-display text-sm">
            Pick the one that&rsquo;s you &mdash; this is your identity in the app
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-card p-6 shadow-lg border border-white/30"
        >
          <div className="space-y-6">
            {/* Character selection */}
            <div>
              <label className="block text-sm font-display font-semibold text-gray-600 mb-3">
                Who are you?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_CHARACTERS.map((char, i) => (
                  <motion.button
                    key={char}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedCharacter(char)}
                    className={`relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all ${
                      selectedCharacter === char
                        ? 'ring-2 ring-purple-400 bg-purple-50 scale-105 shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-4xl">{CHARACTER_EMOJIS[char]}</span>
                    <span className="text-xs font-display font-semibold text-gray-600">
                      {CHARACTER_LABELS[char]}
                    </span>
                    {selectedCharacter === char && (
                      <motion.div
                        layoutId="character-check"
                        className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
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
              <label className="block text-sm font-display font-semibold text-gray-600 mb-3">
                Choose your colour
              </label>
              <div className="flex flex-wrap gap-3 justify-center">
                {AVATAR_COLOURS.map(colour => (
                  <button
                    key={colour}
                    onClick={() => setSelectedColour(colour)}
                    aria-label={`Select colour ${colour}`}
                    aria-pressed={selectedColour === colour}
                    className="w-10 h-10 rounded-full transition-all shadow-md hover:scale-110"
                    style={{
                      backgroundColor: colour,
                      outline: selectedColour === colour ? `3px solid ${colour}` : 'none',
                      outlineOffset: selectedColour === colour ? '3px' : '0',
                      transform: selectedColour === colour ? 'scale(1.2)' : undefined,
                    }}
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
                  border: `3px solid ${selectedColour}`,
                }}
              >
                {CHARACTER_EMOJIS[selectedCharacter]}
              </motion.div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              disabled={saving}
              className={`w-full py-4 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r ${brand.buttonGradient} ${brand.buttonGradientHover} transition-opacity disabled:opacity-50 shadow-md`}
            >
              {saving ? 'Setting up\u2026' : `That\u2019s me \u2014 let\u2019s go! ${CHARACTER_EMOJIS[selectedCharacter]}`}
            </motion.button>
          </div>
        </motion.div>

        {/* Sign out */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLogout}
            className="text-sm text-white/50 hover:text-white/80 font-display font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
