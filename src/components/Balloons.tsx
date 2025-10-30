import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Balloon {
  id: number;
  x: number;
  color: string;
  delay: number;
  swayAmount: number;
  size: number;
  bobSpeed: number;
}

const balloonColors = ["🎈", "🎈", "🎈", "🎈", "🎈", "🎈"];

export const Balloons = ({ isActive }: { isActive: boolean }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    if (!isActive) {
      setBalloons([]);
      return;
    }

    const interval = setInterval(() => {
      const newBalloon: Balloon = {
        id: Date.now() + Math.random(),
        x: Math.random() * 85 + 7.5,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        delay: 0,
        swayAmount: Math.random() * 70 - 35,
        size: Math.random() * 0.4 + 0.9,
        bobSpeed: Math.random() * 1 + 2,
      };

      setBalloons((prev) => [...prev, newBalloon]);

      setTimeout(() => {
        setBalloons((prev) => prev.filter((b) => b.id !== newBalloon.id));
      }, 18000);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {balloons.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute will-change-transform"
          style={{
            fontSize: `${balloon.size * 4}rem`,
          }}
          initial={{ 
            x: `${balloon.x}vw`, 
            y: "110vh",
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            y: "-25vh",
            x: [
              `${balloon.x}vw`,
              `${balloon.x + balloon.swayAmount * 0.2}vw`,
              `${balloon.x + balloon.swayAmount * 0.6}vw`,
              `${balloon.x + balloon.swayAmount}vw`,
              `${balloon.x + balloon.swayAmount * 0.7}vw`,
            ],
            opacity: [0, 1, 1, 1, 0.8, 0],
            scale: [0.5, 1, 1, 1, 0.9, 0.7],
          }}
          transition={{
            duration: 15,
            ease: "linear",
            times: [0, 0.1, 0.4, 0.7, 0.9, 1],
            x: {
              duration: 15,
              ease: "easeInOut",
            },
          }}
        >
          <motion.span
            animate={{
              y: [-5, 5, -5],
              rotate: [-3, 3, -3],
            }}
            transition={{
              duration: balloon.bobSpeed,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {balloon.color}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};