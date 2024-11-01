import styled, { useTheme } from 'styled-components';
import {
  IconArrowsSort,
  IconFilter,
  IconResize,
  IconSearch,
} from '@tabler/icons-react';
import { SectionWrapper } from '../Home/sections/sectionStyles';

const Main = styled.main`
  background-color: ${({ theme }) => theme.bgColor.bg3};
  box-sizing: inherit;
`;

const FilterRow = styled.section`
  position: relative;
  display: flex;
  flex-grow: 1;
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

const Container = styled.div``;

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

const Search = styled(CommonIcon)``;

const SortBy = styled(CommonIcon)``;

const FilterBy = styled(CommonIcon)``;

const Resize = styled(CommonIcon)``;

export function Gallery() {
  const theme = useTheme();

  return (
    <Main>
      <FilterRow>
        <Filters>
          <Search>
            <IconSearch stroke={1.5} color={theme.textColor.t1} />
          </Search>
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
      </FilterRow>
      <Container></Container>
    </Main>
  );
}
