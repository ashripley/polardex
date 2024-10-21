import { ReactNode } from 'react';
import { GalleryProvider } from './GalleryProvider';

export function PolardexProviders({ children }: { children: ReactNode }) {
  return <GalleryProvider>{children}</GalleryProvider>;
}
