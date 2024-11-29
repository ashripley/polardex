import styled, { css, keyframes, useTheme } from 'styled-components';
import {
  IconArrowsSort,
  IconFilter,
  IconResize,
  IconSearch,
  IconSelector,
} from '@tabler/icons-react';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import { SearchField } from '../../components';
import { useState } from 'react';

const a9bdap5 = keyframes`
  0% {
    transform: translateY(100px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

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
  display: flex;
  flex-grow: 1;
  padding: 1em;
  border-radius: 1.5em;
  flex-wrap: wrap;
  gap: 1em;
  justify-content: space-evenly;
`;

const ExperimentalCard = styled.div<{ expanded: boolean }>`
  flex: 1 1;
  min-width: 15rem;
  max-width: ${({ expanded }) => (expanded ? '30rem' : '18rem')};
  margin-inline: auto;
  container-type: inline-size;
  transition: all ease-in-out 0.5s;
`;

const ExperimentalCardContainer = styled.div`
  border-radius: 8px;
  background: ${({ theme }) => theme.bgColor.bg1};
  position: relative;
  display: grid;
  grid-template-areas:
    'avatar'
    'name'
    'base';
  justify-items: center;
  padding: 1rem;
  grid-gap: 1rem;
  gap: 1rem;
  filter: drop-shadow(0 0px 0px hsl(0deg 0% 0% / 0.1))
    drop-shadow(0 0px 1px hsl(0deg 0% 0% / 0.1));
  transition: all ease-in-out 0.5s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 130px;
    border-radius: 0.5rem 0.5rem 0 0;
    background: ${({ theme }) => theme.bgColor.bg3};
  }

  @container (min-width: 20rem) {
    display: grid;
    grid-template-columns: 125px 1fr;
    grid-template-areas:
      'avatar name base'
      'stat stat stat';
  }
`;

const ImageContainer = styled.div`
  grid-area: avatar;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.bgColor.bg1};
  overflow: visible;
  border: 3px solid ${({ theme }) => theme.bgColor.bg3};
  /* outline: 6px solid #fff; */

  @container (min-width: 20rem) {
    outline: 6px solid ${({ theme }) => theme.bgColor.bg3};
    transform: translateY(-24px);
  }
`;

const TitleContainer = styled.p`
  grid-area: name;
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: center;
  min-width: 0;

  @container (min-width: 20rem) {
    width: 100%;
    align-items: flex-start;
    padding-top: 0.75rem;
    text-align: left;
    margin-left: 0.5rem;
  }
`;

const Name = styled.span`
  display: block;
  font-size: 1.125rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor.t1};

  @container (min-width: 20rem) {
    font-size: 1.25rem;
  }
`;

const Type = styled.span`
  display: block;
  color: ${({ theme }) => theme.textColor.t1};
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

const BaseUl = styled.ul<{ expanded: boolean }>`
  grid-area: base;
  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: ${({ expanded }) =>
    expanded ? 'flex-start' : 'center'}; /* Align based on expanded state */
  font-weight: 700;
  gap: ${({ expanded }) =>
    expanded ? '3rem' : '1rem'}; /* Increase gap when expanded */
  padding: 0;
  color: ${({ theme }) => theme.textColor.t1};
  min-width: 0;
  width: 100%;
  margin-top: ${({ expanded }) =>
    expanded ? '0.2rem' : '1rem'}; /* Adjust margin-top */
  transition: all 0.5s ease-in-out; /* Transition all properties smoothly */

  /* Adjust font-weight and opacity of list items */
  & > li {
    font-weight: ${({ expanded }) =>
      expanded ? '400' : '700'}; /* Lighter font weight when expanded */
    opacity: ${({ expanded }) =>
      expanded ? 1 : 0.7}; /* Fade out list items when collapsed */
    transition: all 0.5s ease-in-out; /* Transition for each list item */
  }
`;

const StatUl = styled(BaseUl)<{ expanded: boolean }>`
  grid-area: stat;
  grid-template-columns: auto auto;
  gap: 1rem;
  justify-content: flex-start;
  font-weight: 500;
  margin-top: 0;

  /* Use absolute position when collapsed to remove it from the layout */
  position: ${({ expanded }) => (expanded ? 'relative' : 'absolute')};
  top: ${({ expanded }) => (expanded ? 'auto' : '0')};
  left: ${({ expanded }) => (expanded ? 'auto' : '0')};
  right: ${({ expanded }) => (expanded ? 'auto' : '0')};
  z-index: ${({ expanded }) =>
    expanded ? '1' : '-1'}; /* Ensure it’s under other content when collapsed */

  /* Transform and opacity for animation */
  transform: ${({ expanded }) =>
    expanded ? 'scale(1)' : 'scale(0.95)'}; /* Optional scale animation */
  opacity: ${({ expanded }) => (expanded ? 1 : 0)}; /* Fade in/out */

  /* Ensures it doesn't take space when collapsed */
  visibility: ${({ expanded }) =>
    expanded
      ? 'visible'
      : 'hidden'}; /* Optional: Hide interaction when collapsed */

  /* Transition properties */
  transition: transform 0.3s ease, opacity 0.3s ease, visibility 0s 0.3s; /* visibility delay to ensure smooth hiding */

  /* Optional: transition for height (to control collapsing effect) */
  height: ${({ expanded }) => (expanded ? 'auto' : '0')};
  overflow: hidden; /* Ensures it doesn't spill over */
