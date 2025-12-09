'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { isAlphanumeric } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

export default function PlayerJoin() {
  const router = useRouter()
  const [eventCode, setEventCode] = useState('')
  const [participant1, setParticipant1] = useState('')
  const [participant2, setParticipant2] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!eventCode.trim()) {
      newErrors.eventCode = 'Event code is required'
    } else if (!isAlphanumeric(eventCode)) {
      newErrors.eventCode = 'Event code must be alphanumeric (letters and numbers only)'
    }
    
    if (!participant1.trim()) {
      newErrors.participant1 = 'Participant 1 name is required'
    }
    
    if (!participant2.trim()) {
      newErrors.participant2 = 'Participant 2 name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)
    const supabase = createClient()
    
    try {
      const teamCode = `TEAM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      
      const { data, error } = await supabase
        .from('teams')
        .insert({
          team_code: teamCode,
          event_code: eventCode.toUpperCase(),
          participant1: participant1.trim(),
          participant2: participant2.trim(),
          is_admitted: false,
          status: 'waiting',
          round: 0,
        })
        .select()
        .single()
      
      if (error) throw error
      
      localStorage.setItem('team_id', data.id)
      localStorage.setItem('team_code', teamCode)
      router.push('/player/waiting')
    } catch (error) {
      console.error('Error creating team:', error)
      setErrors({ submit: 'Failed to join. Please try again.' })
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
        <div className="bg-card border border-neon-blue/30 rounded-lg p-8 glow-blue">
          <h1 className="text-3xl font-bold text-center mb-2">
            <span className="text-neon-blue">Join</span> MockStock
          </h1>
          <p className="text-gray-400 text-center mb-8">Ubuntu 2025</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="e.g., UB24A9"
                maxLength={8}
              />
              {errors.eventCode && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.eventCode}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Participant 1 Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={participant1}
                onChange={(e) => setParticipant1(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="Enter name"
              />
              {errors.participant1 && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.participant1}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Participant 2 Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={participant2}
                onChange={(e) => setParticipant2(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="Enter name"
              />
              {errors.participant2 && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.participant2}
                </p>
              )}
            </div>
            
            {errors.submit && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-blue hover:bg-neon-blue/80 disabled:bg-gray-600 text-black font-bold py-3 rounded-lg transition-all glow-blue disabled:glow-none"
            >
              {loading ? 'Joining...' : 'Join Competition'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
