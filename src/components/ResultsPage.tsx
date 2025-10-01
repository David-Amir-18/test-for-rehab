import { motion } from 'motion/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, AlertTriangle, XCircle, RotateCcw, Home, Download } from 'lucide-react'
import { useState } from 'react'

interface Result {
  type: 'confirmed' | 'candidate' | 'false_positive'
  confidence: number
  title: string
  description: string
}

interface ResultConfig {
  icon: JSX.Element
  color: string
  bgColor: string
  borderColor: string
  glowColor: string
  particleColor: string
}

function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { result, parameters }: { result?: Result; parameters?: Record<string, any> } = location.state || {}
  const [showDetails, setShowDetails] = useState(false)

  if (!result) {
    navigate('/detection')
    return null
  }

  const getResultConfig = (type: string): ResultConfig => {
    switch (type) {
      case 'confirmed':
        return {
          icon: <CheckCircle className="w-16 h-16" />,
          color: 'from-green-400 to-cyan-400',
          bgColor: 'from-green-900/20 to-cyan-900/20',
          borderColor: 'border-green-400/50',
          glowColor: '0 0 30px rgba(34, 197, 94, 0.5)',
          particleColor: 'bg-green-400'
        }
      case 'candidate':
        return {
          icon: <AlertTriangle className="w-16 h-16" />,
          color: 'from-yellow-400 to-orange-400',
          bgColor: 'from-yellow-900/20 to-orange-900/20',
          borderColor: 'border-yellow-400/50',
          glowColor: '0 0 30px rgba(251, 191, 36, 0.5)',
          particleColor: 'bg-yellow-400'
        }
      case 'false_positive':
        return {
          icon: <XCircle className="w-16 h-16" />,
          color: 'from-red-400 to-pink-400',
          bgColor: 'from-red-900/20 to-pink-900/20',
          borderColor: 'border-red-400/50',
          glowColor: '0 0 30px rgba(239, 68, 68, 0.5)',
          particleColor: 'bg-red-400'
        }
      default:
        return {
          icon: <AlertTriangle className="w-16 h-16" />,
          color: 'from-gray-400 to-gray-600',
          bgColor: 'from-gray-900/20 to-gray-800/20',
          borderColor: 'border-gray-400/50',
          glowColor: '0 0 30px rgba(107, 114, 128, 0.5)',
          particleColor: 'bg-gray-400'
        }
    }
  }

  const config = getResultConfig(result.type)

  const exportResults = () => {
    const exportData = {
      result,
      parameters,
      timestamp: new Date().toISOString(),
      analysis_id: `EXO-${Date.now()}`
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `exoplanet_analysis_${exportData.analysis_id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Analysis Complete
          </h1>
          <p className="text-xl text-gray-300">Detection results are ready</p>
        </motion.div>

        {/* Main Result Card */}
        <motion.div
          className={`relative bg-gradient-to-br ${config.bgColor} backdrop-blur-sm rounded-2xl p-8 border ${config.borderColor} mb-8 overflow-hidden`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ boxShadow: config.glowColor }}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 ${config.particleColor} rounded-full`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            {/* Result Icon and Title */}
            <div className="text-center mb-6">
              <motion.div
                className={`inline-flex items-center justify-center mb-4 text-transparent bg-clip-text bg-gradient-to-r ${config.color}`}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotateY: [0, 360, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {config.icon}
              </motion.div>
              
              <motion.h2
                className={`text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r ${config.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {result.title}
              </motion.h2>
              
              <motion.p
                className="text-lg text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {result.description}
              </motion.p>
            </div>

            {/* Confidence Score */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                {Math.round(result.confidence)}%
              </div>
              <div className="text-gray-400">Confidence Level</div>
              
              {/* Animated confidence bar */}
              <div className="w-full max-w-md mx-auto mt-4 bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${result.confidence}%` }}
                  transition={{ duration: 2, delay: 1 }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="grid md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-gray-800/80 hover:bg-gray-700/80 border border-cyan-500/30 hover:border-cyan-400/50 rounded-lg p-4 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <div className="text-sm">View Details</div>
            </div>
          </motion.button>

          <motion.button
            onClick={exportResults}
            className="bg-gray-800/80 hover:bg-gray-700/80 border border-cyan-500/30 hover:border-cyan-400/50 rounded-lg p-4 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <Download className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <div className="text-sm">Export Data</div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => navigate('/detection')}
            className="bg-gray-800/80 hover:bg-gray-700/80 border border-cyan-500/30 hover:border-cyan-400/50 rounded-lg p-4 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <div className="text-sm">New Analysis</div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg p-4 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <Home className="w-6 h-6 mx-auto mb-2 text-white" />
              <div className="text-sm text-white">Home</div>
            </div>
          </motion.button>
        </motion.div>

        {/* Detailed Results */}
        {showDetails && parameters && (
          <motion.div
            className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-4 text-cyan-400">Analysis Parameters</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(parameters).map(([key, value]) => (
                <div key={key} className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="text-lg text-white">{String(value)}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Floating Elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`fixed w-1 h-1 ${config.particleColor} rounded-full pointer-events-none`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default ResultsPage