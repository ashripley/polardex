import styled from 'styled-components';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import {
  Card,
  fadeStyles,
  LoadingSpinner,
  PrimaryButton,
} from '../../components';
import { useGetAttributesQuery, useGetCardsQuery } from '../../api';
import { forwardRef, RefObject, useEffect, useRef, useState } from 'react';
import { IconAdjustmentsAlt } from '@tabler/icons-react';

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

const Content = styled.section``;

const Filters = styled.div`
  display: flex;
  justify-content: center;
  position: sticky;
  bottom: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 5rem;
  margin-inline: auto;
`;

const StyledPrimaryButton = styled(PrimaryButton)`
  width: 2rem;
  height: 2rem;
`;

export function Gallery() {
  const [loading, setLoading] = useState<boolean>(true);
  const [filtersMenuOpen, setFiltersMenuOpen] = useState<boolean>(false);
  const { cards } = useGetCardsQuery();
  const { attributes } = useGetAttributesQuery();

  const filtersRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  const onFiltersClick = () => {
    setFiltersMenuOpen((prev) => !prev);
  };

  return (
    <Main>
      <Content>
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
              <Filters ref={filtersRef}>
                <StyledPrimaryButton
                  buttonType='primary'
                  onClick={onFiltersClick}
                >
                  <IconAdjustmentsAlt />
                  <FiltersMenu
                    isOpen={filtersMenuOpen}
                    filtersRef={filtersRef}
                  />
                </StyledPrimaryButton>
              </Filters>
            </>
          )}
        </SectionWrapper>
      </Content>
    </Main>
  );
}

interface FiltersMenuProps {
  isOpen: boolean;
  filtersRef: RefObject<HTMLDivElement>;
}

const FiltersContainer = styled.div<{ isOpen: boolean }>`
  width: 15rem;
  height: 10rem;
  transform: translateY(-75%);
  background-color: ${({ theme }) => theme.bgColor.bg1};
  position: absolute;
  border-radius: 0.5rem;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

  ${({ isOpen }) => fadeStyles(isOpen)};
`;

const FiltersMenu = forwardRef<HTMLDivElement, FiltersMenuProps>(
  (props, filtersRef) => {
    const { isOpen } = props;

    return (
      <FiltersContainer ref={filtersRef} isOpen={isOpen}>
        <ul>
          <li>Name</li>
          <li>Id</li>
          <li>Type</li>
        </ul>
      </FiltersContainer>
    );
  }
);
