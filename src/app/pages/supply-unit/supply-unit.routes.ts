import { Routes } from '@angular/router';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { UploadDeliveryReceiptComponent } from './upload-delivery-receipt/upload-delivery-receipt.component';


export const SupplyUnitRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'purchase-orders',
        component: PurchaseOrdersComponent,
      },
      {
        path: 'upload-delivery-receipt',
        component: UploadDeliveryReceiptComponent,
      },
    ],
  },
];
