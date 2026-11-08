import { Quotation } from 'core/interfaces/quotation.interface';

export function filterByKeyword(records: readonly Quotation[], term: string): Quotation[] {
  const normalized = term.trim().toLowerCase();
  if (!normalized) {
    return [...records];
  }
  return records.filter(
    (quotation) =>
      quotation.customerName.toLowerCase().includes(normalized) ||
      quotation.id.toLowerCase().includes(normalized),
  );
}
