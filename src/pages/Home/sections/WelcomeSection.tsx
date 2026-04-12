import styled, { keyframes } from 'styled-components';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { SectionWrapper } from './sectionStyles';
import { Button, CardCollection } from '../../../components';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@tabler/icons-react';

const Container = styled.section`
  position: relative;
  display: flex;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.color.surface.muted};
  overflow: hidden;
  transition: background-color 200ms cubic-bezier(0.22, 1, 0.36, 1);
`;

/* Ambient background orbs */
const pulseOrb = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.35; }
  50%       { transform: scale(1.18); opacity: 0.55; }
`;

const Orb = styled.div<{ $size: string; $top: string; $left: string; $color: string; $delay: string }>`
  position: absolute;
  border-radius: 9999px;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  background: ${({ $color }) => $color};
  filter: blur(80px);
  animation: ${pulseOrb} 6s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
  pointer-events: none;
  z-index: 0;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  /* Tighter row-gap on small viewports — was space[12] (3rem) which felt
     excessive given the 100dvh hero on a phone. */
  row-gap: ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => `${theme.space[8]} 0`};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => `${theme.space[16]} ${theme.space[8]}`};
    align-items: center;
    padding: 0;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    align-items: flex-start;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  background-color: ${({ theme }) => theme.color.surface.base};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  margin-bottom: ${({ theme }) => theme.space[4]};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const BadgeDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background-color: ${({ theme }) => theme.color.aurora.green};
  flex-shrink: 0;
`;

const Heading = styled.h1`
  /* Fluid sizing — scales smoothly from 1.75rem on a 320px phone to xxxl on
     desktop without snap-points. Tested at 320px, 414px, 768px, 1280px. */
  font-size: clamp(1.75rem, 6vw, ${({ theme }) => theme.typography.size.xxxl});
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.space[4]} 0;
  text-align: center;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    text-align: start;
  }
`;

const AccentWord = styled.span`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.color.frost.blue} 0%,
    ${({ theme }) => theme.color.frost.teal} 50%,
    ${({ theme }) => theme.color.aurora.purple} 100%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subheading = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0 0 ${({ theme }) => theme.space[6]} 0;
  text-align: center;
  max-width: 38ch;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    text-align: start;
    font-size: ${({ theme }) => theme.typography.size.lg};
    margin-bottom: ${({ theme }) => theme.space[8]};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    justify-content: flex-start;
  }
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  text-decoration: none;
`;

const SecondaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.color.text.secondary};
  transition: color 200ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    color: ${({ theme }) => theme.color.text.primary};
  }
`;

const ArrowIcon = styled.span`
  display: inline-flex;
  align-items: center;
`;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export function WelcomeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Container>
      <Orb $size='480px' $top='-10%' $left='-8%' $color='rgba(129,161,193,0.3)' $delay='0s' />
      <Orb $size='360px' $top='30%' $left='50%' $color='rgba(143,188,187,0.25)' $delay='2s' />
      <Orb $size='300px' $top='60%' $left='5%' $color='rgba(180,142,173,0.2)' $delay='4s' />

      <SectionWrapper>
        <Content>
          <CardCollection />
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
          >
            <TextContainer>
              <motion.div variants={itemVariants}>
                <Badge>
                  <BadgeDot />
                  Pokémon TCG Collection Tracker
                </Badge>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Heading>
                  Store your <AccentWord>nostalgia.</AccentWord>
                </Heading>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Subheading>
                  Catalog, track, and celebrate your Pokémon card collection -
                  all in one beautifully crafted place.
                </Subheading>
              </motion.div>
              <motion.div variants={itemVariants}>
                <ButtonRow>
                  <PrimaryLink to='/collections'>
                    <Button buttonType='primary'>View Collection</Button>
                  </PrimaryLink>
                  <SecondaryLink to='/studio' className='icon-arr-r'>
                    Open Studio
                    <ArrowIcon><IconArrowRight size={16} /></ArrowIcon>
                  </SecondaryLink>
                </ButtonRow>
              </motion.div>
            </TextContainer>
          </motion.div>
        </Content>
      </SectionWrapper>
    </Container>
  );
}
