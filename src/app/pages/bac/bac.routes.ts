import { Routes } from '@angular/router';
import { roleGuard } from 'src/app/guards/role.guard';
import { ValidateApprovedRequestComponent } from './validate-approved-request/validate-approved-request.component';

export const bacRoutes: Routes = [
  {
    path: 'validate-approved-request',
    component: ValidateApprovedRequestComponent, // Single page for BAC functionality
    data: { breadcrumb: 'Validate Approved Request', roles: ['bac', 'superadmin'] }, // Only 'bac' and 'superadmin' can access
    canActivate: [roleGuard], // Protect the route with roleGuard
  },
];