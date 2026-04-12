import styled from 'styled-components';
import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { IconPhotoScan, IconX, IconDownload, IconChevronDown } from '@tabler/icons-react';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import { FilterBar, GalleryFilters, defaultFilters } from '../../components';
import { useGetCardsQuery } from '../../api';
import { useTcgArtLookup } from '../../api/tcg/useTcgArtLookup';
import { useTcgPrices } from '../../api/tcg/useTcgPrices';
import { CardModel } from '../../api/fetch/card/cardModel';
import { useAudRate } from '../../hooks/useAudRate';
import { useCurrency, fmtPrice } from '../../hooks/useCurrency';
import * as RadixSelect from '@radix-ui/react-select';

// ── Shell ─────────────────────────────────────────────────────────────────────

const Main = styled.main`
  background-color: ${({ theme }) => theme.color.surface.muted};
  min-height: 60dvh;
  transition: background-color 200ms ease;
`;

const PageHeader = styled.div`
  padding: ${({ theme }) => `${theme.space[6]} 0 ${theme.space[2]}`};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.space[1]} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0;
`;

const ArtGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[4]};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: ${({ theme }) => theme.space[5]};
  }
`;

const ArtCardItem = styled(motion.div)`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: ${({ theme }) => theme.color.surface.subtle};
  aspect-ratio: 2.5 / 3.5;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.06);
`;

const ArtCardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ArtCardSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.color.surface.muted};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArtCardOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(0, 0, 0, 0.85) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.space[2]};
  opacity: 0;
`;

const ArtCardName = styled.p`
  color: #fff;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
`;

const ArtCardMeta = styled.p`
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.72rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
`;

const QtyBadge = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.space[2]};
  right: ${({ theme }) => theme.space[2]};
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 7px 3px 5px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 0.72rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  z-index: 2;
  letter-spacing: 0.02em;
`;

// Price badge with dynamic color tiers
const ArtPriceBadge = styled.div<{ $tier: 'normal' | 'high' | 'ultra' | 'missing' }>`
  position: absolute;
  top: ${({ theme }) => theme.space[2]};
  right: ${({ theme }) => theme.space[2]};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $tier }) =>
    $tier === 'ultra'   ? 'rgba(208, 135, 112, 0.75)' :
    $tier === 'high'    ? 'rgba(235, 203, 139, 0.75)' :
    $tier === 'missing' ? 'rgba(0, 0, 0, 0.45)' :
                          'rgba(0, 0, 0, 0.6)'};
  backdrop-filter: blur(6px);
  border: 1px solid ${({ $tier }) =>
    $tier === 'ultra'   ? 'rgba(208, 135, 112, 0.6)' :
    $tier === 'high'    ? 'rgba(235, 203, 139, 0.5)' :
    $tier === 'missing' ? 'rgba(255,255,255,0.12)' :
                          'rgba(163, 190, 140, 0.4)'};
  color: ${({ $tier }) =>
    $tier === 'ultra'   ? '#d08770' :
    $tier === 'high'    ? '#ebcb8b' :
    $tier === 'missing' ? 'rgba(255,255,255,0.35)' :
                          '#a3be8c'};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-variant-numeric: tabular-nums;
  z-index: 2;
  pointer-events: ${({ $tier }) => $tier === 'missing' ? 'auto' : 'none'};
  cursor: ${({ $tier }) => $tier === 'missing' ? 'help' : 'default'};
`;

// ── Lightbox ──────────────────────────────────────────────────────────────────

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[6]};
`;

const LightboxInner = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[5]};
  max-width: 480px;
  width: 100%;
`;

const LightboxImg = styled(motion.img)`
  width: 100%;
  max-width: 320px;
  border-radius: 10px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.08);
  display: block;
`;

const LightboxInfo = styled(motion.div)`
  text-align: center;
  color: #fff;
`;

const LightboxName = styled.h2`
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  margin: 0 0 ${({ theme }) => theme.space[2]};
  text-transform: capitalize;
`;

const LightboxTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
  justify-content: center;
`;

