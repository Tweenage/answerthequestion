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
          </p>

          <p className="text-gray-700 font-display text-base leading-relaxed italic mb-5">
            &ldquo;Read it again,&rdquo; I said.<br />
            She read it again. &ldquo;Blue,&rdquo; she said.<br />
            I took a breath. &ldquo;No. Read it out loud. Every word.&rdquo;<br />
            She sighed, picked up the paper, and read: &ldquo;In what year&hellip;&rdquo; She stopped.<br />
            &ldquo;Oh. The question is asking for a year.&rdquo;<br />
            &ldquo;So what is the answer?&rdquo;<br />
            &ldquo;1957.&rdquo;
          </p>

          <p className="text-gray-700 font-display text-base leading-relaxed italic mb-5">
            She had known the answer the whole time. She just hadn&rsquo;t read the question.
          </p>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-5">
            Talking to other parents going through 11+ and independent school prep,
            the story was always the same. Bright, capable children losing marks &mdash;
            not because they didn&rsquo;t know the material &mdash; but because they
            didn&rsquo;t read the question properly. So I researched the science of
            exam technique, built the method, and turned it into a programme.
          </p>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-5">
            &ldquo;Within a couple of weeks of using the programme, my daughter&rsquo;s practice
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
