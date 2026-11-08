import { Routes } from '@angular/router';

export const quotationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./quotations.page').then((module) => module.QuotationsPage),
  },
];
