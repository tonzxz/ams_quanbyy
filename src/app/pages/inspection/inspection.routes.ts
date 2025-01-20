import { Routes } from '@angular/router';

import { PurchaseRequestComponent } from './purchase-request/purchase-request/purchase-request.component';

export const InspectionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'purchase-request/purchase-request',
        component: PurchaseRequestComponent,
        data: {breadcrumb: 'Purchase Requests'}

      },
    ],
  },
];