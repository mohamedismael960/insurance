import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatSar } from 'shared/format/format-sar';

@Component({
  selector: 'app-money-amount',
  templateUrl: './money-amount.html',
  styleUrl: './money-amount.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyAmount {
  readonly amount = input.required<number>();
  protected readonly formatted = computed(() => formatSar(this.amount()));
}
