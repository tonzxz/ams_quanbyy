// general-ledger.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MaterialModule } from 'src/app/material.module';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { AccountingService, LedgerAccount } from 'src/app/services/accounting.service';
import { LottieAnimationComponent } from '../../ui-components/lottie-animation/lottie-animation.component';
import { InputIcon } from 'primeng/inputicon';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-general-ledger',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ToastModule,
    IconFieldModule,
    InputTextModule,
    TooltipModule,
    LottieAnimationComponent,
    InputIcon
  ],
  providers: [MessageService],
  template: `
    <mat-card class="cardWithShadow">
      <mat-card-content>
        <mat-card-title>General Ledger</mat-card-title>
        <mat-card-subtitle class="mat-body-1 mb-10 !flex justify-between items-center">
          <span>Review and manage ledger accounts and their transactions.</span>
          <div class="flex gap-3">
            <p-iconfield fluid class="w-full max-w-72">
              <p-inputicon styleClass="pi pi-search" />
              <input
                fluid
                class="w-full"
                pSize="small"
                [(ngModel)]="searchValue"
                (input)="dt.filterGlobal(searchValue, 'contains')"
                type="text"
                pInputText
                placeholder="Search"
              />
            </p-iconfield>
          </div>
        </mat-card-subtitle>

        <p-table
          #dt
          [value]="ledgerAccounts"
          [paginator]="true"
          [rows]="5"
          [rowsPerPageOptions]="[5, 10, 20]"
          [globalFilterFields]="['accountCode', 'accountName']"
          [tableStyle]="{ 'min-width': '50rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Account Code</th>
              <th>Account Name</th>
              <th>Debit Total</th>
              <th>Credit Total</th>
              <th>Balance</th>
              <th style="width: 5rem">Actions</th>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="body" let-account>
            <tr>
              <td>{{ account.accountCode }}</td>
              <td>{{ account.accountName }}</td>
              <td>{{ account.debitTotal | currency:'PHP' }}</td>
              <td>{{ account.creditTotal | currency:'PHP' }}</td>
              <td [ngClass]="{
                'text-green-600': account.balance > 0,
                'text-red-600': account.balance < 0
              }">
                {{ account.balance | currency:'PHP' }}
              </td>
              <td>
                <div class="flex gap-2">
                  <p-button
                    severity="info"
                    pTooltip="Export to PDF"
                    [outlined]="true"
                    size="small"
                    icon="pi pi-file-pdf"
                    rounded
                    (click)="exportToPDF(account)"
                  ></p-button>
                  <p-button
                    severity="secondary"
                    pTooltip="View Transactions"
                    [outlined]="true"
                    size="small"
                    icon="pi pi-list"
                    rounded
                    (click)="viewTransactions(account)"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="footer">
            <tr>
              <td colspan="2" class="text-right font-bold">Totals:</td>
              <td class="font-bold">{{ getTotalDebits() | currency:'PHP' }}</td>
              <td class="font-bold">{{ getTotalCredits() | currency:'PHP' }}</td>
              <td class="font-bold">{{ getNetBalance() | currency:'PHP' }}</td>
              <td></td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6">
                <div class="flex flex-col w-full items-center justify-center mb-8">
                  <div class="overflow-hidden h-52 w-52 mr-8">
                    <app-lottie-animation animation="box" class="w-60 h-60"></app-lottie-animation>
                  </div>
                  <span>No ledger accounts found.</span>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </mat-card-content>
    </mat-card>

    <!-- Transactions Dialog -->
    <p-dialog 
      [(visible)]="showTransactionsDialog" 
      [modal]="true" 
      [style]="{width: '60vw'}"
      [header]="'Account Transactions - ' + (selectedAccount?.accountName || '')"
    >
      <div *ngIf="selectedAccount" class="p-4">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="font-bold">Account Code:</p>
            <p>{{ selectedAccount.accountCode }}</p>
          </div>
          <div>
            <p class="font-bold">Current Balance:</p>
            <p [ngClass]="{
              'text-green-600': selectedAccount.balance > 0,
              'text-red-600': selectedAccount.balance < 0
            }">
              {{ selectedAccount.balance | currency:'PHP' }}
            </p>
          </div>
        </div>

        <div class="mb-4">
          <p class="font-bold mb-2">Transaction History:</p>
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-2">Date</th>
                <th class="border p-2">Description</th>
                <th class="border p-2 text-right">Debit</th>
                <th class="border p-2 text-right">Credit</th>
                <th class="border p-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let trans of selectedAccount.transactions">
                <td class="border p-2">{{ trans.date | date:'mediumDate' }}</td>
                <td class="border p-2">{{ trans.description }}</td>
                <td class="border p-2 text-right">
                  {{ trans.debit > 0 ? (trans.debit | currency:'PHP') : '' }}
                </td>
                <td class="border p-2 text-right">
                  {{ trans.credit > 0 ? (trans.credit | currency:'PHP') : '' }}
                </td>
                <td class="border p-2 text-right" [ngClass]="{
                  'text-green-600': trans.balance > 0,
                  'text-red-600': trans.balance < 0
                }">
                  {{ trans.balance | currency:'PHP' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </p-dialog>

    <p-toast position="bottom-right" />
  `
})
export class GeneralLedgerComponent implements OnInit {
  ledgerAccounts: LedgerAccount[] = [];
  searchValue: string = '';
  showTransactionsDialog: boolean = false;
  selectedAccount?: LedgerAccount;

