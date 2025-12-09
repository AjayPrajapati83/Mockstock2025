import { motion } from 'framer-motion'

export default function Loading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  )
}