const Tag = styled.span`
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.8);
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  text-transform: capitalize;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PriceTag = styled.span<{ $tier?: 'normal' | 'high' | 'ultra' | 'graded' | 'missing' }>`
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $tier }) =>
    $tier === 'graded'  ? 'rgba(180,142,173,0.18)' :
    $tier === 'ultra'   ? 'rgba(208,135,112,0.18)' :
    $tier === 'high'    ? 'rgba(235,203,139,0.18)' :
    $tier === 'missing' ? 'rgba(255,255,255,0.06)' :
                          'rgba(163,190,140,0.2)'};
  color: ${({ $tier }) =>
    $tier === 'graded'  ? '#b48ead' :
    $tier === 'ultra'   ? '#d08770' :
    $tier === 'high'    ? '#ebcb8b' :
    $tier === 'missing' ? 'rgba(255,255,255,0.35)' :
                          '#a3be8c'};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  border: 1px solid ${({ $tier }) =>
    $tier === 'graded'  ? 'rgba(180,142,173,0.3)' :
    $tier === 'ultra'   ? 'rgba(208,135,112,0.3)' :
    $tier === 'high'    ? 'rgba(235,203,139,0.3)' :
    $tier === 'missing' ? 'rgba(255,255,255,0.1)' :
                          'rgba(163,190,140,0.3)'};
  font-variant-numeric: tabular-nums;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: -${({ theme }) => theme.space[3]};
  right: -${({ theme }) => theme.space[3]};
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[16]};
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.lg};
  gap: ${({ theme }) => theme.space[2]};
  text-align: center;
  grid-column: 1 / -1;
`;

const ClearLink = styled.button`
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
  font-family: inherit;
`;

// ── Header row ────────────────────────────────────────────────────────────────

const PageHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  flex-shrink: 0;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border: 1.5px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surface.subtle};
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 150ms ease, color 150ms ease, background 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.frost.blue};
    color: ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => `${theme.color.frost.blue}0c`};
  }
`;

// ── Sort control ──────────────────────────────────────────────────────────────

const SortRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding-bottom: ${({ theme }) => theme.space[2]};

  @media (max-width: 759px) {
    display: none;
  }
`;

const CurrencyToggle = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border: 1.5px solid ${({ $active, theme }) => $active ? theme.color.frost.blue : theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $active, theme }) => $active ? `${theme.color.frost.blue}12` : theme.color.surface.subtle};
  color: ${({ $active, theme }) => $active ? theme.color.frost.blue : theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  letter-spacing: 0.04em;
  transition: all 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.frost.blue};
    color: ${({ theme }) => theme.color.frost.blue};
  }
`;

const SortLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.color.text.secondary};
  white-space: nowrap;
`;

const SelectTrigger = styled(RadixSelect.Trigger)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  height: 2rem;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 1.5px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surface.subtle};
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  transition: box-shadow 150ms ease, background 150ms ease;

  &:hover {
    box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => theme.color.surface.base};
  }
  &[data-state='open'] {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => theme.color.surface.base};
  }
`;

const SelectContent = styled(RadixSelect.Content)`
  overflow: hidden;
  background: ${({ theme }) => theme.color.surface.base};
  border: 1.5px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  z-index: ${({ theme }) => theme.zIndex.modal};
  min-width: var(--radix-select-trigger-width);
  animation: popIn 130ms cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes popIn {
    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

const SelectViewport = styled(RadixSelect.Viewport)`
  padding: ${({ theme }) => theme.space[1]};
`;

const SelectItem = styled(RadixSelect.Item)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  color: ${({ theme }) => theme.color.text.primary};
  cursor: pointer;
  outline: none;
  user-select: none;
  transition: background 80ms ease;

  &[data-highlighted] { background: ${({ theme }) => theme.color.surface.muted}; }
  &[data-state='checked'] {
    color: ${({ theme }) => theme.color.frost.blue};
    font-weight: ${({ theme }) => theme.typography.weight.semibold};
  }
`;

// ── Tilt card wrapper ─────────────────────────────────────────────────────────

type PriceTier = 'normal' | 'high' | 'ultra' | 'missing';

function getPriceTier(
  usdPrice: number | undefined,
  hasTcgId: boolean,
  isGraded: boolean,
  currency: import('../../hooks/useCurrency').Currency,
  audRate: number,
): PriceTier | null {
  if (isGraded) return null;
  if (!hasTcgId) return null;
  if (usdPrice == null) return 'missing';
  const displayPrice = currency === 'AUD' ? usdPrice * audRate : usdPrice;
  if (displayPrice >= (currency === 'AUD' ? 150 : 100)) return 'ultra';
  if (displayPrice >= (currency === 'AUD' ? 50 : 30)) return 'high';
  return 'normal';
}

