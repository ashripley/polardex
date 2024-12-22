import { doc, getDoc } from 'firebase/firestore';
import { CardModel } from './cardModel';
import { firestore } from '../../../services/firebase.config';
import { useEffect, useState } from 'react';

export function useGetCardsQuery() {
  const [cards, setCards] = useState<CardModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(firestore, 'cards', 'data');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const response = docSnap.data() || {};
          const cardsData: CardModel[] = Object.values(response);
          const sortedCards = cardsData.sort((a, b) => {
            return a.pokemonData.name.localeCompare(b.pokemonData.name);
          });

          setCards(sortedCards);
        } else {
          setError('Document not found');
        }
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    cards: loading || error ? [] : cards,
    loading,
    error: error || null,
  };
}
