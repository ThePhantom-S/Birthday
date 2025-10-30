import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  duration: number;
  delay: number;
}

const starEmojis = ["⭐", "🌟", "✨", "💫", "⚡"];

export const Stars = ({ isActive }: { isActive: boolean }) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (!isActive) {
      setStars([]);
      return;
    }

    const interval = setInterval(() => {
      const newStar: Star = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: starEmojis[Math.floor(Math.random() * starEmojis.length)],
        size: Math.random() * 1.5 + 0.8,
        duration: Math.random() * 1.5 + 1.5,
        delay: Math.random() * 0.2,
      };

      setStars((prev) => [...prev, newStar]);

      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== newStar.id));
      }, (newStar.duration + newStar.delay) * 1000);
    }, 600);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute will-change-transform"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            fontSize: `${star.size}rem`,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ 
            opacity: [0, 1, 1, 0.8, 0], 
            scale: [0, 1.2, 1, 1.1, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            ease: [0.34, 1.56, 0.64, 1],
            times: [0, 0.2, 0.5, 0.8, 1],
          }}
        >
          {star.emoji}
        </motion.div>
      ))}
    </div>
  );
};