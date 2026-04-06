import styled from 'styled-components';
import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { IconChevronLeft, IconChevronRight, IconPhotoScan, IconX } from '@tabler/icons-react';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import { FilterBar, SkeletonCard, GalleryFilters, defaultFilters } from '../../components';
import { useGetCardsQuery } from '../../api';
import { useTcgArtLookup } from '../../api/tcg/useTcgArtLookup';
import { CardModel } from '../../api/fetch/card/cardModel';

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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[4]};
  width: 100%;
  align-items: start;
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
  border: 1.5px solid ${({ $disabled, theme }) =>
    $disabled ? theme.color.surface.border : theme.color.surface.border};
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

// ── Tilt card wrapper ─────────────────────────────────────────────────────────

function TiltArtCard({ card, imgUrl, artLoading, onClick }: {
  card: CardModel;
  imgUrl: string | null;
  artLoading: boolean;
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

  return (
    <ArtCardItem
      ref={ref}
      layoutId={`card-art-${card.cardId}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformPerspective: 600, rotateX, rotateY }}
      whileHover={{ boxShadow: '0 20px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.12)' }}
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
      {(card.quantity ?? 1) > 1 && (
        <QtyBadge>x{card.quantity}</QtyBadge>
      )}
    </ArtCardItem>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Gallery() {
  const { cards, loading } = useGetCardsQuery();
  const [filters, setFilters] = useState<GalleryFilters>(defaultFilters);
  const [selected, setSelected] = useState<CardModel | null>(null);

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

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const search = filters.search.toLowerCase();
      if (search && !card.pokemonData.name.toLowerCase().includes(search)) return false;
      if (filters.type && card.pokemonData.type !== filters.type) return false;
      if (filters.set && card.attributes.set !== filters.set) return false;
      if (filters.condition && card.attributes.condition !== filters.condition) return false;
      return true;
    });
  }, [cards, filters]);

  const cardNames = useMemo(
    () => filteredCards.map((c) => c.pokemonData.name),
    [filteredCards]
  );
  const { artMap, loading: artLoading } = useTcgArtLookup(cardNames, true);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const PAGE_SIZE = 48;
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / PAGE_SIZE));
  const pagedCards = useMemo(
    () => filteredCards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredCards, page, PAGE_SIZE]
  );

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

  return (
    <Main>
      <section>
        <SectionWrapper>
          <PageHeader>
            <PageTitle>Collection</PageTitle>
            <PageSubtitle>Browse and filter your Pokémon card library.</PageSubtitle>
          </PageHeader>

          <FilterBar
            filters={filters}
            onChange={setFilters}
            typeOptions={typeOptions}
            setOptions={setOptions}
            conditionOptions={conditionOptions}
            totalCount={cards.length}
            filteredCount={filteredCards.length}
          />

          <AnimatePresence mode='wait'>
            {loading ? (
              <CardGrid key='skeleton'>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </CardGrid>
            ) : cards.length === 0 ? (
              <CardGrid key='no-cards'>
                <EmptyState>
                  <span>Your collection is empty.</span>
                  <span style={{ fontSize: '0.9em', opacity: 0.7 }}>
                    Head to Studio to add your first card.
                  </span>
                </EmptyState>
              </CardGrid>
            ) : filteredCards.length === 0 ? (
              <CardGrid key='empty'>
                <EmptyState>
                  <span>No cards match your filters.</span>
                  <ClearLink onClick={() => setFilters(defaultFilters)}>
                    Clear filters
                  </ClearLink>
                </EmptyState>
              </CardGrid>
            ) : (
              <motion.div
                key={`art-page-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ArtGrid>
                  {pagedCards.map((card, i) => {
                    const imgUrl = getImgUrl(card);

                    return (
                      <motion.div
                        key={card.cardId}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(i * 0.025, 0.5) }}
                      >
                        <TiltArtCard
                          card={card}
                          imgUrl={imgUrl}
                          artLoading={artLoading}
                          onClick={() => setSelected(card)}
                        />
                      </motion.div>
                    );
                  })}
                </ArtGrid>
                {totalPages > 1 && (
                  <PaginationBar>
                    <PageButton
                      className='icon-arr-l'
                      $disabled={page === 1}
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-label='Previous page'
                    >
                      <IconChevronLeft size={14} stroke={2} />
                    </PageButton>
                    <PageLabel>Page {page} of {totalPages}</PageLabel>
                    <PageButton
                      className='icon-arr-r'
                      $disabled={page === totalPages}
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (() => {
          const imgUrl = getImgUrl(selected);
          const tags = [
            selected.attributes.set,
            selected.attributes.condition,
            selected.pokemonData.type,
            selected.attributes.grading ? `Grade ${selected.attributes.grading}` : undefined,
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
