import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import { IconSearch, IconX, IconZoomQuestion } from '@tabler/icons-react';
import { tapPress, easeOut } from '../../theme/motion';
import { fmtPrice, useCurrency, type Currency } from '../../hooks/useCurrency';
import { useAudRate } from '../../hooks/useAudRate';
import { EmptyState } from '../EmptyState';

/**
 * Price check tool — standalone card lookup ("Rare Candy"). Open as a modal,
 * type a Pokémon name, see live prices from the TCG API. Doesn't interact
 * with the user's collection at all; pure lookup.
 *
 * Backed by a direct call to api.pokemontcg.io — no caching layer because
 * the result set varies by every keystroke. Debounced at 350ms to avoid
 * thrashing the API on each character.
 */

const BASE = 'https://api.pokemontcg.io/v2';
const DEBOUNCE_MS = 350;
const MAX_RESULTS = 24;
const EUR_TO_USD = 1.08;

interface TcgSearchCard {
  id: string;
  name: string;
  number: string;
  rarity?: string;
  images: { small: string; large: string };
  set: { id: string; name: string; releaseDate?: string; images?: { symbol?: string; logo?: string } };
  tcgplayer?: {
    prices?: Record<string, { market?: number | null } | undefined>;
  };
  cardmarket?: {
    prices?: {
      averageSellPrice?: number | null;
      trendPrice?: number | null;
    };
  };
}

function bestPriceUsd(card: TcgSearchCard): number | null {
  const tp = card.tcgplayer?.prices;
  if (tp) {
    const usd =
      tp['normal']?.market ??
      tp['holofoil']?.market ??
      tp['reverseHolofoil']?.market ??
      tp['1stEditionHolofoil']?.market ??
      tp['1stEditionNormal']?.market ??
      null;
    if (usd != null && usd > 0) return usd;
  }
  const cm = card.cardmarket?.prices;
  if (cm) {
    const eur = cm.averageSellPrice ?? cm.trendPrice ?? null;
    if (eur != null && eur > 0) return eur * EUR_TO_USD;
  }
  return null;
}

// ── Styled ───────────────────────────────────────────────────────────────────

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  z-index: ${({ theme }) => theme.zIndex.overlay};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: ${({ theme }) => `${theme.space[10]} ${theme.space[4]} ${theme.space[4]}`};
  overflow-y: auto;
`;

const Panel = styled(motion.div)`
  width: 100%;
  max-width: 48rem;
  background: ${({ theme }) => theme.color.surface.base};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: calc(100dvh - ${({ theme }) => theme.space[12]});
`;

const Header = styled.div`
  padding: ${({ theme }) => `${theme.space[5]} ${theme.space[6]} ${theme.space[4]}`};
  border-bottom: 1px solid ${({ theme }) => theme.color.surface.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  background: linear-gradient(135deg,
    ${({ theme }) => `${theme.color.aurora.purple}0a`} 0%,
    ${({ theme }) => `${theme.color.frost.blue}0a`} 100%);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const CloseBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surface.subtle};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  color: ${({ theme }) => theme.color.text.secondary};
  cursor: pointer;
  flex-shrink: 0;
  &:hover { color: ${({ theme }) => theme.color.aurora.red}; }
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIconWrap = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.text.secondary};
  display: flex;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 2.75rem;
  padding: 0 ${({ theme }) => theme.space[8]};
  box-sizing: border-box;
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surface.subtle};
  box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.surface.border};
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  outline: none;
  transition: box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1);

  &::placeholder { color: ${({ theme }) => theme.color.text.secondary}; }
  &:focus { box-shadow: 0 0 0 2px ${({ theme }) => theme.color.frost.blue}; }
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space[4]};
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: ${({ theme }) => theme.space[3]};
`;

const ResultCard = styled(motion.button)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface.subtle};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: border-color 180ms cubic-bezier(0.22, 1, 0.36, 1), transform 180ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    border-color: ${({ theme }) => theme.color.frost.blue};
    transform: translateY(-2px);
  }
`;

const ResultImg = styled.img`
  width: 100%;
  aspect-ratio: 2.5 / 3.5;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.sm};
`;

const ResultName = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
`;

const ResultSet = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.color.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ResultPrice = styled.span<{ $empty: boolean }>`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme, $empty }) =>
    $empty ? theme.color.text.tertiary : theme.color.aurora.green};
  font-variant-numeric: tabular-nums;
