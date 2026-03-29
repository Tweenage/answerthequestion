import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useDyslexiaMode } from '../hooks/useDyslexiaMode';
import { supabase } from '../lib/supabase';
import { AVATAR_CHARACTERS, AVATAR_COLOURS } from '../types/user';

const CHARACTER_EMOJIS: Record<string, string> = {
  cat: '🐱',
  owl: '🦉',
  robot: '🤖',
  unicorn: '🦄',
  dragon: '🐉',
  fox: '🦊',
};

const CHARACTER_LABELS: Record<string, string> = {
  cat: 'Cat',
  owl: 'Owl',
  robot: 'Robot',
  unicorn: 'Unicorn',
  dragon: 'Dragon',
  fox: 'Fox',
};

export function SettingsPage() {
  const currentUser = useCurrentUser();
  const { dyslexiaMode, toggleDyslexiaMode } = useDyslexiaMode();
  const updateChildLocally = useAuthStore(s => s.updateChildLocally);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  const [selectedCharacter, setSelectedCharacter] = useState(currentUser?.avatar.baseCharacter ?? 'owl');
  const [selectedColour, setSelectedColour] = useState(currentUser?.avatar.colour ?? '#8b5cf6');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (!currentUser) return null;

  const hasChanges =
    selectedCharacter !== currentUser.avatar.baseCharacter ||
    selectedColour !== currentUser.avatar.colour;

  const handleSave = async () => {
    setSaving(true);
    const newAvatar = {
      ...currentUser.avatar,
      baseCharacter: selectedCharacter,
      colour: selectedColour,
    };

    // Update locally immediately
    updateChildLocally(currentUser.id, { avatar: newAvatar });

    // Persist to Supabase
    await supabase
      .from('child_profiles')
      .update({ avatar: newAvatar })
      .eq('id', currentUser.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="font-display font-extrabold text-xl text-white drop-shadow-md text-center">
        ⚙️ Settings
      </h2>

      {/* Dyslexia-friendly mode */}
      <div className="bg-white/90 backdrop-blur-sm rounded-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-gray-800">Dyslexia-friendly mode</h3>
            <p className="text-sm text-gray-500 font-display mt-1">
              During practice: Lexend font, crème background and wider spacing. Timer extended by 25%.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={dyslexiaMode}
            onClick={toggleDyslexiaMode}
            className={`relative shrink-0 ml-4 w-12 h-7 rounded-full transition-colors duration-200 ${
              dyslexiaMode ? 'bg-purple-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                dyslexiaMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Avatar & Colour */}
      <div className="bg-white/90 backdrop-blur-sm rounded-card p-4 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-gray-800">Your Avatar</h3>

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

        {/* Character selection */}
        <div>
          <label className="block text-sm font-display font-semibold text-gray-600 mb-2">
            Choose your lucky charm
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {AVATAR_CHARACTERS.map(char => (
              <button
                key={char}
                onClick={() => setSelectedCharacter(char)}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-2xl transition-all ${
                  selectedCharacter === char
                    ? 'ring-3 ring-purple-400 bg-purple-50 scale-105 shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 hover:shadow-sm'
                }`}
              >
                <span className="text-3xl">{CHARACTER_EMOJIS[char]}</span>
                <span className="text-xs font-display font-semibold text-gray-500">
                  {CHARACTER_LABELS[char]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Colour selection */}
        <div>
          <label className="block text-sm font-display font-semibold text-gray-600 mb-2">
            Choose your colour
          </label>
          <div className="flex gap-3 justify-center flex-wrap">
            {AVATAR_COLOURS.map(colour => (
              <button
                key={colour}
                onClick={() => setSelectedColour(colour)}
                aria-label={`Select colour ${colour}`}
                className={`w-10 h-10 rounded-full transition-all shadow-sm ${
                  selectedColour === colour
                    ? 'ring-3 ring-offset-2 ring-purple-400 scale-110'
                    : 'hover:shadow-md'
                }`}
                style={{ backgroundColor: colour }}
              />
            ))}
          </div>
        </div>

        {/* Save button */}
        {hasChanges && (
          <motion.button
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-display font-bold rounded-button shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        )}
        {saved && (
          <p className="text-center text-sm font-display font-bold text-green-600">
            ✅ Saved!
          </p>
        )}
      </div>

      {/* Danger Zone */}
      <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-card p-4 shadow-sm border-2 border-red-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-red-500 text-base">⚠️</span>
          <h3 className="font-display font-bold text-sm text-red-600 uppercase tracking-wide">Danger Zone</h3>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-display font-bold transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete my account
        </button>
        <p className="text-xs text-gray-400 font-display mt-1">
          Permanently removes your account, all child profiles, and all progress data.
        </p>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl"
          >
            <div className="text-center mb-3">
              <span className="text-4xl">⚠️</span>
              <h3 className="font-display font-extrabold text-lg text-gray-900 mt-2">
                Delete your account?
              </h3>
              <p className="text-sm text-gray-500 font-display mt-2">
                This will permanently delete your account, all child profiles, progress, badges, and payment records. This cannot be undone.
              </p>
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-500 font-display font-bold block mb-1">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-display focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            {deleteError && (
              <p className="text-sm text-red-500 font-display mb-3">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                  setDeleteError('');
                }}
                className="flex-1 py-2.5 rounded-xl font-display font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                onClick={async () => {
                  setDeleteLoading(true);
                  setDeleteError('');
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) throw new Error('Not logged in');

                    const { data, error } = await supabase.functions.invoke('delete-account', {
                      body: { confirm: 'DELETE_MY_ACCOUNT' },
                      headers: {
                        Authorization: `Bearer ${session.access_token}`,
                      },
                    });
                    if (error) {
                      // Extract real error message from response
                      const msg = data?.error || error.message || 'Unknown error';
                      throw new Error(msg);
                    }

                    await supabase.auth.signOut();
                    logout();
                    navigate('/');
                  } catch (err) {
                    setDeleteError(
                      err instanceof Error ? err.message : 'Something went wrong. Please try again.'
                    );
                    setDeleteLoading(false);
                  }
                }}
                className={`flex-1 py-2.5 rounded-xl font-display font-bold text-sm text-white transition-colors ${
                  deleteConfirmText === 'DELETE' && !deleteLoading
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {deleteLoading ? 'Deleting...' : 'Delete forever'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
