import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../services/firebase.config';
import { PokemonModel } from './pokemonModel';
import { useEffect, useState } from 'react';

export function useGetPokemonQuery() {
  const [pokemon, setPokemon] = useState<PokemonModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(firestore, 'pokemon', 'data');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const response = docSnap.data() || {};
          const pokemonData: PokemonModel[] = Object.values(response);
          setPokemon(pokemonData);
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
    pokemon: loading || error ? [] : pokemon,
    loading,
    error: error || null,
  };
}
