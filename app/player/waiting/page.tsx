'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Team, RoundStatus } from '@/types/database'
import { Clock, CheckCircle, Users } from 'lucide-react'

export default function WaitingLobby() {
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [roundStatus, setRoundStatus] = useState<RoundStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const teamId = localStorage.getItem('team_id')
    if (!teamId) {
      router.push('/player/join')
      return
    }

    const supabase = createClient()

    const fetchData = async () => {
      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single()

      if (teamData) {
        setTeam(teamData)
        
        if (teamData.is_admitted && teamData.status === 'admitted') {
          const { data: roundData } = await supabase
            .from('round_status')
            .select('*')
            .eq('round_number', 1)
            .single()
          
          if (roundData?.is_active) {
            router.push('/player/round')
          }
        }
      }
      setLoading(false)
    }

    fetchData()

    const teamChannel = supabase
      .channel('team-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'teams',
          filter: `id=eq.${teamId}`,
        },
        (payload) => {
          const updatedTeam = payload.new as Team
          setTeam(updatedTeam)
          
          if (updatedTeam.is_admitted && updatedTeam.status === 'admitted') {
            fetchRoundStatus()
          }
        }
      )
      .subscribe()

    const roundChannel = supabase
      .channel('round-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'round_status',
        },
        (payload) => {
          const round = payload.new as RoundStatus
          setRoundStatus(round)
          
          if (round.is_active && round.round_number === 1 && team?.is_admitted) {
            router.push('/player/round')
          }
        }
      )
      .subscribe()

    const fetchRoundStatus = async () => {
      const { data } = await supabase
        .from('round_status')
        .select('*')
        .eq('round_number', 1)
        .single()
      
      if (data) setRoundStatus(data)
    }

    return () => {
      teamChannel.unsubscribe()
      roundChannel.unsubscribe()
    }
  }, [router, team?.is_admitted])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="container mx-auto max-w-2xl py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-neon-blue/30 rounded-lg p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8">
            <span className="text-neon-blue">Waiting</span> Lobby
          </h1>

          {team && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-neon-green" />
                  Team Details
                </h2>
                <div className="space-y-2 text-gray-300">
                  <p><span className="text-gray-400">Team Code:</span> <span className="font-mono text-neon-blue">{team.team_code}</span></p>
                  <p><span className="text-gray-400">Event Code:</span> <span className="font-mono">{team.event_code}</span></p>
                  <p><span className="text-gray-400">Participant 1:</span> {team.participant1}</p>
                  <p><span className="text-gray-400">Participant 2:</span> {team.participant2}</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Status</h2>
                
                {!team.is_admitted ? (
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Clock className="w-6 h-6 text-yellow-500" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-yellow-500">Waiting for Admin Approval</p>
                      <p className="text-sm text-gray-400">An admin will admit your team shortly</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-neon-green" />
                    <div>
                      <p className="font-semibold text-neon-green">Admitted!</p>
                      <p className="text-sm text-gray-400">
                        {roundStatus?.is_active 
                          ? 'Round is starting...' 
                          : 'Waiting for round to start'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-gray-400">
                <p>Stay on this page. You'll be redirected automatically when the round starts.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
