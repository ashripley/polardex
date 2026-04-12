import { doc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import { firestore } from '../services/firebase.config';
import { CardModel } from './fetch/card/cardModel';
import { AttributeModel } from './fetch/attributes/attributesModel';

const isReadOnly = () => sessionStorage.getItem('polardex_readonly') === 'true';

const cardsRef = () => doc(firestore, 'cards', 'data');
const attributesRef = () => doc(firestore, 'attributes', 'data');

function stripUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, typeof v === 'object' && v !== null ? stripUndefined(v) : v])
  ) as T;
}

/** Add or overwrite a card in the cards document. */
export async function saveCard(card: CardModel): Promise<void> {
  if (isReadOnly()) return;
  const now = Date.now();
  const withTimestamps: CardModel = {
    ...card,
    createdAt: card.createdAt ?? now,
    updatedAt: now,
  };
  const clean = stripUndefined(withTimestamps);
  await setDoc(cardsRef(), { [clean.cardId]: clean }, { merge: true });
}

/** Remove a card from the cards document. */
export async function removeCard(cardId: string): Promise<void> {
  if (isReadOnly()) return;
  await updateDoc(cardsRef(), { [cardId]: deleteField() });
}

/** Add or overwrite an attribute in the attributes document. */
export async function saveAttribute(attribute: AttributeModel): Promise<void> {
  if (isReadOnly()) return;
  await setDoc(attributesRef(), { [attribute.id]: attribute }, { merge: true });
}

/** Generate a short unique card ID. */
export function generateCardId(): string {
  return `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
