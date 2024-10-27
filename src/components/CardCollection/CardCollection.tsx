import styled, { useTheme } from 'styled-components';
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

  &:hover {
    animation: pulse 1s infinite;
    z-index: 2;
    cursor: pointer;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export function CardCollection() {
  const theme = useTheme();

  return (
    <ImageContainer>
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
          boxShadow:
            'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
        }}
      />
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
          boxShadow:
            'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
        }}
      />
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
          boxShadow:
            'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
        }}
      />
    </ImageContainer>
  );
}
