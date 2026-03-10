import { Calendar } from 'lucide-react';
import { HootInline } from '../mascot/ProfessorHoot';

interface ExamDatePickerProps {
  onSet: (date: string) => void;
}

export function ExamDatePicker({ onSet }: ExamDatePickerProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-card p-4 shadow-sm border border-purple-100">
      <div className="flex items-center gap-3 mb-3">
        <HootInline size="sm" />
        <div>
          <p className="font-display font-bold text-gray-800 text-sm">📅 When is your exam?</p>
          <p className="text-xs text-gray-500">Set a date to see your countdown!</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
        <input
          type="date"
          onChange={(e) => {
            if (e.target.value) onSet(e.target.value);
          }}
          className="flex-1 p-2.5 rounded-xl border-2 border-purple-200 font-display text-sm text-gray-700 focus:border-purple-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
