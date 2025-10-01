import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Bot, User, AlertCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: string;
  placeholder: string;
  hint: string;
  min: number;
  max: number;
  apiKey: string;
}

interface Message {
  id: string;
  content: string;
  sender: "bot" | "user";
  timestamp: Date;
  isError?: boolean;
}

const questions: Question[] = [
  {
    id: "orbital_period",
    apiKey: "orbper",
    question: "What is the orbital period in days?",
    type: "number",
    placeholder: "e.g., 365.25",
    hint: "Time for one complete orbit around the star (0.15 - 84000 days)",
    min: 0.15,
    max: 84000,
  },
  {
    id: "transit_depth",
    apiKey: "trandep",
    question: "What is the transit depth in ppm?",
    type: "number",
    placeholder: "e.g., 100",
    hint: "How much the star dims during transit (0.05 - 135.5 ppm)",
    min: 0.05,
    max: 135.5,
  },
  {
    id: "transit_duration",
    apiKey: "trandur",
    question: "What is the transit duration in hours?",
    type: "number",
    placeholder: "e.g., 3.5",
    hint: "How long the transit lasts (0 - 55 hours)",
    min: 0,
    max: 55,
  },
  {
    id: "planet_radius",
    apiKey: "rade",
    question: "What is the planet radius in Earth radii?",
    type: "number",
    placeholder: "e.g., 1.2",
    hint: "Size relative to Earth (0.4 - 1080 Earth radii)",
    min: 0.4,
    max: 1080,
  },
  {
    id: "insolation_flux",
    apiKey: "insol",
    question: "What is the insolation flux in Earth flux units?",
    type: "number",
    placeholder: "e.g., 1.0",
    hint: "Amount of stellar energy received (0.027 - 8270 Earth flux units)",
    min: 0.027,
    max: 8270,
  },
  {
    id: "equilibrium_temp",
    apiKey: "eqt",
    question: "What is the equilibrium temperature in Kelvin?",
    type: "number",
    placeholder: "e.g., 288",
    hint: "Expected surface temperature (82 - 2510 K)",
    min: 82,
    max: 2510,
  },
  {
    id: "stellar_temp",
    apiKey: "teff",
    question: "What is the stellar effective temperature in Kelvin?",
    type: "number",
    placeholder: "e.g., 5778",
    hint: "Temperature of the host star (2520 - 46700 K)",
    min: 2520,
    max: 46700,
  },
  {
    id: "stellar_logg",
    apiKey: "logg",
    question: "What is the stellar log(g) in cm/s²?",
    type: "number",
    placeholder: "e.g., 4.5",
    hint: "Surface gravity of the star (1.773 - 5.275)",
    min: 1.773,
    max: 5.275,
  },
  {
    id: "stellar_radius",
    apiKey: "rad",
    question: "What is the stellar radius in solar radii?",
    type: "number",
    placeholder: "e.g., 1.0",
    hint: "Size relative to the Sun (0.11 - 85 solar radii)",
    min: 0.11,
    max: 85,
  },
];

function ChatbotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [parameters, setParameters] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // A function to handle the entire greeting sequence
    const startGreeting = async () => {
      // 1. Initial greeting
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addMessage(
        "Hello, Commander! I'm Zeto, your AI exoplanet detection assistant. I'll help you analyze astronomical data to determine if we've found a new world.",
        "bot"
      );

      // 2. Introduction to the task
      await new Promise((resolve) => setTimeout(resolve, 2500));
      addMessage(
        "I need to collect some parameters from your observations. Let's begin!",
        "bot"
      );

      // 3. Ask the first question
      await new Promise((resolve) => setTimeout(resolve, 1500));
      askNextQuestion();
    };

    startGreeting();
  }, []); // Only runs once on mount

  const addMessage = (
    content: string,
    sender: "bot" | "user",
    delay = 0,
    isError = false
  ) => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + Math.random()).toString(),
          content,
          sender,
          timestamp: new Date(),
          isError,
        },
      ]);
    }, delay);
  };

  const typeMessage = async (
    content: string,
    sender: "bot" | "user",
    isError = false
  ) => {
    setIsTyping(true);
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );
    setIsTyping(false);
    addMessage(content, sender, 0, isError);
  };

  const askNextQuestion = () => {
    console.log(`current question is: ${currentQuestion}`);
    console.log(`current questions length is: ${questions.length}`);

    if (currentQuestion < questions.length) {
      const question = questions[currentQuestion];

      // Combine the question and the hint into a single message
      const combinedMessage = `${question.question}\n\n💡 ${question.hint}`;

      setTimeout(() => {
        // Use typeMessage to send the combined message
        typeMessage(combinedMessage, "bot");

        // Remove the separate setTimeout for the hint
        // setTimeout(() => {
        //   addMessage(`💡 ${question.hint}`, "bot");
        // }, 1500);
      }, 500);
    }
  };

  const validateInput = (
    value: number,
    question: Question
  ): { valid: boolean; message?: string } => {
    if (isNaN(value)) {
      return { valid: false, message: "Please enter a valid number." };
    }
    if (value < question.min || value > question.max) {
      return {
        valid: false,
        message: `Value must be between ${question.min} and ${question.max}.`,
      };
    }
    return { valid: true };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const question = questions[currentQuestion];
    const inputValue = parseFloat(userInput);

    // Validate input
    const validation = validateInput(inputValue, question);

    // Display user's input
    addMessage(userInput, "user");

    if (!validation.valid) {
      // Show error message
      setTimeout(() => {
        addMessage(
          `⚠️ ${validation.message} Please try again.`,
          "bot",
          0,
          true
        );
      }, 500);
      setUserInput("");
      return; // Exit early if validation fails
    }

    // Store parameter with API key (only if validation passed)
    setParameters((prev) => ({
      ...prev,
      [question.apiKey]: inputValue,
    }));

    setUserInput("");

    // Move to next question or complete
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        addMessage("Got it! Next parameter...", "bot");
      }, 500);
      console.log("printed Got it! ");

      console.log("called setCurrentQuestion start");
      setCurrentQuestion((prev: number) => {
        console.log(prev + 1);
        return prev + 1;
      });
      console.log("called setCurrentQuestion end");

      console.log("called askNextQuestion start");
      askNextQuestion();
      console.log("called askNextQuestion end");

      setTimeout(() => {}, 1000);
    } else {
      setIsComplete(true);
      setTimeout(() => {
        typeMessage(
          "Perfect! I have all the data I need. Initiating Zeto deep space analysis...",
          "bot"
        );
      }, 1000);
      setTimeout(() => {
        navigate("/analysis", { state: { parameters } });
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col">
      {/* Header */}
      <motion.header
        className="p-6 border-b border-blue-500/30"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Bot className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Zeto Detection Assistant
            </h1>
            <p className="text-gray-400">AI-Powered Exoplanet Analysis</p>
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isError
                      ? "bg-gradient-to-r from-red-500 to-orange-500"
                      : "bg-gradient-to-r from-cyan-400 to-blue-500"
                  }`}
                  animate={{
                    boxShadow: message.isError
                      ? [
                          "0 0 10px rgba(239, 68, 68, 0.5)",
                          "0 0 20px rgba(239, 68, 68, 0.8)",
                          "0 0 10px rgba(239, 68, 68, 0.5)",
                        ]
                      : [
                          "0 0 10px rgba(0, 212, 255, 0.5)",
                          "0 0 20px rgba(0, 212, 255, 0.8)",
                          "0 0 10px rgba(0, 212, 255, 0.5)",
                        ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {message.isError ? (
                    <AlertCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </motion.div>
              )}

              <motion.div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto"
                    : message.isError
                    ? "bg-red-900/30 text-red-200 backdrop-blur-sm border border-red-500/30"
                    : "bg-gray-800/80 text-gray-100 backdrop-blur-sm border border-cyan-500/20"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                {message.content}
              </motion.div>

              {message.sender === "user" && (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-800/80 px-4 py-3 rounded-2xl border border-cyan-500/20 backdrop-blur-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isComplete && currentQuestion < questions.length && !isTyping && (
        <motion.form
          onSubmit={handleSubmit}
          className="p-6 border-t border-blue-500/30"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex gap-3">
            <input
              type={questions[currentQuestion]?.type || "text"}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={
                questions[currentQuestion]?.placeholder ||
                "Type your response..."
              }
              className="flex-1 bg-gray-800/80 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-sm"
              autoFocus
              step="any"
            />
            <motion.button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 p-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!userInput.trim()}
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.form>
      )}

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 bg-cyan-400 rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

export default ChatbotPage;
