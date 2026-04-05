import { BeeChar } from '../components/mascot/BeeChar';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { useCurrentUser } from '@atq/shared';

export default function SettingsPage() {
  const user = useCurrentUser();
  const childId = user?.id ?? '';

  const ritualEnabled = useSpellingProgressStore(s => s.getRitualEnabled(childId));
  const toggleRitual = useSpellingProgressStore(s => s.toggleRitual);

  return (
    <div className="p-4 space-y-6">
      <h2 className="font-display text-2xl font-bold text-slate-800">Settings</h2>

      <BeeChar mood="happy" size="md" message="Customise your experience!" showSpeechBubble animate />

      <div className="space-y-3">
        {/* Spelling Bee Ritual toggle */}
        <div className="flex items-center justify-between bg-white/80 rounded-xl p-4 border border-slate-200">
          <div>
            <p className="font-semibold text-slate-800">Spelling Bee Ritual</p>
            <p className="text-xs text-slate-500">Say the word out loud before typing</p>
          </div>
          <button
            onClick={() => toggleRitual(childId)}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              ritualEnabled ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-transform ${
                ritualEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* About section */}
      <div className="bg-white/60 rounded-xl p-4 border border-slate-200 text-center space-y-2">
        <p className="text-sm text-slate-500">ATQ Spelling Bee</p>
        <p className="text-xs text-slate-400">Built with love by Tweenage 🐝</p>
      </div>
    </div>
  );
}
