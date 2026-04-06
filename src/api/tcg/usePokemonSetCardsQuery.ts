import { useEffect, useState } from 'react';
import { TcgCard } from './types';

const BASE = 'https://api.pokemontcg.io/v2';
const CACHE_PREFIX = 'polardex_set_cards_v1_';

function getCached(setId: string): TcgCard[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + setId);
    if (!raw) return null;
    return JSON.parse(raw) as TcgCard[];
  } catch {
    return null;
  }
}

function setCache(setId: string, cards: TcgCard[]) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + setId, JSON.stringify(cards));
  } catch {
    // storage full — ignore
  }
}

export function usePokemonSetCardsQuery(setId: string | null) {
  const [cards, setCards] = useState<TcgCard[]>(() => {
    if (!setId) return [];
    return getCached(setId) ?? [];
  });
  const [loading, setLoading] = useState(() => {
    if (!setId) return false;
    return getCached(setId) === null;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!setId) {
      setCards([]);
      setLoading(false);
      return;
    }

    const cached = getCached(setId);
    if (cached) {
      setCards(cached);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function fetchCards() {
      try {
        const res = await fetch(
          `${BASE}/cards?q=set.id:${setId}&orderBy=number&pageSize=250`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data: TcgCard[] = json.data ?? [];
        setCache(setId!, data);
        setCards(data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Failed to load cards');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
    return () => controller.abort();
  }, [setId]);

  return { cards, loading, error };
}
