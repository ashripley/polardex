import { useEffect, useRef, useState, type ReactNode } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Lightweight anchored popover. We rolled our own instead of pulling in
 * @radix-ui/react-popover because the surface area we need is small:
 *   - open/close on trigger click
 *   - close on click-outside
 *   - close on Escape
 *   - simple anchored positioning (below the trigger, right-aligned by default)
 *   - motion-driven enter/exit animation
 *
 * If we ever need focus-trapping, ARIA roving, or sub-popovers, swap this for
 * Radix and delete the file.
 */

interface PopoverProps {
  trigger: (props: { onClick: () => void; isOpen: boolean }) => ReactNode;
  children: ReactNode;
  /** 'left' aligns the popover to the trigger's left edge; 'right' to its right edge. */
  align?: 'left' | 'right';
  /** Called when the popover closes via outside-click or Escape. */
  onClose?: () => void;
  /** Optional max-width for the popover surface. */
  maxWidth?: string;
}

const Anchor = styled.div`
  position: relative;
  display: inline-block;
`;

// Backdrop only renders on mobile, where the popover becomes a bottom sheet.
// On desktop the popover is anchored to the trigger and doesn't need a scrim.
const MobileBackdrop = styled(motion.div)`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: ${({ theme }) => theme.zIndex.modal};
  }
`;

const Surface = styled(motion.div)<{ $align: 'left' | 'right'; $maxWidth?: string }>`
  /* Desktop: anchored absolutely to the trigger */
  position: absolute;
  top: calc(100% + 8px);
  ${({ $align }) => ($align === 'right' ? 'right: 0;' : 'left: 0;')}
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  min-width: 14rem;
  max-width: ${({ $maxWidth }) => $maxWidth ?? '20rem'};
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.surface.base};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};

  /* Mobile: full-width bottom sheet pinned to the bottom of the viewport,
     respecting the safe area inset and the bottom nav bar height (4rem). */
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    position: fixed;
    top: auto;
    left: ${({ theme }) => theme.space[3]};
    right: ${({ theme }) => theme.space[3]};
    bottom: calc(4.5rem + env(safe-area-inset-bottom, 0px));
    max-width: none;
    min-width: 0;
    padding: ${({ theme }) => theme.space[4]};
    border-radius: ${({ theme }) => theme.radius.xl};
    z-index: calc(${({ theme }) => theme.zIndex.modal} + 1);
    box-shadow:
      0 -8px 32px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.06);
  }
`;

const SheetHandle = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    display: block;
    width: 2.25rem;
    height: 4px;
    background: ${({ theme }) => theme.color.surface.muted};
    border-radius: 2px;
    margin: 0 auto ${({ theme }) => theme.space[2]};
    flex-shrink: 0;
  }
`;

export function Popover({ trigger, children, align = 'right', onClose, maxWidth }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Close on click outside. We have to thread a needle here: the popover may
  // contain nested Radix Selects, and Radix Select uses a portal so its open
  // listbox is OUTSIDE our anchor in the DOM. We need to NOT dismiss when:
  //   1. The user clicks inside our anchor (trivially)
  //   2. The user clicks inside any open Radix portal content
  //   3. The user clicks the trigger of a currently-open Radix Select to toggle
  //      it closed — at this exact moment Radix is mid-dismiss and the DOM is
  //      transitioning, so we defer entirely to whatever Radix is doing.
  useEffect(() => {
    if (!isOpen) return;
    function handlePointer(e: PointerEvent) {
      if (!anchorRef.current) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // (3) If any Radix Select listbox is currently open in the document, the
      //     user is interacting with it — let Radix handle this click and stay
      //     out of the way. The next click after the Select closes will hit
      //     the normal outside-click logic.
      if (document.querySelector('[data-radix-select-content][data-state="open"]')) return;

      // (1) Clicks inside our own anchor (trigger + surface)
      if (anchorRef.current.contains(target)) return;

      // (2) Clicks inside any portaled Radix content
      const radixEscape = [
        '[data-radix-popper-content-wrapper]',  // Radix Popover/Tooltip
        '[data-radix-select-content]',          // Radix Select content
        '[data-radix-select-viewport]',         // Radix Select viewport
        '[data-radix-dropdown-menu-content]',   // Radix DropdownMenu
        '[data-radix-menu-content]',            // Radix Menu (generic)
        '[role="listbox"]',                     // generic listbox role
        '[role="menu"]',                        // generic menu role
      ].join(',');
      if (target.closest(radixEscape)) return;

      setIsOpen(false);
      onClose?.();
    }
    document.addEventListener('pointerdown', handlePointer);
    return () => document.removeEventListener('pointerdown', handlePointer);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        onClose?.();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const close = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Anchor ref={anchorRef}>
      {trigger({ onClick: () => setIsOpen((o) => !o), isOpen })}
      <AnimatePresence>
        {isOpen && (
          <>
            <MobileBackdrop
              key='popover-backdrop'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              aria-hidden='true'
            />
            <Surface
              key='popover-surface'
              $align={align}
              $maxWidth={maxWidth}
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              role='dialog'
            >
              <SheetHandle />
              {children}
            </Surface>
          </>
        )}
      </AnimatePresence>
    </Anchor>
  );
}
