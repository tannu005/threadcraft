import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

export default function Contact() {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,255,0,0.05),transparent_70%)]" />
      
      <div className="relative z-10 pt-40 px-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="font-display text-8xl text-white uppercase tracking-tighter mb-6">Contact</h1>
          <p className="font-mono text-acid tracking-widest mb-10">HELLO@THREADCRAFT.STUDIO</p>
          
          <div className="w-full max-w-xl glass p-10">
            <div className="space-y-6">
              <input type="text" placeholder="NAME" className="prompt-input w-full" />
              <input type="email" placeholder="EMAIL" className="prompt-input w-full" />
              <textarea placeholder="MESSAGE" className="prompt-input w-full h-32" />
              <button className="btn-primary w-full py-4"><span>SEND TRANSMISSION</span></button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
