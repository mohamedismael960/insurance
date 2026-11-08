import {
  ChangeDetectionStrategy,
  Component,
  ErrorHandler,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EMPTY, Subject, debounceTime, distinctUntilChanged, merge, of, switchMap } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpLoaderService } from 'core/http/http-loader.service';
import { sectionLoaderScope } from 'core/http/http-loader.model';
import { QuotationService } from 'core/services/quotation.service';
import { PremiumSortDirection, Quotation, StatusFilter } from 'core/interfaces/quotation.interface';
import { SelectButton } from 'shared/forms/select-button/select-button';
import { TextInput } from 'shared/forms/text-input/text-input';
import { EmptyState } from 'shared/ui/empty-state/empty-state';
import { ErrorState } from 'shared/ui/error-state/error-state';
import { LoaderOverlay } from 'shared/ui/loader/loader-overlay';
import { TableComponent } from 'shared/ui/table/table.component';
import { TableSortChange } from 'shared/ui/table/models/table-column.model';
import { QuotationDetail } from './components/quotation-detail/quotation-detail';
import { STATUS_FILTER_OPTIONS } from './config/filters.config';
import { QUOTATION_TABLE } from './config/table.config';
import { filterByStatus, sortByPremium } from './config/quotation-view';

@Component({
  selector: 'app-quotations-page',
  imports: [
    ReactiveFormsModule,
    TextInput,
    SelectButton,
    TableComponent,
    EmptyState,
    LoaderOverlay,
    ErrorState,
    QuotationDetail,
  ],
  templateUrl: './quotations.page.html',
  styleUrl: './quotations.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class QuotationsPage {
  private readonly quotationsApi = inject(QuotationService);
  private readonly errors = inject(ErrorHandler);
  private readonly loaders = inject(HttpLoaderService);
  private readonly retrySearch = new Subject<string>();

  protected readonly tableConfig = QUOTATION_TABLE;
  protected readonly statusOptions = STATUS_FILTER_OPTIONS;
  protected readonly tableScope = sectionLoaderScope('table');
  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly statusControl = new FormControl<StatusFilter>('All', { nonNullable: true });
  protected readonly statusFilter = toSignal(this.statusControl.valueChanges, {
    initialValue: 'All' as StatusFilter,
  });
  protected readonly premiumSort = signal<PremiumSortDirection>('asc');
  protected readonly hasError = signal(false);
  protected readonly hasLoaded = signal(false);
  protected readonly tableLoading = computed(() => this.loaders.isLoading(this.tableScope));

  private readonly quotations$ = merge(
    of(this.searchControl.value),
    this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      map((term) => term.trim()),
      distinctUntilChanged(),
    ),
    this.retrySearch,
  ).pipe(
    switchMap((term) => {
      this.hasError.set(false);
      return this.quotationsApi.search(term).pipe(
        tap((data) => {
          this.hasLoaded.set(true);
          const selected = this.quotationsApi.selected();
          if (selected && !data.some((quotation) => quotation.id === selected.id)) {
            this.quotationsApi.clearSelection();
          }
        }),
        catchError((error: unknown) => {
          this.errors.handleError(error);
          this.hasError.set(true);
          return EMPTY;
        }),
      );
    }),
  );

  private readonly quotations = toSignal(this.quotations$, {
    initialValue: [] as readonly Quotation[],
  });

  protected readonly rows = computed(() =>
    sortByPremium(filterByStatus(this.quotations(), this.statusFilter()), this.premiumSort()),
  );

  protected onSort(event: TableSortChange): void {
    if (event.field === 'premiumAmount') {
      this.premiumSort.set(event.direction);
    }
  }

  protected retry(): void {
    this.retrySearch.next(this.searchControl.value);
  }

  protected select(quotation: Quotation): void {
    this.quotationsApi.select(quotation);
  }

  protected selectedQuotation(): Quotation | null {
    return this.quotationsApi.selected();
  }
}
