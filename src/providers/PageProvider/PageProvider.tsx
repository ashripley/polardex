import { createContext, ReactNode, useContext, useState } from 'react';

interface PageDefinition {
  current: string;
  setCurrent: (page: string) => void;
}

const page = {
  current: 'home',
  setCurrent: () => {},
};

const PageContext = createContext<PageDefinition>(page);

// eslint-disable-next-line react-refresh/only-export-components
export const usePage = () => useContext(PageContext);

type PageProviderProps = {
  children: ReactNode;
};

export const PageProvider = ({ children }: PageProviderProps) => {
  const [page, setPage] = useState<string>('home');

  function togglePage(currentPage: string) {
    setPage(currentPage);
  }

  return (
    <PageContext.Provider
      value={{
        current: page,
        setCurrent: togglePage,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};
