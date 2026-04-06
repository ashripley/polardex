import { useEffect, useState } from 'react';
import { TcgSet } from './types';

const BASE = 'https://api.pokemontcg.io/v2';
const CACHE_KEY = 'polardex_sets_v1';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function readCache(): TcgSet[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { sets, timestamp } = JSON.parse(raw) as { sets: TcgSet[]; timestamp: number };
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return sets;
  } catch {
    return null;
  }
}

function writeCache(sets: TcgSet[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ sets, timestamp: Date.now() }));
  } catch {
    // storage full or unavailable - ignore
  }
}

export function usePokemonSetsQuery() {
  const cached = readCache();
  const [sets, setSets] = useState<TcgSet[]>(cached ?? []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cached) return; // already hydrated from cache
    const controller = new AbortController();

    async function fetchSets() {
      try {
        const res = await fetch(
          `${BASE}/sets?orderBy=-releaseDate&pageSize=250`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data: TcgSet[] = json.data ?? [];
        setSets(data);
        writeCache(data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Failed to load sets. Try refreshing the page.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSets();
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sets, loading, error };
}
