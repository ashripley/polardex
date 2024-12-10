import styled, { keyframes, useTheme } from 'styled-components';
import { SectionParagraph, SectionText, SectionWrapper } from './sectionStyles';
import { DisplayCard } from '../../../components';

const Container = styled.section`
  position: relative;
  top: 0px;
  background-color: ${({ theme }) => theme.bgColor.bg3};
`;

const Content = styled.div`
  display: grid;
  justify-items: center;
  row-gap: 4em;

  @media (min-width: 56.25em) {
    grid-template-columns: 1fr 1fr;
    gap: 8em 2em;
    -webkit-box-align: center;
    align-items: center;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  order: 0;
`;

const TextContainer = styled.div`
  text-align: start;
  color: ${({ theme }) => theme.textColor.t1};
`;

const Paragraph = styled(SectionParagraph)`
  color: ${({ theme }) => theme.textColor.t1};
`;

const shuffle = keyframes`
  0%, 100% { transform: rotate(0deg) translate(0, 0); }
  25% { transform: rotate(5deg) translate(5px, -5px); }
  50% { transform: rotate(-5deg) translate(-5px, 5px); }
  75% { transform: rotate(3deg) translate(3px, -3px); }
`;

const ShuffleWrapper = styled.div`
  animation: ${shuffle} 2s ease-in-out infinite;
`;

const ShuffleContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

export function DetailSection() {
  const theme = useTheme();

  return (
    <Container>
      <SectionWrapper>
        <Content>
          <ImageContainer>
            <DisplayCard
              title={'Clefairy'}
              display
              bg={theme.miscColor.f1}
              imageUrl='https://img.pokemondb.net/sprites/home/normal/clefairy.png'
              style={{
                zIndex: 1,
                backgroundColor: theme.miscColor.a5,
                boxShadow:
                  'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
              }}
              height={650}
              width={400}
              image={{ width: '10em', height: '10em' }}
              titleSize='1.2em'
            />
          </ImageContainer>
          <TextContainer>
            <ShuffleContainer>
              <SectionText>Your own </SectionText>
              <ShuffleWrapper>
                <SectionText>collection.</SectionText>
              </ShuffleWrapper>
            </ShuffleContainer>
            <Paragraph>
              A dedicated space to organize, showcase, and grow your Pokémon
              card collection. Whether you’re a long-time collector or just
              starting, Polardex offers easy tools to catalog your cards, track
              rarities, and discover new additions for your set. Begin your
              journey here and bring your collection to life!
            </Paragraph>
          </TextContainer>
        </Content>
      </SectionWrapper>
    </Container>
  );
}
