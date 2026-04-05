import { differenceInCalendarDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Pencil } from 'lucide-react';
import { useState } from 'react';

interface ExamCountdownProps {
  examDate: string;
  childName: string;
  onChangeDate: (date: string | null) => void;
}

export function ExamCountdown({ examDate, onChangeDate }: ExamCountdownProps) {
  const [editing, setEditing] = useState(false);
  const daysRemaining = differenceInCalendarDays(new Date(examDate), new Date());

  const getBg = () => {
    if (daysRemaining <= 0) return 'from-emerald-400/70 to-green-500/70';
    if (daysRemaining <= 7) return 'from-red-500/70 to-rose-700/70';
    if (daysRemaining <= 30) return 'from-orange-500/70 to-rose-500/70';
    return 'from-fuchsia-400 to-pink-600';
  };

  if (editing) {
    return (
      <div className="bg-white rounded-card p-4 shadow-sm border border-focus-100">
        <label className="font-display font-bold text-sm text-gray-700 block mb-2">
          <Calendar className="w-4 h-4 inline mr-1.5" />
          When is your exam?
        </label>
        <input
          type="date"
          defaultValue={examDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => {
            if (e.target.value) {
              onChangeDate(e.target.value);
              setEditing(false);
            }
          }}
          className="w-full p-3 rounded-xl border-2 border-purple-200 font-display text-gray-700 focus:border-purple-500 focus:outline-none"
        />
        <button
          onClick={() => setEditing(false)}
          className="mt-2 text-sm text-gray-500 font-display hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-card overflow-hidden bg-gradient-to-r ${getBg()} backdrop-blur-sm`}
    >
      <div className="flex items-center gap-3 py-2.5 px-4">
        {daysRemaining > 0 ? (
          <p className="font-display font-bold text-sm text-white flex-1">
            📅 <span className="font-extrabold">{daysRemaining}</span> {daysRemaining === 1 ? 'day' : 'days'} to go
          </p>
        ) : (
          <p className="font-display font-bold text-sm text-white flex-1">
            🎉 Today's the day!
          </p>
        )}
        <button
          onClick={() => setEditing(true)}
          aria-label="Edit exam date"
          className="w-7 h-7 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors shrink-0"
        >
          <Pencil className="w-3 h-3 text-white" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
}
