import { doc, onSnapshot } from 'firebase/firestore';
import { CardModel } from './cardModel';
import { firestore } from '../../../services/firebase.config';
import { useEffect, useState } from 'react';

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
          const cardsData: CardModel[] = Object.values(response);
          const sortedCards = cardsData.sort((a, b) =>
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
