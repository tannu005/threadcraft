import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

export default function Work() {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 bg-gradient-to-br from-acid/10 via-void to-ice/10 animate-pulse" style={{ animationDuration: '8s' }} />
      
      <div className="relative z-10 pt-40 px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-8xl text-white uppercase tracking-tighter mb-10">Our Work</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-video glass border-white/5 hover:border-acid/20 transition-all duration-500 overflow-hidden group">
                <div className="w-full h-full bg-ash/50 group-hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
