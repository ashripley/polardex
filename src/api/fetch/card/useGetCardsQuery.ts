import { doc, onSnapshot } from 'firebase/firestore';
import { CardModel } from './cardModel';
import { firestore } from '../../../services/firebase.config';
import { useEffect, useState } from 'react';

/**
 * Runtime guard — validates a value looks like a CardModel before letting it
 * through. The cards document in Firestore is a map of card records; if one
 * is corrupted or schema-drifted, we drop it instead of crashing on
 * `card.pokemonData.name.localeCompare(...)` downstream.
 *
 * Intentionally permissive: we only check the fields we actually use.
 */
function isValidCardModel(value: unknown): value is CardModel {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (typeof v.cardId !== 'string') return false;
  const pokemon = v.pokemonData as Record<string, unknown> | undefined;
  if (!pokemon || typeof pokemon !== 'object') return false;
  if (typeof pokemon.name !== 'string') return false;
  const attrs = v.attributes as Record<string, unknown> | undefined;
  if (!attrs || typeof attrs !== 'object') return false;
  if (typeof attrs.set !== 'string') return false;
  return true;
}

export function useGetCardsQuery() {
  const [cards, setCards] = useState<CardModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(firestore, 'cards', 'data');

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const response = docSnap.data() || {};
          const rawValues = Object.values(response);
          // Filter out any malformed records rather than crashing downstream.
          const validCards = rawValues.filter(isValidCardModel);
          if (validCards.length !== rawValues.length) {
            console.warn(
              `[useGetCardsQuery] dropped ${rawValues.length - validCards.length} malformed card record(s)`,
            );
          }
          // Read-time compat: legacy records persisted `status: 'wanted'`.
          // Normalize to 'wishlist' so the rest of the app only sees one value.
          const normalized = validCards.map((c) =>
            (c.status as unknown) === 'wanted' ? { ...c, status: 'wishlist' as const } : c,
          );
          const sortedCards = [...normalized].sort((a, b) =>
            a.pokemonData.name.localeCompare(b.pokemonData.name)
          );
          setCards(sortedCards);
        } else {
          setCards([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to cards', err);
        setError('Error fetching data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    cards: loading ? [] : cards,
    loading,
    error: error || null,
  };
}
