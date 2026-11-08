export type QuotationStatus = 'Available' | 'Expired';

export type StatusFilter = 'All' | QuotationStatus;

export type PremiumSortDirection = 'asc' | 'desc';

export interface Quotation {
  readonly id: string;
  readonly customerName: string;
  readonly insuranceCompany: string;
  readonly premiumAmount: number;
  readonly deductibleAmount: number;
  readonly status: QuotationStatus;
}
