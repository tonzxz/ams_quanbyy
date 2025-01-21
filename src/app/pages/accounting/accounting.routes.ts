// accounting.routes.ts
import { Routes } from '@angular/router';
import { roleGuard } from 'src/app/guards/role.guard';
import { BudgetComponent } from './budget/budget.component';

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
    
    ],
  },
];