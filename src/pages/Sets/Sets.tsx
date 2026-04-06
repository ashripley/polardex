import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'styled-components';
import { IconSearch, IconX, IconChevronLeft, IconChevronRight, IconPackage, IconPlus, IconCheck, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import { usePokemonSetsQuery } from '../../api/tcg/usePokemonSetsQuery';
import { usePokemonSetCardsQuery } from '../../api/tcg/usePokemonSetCardsQuery';
import { useGetCardsQuery } from '../../api';
import { TcgSet, TcgCard } from '../../api/tcg/types';
import { saveCard, generateCardId, removeCard } from '../../api/mutations';
import { toSpriteName } from '../../utils';
import { CardModel } from '../../api/fetch/card/cardModel';

// ── Shell ─────────────────────────────────────────────────────────────────────

const Main = styled.main`
  background-color: ${({ theme }) => theme.color.surface.muted};
  min-height: 60dvh;
  transition: background-color 200ms ease;
`;

// ── Page header ───────────────────────────────────────────────────────────────

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

// ── Search bar ────────────────────────────────────────────────────────────────

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: ${({ theme }) => `${theme.space[4]} 0`};
`;

const SearchIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.color.text.secondary};
  display: flex;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 2.75rem;
  padding: 0 ${({ theme }) => theme.space[10]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background-color: ${({ theme }) => theme.color.surface.subtle};
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  outline: none;
  box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.surface.muted};
  transition: box-shadow 150ms ease, background-color 200ms ease;

  &::placeholder { color: ${({ theme }) => theme.color.text.secondary}; }
  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.frost.blue};
    background-color: ${({ theme }) => theme.color.surface.base};
  }
`;

const ClearBtn = styled(motion.button)`
  position: absolute;
  right: ${({ theme }) => theme.space[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.surface.muted};
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.color.text.secondary};
  width: 1.5rem;
  height: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.full};
`;

// ── Search mode toggle ────────────────────────────────────────────────────────

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  margin: ${({ theme }) => `${theme.space[4]} 0`};
`;

const ModeToggle = styled.div`
  display: flex;
  flex-shrink: 0;
  background: ${({ theme }) => theme.color.surface.subtle};
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.surface.border};
  padding: 3px;
`;

const SortBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border: 1.5px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surface.subtle};
  color: ${({ theme }) => theme.color.text.secondary};
  cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease, background 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.frost.blue};
    color: ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => `${theme.color.frost.blue}12`};
  }
`;

const ModeBtn = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $active, theme }) => $active ? theme.color.frost.blue : 'transparent'};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background 150ms ease, color 150ms ease;
`;

// ── Series filter pills ───────────────────────────────────────────────────────

const PillRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  overflow-x: auto;
  padding: ${({ theme }) => `${theme.space[1]} 0 ${theme.space[3]}`};
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const Pill = styled(motion.button) <{ $active: boolean }>`
  flex-shrink: 0;
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[4]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background-color: ${({ $active, theme }) =>
    $active ? theme.color.frost.blue : theme.color.surface.subtle};
  color: ${({ $active, theme }) =>
    $active ? '#ffffff' : theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.typography.weight.semibold : theme.typography.weight.medium};
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: ${({ $active, theme }) =>
    $active
      ? `0 2px 8px ${theme.color.frost.blue}40`
      : `0 0 0 1.5px ${theme.color.surface.muted}`};
  transition: background-color 150ms ease, color 150ms ease, box-shadow 150ms ease;
`;

// ── Sets grid ─────────────────────────────────────────────────────────────────

const SetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => `${theme.space[2]} 0 ${theme.space[8]}`};
`;

const SetCard = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.surface.base};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  border: none;
  cursor: pointer;
  text-align: left;
  transition: box-shadow 200ms ease;
  width: 100%;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

const SetLogo = styled.img`
  height: 2.5rem;
  object-fit: contain;
  max-width: 100%;
`;

