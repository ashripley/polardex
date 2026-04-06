import { useMediaQuery } from '../hooks';

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 760px)');
}
