import { Routes } from '@angular/router';
import { AssetsComponent } from './assets/assets.component';
import { DisbursementVouchersComponent } from './disbursement-vouchers/disbursement-vouchers.component';
import { DeliveryReceiptsComponent } from './delivery-receipts/delivery-receipts.component';


export const SharedRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'assets',
        component: AssetsComponent,
      },
      {
        path: 'disbursement-vouchers',
        component: DisbursementVouchersComponent,
      },
      {
        path: 'delivery-receipts',
        component: DeliveryReceiptsComponent,
      },
    ],
  },
];
