import { HttpInterceptorFn } from '@angular/common/http';
import { delay } from 'rxjs';

export const mockLatencyInterceptor: HttpInterceptorFn = (req, next) => {
  const term = req.params.get('q') ?? '';
  const latency = term.length > 0 && term.length < 4 ? 1500 : 400;
  return next(req).pipe(delay(latency));
};
