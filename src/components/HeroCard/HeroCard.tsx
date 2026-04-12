import styled from 'styled-components';
import { motion } from 'motion/react';
import { type ReactNode } from 'react';

/**
 * Shared hero summary card. Used at the top of every data page (Collections,
 * Sets list, Set detail, Studio, Overview) to surface a primary stat with a
 * gradient + radial accent treatment.
 *
 * Pages were repeating ~80 lines of styled-component each — this consolidates
 * them into one parameterized component. Pick an `accent` to swap the gradient
 * + accent color.
 */

export type HeroAccent = 'teal' | 'purple' | 'green' | 'blue' | 'amber';

const accentMap: Record<HeroAccent, { from: string; to: string; glow: string; border: string }> = {
  // Each entry maps to keys on theme.color — resolved at render time below.
  teal:   { from: 'frost.teal',   to: 'frost.blue',   glow: 'frost.teal',   border: 'frost.teal'   },
  purple: { from: 'aurora.purple', to: 'frost.blue',  glow: 'aurora.purple', border: 'frost.blue'  },
  green:  { from: 'aurora.green', to: 'frost.teal',   glow: 'aurora.green', border: 'aurora.green' },
  blue:   { from: 'frost.deep',   to: 'frost.blue',   glow: 'frost.blue',   border: 'frost.blue'   },
  amber:  { from: 'aurora.yellow', to: 'aurora.orange', glow: 'aurora.yellow', border: 'aurora.orange' },
};

// Walks `theme.color.X.Y` for a string path like `frost.teal`.
function pickColor(theme: { color: Record<string, Record<string, string>> }, path: string): string {
  const [namespace, name] = path.split('.');
  return theme.color[namespace]?.[name] ?? '#000';
}

/**
 * The styled motion.div that renders the card surface. Exported so consumers
 * with exotic needs can style/wrap further, but prefer <HeroCard> below.
 *
 * Directly-styled motion.div (not a chained styled(motion(styled-div))) —
 * nesting loses transient $ props through the motion wrapper at runtime.
 */
export const HeroCardSurface = styled(motion.div)<{ $accent?: HeroAccent }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  margin: ${({ theme }) => `${theme.space[3]} 0 ${theme.space[4]}`};
  padding: ${({ theme }) => `${theme.space[5]} ${theme.space[5]} ${theme.space[4]}`};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme, $accent = 'teal' }) => {
    const a = accentMap[$accent];
    return `linear-gradient(135deg, ${pickColor(theme, a.from)}1c 0%, ${pickColor(theme, a.to)}14 100%)`;
  }};
  border: 1.5px solid
    ${({ theme, $accent = 'teal' }) => `${pickColor(theme, accentMap[$accent].border)}40`};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;

  /* Subtle radial accent in the corner — purely decorative */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 50%;
    height: 200%;
    background: ${({ theme, $accent = 'teal' }) =>
      `radial-gradient(circle, ${pickColor(theme, accentMap[$accent].glow)}22 0%, transparent 70%)`};
    pointer-events: none;
  }

  @media (min-width: calc(${({ theme }) => theme.breakpoint.mobile} + 1px)) {
    padding: ${({ theme }) => `${theme.space[6]} ${theme.space[8]}`};
    gap: ${({ theme }) => theme.space[4]};
    margin: ${({ theme }) => `${theme.space[2]} 0 ${theme.space[5]}`};
  }
`;

interface HeroCardProps {
  accent?: HeroAccent;
  children: ReactNode;
  /** When true, skip the motion entry animation (e.g. for nested usage). */
  noAnimation?: boolean;
  className?: string;
}

/**
 * Use this. The pages compose their own content inside it.
 */
export function HeroCard({ accent = 'teal', children, noAnimation, className }: HeroCardProps) {
  if (noAnimation) {
    return (
      <HeroCardSurface $accent={accent} className={className}>
        {children}
      </HeroCardSurface>
    );
  }
  return (
    <HeroCardSurface
      $accent={accent}
      className={className}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.05 }}
    >
      {children}
    </HeroCardSurface>
  );
}

// ── Common subcomponents used inside hero cards ──────────────────────────────

/** Small uppercase eyebrow label, e.g. "TOTAL VALUE" */
export const HeroLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  position: relative;
  z-index: 1;
`;

/** Big tabular-nums hero number */
export const HeroValue = styled.span`
  font-size: 1.75rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  line-height: 1;
  position: relative;
  z-index: 1;

  @media (min-width: calc(${({ theme }) => theme.breakpoint.mobile} + 1px)) {
    font-size: 2.5rem;
  }
`;

/** Horizontal stat row used inside hero cards (Started, Complete, etc.) */
export const HeroStatsRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space[5]};
  position: relative;
  z-index: 1;

  @media (min-width: calc(${({ theme }) => theme.breakpoint.mobile} + 1px)) {
    gap: ${({ theme }) => theme.space[10]};
  }
`;

export const HeroStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HeroStatValue = styled.span`
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: -0.02em;

  @media (min-width: calc(${({ theme }) => theme.breakpoint.mobile} + 1px)) {
    font-size: 2.25rem;
  }
`;

export const HeroStatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

/** Linear progress bar that lives inside hero stats — animated entry */
export const HeroProgressBar = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 6px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surface.muted};
  overflow: hidden;

  @media (min-width: calc(${({ theme }) => theme.breakpoint.mobile} + 1px)) {
    height: 8px;
  }
`;

export const HeroProgressFill = styled(motion.div)`
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg,
    ${({ theme }) => theme.color.frost.teal} 0%,
    ${({ theme }) => theme.color.frost.blue} 100%);
  box-shadow: 0 0 10px ${({ theme }) => `${theme.color.frost.blue}66`};
`;
