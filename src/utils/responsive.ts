import { useMediaQuery } from '../hooks';
import { MOBILE_BREAKPOINT_PX } from '../theme/theme';

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`);
}
