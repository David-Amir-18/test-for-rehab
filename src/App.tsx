import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Progress } from './components/ui/progress'

// Import pages
import HomePage from './components/HomePage'
import ChatbotPage from './components/ChatbotPage'
import AnalysisPage from './components/AnalysisPage'
import ResultsPage from './components/ResultsPage'
import ErrorPage from './components/ErrorPage'

// Simple inline LoadingScreen component for testing
function SimpleLoading({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  // Auto-complete after 3 seconds for testing
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => onComplete(), 300)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-4xl mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Initializing Zeto System
      </motion.h1>
      <div className="w-80">
        <Progress value={progress} className="h-2" />
        <p className="text-center mt-4 text-gray-400">{progress}% Complete</p>
      </div>
    </motion.div>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Router>
      <div className="w-full min-h-screen">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <SimpleLoading key="loading" onComplete={() => setIsLoading(false)} />
          ) : (
            <motion.div 
              key="app" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full min-h-screen"
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/detection" element={<ChatbotPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  )
}