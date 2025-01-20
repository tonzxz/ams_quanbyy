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
        data: {breadcrumb:'Dashboard'}
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
          data: {breadcrumb:'UI Components '}
      },
      {
        path: 'inspection',
        loadChildren: () =>
          import('./pages/inspection/inspection.routes').then(
            (m) => m.InspectionRoutes
          ),
          data: { breadcrumb: 'Inspection' }
      },
      {
        path: 'supply-management',
        data: { breadcrumb: 'Supply Management' },
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
          data: {breadcrumb:'Views'}
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
        data: {breadcrumb:'Extra'}
      },
      {
        path: 'admin',
        data: { breadcrumb: 'Admin' },
        loadChildren: () =>
          import('./pages/admin/admin.routes').then((m) => m.AdminRoutes), 
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
    redirectTo: '/dashboard',
  },
];
