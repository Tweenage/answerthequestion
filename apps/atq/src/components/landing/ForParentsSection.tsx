import { motion } from 'framer-motion';

const WHO_FOR = [
  'Children in Years 4–6 preparing for any exam, including 11+ or independent school entrance',
  'Children who are learning the curriculum and material elsewhere but need help to concentrate in exam circumstances',
  'Children who need to learn to relax in an exam and practise the skills required',
  'Parents who want to support their children to improve their scores without adding more curriculum or more pressure',
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
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 text-center mb-8 leading-tight">
            Who it&rsquo;s for
          </h2>
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
