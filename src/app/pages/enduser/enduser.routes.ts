import { Routes } from '@angular/router';
import { roleGuard } from 'src/app/guards/role.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewPlanComponent } from './view-plan/view-plan.component';
import { RequisitionComponent } from './requisition/requisition.component';
import { ReceivingComponent } from './receiving/receiving.component';
import { CanvassingComponent } from './canvassing/canvassing.component';
import { SpecialReceivingComponent } from './special-receiving/special-receiving.component';
import { PpmpListComponent } from './ppmp-list/ppmp-list.component';
import { AppComponent } from './app/app.component';

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
        path: 'view-plan',
        component: ViewPlanComponent,
        data: { breadcrumb: 'View Plan', roles: ['end-user'] },
        canActivate: [roleGuard],
      },
    
      {
        path: 'requisition',
        component: RequisitionComponent,
        data: { breadcrumb: 'Requisition', roles: ['end-user'] },
        canActivate: [roleGuard],
      },

      
      {
        path: 'receiving',
        component: ReceivingComponent,
        data: { breadcrumb: 'Receiving', roles: ['end-user'] },
        canActivate: [roleGuard],
      },

      {
        path: 'special-receiving',
        component: SpecialReceivingComponent,
        data: { breadcrumb: 'Special Receiving', roles: ['end-user','supply'] },
        canActivate: [roleGuard],
      },

        {
        path: 'canvassing',
        component: CanvassingComponent,
        data: { breadcrumb: 'Canvassing', roles: ['end-user'] },
        canActivate: [roleGuard],
      },
      {
        path: 'ppmp-list',
        component: PpmpListComponent,
        data: { breadcrumb: 'PPMP List', roles: ['end-user','supply'] },
        canActivate: [roleGuard],
      },

        {
        path: 'app',
        component: AppComponent,
        data: { breadcrumb: 'Annual Procurement Plan', roles: ['end-user'] },
        canActivate: [roleGuard],
      },
    
    ],
  },
];