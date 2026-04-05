import { useSettingsStore } from '@atq/shared';
import { ViewToggle } from '../components/techniques/ViewToggle';
import { ChildTechniquesView } from '../components/techniques/ChildTechniquesView';
import { ParentTechniquesView } from '../components/techniques/ParentTechniquesView';

export { TipsPage as TechniquesPage };

export function TipsPage() {
  const mode = useSettingsStore(s => s.techniquesViewMode);

  return (
    <div className="space-y-4 py-2">
      {/* View toggle */}
      <ViewToggle />

      {/* Content */}
      {mode === 'child' ? <ChildTechniquesView /> : <ParentTechniquesView />}
    </div>
  );
}
