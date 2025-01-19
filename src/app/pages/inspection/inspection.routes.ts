import { Routes } from '@angular/router';

import { ValidatedComponent } from './validated-pr/validated/validated.component';

export const InspectionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'validated-pr',
        component: ValidatedComponent,
      },
    ],
  },
];