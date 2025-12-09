'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Ranking, Team } from '@/types/database'
import { Trophy, Medal, Award } from 'lucide-react'

export default function ResultsPage() {
  const router = useRouter()
  const [rankings, setRankings] = useState<(Ranking & { team: Team })[]>([])
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
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
        setCurrentTeam(teamData)

        const { data: rankingsData } = await supabase
          .from('rankings')
          .select('*, team:teams(*)')
          .eq('round', teamData.round || 1)
          .order('rank_position')

        if (rankingsData) {
          setRankings(rankingsData as any)
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading results...</p>
        </div>
      </div>
    )
  }

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />
      case 3:
        return <Award className="w-8 h-8 text-orange-600" />
      default:
        return null
    }
  }

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'border-yellow-500/50 bg-yellow-500/10'
      case 2:
        return 'border-gray-400/50 bg-gray-400/10'
      case 3:
        return 'border-orange-600/50 bg-orange-600/10'
      default:
        return 'border-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Round <span className="text-neon-blue">{currentTeam?.round || 1}</span> Results
          </h1>
          <p className="text-gray-400">Final Rankings</p>
        </motion.div>

        {rankings.length === 0 ? (
          <div className="bg-card border border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-400">Rankings will be published soon...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rankings.map((ranking, index) => {
              const isCurrentTeam = ranking.team_id === currentTeam?.id
              
              return (
                <motion.div
                  key={ranking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-card border rounded-lg p-6 ${
                    isCurrentTeam 
                      ? 'border-neon-blue glow-blue' 
                      : getRankColor(ranking.rank_position)
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(ranking.rank_position) || (
                          <span className="text-2xl font-bold text-gray-400">
                            #{ranking.rank_position}
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <p className="font-mono text-sm text-neon-blue">
                          {ranking.team.team_code}
                        </p>
                        <p className="text-sm text-gray-400">
                          {ranking.team.participant1} & {ranking.team.participant2}
                        </p>
                        {isCurrentTeam && (
                          <span className="text-xs text-neon-green font-semibold">
                            Your Team
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-neon-green">
                        {ranking.score.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">points</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => router.push('/')}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  )
}
