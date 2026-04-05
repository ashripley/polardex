import styled, { css, keyframes, useTheme } from 'styled-components';
import { SectionParagraph, SectionText, SectionWrapper } from './sectionStyles';
import { DisplayCard } from '../../../components';
import { isMobile } from '../../../utils';

const Container = styled.section`
  position: relative;
  top: 0px;
  background-color: ${({ theme }) => theme.color.surface.muted};
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

const ImageContainer = styled.div<{ isMobile: boolean }>`
  width: 100%;
  order: 0;

  ${({ isMobile }) =>
    isMobile &&
    css`
      display: flex;
      justify-content: center;
    `}
`;

const TextContainer = styled.div`
  text-align: start;
  color: ${({ theme }) => theme.color.text.primary};
`;

const Paragraph = styled(SectionParagraph)<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.color.text.primary};
  text-align: ${({ isMobile }) => (isMobile ? 'center' : 'start')};
`;

const shuffle = keyframes`
  0%, 100% { transform: rotate(0deg) translate(0, 0); }
  25% { transform: rotate(5deg) translate(5px, -5px); }
  50% { transform: rotate(-5deg) translate(-5px, 5px); }
  75% { transform: rotate(3deg) translate(3px, -3px); }
`;

const ShuffleWrapper = styled.div`
  animation: ${shuffle} 2s ease-in-out alternate infinite;
`;

const ShuffleContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;

  ${({ isMobile }) =>
    isMobile &&
    css`
      justify-content: center;
    `}
`;

export function DetailSection() {
  const theme = useTheme();

  return (
    <Container>
      <SectionWrapper>
        <Content>
          <ImageContainer isMobile={isMobile}>
            <DisplayCard
              title={'Clefairy'}
              display
              bg={theme.color.frost.teal}
              imageUrl='https://img.pokemondb.net/sprites/home/normal/clefairy.png'
              style={{
                zIndex: theme.zIndex.raised,
                backgroundColor: theme.color.aurora.purple,
                boxShadow: theme.shadow.lg,
              }}
              height={isMobile ? 550 : 650}
              width={isMobile ? 300 : 400}
              image={{ width: '10em', height: '10em' }}
              titleSize='1.2em'
            />
          </ImageContainer>
          <TextContainer>
            <ShuffleContainer isMobile={isMobile}>
              <SectionText style={{ fontSize: isMobile ? '2rem' : '2.5rem' }}>
                Your own{' '}
              </SectionText>
              <ShuffleWrapper>
                <SectionText style={{ fontSize: isMobile ? '2rem' : '2.5rem' }}>
                  collection.
                </SectionText>
              </ShuffleWrapper>
            </ShuffleContainer>
            <Paragraph isMobile={isMobile}>
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
