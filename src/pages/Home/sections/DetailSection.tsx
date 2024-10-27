import styled, { useTheme } from 'styled-components';
import { SectionParagraph, SectionText, SectionWrapper } from './sectionStyles';
import { Card } from '../../../components';

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

export function DetailSection() {
  const theme = useTheme();

  return (
    <Container>
      <SectionWrapper>
        <Content>
          <ImageContainer>
            <Card
              title={'Dragonite'}
              display
              bg={theme.miscColor.f1}
              imageUrl='https://img.pokemondb.net/sprites/home/normal/dragonite.png'
              style={{
                zIndex: 1,
                backgroundColor: theme.miscColor.f3,
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
            <SectionText>Your own collection.</SectionText>
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
