'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, Shield } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (data.user) {
        router.push('/admin/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-neon-green/30 rounded-lg p-8 glow-green">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16 text-neon-green" />
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-2">
            <span className="text-neon-green">Admin</span> Login
          </h1>
          <p className="text-gray-400 text-center mb-8">MockStock Ubuntu 2025</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-green transition-colors"
                placeholder="Enter admin email"
                required
                autoComplete="email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-green transition-colors"
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-green hover:bg-neon-green/80 disabled:bg-gray-600 text-black font-bold py-3 rounded-lg transition-all glow-green disabled:glow-none"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
