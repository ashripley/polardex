import styled, { useTheme } from 'styled-components';
import {
  ButtonContainer,
  SectionParagraph,
  SectionText,
  SectionWrapper,
} from './sectionStyles';
import { Button, Card } from '../../../components';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const Container = styled.section`
  transition: background-color 400ms ease-in-out;
  position: relative;
  top: 0px;
  background-color: ${({ theme }) => theme.bgColor.bg3};
`;

const Content = styled.div`
  display: grid;
  justify-items: center;
  row-gap: 4em;

  @media (min-width: 56.25em) {
    gap: 8em 2em;
    -webkit-box-align: center;
    align-items: center;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  order: 1;
  display: flex;
  justify-content: center;
`;

const TextContainer = styled.div`
  color: ${({ theme }) => theme.textColor.t1};
  text-align: center;
`;

const Paragraph = styled(SectionParagraph)`
  text-align: center;
`;

const Buttons = styled(ButtonContainer)`
  display: inline-block;
  text-align: center;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: center;
`;

const Rhydon = styled(Card)``;

const Charizard = styled(Card)``;

const Blastoise = styled(Card)``;

const Cloyster = styled(Card)``;

const Vileplume = styled(Card)``;

const StyledSectionText = styled(SectionText)`
  max-width: fit-content;
  display: inline-block;
  text-align: center;
  background-color: rgb(255, 178, 62);
  background-image: linear-gradient(
    268.67deg,
    rgb(180 142 173 / 0.4) 3.43%,
    rgb(180 142 173 / 0.6) 15.69%,
    rgb(180 142 173 / 0.8) 55.54%,
    rgb(180 142 173 / 1) 99%
  );
  background-size: 100%;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AnimatedWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

const StudioSpanContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StyledUnderlineImage = styled.img`
  width: 25rem;
`;

export function StudioSection() {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 1000);
          observer.disconnect(); // Stop observing once it's in view
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Container ref={sectionRef}>
      <SectionWrapper>
        <Content>
          <ImageContainer>
            <Rhydon
              title={'Rhydon'}
              display
              bg={theme.miscColor.a2}
              imageUrl='https://img.pokemondb.net/sprites/home/normal/rhydon.png'
              style={{
                zIndex: 1,
                marginRight: -400,
                transform: !isVisible
                  ? 'none'
                  : 'perspective(1000px) rotate(90deg) rotateX(180deg) rotateY(230deg) translateX(-100px) translateZ(10px)',
                boxShadow:
                  'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                transition: 'all ease-in-out 1s',
              }}
              height={650}
              width={400}
              image={{ width: '10em', height: '10em' }}
              titleSize='1.2em'
            />
            <div style={{ height: 150 }} />
            <Charizard
              title={'Charizard'}
              display
              bg={theme.miscColor.a1}
              imageUrl='https://img.pokemondb.net/sprites/home/normal/charizard.png'
              style={{
                zIndex: 1,
                boxShadow:
                  'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                transform: !isVisible
                  ? 'none'
                  : 'perspective(1500px) rotate(90deg) rotateX(180deg) rotateY(230deg) translateX(-80px) translateZ(50px)',
                transition: 'all ease-in-out 1s',
              }}
              height={650}
              width={400}
              image={{ width: '10em', height: '10em' }}
              titleSize='1.2em'
            />
            <Blastoise
              title={'Blastoise'}
              display
              bg={theme.miscColor.f3}
              imageUrl='https://img.pokemondb.net/sprites/home/normal/blastoise.png'
              style={{
                zIndex: 1,
                marginLeft: -400,
                boxShadow:
                  'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                transform: !isVisible
                  ? 'none'
                  : 'perspective(2500px) rotate(90deg) rotateX(180deg) rotateY(230deg) translateX(-70px) translateZ(100px)',
                transition: 'all ease-in-out 1s',
              }}
              height={650}
              width={400}
              image={{ width: '10em', height: '10em' }}
              titleSize='1.2em'
            />
            <Cloyster
              title={'Cloyster'}
              display
              bg={theme.miscColor.f2}
              imageUrl='https://img.pokemondb.net/sprites/home/normal/cloyster.png'
              style={{
                zIndex: 1,
                marginLeft: -400,
                boxShadow:
                  'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                transform: !isVisible
                  ? 'none'
                  : 'perspective(3500px) rotate(90deg) rotateX(180deg) rotateY(230deg) translateX(-60px) translateZ(150px)',
                transition: 'all ease-in-out 1s',
              }}
              height={650}
              width={400}
              image={{ width: '10em', height: '10em' }}
              titleSize='1.2em'
            />
            <Vileplume
              title={'Vileplume'}
              display
              bg={theme.miscColor.f1}
              imageUrl='https://img.pokemondb.net/sprites/home/normal/vileplume.png'
              style={{
                zIndex: 1,
                marginLeft: -400,
                boxShadow:
                  'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                transform: !isVisible
                  ? 'none'
                  : 'perspective(4500px) rotate(90deg) rotateX(180deg) rotateY(225deg) translateZ(200px)',
                transition: 'all ease-in-out 1s',
              }}
              height={650}
              width={400}
              image={{ width: '10em', height: '10em' }}
              titleSize='1.2em'
            />
          </ImageContainer>
          <TextContainer>
            <HeaderContainer>
              <SectionText>Studio.</SectionText>
              <div style={{ width: '0.5em' }} />
              <AnimatedWrapper>
                <StyledSectionText>
                  <span>
                    <StudioSpanContainer>
                      <span>Your</span>
                      <em>personal</em>
                      <span>canvas.</span>
                    </StudioSpanContainer>
                    <StyledUnderlineImage
                      alt='underline'
                      src='https://css-for-js.dev/long-underline.png'
                    />
                  </span>
                </StyledSectionText>
              </AnimatedWrapper>
            </HeaderContainer>
            <Paragraph>
              Bring your cards to life. Take the cards in your hand and
              customize them like never before, from unique illustrations to
              personalized text. With intuitive tools and endless possibilities,
              Studio lets you craft cards that are as unique as your collection
            </Paragraph>
            <Buttons>
              <Link to={'/studio'}>
                <Button buttonType='secondary'>Studio</Button>
              </Link>
            </Buttons>
          </TextContainer>
        </Content>
      </SectionWrapper>
    </Container>
  );
}
