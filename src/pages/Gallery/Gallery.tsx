import styled from 'styled-components';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import { Card } from '../../components';

const Main = styled.main`
  background-color: ${({ theme }) => theme.bgColor.bg3};
  box-sizing: inherit;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1rem;
  width: 100%;
`;

// const FilterRow = styled.section`
//   position: relative;
//   background-color: ${({ theme }) => theme.bgColor.bg3};
// `;

// const Filters = styled(SectionWrapper)`
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
//   gap: 0.2em;
//   padding-top: 2em;
//   padding-bottom: 2em;
// `;

const Content = styled.section``;

// const CommonIcon = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 0.3em;
//   border-radius: 0.5em;
//   transition: background-color ease-in-out 0.3s;

//   &:hover {
//     background-color: ${({ theme }) => theme.textColor.t2Hover};
//     cursor: pointer;
//   }
// `;

// const Wrapper = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
// `;

// const SearchFieldContainer = styled(CommonIcon)`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100%;
// `;

// const Search = styled(CommonIcon)``;

// const SortBy = styled(CommonIcon)``;

// const FilterBy = styled(CommonIcon)``;

// const Resize = styled(CommonIcon)``;

// const StyledSearchField = styled(SearchField)`
//   border-radius: 0.5em;
//   border: none;
//   padding: 0.5em;
//   width: 300px;
//   border: 0.8px rgb(76, 86, 106) solid;
//   display: flex;
//   align-items: center;
//   height: 100%;
// `;

export function Gallery() {
  return (
    <Main>
      {/* <FilterRow>
        <SectionWrapper>
          <Wrapper>
            <SearchFieldContainer>
              <StyledSearchField
                active={false}
                onClear={() => {}}
                onSubmit={() => {}}
              />
              <Search>
                <IconSearch stroke={1.5} color={theme.textColor.t1} />
              </Search>
            </SearchFieldContainer>
            <Filters>
              <SortBy>
                <IconArrowsSort stroke={1.5} color={theme.textColor.t1} />
              </SortBy>
              <FilterBy>
                <IconFilter stroke={1.5} color={theme.textColor.t1} />
              </FilterBy>
            </Filters>
          </Wrapper>
        </SectionWrapper>
      </FilterRow> */}
      <Content>
        <SectionWrapper>
          <CardContainer>
            <Card
              pokemonData={{
                name: 'Charizard',
                id: '#002',
                type: 'fire',
              }}
              quantity={2}
              attributes={{
                cardType: 'Holo',
                condition: 'Excellent',
                grading: 8,
                set: 'Fossil',
                year: 2000,
              }}
              setNumber={'20/103'}
            />
            <Card
              pokemonData={{
                name: 'Blastoise',
                id: '#004',
                type: 'water',
              }}
              attributes={{
                cardType: 'Holo',
                condition: 'Excellent',
                grading: 8,
                set: 'Team Rocket',
                year: 2000,
              }}
              setNumber={'1/103'}
            />
            {/*<Card
              pokemonData={{
                name: 'Venusaur',
                id: '#001',
                type: 'grass',
              }}
              quantity={12}
              attributes={{
                cardType: 'Holo',
                condition: 'Excellent',
                grading: 2,
                set: 'Base Set',
                year: 1999,
              }}
              setNumber={'20/103'}
            /> */}
          </CardContainer>
        </SectionWrapper>
      </Content>
    </Main>
  );
}
