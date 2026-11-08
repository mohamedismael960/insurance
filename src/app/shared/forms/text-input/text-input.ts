import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CvaControlBase } from 'shared/forms/base/cva-control.base';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule, InputTextModule],
  templateUrl: './text-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full min-w-0' },
})
export class TextInput extends CvaControlBase<string> {
  readonly type = input('text');

  constructor() {
    super();
    this.bindNgControl(inject(NgControl, { optional: true, self: true }));
  }
}
