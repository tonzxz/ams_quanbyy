import { Routes } from '@angular/router';
import { roleGuard } from 'src/app/guards/role.guard';
import { ValidateApprovedRequestComponent } from './validate-approved-request/validate-approved-request.component';
import { PreparePurchasedOrdersComponent } from './prepare-purchased-orders/prepare-purchased-orders.component';
import { ApprovedPurchaseRequestsComponent } from './approved-purchase-requests/approved-purchase-requests.component';
import { PurchaseOrderComponent } from '../shared/purchase-order/purchase-order.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { BacDashboardComponent } from './bac-dashboard/bac-dashboard.component';

export const bacRoutes: Routes = [
  {
    path: 'bac-dashboard',
    component: BacDashboardComponent, // Single page for BAC functionality
    data: { breadcrumb: 'Dashboard', roles: ['bac', 'superadmin'] }, // Only 'bac' and 'superadmin' can access
    canActivate: [roleGuard], // Protect the route with roleGuard
  },
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
  {
    path: 'purchase-orders',
    component: PurchaseOrdersComponent, // Page for preparing purchase orders
    data: { breadcrumb: 'Purchase Orders', roles: ['bac', 'superadmin'] }, // Only 'bac' and 'superadmin' can access
    canActivate: [roleGuard], // Protect the route with roleGuard
  },
];