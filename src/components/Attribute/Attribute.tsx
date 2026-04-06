import { IconGridScan } from '@tabler/icons-react';
import styled, { keyframes } from 'styled-components';
import { AttributeModel } from '../../api/fetch';
import { motion } from 'motion/react';
import {
  BaseCardWrapper,
  BaseCardInnerWrapper,
  BaseCardImageContainer,
  BaseCardTitleContainer,
} from '../BaseCard';

type AttributeProps = Partial<AttributeModel> & {
  inOverview: boolean;
};

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 1em;
  border-radius: 1.5em;
  flex-wrap: wrap;
  justify-content: space-evenly;
  height: auto;
  width: 18rem;
`;

const Wrapper = styled(BaseCardWrapper)`
  margin-top: ${({ theme }) => theme.space[8]};
`;

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

const StyledDemoImage = styled(motion(IconGridScan))`
  padding: 0.8rem;
  width: calc(100% - 8px);
  height: calc(100% - 8px);

  & {
    color: ${({ theme }) => theme.color.text.secondary};
  }
`;

const StyledImage = styled.img`
  transform: rotate3d(1, 1, 1, -30deg);
  position: absolute;
  left: 2px;
  top: -60px;
  height: 10rem;
  width: 10rem;
  filter: ${({ theme }) => theme.dropShadow.sm};
`;

const ImageWrapper = styled.span`
  display: inline-block;
  position: relative;
  width: 10rem;
`;

const shuffle = keyframes`
  0%, 100% {
    transform: translate(0, 0); 
  }
  25% {
    transform: translate(20px, 0);
  }
  50% {
    transform: translate(5px, -5px);
  }
  75% {
    transform: translate(-5px, 5px);
  }
`;

const ShuffleWrapper = styled.div`
  animation: ${shuffle} 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
`;

export function Attribute(props: AttributeProps) {
  const { name, type, inOverview } = props;

  return (
    <Container>
      {inOverview && (
        <ShuffleWrapper>
          <ImageWrapper>
            <StyledImage src='https://img.pokemondb.net/sprites/home/normal/hitmonchan.png' />
          </ImageWrapper>
        </ShuffleWrapper>
      )}
      <Wrapper>
        <InnerWrapper>
          <ImageContainer expanded={false}>
            <StyledDemoImage
              stroke={1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </ImageContainer>
          <TitleContainer>
            <Name>{name ?? 'Attribute'}</Name>
            <Type>{type ?? 'Type'}</Type>
          </TitleContainer>
        </InnerWrapper>
      </Wrapper>
    </Container>
  );
}
