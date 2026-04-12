import styled, { keyframes, useTheme } from 'styled-components';
import { SectionParagraph, SectionWrapper } from './sectionStyles';
import { DisplayCard } from '../../../components';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { useInView } from 'motion/react';
import { motion } from 'motion/react';
import { useIsMobile } from '../../../utils';
import {
  IconPalette,
  IconPhoto,
  IconTypography,
} from '@tabler/icons-react';

const Container = styled.section`
  position: relative;
  background-color: ${({ theme }) => theme.color.surface.base};
  overflow: hidden;
  transition: background-color 200ms cubic-bezier(0.22, 1, 0.36, 1);
`;

const GradientAccent = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 60% 60% at 85% 40%,
    rgba(180, 142, 173, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
`;

const Content = styled.div`
  display: grid;
  justify-items: center;
  gap: ${({ theme }) => theme.space[16]};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: ${({ theme }) => `${theme.space[8]} ${theme.space[16]}`};
  }
`;

const TextSide = styled.div`
  text-align: center;
  order: 2;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    text-align: start;
    order: 1;
  }
`;

const CardSide = styled.div`
  order: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 0;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    order: 2;
  }
`;

const EyebrowLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.aurora.purple};
  margin: 0 0 ${({ theme }) => theme.space[3]} 0;
`;

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.space[4]} 0;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    font-size: ${({ theme }) => theme.typography.size.xxxl};
  }
`;

const GradientWord = styled.span`
  background-image: linear-gradient(
    135deg,
    ${({ theme }) => theme.color.aurora.purple} 0%,
    ${({ theme }) => theme.color.frost.blue} 100%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Paragraph = styled(SectionParagraph)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space[8]};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    text-align: start;
  }
`;

const ToolList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${({ theme }) => theme.space[8]} 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    align-items: flex-start;
  }
`;

const ToolItem = styled(motion.li)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const ToolIcon = styled.span<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    justify-content: flex-start;
  }
`;

const CtaLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.color.text.primary};
  border: 1.5px solid ${({ theme }) => theme.color.surface.border};
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[5]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  transition: border-color 150ms cubic-bezier(0.22, 1, 0.36, 1), color 150ms cubic-bezier(0.22, 1, 0.36, 1), background 150ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    border-color: ${({ theme }) => theme.color.frost.blue};
    color: ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => `${theme.color.frost.blue}12`};
  }
`;

const ArrowSpan = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  font-size: 1em;
  line-height: 1;
  transform-origin: left center;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);

  ${CtaLink}:hover & {
    transform: scaleX(1.2);
  }
`;

/* Card stack */
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(var(--rot)); }
  50%       { transform: translateY(-12px) rotate(var(--rot)); }
`;

const StackedCard = styled.div<{ $rot: string; $delay: string; $z: number }>`
  --rot: ${({ $rot }) => $rot};
  position: relative;
  z-index: ${({ $z }) => $z};
  animation: ${float} 5s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
  flex-shrink: 0;
`;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const cardStackVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: 'easeOut' as const },
  },
};

export function StudioSection() {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const textRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const isTextVisible = useInView(textRef, { once: true, amount: 0.2 });
  const isCardsVisible = useInView(cardsRef, { once: true, amount: 0.2 });

  const cardHeight = isMobile ? 300 : 480;
  const cardWidth = isMobile ? 200 : 300;
  const imgSize = isMobile ? '6rem' : '8rem';

  const tools = [
    {
      icon: <IconPhoto size={16} />,
      label: 'Upload custom card artwork and sprites',
      color: theme.color.frost.blue,
    },
    {
      icon: <IconTypography size={16} />,
      label: 'Edit card names, descriptions, and stats',
      color: theme.color.frost.teal,
    },
    {
      icon: <IconPalette size={16} />,
      label: 'Choose accent colors and card styles',
      color: theme.color.aurora.purple,
    },
  ];

  return (
    <Container>
      <GradientAccent />
      <SectionWrapper>
        <Content>
          <motion.div
            ref={textRef}
            variants={containerVariants}
            initial='hidden'
            animate={isTextVisible ? 'visible' : 'hidden'}
          >
            <TextSide>
              <motion.div variants={itemVariants}>
                <EyebrowLabel>Creative tools</EyebrowLabel>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Heading>
                  Studio. Your <GradientWord>personal canvas.</GradientWord>
                </Heading>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Paragraph>
                  Bring your cards to life. Take the cards in your collection and
                  customize them like never before - from unique illustrations to
                  personalized text. Intuitive tools, endless possibilities.
                </Paragraph>
              </motion.div>
              <motion.div variants={itemVariants}>
                <ToolList>
                  {tools.map((t) => (
                    <ToolItem key={t.label} variants={itemVariants}>
                      <ToolIcon $color={t.color}>{t.icon}</ToolIcon>
                      {t.label}
                    </ToolItem>
                  ))}
                </ToolList>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Buttons>
                  <CtaLink to='/studio'>
                    Open Studio
                    <ArrowSpan>→</ArrowSpan>
                  </CtaLink>
                </Buttons>
              </motion.div>
            </TextSide>
          </motion.div>

          <motion.div
            ref={cardsRef}
            variants={cardStackVariants}
            initial='hidden'
            animate={isCardsVisible ? 'visible' : 'hidden'}
          >
            <CardSide>
              {!isMobile && (
                <StackedCard
                  $rot='-8deg'
                  $delay='0s'
                  $z={1}
                  style={{ marginRight: -100, marginBottom: 50 }}
                >
                  <motion.div variants={cardItemVariants}>
                    <DisplayCard
                      title='Rhydon'
                      display
                      bg={theme.color.aurora.orange}
                      imageUrl='https://img.pokemondb.net/sprites/home/normal/rhydon.png'
                      style={{
                        boxShadow: theme.shadow.md,
                        borderRadius: theme.radius.xl,
                      }}
                      height={cardHeight}
                      width={cardWidth}
                      image={{ width: imgSize, height: imgSize }}
                      titleSize='1.1em'
                    />
                  </motion.div>
                </StackedCard>
              )}

              <StackedCard $rot='0deg' $delay='0.6s' $z={3}>
                <motion.div variants={cardItemVariants}>
                  <DisplayCard
                    title='Charizard'
                    display
                    bg={theme.color.aurora.red}
                    imageUrl='https://img.pokemondb.net/sprites/home/normal/charizard.png'
                    style={{
                      boxShadow: theme.shadow.lg,
                      borderRadius: theme.radius.xl,
                    }}
                    height={cardHeight}
                    width={cardWidth}
                    image={{ width: imgSize, height: imgSize }}
                    titleSize='1.1em'
                  />
                </motion.div>
              </StackedCard>

              {!isMobile && (
                <StackedCard
                  $rot='7deg'
                  $delay='1.2s'
                  $z={1}
                  style={{ marginLeft: -100, marginBottom: 50 }}
                >
                  <motion.div variants={cardItemVariants}>
                    <DisplayCard
                      title='Blastoise'
                      display
                      bg={theme.color.frost.blue}
                      imageUrl='https://img.pokemondb.net/sprites/home/normal/blastoise.png'
                      style={{
                        boxShadow: theme.shadow.md,
                        borderRadius: theme.radius.xl,
                      }}
                      height={cardHeight}
                      width={cardWidth}
                      image={{ width: imgSize, height: imgSize }}
                      titleSize='1.1em'
                    />
                  </motion.div>
                </StackedCard>
              )}
            </CardSide>
          </motion.div>
        </Content>
      </SectionWrapper>
    </Container>
  );
}
