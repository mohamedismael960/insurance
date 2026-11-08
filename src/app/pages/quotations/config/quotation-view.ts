import {
  PremiumSortDirection,
  Quotation,
  StatusFilter,
} from 'core/interfaces/quotation.interface';

export function filterByStatus(records: readonly Quotation[], status: StatusFilter): Quotation[] {
  if (status === 'All') {
    return [...records];
  }
  return records.filter((quotation) => quotation.status === status);
}

export function sortByPremium(
  records: readonly Quotation[],
  direction: PremiumSortDirection,
): Quotation[] {
  return [...records].sort((left, right) =>
    direction === 'asc'
      ? left.premiumAmount - right.premiumAmount
      : right.premiumAmount - left.premiumAmount,
  );
}
