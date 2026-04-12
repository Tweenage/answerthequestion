import { motion } from 'framer-motion';

export function PositioningSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md mb-6 leading-tight">
          This is not more tutoring
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
            <p className="font-display font-bold text-white text-base mb-2">
              Tutors focus on&hellip;
            </p>
            <p className="font-display text-white/80 text-sm leading-relaxed">
              What to learn. Curriculum content. Subject knowledge. Practice papers.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
            <p className="font-display font-bold text-fuchsia-200 text-base mb-2">
              This programme focuses on&hellip;
            </p>
            <p className="font-display text-white/80 text-sm leading-relaxed">
              How to approach questions. Staying calm. Reading properly. Thinking methodically.
            </p>
          </div>
        </div>

        <p className="font-display text-white/80 text-sm leading-relaxed mb-3">
          It helps your child:
        </p>
        <ul className="space-y-2 max-w-md mx-auto mb-8">
          {[
            'Slow down instead of rushing',
            'Read properly instead of skimming',
            'Think methodically instead of guessing',
          ].map((text, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 text-white/90 font-display text-sm"
            >
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
              {text}
            </motion.li>
          ))}
        </ul>

        <p className="font-display text-white font-bold text-base">
          So they can actually show what they know in exams
        </p>
      </motion.div>
    </section>
  );
}