const SetLogoFallback = styled.div`
  height: 2.5rem;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.text.tertiary};
`;

const SetInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SetName = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.color.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SetMeta = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.color.text.secondary};
  margin-top: ${({ theme }) => theme.space[1]};
`;

const SetFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
`;

const CardCount = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const CollectionBadge = styled.span<{ $pct: number }>`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ $pct, theme }) =>
    $pct === 100
      ? theme.color.aurora.green
      : $pct > 0
        ? theme.color.frost.blue
        : theme.color.text.secondary};
  background: ${({ $pct, theme }) =>
    $pct === 100
      ? `${theme.color.aurora.green}18`
      : $pct > 0
        ? `${theme.color.frost.blue}15`
        : `${theme.color.aurora.orange}15`};
  border: 1px solid ${({ $pct, theme }) =>
    $pct === 0 ? `${theme.color.aurora.orange}30` : 'transparent'};
  padding: ${({ theme }) => `2px ${theme.space[2]}`};
  border-radius: ${({ theme }) => theme.radius.full};
`;

// ── Set detail (cards view) ───────────────────────────────────────────────────

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => `${theme.space[6]} 0 ${theme.space[4]}`};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border: 1.5px solid ${({ theme }) => theme.color.text.secondary};
  border-radius: ${({ theme }) => theme.radius.full};
  background: transparent;
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme }) => theme.color.frost.blue};
    color: ${({ theme }) => theme.color.frost.blue};
  }
`;

const DetailTitle = styled.div`
  flex: 1;
`;

const DetailName = styled.h2`
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

const DetailSub = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: ${({ theme }) => theme.space[1]} 0 0 0;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  gap: ${({ theme }) => theme.space[3]};
  padding-bottom: ${({ theme }) => theme.space[8]};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  }
`;

const TcgCardItem = styled(motion.div) <{ $owned: boolean }>`
  position: relative;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.color.surface.subtle};
  box-shadow: ${({ $owned, theme }) =>
    $owned ? `0 0 0 2.5px ${theme.color.frost.blue}, ${theme.shadow.sm}` : theme.shadow.sm};
  cursor: ${({ $owned }) => ($owned ? 'default' : 'pointer')};
`;

const AddOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: opacity 150ms ease;

  ${TcgCardItem}:hover & {
    opacity: 1;
  }
`;

const AddIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.frost.blue};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
`;

const QuantityOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.55);
  opacity: 0;
  transition: opacity 150ms ease;

  ${TcgCardItem}:hover & {
    opacity: 1;
  }
`;

const QtyBtn = styled.button`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transition: transform 100ms ease;

  &:active { transform: scale(0.9); }
`;

const QtyMinusBtn = styled(QtyBtn)`
  background: ${({ theme }) => theme.color.aurora.red};
`;

const QtyPlusBtn = styled(QtyBtn)`
  background: ${({ theme }) => theme.color.frost.blue};
`;

const QtyCount = styled.span`
  color: #fff;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  min-width: 1.25rem;
  text-align: center;
`;

const TcgCardImg = styled.img<{ $owned: boolean }>`
  width: 100%;
  display: block;
  opacity: ${({ $owned }) => ($owned ? 1 : 0.4)};
  transition: opacity 200ms ease;
`;

const OwnedBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.space[1]};
  right: ${({ theme }) => theme.space[1]};
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.frost.blue};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TcgCardName = styled.p`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.color.text.secondary};
  text-align: center;
  margin: ${({ theme }) => theme.space[1]} 0;
  padding: 0 ${({ theme }) => theme.space[1]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SkeletonBox = styled(motion.div)`
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface.subtle};
  aspect-ratio: 3/4;
`;

// ── Pokemon cross-set search results ─────────────────────────────────────────

const PokemonResultsMeta = styled.p`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0 0 ${({ theme }) => theme.space[3]} 0;
`;

const TcgCardSetLabel = styled.p`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.color.text.secondary};
  text-align: center;
  margin: ${({ theme }) => theme.space[1]} 0;
  padding: 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.space[16]} ${theme.space[4]}`};
  text-align: center;
`;

