import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { toSpriteName } from '../../../utils';
import { Modal } from '../../../components';
import { CardModel } from '../../../api/fetch/card/cardModel';
import { saveCard, saveAttribute, removeCard, generateCardId } from '../../../api/mutations';
import { StudioModalDialog } from './StudioModalDialog';
import { StudioModalCanvas } from './StudioModalCanvas';

// ── Shared draft types ────────────────────────────────────────────────────────

export interface CardDraft {
  cardId: string;
  name: string;
  pokemonId: string;
  type: string;
  set: string;
  cardType: string;
  rarity: string;
  condition: string;
  year: string;
  setNumber: string;
  grading: string;
  quantity: number;
  tcgId: string;
  tcgImageUrl: string;
}

export interface AttributeDraft {
  name: string;
  year: string;
  totalCards: string;
}

export const emptyCardDraft: CardDraft = {
  cardId: '', name: '', pokemonId: '', type: '',
  set: '', cardType: '', rarity: '', condition: '',
  year: '', setNumber: '', grading: '', quantity: 1,
  tcgId: '', tcgImageUrl: '',
};

export const emptyAttributeDraft: AttributeDraft = { name: '', year: '', totalCards: '' };

// ── Helpers ───────────────────────────────────────────────────────────────────

function draftToCard(draft: CardDraft, existing?: CardModel): CardModel {
  const cardId = draft.cardId || generateCardId();
  return {
    cardId,
    quantity: draft.quantity ?? existing?.quantity ?? 1,
    setNumber: Number(draft.setNumber.split('/')[0]) || 0,
    attributes: {
      cardType: draft.cardType,
      set: draft.set,
      rarity: draft.rarity || existing?.attributes?.rarity || '',
      condition: draft.condition,
      grading: Number(draft.grading) || 0,
      isGraded: !!draft.grading,
      tcgId: draft.tcgId || existing?.attributes?.tcgId || '',
      tcgImageUrl: draft.tcgImageUrl || existing?.attributes?.tcgImageUrl || '',
    },
    pokemonData: {
      name: draft.name,
      id: Number(draft.pokemonId.replace(/\D/g, '')) || 0,
      evolutions: existing?.pokemonData?.evolutions ?? { first: { name: '', imageUrl: '' } },
      type: draft.type,
      imageUrl: draft.tcgImageUrl ||
        existing?.pokemonData?.imageUrl ||
        `https://img.pokemondb.net/sprites/home/normal/${toSpriteName(draft.name)}.png`,
    },
  };
}

export function cardToDraft(card: CardModel): CardDraft {
  return {
    cardId: card.cardId,
    name: card.pokemonData.name,
    pokemonId: `#${String(card.pokemonData.id).padStart(3, '0')}`,
    type: card.pokemonData.type,
    set: card.attributes.set,
    cardType: card.attributes.cardType,
    rarity: card.attributes.rarity ?? '',
    condition: card.attributes.condition,
    year: '',
    setNumber: String(card.setNumber),
    grading: card.attributes.grading ? String(card.attributes.grading) : '',
    quantity: card.quantity ?? 1,
    tcgId: card.attributes.tcgId ?? '',
    tcgImageUrl: card.attributes.tcgImageUrl ?? '',
  };
}

// ── Styled components ─────────────────────────────────────────────────────────

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.space[4]} ${theme.space[5]}`};
  border-bottom: 1px solid ${({ theme }) => theme.color.surface.muted};
  flex-shrink: 0;
`;

const ActionLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.color.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.color.text.secondary};
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: background-color ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.color.text.primaryHover};
    color: ${({ theme }) => theme.color.text.primary};
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
`;

const DialogPane = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${({ theme }) => theme.space[5]};
  overflow-y: auto;
  min-width: 0;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.color.surface.muted} transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.surface.muted};
    border-radius: 4px;
  }
`;

const CanvasPane = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: ${({ theme }) => theme.color.surface.muted};
  border-left: 1px solid ${({ theme }) => theme.color.surface.muted};
  overflow: hidden;
  min-width: 0;

  @media (max-width: 56.25em) {
    display: none;
  }
`;

// ── Success overlay ───────────────────────────────────────────────────────────

const SuccessOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.color.surface.subtle};
  z-index: 20;
`;

const CheckRing = styled(motion.div)`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: ${({ theme }) => `${theme.color.aurora.green}18`};
  border: 2px solid ${({ theme }) => `${theme.color.aurora.green}40`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.aurora.green};
`;

const SuccessMessage = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
`;

const SuccessSubtext = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0;
`;

// ── Action labels ─────────────────────────────────────────────────────────────

const headerLabels: Record<string, string> = {
  add: 'Add Card',
  modify: 'Modify Card',
  attribute: 'New Attribute',
};

