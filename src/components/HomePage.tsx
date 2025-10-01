import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Telescope,
  Search,
  Zap,
  Rocket,
  Globe,
  Stars,
} from "lucide-react";

interface Planet {
  name: string;
  size: number;
  distance: number;
  speed: number;
  color: string;
}

const planets: Planet[] = [
  { name: "Mercury", size: 8, distance: 60, speed: 4, color: "#FFA726" },
  { name: "Venus", size: 12, distance: 80, speed: 3, color: "#FF7043" },
  { name: "Earth", size: 14, distance: 100, speed: 2, color: "#42A5F5" },
  { name: "Mars", size: 10, distance: 120, speed: 1.5, color: "#EF5350" },
  { name: "Jupiter", size: 28, distance: 160, speed: 1, color: "#FFB74D" },
  { name: "Saturn", size: 24, distance: 200, speed: 0.8, color: "#FFCC02" },
  { name: "Uranus", size: 18, distance: 240, speed: 0.6, color: "#29B6F6" },
  { name: "Neptune", size: 16, distance: 280, speed: 0.4, color: "#3F51B5" },
];

function HomePage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const planetsRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const discoveryRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Planets revolve independent of scroll; keep ref for viewport but no scroll binding

  const { scrollYProgress: missionProgress } = useScroll({
    target: missionRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: discoveryProgress } = useScroll({
    target: discoveryRef,
    offset: ["start end", "end start"],
  });

  // Hero animations
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "100%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.2]);

  // Planet animations are time-based below (no scroll transforms)

  // Mission section

  // Discovery section
  const discoveryY = useTransform(
    discoveryProgress,
    [0, 1],
    ["150px", "-150px"]
  );
  const discoveryScale = useTransform(discoveryProgress, [0, 0.5], [0.8, 1]);

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="h-screen relative flex items-center justify-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />

        <motion.div
          className="text-center z-10 px-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <motion.h1
            className="text-8xl md:text-9xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: "200% 200%" }}
          >
            ZETO
          </motion.h1>
          <motion.h2
            className="text-3xl md:text-5xl mb-8 text-blue-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            EXOPLANET DETECTION SYSTEM
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            AI-powered discovery of worlds beyond our solar system
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </motion.div>

        {/* Hero floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
            style={{
              left: `${20 + (i % 6) * 12}%`,
              top: `${20 + Math.floor(i / 6) * 15}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.section>

      {/* Planetary System Section */}
      <motion.section
        ref={planetsRef}
        className="h-screen relative flex items-center justify-center overflow-visible"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.7 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent" />

        <div className="relative z-10 text-center mb-20 py-32">
          <motion.h2 className="text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            The Cosmic Hunt Begins
          </motion.h2>
          <motion.p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mt-4">
            In the vast expanse of space, billions of worlds await discovery.
            Each planet tells a story of cosmic evolution.
          </motion.p>
        </div>

        {/* Animated Solar System */}
        <motion.div
          className="absolute left-0 right-0 bottom-0 top-32 overflow-visible"
          style={{ pointerEvents: "none" }}
        >
          {/* Sun positioned half outside on the right */}
          {(() => {
            const sunSize = 200; // px
            return (
              <motion.div
                className="absolute bg-yellow-400 rounded-full"
                style={{
                  width: sunSize,
                  height: sunSize,
                  top: "50%",
                  right: -sunSize / 2,
                  transform: "translateY(-50%)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 40px #FFD700",
                    "0 0 80px #FFD700",
                    "0 0 40px #FFD700",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            );
          })()}

          {/* Orbital center anchored at sun center */}
          {(() => {
            const sunSize = 200;
            const centerStyle = {
              position: "absolute" as const,
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
            };
            return (
              <div style={centerStyle}>
                {planets.map((planet, index) => {
                  const minClearance = 100 + planet.size;
                  const baseRadius = sunSize / 2 + minClearance;
                  const radiusStep = 150;
                  const orbitRadius = baseRadius + index * radiusStep;
                  const duration = 20 / planet.speed;

                  return (
                    <motion.div
                      key={planet.name}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        transformOrigin: "0 0",
                        willChange: "transform",
                      }}
                      initial={{ rotate: index * 45 }}
                      animate={{ rotate: index * 45 + 360 }}
                      transition={{
                        duration: duration,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                      }}
                    >
                      <div
                        className="rounded-full"
                        style={{
                          width: planet.size * 2,
                          height: planet.size * 2,
                          backgroundColor: planet.color,
                          marginLeft: orbitRadius,
                          boxShadow: `0 0 20px ${planet.color}`,
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            );
          })()}
        </motion.div>
      </motion.section>

      {/* Mission Details Section */}
      <motion.section
        ref={missionRef}
        className="min-h-screen flex items-center justify-center px-4 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            {
              icon: <Telescope className="w-16 h-16" />,
              title: "Advanced Detection",
              description:
                "Using cutting-edge AI algorithms to analyze stellar data and identify potential exoplanets through transit photometry and radial velocity measurements.",
              planet: planets[0], // Mercury
            },
            {
              icon: <Globe className="w-16 h-16" />,
              title: "Planetary Analysis",
              description:
                "Deep learning models classify planetary candidates by size, composition, and orbital characteristics to determine habitability potential.",
              planet: planets[2], // Earth
            },
            {
              icon: <Stars className="w-16 h-16" />,
              title: "Cosmic Discovery",
              description:
                "Expanding humanity's understanding of the universe by cataloging new worlds and advancing our search for life beyond Earth.",
              planet: planets[4], // Jupiter
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="text-center relative"
              style={{
                y: useTransform(missionProgress, [0, 0.5, 1], [100, 0, -100]),
                rotate: useTransform(
                  missionProgress,
                  [0, 0.2],
                  [0, index % 2 === 0 ? 0 : 0]
                ),
              }}
            >
              {/* Floating planet background */}

              <motion.div
                className="text-cyan-400 mb-6 relative z-10"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {item.icon}
              </motion.div>
              <h3 className="text-3xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                {item.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Discovery Showcase Section */}
      <motion.section
        ref={discoveryRef}
        className="h-screen relative flex items-center justify-center overflow-visible"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute inset-0 z-10 overflow-visible pointer-events-none"
          style={{
            width: "100%",
            height: "100%",
            // left: "-50%",
            // top: "-50%",
          }}
          animate={{
            background: [
              "radial-gradient(circle 400px at 30% 60%, rgba(102, 0, 255, 0.15) 0%, transparent 60%)",
              "radial-gradient(circle 400px at 70% 40%, rgba(0, 212, 255, 0.15) 0%, transparent 60%)",
              "radial-gradient(circle 400px at 50% 30%, rgba(255, 51, 102, 0.1) 0%, transparent 60%)",
              "radial-gradient(circle 400px at 30% 60%, rgba(102, 0, 255, 0.15) 0%, transparent 60%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h2
            className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
            style={{
              y: discoveryY,
              scale: discoveryScale,
            }}
          >
            Discover the Unknown
          </motion.h2>

          <motion.p
            className="text-2xl text-gray-300 mb-12"
            style={{
              y: useTransform(discoveryProgress, [0, 1], ["100px", "-100px"]),
            }}
          >
            Join the next generation of cosmic explorers. Let Zeto guide you
            through the mysteries of distant worlds.
          </motion.p>

          {/* Orbital visualization with planets */}
          {/* <motion.div
            className="relative w-96 h-96 mx-auto mb-12"
            style={{
              rotate: useTransform(discoveryProgress, [0, 1], [0, 720]),
            }}
          >
            {planets.slice(0, 5).map((planet, index) => {
              const orbitRadius = 50 + index * 30;
              const angle = index * 72 * (Math.PI / 180); // 72 degrees apart
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;

              return (
                <motion.div
                  key={planet.name}
                  className="absolute rounded-full"
                  style={{
                    width: planet.size,
                    height: planet.size,
                    backgroundColor: planet.color,
                    left: "50%",
                    top: "50%",
                    marginLeft: x,
                    marginTop: y,
                    boxShadow: `0 0 15px ${planet.color}`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      `0 0 15px ${planet.color}`,
                      `0 0 25px ${planet.color}`,
                      `0 0 15px ${planet.color}`,
                    ],
                  }}
                  transition={{
                    duration: 2 + index * 0.3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />
              );
            })}
          </motion.div> */}
        </div>

        {/* Floating planetary debris */}
        {planets.map((planet, index) => (
          <motion.div
            key={`debris-${index}`}
            className="absolute w-3 h-3 rounded-full opacity-40"
            style={{
              backgroundColor: planet.color,
              left: `${10 + index * 10}%`,
              top: `${20 + index * 8}%`,
            }}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -80, 60, 0],
              rotate: [0, 360, 720, 1080],
              scale: [1, 1.5, 0.8, 1],
            }}
            transition={{
              duration: 15 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 1.5,
            }}
          />
        ))}
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        ref={finalRef}
        className="h-screen flex items-center justify-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="text-center z-10 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.h2
            className="text-7xl mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Begin Your Journey
          </motion.h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Launch Zeto's AI detection system and embark on humanity's greatest
            adventure
          </p>

          <motion.button
            className="group relative px-16 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-2xl font-semibold text-white overflow-hidden"
            onClick={() => navigate("/detection")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-4">
              <Rocket className="w-8 h-8" />
              Launch Zeto System
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </span>
          </motion.button>
        </motion.div>

        {/* Final animated solar system */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {planets.map((planet, index) => {
            const orbitRadius = 100 + index * 40;
            return (
              <motion.div
                key={`final-${planet.name}`}
                className="absolute"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 60 / planet.speed,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full opacity-30"
                  style={{
                    backgroundColor: planet.color,
                    marginLeft: orbitRadius,
                    boxShadow: `0 0 10px ${planet.color}`,
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>
    </div>
  );
}

export default HomePage;
