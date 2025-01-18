import { Routes } from '@angular/router';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { UploadDeliveryReceiptComponent } from './upload-delivery-receipt/upload-delivery-receipt.component';
import { roleGuard } from 'src/app/guards/role.guard';


export const SupplyUnitRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'purchase-orders',
        component: PurchaseOrdersComponent,
        canActivate: [roleGuard],
        data: { roles: ['supply', 'superadmin'] } // specify roles here
      },
      {
        path: 'upload-delivery-receipt',
        component: UploadDeliveryReceiptComponent,
        canActivate: [roleGuard],
        data: { roles: ['supply', 'superadmin'] } // specify roles here
      },
    ],
  },
];
