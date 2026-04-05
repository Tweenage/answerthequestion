import { motion } from 'framer-motion';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  glass?: boolean;
}

export function SectionWrapper({ children, className = '', id, glass = true }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={`max-w-2xl mx-auto px-4 py-8 ${
        glass
          ? 'bg-white/95 backdrop-blur-sm rounded-card p-6 shadow-sm border border-white/30 my-6'
          : 'my-4'
      } ${className}`}
    >
      {children}
    </motion.section>
  );
}
