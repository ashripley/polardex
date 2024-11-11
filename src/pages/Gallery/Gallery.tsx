import styled, { useTheme } from 'styled-components';
import {
  IconArrowsSort,
  IconFilter,
  IconResize,
  IconSearch,
} from '@tabler/icons-react';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import { Card, SearchField } from '../../components';

const Main = styled.main`
  background-color: ${({ theme }) => theme.bgColor.bg3};
  box-sizing: inherit;
`;

const FilterRow = styled.section`
  position: relative;
  background-color: ${({ theme }) => theme.bgColor.bg3};
`;

const Filters = styled(SectionWrapper)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.2em;
  padding-top: 2em;
  padding-bottom: 2em;
`;

const Content = styled.section``;

const CommonIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3em;
  border-radius: 0.5em;
  transition: background-color ease-in-out 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.textColor.t2Hover};
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SearchFieldContainer = styled(CommonIcon)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Search = styled(CommonIcon)``;

const SortBy = styled(CommonIcon)``;

const FilterBy = styled(CommonIcon)``;

const Resize = styled(CommonIcon)``;

const StyledSearchField = styled(SearchField)`
  border-radius: 0.5em;
  border: none;
  padding: 0.5em;
  width: 300px;
  border: 0.8px rgb(76, 86, 106) solid;
  display: flex;
  align-items: center;
  height: 100%;
`;

const CardContainer = styled.div`
  background-color: ${({ theme }) => theme.bgColor.bg2};
  display: flex;
  flex-grow: 1;
  padding: 1em;
  border-radius: 1.5em;
  flex-wrap: wrap;
  gap: 1em;
  justify-content: space-evenly;
`;

export function Gallery() {
  const theme = useTheme();

  return (
    <Main>
      <FilterRow>
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
              <Resize>
                <IconResize stroke={1.5} color={theme.textColor.t1} />
              </Resize>
            </Filters>
          </Wrapper>
        </SectionWrapper>
      </FilterRow>
      <Content>
        <SectionWrapper>
          <CardContainer>
            <Card
              bg={theme.miscColor.a1}
              display
              imageUrl='https://img.pokemondb.net/sprites/home/normal/charizard.png'
              title='Charizard'
            />
            <Card
              bg={theme.miscColor.a1}
              display
              imageUrl='https://img.pokemondb.net/sprites/home/normal/charizard.png'
              title='Charizard'
            />
            <Card
              bg={theme.miscColor.a1}
              display
              imageUrl='https://img.pokemondb.net/sprites/home/normal/charizard.png'
              title='Charizard'
            />
            <Card
              bg={theme.miscColor.a1}
              display
              imageUrl='https://img.pokemondb.net/sprites/home/normal/charizard.png'
              title='Charizard'
            />
          </CardContainer>
        </SectionWrapper>
      </Content>
    </Main>
  );
}
