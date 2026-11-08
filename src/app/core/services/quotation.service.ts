import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiResource } from 'core/config/api-resources.config';
import { filterByKeyword } from 'core/config/quotation-filter';
import { sectionLoaderScope } from 'core/http/http-loader.model';
import { Quotation } from 'core/interfaces/quotation.interface';
import { BaseHttpService } from './base-http.service';

@Injectable({ providedIn: 'root' })
export class QuotationService extends BaseHttpService {
  private failNextError = true;
  readonly selected = signal<Quotation | null>(null);

  constructor() {
    super(ApiResource.Quotations);
  }

  search(term: string): Observable<readonly Quotation[]> {
    const normalized = term.trim().toLowerCase();
    return this.get<Quotation[]>(
      undefined,
      { q: normalized },
      { loader: sectionLoaderScope('table') },
    ).pipe(
      switchMap((records) => {
        if (normalized === 'error') {
          const fail = this.failNextError;
          this.failNextError = !fail;
          return fail
            ? throwError(() => new Error('The quotation service did not respond.'))
            : of([...records]);
        }
        return of(filterByKeyword(records, normalized));
      }),
    );
  }

  select(quotation: Quotation): void {
    this.selected.set(quotation);
  }

  clearSelection(): void {
    this.selected.set(null);
  }
}
