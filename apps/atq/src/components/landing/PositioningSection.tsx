import { motion } from 'framer-motion';

export function PositioningSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 mb-6 leading-tight">
            This is not more tutoring
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p className="font-display font-bold text-gray-800 text-base mb-2">
                Tutors focus on&hellip;
              </p>
              <p className="font-display text-gray-500 text-sm leading-relaxed">
                What to learn. Curriculum content. Subject knowledge. Practice papers.
              </p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
              <p className="font-display font-bold text-purple-800 text-base mb-2">
                This programme focuses on&hellip;
              </p>
              <p className="font-display text-gray-600 text-sm leading-relaxed">
                How to approach questions. Staying calm. Reading properly. Thinking methodically.
              </p>
            </div>
          </div>

          <p className="font-display text-purple-700 font-bold text-base">
            So they can actually show what they know in exams.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
