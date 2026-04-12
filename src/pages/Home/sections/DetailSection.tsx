import styled, { keyframes } from 'styled-components';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { SectionWrapper, SectionText, SectionParagraph } from './sectionStyles';
import { DisplayCard } from '../../../components';
import { useTheme } from 'styled-components';
import { useIsMobile } from '../../../utils';

const Container = styled.section`
  position: relative;
  background-color: ${({ theme }) => theme.color.surface.muted};
  transition: background-color 200ms cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
`;

const BackgroundAccent = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 70% 50% at 15% 60%,
    rgba(143, 188, 187, 0.12) 0%,
    transparent 70%
  );
  pointer-events: none;
`;

const Content = styled.div`
  display: grid;
  justify-items: center;
  row-gap: ${({ theme }) => theme.space[16]};
`;

/* ---- Showcase row ---- */
const ShowcaseRow = styled.div`
  display: grid;
  justify-items: center;
  row-gap: ${({ theme }) => theme.space[12]};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => `${theme.space[8]} ${theme.space[12]}`};
    align-items: center;
  }
`;

const ShowcaseRowReverse = styled(ShowcaseRow)`
  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    direction: rtl;

    & > * {
      direction: ltr;
    }
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.div`
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    text-align: start;
  }
`;

const Paragraph = styled(SectionParagraph)`
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    text-align: start;
  }
`;

/* ---- Stats bar ---- */
const StatsBar = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.surface.base};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatItem = styled(motion.div)`
  padding: ${({ theme }) => `${theme.space[8]} ${theme.space[6]}`};
  text-align: center;
  border-right: 1px solid ${({ theme }) => theme.color.surface.border};
  border-bottom: 1px solid ${({ theme }) => theme.color.surface.border};

  &:nth-child(2n) {
    border-right: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    border-bottom: none;

    &:nth-child(2n) {
      border-right: 1px solid ${({ theme }) => theme.color.surface.border};
    }

    &:last-child {
      border-right: none;
    }
  }
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.size.xxxl};
  font-weight: ${({ theme }) => theme.typography.weight.heavy};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.color.text.secondary};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

/* card float animation */
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;

const FloatingCard = styled.div`
  animation: ${float} 4s ease-in-out infinite;
`;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

interface Stat {
  number: string;
  label: string;
  color: string;
}

export function DetailSection() {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const cardWidth = isMobile ? 220 : 280;
  const cardHeight = isMobile ? 360 : 480;
  const textRef = useRef(null);
  const isTextInView = useInView(textRef, { once: true, amount: 0.2 });
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });

  const stats: Stat[] = [
    { number: '11,000+', label: 'Unique cards', color: theme.color.frost.blue },
    { number: '150+', label: 'TCG sets', color: theme.color.frost.teal },
    { number: '30', label: 'Years of history', color: theme.color.aurora.purple },
    { number: '∞', label: 'Possibilities', color: theme.color.aurora.green },
  ];

  return (
    <Container>
      <BackgroundAccent />
      <SectionWrapper>
        <Content>
          {/* Showcase row 1: card on left, text on right */}
          <ShowcaseRow>
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, ease: 'easeOut' as const }}
            >
              <ImageContainer>
                <FloatingCard>
                  <DisplayCard
                    title='Clefairy'
                    display
                    bg={theme.color.frost.teal}
                    imageUrl='https://img.pokemondb.net/sprites/home/normal/clefairy.png'
                    style={{
                      backgroundColor: theme.color.aurora.purple,
                      boxShadow: theme.shadow.lg,
                      borderRadius: theme.radius.xl,
                    }}
                    height={cardHeight}
                    width={cardWidth}
                    image={{ width: '8.5em', height: '8.5em' }}
                    imageRadius={theme.radius.lg}
                    titleSize='1.1em'
                  />
                </FloatingCard>
              </ImageContainer>
            </motion.div>

            <motion.div
              ref={textRef}
              variants={containerVariants}
              initial='hidden'
              animate={isTextInView ? 'visible' : 'hidden'}
            >
              <TextContainer>
                <motion.div variants={itemVariants}>
                  <SectionText>Your own collection.</SectionText>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Paragraph>
                    A dedicated space to organize, showcase, and grow your Pokémon
                    card collection. Whether you're a long-time collector or just
                    starting out, Polardex makes it effortless to catalog cards,
                    track rarities, and discover what's still missing from your set.
                  </Paragraph>
                </motion.div>
              </TextContainer>
            </motion.div>
          </ShowcaseRow>

          {/* Showcase row 2: text on left, card on right (reversed) */}
          <ShowcaseRowReverse>
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, ease: 'easeOut' as const }}
            >
              <ImageContainer>
                <FloatingCard style={{ animationDelay: '1.2s' }}>
                  <DisplayCard
                    title='Charizard'
                    display
                    bg={theme.color.aurora.red}
                    imageUrl='https://img.pokemondb.net/sprites/home/normal/charizard.png'
                    style={{
                      backgroundColor: theme.color.aurora.orange,
                      boxShadow: theme.shadow.lg,
                      borderRadius: theme.radius.xl,
                    }}
                    height={cardHeight}
                    width={cardWidth}
                    image={{ width: '8.5em', height: '8.5em' }}
                    imageRadius={theme.radius.lg}
                    titleSize='1.1em'
                  />
                </FloatingCard>
              </ImageContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut' as const }}
            >
              <TextContainer>
                <SectionText>Hunt the rares.</SectionText>
                <Paragraph>
                  From Base Set holographics to modern alternate-art secret rares,
                  keeping track of the cards you're chasing has never been easier.
                  Mark cards as owned, wishlist them, or log trades to build the
                  collection you've always dreamed of.
                </Paragraph>
              </TextContainer>
            </motion.div>
          </ShowcaseRowReverse>

          {/* Stats bar */}
          <motion.div
            ref={statsRef}
            variants={containerVariants}
            initial='hidden'
            animate={isStatsInView ? 'visible' : 'hidden'}
            style={{ width: '100%' }}
          >
            <StatsBar>
              {stats.map((s) => (
                <StatItem key={s.label} variants={statVariants}>
                  <StatNumber style={{ color: s.color }}>{s.number}</StatNumber>
                  <StatLabel>{s.label}</StatLabel>
                </StatItem>
              ))}
            </StatsBar>
          </motion.div>
        </Content>
      </SectionWrapper>
    </Container>
  );
}
