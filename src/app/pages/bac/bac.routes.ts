import { Routes } from '@angular/router';
import { roleGuard } from 'src/app/guards/role.guard';
import { ValidateApprovedRequestComponent } from './validate-approved-request/validate-approved-request.component';
import { PreparePurchasedOrdersComponent } from './prepare-purchased-orders/prepare-purchased-orders.component';

export const bacRoutes: Routes = [
  {
    path: 'validate-approved-request',
    component: ValidateApprovedRequestComponent, // Single page for BAC functionality
    data: { breadcrumb: 'Validate Approved Request', roles: ['bac', 'superadmin'] }, // Only 'bac' and 'superadmin' can access
    canActivate: [roleGuard], // Protect the route with roleGuard
  },
  {
    path: 'prepare-purchase-orders',
    component: PreparePurchasedOrdersComponent, // Page for preparing purchase orders
    data: { breadcrumb: 'Prepare Purchase Orders', roles: ['bac', 'superadmin'] }, // Only 'bac' and 'superadmin' can access
    canActivate: [roleGuard], // Protect the route with roleGuard
  },
];