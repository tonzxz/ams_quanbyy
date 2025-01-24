import { Routes } from '@angular/router';
import { AssetsComponent } from './assets/assets.component';
import { DisbursementVouchersComponent } from './disbursement-vouchers/disbursement-vouchers.component';
import { DeliveryReceiptsComponent } from './delivery-receipts/delivery-receipts.component';
import { DeliveredItemsComponent } from './delivered-items/delivered-items.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { RequestQuotationComponent } from './request-quotation/request-quotation.component';
import { PurchaseReqComponent } from './purchase-req/purchase-req.component';
import { DisbursementComponent } from './disbursement/disbursement.component';
import { StockCardComponent } from './stock-card/stock-card.component';

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
       {
        path: 'approvals',
        component: ApprovalsComponent,
        data: {breadcrumb:'Approvals'}
      },
      {
        path: 'request-quotation',
        component: RequestQuotationComponent,
        data: {breadcrumb:'Request Quotation'}
      },
      {
        path: 'purchase-req',
        component: PurchaseReqComponent,
        data: {breadcrumb:'Purchase Request'}
      },
      {
        path: 'disbursement',
        component: DisbursementComponent,
        data: {breadcrumb:'Disbursement Template'}
      },
      {
        path: 'stock-card',
        component: StockCardComponent,
        data: {breadcrumb:'Stock Card Template'}
      }
    ],
  },
];