`;

const LI = styled.li`
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 1rem;
  color: ${({ theme }) => theme.textColor.t1};
`;

const StyledImage = styled.img`
  padding: 0.8rem;
  display: block;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  animation: ${a9bdap5} 0.8s cubic-bezier(0.17, 0.67, 0.51, 0.99),
    ${fadeIn} 0.4s;
`;

const DuplicateIdentifer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.textColor.t2};
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  top: 0;
  right: 0;
  margin: 0.5rem;
  position: absolute;
  z-index: 5;
`;

const IdentifierText = styled.span`
  color: ${({ theme }) => theme.bgColor.bg3};
  display: block;
  font-size: 0.8rem;
`;

const ResizeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  padding: 0.5rem;
  top: 0;
  right: 0;
  margin: 0.5rem;
  position: absolute;
  z-index: 5;

  &:hover {
    background-color: ${({ theme }) => theme.textColor.t2Hover};
    cursor: pointer;
  }
`;

const ResizeIcon = styled(IconSelector)`
  width: 1.5rem;
  height: 1.5rem;
  transform: rotate(45deg);
  stroke: ${({ theme }) => theme.textColor.t1};
  stroke-width: 1.5;
`;

export function Gallery() {
  const [expanded, setExpanded] = useState<boolean>(false);

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
            <ExperimentalCard expanded={expanded}>
              <ExperimentalCardContainer>
                <ResizeContainer onClick={() => setExpanded(!expanded)}>
                  <ResizeIcon />
                </ResizeContainer>
                <ImageContainer>
                  <StyledImage
                    className='a9bdap5'
                    src='https://img.pokemondb.net/sprites/home/normal/charizard.png'
                  />
                  <DuplicateIdentifer>
                    <IdentifierText>2</IdentifierText>
                  </DuplicateIdentifer>
                </ImageContainer>
                <TitleContainer>
                  <Name>Charizard</Name>
                  <Type>Fire</Type>
                  <BaseUl expanded={expanded}>
                    <LI>#009</LI>
                    <LI>1999</LI>
                    <LI>02/102</LI>
                  </BaseUl>
                </TitleContainer>
                <StatUl expanded={expanded}>
                  <LI>Set: Fossil</LI>
                  <LI>Type: Holo</LI>
                  <LI>Condition: Excellent</LI>
                  <LI>Grading: 6</LI>
                </StatUl>
              </ExperimentalCardContainer>
            </ExperimentalCard>
            {/* <ExperimentalCard expanded={expanded}>
              <ExperimentalCardContainer>
                <ImageContainer>
                  <StyledImage
                    className='a9bdap5'
                    src='https://img.pokemondb.net/sprites/home/normal/blastoise.png'
                  />
                  <DuplicateIdentifer>
                    <IdentifierText>5</IdentifierText>
                  </DuplicateIdentifer>
                </ImageContainer>
                <TitleContainer>
                  <Name>Blastoise</Name>
                  <Type>Water</Type>
                </TitleContainer>
                <UL>
                  <LI>Shadowless</LI>
                  <LI>5</LI>
                  <LI>5</LI>
                  <LI>5</LI>
                </UL>
              </ExperimentalCardContainer>
            </ExperimentalCard>
            <ExperimentalCard expanded={expanded}>
              <ExperimentalCardContainer>
                <ImageContainer>
                  <StyledImage
                    className='a9bdap5'
                    src='https://img.pokemondb.net/sprites/home/normal/mewtwo.png'
                  />
                </ImageContainer>
                <TitleContainer>
                  <Name>Mewtwo</Name>
                  <Type>Psychic</Type>
                </TitleContainer>
                <UL>
                  <LI>Shadowless</LI>
                  <LI>5</LI>
                  <LI>5</LI>
                  <LI>5</LI>
                </UL>
              </ExperimentalCardContainer>
            </ExperimentalCard>
            <ExperimentalCard expanded={expanded}>
              <ExperimentalCardContainer>
                <ImageContainer>
                  <StyledImage
                    className='a9bdap5'
                    src='https://img.pokemondb.net/sprites/home/normal/lapras.png'
                  />
                  <DuplicateIdentifer>
                    <IdentifierText>2</IdentifierText>
                  </DuplicateIdentifer>
                </ImageContainer>
                <TitleContainer>
                  <Name>Lapras</Name>
                  <Type>Water</Type>
                </TitleContainer>
                <UL>
                  <LI>Shadowless</LI>
                  <LI>5</LI>
                  <LI>5</LI>
                  <LI>5</LI>
                </UL>
              </ExperimentalCardContainer>
            </ExperimentalCard> */}
          </CardContainer>
        </SectionWrapper>
      </Content>
    </Main>
  );
}
