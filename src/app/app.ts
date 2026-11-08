import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpLoaderScope } from 'core/http/http-loader.model';
import { HttpLoaderService } from 'core/http/http-loader.service';
import { LoaderOverlay } from 'shared/ui/loader/loader-overlay';

@Component({
  imports: [RouterOutlet, LoaderOverlay],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative block min-h-dvh',
  },
})
export class App {
  protected readonly loaderScope = HttpLoaderScope;

  constructor() {
    const loader = inject(HttpLoaderService);
    loader.begin(HttpLoaderScope.Session);
    const splash = setTimeout(() => loader.end(HttpLoaderScope.Session), 1000);
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(splash);
      loader.end(HttpLoaderScope.Session);
    });
  }
}
