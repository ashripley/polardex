import { IconSelector } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { CardModel } from './cardModel';
import { fadeStyles } from '../animation';

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 1em;
  border-radius: 1.5em;
  flex-wrap: wrap;
  justify-content: space-evenly;
  height: auto;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 250px;
  margin-inline: auto;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.bgColor.bg1};
  position: relative;
  justify-items: center;
  padding: 1rem;
  filter: drop-shadow(0 0px 0px hsl(0deg 0% 0% / 0.1))
    drop-shadow(0 0px 1px hsl(0deg 0% 0% / 0.1));
  transition: all ease-in-out 0.3s;

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
`;

const ImageContainer = styled.div<{ expanded: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.bgColor.bg1};
  overflow: visible;
  justify-content: flex-end;
  border: 3px solid ${({ theme }) => theme.bgColor.bg3};
  margin-inline: auto;

  ${({ expanded }) =>
    expanded &&
    css`
      outline: 6px solid ${({ theme }) => theme.bgColor.bg3};
      transform: translateY(-24px);
      z-index: 2;
    `}
`;

const TitleContainer = styled.p`
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 0.5rem 0;
`;

const Name = styled.span`
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  text-transform: capitalize;
  color: ${({ theme }) => theme.textColor.t1};
`;

const Type = styled.span`
  display: block;
  color: ${({ theme }) => theme.textColor.t1};
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: capitalize;
  max-width: 100%;
`;

const BaseUl = styled.ul<{ expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-weight: 700;
  gap: ${({ expanded }) => (expanded ? '3rem' : '1rem')};
  padding: 0;
  color: ${({ theme }) => theme.textColor.t1};
  min-width: 0;
  width: 100%;
  margin-top: ${({ expanded }) => (expanded ? '0.2rem' : '1rem')};
  transition: all 0.3s ease-in-out;

  & > li {
    font-weight: ${({ expanded }) => (expanded ? '400' : '700')};
    opacity: ${({ expanded }) => (expanded ? 1 : 0.7)};
    transition: all 0.3s ease-in-out;
  }
`;

const StatUl = styled.ul<{ expanded: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  justify-content: flex-start;
  font-weight: 500;
  transition: height 0.3s ease-in-out;
  height: ${({ expanded }) => (expanded ? '10rem' : 0)};
  overflow: hidden;
  flex-flow: column;
  place-items: start;
  place-items: center;
  padding: 0;
  border-top: ${({ expanded, theme }) =>
    expanded ? `2px solid ${theme.bgColor.bg3}` : 'none'};

  /* ${({ expanded }) => fadeStyles(expanded, 'grid')} */
`;

const List = styled.li`
  display: flex;
  flex-flow: column;
  align-items: center;
  font-size: 1rem;
  padding: 0.5rem;
  color: ${({ theme }) => theme.textColor.t1};
`;

const StyledImage = styled.img<{ isOpen: boolean }>`
  padding: 0.8rem;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  ${({ isOpen }) => fadeStyles(isOpen)};
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
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`;

const IdentifierText = styled.span`
  color: ${({ theme }) => theme.bgColor.bg3};
  display: block;
  font-size: 0.9rem;
`;

const ResizeContainer = styled.div<{ expanded: boolean }>`
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
  transition: all ease-in-out 0.3s;

  ${({ expanded, theme }) =>
    expanded &&
    css`
      background-color: ${theme.textColor.t2Hover};
    `};

  &:hover {
    background-color: ${({ theme }) => theme.textColor.t2Hover};
    cursor: pointer;
  }
`;

const ResizeIcon = styled(IconSelector)`
  width: 1.5rem;
  height: 1.5rem;
  stroke: ${({ theme }) => theme.textColor.t1};
  stroke-width: 1.5;
`;

const Label = styled(Type)`
  font-size: 1rem;
  opacity: 0.7;
`;

const Attribute = styled(Type)`
  font-size: 1rem;
`;

export function Card(props: Partial<CardModel>) {
  const { pokemonData, attributes, setNumber, quantity } = props;
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);

    return () => {
      setIsLoaded(false);
    };
  }, []);

  return (
    <Container>
      <Wrapper>
        <InnerWrapper>
          <ResizeContainer
            onClick={() => setExpanded(!expanded)}
            expanded={expanded}
          >
            <ResizeIcon />
          </ResizeContainer>
          <ImageContainer expanded={false}>
            <StyledImage
              isOpen={isLoaded}
              className='a9bdap5'
              src={`https://img.pokemondb.net/sprites/home/normal/${pokemonData?.name?.toLowerCase()}.png`}
            />
            {quantity && (
              <DuplicateIdentifer>
                <IdentifierText>{quantity}</IdentifierText>
              </DuplicateIdentifer>
            )}
          </ImageContainer>
          <TitleContainer>
            <Name>{pokemonData?.name}</Name>
            <Type>{pokemonData?.type}</Type>
            <BaseUl expanded={false}>
              <List>{pokemonData?.id}</List>
              <List>{attributes?.year}</List>
              <List>{setNumber}</List>
            </BaseUl>
          </TitleContainer>
          <StatUl expanded={expanded}>
            <List>
              <Label>Set:</Label>
              <Attribute>{attributes?.set}</Attribute>
            </List>
            <List>
              <Label>Type:</Label>
              <Attribute>{attributes?.cardType}</Attribute>
            </List>
            <List>
              <Label>Condition:</Label>
              <Attribute>{attributes?.condition}</Attribute>
            </List>
            {attributes?.grading && (
              <List>
                <Label>Grading:</Label>
                <Attribute>{attributes.grading}</Attribute>
              </List>
            )}
          </StatUl>
        </InnerWrapper>
      </Wrapper>
    </Container>
  );
}
