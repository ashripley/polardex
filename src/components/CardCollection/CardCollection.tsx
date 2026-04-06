import styled, { useTheme } from 'styled-components';
import { DisplayCard } from '../DisplayCard';
import { useIsMobile } from '../../utils';

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
  const isMobile = useIsMobile();

  return (
    <ImageContainer>
      <DisplayCard
        title={'Bulbasaur'}
        display
        bg={theme.color.frost.teal}
        height={isMobile ? 225 : 300}
        width={isMobile ? 150 : 200}
        image={{
          height: isMobile ? '3rem' : '5rem',
          width: isMobile ? '3rem' : '5rem',
        }}
        imageRadius={isMobile ? theme.radius.md : theme.radius.lg}
        imageUrl='https://img.pokemondb.net/sprites/home/normal/bulbasaur.png'
        style={{
          marginLeft: -200,
          transform:
            'perspective(500px) rotateX(15deg) rotateY(15deg) translateX(75px) translateY(30px) rotate(-10deg)',
          zIndex: theme.zIndex.raised,
          backgroundColor: theme.color.aurora.green,
          filter: theme.dropShadow.md,
          borderRadius: isMobile ? theme.radius.lg : '1.2rem',
        }}
      />
      <DisplayCard
        title={'Squirtle'}
        display
        bg={theme.color.frost.teal}
        height={isMobile ? 225 : 300}
        width={isMobile ? 150 : 200}
        image={{
          height: isMobile ? '3rem' : '5rem',
          width: isMobile ? '3rem' : '5rem',
        }}
        imageRadius={isMobile ? theme.radius.md : theme.radius.lg}
        imageUrl='https://img.pokemondb.net/sprites/home/normal/squirtle.png'
        style={{
          transform: 'rotate(0deg)',
          zIndex: theme.zIndex.dropdown,
          backgroundColor: theme.color.frost.deep,
          filter: theme.dropShadow.md,
          borderRadius: isMobile ? theme.radius.lg : '1.2rem',
        }}
      />
      <DisplayCard
        title={'Charmander'}
        display
        bg={theme.color.frost.teal}
        height={isMobile ? 225 : 300}
        width={isMobile ? 150 : 200}
        image={{
          height: isMobile ? '3rem' : '5rem',
          width: isMobile ? '3rem' : '5rem',
        }}
        imageRadius={isMobile ? theme.radius.md : theme.radius.lg}
        imageUrl='https://img.pokemondb.net/sprites/home/normal/charmander.png'
        style={{
          marginRight: -200,
          transform:
            'perspective(500px) rotateX(15deg) rotateY(-15deg) translateX(-75px) translateY(30px) rotate(10deg)',
          zIndex: theme.zIndex.raised,
          backgroundColor: theme.color.aurora.orange,
          filter: theme.dropShadow.md,
          borderRadius: isMobile ? theme.radius.lg : '1.2rem',
        }}
      />
    </ImageContainer>
  );
}