const successLabels: Record<string, [string, string]> = {
  add: ['Card added!', 'Your card has been saved to the collection.'],
  modify: ['Card updated!', 'Your changes have been saved.'],
  attribute: ['Attribute created!', 'The new set has been added.'],
  delete: ['Card deleted!', 'The card has been removed.'],
};

// ── Main component ────────────────────────────────────────────────────────────

interface StudioModalProps {
  isOpen: boolean;
  actionType: string;
  onClose: () => void;
  preselectedCard?: CardModel | null;
  prefilledDraft?: Partial<CardDraft>;
}

export function StudioModal({ isOpen, onClose, actionType, preselectedCard, prefilledDraft }: StudioModalProps) {
  const [cardDraft, setCardDraft] = useState<CardDraft>(
    preselectedCard
      ? cardToDraft(preselectedCard)
      : prefilledDraft
      ? { ...emptyCardDraft, ...prefilledDraft }
      : emptyCardDraft
  );
  const [attributeDraft, setAttributeDraft] = useState<AttributeDraft>(emptyAttributeDraft);
  const [selectedCard, setSelectedCard] = useState<CardModel | null>(preselectedCard ?? null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'delete-success' | 'error'>('idle');

  // Sync draft when a preselected card is passed (e.g. clicking a card in Studio grid)
  useEffect(() => {
    if (preselectedCard) {
      setSelectedCard(preselectedCard);
      setCardDraft(cardToDraft(preselectedCard));
    }
  }, [preselectedCard]);

  const handleCardSelect = (card: CardModel) => {
    setSelectedCard(card);
    setCardDraft(cardToDraft(card));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      if (actionType === 'attribute') {
        await saveAttribute({
          id: `attr_${Date.now()}`,
          name: attributeDraft.name,
          type: 'set',
          meta: {
            year: Number(attributeDraft.year) || undefined,
            totalCards: Number(attributeDraft.totalCards) || undefined,
          },
        });
      } else {
        await saveCard(draftToCard(cardDraft, selectedCard ?? undefined));
      }
      setSaveStatus('success');
      setTimeout(() => { setSaveStatus('idle'); handleClose(); }, 2000);
    } catch {
      setSaveStatus('error');
    }
  };

  const handleSaveDraft = async (draft: CardDraft) => {
    setSaveStatus('saving');
    try {
      await saveCard(draftToCard(draft, selectedCard ?? undefined));
      setSaveStatus('success');
      setTimeout(() => { setSaveStatus('idle'); handleClose(); }, 2000);
    } catch {
      setSaveStatus('error');
    }
  };

  const handleDelete = async () => {
    if (!selectedCard?.cardId) return;
    setSaveStatus('saving');
    try {
      await removeCard(selectedCard.cardId);
      setSaveStatus('delete-success');
      setTimeout(() => { setSaveStatus('idle'); handleClose(); }, 2000);
    } catch {
      setSaveStatus('error');
    }
  };

  const handleClose = () => {
    if (saveStatus === 'saving') return;
    setSaveStatus('idle');
    setCardDraft(emptyCardDraft);
    setAttributeDraft(emptyAttributeDraft);
    setSelectedCard(null);
    onClose();
  };

  const [successTitle, successSub] = successLabels[
    saveStatus === 'delete-success' ? 'delete' : actionType
  ] ?? ['Saved!', ''];

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Container>
        <ModalHeader>
          <ActionLabel>{headerLabels[actionType] ?? 'Studio'}</ActionLabel>
          <CloseButton className='icon-close' onClick={handleClose} aria-label='Close'>
            <IconX size={16} stroke={2} />
          </CloseButton>
        </ModalHeader>

        <ContentContainer>
          <DialogPane>
            <StudioModalDialog
              type={actionType}
              cardDraft={cardDraft}
              attributeDraft={attributeDraft}
              onCardDraftChange={setCardDraft}
              onAttributeDraftChange={setAttributeDraft}
              onCardSelect={handleCardSelect}
              onSave={handleSave}
              onSaveDraft={handleSaveDraft}
              onDelete={handleDelete}
              saving={saveStatus === 'saving'}
              canDelete={actionType === 'modify' && !!selectedCard}
            />
          </DialogPane>
          <CanvasPane>
            <StudioModalCanvas type={actionType} cardDraft={cardDraft} />
          </CanvasPane>
        </ContentContainer>

        {/* ── Success overlay ── */}
        <AnimatePresence>
          {(saveStatus === 'success' || saveStatus === 'delete-success') && (
            <SuccessOverlay
              key='success'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CheckRing
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.05 }}
              >
                <IconCheck size={36} stroke={2.5} />
              </CheckRing>
              <SuccessMessage
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                {successTitle}
              </SuccessMessage>
              <SuccessSubtext
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {successSub}
              </SuccessSubtext>
            </SuccessOverlay>
          )}
        </AnimatePresence>
      </Container>
    </Modal>
  );
}
