import { PokemonModel } from '../pokemon';

export interface CardModel {
  cardId: string;
  quantity: number;
  setNumber: number;
  attributes: AttributeCardModel;
  pokemonData: PokemonModel;
  meta?: unknown;
}

export interface TempCardModel {
  pokemonData: PokemonModel;
  cardId?: string;
  quantity?: string;
  setNumber?: number;
  attributes?: AttributeCardModel;
  meta?: unknown;
}

export interface AttributeCardModel {
  cardType: string;
  set: string;
  rarity: string;
  condition: string;
  grading: number;
  isGraded?: boolean;
  tcgId?: string;         // Pokemon TCG API card ID e.g. "base1-4"
  tcgImageUrl?: string;   // Full card artwork URL from TCG API
  marketPrice?: number;   // TCGPlayer market price at time of adding (USD)
  variants?: {
    normal: boolean;        // own the standard print
    alternate: boolean;     // own the alternate print (Rev. Holo, Full Art, Alternate Art, etc.)
    reverseHolo?: boolean;  // legacy field — kept for backward compat with existing DB records
  };
  meta?: unknown;
}
