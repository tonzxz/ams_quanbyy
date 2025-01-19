import { Routes } from '@angular/router';
import { BuildingsComponent } from './buildings/buildings.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { roleGuard } from 'src/app/guards/role.guard';

export const AdminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/buildings',
        pathMatch: 'full',
      },
      {
        path: 'buildings',
        component: BuildingsComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'superadmin'], breadcrumb: 'Buildings' } 
      },
      {
        path: 'inventory',
        component: InventoryComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'superadmin'], breadcrumb: 'Inventory' } 
      },
      {
        path: 'supplier-list',
        component: SupplierListComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'superadmin'], breadcrumb: 'Supplier List' } 
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'superadmin'], breadcrumb: 'User Management' } 
      },
    ],
  },
];
