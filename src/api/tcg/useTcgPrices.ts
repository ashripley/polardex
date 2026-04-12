import { useEffect, useState } from 'react';

const BASE = 'https://api.pokemontcg.io/v2';
const CHUNK_SIZE = 50;
const CACHE_KEY = 'polardex_prices_v3';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Rough static EUR→USD conversion. We only use this for the fallback to
 * Cardmarket prices when TCGPlayer is unavailable. Refreshed occasionally;
 * good-enough precision for display purposes (vs the user's actual portfolio).
 */
const EUR_TO_USD = 1.08;

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

/**
 * Picks the best available price for a card. Priority:
 *   1. TCGPlayer market price (USD) — most relevant for US/AU users
 *   2. Cardmarket average sell price (EUR) — converted to USD as a fallback
 *      so cards without TCGPlayer coverage still get a value. Many European
 *      sets and older runs have cardmarket data but no tcgplayer data.
 */
function pickPrice(card: {
  tcgplayer?: {
    prices?: Record<string, { market?: number | null } | undefined>;
  };
  cardmarket?: {
    prices?: {
      averageSellPrice?: number | null;
      trendPrice?: number | null;
      avg30?: number | null;
    };
  };
}): number | null {
  // 1. TCGPlayer USD
  const tp = card.tcgplayer?.prices;
  if (tp) {
    const usd =
      tp['normal']?.market ??
      tp['holofoil']?.market ??
      tp['reverseHolofoil']?.market ??
      tp['1stEditionHolofoil']?.market ??
      tp['1stEditionNormal']?.market ??
      null;
    if (usd != null && usd > 0) return usd;
  }

  // 2. Cardmarket EUR → USD
  const cm = card.cardmarket?.prices;
  if (cm) {
    const eur = cm.averageSellPrice ?? cm.trendPrice ?? cm.avg30 ?? null;
    if (eur != null && eur > 0) return eur * EUR_TO_USD;
  }

  return null;
}

/**
 * Fetches market prices for the given list of TCG card IDs. Uses TCGPlayer
 * by default and falls back to Cardmarket (EUR converted to USD) for cards
 * without TCGPlayer coverage. Results are cached in localStorage for 24h.
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
            // Request both tcgplayer and cardmarket fields so we can fall back.
            const res = await fetch(
              `${BASE}/cards?q=${encodeURIComponent(query)}&pageSize=${CHUNK_SIZE}&select=id,tcgplayer,cardmarket`,
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
