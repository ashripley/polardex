import { IconPhotoScan, IconSelector } from '@tabler/icons-react';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import { CardModel } from './cardModel';
import { motion } from 'motion/react';
import {
  BaseCardWrapper,
  BaseCardInnerWrapper,
  BaseCardImageContainer,
  BaseCardTitleContainer,
} from '../BaseCard';

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

const Wrapper = styled(BaseCardWrapper)``;

const InnerWrapper = styled(BaseCardInnerWrapper)``;

const ImageContainer = styled(BaseCardImageContainer)``;

const TitleContainer = styled(BaseCardTitleContainer)``;

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

const StyledImage = styled(motion.img)`
  padding: ${({ theme }) => theme.space[3]};
  width: calc(100% - 8px);
  height: calc(100% - 8px);
`;

const StyledDemoImage = styled(motion(IconPhotoScan))`
  padding: ${({ theme }) => theme.space[3]};
  width: calc(100% - 8px);
  height: calc(100% - 8px);

  & {
    color: ${({ theme }) => theme.color.text.secondary};
  }
`;

const DuplicateIdentifer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.frost.blue};
  min-width: 1.35rem;
  height: 1.35rem;
  padding: 0 ${({ theme }) => theme.space[1]};
  border-radius: ${({ theme }) => theme.radius.full};
  top: 0;
  right: 0;
  margin: ${({ theme }) => theme.space[2]};
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const IdentifierText = styled.span`
  color: #ffffff;
  display: block;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
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

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

export function Card(props: CardProps) {
  const { pokemonData, attributes, setNumber, quantity, isDemo } = props;
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Container isDemo={isDemo}>
      <Wrapper
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <InnerWrapper>
          <ResizeContainer
            onClick={() => setExpanded(!expanded)}
            expanded={expanded}
          >
            <ResizeIcon />
          </ResizeContainer>
          <ImageContainer expanded={false}>
            {isDemo ? (
              <StyledDemoImage stroke={1} {...fadeIn} />
            ) : (
              <StyledImage
                className='a9bdap5'
                src={`https://img.pokemondb.net/sprites/home/normal/${pokemonData?.name?.toLowerCase()}.png`}
                {...fadeIn}
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
