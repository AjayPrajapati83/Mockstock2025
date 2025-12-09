'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, Users, Trophy } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated ticker */}
      <div className="bg-black/50 border-b border-neon-blue/30 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap py-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-8 px-8">
              <span className="text-neon-green">RELIANCE ↑ 2,450</span>
              <span className="text-red-500">TCS ↓ 3,890</span>
              <span className="text-neon-green">INFY ↑ 1,650</span>
              <span className="text-neon-blue">HDFC ↑ 1,780</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            <span className="text-glow-blue text-neon-blue">Mock</span>
            <span className="text-glow-green text-neon-green">Stock</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-2">Ubuntu 2025</p>
          <p className="text-lg text-gray-400">Realtime Stock Trading Competition</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-card border border-neon-blue/30 rounded-lg p-6 hover:glow-blue transition-all">
            <TrendingUp className="w-12 h-12 text-neon-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">3 Rounds</h3>
            <p className="text-gray-400">30 minutes each, increasing difficulty</p>
          </div>
          <div className="bg-card border border-neon-green/30 rounded-lg p-6 hover:glow-green transition-all">
            <Users className="w-12 h-12 text-neon-green mb-4" />
            <h3 className="text-xl font-bold mb-2">Team Event</h3>
            <p className="text-gray-400">2 participants per team</p>
          </div>
          <div className="bg-card border border-neon-violet/30 rounded-lg p-6 hover:shadow-lg hover:shadow-neon-violet/20 transition-all">
            <Trophy className="w-12 h-12 text-neon-violet mb-4" />
            <h3 className="text-xl font-bold mb-2">₹1,00,000</h3>
            <p className="text-gray-400">Virtual purse per round</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/player/join"
            className="bg-neon-blue hover:bg-neon-blue/80 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all glow-blue"
          >
            Join as Player
          </Link>
          <Link
            href="/admin/login"
            className="bg-gray-800 hover:bg-gray-700 border border-neon-green text-white font-bold py-4 px-8 rounded-lg text-lg transition-all"
          >
            Admin Login
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
