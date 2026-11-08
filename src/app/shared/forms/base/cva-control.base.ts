import { DestroyRef, Directive, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Directive()
export abstract class CvaControlBase<T> implements ControlValueAccessor {
  private readonly destroyRef = inject(DestroyRef);

  readonly label = input('');
  readonly hint = input('');
  readonly disabled = input(false);

  protected readonly control = new FormControl<T | null>(null);
  private disabledByForm = false;

  protected onChangeFn: (value: T | null) => void = () => undefined;
  protected onTouchedFn: () => void = () => undefined;

  protected constructor() {
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.onChangeFn(value);
    });

    effect(() => {
      this.applyDisabledState(this.disabled() || this.disabledByForm);
    });
  }

  protected bindNgControl(ngControl: NgControl | null): void {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  writeValue(value: T | null): void {
    this.control.setValue(value ?? null, { emitEvent: false });
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm = isDisabled;
    this.applyDisabledState(this.disabled() || isDisabled);
  }

  protected markAsTouched(): void {
    this.onTouchedFn();
  }

  private applyDisabledState(isDisabled: boolean): void {
    if (isDisabled && this.control.enabled) {
      this.control.disable({ emitEvent: false });
    } else if (!isDisabled && this.control.disabled) {
      this.control.enable({ emitEvent: false });
    }
  }
}
