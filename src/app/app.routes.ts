import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/quotations/quotations.routes').then((module) => module.quotationsRoutes),
  },
];
