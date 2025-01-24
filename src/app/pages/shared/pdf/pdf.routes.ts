import { Routes } from '@angular/router';
import { RequestQuotationComponent } from './request-quotation/request-quotation.component';

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
        path: '/request-quotation',
        component: RequestQuotationComponent,
        data: {breadcrumb:'Request Quotation'}
      },
    ],
  },
];