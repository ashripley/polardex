import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { ReadOnlyProvider } from './ReadOnlyProvider';

export function PolardexProviders({ children }: { children: ReactNode }) {
  return (
    <ReadOnlyProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ReadOnlyProvider>
  );
}
