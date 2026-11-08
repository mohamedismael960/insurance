export enum TableCellType {
  Text = 'text',
  Money = 'money',
  Status = 'status',
}

export interface TableColumn<T extends object> {
  readonly id: string;
  readonly header: string;
  readonly field: keyof T & string;
  readonly type: TableCellType;
  readonly sortable?: boolean;
  readonly align?: 'start' | 'end';
  readonly minWidth?: string;
}

export interface TableConfig<T extends object> {
  readonly columns: readonly TableColumn<T>[];
  readonly trackBy: keyof T & string;
}

export interface TableSortChange {
  readonly field: string;
  readonly direction: 'asc' | 'desc';
}
