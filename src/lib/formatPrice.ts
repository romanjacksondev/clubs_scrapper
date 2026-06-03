const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: '£',
  EUR: '€',
  USD: '$',
  // South America
  BRL: 'R$', // Brazil
  ARS: '$', // Argentina
  CLP: '$', // Chile
  COP: '$', // Colombia
  PEN: 'S/', // Peru
  UYU: '$U', // Uruguay
  PYG: '₲', // Paraguay
  BOB: 'Bs.', // Bolivia
  VES: 'Bs.D', // Venezuela
  ECU: '$', // Ecuador (uses USD, kept for legacy)
};

export function formatPrice(price: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${symbol}${price.toFixed(2)}`;
}
