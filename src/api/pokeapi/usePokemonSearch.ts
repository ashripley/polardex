import { useEffect, useState, useCallback } from 'react';

export interface PokedexEntry {
  name: string;       // "charizard"
  displayName: string; // "Charizard"
  id: number;         // 6
  spriteUrl: string;  // pokemondb sprite URL
}

interface DetailResult {
  id: number;
  primaryType: string; // "Fire"
}

const LIST_CACHE_KEY = 'polardex_pokedex_list_v1';
const LIST_TTL = 7 * 24 * 60 * 60 * 1000; // 1 week

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function readListCache(): PokedexEntry[] | null {
  try {
    const raw = localStorage.getItem(LIST_CACHE_KEY);
    if (!raw) return null;
    const { entries, timestamp } = JSON.parse(raw) as { entries: PokedexEntry[]; timestamp: number };
    if (Date.now() - timestamp > LIST_TTL) return null;
    return entries;
  } catch {
    return null;
  }
}

function writeListCache(entries: PokedexEntry[]) {
  try {
    localStorage.setItem(LIST_CACHE_KEY, JSON.stringify({ entries, timestamp: Date.now() }));
  } catch {}
}

let _listPromise: Promise<PokedexEntry[]> | null = null;

async function fetchAllPokemon(): Promise<PokedexEntry[]> {
  const cached = readListCache();
  if (cached) return cached;

  if (!_listPromise) {
    _listPromise = (async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0');
      const json = await res.json() as { results: { name: string; url: string }[] };
      const entries: PokedexEntry[] = json.results.map((p) => {
        // Extract numeric ID from url: ".../pokemon/6/"
        const parts = p.url.split('/').filter(Boolean);
        const id = Number(parts[parts.length - 1]);
        return {
          name: p.name,
          displayName: p.name.split('-').map(capitalize).join(' '),
          id,
          spriteUrl: `https://img.pokemondb.net/sprites/home/normal/${p.name}.png`,
        };
      });
      writeListCache(entries);
      _listPromise = null;
      return entries;
    })();
  }

  return _listPromise;
}

export async function fetchPokemonDetail(name: string): Promise<DetailResult | null> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!res.ok) return null;
    const json = await res.json() as {
      id: number;
      types: { slot: number; type: { name: string } }[];
    };
    const primaryType = capitalize(json.types.find((t) => t.slot === 1)?.type.name ?? 'Normal');
    return { id: json.id, primaryType };
  } catch {
    return null;
  }
}

/**
 * Provides Pokédex autocomplete.
 * Returns filtered suggestions for a given query string.
 */
export function usePokemonSearch(query: string, limit = 8) {
  const [allPokemon, setAllPokemon] = useState<PokedexEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydrate from cache immediately if available, otherwise fetch
    const cached = readListCache();
    if (cached) {
      setAllPokemon(cached);
      setReady(true);
    } else {
      fetchAllPokemon().then((entries) => {
        setAllPokemon(entries);
        setReady(true);
      });
    }
  }, []);

  const suggestions = useCallback((): PokedexEntry[] => {
    if (!ready || query.trim().length < 1) return [];
    const q = query.toLowerCase().replace(/\s+/g, '-');
    return allPokemon
      .filter((p) => p.name.startsWith(q) || p.displayName.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, limit);
  }, [ready, query, allPokemon, limit]);

  return { suggestions: suggestions(), ready };
}
