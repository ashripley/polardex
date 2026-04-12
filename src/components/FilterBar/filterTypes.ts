export interface CollectionsFilters {
  search: string;
  type: string;
  set: string;
  condition: string;
}

export const defaultFilters: CollectionsFilters = {
  search: '',
  type: '',
  set: '',
  condition: '',
};

export function hasActiveFilters(filters: CollectionsFilters): boolean {
  return filters.type !== '' || filters.set !== '' || filters.condition !== '';
}
