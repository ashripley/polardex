import { createContext, ReactNode, useContext } from 'react';

interface GalleryModel {
  initValue?: string;
}

const gallery = {};

const GalleryContext = createContext<GalleryModel>(gallery);

// eslint-disable-next-line react-refresh/only-export-components
export const useGallery = () => useContext(GalleryContext);

type GalleryProviderProps = {
  children: ReactNode;
};

export const GalleryProvider = ({ children }: GalleryProviderProps) => {
  console.log('gallery provider');

  return (
    <GalleryContext.Provider value={{}}>{children}</GalleryContext.Provider>
  );
};
