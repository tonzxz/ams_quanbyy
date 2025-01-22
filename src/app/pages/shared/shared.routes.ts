import { Routes } from '@angular/router';
import { AssetsComponent } from './assets/assets.component';
import { DisbursementVouchersComponent } from './disbursement-vouchers/disbursement-vouchers.component';
import { DeliveryReceiptsComponent } from './delivery-receipts/delivery-receipts.component';
import { DeliveredItemsComponent } from './delivered-items/delivered-items.component';


export const SharedRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/inventory',
        pathMatch: 'full',
      },
      {
        path: 'inventory',
        component: AssetsComponent,
        data: {breadcrumb:'Inventory'}
      },
      {
        path: 'delivered-items',
        component: DeliveredItemsComponent,
        data: {breadcrumb:'Delivered Items'}
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
