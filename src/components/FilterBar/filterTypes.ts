export interface GalleryFilters {
  search: string;
  type: string;
  set: string;
  condition: string;
}

export const defaultFilters: GalleryFilters = {
  search: '',
  type: '',
  set: '',
  condition: '',
};

export function hasActiveFilters(filters: GalleryFilters): boolean {
  return filters.type !== '' || filters.set !== '' || filters.condition !== '';
}