const EmptyIcon = styled.p`
  font-size: 2.5rem;
  margin: 0 0 ${({ theme }) => theme.space[3]} 0;
`;

const EmptyTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.space[2]} 0;
`;

const EmptyBody = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0;
`;

// ── Pagination bar ────────────────────────────────────────────────────────────

const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]} ${theme.space[4]}`};
`;

const PageButton = styled.button<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1.5px solid ${({ theme }) => theme.color.surface.border};
  background: ${({ $disabled, theme }) =>
    $disabled ? 'transparent' : theme.color.surface.subtle};
  color: ${({ $disabled, theme }) =>
    $disabled ? theme.color.text.secondary : theme.color.text.primary};
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.38 : 1)};
  transition: background 150ms ease, color 150ms ease, opacity 150ms ease;
  font-family: inherit;

  &:hover:not([disabled]) {
    background: ${({ theme }) => theme.color.frost.blue}22;
    border-color: ${({ theme }) => theme.color.frost.blue};
    color: ${({ theme }) => theme.color.frost.blue};
  }
`;

const PageLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.secondary};
  min-width: 7rem;
  text-align: center;
  user-select: none;
`;

// ── Toast ─────────────────────────────────────────────────────────────────────

const Toast = styled(motion.div)`
  position: fixed;
  bottom: ${({ theme }) => theme.space[8]};
  left: 50%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[5]}`};
  background: ${({ theme }) => theme.color.surface.base};
  border: 1.5px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.color.text.primary};
  z-index: 9999;
  white-space: nowrap;
  pointer-events: none;
`;

const ToastIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.aurora.green};
  color: #fff;
  flex-shrink: 0;
`;

// ── Component ─────────────────────────────────────────────────────────────────

