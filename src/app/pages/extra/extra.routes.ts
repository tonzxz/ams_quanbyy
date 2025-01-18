import { Routes } from '@angular/router';


// pages
import { AppIconsComponent } from './icons/icons.component';
import { AppSamplePageComponent } from './sample-page/sample-page.component';
import { ValidatedComponent } from './validated/validated.component';
import { RejectedComponent } from './rejected/rejected.component';

export const ExtraRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'icons',
        component: AppIconsComponent,
      },
      {
        path: 'sample-page',
        component: AppSamplePageComponent,
      },
      {
        path: 'validated',
        component: ValidatedComponent,
      },
      {
        path: 'rejected',
        component: RejectedComponent,
      },
    ],
  },
];
