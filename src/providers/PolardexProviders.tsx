import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { ReadOnlyProvider } from './ReadOnlyProvider';
import { ToastProvider } from './ToastProvider';

export function PolardexProviders({ children }: { children: ReactNode }) {
  return (
    <ReadOnlyProvider>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </ReadOnlyProvider>
  );
}
