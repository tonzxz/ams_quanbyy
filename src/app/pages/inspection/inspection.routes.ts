import { Routes } from '@angular/router';

import { PendingComponent } from './pending-pr/pending/pending.component';
import { ValidatedComponent } from './validated-pr/validated/validated.component';
import { RejectedComponent } from './rejected-pr/rejected/rejected.component';
import { ReceiptApprovalComponent } from './receipt-approval/receipt-approval.component';

export const InspectionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pending-pr/pending',
        component: PendingComponent,
      },
      {
        path: 'validated-pr/validated',
        component: ValidatedComponent,
      },
      {
        path: 'rejected-pr/rejected',
        component: RejectedComponent,
      },
      {
        path: 'receipt-approval',
        component: ReceiptApprovalComponent,
        data: {breadcrumb:'Receipt Approval'}
      },
    ],
  },
];