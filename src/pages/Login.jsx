import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import useStore from '../context/store'
import Navbar from '../components/Navbar'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { setAuth } = useStore()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await axios.post('/api/auth/login', { email, password })
      setAuth(res.data.data.user, res.data.token)
      navigate('/customizer')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
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
            <h1 className="font-display text-3xl text-white mb-2 uppercase tracking-tight">Welcome Back</h1>
            <p className="font-mono text-xs text-chrome/30 tracking-widest uppercase">Enter your credentials to access ThreadCraft</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex justify-between mb-2">
                <label className="block font-mono text-[0.6rem] text-chrome/40 uppercase tracking-widest">Password</label>
                <a href="#" className="font-mono text-[0.6rem] text-acid/60 hover:text-acid">FORGOT?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="prompt-input w-full"
                placeholder="••••••••"
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
              <span>{loading ? 'AUTHENTICATING...' : 'LOGIN TO STUDIO'}</span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="font-mono text-[0.65rem] text-chrome/30 uppercase tracking-widest">
              Don't have an account? <Link to="/signup" className="text-acid hover:underline">Register now</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Orbs */}
      <div className="fixed top-1/4 -left-20 w-80 h-80 bg-acid/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-ice/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  )
}
