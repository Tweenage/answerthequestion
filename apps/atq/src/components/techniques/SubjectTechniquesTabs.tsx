import { useState } from 'react';
import type { Subject } from '../../types/question';
import { SUBJECT_TECHNIQUES } from '../../data/techniques';
import { TechniqueCard } from './TechniqueCard';

const TABS: { key: Subject; label: string; emoji: string }[] = [
  { key: 'english', label: 'Eng', emoji: '📖' },
  { key: 'maths', label: 'Maths', emoji: '🔢' },
  { key: 'reasoning', label: 'Reasoning', emoji: '🧩' },
];

interface SubjectTechniquesTabsProps {
  mode: 'child' | 'parent';
}

export function SubjectTechniquesTabs({ mode }: SubjectTechniquesTabsProps) {
  const [activeSubject, setActiveSubject] = useState<Subject>('english');
  const techniques = SUBJECT_TECHNIQUES[activeSubject];

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-display font-bold text-white text-base">
          {mode === 'child' ? '📚 Tips By Subject' : 'Subject-Specific Approaches'}
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSubject(tab.key)}
            className={`flex-1 py-2 rounded-full text-xs font-display font-bold transition-all ${
              activeSubject === tab.key
                ? 'bg-white text-purple-600 shadow-sm'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {techniques.map((tech, i) => (
          <TechniqueCard
            key={tech.id}
            emoji={tech.emoji}
            title={tech.title}
            defaultOpen={i === 0}
          >
            <p className="text-gray-600 text-sm leading-relaxed">
              {mode === 'child' ? tech.childTip : tech.parentExplanation}
            </p>
          </TechniqueCard>
        ))}
      </div>
    </div>
  );
}
