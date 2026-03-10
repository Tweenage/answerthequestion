import { Volume2, VolumeX } from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';

export function SoundToggle() {
  const soundEnabled = useSettingsStore(s => s.soundEnabled);
  const setSoundEnabled = useSettingsStore(s => s.setSoundEnabled);

  return (
    <button
      onClick={() => setSoundEnabled(!soundEnabled)}
      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 font-display transition-colors"
    >
      {soundEnabled ? (
        <Volume2 className="w-4 h-4 text-purple-500" />
      ) : (
        <VolumeX className="w-4 h-4 text-gray-400" />
      )}
      Sound {soundEnabled ? 'on' : 'off'}
    </button>
  );
}
