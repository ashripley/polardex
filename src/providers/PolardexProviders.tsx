import { ReactNode } from 'react';
import { PageProvider } from './PageProvider';

export function PolardexProviders({ children }: { children: ReactNode }) {
  return <PageProvider>{children}</PageProvider>;
}
