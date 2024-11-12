import styled, { keyframes, useTheme } from 'styled-components';
import { Card } from '../Card';

const ImageContainer = styled.div`
  width: 8em;
  order: 0;
  justify-content: center;
  display: flex;
  transition: animation 0.5s ease;

  @media (min-width: 56.25em) {
    display: flex;
    order: 1;
    width: 100%;
  }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const BreatheWrapper = styled.div`
  animation: ${breathe} 3s ease-in-out infinite;
`;

export function CardCollection() {
  const theme = useTheme();

  return (
    <ImageContainer>
      <BreatheWrapper>
        <Card
          title={'Bulbasaur'}
          display
          bg={theme.miscColor.f1}
          height={300}
          width={200}
          imageUrl='https://img.pokemondb.net/sprites/home/normal/bulbasaur.png'
          style={{
            marginLeft: -200,
            transform:
              'perspective(500px) rotateX(15deg) rotateY(15deg) translateX(75px) translateY(30px) rotate(-10deg)',
            zIndex: 1,
            backgroundColor: theme.miscColor.a4,
            filter:
              'drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4)) drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4))',
          }}
        />
      </BreatheWrapper>
      <BreatheWrapper>
        <Card
          title={'Squirtle'}
          display
          bg={theme.miscColor.f1}
          height={300}
          width={200}
          imageUrl='https://img.pokemondb.net/sprites/home/normal/squirtle.png'
          style={{
            transform: 'rotate(0deg)',
            zIndex: 3,
            backgroundColor: theme.miscColor.f4,
            filter:
              'drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4)) drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4))',
          }}
        />
      </BreatheWrapper>
      <BreatheWrapper>
        <Card
          title={'Charmander'}
          display
          bg={theme.miscColor.f1}
          height={300}
          width={200}
          imageUrl='https://img.pokemondb.net/sprites/home/normal/charmander.png'
          style={{
            marginRight: -200,
            transform:
              'perspective(500px) rotateX(15deg) rotateY(-15deg) translateX(-75px) translateY(30px) rotate(10deg)',
            zIndex: 1,
            backgroundColor: theme.miscColor.a2,
            filter:
              'drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4)) drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4))',
          }}
        />
      </BreatheWrapper>
    </ImageContainer>
  );
}
