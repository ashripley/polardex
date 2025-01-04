import styled, { css, keyframes, useTheme } from 'styled-components';
import {
  ButtonContainer,
  SectionParagraph,
  SectionText,
  SectionWrapper,
} from './sectionStyles';
import { Button, DisplayCard } from '../../../components';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { isMobile } from '../../../utils';

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

const ImageContainer = styled.div<{ isMobile: boolean }>`
  width: 100%;
  order: 1;
  display: flex;
  justify-content: center;

  ${({ isMobile }) =>
    isMobile &&
    css`
      margin-top: 3rem;
    `}
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

const Rhydon = styled(DisplayCard)``;

const Charizard = styled(DisplayCard)``;

const Blastoise = styled(DisplayCard)``;

const Cloyster = styled(DisplayCard)``;

const Vileplume = styled(DisplayCard)``;

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

  margin-bottom: 0;
`;

const AnimatedWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

const StudioSpanContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: 0.5rem;
  font-size: ${({ isMobile }) => (isMobile ? '2rem' : '2.5rem')};
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
          <ImageContainer isMobile={isMobile}>
            <Rhydon
              title={'Rhydon'}
              display
              bg={theme.miscColor.a2}
              imageUrl='https://img.pokemondb.net/sprites/home/normal/rhydon.png'
              style={{
                zIndex: 1,
                marginRight: isMobile ? -200 : -400,
                transform: !isVisible
                  ? 'none'
                  : 'perspective(1000px) rotate(90deg) rotateX(180deg) rotateY(230deg) translateX(-100px) translateZ(10px)',
                boxShadow:
                  'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                transition: 'all ease-in-out 1s',
                borderRadius: isMobile ? '1rem' : '1.5rem',
              }}
              height={isMobile ? 300 : 650}
              width={isMobile ? 200 : 400}
              image={{
                width: isMobile ? '5rem' : '10em',
                height: isMobile ? '5rem' : '10em',
              }}
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
                borderRadius: isMobile ? '1rem' : '1.5rem',
              }}
              height={isMobile ? 300 : 650}
              width={isMobile ? 200 : 400}
              image={{
                width: isMobile ? '5rem' : '10em',
                height: isMobile ? '5rem' : '10em',
              }}
              titleSize='1.2em'
            />
            <Blastoise
              title={'Blastoise'}
              display
              bg={theme.miscColor.f3}
              imageUrl='https://img.pokemondb.net/sprites/home/normal/blastoise.png'
              style={{
                zIndex: 1,
                marginLeft: isMobile ? -200 : -400,
                boxShadow:
                  'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                transform: !isVisible
                  ? 'none'
                  : 'perspective(2500px) rotate(90deg) rotateX(180deg) rotateY(230deg) translateX(-70px) translateZ(100px)',
                transition: 'all ease-in-out 1s',
                borderRadius: isMobile ? '1rem' : '1.5rem',
              }}
              height={isMobile ? 300 : 650}
              width={isMobile ? 200 : 400}
              image={{
                width: isMobile ? '5rem' : '10em',
                height: isMobile ? '5rem' : '10em',
              }}
              titleSize='1.2em'
            />
            <Cloyster
              title={'Cloyster'}
              display
              bg={theme.miscColor.f2}
              imageUrl='https://img.pokemondb.net/sprites/home/normal/cloyster.png'
              style={{
                zIndex: 1,
                marginLeft: isMobile ? -200 : -400,
                boxShadow:
                  'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                transform: !isVisible
                  ? 'none'
                  : 'perspective(3500px) rotate(90deg) rotateX(180deg) rotateY(230deg) translateX(-60px) translateZ(150px)',
                transition: 'all ease-in-out 1s',
                borderRadius: isMobile ? '1rem' : '1.5rem',
              }}
              height={isMobile ? 300 : 650}
              width={isMobile ? 200 : 400}
              image={{
                width: isMobile ? '5rem' : '10em',
                height: isMobile ? '5rem' : '10em',
              }}
              titleSize='1.2em'
            />
            <Vileplume
              title={'Vileplume'}
              display
              bg={theme.miscColor.f1}
              imageUrl='https://img.pokemondb.net/sprites/home/normal/vileplume.png'
              style={{
                zIndex: 1,
                marginLeft: isMobile ? -200 : -400,
                boxShadow:
                  'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                transform: !isVisible
                  ? 'none'
                  : 'perspective(4500px) rotate(90deg) rotateX(180deg) rotateY(225deg) translateZ(200px)',
                transition: 'all ease-in-out 1s',
                borderRadius: isMobile ? '1rem' : '1.5rem',
              }}
              height={isMobile ? 300 : 650}
              width={isMobile ? 200 : 400}
              image={{
                width: isMobile ? '5rem' : '10em',
                height: isMobile ? '5rem' : '10em',
              }}
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
                    <StudioSpanContainer isMobile={isMobile}>
                      <span>Your</span>
                      <span>
                        <em>personal</em>
                        <LineSVG />
                      </span>
                      <span>canvas.</span>
                    </StudioSpanContainer>
                  </span>
                </StyledSectionText>
              </AnimatedWrapper>
            </HeaderContainer>
            {isMobile && (
              <StyledSectionText style={{ fontSize: '1rem', margin: '0.5rem' }}>
                *** Only Available on Desktop ***
              </StyledSectionText>
            )}
            <Paragraph>
              Bring your cards to life. Take the cards in your hand and
              customize them like never before, from unique illustrations to
              personalized text. With intuitive tools and endless possibilities,
              Studio lets you craft cards that are as unique as your collection
            </Paragraph>
            <Buttons>
              <Link to={'/studio'}>
                <Button buttonType='secondary' disabled={isMobile}>
                  Studio
                </Button>
              </Link>
            </Buttons>
          </TextContainer>
        </Content>
      </SectionWrapper>
    </Container>
  );
}

const dash = keyframes`
from {
  stroke-dashoffset: 1;
}
to {
  stroke-dashoffset: 0;
}

`;

const StyledPath = styled.path`
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ${dash} 2s linear alternate infinite;
`;

function LineSVG() {
  const theme = useTheme();
  return (
    <svg viewBox='0 0 480 120' style={{ marginTop: -30 }}>
      <StyledPath
        className='path'
        fill='none'
        stroke={theme.miscColor.a4}
        strokeWidth='8'
        d='M10,100 L30,80 L50,100 L70,90 L90,110 L110,90 L130,100 L150,80 L170,100 L190,90 L210,110 L230,90 L250,100 L270,80 L290,100 L310,90 L330,110 L350,90 L370,100 L390,80 L410,100 L430,90 L450,110 L470,90'
        pathLength='1'
      />
    </svg>
  );
}
