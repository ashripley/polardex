import styled from 'styled-components';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hoverLiftLg, tapPressSoft, tapPress, tapPressFirm } from '../../theme/motion';
import { HeroCard, HeroStat, HeroStatValue, HeroStatLabel } from '../../components/HeroCard';
import { IconSearch, IconPlus, IconX, IconPencil, IconTrash, IconCheck } from '@tabler/icons-react';
import { toSpriteName } from '../../utils';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import { useGetCardsQuery } from '../../api';
import { removeCard, saveCard as restoreCard } from '../../api/mutations';
import { CardModel } from '../../api/fetch/card/cardModel';
import { useTcgArtLookup } from '../../api/tcg/useTcgArtLookup';
import { StudioModal } from './StudioModal';
import { useToast } from '../../providers/ToastProvider';

// ── Shell ─────────────────────────────────────────────────────────────────────

const Main = styled.main`
  background-color: ${({ theme }) => theme.color.surface.muted};
  min-height: 60dvh;
  transition: background-color 200ms cubic-bezier(0.22, 1, 0.36, 1);
`;

// ── Header ────────────────────────────────────────────────────────────────────

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => `${theme.space[6]} 0 ${theme.space[4]}`};
  flex-wrap: wrap;
`;

// ── Hero summary card — unified across viewports ────────────────────────────

// Studio summary uses HeroCard primitives — see components/HeroCard

const HorizontalStatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[5]};
  position: relative;
  z-index: 1;
  width: 100%;

  @media (min-width: calc(${({ theme }) => theme.breakpoint.mobile} + 1px)) {
    gap: ${({ theme }) => theme.space[8]};
  }
`;

const SummaryDivider = styled.div`
  width: 1px;
  height: 2.25rem;
  background: ${({ theme }) => theme.color.surface.border};
  margin: 0 ${({ theme }) => theme.space[2]};
  position: relative;
  z-index: 1;
`;

const MobileSelectIconBtn = styled(motion.button)<{ $active: boolean }>`
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1.5px solid ${({ $active, theme }) =>
    $active ? theme.color.aurora.red : theme.color.surface.border};
  background: ${({ $active, theme }) =>
    $active ? `${theme.color.aurora.red}18` : theme.color.surface.subtle};
  color: ${({ $active, theme }) =>
    $active ? theme.color.aurora.red : theme.color.text.secondary};
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  margin-left: auto;
  transition: all 180ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    display: flex;
  }
`;

/** Floating Action Button — primary "Add Card" CTA on mobile, sits above the bottom nav. */
const FAB = styled(motion.button)`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.space[2]};
    position: fixed;
    right: ${({ theme }) => theme.space[5]};
    bottom: calc(5rem + env(safe-area-inset-bottom, 0px));
    z-index: 80;
    height: 3.5rem;
    padding: 0 ${({ theme }) => theme.space[5]};
    border-radius: ${({ theme }) => theme.radius.full};
    border: none;
    background: linear-gradient(135deg,
      ${({ theme }) => theme.color.frost.teal} 0%,
      ${({ theme }) => theme.color.frost.blue} 100%);
    color: #fff;
    font-size: ${({ theme }) => theme.typography.size.sm};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    font-family: inherit;
    cursor: pointer;
    box-shadow:
      0 8px 24px ${({ theme }) => `${theme.color.frost.blue}55`},
      0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    -webkit-tap-highlight-color: transparent;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};

  /* Hidden on mobile — replaced by the FAB + select icon button */
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    display: none;
  }
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ theme }) => theme.color.frost.blue};
  color: #fff;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: inherit;
  cursor: pointer;
`;

const SelectButton = styled(motion.button)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1.5px solid ${({ $active, theme }) =>
    $active ? theme.color.aurora.red : theme.color.text.secondary};
  background: ${({ $active, theme }) =>
    $active ? `${theme.color.aurora.red}15` : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.color.aurora.red : theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: inherit;
  cursor: pointer;
  transition: border-color 150ms cubic-bezier(0.22, 1, 0.36, 1), background 150ms cubic-bezier(0.22, 1, 0.36, 1), color 150ms cubic-bezier(0.22, 1, 0.36, 1);
`;

// ── Delete bar ────────────────────────────────────────────────────────────────

const DeleteBar = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[4]}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => `${theme.color.aurora.red}12`};
  border: 1px solid ${({ theme }) => `${theme.color.aurora.red}30`};
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const DeleteBarText = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.aurora.red};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const DeleteBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const DeleteConfirmBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ theme }) => theme.color.aurora.red};
  color: #fff;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: inherit;
  cursor: pointer;
`;

const CancelSelectBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ theme }) => theme.color.surface.muted};
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: inherit;
  cursor: pointer;
