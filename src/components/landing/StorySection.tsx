import { motion } from 'framer-motion';

export function StorySection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm border border-white/30 max-w-xl mx-auto">

          <p className="text-gray-700 font-display text-base leading-relaxed mb-6">
            We had the tutor. We were doing papers at home. I was doing everything I could
            to support her. But she was still dropping marks. She knew the content &mdash;
            I was certain of that. I couldn&rsquo;t work out why.
          </p>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-4">
            Then one afternoon, working through an English comprehension, she hit this question:
          </p>

          {/* Exam question card */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-4 font-display">
            <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-2">Exam question</p>
            <p className="text-gray-800 text-base italic">
              &ldquo;In what year did scientists discover the colour of&hellip;&rdquo;
            </p>
          </div>

          {/* Wrong answer */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-gray-500 font-display text-sm shrink-0">Her answer:</span>
            <span className="bg-red-50 border border-red-200 font-display font-bold text-base px-4 py-1.5 rounded-lg line-through decoration-red-400">
              &ldquo;<span className="text-blue-500">Blue</span><span className="text-red-500">.</span>&rdquo;
            </span>
          </div>

          {/* Dialogue */}
          <div className="space-y-2 mb-5 border-l-2 border-purple-100 pl-4">
            <p className="text-gray-500 font-display text-sm italic">I asked her to read it again. Still blue. A third time — confident as ever.</p>
            <div className="pt-1 space-y-2">
              <div className="flex gap-2">
                <span className="text-purple-400 font-display text-xs font-bold shrink-0 pt-0.5">Me</span>
                <p className="text-gray-700 font-display text-base">&ldquo;What is the question actually asking you?&rdquo;</p>
              </div>
              <p className="text-gray-400 font-display text-sm italic pl-6">A pause.</p>
              <div className="flex gap-2">
                <span className="text-fuchsia-400 font-display text-xs font-bold shrink-0 pt-0.5">Her</span>
                <p className="text-gray-700 font-display text-base">&ldquo;Oh! It&rsquo;s asking for a year!&rdquo;</p>
              </div>
              <div className="flex gap-2">
                <span className="text-purple-400 font-display text-xs font-bold shrink-0 pt-0.5">Me</span>
                <p className="text-gray-700 font-display text-base">&ldquo;Yes. So what&rsquo;s the answer?&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Correct answer */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-gray-500 font-display text-sm shrink-0">Without hesitation:</span>
            <span className="bg-green-50 border border-green-200 text-green-700 font-display font-bold text-base px-4 py-1.5 rounded-lg">
              &ldquo;1957.&rdquo; ✓
            </span>
          </div>

          {/* Revelation */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl px-5 py-4 mb-6">
            <p className="text-purple-900 font-display font-semibold text-base leading-relaxed">
              She knew it all along. She just hadn&rsquo;t read the question.
            </p>
          </div>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-5">
            It wasn&rsquo;t a comprehension problem. It wasn&rsquo;t a knowledge problem.
            It was a focus problem &mdash; the kind that builds up in a world of tablets and
            short videos, where children aren&rsquo;t trained to slow down and read carefully.
            I searched for something to help her build that specific skill. Found nothing useful.
            So I built it myself.
          </p>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-6">
            In just a few minutes a day, she developed the read-the-question muscle. The marks
            went up. The frustration came down. I stopped dragging my hand down my face in despair.
          </p>

          <p className="text-gray-700 font-display font-semibold text-base leading-relaxed mb-5">
            Built to help my child. Now here to help yours.
          </p>

          <p className="font-display font-bold text-base text-purple-700">
            &mdash; Rebecca, Tweenage Founder
          </p>
        </div>
      </motion.div>
    </section>
  );
}
