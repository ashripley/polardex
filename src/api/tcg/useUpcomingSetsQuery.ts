import { useMemo } from 'react';
import { TcgSet } from './types';
import { usePokemonSetsQuery } from './usePokemonSetsQuery';

export interface UpcomingSet extends TcgSet {
  isRumored?: boolean;
  rumoredSource?: string;
}

/**
 * Hardcoded rumored / leaked sets. The Pokémon TCG API only lists officially
 * released sets, so truly upcoming sets need to be curated manually from news
 * sources (PokeBeach, Bulbanews, LimitlessTCG news).
 *
 * Each entry becomes a rumored card in the upcoming strip with a source link.
 * Keep this list short and remove entries once they're added to the TCG API.
 */
const RUMORED_SETS: UpcomingSet[] = [
  // Example shape — populate as leaks surface:
  // {
  //   id: 'rumored-sv11',
  //   name: 'Black Bolt',
  //   series: 'Scarlet & Violet',
  //   printedTotal: 0,
  //   total: 0,
  //   releaseDate: '2026/07/18',
  //   images: { symbol: '', logo: '' },
  //   isRumored: true,
  //   rumoredSource: 'PokeBeach',
  // },
];

/**
 * Derives the list of upcoming sets from the existing sets query.
 * Combines:
 *  - TCG API sets where releaseDate is in the future (confirmed)
 *  - Hardcoded rumored sets (tagged with isRumored)
 * Sorted by nearest release date first.
 */
export function useUpcomingSetsQuery() {
  const { sets, loading, error } = usePokemonSetsQuery();

  const upcoming = useMemo<UpcomingSet[]>(() => {
    const todayMs = Date.now();
    const confirmed = sets
      .filter((s) => {
        if (!s.releaseDate) return false;
        // Pokemon TCG API dates use "YYYY/MM/DD"
        const parsed = Date.parse(s.releaseDate.replace(/\//g, '-'));
        return Number.isFinite(parsed) && parsed > todayMs;
      })
      .map((s) => ({ ...s } as UpcomingSet));

    const combined = [...confirmed, ...RUMORED_SETS];

    return combined.sort((a, b) => {
      const pa = Date.parse(a.releaseDate.replace(/\//g, '-')) || Infinity;
      const pb = Date.parse(b.releaseDate.replace(/\//g, '-')) || Infinity;
      return pa - pb;
    });
  }, [sets]);

  return { upcoming, loading, error };
}
