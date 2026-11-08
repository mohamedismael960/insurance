import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpLoaderService {
  private readonly counts = signal<ReadonlyMap<string, number>>(new Map());

  isLoading(scope: string): boolean {
    return (this.counts().get(scope) ?? 0) > 0;
  }

  begin(scope: string): void {
    this.counts.update((current) => {
      const next = new Map(current);
      next.set(scope, (next.get(scope) ?? 0) + 1);
      return next;
    });
  }

  end(scope: string): void {
    this.counts.update((current) => {
      const next = new Map(current);
      const value = (next.get(scope) ?? 1) - 1;
      if (value <= 0) {
        next.delete(scope);
      } else {
        next.set(scope, value);
      }
      return next;
    });
  }
}
