import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import useStore from '../context/store'
import Navbar from '../components/Navbar'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { setAuth } = useStore()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await axios.post('/api/auth/signup', { name, email, password })
      setAuth(res.data.data.user, res.data.token)
      navigate('/customizer')
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server. Is the backend running?')
      } else {
        setError(err.response.data.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <motion.div 
          className="w-full max-w-md glass p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10 text-center">
            <h1 className="font-display text-3xl text-white mb-2 uppercase tracking-tight">Join Studio</h1>
            <p className="font-mono text-xs text-chrome/30 tracking-widest uppercase">Create your profile to save designs & textures</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block font-mono text-[0.6rem] text-chrome/40 uppercase tracking-widest mb-2">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="prompt-input w-full"
                placeholder="Cassian Andor"
              />
            </div>

            <div>
              <label className="block font-mono text-[0.6rem] text-chrome/40 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="prompt-input w-full"
                placeholder="architect@void.studio"
              />
            </div>

            <div>
              <label className="block font-mono text-[0.6rem] text-chrome/40 uppercase tracking-widest mb-2">Create Password</label>
              <input 
                type="password" 
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="prompt-input w-full"
                placeholder="Min. 8 characters"
              />
            </div>

            {error && (
              <div className="p-3 bg-ember/5 border border-ember/20 text-ember font-mono text-[0.65rem] rounded-sm">
                ⚠ {error}
              </div>
            )}

            <button 
              type="submit" 
              className={`w-full btn-primary py-4 mt-4 ${loading ? 'opacity-60 pointer-events-none' : ''}`}
              disabled={loading}
            >
              <span>{loading ? 'PROCESSING...' : 'INITIALIZE ACCOUNT'}</span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="font-mono text-[0.65rem] text-chrome/30 uppercase tracking-widest">
              Already have an account? <Link to="/login" className="text-acid hover:underline">Log in</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Orbs */}
      <div className="fixed top-1/4 -right-20 w-80 h-80 bg-ice/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 -left-20 w-80 h-80 bg-acid/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  )
}
