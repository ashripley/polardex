import styled, { keyframes } from 'styled-components';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useIsMobile } from '../../utils';

// Cards are in normal flex flow (no absolute positioning) to avoid layout overflow.
// Negative margins create overlap; rotation with transform-origin: bottom center fans them out.

const FanContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  padding-bottom: ${({ theme }) => theme.space[2]};
  order: 0;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    order: 1;
    width: 100%;
  }
`;

const floatCard = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;

interface CardWrapProps {
  $zIndex: number;
  $overlapLeft: boolean;
}

const CardWrap = styled(motion.div)<CardWrapProps>`
  flex-shrink: 0;
  z-index: ${({ $zIndex }) => $zIndex};
  transform-origin: bottom center;
  margin-left: ${({ $overlapLeft }) => ($overlapLeft ? '-2rem' : '0')};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    margin-left: ${({ $overlapLeft }) => ($overlapLeft ? '-2.5rem' : '0')};
  }
`;

const FloatInner = styled.div<{ $delay: string }>`
  animation: ${floatCard} 4.5s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
`;

const CARDS = [
  {
    src: 'https://images.pokemontcg.io/base1/16.png',
    alt: 'Zapdos Base Set',
    delay: 0.12,
    floatDelay: '0s',
    zIndex: 1,
    rotate: -22,
  },
  {
    src: 'https://images.pokemontcg.io/base1/4.png',
    alt: 'Charizard Base Set',
    delay: 0.06,
    floatDelay: '0.9s',
    zIndex: 2,
    rotate: -11,
  },
  {
    src: 'https://images.pokemontcg.io/base1/10.png',
    alt: 'Mewtwo Base Set',
    delay: 0,
    floatDelay: '1.8s',
    zIndex: 3,
    rotate: 0,
  },
  {
    src: 'https://images.pokemontcg.io/base1/2.png',
    alt: 'Blastoise Base Set',
    delay: 0.06,
    floatDelay: '0.45s',
    zIndex: 2,
    rotate: 11,
  },
  {
    src: 'https://images.pokemontcg.io/base1/6.png',
    alt: 'Gyarados Base Set',
    delay: 0.12,
    floatDelay: '1.35s',
    zIndex: 1,
    rotate: 22,
  },
];

const MOBILE_CARDS = [CARDS[1], CARDS[2], CARDS[3]];

export function CardCollection() {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const cardW = isMobile ? 96 : 155;
  const cardH = isMobile ? 134 : 217;

  const cards = isMobile ? MOBILE_CARDS : CARDS;

  return (
    <FanContainer ref={ref}>
      {cards.map((card, i) => (
        <CardWrap
          key={card.alt}
          $zIndex={card.zIndex}
          $overlapLeft={i > 0}
          initial={{ opacity: 0, y: 32, rotate: card.rotate }}
          animate={
            isInView
              ? { opacity: 1, y: 0, rotate: card.rotate }
              : { opacity: 0, y: 32, rotate: card.rotate }
          }
          transition={{
            duration: 0.65,
            delay: card.delay + 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <FloatInner $delay={card.floatDelay}>
            <img
              src={card.src}
              alt={card.alt}
              style={{
                width: cardW,
                height: cardH,
                objectFit: 'contain',
                borderRadius: 10,
                display: 'block',
                filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.35))',
              }}
            />
          </FloatInner>
        </CardWrap>
      ))}
    </FanContainer>
  );
}
