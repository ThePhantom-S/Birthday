import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import birthday1 from "@/assets/one.jpg";
import birthday2 from "@/assets/two.jpg";
import birthday3 from "@/assets/three.jpg";
import birthday4 from "@/assets/four.jpg";
import birthday5 from "@/assets/five.jpg";
import birthday6 from "@/assets/six.jpg";
import birthday7 from "@/assets/seven.jpg";
import birthday8 from "@/assets/eight.jpg";
import video1 from "@/assets/vid_1.mp4";
import video2 from "@/assets/vid_2.mp4";
import video3 from "@/assets/vid_3.mp4";
import video4 from "@/assets/vid_4.mp4";

interface MediaItem {
  id: number;
  type: "photo" | "video";
  src: string;
  layer: number;
  gridPosition: { row: number; col: number };
  rotation: number;
  scale: number;
  delay: number;
}

const photos = [birthday1, birthday2, birthday3, birthday4, birthday5, birthday6, birthday7, birthday8];
const videos = [video1, video2, video3, video4];

const allMedia = [
  ...photos.map(src => ({ src, type: "photo" as const })),
  ...videos.map(src => ({ src, type: "video" as const })),
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const generateMediaItem = (
  index: number,
  media: typeof allMedia,
  delay: number = 0
): MediaItem => {
  const cols = window.innerWidth < 480 ? 2 : window.innerWidth < 768 ? 3 : 4;
  const row = Math.floor(index / cols);
  const col = index % cols;

  const layer = Math.floor(Math.random() * 3);
  const mediaData = media[index % media.length];

  return {
    id: Date.now() + Math.random() + index,
    type: mediaData.type,
    src: mediaData.src,
    layer,
    gridPosition: { row, col },
    rotation: Math.random() * 10 - 5,
    scale: 0.92 + Math.random() * 0.16,
    delay,
  };
};

export const FlyingMedia = ({ isActive }: { isActive: boolean }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isSettled, setIsSettled] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 🔹 Shuffle only once
  const shuffledMedia = useMemo(() => shuffleArray(allMedia), [isActive]);

  useEffect(() => {
    if (!isActive) {
      setMediaItems([]);
      setIsSettled(false);
      return;
    }

    const items = shuffledMedia.map((_, i) =>
      generateMediaItem(i, shuffledMedia, i * 0.06)
    );

    const staggerDelay = 70;
    items.forEach((item, i) => {
      setTimeout(() => {
        setMediaItems(prev => [...prev, item]);
      }, i * staggerDelay);
    });

    setTimeout(() => setIsSettled(true), items.length * staggerDelay + 4500);

    return () => {
      setMediaItems([]);
      setIsSettled(false);
    };
  }, [isActive, shuffledMedia]);

  const handleMediaClick = useCallback(
    (index: number) => {
      if (isSettled) setFocusedIndex(index);
    },
    [isSettled]
  );

  const handleClose = useCallback(() => setFocusedIndex(null), []);

  const handlePrevious = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setFocusedIndex(prev =>
        prev === null ? null : (prev - 1 + mediaItems.length) % mediaItems.length
      );
    },
    [mediaItems.length]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setFocusedIndex(prev =>
        prev === null ? null : (prev + 1) % mediaItems.length
      );
    },
    [mediaItems.length]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (focusedIndex === null) return;
      if (e.key === "ArrowLeft") {
        setFocusedIndex(
          (focusedIndex - 1 + mediaItems.length) % mediaItems.length
        );
      } else if (e.key === "ArrowRight") {
        setFocusedIndex((focusedIndex + 1) % mediaItems.length);
      } else if (e.key === "Escape") {
        setFocusedIndex(null);
      }
    },
    [focusedIndex, mediaItems.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isActive) return null;

  // 🔹 Dynamic sizes for different screen widths
  const screenWidth = window.innerWidth;
  const cols = screenWidth < 480 ? 2 : screenWidth < 768 ? 3 : 4;
  const gap = screenWidth < 480 ? 10 : 16;
  const containerPadding = screenWidth < 480 ? 10 : 30;
  const cellSize = screenWidth < 480 ? 120 : screenWidth < 768 ? 160 : 200;

  return (
    <>
      {/* 🧭 Lightbox */}
      <AnimatePresence>
        {focusedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl cursor-pointer"
              onClick={handleClose}
            />

            {/* Navigation */}
            <motion.button
              onClick={handlePrevious}
              className="absolute left-4 md:left-8 z-[110] w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20"
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-7 h-7 md:w-9 md:h-9" />
            </motion.button>

            <motion.button
              onClick={handleNext}
              className="absolute right-4 md:right-8 z-[110] w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20"
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-7 h-7 md:w-9 md:h-9" />
            </motion.button>

            {/* Close */}
            <motion.button
              onClick={handleClose}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-7 h-7 md:w-9 md:h-9" />
            </motion.button>

            {/* Counter */}
            <motion.div className="absolute top-4 left-4 md:top-8 md:left-8 z-[110] px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm md:text-base">
              {focusedIndex + 1} / {mediaItems.length}
            </motion.div>

            {/* Focused Media */}
            <motion.div
              key={focusedIndex}
              className="relative z-[105] max-w-[90vw] max-h-[80vh]"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 bg-white/5">
                {mediaItems[focusedIndex].type === "photo" ? (
                  <img
                    src={mediaItems[focusedIndex].src}
                    alt={`Memory ${focusedIndex + 1}`}
                    className="max-w-full max-h-[80vh] object-contain"
                    draggable={false}
                  />
                ) : (
                  <video
                    src={mediaItems[focusedIndex].src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Grid */}
<div className="fixed inset-0 z-[20] pointer-events-none flex items-center justify-center">
  <div
    className="relative overflow-y-auto pointer-events-auto scroll-smooth"
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      gap: `${gap}px`,
      padding: `${containerPadding}px`,
      justifyContent: "center",
      alignContent: "start",
      maxHeight: "100vh",
      scrollBehavior: "smooth",
    }}
  >
    {mediaItems.map((item, index) => {
      const isHovered = hoveredIndex === index;

      return (
        <motion.div
          key={item.id}
          className="cursor-pointer group relative"
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            zIndex: isHovered ? 30 : 20,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: item.scale,
            opacity: 1,
            rotate: item.rotation,
          }}
          transition={{
            duration: 1,
            delay: item.delay,
            ease: [0.4, 0, 0.2, 1],
          }}
          whileHover={{
            scale: item.scale * 1.12,
            rotate: item.rotation + 3,
            y: -8,
            transition: { duration: 0.25 },
          }}
          whileTap={{ scale: item.scale * 1.05 }}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
          onClick={() => handleMediaClick(index)}
        >
          <div className="w-full h-full rounded-xl border-4 border-white shadow-xl overflow-hidden relative bg-white">
            {item.type === "photo" ? (
              <img
                src={item.src}
                alt={`Memory ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
                loading="lazy"
              />
            ) : (
              <video
                src={item.src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}

            {isSettled && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-2 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-1 text-white text-[10px] md:text-xs font-semibold bg-black/40 px-2 py-1 rounded-full">
                  <ZoomIn className="w-3 h-3" />
                  <span>Tap to view</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      );
    })}
  </div>
</div>
    </>
  );
};
