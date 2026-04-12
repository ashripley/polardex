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

// Intl formatters are cached at module load — re-creating them per call is
// surprisingly expensive when called inside hot lists.
const usdFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const audFormatter = new Intl.NumberFormat('en-AU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function fmtPrice(usd: number, currency: Currency, audRate: number): string {
  if (currency === 'AUD') return `A$${audFormatter.format(usd * audRate)}`;
  return `$${usdFormatter.format(usd)}`;
}
