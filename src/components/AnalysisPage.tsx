import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Radar, Satellite, Zap, ArrowRight } from "lucide-react";

interface Phase {
  name: string;
  icon: JSX.Element;
  duration: number;
}

interface AnalysisResult {
  type: "confirmed" | "candidate" | "false_positive";
  confidence: number;
  title: string;
  description: string;
}

// API Configuration - Developer can update these values
const API_CONFIG = {
  enabled: false, // Set to true when backend is ready
  endpoint: "/api/analyze", // Backend API endpoint
  timeout: 30000, // Request timeout in milliseconds
};

function AnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const parameters = location.state?.parameters || {};

  const phases: Phase[] = [
    {
      name: "Spectral Analysis",
      icon: <Radar className="w-8 h-8" />,
      duration: 2000,
    },
    {
      name: "Transit Modeling",
      icon: <Satellite className="w-8 h-8" />,
      duration: 2500,
    },
    {
      name: "Statistical Validation",
      icon: <Zap className="w-8 h-8" />,
      duration: 2000,
    },
    {
      name: "Final Classification",
      icon: <ArrowRight className="w-8 h-8" />,
      duration: 1500,
    },
  ];

  useEffect(() => {
    let totalDuration = 0;
    phases.forEach((phase, index) => {
      setTimeout(() => {
        setCurrentPhase(index);
      }, totalDuration);
      totalDuration += phase.duration;
    });

    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          // After completion, call API or use mock data
          setTimeout(() => {
            handleAnalysis();
          }, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, totalDuration / 100);

    return () => clearInterval(progressTimer);
  }, [navigate, parameters]);

  /**
   * Main analysis handler - calls backend API or uses mock data
   * Developer: Replace the mock logic with actual API call when ready
   */
  const handleAnalysis = async () => {
    try {
      let result: AnalysisResult;

      if (API_CONFIG.enabled) {
        // ===== BACKEND API CALL =====
        // Developer: Uncomment and configure when backend is ready
        result = await callBackendAPI(parameters);
      } else {
        // ===== MOCK DATA (for testing) =====
        result = generateMockResult(parameters);
      }

      // Navigate to results page with the analysis result
      navigate("/results", { state: { result, parameters } });
    } catch (error) {
      console.error("Analysis error:", error);
      setApiError(error instanceof Error ? error.message : "Analysis failed");
      // Optionally navigate to error page or show error state
    }
  };

  /**
   * Backend API call function
   * Developer: Implement this function when backend is ready
   */
  const callBackendAPI = async (
    params: Record<string, number>
  ): Promise<AnalysisResult> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(API_CONFIG.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Expected API response format:
      // {
      //   type: 'confirmed' | 'candidate' | 'false_positive',
      //   confidence: number (0-100),
      //   title: string,
      //   description: string
      // }

      return {
        type: data.type || "candidate",
        confidence: data.confidence || 0,
        title: data.title || "Analysis Complete",
        description: data.description || "Analysis completed successfully",
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("API request timed out");
      }
      throw error;
    }
  };

  /**
   * Mock result generator for testing without backend
   * Developer: This will be replaced by actual API results
   */
  const generateMockResult = (
    params: Record<string, number>
  ): AnalysisResult => {
    // Simple mock algorithm based on parameters
    // This simulates AI analysis for testing purposes

    const { orbper, trandep, trandur, rade, insol, eqt, teff, logg, rad } =
      params;

    // Calculate a mock score based on some basic rules
    let score = 0.5; // Base score

    // Adjust score based on transit depth (deeper transits are more reliable)
    if (trandep > 50) score += 0.2;

    // Adjust based on planet radius (Earth-like planets are interesting)
    if (rade >= 0.5 && rade <= 2) score += 0.15;

    // Adjust based on equilibrium temperature (habitable zone)
    if (eqt >= 200 && eqt <= 350) score += 0.15;

    // Add randomness to simulate AI uncertainty
    score += (Math.random() - 0.5) * 0.2;

    // Clamp score between 0 and 1
    score = Math.max(0, Math.min(1, score));

    if (score > 0.7) {
      return {
        type: "confirmed",
        confidence: 90 + Math.random() * 10,
        title: "Confirmed Exoplanet",
        description:
          "Congratulations! The data strongly suggests a confirmed exoplanet detection. All parameters fall within expected ranges for a genuine planetary transit.",
      };
    } else if (score > 0.4) {
      return {
        type: "candidate",
        confidence: 55 + Math.random() * 35,
        title: "Exoplanet Candidate",
        description:
          "Promising signals detected. The data shows characteristics consistent with a planetary transit, but additional observations are recommended for confirmation.",
      };
    } else {
      return {
        type: "false_positive",
        confidence: 80 + Math.random() * 20,
        title: "False Positive",
        description:
          "Analysis indicates this signal is likely caused by stellar activity, eclipsing binary stars, or instrumental effects rather than a genuine exoplanet.",
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Main Analysis Display */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Zeto Deep Space Analysis
          </h1>
          <p className="text-xl text-gray-300">
            {API_CONFIG.enabled
              ? "AI processing your exoplanet data..."
              : "Zeto AI processing your exoplanet data..."}
          </p>
          {apiError && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-300">Error: {apiError}</p>
            </div>
          )}
        </motion.div>

        {/* Central Animation */}
        <div className="relative mb-12">
          <motion.div
            className="w-80 h-80 mx-auto relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            {/* Outer ring */}
            <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full" />

            {/* Middle ring */}
            <motion.div
              className="absolute inset-8 border-2 border-purple-500/50 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Inner ring */}
            <motion.div
              className="absolute inset-16 border-2 border-blue-400/50 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            {/* Central icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                {phases[currentPhase]?.icon}
              </div>
            </motion.div>

            {/* Orbiting data points */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transformOrigin: `${40 + i * 20}px 0px`,
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>

          {/* Scanning lines */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `conic-gradient(from ${
                progress * 3.6
              }deg, transparent 0deg, rgba(0, 212, 255, 0.3) 60deg, transparent 120deg)`,
            }}
          />
        </div>

        {/* Progress Section */}
        <motion.div
          className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 border border-cyan-500/30"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Current Phase */}
          <div className="text-center mb-6">
            <motion.h3
              className="text-2xl font-bold text-cyan-400 mb-2"
              key={currentPhase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {phases[currentPhase]?.name}
            </motion.h3>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Analysis Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Phase Indicators */}
          <div className="grid grid-cols-4 gap-4">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                className={`text-center p-3 rounded-lg border transition-all duration-300 ${
                  index <= currentPhase
                    ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400"
                    : "border-gray-600 text-gray-500"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-2 flex justify-center">{phase.icon}</div>
                <div className="text-sm">{phase.name}</div>
                {index <= currentPhase && (
                  <motion.div
                    className="mt-2 w-2 h-2 bg-cyan-400 rounded-full mx-auto"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Data Stream Simulation */}
          <div className="mt-6 h-20 bg-gray-900/50 rounded-lg p-4 overflow-hidden relative">
            <div className="text-xs text-green-400 font-mono leading-tight">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: [0, 1, 0], x: [0, 300] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  {`> PROCESSING: orbper=${parameters.orbper?.toFixed(
                    2
                  )} | rade=${parameters.rade?.toFixed(
                    2
                  )} | eqt=${parameters.eqt?.toFixed(0)}K`}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="fixed w-1 h-1 bg-blue-400 rounded-full pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
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
  );
}

export default AnalysisPage;
