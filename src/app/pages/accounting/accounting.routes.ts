// accounting.routes.ts
import { Routes } from '@angular/router';
import { roleGuard } from 'src/app/guards/role.guard';
import { BudgetComponent } from './budget/budget.component';
import { VoucherReviewComponent } from './voucher-review/voucher-review.component';
import { JournalEntryVoucherComponent } from './journal-entry-voucher/journal-entry-voucher.component';
import { GeneralLedgerComponent } from './general-ledger/general-ledger.component';
import { GeneralJournalComponent } from './general-journal/general-journal.component';
import { PrApprovalComponent } from './pr-approval/pr-approval.component';
import { AccountingDashboardComponent } from './accounting-dashboard/accounting-dashboard.component';
import { ClassificationComponent } from './classification/classification.component';
import { RisAccountingComponent } from './ris-accounting/ris-accounting.component';
import { IssueSlipComponent } from './issue-slip/issue-slip.component';
import { FinalVerificationComponent } from './final-verification/final-verification.component';
import { AppApprovalComponent } from './app-approval/app-approval.component';

export const AccountingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/budget',
        pathMatch: 'full',
      },
      {
        path: 'accounting-dashboard',
        component: AccountingDashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'Budget Management' } 
      },
      {
        path: 'app-approval',
        component: AppApprovalComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'Budget Management' } 
      },
      {
        path: 'budget',
        component: BudgetComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'Budget Management' } 
      },
      {
        path: 'voucher-review',
        component: VoucherReviewComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'Voucher Review' } 
      },
      {
        path: 'journal-entry-voucher',
        component: JournalEntryVoucherComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'Journal Entry Voucher' } 
      },
      {
        path: 'general-ledger',
        component: GeneralLedgerComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'General Ledger' } 
      },
      {
        path: 'general-journal',
        component: GeneralJournalComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'General Journal' } 
      },

      {
        path: 'pr-approval',
        component: PrApprovalComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'Purchase Request Approval' } 
      },
      {
        path: 'classification',
        component: ClassificationComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'Classification' } 
      },
      {
        path: 'ris-accounting',
        component: RisAccountingComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'Requisition and Issue Slips' } 
      },

        {
        path: 'issue-slip',
        component: IssueSlipComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'Requisition and Issue Slips' } 
      },
      {
        path: 'final-verification',
        component: FinalVerificationComponent,
        canActivate: [roleGuard],
        data: { roles: ['accounting', 'superadmin'], breadcrumb: 'Final Verification' } 
      },
    
    ],
  },
];