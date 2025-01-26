import { Routes } from '@angular/router';
import { roleGuard } from 'src/app/guards/role.guard';
import { ValidateApprovedRequestComponent } from './validate-approved-request/validate-approved-request.component';
import { PreparePurchasedOrdersComponent } from './prepare-purchased-orders/prepare-purchased-orders.component';
import { ApprovedPurchaseRequestsComponent } from './approved-purchase-requests/approved-purchase-requests.component';

export const bacRoutes: Routes = [
  {
    path: 'validate-approved-request',
    component: ValidateApprovedRequestComponent, // Single page for BAC functionality
    data: { breadcrumb: 'Validate Approved Request', roles: ['bac'] }, // Only 'bac' and 'superadmin' can access
    canActivate: [roleGuard], // Protect the route with roleGuard
  },
  {
    path: 'prepare-purchase-orders',
    component: PreparePurchasedOrdersComponent, // Page for preparing purchase orders
    data: { breadcrumb: 'Prepare Purchase Orders', roles: ['bac'] }, // Only 'bac' and 'superadmin' can access
    canActivate: [roleGuard], // Protect the route with roleGuard
  },
   {
    path: 'approved-purchase-requests',
    component: ApprovedPurchaseRequestsComponent, // Page for preparing purchase orders
    data: { breadcrumb: 'Approved Purchase Requests', roles: ['bac'] }, // Only 'bac' and 'superadmin' can access
    canActivate: [roleGuard], // Protect the route with roleGuard
  },
];