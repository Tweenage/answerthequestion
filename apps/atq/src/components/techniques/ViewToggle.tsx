import { useSettingsStore } from '@atq/shared';

export function ViewToggle() {
  const mode = useSettingsStore(s => s.techniquesViewMode);
  const setMode = useSettingsStore(s => s.setTechniquesViewMode);

  return (
    <div className="flex gap-2 justify-center">
      <button
        onClick={() => setMode('child')}
        className={`px-4 py-2 rounded-full text-sm font-display font-bold transition-all ${
          mode === 'child'
            ? 'bg-white text-purple-600 shadow-sm'
            : 'bg-white/20 text-white hover:bg-white/30'
        }`}
      >
        For Kids
      </button>
      <button
        onClick={() => setMode('parent')}
        className={`px-4 py-2 rounded-full text-sm font-display font-bold transition-all ${
          mode === 'parent'
            ? 'bg-white text-purple-600 shadow-sm'
            : 'bg-white/20 text-white hover:bg-white/30'
        }`}
      >
        For Parents
      </button>
    </div>
  );
}
