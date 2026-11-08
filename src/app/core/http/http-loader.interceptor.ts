import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { HTTP_LOADER_SCOPE, HTTP_SHOW_LOADER } from './http-loader.context';
import { HttpLoaderService } from './http-loader.service';

export const httpLoaderInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(HTTP_SHOW_LOADER)) {
    return next(req);
  }

  const loader = inject(HttpLoaderService);
  const scope = req.context.get(HTTP_LOADER_SCOPE);
  loader.begin(scope);

  return next(req).pipe(finalize(() => loader.end(scope)));
};
