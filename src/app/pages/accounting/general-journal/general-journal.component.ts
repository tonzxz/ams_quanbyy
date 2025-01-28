// general-journal.component.ts
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
import { AccountingService, GeneralJournalEntry } from 'src/app/services/accounting.service';
import { LottieAnimationComponent } from '../../ui-components/lottie-animation/lottie-animation.component';
import { InputIcon } from 'primeng/inputicon';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-general-journal',
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
        <mat-card-title>General Journal</mat-card-title>
        <mat-card-subtitle class="mat-body-1 mb-10 !flex justify-between items-center">
          <span>Review and manage journal entries.</span>
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
          [value]="journalEntries"
          [paginator]="true"
          [rows]="5"
          [rowsPerPageOptions]="[5, 10, 20]"
          [globalFilterFields]="['entryNo', 'description']"
          [tableStyle]="{ 'min-width': '50rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Entry No</th>
              <th>Date</th>
              <th>Description</th>
              <th>Account</th>
              <th>Debit</th>
              <th>Credit</th>
              <th style="width: 5rem">Actions</th>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="body" let-entry>
            <tr>
              <td>{{ entry.entryNo }}</td>
              <td>{{ entry.date | date }}</td>
              <td>{{ entry.description }}</td>
              <td>
                <div *ngFor="let trans of entry.transactions" class="py-1">
                  {{ trans.accountName }}
                </div>
              </td>
              <td>
                <div *ngFor="let trans of entry.transactions" class="py-1">
                  {{ trans.debit > 0 ? (trans.debit | currency:'PHP') : '' }}
                </div>
              </td>
              <td>
                <div *ngFor="let trans of entry.transactions" class="py-1">
                  {{ trans.credit > 0 ? (trans.credit | currency:'PHP') : '' }}
                </div>
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
                    (click)="exportToPDF(entry)"
                  ></p-button>
                  <p-button
                    severity="secondary"
                    pTooltip="View Details"
                    [outlined]="true"
                    size="small"
                    icon="pi pi-eye"
                    rounded
                    (click)="viewDetails(entry)"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="footer">
            <tr>
              <td colspan="4" class="text-right font-bold">Totals:</td>
              <td class="font-bold">{{ getTotalDebits() | currency:'PHP' }}</td>
              <td class="font-bold">{{ getTotalCredits() | currency:'PHP' }}</td>
              <td></td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7">
                <div class="flex flex-col w-full items-center justify-center mb-8">
                  <div class="overflow-hidden h-52 w-52 mr-8">
                    <app-lottie-animation animation="box" class="w-60 h-60"></app-lottie-animation>
                  </div>
                  <span>No journal entries found.</span>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </mat-card-content>
    </mat-card>

    <!-- Details Dialog -->
    <p-dialog 
      [(visible)]="showDetailsDialog" 
      [modal]="true" 
      [style]="{width: '50vw'}"
      [header]="'Journal Entry Details - ' + (selectedEntry?.entryNo || '')"
    >
      <div *ngIf="selectedEntry" class="p-4">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="font-bold">Entry Number:</p>
            <p>{{ selectedEntry.entryNo }}</p>
          </div>
          <div>
            <p class="font-bold">Date:</p>
            <p>{{ selectedEntry.date | date:'mediumDate' }}</p>
          </div>
        </div>
        
        <div class="mb-4">
          <p class="font-bold">Description:</p>
          <p>{{ selectedEntry.description }}</p>
        </div>

        <div class="mb-4">
          <p class="font-bold mb-2">Transactions:</p>
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-2 text-left">Account</th>
                <th class="border p-2 text-right">Debit</th>
                <th class="border p-2 text-right">Credit</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let trans of selectedEntry.transactions">
                <td class="border p-2">{{ trans.accountName }}</td>
                <td class="border p-2 text-right">
                  {{ trans.debit > 0 ? (trans.debit | currency:'PHP') : '' }}
                </td>
                <td class="border p-2 text-right">
                  {{ trans.credit > 0 ? (trans.credit | currency:'PHP') : '' }}
                </td>
              </tr>
              <tr class="bg-gray-50">
                <td class="border p-2 font-bold">Totals</td>
                <td class="border p-2 text-right font-bold">
                  {{ selectedEntry.debitTotal | currency:'PHP' }}
                </td>
                <td class="border p-2 text-right font-bold">
                  {{ selectedEntry.creditTotal | currency:'PHP' }}
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
export class GeneralJournalComponent implements OnInit {
  journalEntries: GeneralJournalEntry[] = [];
  searchValue: string = '';
  showDetailsDialog: boolean = false;
  selectedEntry?: GeneralJournalEntry;

  constructor(
    private accountingService: AccountingService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.accountingService.getJournalEntries().subscribe(entries => {
      this.journalEntries = entries;
    });
  }

  getTotalDebits(): number {
    return this.journalEntries.reduce((sum, entry) => 
      sum + entry.debitTotal, 0);
  }

  getTotalCredits(): number {
    return this.journalEntries.reduce((sum, entry) => 
      sum + entry.creditTotal, 0);
  }

  viewDetails(entry: GeneralJournalEntry) {
    this.selectedEntry = entry;
    this.showDetailsDialog = true;
  }

  exportToPDF(entry: GeneralJournalEntry) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(10);
    doc.text('Appendix 1', doc.internal.pageSize.width - 20, 10, { align: 'right' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const title = 'GENERAL JOURNAL';
    const titleWidth = doc.getTextWidth(title);
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(title, titleX, 20);
    
    // Entity information
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Entity Name: QUANBY SOLUTIONS INC.', 20, 30);
    doc.text('Fund Cluster: ________________', doc.internal.pageSize.width - 80, 30);
    
    // Current month and year
    const month = entry.date.toLocaleString('default', { month: 'long' });
    const year = entry.date.getFullYear();
    doc.text(`Month: ${month} ${year}`, 20, 40);
    
    // Table data
    const tableData = entry.transactions.map(t => [
      entry.date.toLocaleDateString(),
      entry.entryNo,
      t.accountName,
      t.accountCode,
      '', // Placeholder for reference
      t.debit || '',
      t.credit || ''
    ]);

    // Table configuration
    (doc as any).autoTable({
      startY: 50,
      head: [
        ['Date', 'JEV No.', 'Particulars', 'UACS Object Code', 'Ref', 'Debit', 'Credit'],
      ],
      body: tableData,
      foot: [[
        '', '', 'Total', '', '',
        entry.debitTotal.toFixed(2),
        entry.creditTotal.toFixed(2)
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
    doc.save(`Journal_Entry_${entry.entryNo}.pdf`);
  }
}