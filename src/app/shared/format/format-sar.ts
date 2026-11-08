const sarCurrency = new Intl.NumberFormat('en-SA', {
  style: 'currency',
  currency: 'SAR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatSar(amount: number): string {
  return sarCurrency.format(amount);
}
