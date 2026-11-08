import { StatusFilter } from 'core/interfaces/quotation.interface';

export const STATUS_FILTER_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'All' },
  { label: 'Available', value: 'Available' },
  { label: 'Expired', value: 'Expired' },
];
