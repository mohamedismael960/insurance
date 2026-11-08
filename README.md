# Insurance quotations

A single-screen quotation management dashboard for customer support. Representatives search quotations, review pricing, and inspect one quotation.

## Setup

```bash
npm install
```

## Execution

```bash
ng serve
```

Open `http://localhost:4200/`.

```bash
ng test
```

## Architecture decisions

The app uses standalone components and strict TypeScript. `core` owns the quotation contract and the injectable `QuotationService`, which returns RxJS Observables over eight records in `public/mocks/quotations.json`. `shared` owns reusable presentation components and has no business rules. `pages/quotations` owns the screen.

Search uses one reactive form control. Input is debounced, then `switchMap` cancels the previous request, so an earlier response can never overwrite the latest results. `switchMap` fits search because only the latest term matters.

| State | Owner | Why |
| --- | --- | --- |
| Search text | Form control | One reactive input, debounced into the service |
| Search result | Signal from the search stream | One subscription, cancelled by `switchMap` |
| Visible rows | `computed` | Derived from the result, status filter, and premium sort |
| Status filter, premium sort, error | Signals on the page | Synchronous UI state |
| Loading | `HttpLoaderService`, by section | One loader for the app and the table |
| Selected quotation | Signal on `QuotationService` | Shared with the detail panel |

Change detection is `OnPush` and zoneless. The table tracks rows by id. Subscriptions end with the page through `toSignal`. A failed search goes to Angular's `ErrorHandler` and shows a retry action.

PrimeNG provides the table and form controls. Tailwind and a shared SCSS token file provide layout and colors.

## Assumptions

- An empty search returns all eight quotations.
- Search is case-insensitive and matches the customer name or the quotation ID.
- Status filtering and premium sorting run in the browser on the latest result.
- A status filter that hides the selected quotation keeps its detail panel open.
- Searching for `error` fails, and Retry returns all quotations. The next `error` search fails again.
- Mock latency depends on the term: one to three characters take 1.5 seconds, others take 0.4 seconds. To see overlapping requests, type `sa`, wait one second, then complete `sara`. The slower `sa` request is cancelled, and only Sara's two quotations are shown.

## Known limitations

- Latency follows the term length. It is not random.
- Failure is triggered by the word `error`. It is not a random outage.
- PrimeNG 21 declares Angular 21 as its peer, so `.npmrc` enables `legacy-peer-deps` for Angular 22.
- Client-side filtering and sorting do not scale to 100,000 records.
- There is no paging, authentication, or real backend.

## Technical leadership

### Scalable architecture

Keep a modular monolith. Each feature owns a lazy route and exposes a small public surface. `core` holds contracts and app-wide infrastructure. `shared` holds presentation with no feature rules. Each team owns its feature directories, and cross-feature imports go through public entry points. Extract a library when a second team actually consumes it.

### Performance at scale

Move keyword filtering, status filtering, sorting, and paging to the API. Keep one page of rows in the signal and render it with virtual scroll. Keep `OnPush`, tracking by id, and the debounced `switchMap` cancellation. Prefer keyset paging over large offsets.

### Microfrontends

Neither is justified for this product today. Federation adds shared-dependency drift, shell ownership, routing, and a larger test matrix. Split a remote only when a team must deploy on its own schedule. If that happens, Native Federation fits Angular better because it follows the framework's ESM build. The organizational cost remains either way.
