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
          <p className="text-gray-700 font-display text-base leading-relaxed mb-5">
            We had the tutor. We were doing papers at home. I was doing everything I could
            to support her. But she was still dropping marks. She knew the content &mdash;
            I was certain of that. I couldn&rsquo;t work out why.
          </p>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-5">
            Then one afternoon, working through an English comprehension, she hit a question
            that began: <em>&ldquo;In what year did scientists discover the colour of&hellip;&rdquo;</em>
          </p>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-5">
            Her answer: <strong className="text-gray-800">&ldquo;Blue.&rdquo;</strong>
          </p>

          <div className="text-gray-600 font-display text-base leading-relaxed mb-5 space-y-3">
            <p>I asked her to read it again. Still blue.</p>
            <p>A third time &mdash; confident as ever.</p>
            <p>Finally I said: <em>&ldquo;What is the question actually asking you?&rdquo;</em></p>
            <p>A pause.</p>
            <p><em>&ldquo;Oh! It&rsquo;s asking for a year!&rdquo;</em></p>
            <p><em>&ldquo;Yes. So what&rsquo;s the answer?&rdquo;</em></p>
            <p>Without hesitation: <em>&ldquo;1957.&rdquo;</em></p>
            <p>She knew it all along. She just hadn&rsquo;t read the question.</p>
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
