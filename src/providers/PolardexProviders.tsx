import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';

export function PolardexProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
