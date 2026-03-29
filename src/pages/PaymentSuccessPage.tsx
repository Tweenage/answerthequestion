import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ProfessorHoot } from '../components/mascot/ProfessorHoot';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../lib/supabase';

/**
 * Generate and download a one-page A4 CLEAR Method crib sheet PDF.
 * Uses jsPDF drawing primitives — no external images or fonts required.
 */
function generateCribSheetPdf() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const H = 297;

  // ─── Background ───────────────────────────────────────────────
  doc.setFillColor(253, 251, 255); // very light purple
  doc.rect(0, 0, W, H, 'F');

  // ─── Border ───────────────────────────────────────────────────
  doc.setDrawColor(124, 58, 237); // purple-600
  doc.setLineWidth(1.5);
  doc.rect(8, 8, W - 16, H - 16);
  doc.setDrawColor(200, 160, 50); // gold
  doc.setLineWidth(0.5);
  doc.rect(11, 11, W - 22, H - 22);

  // ─── Header ───────────────────────────────────────────────────
  doc.setFontSize(20);
  doc.text('🦉', W / 2, 26, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(124, 58, 237);
  doc.setFont('helvetica', 'bold');
  doc.text('AnswerTheQuestion!', W / 2, 33, { align: 'center' });

  doc.setFontSize(24);
  doc.setTextColor(55, 30, 100);
  doc.setFont('helvetica', 'bold');
  doc.text('The CLEAR Method', W / 2, 46, { align: 'center' });

  // TM symbol
  doc.setFontSize(8);
  doc.setTextColor(124, 58, 237);
  const titleWidth = doc.getTextWidth('The CLEAR Method');
  doc.setFont('helvetica', 'normal');
  // Position TM slightly adjusted
  doc.text('TM', W / 2 + titleWidth / 2 + 1, 40, { align: 'left' });

  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('5 Steps to Answer Every Question Properly', W / 2, 55, { align: 'center' });

  // ─── Divider ──────────────────────────────────────────────────
  doc.setDrawColor(200, 160, 50);
  doc.setLineWidth(0.5);
  doc.line(40, 60, W - 40, 60);

  // ─── The 5 CLEAR steps ────────────────────────────────────────
  const steps = [
    {
      letter: 'C',
      name: 'Calm',
      emoji: '🧘',
      color: [124, 58, 237] as [number, number, number],
      instruction: 'Take a slow breath before you begin.',
      detail: 'Put your pen down. Breathe in for 3, out for 3. A calm mind reads better than a rushing one.',
    },
    {
      letter: 'L',
      name: 'Look',
      emoji: '👀',
      color: [147, 51, 234] as [number, number, number],
      instruction: 'Read the whole question carefully.',
      detail: 'Read it all the way to the end — even if you think you know the answer halfway through.',
    },
    {
      letter: 'E',
      name: 'Extract',
      emoji: '✏️',
      color: [168, 85, 247] as [number, number, number],
      instruction: 'Underline the key words.',
      detail: 'Circle or underline the important words: numbers, command words (explain, list, compare), and any tricky details.',
    },
    {
      letter: 'A',
      name: 'Answer',
      emoji: '❓',
      color: [180, 140, 50] as [number, number, number],
      instruction: 'Answer what is actually being asked.',
      detail: 'Check: does your answer match the question? If it says "explain", don\'t just state. If it says "two reasons", give two.',
    },
    {
      letter: 'R',
      name: 'Review',
      emoji: '✅',
      color: [217, 119, 6] as [number, number, number],
      instruction: 'Check your answer makes sense.',
      detail: 'Re-read the question one more time. Does your answer actually answer it? Is it complete? Fix anything that\'s missing.',
    },
  ];

  let y = 72;
  const cardH = 38;
  const cardMargin = 20;

  for (const step of steps) {
    // Card background
    doc.setFillColor(248, 246, 255); // light purple tint
    doc.setDrawColor(step.color[0], step.color[1], step.color[2]);
    doc.setLineWidth(0.6);
    doc.roundedRect(cardMargin, y, W - cardMargin * 2, cardH, 4, 4, 'FD');

    // Coloured circle with letter
    const circleX = cardMargin + 14;
    const circleY = y + cardH / 2;
    doc.setFillColor(step.color[0], step.color[1], step.color[2]);
    doc.circle(circleX, circleY, 8, 'F');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(step.letter, circleX, circleY + 1.5, { align: 'center' });

    // Emoji
    doc.setFontSize(14);
    doc.text(step.emoji, circleX, circleY - 9, { align: 'center' });

    // Step name + instruction
    const textX = cardMargin + 30;
    doc.setFontSize(13);
    doc.setTextColor(step.color[0], step.color[1], step.color[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${step.name}`, textX, y + 11);

    doc.setFontSize(9.5);
    doc.setTextColor(55, 30, 100);
    doc.setFont('helvetica', 'bold');
    doc.text(step.instruction, textX, y + 19);

    // Detail text (wrap if needed)
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    const maxWidth = W - cardMargin * 2 - 35;
    const lines = doc.splitTextToSize(step.detail, maxWidth);
    doc.text(lines, textX, y + 26);

    y += cardH + 5;
  }

  // ─── Bottom reminder ──────────────────────────────────────────
  y += 5;
  doc.setDrawColor(200, 160, 50);
  doc.setLineWidth(0.5);
  doc.line(40, y, W - 40, y);

  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(124, 58, 237);
  doc.setFont('helvetica', 'bold');
  doc.text('Before every question, remember: CLEAR!', W / 2, y, { align: 'center' });

  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('Stick this on the fridge, inside a pencil case, or beside practice papers.', W / 2, y, { align: 'center' });

  y += 12;
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text('answerthequestion.co.uk', W / 2, y, { align: 'center' });

  // ─── Download ─────────────────────────────────────────────────
  doc.save('CLEAR-Method-Crib-Sheet.pdf');
}

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const hasCribSheet = searchParams.get('crib_sheet') === '1';
  const parentSession = useAuthStore(s => s.parentSession);
  const updateChildLocally = useAuthStore(s => s.updateChildLocally);
  const currentChildId = useAuthStore(s => s.currentChildId);
  const children = useAuthStore(s => s.children);
  const [verified, setVerified] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [childName, setChildName] = useState('');

  const isGuest = !parentSession;

  // For authenticated users: optimistically mark all children as paid,
  // and re-fetch from Supabase to confirm webhook processed
  useEffect(() => {
    if (!sessionId || isGuest) return;

    // Optimistic local update
    for (const child of children) {
      updateChildLocally(child.id, { hasPaid: true });
    }

    // Poll Supabase to verify webhook has processed (up to 10s)
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 10) {
        clearInterval(interval);
        setVerified(true); // Assume success after 10s
        return;
      }

      if (!currentChildId) return;
      const { data } = await supabase
        .from('child_profiles')
        .select('has_paid')
        .eq('id', currentChildId)
        .single();

      if (data?.has_paid) {
        clearInterval(interval);
        setVerified(true);
      }
    }, 1000);

    return () => clearInterval(interval);
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // For guests: show success after a brief delay (no child to verify)
  useEffect(() => {
    if (isGuest && sessionId) {
      const timer = setTimeout(() => setVerified(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isGuest, sessionId]);

  const handleDownloadCribSheet = () => {
    setDownloading(true);
    try {
      // Direct download from Supabase Storage public bucket
      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl('crib-sheet/CLEAR-Method-Crib-Sheet.pdf', {
          download: 'CLEAR-Method-Crib-Sheet.pdf',
        });

      // Open the download URL directly — avoids CORS issues with fetch
      window.open(data.publicUrl, '_blank');
    } catch {
      // Fallback: generate a PDF client-side with jsPDF
      generateCribSheetPdf();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Brand bar */}
      <div className="max-w-3xl mx-auto px-5 pt-5 pb-2 flex items-center justify-between">
        <Link to="/" className="font-display font-extrabold text-base text-white tracking-tight">
          🦉 AnswerTheQuestion!
        </Link>
        {parentSession && (
          <span className="text-sm text-white/70 font-display font-semibold truncate ml-4">
            {parentSession.user.email}
          </span>
        )}
      </div>

      <div className="max-w-lg mx-auto px-5 py-10 space-y-6">
        {/* Celebration */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 150, delay: 0.2 }}
          className="text-center"
        >
          <span className="text-7xl block mb-2">🎉</span>
        </motion.div>

        <div className="flex justify-center">
          <ProfessorHoot mood="celebrating" size="lg" animate showSpeechBubble={false} />
        </div>

        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-2xl font-bold text-white drop-shadow-md"
          >
            Hoo-ray! You&rsquo;re all set! 🦉
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/80 font-display mt-2 max-w-sm mx-auto"
          >
            {isGuest
              ? 'Payment received! Create your account to start the 12-week programme.'
              : 'Full access unlocked! All 12 weeks of technique training, Timed Challenges, and more are now yours. Let\u2019s keep building those exam skills!'}
          </motion.p>
        </div>

        {/* Crib Sheet Download — shown prominently BEFORE the CTA */}
        {hasCribSheet && verified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-purple-300"
          >
            <div className="text-center space-y-3">
              <span className="text-4xl block">📋</span>
              <h3 className="font-display font-bold text-lg text-purple-800">
                Your CLEAR Method Crib Sheet
              </h3>
              <p className="font-display text-sm text-gray-600">
                Print it out and stick it on the fridge, the desk, or inside a homework folder!
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownloadCribSheet}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-display font-bold text-white text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-lg disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {downloading ? 'Downloading\u2026' : 'Download Crib Sheet'}
              </motion.button>
              <p className="font-display text-xs text-gray-400">
                You can also re-download this anytime from your parent dashboard
              </p>
            </div>
          </motion.div>
        )}

        {/* Status / CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: hasCribSheet ? 1.0 : 0.8 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 text-center"
        >
          {!verified ? (
            <div className="space-y-3">
              <span className="text-4xl animate-bounce inline-block">🦉</span>
              <p className="font-display font-semibold text-gray-600">
                Confirming your payment...
              </p>
              <p className="text-xs text-gray-400 font-display">This usually takes just a moment</p>
            </div>
          ) : isGuest ? (
            /* ── Guest flow: prompt to create account ── */
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <span className="text-2xl">✅</span>
                <span className="font-display font-bold">Payment confirmed!</span>
              </div>
              <p className="font-display text-sm text-gray-600 leading-relaxed">
                Now create your free account to unlock the programme.
                <br />
                <strong className="text-purple-700">Use the same email</strong> you just paid with so we can link your purchase.
              </p>
              <div>
                <label htmlFor="child-name" className="block text-sm font-display font-semibold text-gray-600 mb-1.5 text-left">
                  Your child's first name
                </label>
                <input
                  id="child-name"
                  type="text"
                  value={childName}
                  onChange={e => setChildName(e.target.value)}
                  placeholder="e.g. Sophie"
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 text-lg font-display focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                  autoFocus
                />
                <p className="text-xs text-gray-400 font-display mt-1">
                  You can add more children later from your account
                </p>
              </div>
              <Link
                to="/signup"
                onClick={() => {
                  if (childName.trim()) {
                    localStorage.setItem('atq_child_name', childName.trim());
                  }
                }}
                className="block w-full py-4 rounded-2xl font-display font-extrabold text-white text-lg text-center bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 shadow-lg hover:scale-[1.02] active:scale-[0.97] transition-transform"
              >
                Create Your Account 🦉
              </Link>
              <Link
                to="/login"
                className="block text-sm text-purple-600 hover:text-purple-800 font-display font-semibold"
              >
                Already have an account? Sign in
              </Link>
            </div>
          ) : (
            /* ── Authenticated flow: existing behaviour ── */
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <span className="text-2xl">✅</span>
                <span className="font-display font-bold">Payment confirmed!</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/practice')}
                className="w-full py-4 rounded-2xl font-display font-bold text-white text-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 shadow-lg"
              >
                Start Practising! 🚀
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Back link */}
        <div className="text-center">
          {isGuest ? (
            <Link
              to="/"
              className="text-sm text-white/60 font-display hover:text-white/80 transition-colors"
            >
              &larr; Back to home
            </Link>
          ) : (
            <button
              onClick={() => navigate('/home')}
              className="text-sm text-white/60 font-display hover:text-white/80 transition-colors"
            >
              Back to the nest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
