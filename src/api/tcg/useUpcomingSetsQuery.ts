import { useMemo } from 'react';
import { TcgSet } from './types';
import { usePokemonSetsQuery } from './usePokemonSetsQuery';

export interface UpcomingSet extends TcgSet {
  isRumored?: boolean;
  rumoredSource?: string;
}

export interface UseUpcomingSetsResult {
  /** Future-dated and/or rumored sets only. Empty when there's nothing upcoming. */
  upcoming: UpcomingSet[];
  loading: boolean;
  error: string | null;
}

/**
 * Hardcoded rumored / leaked sets. The Pokémon TCG API only lists officially
 * released sets, so truly upcoming sets need to be curated manually from news
 * sources (PokeBeach, Bulbanews, LimitlessTCG news).
 *
 * Keep this list short and prune entries as they get added to the TCG API
 * (or pass their release date — the upcoming filter handles that automatically).
 */
const RUMORED_SETS: UpcomingSet[] = [
  // Example shape:
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

function parseReleaseMs(iso: string): number {
  // Pokemon TCG API uses "YYYY/MM/DD"; Date.parse expects "YYYY-MM-DD"
  return Date.parse(iso.replace(/\//g, '-'));
}

/**
 * Returns the list of sets to show in the "upcoming" strip on the Sets page.
 * Only includes sets that haven't been released yet — already-released sets
 * live in the main grid below, so duplicating them here would just be noise.
 */
export function useUpcomingSetsQuery(): UseUpcomingSetsResult {
  const { sets, loading, error } = usePokemonSetsQuery();

  const upcoming = useMemo<UpcomingSet[]>(() => {
    const todayMs = Date.now();

    const confirmed = sets
      .filter((s) => {
        if (!s.releaseDate) return false;
        const ms = parseReleaseMs(s.releaseDate);
        return Number.isFinite(ms) && ms > todayMs;
      })
      .map((s) => ({ ...s } as UpcomingSet));

    return [...confirmed, ...RUMORED_SETS].sort((a, b) => {
      const pa = parseReleaseMs(a.releaseDate) || Infinity;
      const pb = parseReleaseMs(b.releaseDate) || Infinity;
      return pa - pb;
    });
  }, [sets]);

  return { upcoming, loading, error };
}
