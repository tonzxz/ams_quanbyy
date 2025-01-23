// accounting.routes.ts
import { Routes } from '@angular/router';
import { roleGuard } from 'src/app/guards/role.guard';
import { BudgetComponent } from './budget/budget.component';
import { VoucherReviewComponent } from './voucher-review/voucher-review.component';

export const AccountingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/budget',
        pathMatch: 'full',
      },
      {
        path: 'budget',
        component: BudgetComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'Budget Management' } 
      },
      {
        path: 'voucher-review',
        component: VoucherReviewComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'Voucher Review' } 
      },
    
    ],
  },
];