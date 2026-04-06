// Canonical lists for card form dropdowns.
// CARD_TYPES = mechanical card type (what the card IS).
// CARD_RARITIES = print rarity symbol on the card.

export const POKEMON_TYPES = [
  'Colorless',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Psychic',
  'Fighting',
  'Darkness',
  'Metal',
  'Dragon',
  'Fairy',
] as const;

// The mechanical type of the card (supertypes / subtypes per TCG API)
export const CARD_TYPES = [
  // Basic Pokémon forms
  'Basic',
  'Stage 1',
  'Stage 2',
  'Baby',
  'Restored',
  'LEGEND',
  // Special Pokémon rules
  'EX',
  'Mega EX',
  'BREAK',
  'GX',
  'Tag Team GX',
  'V',
  'VMAX',
  'VSTAR',
  'ex',
  'Tera ex',
  // Trainers
  'Item',
  'Supporter',
  'Stadium',
  'Pokémon Tool',
  'Technical Machine',
  // Energy
  'Basic Energy',
  'Special Energy',
] as const;

// The rarity symbol printed at the bottom of the card
export const CARD_RARITIES = [
  // Base symbols
  'Common',
  'Uncommon',
  'Rare',
  'Rare Holo',
  'Reverse Holo',
  // Scarlet & Violet era
  'Double Rare',
  'Ultra Rare',
  'Illustration Rare',
  'Special Illustration Rare',
  'Hyper Rare',
  // Older ultra / secret rares
  'Rare Ultra',
  'Rare Secret',
  'Rare Rainbow',
  'Rare Shining',
  'Rare Shiny',
  'Rare Shiny GX',
  'Gold Rare',
  'Amazing Rare',
  'Radiant Rare',
  'ACE SPEC Rare',
  // Trainer Gallery
  'Trainer Gallery Rare Holo',
  'Trainer Gallery Rare Ultra',
  // Other
  'Promo',
  'Classic Collection',
  'LEGEND',
] as const;

export const CARD_CONDITIONS = [
  'Mint',
  'Near Mint',
  'Excellent',
  'Good',
  'Light Played',
  'Played',
  'Poor',
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];
export type CardType = (typeof CARD_TYPES)[number];
export type CardRarity = (typeof CARD_RARITIES)[number];
export type CardCondition = (typeof CARD_CONDITIONS)[number];
