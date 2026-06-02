import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number; // Percentage width
  y: number; // Starting offset
  size: number; // Pixels
  delay: number; // Seconds
  duration: number; // Seconds
  type: 'circle';
  color: string;
}

export const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = [
      'rgba(229, 192, 123, 0.12)', // soft gold
      'rgba(197, 168, 128, 0.1)',  // muted beige
      'rgba(250, 245, 239, 0.08)', // warm cream
      'rgba(139, 115, 85, 0.08)',  // light brown
    ];

    const generated: Particle[] = Array.from({ length: 20 }).map((_, i) => {
      const size = Math.random() * 24 + 6; // 6px to 30px circles
      
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 20 + 100, // Spawn below viewport
        size,
        delay: Math.random() * 10,
        duration: Math.random() * 25 + 25, // 25s to 50s slow travel time
        type: 'circle',
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute flex items-center justify-center leading-none"
          style={{
            left: `${p.x}%`,
            top: '100%',
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: ['0vh', '-110vh'],
            x: [0, Math.sin(p.id) * 60 - 30], // Slight horizontal drift
            rotate: [0, p.id % 2 === 0 ? 360 : -360],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: p.color,
              borderRadius: '50%',
              filter: p.size > 15 ? 'blur(3px)' : 'blur(1.5px)',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingParticles;
