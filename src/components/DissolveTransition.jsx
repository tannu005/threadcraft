import { motion } from 'framer-motion'

export default function DissolveTransition() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-0 bg-void mix-blend-overlay" />
      <motion.div 
        className="absolute inset-0 bg-acid"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: 'circle(0% at 50% 50%)' }}
        exit={{ clipPath: 'circle(150% at 50% 50%)' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      />
    </motion.div>
  )
}
