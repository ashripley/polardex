export interface TcgSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
  images: {
    symbol: string;
    logo: string;
  };
}

export interface TcgPriceEntry {
  low: number | null;
  mid: number | null;
  high: number | null;
  market: number | null;
  directLow: number | null;
}

export interface TcgCard {
  id: string;
  name: string;
  number: string;
  rarity?: string;
  types?: string[];
  images: {
    small: string;
    large: string;
  };
  set: {
    id: string;
    name: string;
    total: number;
  };
  tcgplayer?: {
    url?: string;
    updatedAt?: string;
    prices?: {
      normal?: TcgPriceEntry;
      holofoil?: TcgPriceEntry;
      reverseHolofoil?: TcgPriceEntry;
      '1stEditionHolofoil'?: TcgPriceEntry;
      '1stEditionNormal'?: TcgPriceEntry;
    };
  };
}

export interface TcgSetsResponse {
  data: TcgSet[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

export interface TcgCardsResponse {
  data: TcgCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}
