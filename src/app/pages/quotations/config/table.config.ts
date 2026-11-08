import { Quotation } from 'core/interfaces/quotation.interface';
import { TableCellType, TableConfig } from 'shared/ui/table/models/table-column.model';

export const QUOTATION_TABLE: TableConfig<Quotation> = {
  trackBy: 'id',
  columns: [
    {
      id: 'id',
      header: 'Quotation ID',
      field: 'id',
      type: TableCellType.Text,
    },
    {
      id: 'customer',
      header: 'Customer',
      field: 'customerName',
      type: TableCellType.Text,
    },
    {
      id: 'company',
      header: 'Insurance company',
      field: 'insuranceCompany',
      type: TableCellType.Text,
    },
    {
      id: 'premium',
      header: 'Premium (SAR)',
      field: 'premiumAmount',
      type: TableCellType.Money,
      sortable: true,
      align: 'end',
    },
    {
      id: 'deductible',
      header: 'Deductible (SAR)',
      field: 'deductibleAmount',
      type: TableCellType.Money,
      align: 'end',
    },
    {
      id: 'status',
      header: 'Status',
      field: 'status',
      type: TableCellType.Status,
    },
  ],
};
