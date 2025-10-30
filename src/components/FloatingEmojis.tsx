import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Emoji {
  id: number;
  x: number;
  emoji: string;
  drift: number;
  rotation: number;
  scale: number;
  wobble: number;
}

const emojis = ["🎂", "🎁", "💖", "🎊", "🎉", "🥳", "🎈", "🌟"];

export const FloatingEmojis = ({ isActive }: { isActive: boolean }) => {
  const [floatingEmojis, setFloatingEmojis] = useState<Emoji[]>([]);

  useEffect(() => {
    if (!isActive) {
      setFloatingEmojis([]);
      return;
    }

    const interval = setInterval(() => {
      const newEmoji: Emoji = {
        id: Date.now() + Math.random(),
        x: Math.random() * 90 + 5,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        drift: Math.random() * 100 - 50,
        rotation: Math.random() * 720 - 360,
        scale: Math.random() * 0.6 + 0.7,
        wobble: Math.random() * 30 + 15,
      };

      setFloatingEmojis((prev) => [...prev, newEmoji]);

      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
      }, 12000);
    }, 1200);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {floatingEmojis.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-3xl md:text-4xl will-change-transform"
          initial={{ 
            x: `${item.x}vw`, 
            y: "110vh", 
            rotate: 0, 
            scale: item.scale,
            opacity: 0,
          }}
          animate={{
            y: "-20vh",
            x: [
              `${item.x}vw`,
              `${item.x + item.drift * 0.3}vw`,
              `${item.x + item.drift * 0.7}vw`,
              `${item.x + item.drift}vw`,
            ],
            rotate: [0, item.rotation * 0.5, item.rotation],
            opacity: [0, 1, 1, 0.8, 0],
          }}
          transition={{
            duration: 10,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.1, 0.5, 0.8, 1],
            x: {
              duration: 10,
              ease: "easeInOut",
            },
          }}
        >
          <motion.span
            animate={{
              rotate: [-item.wobble, item.wobble, -item.wobble],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.emoji}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};