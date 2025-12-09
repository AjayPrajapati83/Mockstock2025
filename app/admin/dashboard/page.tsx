'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Team, RoundStatus } from '@/types/database'
import { Users, Play, Square, UserCheck, UserX, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [roundStatus, setRoundStatus] = useState<RoundStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [eliminationCount, setEliminationCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/admin/login')
        return
      }
      fetchData()
    }

    const fetchData = async () => {
      const { data: teamsData } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: roundData } = await supabase
        .from('round_status')
        .select('*')
        .eq('round_number', 1)
        .single()

      if (teamsData) setTeams(teamsData)
      if (roundData) {
        setRoundStatus(roundData)
        setEliminationCount(roundData.elimination_count || 0)
      }
      setLoading(false)
    }

    checkAuth()

    const teamsChannel = supabase
      .channel('admin-teams')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        () => fetchData()
      )
      .subscribe()

    return () => {
      teamsChannel.unsubscribe()
    }
  }, [router])

  const admitTeam = async (teamId: string) => {
    const supabase = createClient()
    await supabase
      .from('teams')
      .update({ is_admitted: true, status: 'admitted' })
      .eq('id', teamId)
  }

  const admitAll = async () => {
    const supabase = createClient()
    const waitingTeams = teams.filter(t => !t.is_admitted && t.status === 'waiting')
    
    for (const team of waitingTeams) {
      await admitTeam(team.id)
    }
  }

  const startRound = async () => {
    const admittedCount = teams.filter(t => t.is_admitted).length
    
    if (admittedCount === 0) {
      alert('Cannot start round: No teams admitted yet!')
      return
    }

    if (!confirm(`Start Round 1 with ${admittedCount} admitted teams?`)) return

    const supabase = createClient()
    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000)

    await supabase
      .from('round_status')
      .upsert({
        round_number: 1,
        is_active: true,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        elimination_count: eliminationCount,
        is_locked: false,
      })
  }

  const stopRound = async () => {
    if (!confirm('Stop Round 1?')) return

    const supabase = createClient()
    await supabase
      .from('round_status')
      .update({ is_active: false, is_locked: true })
      .eq('round_number', 1)
  }

  const pendingTeams = teams.filter(t => !t.is_admitted && t.status === 'waiting')
  const admittedTeams = teams.filter(t => t.is_admitted)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-green mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-neon-green">Admin</span> Dashboard
          </h1>
          <button
            onClick={() => {
              const supabase = createClient()
              supabase.auth.signOut()
              router.push('/admin/login')
            }}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Round Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-neon-green/30 rounded-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6 text-neon-green" />
            Round 1 Controls
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Elimination Count</label>
              <input
                type="number"
                value={eliminationCount}
                onChange={(e) => setEliminationCount(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                min="0"
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-400">
                <p>Admitted teams: <span className="text-neon-green font-bold">{admittedTeams.length}</span></p>
                <p>Waiting teams: <span className="text-yellow-500 font-bold">{pendingTeams.length}</span></p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {!roundStatus?.is_active ? (
              <button
                onClick={startRound}
                disabled={admittedTeams.length === 0}
                className="bg-neon-green hover:bg-neon-green/80 disabled:bg-gray-600 text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
              >
                <Play className="w-5 h-5" />
                Start Round 1
              </button>
            ) : (
              <button
                onClick={stopRound}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stop Round 1
              </button>
            )}
          </div>
          
          {admittedTeams.length === 0 && (
            <p className="text-yellow-500 text-sm mt-2">⚠️ Admit teams before starting the round</p>
          )}
        </motion.div>

        {/* Pending Teams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-yellow-500/30 rounded-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-yellow-500" />
              Pending Teams ({pendingTeams.length})
            </h2>
            {pendingTeams.length > 0 && (
              <button
                onClick={admitAll}
                className="bg-neon-green hover:bg-neon-green/80 text-black font-bold px-4 py-2 rounded-lg text-sm"
              >
                Admit All
              </button>
            )}
          </div>

          {pendingTeams.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No pending teams</p>
          ) : (
            <div className="space-y-3">
              {pendingTeams.map((team) => (
                <div
                  key={team.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-mono text-sm text-neon-blue">{team.team_code}</p>
                    <p className="text-sm text-gray-400">
                      {team.participant1} & {team.participant2}
                    </p>
                    <p className="text-xs text-gray-500">Event: {team.event_code}</p>
                  </div>
                  <button
                    onClick={() => admitTeam(team.id)}
                    className="bg-neon-green hover:bg-neon-green/80 text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    Admit
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Admitted Teams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-neon-green/30 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-neon-green" />
            Admitted Teams ({admittedTeams.length})
          </h2>

          {admittedTeams.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No admitted teams yet</p>
          ) : (
            <div className="space-y-3">
              {admittedTeams.map((team) => (
                <div
                  key={team.id}
                  className="bg-gray-800/50 border border-neon-green/30 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-sm text-neon-blue">{team.team_code}</p>
                      <p className="text-sm text-gray-400">
                        {team.participant1} & {team.participant2}
                      </p>
                      <p className="text-xs text-gray-500">Event: {team.event_code}</p>
                    </div>
                    <span className="bg-neon-green/20 text-neon-green px-3 py-1 rounded-full text-xs font-semibold">
                      Admitted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
