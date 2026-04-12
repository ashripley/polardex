import { useState, useCallback } from 'react';

export type Currency = 'AUD' | 'USD';

const STORAGE_KEY = 'polardex_currency';

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>(
    () => (localStorage.getItem(STORAGE_KEY) as Currency) ?? 'AUD',
  );

  const toggle = useCallback(() => {
    setCurrency((c) => {
      const next = c === 'AUD' ? 'USD' : 'AUD';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { currency, toggle };
}

export function fmtPrice(usd: number, currency: Currency, audRate: number): string {
  if (currency === 'AUD') return `A$${(usd * audRate).toFixed(2)}`;
  return `$${usd.toFixed(2)}`;
}
