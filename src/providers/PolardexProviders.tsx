import { ReactNode } from 'react';
import { GalleryProvider } from './GalleryProvider';
import { PageProvider } from './PageProvider';

export function PolardexProviders({ children }: { children: ReactNode }) {
  return (
    <PageProvider>
      <GalleryProvider>{children}</GalleryProvider>
    </PageProvider>
  );
}
