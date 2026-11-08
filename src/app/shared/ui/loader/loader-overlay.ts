import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HttpLoaderScope } from 'core/http/http-loader.model';
import { HttpLoaderService } from 'core/http/http-loader.service';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-loader-overlay',
  imports: [ProgressSpinner],
  templateUrl: './loader-overlay.html',
  styleUrl: './loader-overlay.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pointer-events-none contents',
  },
})
export class LoaderOverlay {
  private readonly loader = inject(HttpLoaderService);

  readonly scope = input<string>(HttpLoaderScope.App);
  readonly loading = computed(() => this.loader.isLoading(this.scope()));
}
