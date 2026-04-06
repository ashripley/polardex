import { doc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import { firestore } from '../services/firebase.config';
import { CardModel } from './fetch/card/cardModel';
import { AttributeModel } from './fetch/attributes/attributesModel';

const cardsRef = () => doc(firestore, 'cards', 'data');
const attributesRef = () => doc(firestore, 'attributes', 'data');

/** Add or overwrite a card in the cards document. */
export async function saveCard(card: CardModel): Promise<void> {
  await setDoc(cardsRef(), { [card.cardId]: card }, { merge: true });
}

/** Remove a card from the cards document. */
export async function removeCard(cardId: string): Promise<void> {
  await updateDoc(cardsRef(), { [cardId]: deleteField() });
}

/** Add or overwrite an attribute in the attributes document. */
export async function saveAttribute(attribute: AttributeModel): Promise<void> {
  await setDoc(attributesRef(), { [attribute.id]: attribute }, { merge: true });
}

/** Generate a short unique card ID. */
export function generateCardId(): string {
  return `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
