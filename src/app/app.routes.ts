import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { authGuard } from './guards/auth.guard';
import { dashboardGuard } from './guards/dashboard.guard';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'supply-unit',
        loadChildren: () =>
          import('./pages/supply-unit/supply-unit.routes').then(
            (m) => m.SupplyUnitRoutes
          ),
      },
      {
        path: 'shared',
        loadChildren: () =>
          import('./pages/shared/shared.routes').then(
            (m) => m.SharedRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
    canActivate: [dashboardGuard], 
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),

          canActivate: [authGuard], 
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
