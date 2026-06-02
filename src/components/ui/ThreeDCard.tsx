import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // How intense the 3D rotation is (lower = more rotation)
  glowColor?: string; // Optional glow overlay color
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  children,
  className = '',
  depth = 15,
  glowColor = 'rgba(229, 192, 123, 0.15)',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for X/Y position of the cursor relative to the card dimensions
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);

  // Sheen overlay positions
  const sheenX = useMotionValue(50);
  const sheenY = useMotionValue(50);

  // Smooth springs to avoid jittery movements
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const rotateX = useSpring(rotateXValue, springConfig);
  const rotateY = useSpring(rotateYValue, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    // Mouse coordinates relative to card width and height (normalized from -0.5 to 0.5)
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rX = ((mouseY / height) - 0.5) * -depth; // Tilt forward/backward
    const rY = ((mouseX / width) - 0.5) * depth;   // Tilt left/right

    rotateXValue.set(rX);
    rotateYValue.set(rY);

    // Sheen positions in percentages (0% to 100%)
    sheenX.set((mouseX / width) * 100);
    sheenY.set((mouseY / height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateXValue.set(0);
    rotateYValue.set(0);
  };

  // Convert sheen positions into radial gradient backgrounds
  const sheenStyle = useTransform(
    [sheenX, sheenY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, ${glowColor} 0%, transparent 60%)`
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 w-full"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative w-full rounded-2xl transition-shadow duration-300 ${className} ${
          isHovered ? 'shadow-[0_20px_50px_rgba(28,14,10,0.5)]' : 'shadow-md'
        }`}
      >
        {/* Glamour light reflection sheen */}
        <motion.div
          style={{
            background: sheenStyle,
            transform: 'translateZ(1px)',
          }}
          className="absolute inset-0 rounded-2xl pointer-events-none z-10 opacity-0 transition-opacity duration-300"
          animate={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Content wrapper preserving 3D spacing */}
        <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }} className="h-full w-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
export default ThreeDCard;
