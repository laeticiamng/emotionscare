/**
 * Currency formatting utilities
 */

export interface Price {
  amount: string;
  currencyCode: string;
}

/**
 * Formate un prix avec le symbole de devise approprié
 */
export function formatPrice(price: Price): string {
  const amount = parseFloat(price.amount);
  
  // Mapping des codes de devise vers symboles
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': 'CA$',
    'CHF': 'CHF',
  };

  const symbol = currencySymbols[price.currencyCode] || price.currencyCode;
  
  // Format selon la devise
  if (price.currencyCode === 'EUR') {
    return `${amount.toFixed(2).replace('.', ',')} ${symbol}`;
  }
  
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Formate un prix total (somme de plusieurs articles)
 */
export function formatTotal(amount: number, currencyCode: string): string {
  return formatPrice({ amount: amount.toString(), currencyCode });
}

/**
 * Parse un montant string en number
 */
export function parseAmount(amount: string): number {
  return parseFloat(amount);
}
