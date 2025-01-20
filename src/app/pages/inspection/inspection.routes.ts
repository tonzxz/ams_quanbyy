import { Routes } from '@angular/router';

import { PurchaseRequestComponent } from './purchase-request/purchase-request/purchase-request.component';
import { ReceiptApprovalComponent } from './receipt-approval/receipt-approval.component';

export const InspectionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'purchase-request/purchase-request',
        component: PurchaseRequestComponent,
        data: {breadcrumb: 'Purchase Requests'}

      },
      {
        path: 'receipt-approval',
        component: ReceiptApprovalComponent,
        data: {breadcrumb:'Receipt Approval'}
      },
    ],
  },
];