function TiltArtCard({ card, imgUrl, artLoading, price, audRate, currency, onClick }: {
  card: CardModel;
  imgUrl: string | null;
  artLoading: boolean;
  price?: number;
  audRate: number;
  currency: import('../../hooks/useCurrency').Currency;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { rawX.set(0); rawY.set(0); };

  const isGraded = card.attributes.isGraded || (card.attributes.grading ?? 0) > 0;
  const tier = getPriceTier(price, Boolean(card.attributes.tcgId), isGraded, currency, audRate);

  return (
    <ArtCardItem
      ref={ref}
      layoutId={`card-art-${card.cardId}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformPerspective: 600, rotateX, rotateY }}
      whileHover={{ y: -4, boxShadow: '0 20px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      onClick={onClick}
    >
      {imgUrl ? (
        <ArtCardImg src={imgUrl} alt={card.pokemonData.name} loading='lazy' />
      ) : (
        <ArtCardSkeleton>
          {artLoading ? (
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{ width: '100%', height: '100%', background: 'currentColor', opacity: 0.1 }}
            />
          ) : (
            <IconPhotoScan size='40%' stroke={1} style={{ opacity: 0.3 }} />
          )}
        </ArtCardSkeleton>
      )}
      <ArtCardOverlay
        initial={false}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <ArtCardName>{card.pokemonData.name}</ArtCardName>
        {card.attributes.set && (
          <ArtCardMeta>{card.attributes.set}</ArtCardMeta>
        )}
      </ArtCardOverlay>
      {tier && (
        <ArtPriceBadge $tier={tier} title={tier === 'missing' ? 'Price not available from TCGPlayer' : undefined}>
          {tier === 'missing' ? '—' : fmtPrice(price!, currency, audRate)}
        </ArtPriceBadge>
      )}
      {(card.quantity ?? 1) > 1 && (
        <QtyBadge>×{card.quantity}</QtyBadge>
      )}
    </ArtCardItem>
  );
}

// ── CSV export ────────────────────────────────────────────────────────────────

function exportCollectionCsv(cards: CardModel[], audRate: number) {
  const headers = ['Name', 'Type', 'Set', 'Rarity', 'Condition', 'Quantity', 'Variants', 'Market Price (USD)', 'Market Price (AUD)', 'TCG ID'];
  const rows = cards.map((c) => {
    const v = c.attributes.variants;
    const variants = v
      ? [v.normal && 'Normal', (v.alternate ?? v.reverseHolo) && 'Alternate']
          .filter(Boolean).join(' + ') || 'Normal'
      : 'Normal';
    const usd = c.attributes.marketPrice;
    return [
      c.pokemonData.name,
      c.pokemonData.type,
      c.attributes.set,
      c.attributes.rarity ?? '',
      c.attributes.condition,
      c.quantity ?? 1,
      variants,
      usd != null ? usd.toFixed(2) : '',
      usd != null ? (usd * audRate).toFixed(2) : '',
      c.attributes.tcgId ?? '',
    ].map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',');
  });
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `polardex-collection-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Sort options ──────────────────────────────────────────────────────────────

type SortKey = 'default' | 'name-asc' | 'name-desc' | 'price-high' | 'price-low' | 'set';

const SORT_LABELS: Record<SortKey, string> = {
  'default':    'Default',
  'name-asc':  'Name A → Z',
  'name-desc': 'Name Z → A',
  'price-high':'Price High → Low',
  'price-low': 'Price Low → High',
  'set':       'Set',
};

// ── Component ─────────────────────────────────────────────────────────────────

export function Gallery() {
  const { cards, loading } = useGetCardsQuery();
  const [filters, setFilters] = useState<GalleryFilters>(defaultFilters);
  const [selected, setSelected] = useState<CardModel | null>(null);
  const [sort, setSort] = useState<SortKey>('default');
  const audRate = useAudRate();
  const { currency, toggle: toggleCurrency } = useCurrency();

  // Live market prices
  const tcgIds = useMemo(
    () => cards.map((c) => c.attributes.tcgId).filter((id): id is string => Boolean(id)),
    [cards],
  );
  const { priceMap } = useTcgPrices(tcgIds);

  const typeOptions = useMemo(
    () => [...new Set(cards.map((c) => c.pokemonData.type).filter(Boolean))].sort(),
    [cards]
  );
  const setOptions = useMemo(
    () => [...new Set(cards.map((c) => c.attributes.set).filter(Boolean))].sort(),
    [cards]
  );
  const conditionOptions = useMemo(
    () => [...new Set(cards.map((c) => c.attributes.condition).filter(Boolean))].sort(),
    [cards]
  );

  // Filter + sort
  const filteredCards = useMemo(() => {
    const filtered = cards.filter((card) => {
      const search = filters.search.toLowerCase();
      if (search && !card.pokemonData.name.toLowerCase().includes(search)) return false;
      if (filters.type && card.pokemonData.type !== filters.type) return false;
      if (filters.set && card.attributes.set !== filters.set) return false;
      if (filters.condition && card.attributes.condition !== filters.condition) return false;
      return true;
    });

    if (sort === 'name-asc') return [...filtered].sort((a, b) => a.pokemonData.name.localeCompare(b.pokemonData.name));
    if (sort === 'name-desc') return [...filtered].sort((a, b) => b.pokemonData.name.localeCompare(a.pokemonData.name));
    if (sort === 'set') return [...filtered].sort((a, b) => a.attributes.set.localeCompare(b.attributes.set));
    if (sort === 'price-high') return [...filtered].sort((a, b) => {
      const pa = a.attributes.tcgId ? (priceMap.get(a.attributes.tcgId) ?? -1) : -1;
      const pb = b.attributes.tcgId ? (priceMap.get(b.attributes.tcgId) ?? -1) : -1;
      return pb - pa;
    });
    if (sort === 'price-low') return [...filtered].sort((a, b) => {
      const pa = a.attributes.tcgId ? (priceMap.get(a.attributes.tcgId) ?? Infinity) : Infinity;
      const pb = b.attributes.tcgId ? (priceMap.get(b.attributes.tcgId) ?? Infinity) : Infinity;
      return pa - pb;
    });
    return filtered;
  }, [cards, filters, sort, priceMap]);

  // Art lookup for all card names
  const cardNames = useMemo(
    () => filteredCards.map((c) => c.pokemonData.name),
    [filteredCards]
  );
  const { artMap, loading: artLoading } = useTcgArtLookup(cardNames, true);

  // Close lightbox on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelected(null);
    }
    if (selected) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selected]);

  const getImgUrl = (card: CardModel) =>
    card.attributes.tcgImageUrl ||
    artMap[card.pokemonData.name.toLowerCase()] ||
    null;

  // Sort control JSX (shared between desktop row and mobile filter drawer)
  const sortSelect = (
    <RadixSelect.Root value={sort} onValueChange={(v) => setSort(v as SortKey)}>
      <SelectTrigger aria-label='Sort cards'>
        <RadixSelect.Value />
        <RadixSelect.Icon style={{ display: 'flex', opacity: 0.45 }}>
          <IconChevronDown size={12} stroke={2} />
        </RadixSelect.Icon>
      </SelectTrigger>
      <RadixSelect.Portal>
        <SelectContent position='popper' sideOffset={6}>
          <SelectViewport>
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <SelectItem key={key} value={key}>
                <RadixSelect.ItemText>{SORT_LABELS[key]}</RadixSelect.ItemText>
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );

  return (
    <Main>
      <section>
        <SectionWrapper>
          <PageHeader>
            <PageHeaderRow>
              <div>
                <PageTitle>Collection</PageTitle>
                <PageSubtitle>Browse and filter your Pokémon card library.</PageSubtitle>
              </div>
              <HeaderActions>
                <CurrencyToggle $active={currency === 'AUD'} onClick={toggleCurrency} title='Toggle currency'>
                  {currency}
                </CurrencyToggle>
                {cards.length > 0 && (
                  <ActionBtn onClick={() => exportCollectionCsv(cards, audRate)} title='Export to CSV'>
                    <IconDownload size={14} stroke={2} />
                    Export
                  </ActionBtn>
                )}
              </HeaderActions>
            </PageHeaderRow>
          </PageHeader>

          <FilterBar
            filters={filters}
            onChange={setFilters}
            typeOptions={typeOptions}
            setOptions={setOptions}
            conditionOptions={conditionOptions}
            totalCount={cards.length}
            filteredCount={filteredCards.length}
            sortControl={sortSelect}
          />

          {/* Sort row — desktop only (hidden on mobile via CSS) */}
          {!loading && cards.length > 0 && (
            <SortRow>
              <SortLabel>Sort:</SortLabel>
              {sortSelect}
            </SortRow>
          )}

          <AnimatePresence mode='wait'>
            {loading ? (
              <ArtGrid key='skeleton'>
                {Array.from({ length: 24 }).map((_, i) => (
                  <ArtCardItem
                    key={i}
                    animate={{ opacity: [0.35, 0.65, 0.35] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: (i % 8) * 0.1, ease: 'easeInOut' }}
                  >
                    <ArtCardSkeleton />
                  </ArtCardItem>
                ))}
              </ArtGrid>
            ) : cards.length === 0 ? (
              <div key='no-cards' style={{ display: 'grid' }}>
                <EmptyState>
                  <span>Your collection is empty.</span>
                  <span style={{ fontSize: '0.9em', opacity: 0.7 }}>
                    Head to Studio or Sets to add your first card.
                  </span>
                </EmptyState>
              </div>
            ) : filteredCards.length === 0 ? (
              <div key='empty' style={{ display: 'grid' }}>
                <EmptyState>
                  <span>No cards match your filters.</span>
                  <ClearLink onClick={() => setFilters(defaultFilters)}>
                    Clear filters
                  </ClearLink>
                </EmptyState>
              </div>
            ) : (
              <motion.div key='grid' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                <ArtGrid>
                  {filteredCards.map((card, i) => {
                    const imgUrl = getImgUrl(card);
                    const price = card.attributes.tcgId ? priceMap.get(card.attributes.tcgId) : undefined;
                    return (
                      <motion.div
                        key={card.cardId}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: Math.min(i * 0.02, 0.4) }}
                      >
                        <TiltArtCard
                          card={card}
                          imgUrl={imgUrl}
                          artLoading={artLoading}
                          price={price}
                          audRate={audRate}
                          currency={currency}
                          onClick={() => setSelected(card)}
                        />
                      </motion.div>
                    );
                  })}
                </ArtGrid>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionWrapper>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (() => {
          const imgUrl = getImgUrl(selected);
          const selectedPriceUsd = selected.attributes.tcgId ? priceMap.get(selected.attributes.tcgId) : undefined;
          const isGraded = selected.attributes.isGraded || (selected.attributes.grading ?? 0) > 0;
          const tier = getPriceTier(selectedPriceUsd, Boolean(selected.attributes.tcgId), isGraded, currency, audRate);
          const tags = [
            selected.attributes.set,
            selected.attributes.condition,
            selected.pokemonData.type,
            selected.attributes.grading ? `PSA/BGS ${selected.attributes.grading}` : undefined,
          ].filter(Boolean) as string[];

          return (
            <Backdrop
              key='backdrop'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelected(null)}
            >
              <LightboxInner
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              >
                <CloseButton
                  className='icon-close'
                  onClick={() => setSelected(null)}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  <IconX size={14} stroke={2.5} />
                </CloseButton>

                {imgUrl ? (
                  <LightboxImg
                    layoutId={`card-art-${selected.cardId}`}
                    src={imgUrl}
                    alt={selected.pokemonData.name}
                  />
                ) : (
                  <LightboxImg
                    as={motion.div}
                    layoutId={`card-art-${selected.cardId}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.05)',
                      aspectRatio: '2.5/3.5',
                      color: 'rgba(255,255,255,0.25)',
                    }}
                  >
                    <IconPhotoScan size='40%' stroke={1} />
                  </LightboxImg>
                )}

                <LightboxInfo
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.25 }}
                >
                  <LightboxName>{selected.pokemonData.name}</LightboxName>
                  <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                    {isGraded ? (
                      <PriceTag $tier='graded'>Graded — raw price not applicable</PriceTag>
                    ) : tier === 'missing' ? (
                      <PriceTag $tier='missing'>Price not found in TCGPlayer</PriceTag>
                    ) : selectedPriceUsd != null ? (
                      <PriceTag $tier={tier ?? 'normal'}>
                        {fmtPrice(selectedPriceUsd, currency, audRate)} raw market
                      </PriceTag>
                    ) : null}
                  </div>
                  {tags.length > 0 && (
                    <LightboxTags>
                      {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                    </LightboxTags>
                  )}
                </LightboxInfo>
              </LightboxInner>
            </Backdrop>
          );
        })()}
      </AnimatePresence>
    </Main>
  );
}
