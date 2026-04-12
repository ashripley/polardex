import type { Transition, Variants } from 'motion/react';

/**
 * Shared motion presets so every interactive element in the app feels the
 * same. Import these instead of defining one-off scale/spring/transition
 * objects in components — that way "tap" feels consistent everywhere, and we
 * can tune the whole app from a single place.
 *
 * Naming convention:
 *   - tap*       → whileTap targets (subtle press feedback)
 *   - hover*     → whileHover targets (lift, brighten)
 *   - spring*    → reusable spring transition presets
 *   - ease*      → reusable tween transition presets
 */

// ── Tap feedback ─────────────────────────────────────────────────────────────

/** Standard button/pill tap feedback. ~4% scale-down — perceptible without feeling squishy. */
export const tapPress = { scale: 0.96 } as const;

/** Slightly stronger tap for icon buttons (where the visual is smaller). */
export const tapPressFirm = { scale: 0.92 } as const;

/** Subtle tap for cards/large surfaces — enough to register, not jarring. */
export const tapPressSoft = { scale: 0.985 } as const;

// ── Hover affordances ────────────────────────────────────────────────────────

/** Card lift on hover. Pairs nicely with a stronger drop shadow. */
export const hoverLift = { y: -3 } as const;

/** Stronger lift for primary cards in a grid. */
export const hoverLiftLg = { y: -4, scale: 1.015 } as const;

/** Subtle scale for pills and badges. */
export const hoverScale = { scale: 1.04 } as const;

// ── Spring transitions ───────────────────────────────────────────────────────

/** Default spring used for tap/hover feedback. Snappy but not bouncy. */
export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 28,
};

/** Softer spring for larger surfaces (cards, lightboxes). */
export const springSoft: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
};

/** Bouncy spring for delightful, attention-getting moments (success states, etc). */
export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 20,
};

// ── Tween transitions ────────────────────────────────────────────────────────

/** Standard easing curve used everywhere. cubic-bezier(0.22, 1, 0.36, 1) — easeOutQuint. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Sharp ease-in for exit animations. */
export const easeIn = [0.4, 0, 1, 1] as const;

/** Symmetric ease-in-out — gentle on both sides. cubic-bezier(0.65, 0, 0.35, 1). */
export const easeInOut = [0.65, 0, 0.35, 1] as const;

/** Standard stagger delay constants — use these instead of magic numbers. */
export const STAGGER_DELAY = 0.025;
export const STAGGER_CAP = 0.4;

/** Standard fade transition — 220ms with the project easing. */
export const easeFade: Transition = {
  duration: 0.22,
  ease: easeOut,
};

/** Quick fade for small elements (badges, tooltips). */
export const easeFadeFast: Transition = {
  duration: 0.16,
  ease: easeOut,
};

// ── Variant presets ──────────────────────────────────────────────────────────

/** Standard "fade in from below" entry — for staggered list items. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

/** Standard "scale in" — for popovers, badges that pop into existence. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};
