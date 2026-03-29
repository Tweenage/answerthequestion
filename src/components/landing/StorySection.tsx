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
            There was a piece of the puzzle missing, and I was running out of ideas.
          </p>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-5">
            So I went back to basics. I started looking at how she was approaching questions,
            not just whether she knew the answers. And I saw it: she was answering the question
            she <em>expected</em>, not the one on the page.
          </p>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-6">
            Once I knew what the problem was, I built something to fix it. I made it into a
            game. Before we started, we&rsquo;d picture the exam room: settled, ready. We&rsquo;d
            work through the method together, track her progress, mark the moments she got it
            right. The pressure came down. The marks went up. We started having fun with it.
          </p>

          <p className="text-gray-700 font-display font-semibold text-base leading-relaxed mb-5">
            That&rsquo;s AnswerTheQuestion! Built for my child first. Sharing it now with yours.
          </p>

          <p className="font-display font-bold text-base text-purple-700">
            &mdash; Rebecca, Founder
          </p>
        </div>
      </motion.div>
    </section>
  );
}
