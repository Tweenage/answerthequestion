import { motion } from 'framer-motion';

const PAIN_POINTS = [
  { emoji: '🤦', text: 'The question said "two reasons" — they gave one and moved on.' },
  { emoji: '😤', text: 'They ace practice papers at home — then panic under timed conditions.' },
  { emoji: '🚗', text: 'On the way to school they know it all. In the exam hall, it vanishes.' },
  { emoji: '😬', text: 'They come out of the exam confident — and you already know what happened.' },
  { emoji: '🔁', text: 'You\'ve said "read the question" so many times it\'s lost all meaning.' },
];

export function ProblemSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Age badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-block bg-purple-100 text-purple-700 font-display font-bold text-sm px-4 py-1.5 rounded-full">
              Ages 7&ndash;11+
            </span>
          </div>

          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 text-center mb-3 leading-tight">
            Tutors teach the curriculum.
            <br />
            But who teaches them how to <span className="text-purple-700">use&nbsp;it</span> under pressure?
          </h2>

          <p className="text-gray-500 font-display text-base md:text-lg text-center max-w-xl mx-auto mb-4 leading-relaxed">
            Your child is already learning the content &mdash; at home, with tutors, workbooks and practice papers.
            You&rsquo;ve got that side covered.
          </p>

          <p className="text-gray-500 font-display text-base md:text-lg text-center max-w-xl mx-auto mb-4 leading-relaxed">
            What&rsquo;s missing is the bit <strong className="text-gray-700">between</strong> knowing
            the answer and writing it down: staying calm, reading carefully, and not throwing away marks
            on questions they actually know.
          </p>

          <p className="text-gray-500 font-display text-base md:text-lg text-center max-w-xl mx-auto mb-8 leading-relaxed">
            <strong className="text-purple-700">AnswerTheQuestion!</strong> is the missing piece &mdash;
            exam-day visualisation, breathing exercises, focus practice, instant feedback
            and progress tracking, all in one place. Just a few minutes a day.
          </p>

          <p className="font-display font-extrabold text-xl md:text-2xl text-purple-700 text-center mb-10">
            That&rsquo;s the gap. And that&rsquo;s what we train.
          </p>

          {/* Pain points */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-amber-200/60 max-w-xl mx-auto">
            <h3 className="font-display font-extrabold text-base text-gray-800 mb-5">
              If this sounds familiar&hellip;
            </h3>

            <ul className="space-y-3.5">
              {PAIN_POINTS.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 text-gray-700 font-display text-sm md:text-base leading-relaxed"
                >
                  <span className="shrink-0 mt-0.5 text-lg">{item.emoji}</span>
                  {item.text}
                </motion.li>
              ))}
            </ul>

            <p className="font-display font-bold text-base text-gray-800 mt-6 text-center leading-relaxed">
              That isn&rsquo;t a knowledge problem &mdash;
              it&rsquo;s an <span className="text-purple-700">exam-technique habit</span>.
              <br />
              And habits can be trained.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
