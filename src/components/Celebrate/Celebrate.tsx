import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Minimal in-house confetti. No external dep — just a burst of motion.divs
 * spawning from screen center, each animating to a random angle+distance
 * with rotation and fade-out. Component self-cleans after the duration.
 *
 * Usage:
 *   const [celebrate, setCelebrate] = useState(false);
 *   // fire: setCelebrate(true)
 *   // render: <Celebrate active={celebrate} onDone={() => setCelebrate(false)} />
 */

const PIECE_COUNT = 48;
const DURATION_MS = 2400;

const COLORS = [
  '#a3be8c', // aurora green
  '#ebcb8b', // aurora yellow
  '#d08770', // aurora orange
  '#bf616a', // aurora red
  '#b48ead', // aurora purple
  '#88c0d0', // frost sky
  '#8fbcbb', // frost teal
  '#81a1c1', // frost blue
];

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: ${({ theme }) => theme.zIndex.overlay + 1};
  overflow: hidden;
`;

const Piece = styled(motion.div)<{ $color: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 14px;
  background: ${({ $color }) => $color};
  border-radius: 2px;
  will-change: transform, opacity;
`;

interface Particle {
  id: number;
  color: string;
  angle: number;    // radians
  distance: number; // pixels
  rotate: number;   // degrees
  delay: number;    // seconds
  scale: number;
}

function makeParticles(): Particle[] {
  return Array.from({ length: PIECE_COUNT }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    angle: Math.random() * Math.PI * 2,
    distance: 180 + Math.random() * 280,
    rotate: (Math.random() - 0.5) * 720,
    delay: Math.random() * 0.12,
    scale: 0.6 + Math.random() * 0.9,
  }));
}

interface CelebrateProps {
  active: boolean;
  onDone?: () => void;
}

export function Celebrate({ active, onDone }: CelebrateProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    setParticles(makeParticles());
    const t = window.setTimeout(() => {
      onDone?.();
    }, DURATION_MS);
    return () => window.clearTimeout(t);
  }, [active, onDone]);

  // Respect prefers-reduced-motion — no confetti storm for users who opted out
  const prefersReduced = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }, []);

  if (prefersReduced) return null;

  return (
    <AnimatePresence>
      {active && (
        <Overlay aria-hidden='true'>
          {particles.map((p) => {
            const x = Math.cos(p.angle) * p.distance;
            const y = Math.sin(p.angle) * p.distance - 80;
            const yFinal = y + 500;
            return (
              <Piece
                key={p.id}
                $color={p.color}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: p.scale }}
                animate={{
                  x,
                  y: [0, y, yFinal],
                  opacity: [1, 1, 0],
                  rotate: p.rotate,
                }}
                transition={{
                  duration: DURATION_MS / 1000,
                  delay: p.delay,
                  ease: [0.2, 0.6, 0.3, 1],
                  times: [0, 0.35, 1],
                }}
              />
            );
          })}
        </Overlay>
      )}
    </AnimatePresence>
  );
}
