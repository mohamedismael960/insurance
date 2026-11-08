import { HttpContext, HttpContextToken } from '@angular/common/http';
import { HttpLoaderScope, type HttpRequestOptions } from './http-loader.model';

export const HTTP_SHOW_LOADER = new HttpContextToken(() => false);
export const HTTP_LOADER_SCOPE = new HttpContextToken<string>(() => HttpLoaderScope.App);

export function toHttpContext(options?: HttpRequestOptions): HttpContext {
  const context = new HttpContext();
  if (!options?.loader) {
    return context;
  }

  const scope = options.loader === true ? HttpLoaderScope.App : options.loader;
  return context.set(HTTP_SHOW_LOADER, true).set(HTTP_LOADER_SCOPE, scope);
}
