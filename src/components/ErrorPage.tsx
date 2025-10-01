import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Home, RotateCcw, AlertTriangle } from 'lucide-react'

function ErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/30 to-purple-900 flex items-center justify-center p-6 overflow-hidden">
      {/* Animated stars background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Floating Astronaut */}
        <motion.div
          className="mb-8"
          animate={{ 
            y: [0, -20, 0],
            rotate: [-5, 5, -5]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative inline-block">
            {/* Astronaut helmet */}
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full mx-auto mb-4 relative overflow-hidden"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 30px rgba(59, 130, 246, 0.8)',
                  '0 0 20px rgba(59, 130, 246, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Helmet reflection */}
              <div className="absolute inset-2 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full" />
              
              {/* Astronaut face */}
              <div className="absolute inset-6 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Body */}
            <div className="w-20 h-24 bg-gradient-to-b from-gray-200 to-gray-400 rounded-lg mx-auto relative">
              <div className="absolute inset-2 bg-gradient-to-b from-blue-500 to-blue-700 rounded"></div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-black rounded"></div>
            </div>

            {/* Arms */}
            <div className="absolute top-16 -left-6 w-8 h-3 bg-gray-300 rounded-full transform rotate-12"></div>
            <div className="absolute top-16 -right-6 w-8 h-3 bg-gray-300 rounded-full transform -rotate-12"></div>

            {/* Legs */}
            <div className="flex justify-center gap-2 mt-2">
              <div className="w-3 h-12 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-12 bg-gray-300 rounded-full"></div>
            </div>

            {/* Floating debris */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gray-400 rounded"
                style={{
                  left: `${-50 + Math.random() * 200}px`,
                  top: `${-30 + Math.random() * 100}px`,
                }}
                animate={{
                  x: [0, Math.random() * 40 - 20],
                  y: [0, Math.random() * 40 - 20],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.h1
            className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500"
            animate={{ 
              textShadow: [
                '0 0 10px rgba(239, 68, 68, 0.5)',
                '0 0 20px rgba(239, 68, 68, 0.8)',
                '0 0 10px rgba(239, 68, 68, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            404
          </motion.h1>
          
          <h2 className="text-3xl font-bold mb-4 text-white">
            Lost in Space
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto">
            Houston, we have a problem! This page has drifted into the void of deep space.
          </p>
        </motion.div>

        {/* Error Details */}
        <motion.div
          className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-red-500/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <span className="text-red-400 font-semibold">System Status</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-400 mb-1">Navigation</div>
              <div className="text-gray-300">Online</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 mb-1">Page</div>
              <div className="text-gray-300">Missing</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 mb-1">Life Support</div>
              <div className="text-gray-300">Stable</div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <motion.button
            onClick={() => navigate('/')}
            className="group bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-8 py-3 rounded-full text-white font-semibold transition-all duration-200 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5" />
            Return to Base
            <motion.div
              className="w-0 h-0.5 bg-white group-hover:w-4 transition-all duration-200"
            />
          </motion.button>

          <motion.button
            onClick={() => window.location.reload()}
            className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-full text-white font-semibold transition-all duration-200 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5" />
            Retry Mission
          </motion.button>
        </motion.div>

        {/* Help Text */}
        <motion.p
          className="text-gray-400 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          If you continue to experience problems, please contact Mission Control
        </motion.p>

        {/* Floating rescue ship */}
        <motion.div
          className="fixed bottom-10 right-10 w-12 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 pointer-events-none"
          style={{ clipPath: 'polygon(0 50%, 30% 0, 100% 20%, 100% 80%, 30% 100%)' }}
          animate={{
            x: [100, -1200],
            y: [0, -10, 0, 10, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  )
}

export default ErrorPage