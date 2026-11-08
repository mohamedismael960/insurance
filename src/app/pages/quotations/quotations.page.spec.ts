import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ErrorHandler } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { Quotation } from 'core/interfaces/quotation.interface';
import quotationsJson from '../../../../public/mocks/quotations.json';
import { QuotationsPage } from './quotations.page';

const quotations = quotationsJson as Quotation[];

interface PageView {
  searchControl: FormControl<string>;
  hasError(): boolean;
  retry(): void;
}

describe('QuotationsPage', () => {
  let http: HttpTestingController;
  let errors: { handleError: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'],
    });
    errors = { handleError: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ErrorHandler, useValue: errors },
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  it('does not let an earlier search response replace the latest results', () => {
    const { fixture, page } = createPage();
    respond('', quotations);

    search(page, 'nora');
    const nora = pending('nora');
    search(page, 'sara');
    respond('sara', quotations);
    fixture.detectChanges();

    expect(nora.cancelled).toBe(true);
    expect(visibleIds(fixture)).toEqual(['Q-10111', 'Q-10110']);
  });

  it('shows an error and restores the quotations on retry', () => {
    const { fixture, page } = createPage();
    respond('', quotations);

    search(page, 'error');
    respond('error', quotations);
    fixture.detectChanges();

    expect(page.hasError()).toBe(true);
    expect(errors.handleError).toHaveBeenCalledOnce();
    expect(visibleIds(fixture)).toEqual([]);

    page.retry();
    respond('error', quotations);
    fixture.detectChanges();

    expect(page.hasError()).toBe(false);
    expect(visibleIds(fixture)).toHaveLength(8);
  });

  function createPage() {
    const fixture = TestBed.createComponent(QuotationsPage);
    fixture.detectChanges();
    return { fixture, page: fixture.componentInstance as unknown as PageView };
  }

  function search(page: PageView, term: string): void {
    page.searchControl.setValue(term);
    vi.advanceTimersByTime(1000);
  }

  function pending(term: string) {
    return http.expectOne((req) => req.params.get('q') === term);
  }

  function respond(term: string, body: Quotation[]): void {
    pending(term).flush(body);
  }
});

function visibleIds(fixture: ComponentFixture<QuotationsPage>): string[] {
  const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
  return [...text.matchAll(/Q-\d+/g)].map((match) => match[0]);
}
