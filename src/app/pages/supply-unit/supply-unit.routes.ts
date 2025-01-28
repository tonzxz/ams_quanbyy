import { Routes } from '@angular/router';
import { UploadDeliveryReceiptComponent } from './upload-delivery-receipt/upload-delivery-receipt.component';
import { roleGuard } from 'src/app/guards/role.guard';
import { StockingComponent } from './stocking/stocking.component';
import { RsmiComponent } from './rsmi/rsmi.component';
import { IcsComponent } from './ics/ics.component';
import { ParComponent } from './par/par.component';
import { CompileReportsComponent } from './compile-reports/compile-reports.component';
import { SupplyDashboardComponent } from './supply-dashboard/supply-dashboard.component';
import { DeliveryComponent } from './delivery/delivery.component';


export const SupplyUnitRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/stocking',
        pathMatch: 'full',
      },
      {
        path: 'supply-dashboard',
        component: SupplyDashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['supply', 'superadmin'], breadcrumb: 'Dashboard'  } // specify roles here
      },
      {
        path: 'stocking',
        component: StockingComponent,
        canActivate: [roleGuard],
        data: { roles: ['supply', 'superadmin','end-user'], breadcrumb: 'Supplies'  } // specify roles here
      },
      {
        path: 'upload-delivery-receipt',
        component: UploadDeliveryReceiptComponent,
        canActivate: [roleGuard],
        data: { roles: ['supply', 'superadmin'], breadcrumb: 'Upload Delivery Receipt' } // specify roles here
      },
      {
        path: 'rsmi',
        component: RsmiComponent,
        canActivate: [roleGuard],
        data: { roles: ['supply', 'superadmin'], breadcrumb: 'Generate RSMI' } // specify roles here
      },
      {
        path: 'par',
        component: ParComponent,
        canActivate: [roleGuard],
        data: { roles: ['supply', 'superadmin'], breadcrumb: 'Generate PAR' } // specify roles here
      },
      {
        path: 'ics',
        component: IcsComponent,
        canActivate: [roleGuard],
        data: { roles: ['supply', 'superadmin'], breadcrumb: 'Generate ICS' } // specify roles here
      },
      {
        path: 'compile-reports',
        component: CompileReportsComponent,
        canActivate: [roleGuard],
        data: { roles: ['supply', 'superadmin'], breadcrumb: 'Generate ICS' } // specify roles here
      },
       {
        path: 'delivery',
        component: DeliveryComponent,
        canActivate: [roleGuard],
        data: { roles: ['supply', 'superadmin'], breadcrumb: 'Delivery' } // specify roles here
      },
    ],
  },
];
