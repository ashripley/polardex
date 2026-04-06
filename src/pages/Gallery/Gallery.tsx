import styled from 'styled-components';
import { useMemo, useState } from 'react';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import { Card, FilterBar, SkeletonCard, GalleryFilters, defaultFilters } from '../../components';
import { useGetAttributesQuery, useGetCardsQuery } from '../../api';

const Main = styled.main`
  background-color: ${({ theme }) => theme.color.surface.muted};
  min-height: 60dvh;
  transition: background-color 200ms ease;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[4]};
  width: 100%;
  align-items: start;
`;

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
`;

export function Gallery() {
  const { cards, loading } = useGetCardsQuery();
  const { attributes } = useGetAttributesQuery();
  const [filters, setFilters] = useState<GalleryFilters>(defaultFilters);

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

  return (
    <Main>
      <section>
        <SectionWrapper>
          <FilterBar
            filters={filters}
            onChange={setFilters}
            typeOptions={typeOptions}
            setOptions={setOptions}
            conditionOptions={conditionOptions}
            totalCount={cards.length}
            filteredCount={filteredCards.length}
          />
          <CardGrid>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filteredCards.length === 0 ? (
              <EmptyState style={{ gridColumn: '1 / -1' }}>
                <span>No cards match your filters.</span>
                <button
                  onClick={() => setFilters(defaultFilters)}
                  style={{
                    color: 'inherit',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Clear filters
                </button>
              </EmptyState>
            ) : (
              filteredCards.map((card) => (
                <Card
                  key={card.cardId}
                  pokemonData={{
                    name: card.pokemonData.name,
                    id: `#${card.pokemonData.id}`,
                    type: card.pokemonData.type,
                  }}
                  quantity={card.quantity}
                  attributes={{
                    cardType: card.attributes?.cardType,
                    condition: card.attributes?.condition,
                    grading: card.attributes?.grading,
                    set: card.attributes?.set,
                    year: attributes.find((att) => att.name === card.attributes.set)?.meta?.year,
                  }}
                  setNumber={`${card.setNumber}/${
                    attributes.find((att) => att.name === card.attributes.set)?.meta?.totalCards
                  }`}
                />
              ))
            )}
          </CardGrid>
        </SectionWrapper>
      </section>
    </Main>
  );
}
