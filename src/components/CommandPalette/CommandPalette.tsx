import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  IconSearch,
  IconCards,
  IconPackage,
  IconPencil,
  IconChartBar,
  IconHome,
  IconHeart,
  IconZoomQuestion,
} from '@tabler/icons-react';

/**
 * ⌘K command palette. Modern dashboard staple — unified search + jump-to-page +
 * quick actions. Opens on Cmd/Ctrl+K or via the shortcut hook.
 *
 * Intentionally small scope: just navigates to routes and filters commands by
 * fuzzy substring. No plugin system, no dynamic commands yet. Good foundation
 * if we want to extend it later (add cards, sets, search actions).
 */

// ── Styled ───────────────────────────────────────────────────────────────────

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  z-index: ${({ theme }) => theme.zIndex.overlay};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: ${({ theme }) => `${theme.space[16]} ${theme.space[4]} ${theme.space[4]}`};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    padding-top: ${({ theme }) => theme.space[10]};
  }
`;

const Panel = styled(motion.div)`
  width: 100%;
  max-width: 36rem;
  background: ${({ theme }) => theme.color.surface.base};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => `${theme.space[4]} ${theme.space[5]}`};
  border-bottom: 1px solid ${({ theme }) => theme.color.surface.border};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.color.text.primary};

  &::placeholder { color: ${({ theme }) => theme.color.text.tertiary}; }
`;

const KeyHint = styled.kbd`
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.surface.muted};
  color: ${({ theme }) => theme.color.text.secondary};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
`;

const ResultList = styled.ul`
  list-style: none;
  margin: 0;
  padding: ${({ theme }) => theme.space[2]};
  max-height: 60dvh;
  overflow-y: auto;
`;

const SectionLabel = styled.li`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]} ${theme.space[1]}`};
`;

const ResultItem = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.primary};
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme.color.surface.muted : 'transparent')};
  transition: background 120ms cubic-bezier(0.22, 1, 0.36, 1);

  svg {
    color: ${({ $active, theme }) =>
      $active ? theme.color.frost.blue : theme.color.text.secondary};
    flex-shrink: 0;
  }
`;

const ResultLabel = styled.span`
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ResultHint = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.color.text.tertiary};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const EmptyMessage = styled.li`
  padding: ${({ theme }) => `${theme.space[6]} ${theme.space[4]}`};
  text-align: center;
  color: ${({ theme }) => theme.color.text.tertiary};
  font-size: ${({ theme }) => theme.typography.size.sm};
`;

// ── Command definitions ─────────────────────────────────────────────────────

interface Command {
  id: string;
  label: string;
  section: string;
  icon: ReactNode;
  /** Invoke the command. Receives a navigate helper. */
  run: (navigate: ReturnType<typeof useNavigate>) => void;
  /** Fuzzy matcher keywords */
  keywords?: string[];
}

const commands: Command[] = [
  {
    id: 'go-home',
    label: 'Go to Home',
    section: 'Navigation',
    icon: <IconHome size={16} stroke={2} />,
    run: (nav) => nav('/'),
    keywords: ['home', 'welcome', 'landing'],
  },
  {
    id: 'go-collections',
    label: 'Go to Collection',
    section: 'Navigation',
    icon: <IconCards size={16} stroke={2} />,
    run: (nav) => nav('/collections'),
    keywords: ['collection', 'cards', 'gallery', 'my'],
  },
  {
    id: 'go-sets',
    label: 'Browse Sets',
    section: 'Navigation',
    icon: <IconPackage size={16} stroke={2} />,
    run: (nav) => nav('/sets'),
    keywords: ['sets', 'browse', 'explore', 'pokemon'],
  },
  {
    id: 'go-studio',
    label: 'Open Studio',
    section: 'Navigation',
    icon: <IconPencil size={16} stroke={2} />,
    run: (nav) => nav('/studio'),
    keywords: ['studio', 'edit', 'add', 'modify'],
  },
  {
    id: 'go-overview',
    label: 'View Overview',
    section: 'Navigation',
    icon: <IconChartBar size={16} stroke={2} />,
    run: (nav) => nav('/overview'),
    keywords: ['stats', 'overview', 'analytics', 'dashboard'],
  },
  {
    id: 'price-check',
    label: 'Price Check a Card',
    section: 'Tools',
    icon: <IconZoomQuestion size={16} stroke={2} />,
    // Fire a custom event that App.tsx listens for. Avoids passing callbacks
    // through the palette's static command list.
    run: () => window.dispatchEvent(new CustomEvent('polardex:open-price-check')),
    keywords: ['price', 'check', 'lookup', 'value', 'worth', 'rare candy'],
  },
  {
    id: 'filter-wishlist',
    label: 'Show Wishlist',
    section: 'Filters',
    icon: <IconHeart size={16} stroke={2} />,
    run: (nav) => nav('/collections?status=wishlist'),
    keywords: ['wanted', 'wishlist', 'want'],
  },
  {
    id: 'filter-owned',
    label: 'Show Owned',
    section: 'Filters',
    icon: <IconCards size={16} stroke={2} />,
    run: (nav) => nav('/collections?status=owned'),
    keywords: ['owned', 'have', 'collection'],
  },
];

// ── Component ───────────────────────────────────────────────────────────────

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) => {
      if (c.label.toLowerCase().includes(q)) return true;
      if (c.keywords?.some((k) => k.includes(q))) return true;
      return false;
    });
  }, [query]);

  // Group filtered commands by section, preserving section order
  const grouped = useMemo(() => {
    const sections = new Map<string, Command[]>();
    for (const cmd of filtered) {
      const existing = sections.get(cmd.section) ?? [];
      existing.push(cmd);
      sections.set(cmd.section, existing);
    }
    return sections;
  }, [filtered]);

  // Flatten filtered for keyboard navigation
  const flatList = filtered;

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      // Focus the input after the enter animation so focus-trap plays nice
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, flatList.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = flatList[activeIdx];
        if (cmd) {
          cmd.run(navigate);
          onClose();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, flatList, activeIdx, navigate, onClose]);

  // Clamp active index when filtered list shrinks
  useEffect(() => {
    if (activeIdx >= flatList.length) setActiveIdx(0);
  }, [flatList.length, activeIdx]);

  return (
    <AnimatePresence>
      {open && (
        <Backdrop
          key='cmdk-backdrop'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <Panel
            key='cmdk-panel'
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            role='dialog'
            aria-label='Command palette'
          >
            <SearchRow>
              <IconSearch size={16} stroke={2} />
              <SearchInput
                ref={inputRef}
                placeholder='Jump to a page or run a command...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label='Search commands'
              />
              <KeyHint>ESC</KeyHint>
            </SearchRow>
            <ResultList role='listbox'>
              {flatList.length === 0 && <EmptyMessage>No matches</EmptyMessage>}
              {Array.from(grouped.entries()).map(([section, items]) => (
                <div key={section}>
                  <SectionLabel>{section}</SectionLabel>
                  {items.map((cmd) => {
                    const idx = flatList.indexOf(cmd);
                    const isActive = idx === activeIdx;
                    return (
                      <ResultItem
                        key={cmd.id}
                        $active={isActive}
                        role='option'
                        aria-selected={isActive}
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => {
                          cmd.run(navigate);
                          onClose();
                        }}
                      >
                        {cmd.icon}
                        <ResultLabel>{cmd.label}</ResultLabel>
                        {isActive && <ResultHint>Enter</ResultHint>}
                      </ResultItem>
                    );
                  })}
                </div>
              ))}
            </ResultList>
          </Panel>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