`;

// ── Search ────────────────────────────────────────────────────────────────────

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const SearchIconWrap = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.color.text.secondary};
  display: flex;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 2.75rem;
  /* Padding is asymmetric — search icon on the left, conditional clear button
     on the right. The 2.25rem space leaves room for both at all viewports. */
  padding: 0 ${({ theme }) => theme.space[8]};
  box-sizing: border-box;
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background-color: ${({ theme }) => theme.color.surface.subtle};
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  outline: none;
  box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.surface.muted};
  transition: box-shadow 150ms cubic-bezier(0.22, 1, 0.36, 1), background-color 200ms cubic-bezier(0.22, 1, 0.36, 1);

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
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.color.text.secondary};
`;

// ── Cards grid ────────────────────────────────────────────────────────────────

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: ${({ theme }) => theme.space[3]};
  padding-bottom: ${({ theme }) => theme.space[10]};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
    gap: ${({ theme }) => theme.space[4]};
  }
`;

const CardItem = styled(motion.div)<{ $selected: boolean }>`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: ${({ theme }) => theme.color.surface.subtle};
  aspect-ratio: 2.5 / 3.5;
  cursor: pointer;
  box-shadow: ${({ $selected, theme }) =>
    $selected
      ? `0 0 0 2.5px ${theme.color.aurora.red}, 0 4px 16px rgba(0,0,0,0.2)`
      : '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.06)'};
  transition: box-shadow 150ms cubic-bezier(0.22, 1, 0.36, 1);
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const CardSprite = styled.img`
  width: 60%;
  height: 60%;
  object-fit: contain;
  opacity: 0.6;
`;

const CardFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.surface.muted};
  position: relative;
`;

const CardOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: ${({ theme }) => theme.space[2]};
  opacity: 0;
`;

const CardName = styled.p`
  color: #fff;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-transform: capitalize;
`;

const CardMeta = styled.p`
  color: rgba(255,255,255,0.6);
  font-size: ${({ theme }) => theme.typography.size.xs};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const EditBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.space[1]};
  right: ${({ theme }) => theme.space[1]};
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.22, 1, 0.36, 1);

  ${CardItem}:hover & {
    opacity: 1;
  }
`;

const SelectCheckbox = styled(motion.div)<{ $checked: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.space[1]};
  left: ${({ theme }) => theme.space[1]};
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 2px solid ${({ $checked, theme }) =>
    $checked ? theme.color.aurora.red : 'rgba(255,255,255,0.7)'};
  background: ${({ $checked, theme }) =>
    $checked ? theme.color.aurora.red : 'rgba(0,0,0,0.35)'};
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 3;
`;

// ── Empty states ──────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[16]};
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.md};
  gap: ${({ theme }) => theme.space[3]};
  text-align: center;
  grid-column: 1 / -1;
`;

const EmptySub = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0;
  opacity: 0.7;
`;

const AddFirstButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[5]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1.5px solid ${({ theme }) => theme.color.frost.blue};
  background: transparent;
  color: ${({ theme }) => theme.color.frost.blue};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: inherit;
  cursor: pointer;
  margin-top: ${({ theme }) => theme.space[2]};
`;

// ── Component ─────────────────────────────────────────────────────────────────

