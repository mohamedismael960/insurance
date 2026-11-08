import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { MoneyAmount } from 'shared/ui/money-amount/money-amount';
import { StatusBadge } from 'shared/ui/status-badge/status-badge';
import {
  TableCellType,
  TableColumn,
  TableConfig,
  TableSortChange,
} from './models/table-column.model';

@Component({
  selector: 'app-table',
  imports: [TableModule, ProgressBarModule, MoneyAmount, StatusBadge],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T extends object> {
  readonly config = input.required<TableConfig<T>>();
  readonly rows = input.required<readonly T[]>();
  readonly loading = input(false);
  readonly emptyMessage = input('No data available');
  readonly sortField = input<string | null>(null);
  readonly sortOrder = input<1 | -1>(1);
  readonly activeId = input<string | null>(null);

  readonly sortChange = output<TableSortChange>();
  readonly rowActivate = output<T>();

  protected readonly cellTypes = TableCellType;

  protected readonly visibleRows = computed(() => [...this.rows()]);

  protected rowId(row: T): string {
    return String(row[this.config().trackBy]);
  }

  protected isActive(row: T): boolean {
    return this.activeId() === this.rowId(row);
  }

  protected text(row: T, column: TableColumn<T>): string {
    return String(row[column.field] ?? '');
  }

  protected money(row: T, column: TableColumn<T>): number {
    const value = row[column.field];
    return typeof value === 'number' ? value : 0;
  }

  protected onSort(event: { field?: string; order?: number }): void {
    if (!event.field || event.order == null) {
      return;
    }
    this.sortChange.emit({
      field: event.field,
      direction: event.order < 0 ? 'desc' : 'asc',
    });
  }
}
