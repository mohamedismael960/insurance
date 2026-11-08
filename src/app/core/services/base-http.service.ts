import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { toHttpContext } from 'core/http/http-loader.context';
import { HttpRequestOptions } from 'core/http/http-loader.model';

export abstract class BaseHttpService {
  private readonly http = inject(HttpClient);

  protected constructor(private readonly resource: string) {}

  protected get<T>(
    path?: string,
    params?: Record<string, string | number | boolean>,
    options?: HttpRequestOptions,
  ): Observable<T> {
    return this.http.get<T>(this.url(path), this.requestOptions(params, options));
  }

  protected post<T>(
    path: string | undefined,
    body?: unknown,
    params?: Record<string, string | number | boolean>,
    options?: HttpRequestOptions,
  ): Observable<T> {
    return this.http.post<T>(this.url(path), body ?? {}, this.requestOptions(params, options));
  }

  protected put<T>(
    path: string | undefined,
    body?: unknown,
    params?: Record<string, string | number | boolean>,
    options?: HttpRequestOptions,
  ): Observable<T> {
    return this.http.put<T>(this.url(path), body ?? null, this.requestOptions(params, options));
  }

  protected delete<T>(
    path?: string,
    params?: Record<string, string | number | boolean>,
    options?: HttpRequestOptions,
  ): Observable<T> {
    return this.http.delete<T>(this.url(path), this.requestOptions(params, options));
  }

  private requestOptions(
    params?: Record<string, string | number | boolean>,
    options?: HttpRequestOptions,
  ) {
    return {
      params: this.params(params),
      context: toHttpContext(options),
    };
  }

  private url(path?: string): string {
    const base = this.resource.replace(/^\/+|\/+$/g, '');
    const extra = path?.replace(/^\/+|\/+$/g, '');
    return extra ? `/${base}/${extra}` : `/${base}`;
  }

  private params(source?: Record<string, string | number | boolean>): HttpParams | undefined {
    if (!source) {
      return undefined;
    }
    let params = new HttpParams();
    for (const [key, value] of Object.entries(source)) {
      params = params.set(key, String(value));
    }
    return params;
  }
}
