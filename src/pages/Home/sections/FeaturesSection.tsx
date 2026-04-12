import styled from 'styled-components';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  IconCards,
  IconSparkles,
  IconSearch,
} from '@tabler/icons-react';
import { SectionWrapper } from './sectionStyles';
import { Link } from 'react-router-dom';

const Container = styled.section`
  background-color: ${({ theme }) => theme.color.surface.base};
  transition: background-color 200ms cubic-bezier(0.22, 1, 0.36, 1);
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
  color: ${({ theme }) => theme.color.frost.deep};
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

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.space[8]};
  }
`;

const FeatureCard = styled(motion.div)`
  position: relative;
  background-color: ${({ theme }) => theme.color.surface.muted};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.space[8]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  cursor: default;
  transition: box-shadow 250ms cubic-bezier(0.22, 1, 0.36, 1), border-color 250ms cubic-bezier(0.22, 1, 0.36, 1), transform 250ms cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.md};
    border-color: transparent;
    transform: translateY(-3px);
  }
`;

const IconBadge = styled.div<{ $accent: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ $accent }) => $accent};
  color: #fff;
  flex-shrink: 0;
`;

const CardGlow = styled.div<{ $accent: string }>`
  position: absolute;
  top: -40px;
  right: -40px;
  width: 140px;
  height: 140px;
  border-radius: 9999px;
  background: ${({ $accent }) => $accent};
  filter: blur(60px);
  opacity: 0.18;
  pointer-events: none;
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  flex: 1;
`;

const FeatureLink = styled(Link)<{ $accent: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ $accent }) => $accent};
  text-decoration: none;
  margin-top: auto;
  transition: opacity 150ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    opacity: 0.75;
  }
`;

const Arrow = styled.span`
  display: inline-block;
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);

  ${FeatureLink}:hover & {
    transform: translateX(3px);
  }
`;

interface Feature {
  icon: React.ReactNode;
  accent: string;
  title: string;
  description: string;
  to: string;
  cta: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const features: Feature[] = [
    {
      icon: <IconCards size={24} />,
      accent: '#81a1c1',
      title: 'Your Collection',
      description:
        'Organize every card you own in one searchable Collection. Filter by set, rarity, or Pokémon name and watch it grow over time.',
      to: '/collections',
      cta: 'Browse collection',
    },
    {
      icon: <IconSearch size={24} />,
      accent: '#8fbcbb',
      title: 'Discover Sets',
      description:
        'Explore iconic Pokémon TCG sets from Base Set to modern expansions. Track which cards you own and which ones are still on your wish list.',
      to: '/sets',
      cta: 'Explore sets',
    },
    {
      icon: <IconSparkles size={24} />,
      accent: '#b48ead',
      title: 'Studio Editor',
      description:
        'Design and customize cards with your own illustrations and text. Bring a unique creative vision to your collection using the built-in canvas editor.',
      to: '/studio',
      cta: 'Open Studio',
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
            <EyebrowLabel>Everything you need</EyebrowLabel>
            <SectionTitle>Built for collectors.</SectionTitle>
            <SectionSubtitle>
              From cataloging your first card to crafting custom artwork, Polardex
              is designed to make every part of the hobby enjoyable.
            </SectionSubtitle>
          </Header>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
        >
          <Grid>
            {features.map((f) => (
              <FeatureCard key={f.title} variants={cardVariants}>
                <CardGlow $accent={f.accent} />
                <IconBadge $accent={f.accent}>{f.icon}</IconBadge>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureDescription>{f.description}</FeatureDescription>
                <FeatureLink to={f.to} $accent={f.accent}>
                  {f.cta} <Arrow>→</Arrow>
                </FeatureLink>
              </FeatureCard>
            ))}
          </Grid>
        </motion.div>
      </SectionWrapper>
    </Container>
  );
}
