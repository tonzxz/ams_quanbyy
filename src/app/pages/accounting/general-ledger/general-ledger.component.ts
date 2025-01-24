import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MaterialModule } from 'src/app/material.module';
import { LottieAnimationComponent } from '../../ui-components/lottie-animation/lottie-animation.component';
import { FluidModule } from 'primeng/fluid';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

interface LedgerAccount {
  accountCode: string;
  accountName: string;
  debitTotal: number;
  creditTotal: number;
  balance: number;
  transactions: LedgerTransaction[];
}

interface LedgerTransaction {
  date: Date;
  description: string;
  debit: number;
  credit: number;
}

@Component({
  selector: 'app-general-ledger',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TableModule,
    ButtonModule,
    InputText,
    InputIcon,
    IconFieldModule,
    ToastModule,
    LottieAnimationComponent,
    FluidModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    FormsModule,
  ],
  providers: [MessageService],
  templateUrl: './general-ledger.component.html',
  styleUrl: './general-ledger.component.scss',
})
export class GeneralLedgerComponent {
  ledgerAccounts: LedgerAccount[] = [];
  filteredLedgerAccounts: LedgerAccount[] = [];
  searchValue: string = '';
  showTransactionsModal: boolean = false;
  selectedAccount?: LedgerAccount;

  constructor() {}

  ngOnInit(): void {
    this.fetchLedgerAccounts();
  }

  fetchLedgerAccounts() {
    // Mock data for demonstration
    this.ledgerAccounts = [
      {
        accountCode: '1001',
        accountName: 'Cash',
        debitTotal: 15000,
        creditTotal: 5000,
        balance: 10000,
        transactions: [
          {
            date: new Date(),
            description: 'Office Supplies Purchase',
            debit: 5000,
            credit: 0,
          },
          {
            date: new Date(),
            description: 'Utility Bill Payment',
            debit: 0,
            credit: 5000,
          },
        ],
      },
      {
        accountCode: '2001',
        accountName: 'Accounts Payable',
        debitTotal: 0,
        creditTotal: 10000,
        balance: -10000,
        transactions: [
          {
            date: new Date(),
            description: 'Vendor Payment',
            debit: 0,
            credit: 10000,
          },
        ],
      },
    ];
    this.filteredLedgerAccounts = this.ledgerAccounts;
  }

  viewAccountTransactions(account: LedgerAccount) {
    this.selectedAccount = account;
    this.showTransactionsModal = true;
  }
}