export function Sets() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState<'sets' | 'pokemon'>('sets');
  const [newestFirst, setNewestFirst] = useState(false);
  const [activeSeries, setActiveSeries] = useState('');
  const [selectedSet, setSelectedSet] = useState<TcgSet | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [cardSearch, setCardSearch] = useState('');

  // Pokémon cross-set search
  const [pokemonResults, setPokemonResults] = useState<TcgCard[]>([]);
  const [pokemonLoading, setPokemonLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [setPage, setSetPage] = useState(1);
  const SET_PAGE_SIZE = 48;

  const { sets, loading: setsLoading } = usePokemonSetsQuery();
  const { cards: tcgCards, loading: cardsLoading } = usePokemonSetCardsQuery(
    selectedSet?.id ?? null
  );
  const { cards: myCards } = useGetCardsQuery();

  // Reset to page 1 whenever the selected set or card search changes
  useEffect(() => { setSetPage(1); }, [selectedSet, cardSearch]);

  // Cross-set Pokémon search with debounce
  useEffect(() => {
    if (searchMode !== 'pokemon') return;
    if (!search.trim()) { setPokemonResults([]); return; }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setPokemonLoading(true);
      try {
        const res = await fetch(
          `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(search.trim())}*&orderBy=-set.releaseDate&pageSize=100`
        );
        const json = await res.json();
        setPokemonResults(json.data ?? []);
      } catch {
        setPokemonResults([]);
      } finally {
        setPokemonLoading(false);
      }
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, searchMode]);

  // Owned detection:
  // - Match by tcgId (exact per variant) when available
  // - Fall back to name+set only for cards stored without a tcgId
  const ownedTcgIds = useMemo(
    () => new Set(myCards.map((c) => c.attributes.tcgId).filter(Boolean)),
    [myCards]
  );
  const ownedByNameAndSet = useMemo(() => {
    if (!selectedSet) return new Set<string>();
    return new Set(
      myCards
        .filter(
          (c) =>
            !c.attributes.tcgId &&
            c.attributes.set.toLowerCase() === selectedSet.name.toLowerCase()
        )
        .map((c) => c.pokemonData.name.toLowerCase())
    );
  }, [myCards, selectedSet]);

  const isOwned = (card: TcgCard) =>
    ownedTcgIds.has(card.id) || ownedByNameAndSet.has(card.name.toLowerCase());

  const findOwnedCard = (card: TcgCard) =>
    myCards.find(
      (c) =>
        c.attributes.tcgId === card.id ||
        (!c.attributes.tcgId &&
          c.pokemonData.name.toLowerCase() === card.name.toLowerCase() &&
          selectedSet &&
          c.attributes.set.toLowerCase() === selectedSet.name.toLowerCase())
    );

  const handleQuickAdd = useCallback(async (card: TcgCard) => {
    const setName = selectedSet?.name ?? card.set.name;
    const cardModel: CardModel = {
      cardId: generateCardId(),
      quantity: 1,
      setNumber: card.number ? parseInt(card.number, 10) || 0 : 0,
      attributes: {
        cardType: '',
        set: setName,
        rarity: card.rarity ?? '',
        condition: '',
        grading: 0,
        isGraded: false,
        tcgId: card.id,
        tcgImageUrl: card.images.large,
      },
      pokemonData: {
        name: card.name,
        id: 0,
        evolutions: { first: { name: '', imageUrl: '' } },
        type: (card.types?.[0] === 'Lightning' ? 'Electric' : card.types?.[0]) ?? '',
        imageUrl: `https://img.pokemondb.net/sprites/home/normal/${toSpriteName(card.name)}.png`,
      },
    };
    setJustAddedId(card.id);
    await saveCard(cardModel);
    setToastMsg(`${card.name} added to your collection!`);
    setTimeout(() => setJustAddedId(null), 700);
    setTimeout(() => setToastMsg(null), 3000);
  }, [selectedSet]);

  const handleUpdateQuantity = useCallback(async (card: TcgCard, delta: number) => {
    const owned = findOwnedCard(card);
    if (!owned) return;
    const newQty = (owned.quantity ?? 1) + delta;
    if (newQty <= 0) {
      await removeCard(owned.cardId);
      setToastMsg(`${card.name} removed from your collection.`);
    } else {
      await saveCard({ ...owned, quantity: newQty });
    }
    setTimeout(() => setToastMsg(null), 3000);
  }, [myCards, selectedSet]);

  const series = useMemo(
    () => ['', ...new Set(sets.map((s) => s.series))],
    [sets]
  );

  const filteredSets = useMemo(() => {
    const filtered = sets.filter((s) => {
      if (activeSeries && s.series !== activeSeries) return false;
      if (searchMode === 'sets' && search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    return newestFirst ? [...filtered].reverse() : filtered;
  }, [sets, search, activeSeries, searchMode, newestFirst]);

  const getCompletionPct = (set: TcgSet) => {
    const count = myCards.filter(
      (c) => c.attributes.set.toLowerCase() === set.name.toLowerCase()
    ).length;
    if (count === 0) return 0;
    return Math.min(100, Math.round((count / set.total) * 100));
  };

  const filteredTcgCards = useMemo(
    () => cardSearch.trim()
      ? tcgCards.filter((c) => c.name.toLowerCase().includes(cardSearch.toLowerCase()))
      : tcgCards,
    [tcgCards, cardSearch]
  );

  const totalSetPages = Math.max(1, Math.ceil(filteredTcgCards.length / SET_PAGE_SIZE));
  const pagedTcgCards = useMemo(
    () => filteredTcgCards.slice((setPage - 1) * SET_PAGE_SIZE, setPage * SET_PAGE_SIZE),
    [filteredTcgCards, setPage]
  );

  if (selectedSet) {
    const ownedInSet = tcgCards.filter(isOwned);

    return (
      <>
        <Main>
          <section>
            <SectionWrapper>
              <DetailHeader>
                <BackButton onClick={() => { setSelectedSet(null); setCardSearch(''); }}>
                  <IconChevronLeft size={14} stroke={2} />
                  All Sets
                </BackButton>
                <DetailTitle>
                  <DetailName>{selectedSet.name}</DetailName>
                  <DetailSub>
                    {selectedSet.series} · {selectedSet.releaseDate} · {selectedSet.total} cards
                    {ownedInSet.length > 0 && ` · ${ownedInSet.length} owned`}
                  </DetailSub>
                </DetailTitle>
                {selectedSet.images?.logo && (
                  <img
                    src={selectedSet.images.logo}
                    alt={selectedSet.name}
                    style={{ height: '2.5rem', objectFit: 'contain' }}
                  />
                )}
              </DetailHeader>

              <SearchWrapper>
                <SearchIcon><IconSearch size={16} stroke={2} /></SearchIcon>
                <SearchInput
                  placeholder='Search cards in this set...'
                  value={cardSearch}
                  onChange={(e) => setCardSearch(e.target.value)}
                />
                <AnimatePresence>
                  {cardSearch && (
                    <ClearBtn
                      key='card-clear'
                      className='icon-close'
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      onClick={() => setCardSearch('')}
                    >
                      <IconX size={12} stroke={2.5} />
                    </ClearBtn>
                  )}
                </AnimatePresence>
              </SearchWrapper>

              <AnimatePresence mode='wait'>
                {cardsLoading ? (
                  <CardsGrid key='skeleton'>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <SkeletonBox
                        key={i}
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                      />
                    ))}
                  </CardsGrid>
                ) : filteredTcgCards.length === 0 && cardSearch ? (
                  <EmptyState
                    key='no-results'
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EmptyIcon>🔍</EmptyIcon>
                    <EmptyTitle>No results for "{cardSearch}"</EmptyTitle>
                    <EmptyBody>No Pokémon with that name in {selectedSet.name}.</EmptyBody>
                  </EmptyState>
                ) : (
                  <motion.div
                    key={`set-cards-page-${setPage}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardsGrid>
                      {pagedTcgCards.map((card, i) => {
                        const owned = isOwned(card);
                        return (
                          <TcgCardItem
                            key={card.id}
                            $owned={owned}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.4) }}
                            whileHover={{ y: -4, scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={owned ? undefined : () => handleQuickAdd(card)}
                            style={{ cursor: owned ? 'default' : 'pointer' }}
                          >
                            <TcgCardImg
                              src={card.images.small}
                              alt={card.name}
                              $owned={owned}
                              loading='lazy'
                            />
                            {owned && (
                              <>
                                <OwnedBadge>
                                  <svg width='8' height='8' viewBox='0 0 10 8' fill='none'>
                                    <path d='M1 4L3.5 6.5L9 1' stroke='white' strokeWidth='1.8' strokeLinecap='round' />
                                  </svg>
                                </OwnedBadge>
                                <QuantityOverlay>
                                  <QtyMinusBtn
                                    onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(card, -1); }}
                                    title='Remove one'
                                  >−</QtyMinusBtn>
                                  <QtyCount>{findOwnedCard(card)?.quantity ?? 1}</QtyCount>
                                  <QtyPlusBtn
                                    onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(card, 1); }}
                                    title='Add one more'
                                  >+</QtyPlusBtn>
                                </QuantityOverlay>
                              </>
                            )}
                            {!owned && (
                              <AddOverlay>
                                <AddIcon><IconPlus size={16} stroke={2.5} /></AddIcon>
                              </AddOverlay>
                            )}
                            {justAddedId === card.id && (
                              <motion.div
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  borderRadius: 'inherit',
                                  border: `3px solid ${theme.color.aurora.green}`,
                                  pointerEvents: 'none',
                                }}
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{ scale: 1.18, opacity: 0 }}
                                transition={{ duration: 0.65, ease: 'easeOut' }}
                              />
                            )}
                            <TcgCardName>{card.name}</TcgCardName>
                          </TcgCardItem>
                        );
                      })}
                    </CardsGrid>
                    {totalSetPages > 1 && (
                      <PaginationBar>
                        <PageButton
                          $disabled={setPage === 1}
                          disabled={setPage === 1}
                          onClick={() => setSetPage((p) => Math.max(1, p - 1))}
                          aria-label='Previous page'
                        >
                          <IconChevronLeft size={14} stroke={2} />
                        </PageButton>
                        <PageLabel>Page {setPage} of {totalSetPages}</PageLabel>
                        <PageButton
                          $disabled={setPage === totalSetPages}
                          disabled={setPage === totalSetPages}
                          onClick={() => setSetPage((p) => Math.min(totalSetPages, p + 1))}
                          aria-label='Next page'
                        >
                          <IconChevronRight size={14} stroke={2} />
                        </PageButton>
                      </PaginationBar>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionWrapper>
          </section>
        </Main>
        <AnimatePresence>
          {toastMsg && (
            <Toast
              key='toast'
              initial={{ opacity: 0, y: 16, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 16, x: '-50%' }}
              transition={{ duration: 0.2 }}
            >
              <ToastIcon><IconCheck size={10} stroke={3} /></ToastIcon>
              {toastMsg}
            </Toast>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <Main>
      <section>
        <SectionWrapper>
          <PageHeader>
            <PageTitle>Card Sets</PageTitle>
            <PageSubtitle>Browse all Pokémon TCG sets and track your collection progress.</PageSubtitle>
          </PageHeader>

          <SearchRow>
            <SearchWrapper style={{ margin: 0, flex: 1 }}>
              <SearchIcon><IconSearch size={16} stroke={2} /></SearchIcon>
              <SearchInput
                placeholder={searchMode === 'sets' ? 'Search sets...' : 'Search Pokémon across all sets...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <AnimatePresence>
                {search && (
                  <ClearBtn
                    key='clear'
                    className='icon-close'
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    onClick={() => setSearch('')}
                  >
                    <IconX size={12} stroke={2.5} />
                  </ClearBtn>
                )}
              </AnimatePresence>
            </SearchWrapper>
            <ModeToggle>
              <ModeBtn $active={searchMode === 'sets'} onClick={() => { setSearchMode('sets'); setSearch(''); }}>
                Sets
              </ModeBtn>
              <ModeBtn $active={searchMode === 'pokemon'} onClick={() => { setSearchMode('pokemon'); setSearch(''); }}>
                Pokémon
              </ModeBtn>
            </ModeToggle>
            {searchMode === 'sets' && (
              <SortBtn
                onClick={() => setNewestFirst((p) => !p)}
                title={newestFirst ? 'Showing newest first - click for oldest first' : 'Showing oldest first - click for newest first'}
              >
                {newestFirst ? <IconSortDescending size={16} stroke={2} /> : <IconSortAscending size={16} stroke={2} />}
              </SortBtn>
            )}
          </SearchRow>

          {searchMode === 'sets' && (
            <PillRow>
              {series.map((s) => (
                <Pill
                  key={s || 'all'}
                  $active={activeSeries === s}
                  onClick={() => setActiveSeries(s)}
                  whileTap={{ scale: 0.93 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {s || 'All'}
                </Pill>
              ))}
            </PillRow>
          )}

          {searchMode === 'pokemon' ? (
            <AnimatePresence mode='wait'>
              {!search.trim() ? (
                <EmptyState key='idle' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <EmptyIcon>🔍</EmptyIcon>
                  <EmptyTitle>Search for a Pokémon</EmptyTitle>
                  <EmptyBody>Type a name to find cards across every set.</EmptyBody>
                </EmptyState>
              ) : pokemonLoading ? (
                <CardsGrid key='loading'>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <SkeletonBox key={i} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }} />
                  ))}
                </CardsGrid>
              ) : pokemonResults.length === 0 ? (
                <EmptyState key='no-results' initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <EmptyIcon>🔍</EmptyIcon>
                  <EmptyTitle>No results for "{search}"</EmptyTitle>
                  <EmptyBody>Try a different Pokémon name.</EmptyBody>
                </EmptyState>
              ) : (
                <motion.div key='results' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  <PokemonResultsMeta>{pokemonResults.length} card{pokemonResults.length !== 1 ? 's' : ''} found across all sets</PokemonResultsMeta>
                  <CardsGrid>
                    {pokemonResults.map((card, i) => {
                      const owned = isOwned(card);
                      return (
                        <TcgCardItem
                          key={card.id}
                          $owned={owned}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: Math.min(i * 0.015, 0.4) }}
                          whileHover={{ y: -4, scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={owned ? undefined : () => handleQuickAdd(card)}
                          style={{ cursor: owned ? 'default' : 'pointer' }}
                        >
                          <TcgCardImg src={card.images.small} alt={card.name} $owned={owned} loading='lazy' />
                          {owned && (
                            <>
                              <OwnedBadge>
                                <svg width='8' height='8' viewBox='0 0 10 8' fill='none'>
                                  <path d='M1 4L3.5 6.5L9 1' stroke='white' strokeWidth='1.8' strokeLinecap='round' />
                                </svg>
                              </OwnedBadge>
                              <QuantityOverlay>
                                <QtyMinusBtn
                                  onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(card, -1); }}
                                  title='Remove one'
                                >−</QtyMinusBtn>
                                <QtyCount>{findOwnedCard(card)?.quantity ?? 1}</QtyCount>
                                <QtyPlusBtn
                                  onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(card, 1); }}
                                  title='Add one more'
                                >+</QtyPlusBtn>
                              </QuantityOverlay>
                            </>
                          )}
                          {!owned && (
                            <AddOverlay>
                              <AddIcon><IconPlus size={16} stroke={2.5} /></AddIcon>
                            </AddOverlay>
                          )}
                          {justAddedId === card.id && (
                            <motion.div
                              style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: `3px solid ${theme.color.aurora.green}`, pointerEvents: 'none' }}
                              initial={{ scale: 1, opacity: 1 }}
                              animate={{ scale: 1.18, opacity: 0 }}
                              transition={{ duration: 0.65, ease: 'easeOut' }}
                            />
                          )}
                          <TcgCardSetLabel>{card.set?.name ?? ''}</TcgCardSetLabel>
                        </TcgCardItem>
                      );
                    })}
                  </CardsGrid>
                </motion.div>
              )}
            </AnimatePresence>
          ) : setsLoading ? (
            <SetsGrid>
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonBox
                  key={i}
                  style={{ height: '8rem' }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.08 }}
                />
              ))}
            </SetsGrid>
          ) : (
            <SetsGrid>
              {filteredSets.map((set, i) => {
                const pct = getCompletionPct(set);
                return (
                  <SetCard
                    key={set.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.5) }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSet(set)}
                  >
                    {set.images?.logo ? (
                      <SetLogo src={set.images.logo} alt={set.name} loading='lazy' />
                    ) : (
                      <SetLogoFallback>
                        <IconPackage size={32} stroke={1} />
                      </SetLogoFallback>
                    )}
                    <SetInfo>
                      <SetName>{set.name}</SetName>
                      <SetMeta>{set.series} · {set.releaseDate}</SetMeta>
                    </SetInfo>
                    <SetFooter>
                      <CardCount>{set.total} cards</CardCount>
                      <CollectionBadge $pct={pct}>
                        {pct === 0 ? 'Not started' : pct === 100 ? 'Complete' : `${pct}%`}
                      </CollectionBadge>
                    </SetFooter>
                  </SetCard>
                );
              })}
            </SetsGrid>
          )}
        </SectionWrapper>
      </section>
    </Main>
  );
}
