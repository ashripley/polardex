import styled from 'styled-components';
import { motion } from 'motion/react';
import { Card, Attribute } from '../../../components';
import { CardDraft } from './StudioModal';

interface StudioModalCanvasProps {
  type: string;
  cardDraft: CardDraft;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => theme.space[6]};
`;

const Label = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.tertiary};
  text-align: center;
  margin: 0;
`;

const TcgImg = styled(motion.img)`
  max-width: 260px;
  width: 100%;
  height: auto;
  border-radius: 12px;
  display: block;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08);
`;

export function StudioModalCanvas({ type, cardDraft }: StudioModalCanvasProps) {
  // Only show the card preview once a Pokémon has been properly selected
  // (i.e. pokemonId is populated - either from autocomplete or manual entry)
  const canPreview = !!cardDraft.name.trim() && !!cardDraft.pokemonId.trim();

  if (type === 'attribute') {
    return (
      <Wrapper>
        <Attribute inOverview={false} />
      </Wrapper>
    );
  }

  if (type === 'add' || type === 'modify') {
    if (!canPreview) {
      return (
        <Wrapper>
          <Label>
            {cardDraft.name.trim()
              ? 'Select a Pokémon from the suggestions to see a preview.'
              : 'Start filling in the form to see a live preview.'}
          </Label>
        </Wrapper>
      );
    }

    if (cardDraft.tcgImageUrl) {
      return (
        <Wrapper>
          <TcgImg
            key={cardDraft.tcgImageUrl}
            src={cardDraft.tcgImageUrl}
            alt={cardDraft.name}
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, scale: 1.02, boxShadow: '0 28px 80px rgba(0,0,0,0.45)' }}
          />
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <Card
          key={cardDraft.name + cardDraft.tcgImageUrl}
          pokemonData={{
            name: cardDraft.name,
            id: cardDraft.pokemonId || undefined,
            type: cardDraft.type || undefined,
            imageUrl: cardDraft.tcgImageUrl || undefined,
          }}
          attributes={{
            cardType: cardDraft.cardType || undefined,
            condition: cardDraft.condition || undefined,
            set: cardDraft.set || undefined,
            grading: cardDraft.grading ? Number(cardDraft.grading) : undefined,
            year: cardDraft.year ? Number(cardDraft.year) : undefined,
          }}
          setNumber={cardDraft.setNumber || ''}
        />
      </Wrapper>
    );
  }

  return null;
}
