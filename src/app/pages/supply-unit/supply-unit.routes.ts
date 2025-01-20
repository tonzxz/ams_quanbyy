import { Routes } from '@angular/router';
import { UploadDeliveryReceiptComponent } from './upload-delivery-receipt/upload-delivery-receipt.component';
import { roleGuard } from 'src/app/guards/role.guard';
import { StockingComponent } from './stocking/stocking.component';


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
        path: 'stocking',
        component: StockingComponent,
        canActivate: [roleGuard],
        data: { roles: ['supply', 'superadmin'], breadcrumb: 'Stocking'  } // specify roles here
      },
      {
        path: 'upload-delivery-receipt',
        component: UploadDeliveryReceiptComponent,
        canActivate: [roleGuard],
        data: { roles: ['supply', 'superadmin'], breadcrumb: 'Upload Delivery Receipt' } // specify roles here
      },
    ],
  },
];
