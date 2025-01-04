import styled, { useTheme } from 'styled-components';
import { DisplayCard } from '../DisplayCard';
import { isMobile } from '../../utils';

const ImageContainer = styled.div`
  width: 8em;
  order: 0;
  justify-content: center;
  display: flex;
  transition: animation 0.3s ease;

  @media (min-width: 56.25em) {
    display: flex;
    order: 1;
    width: 100%;
  }
`;

export function CardCollection() {
  const theme = useTheme();

  return (
    <ImageContainer>
      <DisplayCard
        title={'Bulbasaur'}
        display
        bg={theme.miscColor.f1}
        height={isMobile ? 225 : 300}
        width={isMobile ? 150 : 200}
        image={{
          height: isMobile ? '3rem' : '5rem',
          width: isMobile ? '3rem' : '5rem',
        }}
        imageRadius={isMobile ? '0.5rem' : '1rem'}
        imageUrl='https://img.pokemondb.net/sprites/home/normal/bulbasaur.png'
        style={{
          marginLeft: -200,
          transform:
            'perspective(500px) rotateX(15deg) rotateY(15deg) translateX(75px) translateY(30px) rotate(-10deg)',
          zIndex: 1,
          backgroundColor: theme.miscColor.a4,
          filter:
            'drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4)) drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4))',
          borderRadius: isMobile ? '1rem' : '1.2rem',
        }}
      />
      <DisplayCard
        title={'Squirtle'}
        display
        bg={theme.miscColor.f1}
        height={isMobile ? 225 : 300}
        width={isMobile ? 150 : 200}
        image={{
          height: isMobile ? '3rem' : '5rem',
          width: isMobile ? '3rem' : '5rem',
        }}
        imageRadius={isMobile ? '0.5rem' : '1rem'}
        imageUrl='https://img.pokemondb.net/sprites/home/normal/squirtle.png'
        style={{
          transform: 'rotate(0deg)',
          zIndex: 3,
          backgroundColor: theme.miscColor.f4,
          filter:
            'drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4)) drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4))',
          borderRadius: isMobile ? '1rem' : '1.2rem',
        }}
      />
      <DisplayCard
        title={'Charmander'}
        display
        bg={theme.miscColor.f1}
        height={isMobile ? 225 : 300}
        width={isMobile ? 150 : 200}
        image={{
          height: isMobile ? '3rem' : '5rem',
          width: isMobile ? '3rem' : '5rem',
        }}
        imageRadius={isMobile ? '0.5rem' : '1rem'}
        imageUrl='https://img.pokemondb.net/sprites/home/normal/charmander.png'
        style={{
          marginRight: -200,
          transform:
            'perspective(500px) rotateX(15deg) rotateY(-15deg) translateX(-75px) translateY(30px) rotate(10deg)',
          zIndex: 1,
          backgroundColor: theme.miscColor.a2,
          filter:
            'drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4)) drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4))',
          borderRadius: isMobile ? '1rem' : '1.2rem',
        }}
      />
    </ImageContainer>
  );
}
