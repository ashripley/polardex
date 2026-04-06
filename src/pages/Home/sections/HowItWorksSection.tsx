import styled from 'styled-components';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { IconPlus, IconLayoutGrid, IconStar } from '@tabler/icons-react';
import { SectionWrapper } from './sectionStyles';

const Container = styled.section`
  background-color: ${({ theme }) => theme.color.surface.muted};
  transition: background-color 200ms ease;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space[12]};
`;

const EyebrowLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.aurora.green};
  margin: 0 0 ${({ theme }) => theme.space[3]} 0;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.space[4]} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    font-size: ${({ theme }) => theme.typography.size.xxxl};
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.color.text.secondary};
  max-width: 52ch;
  margin: 0 auto;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    font-size: ${({ theme }) => theme.typography.size.lg};
  }
`;

const Steps = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
  position: relative;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.space[8]};
  }
`;

const ConnectorLine = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: block;
    position: absolute;
    top: 28px;
    left: calc(33.33% + 24px);
    right: calc(33.33% + 24px);
    height: 1px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.color.surface.border} 0%,
      ${({ theme }) => theme.color.surface.border} 40%,
      transparent 100%
    );

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: calc(50% - 24px);
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        ${({ theme }) => theme.color.surface.border} 60%,
        ${({ theme }) => theme.color.surface.border} 100%
      );
    }
  }
`;

const Step = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.space[8]};
  background-color: ${({ theme }) => theme.color.surface.base};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  position: relative;
`;

const StepNumber = styled.div<{ $accent: string }>`
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  background-color: ${({ $accent }) => $accent}18;
  border: 2px solid ${({ $accent }) => $accent}40;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $accent }) => $accent};
  margin-bottom: ${({ theme }) => theme.space[5]};
  flex-shrink: 0;
`;

const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.space[3]} 0;
`;

const StepDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.color.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
`;

/* TCG fact strip */
const FactStrip = styled.div`
  margin-top: ${({ theme }) => theme.space[12]};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.color.frost.deep}18 0%,
    ${({ theme }) => theme.color.aurora.purple}14 100%
  );
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => `${theme.space[8]} ${theme.space[10]}`};
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: 1fr auto;
    gap: ${({ theme }) => theme.space[12]};
  }
`;

const FactText = styled.p`
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    font-size: ${({ theme }) => theme.typography.size.xl};
  }
`;

const FactHighlight = styled.span`
  color: ${({ theme }) => theme.color.frost.deep};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const FactBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  background-color: ${({ theme }) => theme.color.surface.base};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.full};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]}`};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.color.text.secondary};
  white-space: nowrap;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const factRef = useRef(null);
  const isFactInView = useInView(factRef, { once: true, amount: 0.4 });

  const steps = [
    {
      icon: <IconPlus size={24} />,
      accent: '#81a1c1',
      title: 'Add your cards',
      description:
        'Use Studio to add each card in your collection. Set the Pokémon name, card set, rarity, and upload artwork.',
    },
    {
      icon: <IconLayoutGrid size={24} />,
      accent: '#8fbcbb',
      title: 'Browse your gallery',
      description:
        'Your Collection gallery shows every card you own. Filter, sort, and search to navigate your binder instantly.',
    },
    {
      icon: <IconStar size={24} />,
      accent: '#b48ead',
      title: 'Track & celebrate',
      description:
        'Watch your collection grow, mark cards as favorites, and share your most prized holographics with pride.',
    },
  ];

  return (
    <Container>
      <SectionWrapper>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Header>
            <EyebrowLabel>How it works</EyebrowLabel>
            <SectionTitle>Up and running in minutes.</SectionTitle>
            <SectionSubtitle>
              Three simple steps to get your entire Pokémon card collection
              cataloged and beautifully displayed.
            </SectionSubtitle>
          </Header>
        </motion.div>

        <div style={{ position: 'relative' }}>
          <ConnectorLine />
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
          >
            <Steps>
              {steps.map((s, i) => (
                <Step key={s.title} variants={stepVariants}>
                  <StepNumber $accent={s.accent}>{s.icon}</StepNumber>
                  <StepTitle>
                    <span style={{ color: s.accent, marginRight: '0.3ch' }}>{i + 1}.</span>
                    {s.title}
                  </StepTitle>
                  <StepDescription>{s.description}</StepDescription>
                </Step>
              ))}
            </Steps>
          </motion.div>
        </div>

        <motion.div
          ref={factRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isFactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <FactStrip>
            <FactText>
              Did you know? The Pokémon TCG has printed over{' '}
              <FactHighlight>11,000 unique cards</FactHighlight> across{' '}
              <FactHighlight>150+ expansion sets</FactHighlight> since 1996 - and new
              sets still release every few months.
            </FactText>
            <FactBadge>
              <IconStar size={14} />
              Since 1996
            </FactBadge>
          </FactStrip>
        </motion.div>
      </SectionWrapper>
    </Container>
  );
}
