import { motion } from 'framer-motion';
import { BookOpen, Brain, Shield } from 'lucide-react';

export function SocialProofSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md text-center mb-8 leading-tight">
          Join families preparing for the 11+ and secondary school
        </h2>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm border border-white/30">
          {/* Pull quote */}
          <div className="bg-purple-50 rounded-xl p-5 md:p-6 border border-purple-200/50 text-center mb-6">
            <p className="font-display text-lg md:text-xl text-purple-800 italic font-bold leading-relaxed mb-2">
              &ldquo;She knew the answer. She got it wrong. She hadn&rsquo;t read the question.&rdquo;
            </p>
            <p className="font-display text-sm text-purple-600">
              &mdash; Every 11+ parent, at some point
            </p>
          </div>

          <p className="text-gray-700 font-display text-base leading-relaxed mb-8 text-center">
            AnswerTheQuestion! is grounded in metacognition research &mdash; the
            science of thinking about thinking. The EEF Teaching and Learning
            Toolkit identifies metacognitive strategies as one of the most
            effective and cost-efficient ways to improve learning outcomes.
            That&rsquo;s exactly what the CLEAR Method trains your child to do.
          </p>

          {/* Three confidence pillars */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: '668 exam-style questions',
                body: 'Covering Maths, English & Reasoning — with new questions added regularly.',
              },
              {
                icon: Brain,
                title: 'Research-backed method',
                body: 'The CLEAR Method teaches the metacognitive skills that turn careless mistakes into confident answers.',
              },
              {
                icon: Shield,
                title: 'Calm & focused exam habits',
                body: 'Built-in breathing exercises and the CLEAR Method help your child stay calm under pressure and think before they answer.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-b from-purple-50 to-white rounded-xl p-5 text-center border border-purple-100/50"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 mx-auto mb-3 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-display font-bold text-sm text-gray-800 mb-1">
                  {item.title}
                </h3>
                <p className="font-display text-sm text-gray-600 leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
