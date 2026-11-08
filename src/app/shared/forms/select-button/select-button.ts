import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CvaControlBase } from 'shared/forms/base/cva-control.base';

export interface SelectButtonOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-select-button',
  imports: [ReactiveFormsModule, SelectButtonModule],
  templateUrl: './select-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-fit max-w-full' },
})
export class SelectButton extends CvaControlBase<string> {
  readonly options = input.required<readonly SelectButtonOption[]>();
  readonly ariaLabel = input('Options');
  protected readonly optionList = computed(() => [...this.options()]);

  constructor() {
    super();
    this.bindNgControl(inject(NgControl, { optional: true, self: true }));
  }
}
