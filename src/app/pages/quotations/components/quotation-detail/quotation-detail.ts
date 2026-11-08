import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Quotation } from 'core/interfaces/quotation.interface';
import { EmptyState } from 'shared/ui/empty-state/empty-state';
import { MoneyAmount } from 'shared/ui/money-amount/money-amount';
import { StatusBadge } from 'shared/ui/status-badge/status-badge';

@Component({
  selector: 'app-quotation-detail',
  imports: [EmptyState, MoneyAmount, StatusBadge],
  templateUrl: './quotation-detail.html',
  styleUrl: './quotation-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotationDetail {
  readonly quotation = input<Quotation | null>(null);
}
