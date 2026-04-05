import { IconPhotoScan, IconSelector } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { CardModel } from './cardModel';
import { fadeStyles } from '../animation';

type CardProps = Partial<CardModel> & {
  isDemo?: boolean;
};

const Container = styled.div<{ isDemo: boolean | undefined }>`
  display: flex;
  flex-grow: 1;
  padding: 1em;
  border-radius: ${({ theme }) => theme.radius.xl};
  flex-wrap: wrap;
  justify-content: space-evenly;
  height: auto;

  ${({ isDemo }) =>
    isDemo &&
    css`
      min-width: 18rem;
    `}
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 250px;
  margin-inline: auto;
  transition: ${({ theme }) => theme.transition.normal};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface.base};
  position: relative;
  justify-items: center;
  padding: ${({ theme }) => theme.space[4]};
  filter: drop-shadow(0 0px 0px hsl(0deg 0% 0% / 0.1))
    drop-shadow(0 0px 1px hsl(0deg 0% 0% / 0.1));
  transition: ${({ theme }) => theme.transition.normal};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 130px;
    border-radius: ${({ theme }) => theme.radius.md} ${({ theme }) => theme.radius.md} 0 0;
    background: ${({ theme }) => theme.color.surface.muted};
  }
`;

const ImageContainer = styled.div<{ expanded: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: ${({ theme }) => theme.radius.full};
  background-color: ${({ theme }) => theme.color.surface.base};
  overflow: visible;
  justify-content: flex-end;
  border: 3px solid ${({ theme }) => theme.color.surface.muted};
  margin-inline: auto;

  ${({ expanded }) =>
    expanded &&
    css`
      outline: 6px solid ${({ theme }) => theme.color.surface.muted};
      transform: translateY(-24px);
      z-index: 2;
    `}
`;

const TitleContainer = styled.p`
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: ${({ theme }) => theme.space[2]} 0;
`;

const Name = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  text-transform: capitalize;
  color: ${({ theme }) => theme.color.text.primary};
`;

const Type = styled.span`
  display: block;
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.size.md};
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
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  gap: ${({ expanded }) => (expanded ? '3rem' : '1rem')};
  padding: 0;
  color: ${({ theme }) => theme.color.text.primary};
  min-width: 0;
  width: 100%;
  margin-top: ${({ expanded }) => (expanded ? '0.2rem' : '1rem')};
  transition: ${({ theme }) => theme.transition.normal};

  & > li {
    font-weight: ${({ expanded, theme }) => (expanded ? theme.typography.weight.regular : theme.typography.weight.bold)};
    opacity: ${({ expanded }) => (expanded ? 1 : 0.7)};
    transition: ${({ theme }) => theme.transition.normal};
  }
`;

const StatUl = styled.ul<{ expanded: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  justify-content: flex-start;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  transition: height 0.3s ease-in-out;
  height: ${({ expanded }) => (expanded ? '10rem' : 0)};
  overflow: hidden;
  flex-flow: column;
  place-items: start;
  place-items: center;
  padding: 0;
  border-top: ${({ expanded, theme }) =>
    expanded ? `2px solid ${theme.color.surface.muted}` : 'none'};
`;

const List = styled.li`
  display: flex;
  flex-flow: column;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.size.md};
  padding: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.color.text.primary};
`;

const StyledImage = styled.img<{ isOpen: boolean }>`
  padding: ${({ theme }) => theme.space[3]};
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  ${({ isOpen }) => fadeStyles(isOpen)};
`;

const StyledDemoImage = styled(IconPhotoScan)<{ isOpen: boolean }>`
  padding: ${({ theme }) => theme.space[3]};
  width: calc(100% - 8px);
  height: calc(100% - 8px);

  & {
    color: ${({ theme }) => theme.color.text.secondary};
  }

  ${({ isOpen }) => fadeStyles(isOpen)};
`;

const DuplicateIdentifer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.text.secondary};
  height: 1.5rem;
  width: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.full};
  top: 0;
  right: 0;
  margin: ${({ theme }) => theme.space[2]};
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const IdentifierText = styled.span`
  color: ${({ theme }) => theme.color.surface.muted};
  display: block;
  font-size: 0.9rem;
`;

const ResizeContainer = styled.div<{ expanded: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[2]};
  top: 0;
  right: 0;
  margin: ${({ theme }) => theme.space[2]};
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  transition: ${({ theme }) => theme.transition.normal};

  ${({ expanded, theme }) =>
    expanded &&
    css`
      background-color: ${theme.color.text.secondaryHover};
    `};

  &:hover {
    background-color: ${({ theme }) => theme.color.text.secondaryHover};
    cursor: pointer;
  }
`;

const ResizeIcon = styled(IconSelector)`
  width: 1.5rem;
  height: 1.5rem;
  stroke: ${({ theme }) => theme.color.text.primary};
  stroke-width: 1.5;
`;

const Label = styled(Type)`
  font-size: ${({ theme }) => theme.typography.size.md};
  opacity: 0.7;
`;

const Attribute = styled(Type)`
  font-size: ${({ theme }) => theme.typography.size.md};
`;

export function Card(props: CardProps) {
  const { pokemonData, attributes, setNumber, quantity, isDemo } = props;
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Container isDemo={isDemo}>
      <Wrapper>
        <InnerWrapper>
          <ResizeContainer
            onClick={() => setExpanded(!expanded)}
            expanded={expanded}
          >
            <ResizeIcon />
          </ResizeContainer>
          <ImageContainer expanded={false}>
            {isDemo ? (
              <StyledDemoImage stroke={1} isOpen={isLoaded} />
            ) : (
              <StyledImage
                isOpen={isLoaded}
                className='a9bdap5'
                src={`https://img.pokemondb.net/sprites/home/normal/${pokemonData?.name?.toLowerCase()}.png`}
              />
            )}
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
