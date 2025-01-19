import { Routes } from '@angular/router';
import { AssetsComponent } from './assets/assets.component';
import { DisbursementVouchersComponent } from './disbursement-vouchers/disbursement-vouchers.component';
import { DeliveryReceiptsComponent } from './delivery-receipts/delivery-receipts.component';


export const SharedRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/assets',
        pathMatch: 'full',
      },
      {
        path: 'assets',
        component: AssetsComponent,
        data: {breadcrumb:'Assets'}
      },
      {
        path: 'disbursement-vouchers',
        component: DisbursementVouchersComponent,
        data: {breadcrumb:'Disbursement Vouchers'}
      },
      {
        path: 'delivery-receipts',
        component: DeliveryReceiptsComponent,
        data: {breadcrumb:'Delivery Receipts'}
      },
    ],
  },
];
