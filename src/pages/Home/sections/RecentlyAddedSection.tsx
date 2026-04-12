import styled from 'styled-components';
import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconClock } from '@tabler/icons-react';
import { SectionWrapper } from './sectionStyles';
import { useGetCardsQuery } from '../../../api';
import { toSpriteName } from '../../../utils';
import { easeOut } from '../../../theme/motion';

/**
 * Personal "Recently added" strip shown to logged-in users on Home. Only
 * renders when the collection has at least one card — otherwise the home
 * page stays as the marketing layout. Pulls from CardModel.createdAt and
 * falls back to alphabetical order for legacy cards without a timestamp.
 */

const RECENT_COUNT = 6;

const Container = styled.section`
  background-color: ${({ theme }) => theme.color.surface.muted};
  padding: ${({ theme }) => `${theme.space[10]} 0`};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    padding: ${({ theme }) => `${theme.space[16]} 0`};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};
  flex-wrap: wrap;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;

const Eyebrow = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.frost.blue};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const Title = styled.h2`
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
  letter-spacing: -0.01em;
`;

const ViewAll = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.color.frost.blue};
  text-decoration: none;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  transition: background 180ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    background: ${({ theme }) => `${theme.color.frost.blue}14`};
  }
`;

const Strip = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: ${({ theme }) => theme.space[3]};
  scrollbar-width: thin;

  /* Bleed to the viewport edges on mobile so the strip looks intentional */
  margin: 0 calc(-1 * ${({ theme }) => theme.space[4]});
  padding-left: ${({ theme }) => theme.space[4]};
  padding-right: ${({ theme }) => theme.space[4]};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    margin: 0;
    padding-left: 0;
    padding-right: 0;
  }

  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => `${theme.color.frost.blue}55`};
    border-radius: 2px;
  }
`;

const CardItem = styled(motion(Link))`
  flex-shrink: 0;
  width: 10rem;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.surface.base};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  text-decoration: none;
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1), border-color 200ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-3px);
    border-color: ${({ theme }) => theme.color.frost.blue};
  }
`;

const CardImg = styled.img`
  width: 100%;
  aspect-ratio: 2.5 / 3.5;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface.muted};
`;

const CardName = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardMeta = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.color.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function formatAgo(ts: number | undefined): string {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(diff / day);
  if (days < 1) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function RecentlyAddedSection() {
  const { cards, loading } = useGetCardsQuery();

  const recent = useMemo(() => {
    if (!cards.length) return [];
    return cards
      .filter((c) => (c.status ?? 'owned') !== 'wishlist')
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
      .slice(0, RECENT_COUNT);
  }, [cards]);

  // Hide the section entirely when no cards exist — users who haven't added
  // anything yet get the full marketing layout without personal gaps.
  if (loading || recent.length === 0) return null;

  return (
    <Container>
      <SectionWrapper>
        <Header>
          <TitleBlock>
            <Eyebrow>
              <IconClock size={12} stroke={2.5} />
              Recently added
            </Eyebrow>
            <Title>Fresh in your collection</Title>
          </TitleBlock>
          <ViewAll to='/collections'>
            View all
            <IconArrowRight size={14} stroke={2.5} />
          </ViewAll>
        </Header>
        <Strip>
          {recent.map((card, i) => {
            const img =
              card.attributes.tcgImageUrl ||
              `https://img.pokemondb.net/sprites/home/normal/${toSpriteName(card.pokemonData.name)}.png`;
            return (
              <CardItem
                key={card.cardId}
                to={`/collections?card=${encodeURIComponent(card.attributes.tcgId ?? card.cardId)}`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: easeOut }}
              >
                <CardImg src={img} alt={card.pokemonData.name} loading='lazy' />
                <CardName>{card.pokemonData.name}</CardName>
                <CardMeta>
                  {card.attributes.set}
                  {card.createdAt && ` · ${formatAgo(card.createdAt)}`}
                </CardMeta>
              </CardItem>
            );
          })}
        </Strip>
      </SectionWrapper>
    </Container>
  );
}
