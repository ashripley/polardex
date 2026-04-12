import { useState, useRef, useEffect, cloneElement, type ReactElement, type ReactNode } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Lightweight tooltip. Wraps an existing interactive element and shows a
 * positioned label on hover/focus after a short delay. No portal — uses
 * absolute positioning relative to an anchor div.
 *
 * Replaces native `title="..."` attributes which are slow, ugly, and
 * inconsistent across platforms.
 *
 * Usage:
 *   <Tooltip label='Toggle currency'>
 *     <button>AUD</button>
 *   </Tooltip>
 */

type Side = 'top' | 'bottom';

const Anchor = styled.span`
  position: relative;
  display: inline-flex;
`;

const Bubble = styled(motion.span)<{ $side: Side }>`
  position: absolute;
  ${({ $side }) => ($side === 'top' ? 'bottom: calc(100% + 6px);' : 'top: calc(100% + 6px);')}
  left: 50%;
  transform: translateX(-50%);
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[2]}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.text.primary};
  color: ${({ theme }) => theme.color.surface.base};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
  pointer-events: none;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.01em;
`;

interface TooltipProps {
  label: string;
  children: ReactElement;
  /** 'top' (default) or 'bottom' — where the bubble appears relative to the trigger */
  side?: Side;
  /** Delay in ms before the tooltip opens. Default 500ms. */
  delay?: number;
}

export function Tooltip({ label, children, side = 'top', delay = 500 }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  const show = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setOpen(false);
  };

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  // Clone the child so the trigger element owns hover/focus listeners directly
  // — avoids wrapping it in an extra div that might break its layout.
  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    'aria-label': (children.props as { 'aria-label'?: string })['aria-label'] ?? label,
  });

  return (
    <Anchor>
      {trigger}
      <AnimatePresence>
        {open && (
          <Bubble
            key='tooltip'
            $side={side}
            initial={{ opacity: 0, y: side === 'top' ? 4 : -4, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === 'top' ? 2 : -2, scale: 0.96 }}
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            role='tooltip'
          >
            {label}
          </Bubble>
        )}
      </AnimatePresence>
    </Anchor>
  );
}

export type TooltipLabelNode = ReactNode;
