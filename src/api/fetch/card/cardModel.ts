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
  meta?: unknown;
}
