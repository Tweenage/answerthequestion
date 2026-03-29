import { motion } from 'framer-motion';

const WHO_FOR = [
  'Children in Years 4–6 preparing for 11+ or independent school entrance',
  'Children who know the material but lose marks on the day',
  'Children who rush, skip-read, or panic under timed conditions',
  'Parents who want to understand what their child is practising — and how to support it without adding pressure',
];

export function ForParentsSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 text-center mb-8 leading-tight">
            This is for you too
          </h2>

          <div className="space-y-4 text-gray-700 font-display text-base md:text-lg leading-relaxed mb-10">
            <p>
              Most 11+ products are built for the child. They give children more papers, more
              questions, more things to do. But parents are left wondering: what do I actually do?
            </p>
            <p>
              Do I quiz them at the table? (Probably not — the research is clear on this.) Do I ask
              how it went? (Carefully.) What do I say on the morning of the exam?
            </p>
            <p>
              AnswerTheQuestion! doesn&rsquo;t just build a skill in your child. It gives you
              something too: a clear understanding of what they&rsquo;re practising, why it works,
              and how to support them without becoming another source of pressure. Because the most
              useful thing you can do is not more drills. It&rsquo;s staying calm and knowing
              they&rsquo;ve got this.
            </p>
          </div>

          <h3 className="font-display font-extrabold text-lg text-gray-900 mb-4">
            Who it&rsquo;s for
          </h3>
          <ul className="space-y-3">
            {WHO_FOR.map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 text-gray-700 font-display text-base leading-relaxed"
              >
                <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-purple-400" />
                {text}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
