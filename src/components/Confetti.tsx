import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  shape: "rect" | "circle" | "star" | "heart";
  rotation: number;
  size: number;
  xDrift: number;
}

const colors = [
  "#E6E6FA", // lavender
  "#FFD1DC", // rose-gold
  "#F0E68C", // champagne
  "#87CEEB", // sky-blue
  "#FFDAB9", // peach
  "#FFD700", // gold
  "#C0C0C0", // silver
  "#FF69B4", // pink
  "#FFFFFF", // white
];

const shapes = ["rect", "circle", "star", "heart"] as const;

export const Confetti = ({ isActive }: { isActive: boolean }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!isActive) {
      setPieces([]);
      return;
    }

    const interval = setInterval(() => {
      const burstCount = Math.floor(Math.random() * 25) + 35;
      const newPieces: ConfettiPiece[] = Array.from({ length: burstCount }, (_, i) => ({
        id: Date.now() + Math.random() + i,
        x: Math.random() * 100,
        y: Math.random() * 20 - 15,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
        size: Math.random() * 10 + 5,
        xDrift: Math.random() * 40 - 20,
      }));

      setPieces((prev) => [...prev, ...newPieces]);

      setTimeout(() => {
        setPieces((prev) => prev.filter((p) => !newPieces.find((np) => np.id === p.id)));
      }, 7000);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const renderShape = (piece: ConfettiPiece) => {
    const style = { 
      width: piece.size, 
      height: piece.size,
      backgroundColor: piece.color,
    };
    
    if (piece.shape === "circle") {
      return <div className="rounded-full" style={style} />;
    }
    if (piece.shape === "star") {
      return <span style={{ fontSize: piece.size, color: piece.color }}>⭐</span>;
    }
    if (piece.shape === "heart") {
      return <span style={{ fontSize: piece.size, color: piece.color }}>💖</span>;
    }
    return <div className="rounded-sm" style={{ ...style, height: piece.size * 1.6 }} />;
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute will-change-transform"
          initial={{ 
            x: `${piece.x}vw`, 
            y: `${piece.y}vh`, 
            rotate: piece.rotation, 
            opacity: 1,
            scale: 1,
          }}
          animate={{
            y: "110vh",
            rotate: piece.rotation + (Math.random() > 0.5 ? 720 : -720),
            x: `${piece.x + piece.xDrift}vw`,
            opacity: [1, 1, 1, 0.7, 0],
            scale: [1, 1, 1, 0.8, 0.5],
          }}
          transition={{
            duration: Math.random() * 2 + 5,
            ease: [0.25, 0.46, 0.45, 0.94],
            times: [0, 0.3, 0.6, 0.85, 1],
          }}
        >
          {renderShape(piece)}
        </motion.div>
      ))}
    </div>
  );
};