import { Routes } from '@angular/router';
import { InventoryComponent } from './inventory/inventory.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { roleGuard } from 'src/app/guards/role.guard';
import { ProductTypeComponent } from './product-type/product-type.component';
import { DepartmentComponent } from './department/department.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/department',
        pathMatch: 'full',
      },
      {
        path: 'department',
        component: DepartmentComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'superadmin'], breadcrumb: 'Department' } 
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
       {
        path: 'product-type',
        component: ProductTypeComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'superadmin'], breadcrumb: 'Product Type' } 
      },
    ],
  },
];
