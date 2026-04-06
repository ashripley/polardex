const SPRITE_BASE = 'https://img.pokemondb.net/sprites/home/normal';

/** Full pokemondb sprite URL for a card name, with variant suffix when known. */
export function spriteUrl(name: string): string {
  return `${SPRITE_BASE}/${toSpriteName(name)}.png`;
}

/**
 * Fallback URL — strips any variant suffix so we get the base Pokémon sprite.
 * Use this as an img onError src when the variant sprite 404s.
 * e.g. "dragonite-mega" → "dragonite", "vulpix-alola" → "vulpix"
 */
export function spriteUrlFallback(name: string): string {
  const slug = toSpriteName(name).replace(
    /-(?:mega(?:-[xy])?|primal|alola|galar|hisui|paldea)$/,
    ''
  );
  return `${SPRITE_BASE}/${slug}.png`;
}

/**
 * Normalises a Pokémon card name to the slug used by pokemondb sprite URLs.
 *
 * Handles:
 *  - TCG power suffixes   "Pikachu VMAX"       → "pikachu"
 *  - Tag-team pairs       "Pikachu & Zekrom-GX" → "pikachu"
 *  - Regional prefixes    "Alolan Vulpix"       → "vulpix-alola"
 *  - Mega/Primal forms    "Mega Charizard X"    → "charizard-mega-x"
 *  - Flavour prefixes     "Dark Charizard"      → "charizard" (no sprite exists)
 *  - Special chars        "Mr. Mime", "Farfetch'd", "Nidoran♀"
 */
export function toSpriteName(name: string): string {
  let n = name.trim();

  // Strip trailing TCG suffixes (longest patterns first)
  n = n.replace(
    /\s+(VSTAR|VMAX|V-UNION|V|GX|EX|ex|BREAK|LV\.?\s*X|Prism\s+Star|Radiant|δ\s*Delta|TAG\s+TEAM)(?:\s.*)?$/i,
    ''
  );

  // Tag-team: keep only the first Pokémon name
  n = n.replace(/\s*&\s*.+$/, '');

  // Mega evolutions: "Mega Charizard X" → "charizard-mega-x"
  const megaMatch = n.match(/^Mega\s+(.+?)(?:\s+(X|Y))?$/i);
  if (megaMatch) {
    const base = megaMatch[1];
    const variant = megaMatch[2] ? `-${megaMatch[2].toLowerCase()}` : '';
    n = `${base}-mega${variant}`;
  }

  // Primal reversions: "Primal Kyogre" → "kyogre-primal"
  const primalMatch = n.match(/^Primal\s+(.+)$/i);
  if (primalMatch) {
    n = `${primalMatch[1]}-primal`;
  }

  // Regional prefixes → suffix (pokemondb: "vulpix-alola", "corsola-galar")
  const regional = n.match(/^(Alolan|Galarian|Hisuian|Paldean)\s+(.+)$/i);
  if (regional) {
    const suffixMap: Record<string, string> = {
      alolan: 'alola', galarian: 'galar', hisuian: 'hisui', paldean: 'paldea',
    };
    n = `${regional[2]}-${suffixMap[regional[1].toLowerCase()] ?? regional[1].toLowerCase()}`;
  }

  // Strip flavour prefixes that have no sprite variant (Dark, Shadow, Light, etc.)
  n = n.replace(/^(Dark|Shadow|Light|Rocket's|Giovanni's|Misty's|Brock's|Lt\. Surge's|Erika's|Koga's|Sabrina's|Blaine's|Gary's|Falkner's|Bugsy's|Morty's|Chuck's|Jasmine's|Pryce's|Clair's)\s+/i, '');

  return n
    .toLowerCase()
    .replace(/♀/g, '-f')
    .replace(/♂/g, '-m')
    .replace(/[éèê]/g, 'e')
    .replace(/[àâ]/g, 'a')
    .replace(/[''ʼ]/g, '')
    .replace(/\.\s*/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/-$/, '');
}
