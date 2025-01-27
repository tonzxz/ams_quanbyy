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
import { RisComponent } from './ris/ris.component';
import { SemiExpendableComponent } from './semi-expendable/semi-expendable.component';
import { AoqComponent } from './aoq/aoq.component';
import { BudgetUtilizationComponent } from './budget-utilization/budget-utilization.component';
import { RequestForQuotationListComponent } from './request-for-quotation-list/request-for-quotation-list.component';
import { RfqComponent } from './rfq/rfq.component';
import { BACResolutionComponent } from './bac-resolution/bac-resolution.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';

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
       {  //delete from here
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
      },
      {
        path: 'ris',
        component: RisComponent,
        data: {breadcrumb:'Requisition and Issue Slip Template'}
      },
      {
        path: 'semi-expendable',
        component: SemiExpendableComponent,
        data: {breadcrumb:'Report of Semi-Expendable Property Issued Template'}
      },
      {
        path: 'aoq',
        component: AoqComponent,
        data: {breadcrumb:'Abstract of Quotations Template'}
      },
      {
        path: 'budget-utilization',
        component: BudgetUtilizationComponent,
        data: {breadcrumb:'Budget Utilization Report Template'}
      },
      {
        path: 'rfq-list',
        component: RequestForQuotationListComponent,
        data: {breadcrumb:'Request for Quotations'}
      },
      {
        path: 'rfq',
        component: RfqComponent,
        data: {breadcrumb:'Request for Quotation Template'}
      },
      {
        path: 'bac-resolution',
        component: BACResolutionComponent,
        data: {breadcrumb:'BAC Resolution Template'}
      },
      {
        path: 'purchase-order',
        component: PurchaseOrderComponent,
        data: {breadcrumb:'Purchase Order Template'}
      },
    ],
  },
];
