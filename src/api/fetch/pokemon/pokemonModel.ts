export interface PokemonModel {
  name: string;
  id: number;
  evolutions: EvolutionsDefinition;
  type: string;
  imageUrl: string;
  meta?: unknown;
}

export interface EvolutionDefinition {
  name: string;
  imageUrl: string;
}

export interface EvolutionsDefinition {
  first: EvolutionDefinition;
  second?: EvolutionDefinition;
  third?: EvolutionDefinition;
}
