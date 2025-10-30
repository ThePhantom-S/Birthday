import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Volume2, VolumeX, Sparkles } from "lucide-react";
import { Stars } from "@/components/Stars";
import { FloatingEmojis } from "@/components/FloatingEmojis";
import { Confetti } from "@/components/Confetti";
import { Balloons } from "@/components/Balloons";
import { FlyingMedia } from "@/components/FlyingMedia";
import Music from "@/assets/birthday.mp3";

const Index = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isStarted) {
      const timer = setTimeout(() => {
        setShowMessage(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isStarted]);

  const handleStart = () => {
    setIsStarted(true);
    // Try to play audio safely (for mobile)
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      audio.play().catch(() => {
        console.log("Autoplay blocked — waiting for user interaction");
      });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(!audio.muted);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center">
      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        src={Music}
      />

      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-300 via-rose-200 to-yellow-100 animate-gradient -z-10" />
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-white/20 to-white/40 -z-10" />

      {/* Celebration effects */}
      <Stars isActive={isStarted} />
      <Confetti isActive={isStarted} />
      <FloatingEmojis isActive={isStarted} />
      <Balloons isActive={isStarted} />
      <FlyingMedia isActive={isStarted} />

      {/* Start Screen */}
      <AnimatePresence>
        {!isStarted && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 text-center"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="space-y-8 w-full max-w-3xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="space-y-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold gradient-text animate-glow-pulse leading-tight">
                  Happy Birthday Kavin 🎉
                </h1>
                <motion.div
                  className="flex items-center justify-center gap-2 sm:gap-3 text-xl sm:text-2xl md:text-3xl"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-foreground/80 font-semibold">
                    Tap to celebrate!
                  </span>
                  <Sparkles className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
                </motion.div>
              </motion.div>

              <motion.button
                onClick={handleStart}
                className="group relative px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold text-white rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-yellow-400 to-orange-300 animate-gradient" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                  Let’s Celebrate!
                </span>
              </motion.button>

              <motion.div
                className="flex justify-center gap-4 sm:gap-6 text-3xl sm:text-5xl mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {["🎈", "🎂", "🎁", "🎊"].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      y: [-10, 10, -10],
                      rotate: [-5, 5, -5],
                    }}
                    transition={{
                      duration: 2 + i * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1,
                    }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Birthday message */}
      <AnimatePresence>
        {isStarted && showMessage && (
          <motion.div
            className="fixed inset-x-0 top-4 sm:top-10 z-30 flex justify-center px-3 sm:px-6"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              className="text-center px-4 sm:px-6 py-3 sm:py-4 rounded-2xl glass-strong shadow-2xl w-full max-w-md sm:max-w-3xl mx-auto"
            >
              <motion.h2
                className="text-lg xs:text-xl sm:text-3xl md:text-5xl font-bold gradient-text mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              >
                🎉 Wishing You the Best Day Ever! 🎂
              </motion.h2>
              <p className="text-sm sm:text-lg md:text-xl text-foreground/80 font-medium">
                May your day be filled with joy, laughter, and magic moments! ✨
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Mute / Unmute button */}
      {isStarted && (
        <motion.button
          onClick={toggleMute}
          className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-30 w-12 sm:w-14 h-12 sm:h-14 rounded-full glass-strong shadow-xl flex items-center justify-center text-foreground hover:scale-110 transition-transform"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </motion.button>
      )}
    </div>
  );
};

export default Index;
