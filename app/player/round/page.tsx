'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Team, RoundStatus, NewsCard, StockSelection } from '@/types/database'
import { formatCurrency, formatTime } from '@/lib/utils'
import { Clock, TrendingUp, Wallet, ChevronDown, ChevronUp, Send } from 'lucide-react'

export default function RoundPage() {
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [roundStatus, setRoundStatus] = useState<RoundStatus | null>(null)
  const [newsCards, setNewsCards] = useState<NewsCard[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [selections, setSelections] = useState<Record<string, { quantity: number; amount: number }>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const PURSE = 100000

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
        
        if (!teamData.is_admitted) {
          router.push('/player/waiting')
          return
        }

        const currentRound = teamData.round || 1

        const { data: roundData } = await supabase
          .from('round_status')
          .select('*')
          .eq('round_number', currentRound)
          .single()

        if (roundData) {
          setRoundStatus(roundData)
          
          if (!roundData.is_active) {
            router.push('/player/waiting')
            return
          }
        }

        const { data: newsData } = await supabase
          .from('news_cards')
          .select('*')
          .eq('round', currentRound)
          .eq('published', true)
          .order('created_at')

        if (newsData) setNewsCards(newsData)

        const { data: submissionData } = await supabase
          .from('submissions')
          .select('*')
          .eq('team_id', teamId)
          .eq('round', currentRound)
          .single()

        if (submissionData) {
          setSubmitted(true)
        }
      }
    }

    fetchData()

    const roundChannel = supabase
      .channel('round-updates-player')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'round_status' },
        (payload) => {
          const round = payload.new as RoundStatus
          setRoundStatus(round)
          
          if (!round.is_active) {
            router.push('/player/results')
          }
        }
      )
      .subscribe()

    return () => {
      roundChannel.unsubscribe()
    }
  }, [router])

  useEffect(() => {
    if (!roundStatus?.end_time) return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(roundStatus.end_time!).getTime()
      const remaining = Math.max(0, Math.floor((end - now) / 1000))
      
      setTimeRemaining(remaining)
      
      if (remaining === 0 && !submitted) {
        handleAutoSubmit()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [roundStatus, submitted])

  const totalInvested = Object.values(selections).reduce((sum, s) => sum + s.amount, 0)
  const remainingPurse = PURSE - totalInvested

  const updateSelection = (stockName: string, quantity: number, price: number) => {
    const amount = quantity * price
    
    if (amount > remainingPurse + (selections[stockName]?.amount || 0)) {
      alert('Insufficient funds!')
      return
    }

    if (quantity === 0) {
      const newSelections = { ...selections }
      delete newSelections[stockName]
      setSelections(newSelections)
    } else {
      setSelections({
        ...selections,
        [stockName]: { quantity, amount }
      })
    }
  }

  const handleAutoSubmit = async () => {
    if (submitted) return
    await submitSelections(true)
  }

  const submitSelections = async (isAuto = false) => {
    const supabase = createClient()
    const teamId = localStorage.getItem('team_id')
    
    const stockSelections: StockSelection[] = Object.entries(selections).map(([stockName, data]) => {
      const card = newsCards.find(n => n.stock_name === stockName)
      return {
        stock_name: stockName,
        quantity: data.quantity,
        invested_amount: data.amount,
        price_at_selection: card?.previous_price || 0
      }
    })

    await supabase.from('submissions').insert({
      team_id: teamId,
      round: team?.round || 1,
      selected_stocks: stockSelections,
      total_score: 0,
      is_auto_submitted: isAuto
    })

    setSubmitted(true)
    setShowConfirmModal(false)
  }

  if (!team || !roundStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading round...</p>
        </div>
      </div>
    )
  }

  const isLowTime = timeRemaining <= 300 && timeRemaining > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="container mx-auto max-w-6xl py-8">
        {/* Header */}
        <div className="bg-card border border-neon-blue/30 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Round <span className="text-neon-blue">{team.round || 1}</span>
              </h1>
              <p className="text-gray-400 font-mono text-sm">{team.team_code}</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-500' : 'text-neon-blue'}`} />
                  <span className="text-sm text-gray-400">Time Left</span>
                </div>
                <p className={`text-2xl font-bold font-mono ${isLowTime ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-5 h-5 text-neon-green" />
                  <span className="text-sm text-gray-400">Remaining</span>
                </div>
                <p className="text-2xl font-bold text-neon-green">
                  {formatCurrency(remainingPurse)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* News Cards */}
        <div className="grid gap-4 mb-6">
          {newsCards.map((card) => {
            const isExpanded = expandedCard === card.id
            const selection = selections[card.stock_name]
            
            return (
              <motion.div
                key={card.id}
                layout
                className="bg-card border border-neon-blue/20 rounded-lg overflow-hidden hover:border-neon-blue/50 transition-colors"
              >
                <button
                  onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                  className="w-full p-4 flex justify-between items-center text-left"
                  disabled={submitted}
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{card.headline}</h3>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span className="text-neon-blue font-mono">{card.stock_name}</span>
                      <span>₹{card.previous_price.toFixed(2)}</span>
                      {selection && (
                        <span className="text-neon-green">
                          Selected: {selection.quantity} units
                        </span>
                      )}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-700"
                    >
                      <div className="p-4 space-y-4">
                        <p className="text-gray-300">{card.hint}</p>
                        
                        {!submitted && (
                          <div className="flex gap-4 items-end">
                            <div className="flex-1">
                              <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                              <input
                                type="number"
                                min="0"
                                value={selection?.quantity || 0}
                                onChange={(e) => updateSelection(
                                  card.stock_name,
                                  parseInt(e.target.value) || 0,
                                  card.previous_price
                                )}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm text-gray-400 mb-2">Investment</label>
                              <p className="text-lg font-bold text-neon-green">
                                {formatCurrency(selection?.amount || 0)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Submit Button */}
        {!submitted ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowConfirmModal(true)}
            disabled={Object.keys(selections).length === 0}
            className="w-full bg-neon-blue hover:bg-neon-blue/80 disabled:bg-gray-600 text-black font-bold py-4 rounded-lg text-lg flex items-center justify-center gap-2 glow-blue disabled:glow-none transition-all"
          >
            <Send className="w-5 h-5" />
            Submit Selections
          </motion.button>
        ) : (
          <div className="bg-neon-green/20 border border-neon-green rounded-lg p-6 text-center">
            <p className="text-neon-green font-bold text-lg">✓ Submitted Successfully!</p>
            <p className="text-gray-400 text-sm mt-2">Wait for the round to end</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-neon-blue rounded-lg p-6 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-4">Confirm Submission</h2>
              
              <div className="space-y-2 mb-6">
                {Object.entries(selections).map(([stock, data]) => (
                  <div key={stock} className="flex justify-between text-sm">
                    <span className="text-gray-400">{stock}</span>
                    <span className="text-white">{data.quantity} units - {formatCurrency(data.amount)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-2 flex justify-between font-bold">
                  <span>Total Invested</span>
                  <span className="text-neon-green">{formatCurrency(totalInvested)}</span>
                </div>
              </div>
              
              <p className="text-yellow-500 text-sm mb-6">
                ⚠️ You cannot change your selections after submission!
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => submitSelections(false)}
                  className="flex-1 bg-neon-blue hover:bg-neon-blue/80 text-black py-3 rounded-lg font-bold"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
