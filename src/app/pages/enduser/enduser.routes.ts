import { Routes } from '@angular/router';
import { roleGuard } from 'src/app/guards/role.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreatePlanComponent } from './create-plan/create-plan.component';
import { ViewPlanComponent } from './view-plan/view-plan.component';
import { ApprovedBudgetComponent } from './approved-budget/approved-budget.component';
import { PlanTrackingComponent } from './plan-tracking/plan-tracking.component';

export const enduserRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { breadcrumb: 'Dashboard', roles: ['end-user'] }, // Use 'end-user' role
        canActivate: [roleGuard],
      },
      {
        path: 'create-plan',
        component: CreatePlanComponent,
        data: { breadcrumb: 'Create Plan', roles: ['end-user'] },
        canActivate: [roleGuard],
      },
      {
        path: 'view-plan',
        component: ViewPlanComponent,
        data: { breadcrumb: 'View Plan', roles: ['end-user'] },
        canActivate: [roleGuard],
      },
      {
        path: 'approved-budget',
        component: ApprovedBudgetComponent,
        data: { breadcrumb: 'Approved Budget', roles: ['end-user'] },
        canActivate: [roleGuard],
      },
      {
        path: 'plan-tracking',
        component: PlanTrackingComponent,
        data: { breadcrumb: 'Plan Tracking', roles: ['end-user'] },
        canActivate: [roleGuard],
      },
    ],
  },
];