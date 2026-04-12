import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import { IconCheck, IconAlertTriangle, IconInfoCircle, IconX } from '@tabler/icons-react';
import { tapPress } from '../theme/motion';

/**
 * Toast notification system. Wraps the app and exposes `useToast()` for any
 * component that wants to fire a transient notification with optional undo.
 *
 * Used across the app to replace per-page toast implementations:
 *   - Sets/Studio used to define their own `setToastMsg` state + styled wrapper
 *   - Now they call `toast({ message, tone, undo })`
 *
 * Features:
 *   - 4 tones: success, error, info, warning
 *   - Auto-dismiss after 4s (or 6s if `undo` is provided)
 *   - Optional undo button — calls the provided callback
 *   - aria-live='polite' for screen readers
 *   - Stacks multiple toasts vertically
 */

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  message: string;
  tone?: ToastTone;
  /** Custom duration in ms (default 4000, or 6000 with undo) */
  duration?: number;
  /** When provided, an "Undo" button is rendered. Clicking it dismisses the toast and calls this callback. */
  undo?: () => void;
}

interface ToastInstance extends ToastOptions {
  id: number;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

// ── Styled ───────────────────────────────────────────────────────────────────

const Stack = styled.div`
  position: fixed;
  bottom: calc(${({ theme }) => theme.space[6]} + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: ${({ theme }) => theme.zIndex.overlay};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  align-items: center;
  pointer-events: none;
  width: max-content;
  max-width: calc(100vw - ${({ theme }) => theme.space[6]} * 2);

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    /* Sit above the bottom nav on mobile */
    bottom: calc(5rem + env(safe-area-inset-bottom, 0px));
  }
`;

const ToastCard = styled(motion.div)<{ $tone: ToastTone }>`
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[4]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surface.base};
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.18),
    0 0 0 1px ${({ theme }) => theme.color.surface.border};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.primary};
  min-width: 16rem;
  max-width: min(28rem, calc(100vw - 2rem));
`;

const ToneIcon = styled.span<{ $tone: ToastTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  border-radius: 50%;
  color: ${({ theme, $tone }) =>
    $tone === 'success' ? theme.color.aurora.green :
    $tone === 'error'   ? theme.color.aurora.red :
    $tone === 'warning' ? theme.color.aurora.yellow :
                          theme.color.frost.blue};
  background: ${({ theme, $tone }) =>
    $tone === 'success' ? `${theme.color.aurora.green}1a` :
    $tone === 'error'   ? `${theme.color.aurora.red}1a` :
    $tone === 'warning' ? `${theme.color.aurora.yellow}1a` :
                          `${theme.color.frost.blue}1a`};
`;

const Message = styled.span`
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UndoBtn = styled(motion.button)`
  flex-shrink: 0;
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.frost.blue};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[2]}`};
  border-radius: ${({ theme }) => theme.radius.md};

  &:hover { background: ${({ theme }) => `${theme.color.frost.blue}14`}; }
`;

const DismissBtn = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.text.tertiary};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
  border-radius: 50%;

  &:hover { color: ${({ theme }) => theme.color.text.secondary}; }
`;

function iconForTone(tone: ToastTone) {
  if (tone === 'success') return <IconCheck size={14} stroke={2.5} />;
  if (tone === 'error') return <IconAlertTriangle size={14} stroke={2.5} />;
  if (tone === 'warning') return <IconAlertTriangle size={14} stroke={2.5} />;
  return <IconInfoCircle size={14} stroke={2.5} />;
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  const idRef = useRef(0);
  const timersRef = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = ++idRef.current;
      const tone = options.tone ?? 'info';
      const duration = options.duration ?? (options.undo ? 6000 : 4000);
      const instance: ToastInstance = { ...options, id, tone };
      setToasts((list) => [...list, instance]);
      const timer = window.setTimeout(() => dismiss(id), duration);
      timersRef.current.set(id, timer);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Stack aria-live='polite' aria-atomic='false'>
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastCard
              key={t.id}
              $tone={t.tone}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              role='status'
            >
              <ToneIcon $tone={t.tone}>{iconForTone(t.tone)}</ToneIcon>
              <Message>{t.message}</Message>
              {t.undo && (
                <UndoBtn
                  onClick={() => {
                    t.undo?.();
                    dismiss(t.id);
                  }}
                  whileTap={tapPress}
                >
                  Undo
                </UndoBtn>
              )}
              <DismissBtn onClick={() => dismiss(t.id)} aria-label='Dismiss notification'>
                <IconX size={12} stroke={2.5} />
              </DismissBtn>
            </ToastCard>
          ))}
        </AnimatePresence>
      </Stack>
    </ToastContext.Provider>
  );
}
