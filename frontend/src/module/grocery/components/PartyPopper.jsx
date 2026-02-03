import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PartyPopper({ show, onComplete }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (show) {
      const newPieces = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
        size: Math.random() * 10 + 5,
        delay: Math.random() * 0.5,
      }));
      setPieces(newPieces);
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ top: '-10%', left: `${piece.x}%`, rotate: 0 }}
              animate={{ 
                top: '110%', 
                rotate: piece.rotation + 360,
                left: `${piece.x + (Math.random() * 20 - 10)}%`
              }}
              transition={{ 
                duration: 2 + Math.random() * 2, 
                delay: piece.delay,
                ease: "linear"
              }}
              style={{
                position: 'absolute',
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
