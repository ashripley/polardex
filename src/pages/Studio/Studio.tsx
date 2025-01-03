import styled, { keyframes } from 'styled-components';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import { Attribute, Button, Card } from '../../components';
import { useState } from 'react';
import { StudioModal } from './StudioModal';

const shuffle = keyframes`
  0%, 100% {
    transform: translateZ(0) rotateY(0deg);
  }
  25% {
    transform: translateZ(-10px) rotateY(30deg);
  }
  50% {
    transform: translateZ(10px) rotateY(-30deg);
  }
  75% {
    transform: translateZ(-8px) rotateY(20deg);
  }
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: start;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Action = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
`;

const StyledImage = styled.img`
  position: absolute;
  left: 160px;
  top: -35px;
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

const ShuffleWrapper = styled.div`
  animation: ${shuffle} 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
`;

export function Studio() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const onAddOpen = () => {
    setModalOpen(true);
  };

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  return (
    <main>
      <section>
        <SectionWrapper>
          <Container>
            <Action>
              <Button buttonType='secondary' onClick={onAddOpen}>
                Add
              </Button>
              <Card
                isDemo
                pokemonData={{
                  name: 'Name',
                  id: '#000',
                  type: 'Type',
                }}
                attributes={{
                  cardType: 'Defaut',
                  condition: 'Default',
                  set: 'Default',
                  grading: 1,
                  year: 2000,
                }}
                setNumber={'0/0'}
              />
            </Action>
            <Action>
              <Button buttonType='secondary'>Modify</Button>
              <ShuffleWrapper>
                <ImageWrapper isVisible={true}>
                  <StyledImage src='https://img.pokemondb.net/sprites/home/normal/hitmonlee.png' />
                </ImageWrapper>
              </ShuffleWrapper>
              <div style={{ marginTop: '-40px' }}>
                <Card
                  pokemonData={{
                    name: 'Charizard',
                    id: '#009',
                    type: 'Fire',
                  }}
                  attributes={{
                    cardType: 'Holo',
                    condition: 'Excellent',
                    set: 'Base',
                    grading: 10,
                    year: 1999,
                  }}
                  setNumber={'12/102'}
                />
              </div>
            </Action>
            <Action>
              <Button buttonType='secondary'>Attribute</Button>
              <Attribute />
            </Action>
            <StudioModal isOpen={modalOpen} toggleModal={toggleModal} />
          </Container>
        </SectionWrapper>
      </section>
    </main>
  );
}
