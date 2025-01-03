import styled from 'styled-components';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import { Card, fadeStyles, LoadingSpinner } from '../../components';
import { useGetAttributesQuery, useGetCardsQuery } from '../../api';
import { useEffect, useState } from 'react';

const Main = styled.main`
  background-color: ${({ theme }) => theme.bgColor.bg3};
  box-sizing: inherit;
`;

const CardContainer = styled.div<{ loading: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1rem;
  width: 100%;

  ${({ loading }) => fadeStyles(loading, 'flex')}
`;

export function Gallery() {
  const [loading, setLoading] = useState<boolean>(true);
  const { cards } = useGetCardsQuery();
  const { attributes } = useGetAttributesQuery();

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  return (
    <Main>
      <section>
        <SectionWrapper>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <CardContainer loading={!loading}>
                {cards.map((card) => (
                  <Card
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
                      year: attributes.find(
                        (att) => att.name === card.attributes.set
                      )?.meta?.year,
                    }}
                    setNumber={`${card.setNumber}/${
                      attributes.find((att) => att.name === card.attributes.set)
                        ?.meta?.totalCards
                    }`}
                  />
                ))}
              </CardContainer>
            </>
          )}
        </SectionWrapper>
      </section>
    </Main>
  );
}
