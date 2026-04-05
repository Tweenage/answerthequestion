import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useCurrentUser } from '@atq/shared';
import { useProgressStore } from '../stores/useProgressStore';
import { ProfessorHoot } from '../components/mascot/ProfessorHoot';

/**
 * Generate and download an A4-landscape PDF certificate.
 * Uses jsPDF drawing primitives — no external images or fonts required.
 */
function generateCertificatePdf(childName: string, completionDate: string) {
  // A4 landscape: 297mm × 210mm
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297;
  const H = 210;

  // ─── Background ───────────────────────────────────────────────
  doc.setFillColor(253, 251, 255); // very light purple
  doc.rect(0, 0, W, H, 'F');

  // ─── Outer border — gold ──────────────────────────────────────
  doc.setDrawColor(180, 140, 50);
  doc.setLineWidth(2);
  doc.rect(8, 8, W - 16, H - 16);

  // ─── Inner border — purple ────────────────────────────────────
  doc.setDrawColor(124, 58, 237); // purple-600
  doc.setLineWidth(0.8);
  doc.rect(13, 13, W - 26, H - 26);

  // ─── Corner rosettes (decorative circles at each corner) ─────
  const corners = [
    [13, 13],
    [W - 13, 13],
    [13, H - 13],
    [W - 13, H - 13],
  ];
  for (const [cx, cy] of corners) {
    doc.setFillColor(180, 140, 50);
    doc.circle(cx, cy, 3, 'F');
    doc.setFillColor(124, 58, 237);
    doc.circle(cx, cy, 1.8, 'F');
    doc.setFillColor(255, 215, 0);
    doc.circle(cx, cy, 0.8, 'F');
  }

  // ─── Top decorative line ──────────────────────────────────────
  const lineY = 42;
  doc.setDrawColor(180, 140, 50);
  doc.setLineWidth(0.4);
  doc.line(60, lineY, W / 2 - 20, lineY);
  doc.line(W / 2 + 20, lineY, W - 60, lineY);
  // Diamond in centre
  const cx = W / 2;
  doc.setFillColor(180, 140, 50);
  doc.triangle(cx, lineY - 3, cx - 3, lineY, cx, lineY + 3, 'F');
  doc.triangle(cx, lineY - 3, cx + 3, lineY, cx, lineY + 3, 'F');

  // ─── Professor Hoot (owl emoji) ───────────────────────────────
  doc.setFontSize(28);
  doc.text('🦉', W / 2, 34, { align: 'center' });

  // ─── "AnswerTheQuestion!" branding ────────────────────────────
  doc.setFontSize(9);
  doc.setTextColor(124, 58, 237);
  doc.setFont('helvetica', 'normal');
  doc.text('AnswerTheQuestion!', W / 2, 48, { align: 'center' });

  // ─── "Certificate of Achievement" ─────────────────────────────
  doc.setFontSize(28);
  doc.setTextColor(55, 30, 100);
  doc.setFont('helvetica', 'bold');
  doc.text('Certificate of Achievement', W / 2, 62, { align: 'center' });

  // ─── Divider ──────────────────────────────────────────────────
  doc.setDrawColor(180, 140, 50);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - 40, 67, W / 2 + 40, 67);

  // ─── "This certifies that" ────────────────────────────────────
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('This certifies that', W / 2, 78, { align: 'center' });

  // ─── Child's name ─────────────────────────────────────────────
  doc.setFontSize(26);
  doc.setTextColor(124, 58, 237);
  doc.setFont('helvetica', 'bold');
  doc.text(childName, W / 2, 92, { align: 'center' });

  // ─── Underline below name ─────────────────────────────────────
  const nameWidth = doc.getTextWidth(childName);
  doc.setDrawColor(180, 140, 50);
  doc.setLineWidth(0.3);
  doc.line(W / 2 - nameWidth / 2 - 5, 95, W / 2 + nameWidth / 2 + 5, 95);

  // ─── Achievement text ─────────────────────────────────────────
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.text('has successfully completed the 12-week', W / 2, 106, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(55, 30, 100);
  doc.setFont('helvetica', 'bold');
  doc.text('AnswerTheQuestion! CLEAR Method Programme', W / 2, 115, { align: 'center' });

  // ─── CLEAR Method letters ─────────────────────────────────────
  const letters = [
    { letter: 'C', label: 'Calm', color: [124, 58, 237] },
    { letter: 'L', label: 'Look', color: [147, 51, 234] },
    { letter: 'E', label: 'Eliminate', color: [168, 85, 247] },
    { letter: 'A', label: 'Answer', color: [180, 140, 50] },
    { letter: 'R', label: 'Review', color: [217, 119, 6] },
  ];
  const startX = W / 2 - 60;
  const letterSpacing = 30;
  const letterY = 130;
  for (let i = 0; i < letters.length; i++) {
    const lx = startX + i * letterSpacing;
    const { letter, label, color } = letters[i];
    // Circle background
    doc.setFillColor(color[0], color[1], color[2]);
    doc.circle(lx, letterY, 5, 'F');
    // Letter
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(letter, lx, letterY + 1.2, { align: 'center' });
    // Label
    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(label, lx, letterY + 9, { align: 'center' });
  }

  // ─── Date + Signature ─────────────────────────────────────────
  const footerY = 158;

  // Date (left)
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('DATE', W / 2 - 50, footerY, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(completionDate, W / 2 - 50, footerY + 6, { align: 'center' });
  doc.setDrawColor(180, 140, 50);
  doc.setLineWidth(0.3);
  doc.line(W / 2 - 70, footerY + 8, W / 2 - 30, footerY + 8);

  // Gold/purple seal (centre)
  const sealX = W / 2;
  const sealY = footerY + 3;
  // Outer gold circle
  doc.setFillColor(200, 160, 50);
  doc.circle(sealX, sealY, 12, 'F');
  // Inner purple circle
  doc.setFillColor(124, 58, 237);
  doc.circle(sealX, sealY, 9, 'F');
  // Inner gold circle
  doc.setFillColor(220, 180, 60);
  doc.circle(sealX, sealY, 6.5, 'F');
  // Star in seal
  doc.setFontSize(14);
  doc.setTextColor(124, 58, 237);
  doc.text('★', sealX, sealY + 2, { align: 'center' });
  // Ribbon tails
  doc.setFillColor(124, 58, 237);
  doc.triangle(sealX - 6, sealY + 11, sealX - 10, sealY + 24, sealX - 2, sealY + 20, 'F');
  doc.triangle(sealX + 6, sealY + 11, sealX + 10, sealY + 24, sealX + 2, sealY + 20, 'F');

  // Signed (right)
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('SIGNED', W / 2 + 50, footerY, { align: 'center' });
  doc.setFontSize(16);
  doc.text('🦉', W / 2 + 50, footerY + 7, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  doc.text('Professor Hoot', W / 2 + 50, footerY + 12, { align: 'center' });
  doc.setDrawColor(180, 140, 50);
  doc.setLineWidth(0.3);
  doc.line(W / 2 + 30, footerY + 14, W / 2 + 70, footerY + 14);

  // ─── Stars at bottom ──────────────────────────────────────────
  doc.setFontSize(12);
  doc.setTextColor(200, 160, 50);
  doc.text('⭐  ⭐  ⭐  ⭐  ⭐', W / 2, H - 20, { align: 'center' });

  // ─── Download ─────────────────────────────────────────────────
  const safeFilename = childName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
  doc.save(`${safeFilename}-Certificate.pdf`);
}

export function CertificatePage() {
  const currentUser = useCurrentUser();
  const getProgress = useProgressStore(s => s.getProgress);
  const [fullName, setFullName] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  if (!currentUser) return null;

  const progress = getProgress(currentUser.id);
  const programmeComplete = progress.currentWeek > 12;

  // Pre-fill name from profile on first render
  if (!fullName && currentUser.name) {
    // Use a function that doesn't trigger re-render loop
    setTimeout(() => setFullName(currentUser.name), 0);
  }

  // ─── Not yet complete — encouragement screen ──────────────────
  if (!programmeComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ProfessorHoot mood="encouraging" size="xl" animate showSpeechBubble={false} />
        <h2 className="font-display font-extrabold text-xl text-white drop-shadow-md mt-4 mb-2">
          Keep going, {currentUser.name}!
        </h2>
        <p className="text-white/85 font-display text-sm max-w-sm leading-relaxed mb-4">
          You&rsquo;re on Week {progress.currentWeek} of 12. Complete all 12 weeks to earn your Certificate of Achievement!
        </p>
        <Link
          to="/home"
          className="inline-block px-6 py-3 rounded-button font-display font-bold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-600 transition-all shadow-lg"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // ─── Completion date ──────────────────────────────────────────
  const lastSession = progress.sessions
    .filter(s => s.completed)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const completionDate = lastSession
    ? new Date(lastSession.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleDownload = () => {
    if (!fullName.trim()) return;
    generateCertificatePdf(fullName.trim(), completionDate);
    setDownloaded(true);
  };

  // ─── Celebration screen ───────────────────────────────────────
  return (
    <div className="space-y-6 py-2 pb-24 lg:pb-6">
      {/* Celebration header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-3">
          <ProfessorHoot mood="celebrating" size="xl" animate showSpeechBubble={false} />
        </div>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
        >
          <h1 className="font-display text-3xl font-extrabold text-white drop-shadow-lg mb-2">
            🎉 Congratulations! 🎉
          </h1>
        </motion.div>
        <p className="text-white/90 font-display text-base max-w-sm mx-auto leading-relaxed">
          {currentUser.name} has completed the entire 12-week CLEAR Method Programme!
        </p>
      </motion.div>

      {/* Achievement badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center gap-4"
      >
        {['🏆', '⭐', '🦉', '⭐', '🏆'].map((emoji, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5 + i * 0.1, type: 'spring', bounce: 0.6 }}
            className="text-3xl"
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>

      {/* Certificate download card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/95 backdrop-blur-sm rounded-card p-6 shadow-lg border border-white/30 max-w-md mx-auto"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="font-display text-lg font-bold text-gray-800">
            Download Your Certificate
          </h2>
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>

        <p className="text-sm text-gray-600 font-display text-center mb-4 leading-relaxed">
          Type your child&rsquo;s full name below &mdash; this is what will appear on their certificate.
        </p>

        {/* Name input */}
        <div className="mb-4">
          <label htmlFor="cert-name" className="block text-sm font-display font-semibold text-gray-600 mb-1.5">
            Full name for certificate
          </label>
          <input
            id="cert-name"
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="e.g. Eleanor Rose Smith"
            className="w-full px-4 py-3 rounded-button border-2 border-purple-200 text-lg font-display focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-center"
            autoComplete="off"
          />
        </div>

        {/* Completion date */}
        <p className="text-xs text-gray-400 font-display text-center mb-4">
          Date of completion: <strong className="text-gray-600">{completionDate}</strong>
        </p>

        {/* Download button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          disabled={!fullName.trim()}
          className="w-full py-4 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 transition-opacity disabled:opacity-40 shadow-lg flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Certificate (PDF)
        </motion.button>

        {/* Success message after download */}
        {downloaded && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-600 text-sm font-display font-semibold bg-green-50 p-3 rounded-lg mt-3 text-center"
          >
            ✅ Certificate downloaded! Print it out and put it somewhere special.
          </motion.p>
        )}
      </motion.div>

      {/* Back link */}
      <div className="text-center">
        <Link
          to="/home"
          className="inline-flex items-center gap-1.5 text-sm text-white/80 font-display hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
