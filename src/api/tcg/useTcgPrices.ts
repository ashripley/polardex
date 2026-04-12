import { useEffect, useState } from 'react';

const BASE = 'https://api.pokemontcg.io/v2';
const CHUNK_SIZE = 50;
const CACHE_KEY = 'polardex_prices_v2';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface PriceCache {
  prices: Record<string, number>;
  timestamp: number;
}

function readCache(): Map<string, number> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return new Map();
    const { prices, timestamp } = JSON.parse(raw) as PriceCache;
    if (Date.now() - timestamp > CACHE_TTL) return new Map();
    return new Map(Object.entries(prices));
  } catch {
    return new Map();
  }
}

function writeCache(prices: Map<string, number>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      prices: Object.fromEntries(prices),
      timestamp: Date.now(),
    } satisfies PriceCache));
  } catch {
    // storage full — ignore
  }
}

function pickPrice(card: {
  tcgplayer?: {
    prices?: Record<string, { market?: number | null } | undefined>;
  };
}): number | null {
  const p = card.tcgplayer?.prices;
  if (!p) return null;
  return (
    p['normal']?.market ??
    p['holofoil']?.market ??
    p['reverseHolofoil']?.market ??
    p['1stEditionHolofoil']?.market ??
    p['1stEditionNormal']?.market ??
    null
  );
}

/**
 * Fetches TCGPlayer market prices for the given list of TCG card IDs.
 * Results are cached in localStorage for 24 hours.
 * Only fetches IDs not already in cache.
 */
export function useTcgPrices(tcgIds: string[]) {
  const [priceMap, setPriceMap] = useState<Map<string, number>>(readCache);
  const [loading, setLoading] = useState(false);

  // Stable key — only re-run when the set of IDs actually changes
  const idsKey = [...tcgIds].sort().join(',');

  useEffect(() => {
    if (!tcgIds.length) return;

    const cached = readCache();
    const missing = tcgIds.filter((id) => !cached.has(id));

    if (missing.length === 0) {
      setPriceMap(new Map(cached));
      return;
    }

    setLoading(true);

    async function fetchMissing() {
      const allPrices = new Map(cached);

      // Split into chunks to avoid URL length limits
      const chunks: string[][] = [];
      for (let i = 0; i < missing.length; i += CHUNK_SIZE) {
        chunks.push(missing.slice(i, i + CHUNK_SIZE));
      }

      await Promise.all(
        chunks.map(async (chunk) => {
          try {
            const query = chunk.map((id) => `id:${id}`).join(' OR ');
            const res = await fetch(
              `${BASE}/cards?q=${encodeURIComponent(query)}&pageSize=${CHUNK_SIZE}&select=id,tcgplayer`,
            );
            if (!res.ok) return;
            const json = await res.json();
            for (const card of json.data ?? []) {
              const price = pickPrice(card);
              if (price != null && price > 0) {
                allPrices.set(card.id as string, price);
              }
            }
          } catch {
            // network error — skip chunk silently
          }
        }),
      );

      writeCache(allPrices);
      setPriceMap(new Map(allPrices));
      setLoading(false);
    }

    fetchMissing();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return { priceMap, loading };
}