export function Studio() {
  const { cards, loading } = useGetCardsQuery();
  const cardNames = useMemo(() => cards.map((c) => c.pokemonData.name), [cards]);
  const { artMap } = useTcgArtLookup(cardNames, true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'add' | 'modify'>('add');
  const [preselectedCard, setPreselectedCard] = useState<CardModel | null>(null);

  // Select mode
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const filteredCards = useMemo(() => {
    if (!search.trim()) return cards;
    return cards.filter((c) =>
      c.pokemonData.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [cards, search]);

  // Studio summary stats for the mobile hero card
  const studioStats = useMemo(() => {
    const totalCount = cards.reduce((s, c) => s + (c.quantity ?? 1), 0);
    const setCount = new Set(cards.map((c) => c.attributes.set).filter(Boolean)).size;
    return { totalCount, setCount };
  }, [cards]);

  const openAdd = () => {
    setActionType('add');
    setPreselectedCard(null);
    setModalOpen(true);
  };

  const openModify = (card: CardModel) => {
    if (selectMode) return; // in select mode, clicking toggles selection
    setActionType('modify');
    setPreselectedCard(card);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setPreselectedCard(null);
  };

  const toggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setSelectedIds(new Set());
  };

  const toggleSelect = (cardId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  const { toast } = useToast();

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    setDeleting(true);
    const count = selectedIds.size;
    // Snapshot the full card records so we can restore them if the user hits undo.
    const snapshot = cards.filter((c) => selectedIds.has(c.cardId));
    try {
      await Promise.all([...selectedIds].map((id) => removeCard(id)));
      toast({
        message: `${count} card${count !== 1 ? 's' : ''} deleted`,
        tone: 'success',
        undo: async () => {
          await Promise.all(snapshot.map((c) => restoreCard(c)));
          toast({ message: 'Restored', tone: 'info' });
        },
      });
    } finally {
      setDeleting(false);
      setSelectedIds(new Set());
      setSelectMode(false);
    }
  };

  return (
    <Main>
      <section>
        <SectionWrapper>
          <PageHeader>
            <PageTitle>Studio</PageTitle>
            <HeaderActions>
              {cards.length > 0 && (
                <SelectButton
                  $active={selectMode}
                  onClick={toggleSelectMode}
                  whileHover={{ scale: 1.02 }}
                  whileTap={tapPress}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <IconTrash size={14} stroke={2} />
                  {selectMode ? 'Cancel' : 'Select'}
                </SelectButton>
              )}
              <AddButton
                onClick={openAdd}
                whileHover={{ scale: 1.03 }}
                whileTap={tapPress}
              >
                <IconPlus size={15} stroke={2.5} />
                Add Card
              </AddButton>
            </HeaderActions>
          </PageHeader>

          {cards.length > 0 && (
            <HeroCard accent='teal'>
              <HorizontalStatsRow>
                <HeroStat>
                  <HeroStatValue>{studioStats.totalCount}</HeroStatValue>
                  <HeroStatLabel>Cards</HeroStatLabel>
                </HeroStat>
                <SummaryDivider />
                <HeroStat>
                  <HeroStatValue>{studioStats.setCount}</HeroStatValue>
                  <HeroStatLabel>Sets</HeroStatLabel>
                </HeroStat>
                <MobileSelectIconBtn
                  $active={selectMode}
                  onClick={toggleSelectMode}
                  whileTap={tapPressFirm}
                  aria-label={selectMode ? 'Cancel selection' : 'Select cards'}
                  title={selectMode ? 'Cancel selection' : 'Select cards'}
                >
                  {selectMode ? <IconX size={16} stroke={2.2} /> : <IconTrash size={16} stroke={2} />}
                </MobileSelectIconBtn>
              </HorizontalStatsRow>
            </HeroCard>
          )}

          <SearchWrapper>
            <SearchIconWrap><IconSearch size={16} stroke={2} /></SearchIconWrap>
            <SearchInput
              placeholder='Search your collection...'
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

          {/* Delete bar */}
          <AnimatePresence>
            {selectMode && (
              <DeleteBar
                key='delete-bar'
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <DeleteBarText>
                  {selectedIds.size === 0
                    ? 'Tap cards to select'
                    : `${selectedIds.size} card${selectedIds.size !== 1 ? 's' : ''} selected`}
                </DeleteBarText>
                <DeleteBarActions>
                  <CancelSelectBtn
                    onClick={toggleSelectMode}
                    whileTap={tapPress}
                  >
                    Cancel
                  </CancelSelectBtn>
                  {selectedIds.size > 0 && (
                    <DeleteConfirmBtn
                      onClick={handleDeleteSelected}
                      whileHover={{ scale: 1.04 }}
                      whileTap={tapPress}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      style={{ opacity: deleting ? 0.6 : 1 }}
                    >
                      <IconTrash size={12} stroke={2} />
                      {deleting ? 'Deleting…' : `Delete ${selectedIds.size}`}
                    </DeleteConfirmBtn>
                  )}
                </DeleteBarActions>
              </DeleteBar>
            )}
          </AnimatePresence>

          {!loading && (
            <CardGrid>
              {cards.length === 0 ? (
                <EmptyState>
                  <span>Your collection is empty.</span>
                  <EmptySub>Add your first card to get started.</EmptySub>
                  <AddFirstButton
                    onClick={openAdd}
                    whileHover={{ scale: 1.03 }}
                    whileTap={tapPress}
                  >
                    <IconPlus size={14} stroke={2.5} />
                    Add your first card
                  </AddFirstButton>
                </EmptyState>
              ) : filteredCards.length === 0 ? (
                <EmptyState>
                  <span>No cards match "{search}".</span>
                  <AddFirstButton
                    onClick={openAdd}
                    whileHover={{ scale: 1.03 }}
                    whileTap={tapPress}
                  >
                    <IconPlus size={14} stroke={2.5} />
                    Add "{search}" to your collection
                  </AddFirstButton>
                </EmptyState>
              ) : (
                filteredCards.map((card, i) => {
                  const tcgArt = card.attributes.tcgImageUrl
                    || artMap[card.pokemonData.name.toLowerCase()]
                    || null;
                  const spriteUrl = `https://img.pokemondb.net/sprites/home/normal/${toSpriteName(card.pokemonData.name)}.png`;
                  const isSelected = selectedIds.has(card.cardId);

                  return (
                    <CardItem
                      key={card.cardId}
                      $selected={isSelected}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(i * 0.025, 0.4) }}
                      // Hover lift is unconditional — toggling whileHover targets
                      // mid-interaction (when selectMode flips) causes a visual snap.
                      whileHover={hoverLiftLg}
                      whileTap={tapPressSoft}
                      onClick={() => selectMode ? toggleSelect(card.cardId) : openModify(card)}
                    >
                      {tcgArt ? (
                        <CardImg src={tcgArt} alt={card.pokemonData.name} loading='lazy' />
                      ) : (
                        <CardFallback>
                          <CardSprite src={spriteUrl} alt={card.pokemonData.name} loading='lazy' />
                          <CardOverlay style={{ opacity: 1 }}>
                            <CardName>{card.pokemonData.name}</CardName>
                            {card.attributes.set && <CardMeta>{card.attributes.set}</CardMeta>}
                          </CardOverlay>
                        </CardFallback>
                      )}

                      {tcgArt && !selectMode && (
                        <CardOverlay
                          initial={false}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <CardName>{card.pokemonData.name}</CardName>
                          {card.attributes.set && <CardMeta>{card.attributes.set}</CardMeta>}
                        </CardOverlay>
                      )}

                      {/* Edit badge - shown on hover, hidden in select mode */}
                      {!selectMode && (
                        <EditBadge>
                          <IconPencil size={11} stroke={2} />
                        </EditBadge>
                      )}

                      {/* Select checkbox - shown in select mode */}
                      {selectMode && (
                        <SelectCheckbox
                          $checked={isSelected}
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.7, opacity: 0 }}
                          transition={{ duration: 0.12 }}
                        >
                          {isSelected && <IconCheck size={10} stroke={3} />}
                        </SelectCheckbox>
                      )}
                    </CardItem>
                  );
                })
              )}
            </CardGrid>
          )}
        </SectionWrapper>
      </section>

      {/* Floating Action Button — mobile only */}
      {!modalOpen && cards.length > 0 && !selectMode && (
        <FAB
          onClick={openAdd}
          aria-label='Add a new card'
          initial={{ opacity: 0, y: 24, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.85 }}
          whileTap={tapPressFirm}
          transition={{ type: 'spring', stiffness: 360, damping: 26 }}
        >
          <IconPlus size={20} stroke={2.5} />
          Add Card
        </FAB>
      )}

      <StudioModal
        isOpen={modalOpen}
        onClose={closeModal}
        actionType={actionType}
        preselectedCard={preselectedCard}
      />

    </Main>
  );
}