  constructor(
    private accountingService: AccountingService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.accountingService.getLedgerAccounts().subscribe(accounts => {
      this.ledgerAccounts = accounts;
    });
  }

  getTotalDebits(): number {
    return this.ledgerAccounts.reduce((sum, account) => 
      sum + account.debitTotal, 0);
  }

  getTotalCredits(): number {
    return this.ledgerAccounts.reduce((sum, account) => 
      sum + account.creditTotal, 0);
  }

  getNetBalance(): number {
    return this.ledgerAccounts.reduce((sum, account) => 
      sum + account.balance, 0);
  }

  viewTransactions(account: LedgerAccount) {
    this.selectedAccount = account;
    this.showTransactionsDialog = true;
  }

  exportToPDF(account: LedgerAccount) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(10);
    doc.text('Appendix 5', doc.internal.pageSize.width - 20, 10, { align: 'right' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const title = 'GENERAL LEDGER';
    const titleWidth = doc.getTextWidth(title);
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(title, titleX, 20);
    
    // Entity information
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Entity Name: QUANBY SOLUTIONS INC.', 20, 30);
    doc.text('Fund Cluster: ________________', doc.internal.pageSize.width - 80, 30);
    
    // Account information
    doc.text(`Account Title: ${account.accountName}`, 20, 40);
    doc.text(`Account Code: ${account.accountCode}`, doc.internal.pageSize.width - 80, 40);
    
    // Table data
    const tableData = account.transactions.map(t => [
      t.date.toLocaleDateString(),
      t.description,
      '', // Reference placeholder
      t.debit || '',
      t.credit || '',
      t.balance
    ]);

    // Table configuration
    (doc as any).autoTable({
      startY: 50,
      head: [
        ['Date', 'Particulars', 'Ref', 'Debit', 'Credit', 'Balance'],
      ],
      body: tableData,
      foot: [[
        'Total', '', '',
        account.debitTotal.toFixed(2),
        account.creditTotal.toFixed(2),
        account.balance.toFixed(2)
      ]],
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.1
      },
      footStyles: {
        fontStyle: 'bold'
      }
    });

    // Add signature lines
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.text('Prepared by:', 20, finalY);
    doc.text('Reviewed by:', doc.internal.pageSize.width / 2 - 20, finalY);
    doc.text('Approved by:', doc.internal.pageSize.width - 60, finalY);

    // Save the PDF
    doc.save(`Ledger_${account.accountCode}_${account.accountName}.pdf`);
  }
}