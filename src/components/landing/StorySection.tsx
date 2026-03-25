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
          <p className="text-gray-700 font-display text-base leading-relaxed italic mb-5">
            My daughter had just finished her 11+ comprehension practice. I started marking
            and stopped cold at Question 1: &ldquo;In what year did scientists discover
            the colour of&hellip;&rdquo; Her answer? Blue.
            <br /><br />
            I asked her to read it again &mdash; out loud. She got to &ldquo;In what
            year&hellip;&rdquo; and immediately: &ldquo;D&rsquo;uh! It&rsquo;s meant to be
            1957!&rdquo; She had known the answer all along. She just hadn&rsquo;t read
            the question.
          </p>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-5">
            Talking to other parents going through 11+ and independent school prep,
            the story was always the same. Bright, capable children losing marks &mdash;
            not because they didn&rsquo;t know the material &mdash; but because they
            didn&rsquo;t read the question properly. So I researched the science of
            exam technique, built the method, and turned it into a programme.
          </p>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-5">
            &ldquo;Within a week of using the programme, my daughter&rsquo;s practice
            test scores improved by over 10%.&rdquo;
          </p>

          <p className="font-display font-bold text-base text-purple-700">
            &mdash; Rebecca, Founder
          </p>
        </div>
      </motion.div>
    </section>
  );
}
