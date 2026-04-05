import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { fadeStyles } from '../animation';

const bounce = keyframes`
  from {
    opacity: 0;
    scale: 0.5;
  }
  to {
    opacity: 1;
    scale: 1;
  }
`;

const Container = styled.div<{ mounted: boolean }>`
  display: flex;
  flex-flow: nowrap;
  flex: 1;
  height: 80dvh;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 1rem;

  ${({ mounted }) => fadeStyles(mounted, 'flex')}
`;

const ImageContainer = styled.div`
  width: 5rem;
  height: 5rem;
  display: flex;
  place-items: center;
  opacity: 0;
  transition: all ease-in-out 1000ms;
  animation: ${bounce} 600ms alternate infinite cubic-bezier(0.2, 0.65, 0.6, 1);
`;

export const LoadingSpinner = () => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Container mounted={mounted}>
      <ImageContainer>
        <img
          src={'https://img.pokemondb.net/sprites/home/normal/abra.png'}
          alt='abra'
        />
      </ImageContainer>
      <ImageContainer style={{ animationDelay: '150ms' }}>
        <img
          src={'https://img.pokemondb.net/sprites/home/normal/kadabra.png'}
          alt='kadabra'
        />
      </ImageContainer>
      <ImageContainer style={{ animationDelay: '300ms' }}>
        <img
          src={'https://img.pokemondb.net/sprites/home/normal/alakazam.png'}
          alt='alakazam'
        />
      </ImageContainer>
    </Container>
  );
};
