import styled, { useTheme } from 'styled-components';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconSearch, IconPlus, IconX, IconPencil, IconTrash, IconCheck } from '@tabler/icons-react';
import { toSpriteName } from '../../utils';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import { useGetCardsQuery } from '../../api';
import { removeCard } from '../../api/mutations';
import { CardModel } from '../../api/fetch/card/cardModel';
import { useTcgArtLookup } from '../../api/tcg/useTcgArtLookup';
import { StudioModal } from './StudioModal';

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
  padding: 0 ${({ theme }) => theme.space[10]};
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
  font-size: 0.72rem;
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
  const theme = useTheme();
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
  const [deleteToast, setDeleteToast] = useState<string | null>(null);

  const filteredCards = useMemo(() => {
    if (!search.trim()) return cards;
    return cards.filter((c) =>
      c.pokemonData.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [cards, search]);

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

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    setDeleting(true);
    const count = selectedIds.size;
    try {
      await Promise.all([...selectedIds].map((id) => removeCard(id)));
      setDeleteToast(`${count} card${count !== 1 ? 's' : ''} deleted`);
      setTimeout(() => setDeleteToast(null), 3000);
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
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <IconTrash size={14} stroke={2} />
                  {selectMode ? 'Cancel' : 'Select'}
                </SelectButton>
              )}
              <AddButton
                onClick={openAdd}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <IconPlus size={15} stroke={2.5} />
                Add Card
              </AddButton>
            </HeaderActions>
          </PageHeader>

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
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </CancelSelectBtn>
                  {selectedIds.size > 0 && (
                    <DeleteConfirmBtn
                      onClick={handleDeleteSelected}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
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
                    whileTap={{ scale: 0.97 }}
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
                    whileTap={{ scale: 0.97 }}
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
                      whileHover={selectMode ? {} : { y: -4, scale: 1.02 }}
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

      <StudioModal
        isOpen={modalOpen}
        onClose={closeModal}
        actionType={actionType}
        preselectedCard={preselectedCard}
      />

      <AnimatePresence>
        {deleteToast && (
          <motion.div
            key='delete-toast'
            initial={{ opacity: 0, y: 16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 16, x: '-50%' }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 1.25rem',
              background: theme.color.surface.base,
              border: `1.5px solid ${theme.color.surface.border}`,
              borderRadius: '999px',
              boxShadow: theme.shadow.lg,
              fontSize: '0.875rem',
              fontWeight: 500,
              color: theme.color.text.secondary,
              zIndex: 9999,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            <IconTrash size={14} stroke={2} />
            {deleteToast}
          </motion.div>
        )}
      </AnimatePresence>
    </Main>
  );
}