`;

const LoadingRow = styled.div`
  padding: ${({ theme }) => theme.space[8]};
  text-align: center;
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
`;

const IdleHint = styled.div`
  padding: ${({ theme }) => theme.space[10]} ${({ theme }) => theme.space[4]};
  text-align: center;
  color: ${({ theme }) => theme.color.text.tertiary};
  font-size: ${({ theme }) => theme.typography.size.sm};
`;

// ── Component ───────────────────────────────────────────────────────────────

interface PriceCheckProps {
  open: boolean;
  onClose: () => void;
}

export function PriceCheck({ open, onClose }: PriceCheckProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TcgSearchCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audRate = useAudRate();
  const { currency } = useCurrency();
  const abortRef = useRef<AbortController | null>(null);

  // Focus search input on open
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
    // Reset state when closed so the next open starts fresh
    setQuery('');
    setResults([]);
    setError(null);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Debounced TCG API search
  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      // Cancel any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setError(null);
      try {
        // Name search — TCG API supports wildcards via name:*foo*
        const q = `name:*${trimmed.replace(/"/g, '')}*`;
        const res = await fetch(
          `${BASE}/cards?q=${encodeURIComponent(q)}&pageSize=${MAX_RESULTS}&orderBy=-set.releaseDate&select=id,name,number,rarity,images,set,tcgplayer,cardmarket`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setResults((json.data ?? []) as TcgSearchCard[]);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError('Search failed. Try again?');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [query, open]);

  const sortedResults = useMemo(() => {
    // Place cards with pricing first so the user sees valued cards immediately.
    return [...results].sort((a, b) => {
      const pa = bestPriceUsd(a);
      const pb = bestPriceUsd(b);
      if (pa == null && pb == null) return 0;
      if (pa == null) return 1;
      if (pb == null) return -1;
      return pb - pa;
    });
  }, [results]);

  return (
    <AnimatePresence>
      {open && (
        <Backdrop
          key='price-check-bg'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <Panel
            key='price-check-panel'
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            role='dialog'
            aria-label='Price check'
          >
            <Header>
              <TitleRow>
                <Title>
                  <IconZoomQuestion size={22} stroke={2} />
                  Price check
                </Title>
                <CloseBtn onClick={onClose} whileTap={tapPress} aria-label='Close'>
                  <IconX size={14} stroke={2.5} />
                </CloseBtn>
              </TitleRow>
              <Subtitle>
                Look up market prices for any Pokémon card without adding it to your collection.
              </Subtitle>
              <SearchBox>
                <SearchIconWrap>
                  <IconSearch size={16} stroke={2} />
                </SearchIconWrap>
                <SearchInput
                  ref={inputRef}
                  type='search'
                  placeholder='Charizard, Pikachu, Mewtwo...'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label='Search card name'
                />
              </SearchBox>
            </Header>
            <Body>
              {!query.trim() && (
                <IdleHint>Start typing a card name to see live market prices</IdleHint>
              )}
              {loading && <LoadingRow>Searching…</LoadingRow>}
              {error && (
                <EmptyState title='Something went wrong' body={error} />
              )}
              {!loading && !error && query.trim().length >= 2 && sortedResults.length === 0 && (
                <EmptyState
                  title='No cards found'
                  body={`No Pokémon cards match "${query}". Try a different spelling.`}
                />
              )}
              {!loading && sortedResults.length > 0 && (
                <ResultsGrid>
                  <AnimatePresence mode='popLayout'>
                    {sortedResults.map((card, i) => (
                      <PriceCheckResultItem
                        key={card.id}
                        card={card}
                        index={i}
                        currency={currency}
                        audRate={audRate}
                      />
                    ))}
                  </AnimatePresence>
                </ResultsGrid>
              )}
            </Body>
          </Panel>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

// Split into a memo-able child so keystrokes don't re-render every card.
function PriceCheckResultItem({
  card,
  index,
  currency,
  audRate,
}: {
  card: TcgSearchCard;
  index: number;
  currency: Currency;
  audRate: number;
}) {
  const price = bestPriceUsd(card);
  return (
    <ResultCard
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.02, 0.3), ease: easeOut }}
      whileTap={tapPress}
      onClick={(e) => {
        e.preventDefault();
        // Future: open the card in a detail view. For now no-op.
      }}
    >
      <ResultImg src={card.images.small} alt={card.name} loading='lazy' />
      <ResultName title={card.name}>{card.name}</ResultName>
      <ResultSet title={card.set.name}>{card.set.name}</ResultSet>
      <ResultPrice $empty={price == null}>
        {price == null ? 'Not listed' : fmtPrice(price, currency, audRate)}
      </ResultPrice>
    </ResultCard>
  );
}
