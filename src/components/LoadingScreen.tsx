import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface Planet {
  name: string
  size: number
  distance: number
  speed: number
  color: string
}

const planets: Planet[] = [
  { name: 'Mercury', size: 8, distance: 60, speed: 4, color: '#FFA726' },
  { name: 'Venus', size: 12, distance: 80, speed: 3, color: '#FF7043' },
  { name: 'Earth', size: 14, distance: 100, speed: 2, color: '#42A5F5' },
  { name: 'Mars', size: 10, distance: 120, speed: 1.5, color: '#EF5350' },
  { name: 'Jupiter', size: 28, distance: 160, speed: 1, color: '#FFB74D' },
  { name: 'Saturn', size: 24, distance: 200, speed: 0.8, color: '#FFCC02' },
  { name: 'Uranus', size: 18, distance: 240, speed: 0.6, color: '#29B6F6' },
  { name: 'Neptune', size: 16, distance: 280, speed: 0.4, color: '#3F51B5' }
]

interface LoadingScreenProps {
  onComplete: () => void
}

function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            onComplete()
          }, 500)
          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <motion.div 
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Stars background */}
      <div className="stars">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Solar System */}
      <div className="relative">
        {/* Sun */}
        <motion.div 
          className="absolute w-16 h-16 bg-yellow-400 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            boxShadow: [
              '0 0 20px #FFD700',
              '0 0 40px #FFD700',
              '0 0 20px #FFD700'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Planets */}
        {planets.map((planet, index) => (
          <motion.div
            key={planet.name}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 20 / planet.speed, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <div
              className="rounded-full border border-white/20"
              style={{ 
                width: planet.distance * 2, 
                height: planet.distance * 2 
              }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: planet.size,
                height: planet.size,
                backgroundColor: planet.color,
                top: -planet.size / 2,
                left: planet.distance - planet.size / 2,
                boxShadow: `0 0 10px ${planet.color}`
              }}
              animate={{ 
                boxShadow: [
                  `0 0 10px ${planet.color}`,
                  `0 0 20px ${planet.color}`,
                  `0 0 10px ${planet.color}`
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </div>

      {/* Loading text and progress */}
      <motion.div 
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Initializing Zeto System
        </h2>
        <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="mt-2 text-gray-400">{progress}% Complete</p>
      </motion.div>
    </motion.div>
  )
}

export default LoadingScreen