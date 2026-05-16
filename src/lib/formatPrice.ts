const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: '£',
  EUR: '€',
  BRL: 'R$',
  ARS: 'ARS ',
  USD: '$',
};

export function formatPrice(price: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${symbol}${price.toFixed(2)}`;
}
