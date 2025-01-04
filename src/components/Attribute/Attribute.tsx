import { IconGridScan } from '@tabler/icons-react';
import styled, { css, keyframes } from 'styled-components';
import { AttributeModel } from '../../api/fetch';
import { useEffect, useState } from 'react';
import { fadeStyles } from '../animation';

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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 250px;
  margin-inline: auto;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  margin-top: 32px;
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

const StyledDemoImage = styled(IconGridScan)<{ isOpen: boolean }>`
  padding: 0.8rem;
  width: calc(100% - 8px);
  height: calc(100% - 8px);

  & {
    color: ${({ theme }) => theme.textColor.t2};
  }

  ${({ isOpen }) => fadeStyles(isOpen)};
`;

const StyledImage = styled.img`
  transform: rotate3d(1, 1, 1, -30deg);
  position: absolute;
  left: 2px;
  top: -60px;
  height: 10rem;
  width: 10rem;
  filter: drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.2))
    drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.2));
`;

const ImageWrapper = styled.span<{ isVisible: boolean }>`
  display: inline-block;
  position: relative;
  width: 10rem;
  transform: ${({ isVisible }) =>
    isVisible ? 'translateY(0)' : 'translateY(100%)'};
  transition: transform 1s ease-in-out;
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
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);

    return () => {
      setIsLoaded(false);
    };
  }, []);

  return (
    <Container>
      {inOverview && (
        <ShuffleWrapper>
          <ImageWrapper isVisible={isLoaded}>
            <StyledImage src='https://img.pokemondb.net/sprites/home/normal/hitmonchan.png' />
          </ImageWrapper>
        </ShuffleWrapper>
      )}
      <Wrapper>
        <InnerWrapper>
          <ImageContainer expanded={false}>
            <StyledDemoImage stroke={1} isOpen={isLoaded} />
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
