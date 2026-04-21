import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

export default function About() {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 bg-gradient-to-tr from-ember/5 via-void to-violet/5" />
      
      <div className="relative z-10 pt-40 px-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-8xl text-white uppercase tracking-tighter mb-10">Story</h1>
          <p className="font-body text-2xl text-chrome/60 leading-relaxed">
            ThreadCraft was born in the void between digital art and physical expression. 
            We leverage AI to bridge the gap between imagination and reality.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
