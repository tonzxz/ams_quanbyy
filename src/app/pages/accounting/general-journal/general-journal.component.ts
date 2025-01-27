import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { LottieAnimationComponent } from "../../ui-components/lottie-animation/lottie-animation.component";
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface JournalEntry {
  entryNo: string;
  date: Date;
  description: string;
  debitTotal: number;
  creditTotal: number;
  transactions: { account: string; debit: number; credit: number }[];
}

interface Account {
  code: string;
  name: string;
}

@Component({
  selector: 'app-general-journal',
  standalone: true,
  imports: [
    ToastModule,
    InputIconModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    ConfirmPopupModule,
    MaterialModule,
    IconFieldModule,
    LottieAnimationComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './general-journal.component.html',
  styleUrls: ['./general-journal.component.scss'],
})
export class GeneralJournalComponent implements OnInit {
  journalEntries: JournalEntry[] = [];
  filteredJournalEntries: JournalEntry[] = [];
  searchValue: string = '';
  showAddEntryModal: boolean = false;
  selectedEntry?: JournalEntry;
  isEditing: boolean = false;
  accounts: Account[] = [
    { code: '1001', name: 'Cash' },
    { code: '2001', name: 'Accounts Payable' },
    { code: '3001', name: 'Sales Revenue' },
  ];

  journalEntryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.journalEntryForm = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      transactions: this.fb.array([this.createTransaction()], Validators.required),
    });
  }

  ngOnInit(): void {
    this.fetchJournalEntries();
  }

  fetchJournalEntries() {
    // Mock data for demonstration
    this.journalEntries = [
      {
        entryNo: 'JE-001',
        date: new Date(),
        description: 'Office Supplies Purchase',
        debitTotal: 5000,
        creditTotal: 5000,
        transactions: [
          { account: '1001', debit: 5000, credit: 0 },
          { account: '2001', debit: 0, credit: 5000 },
        ],
      },
    ];
    this.filteredJournalEntries = this.journalEntries;
  }

  get transactions() {
    return this.journalEntryForm.get('transactions') as FormArray;
  }

  createTransaction(): FormGroup {
    return this.fb.group({
      account: ['', Validators.required],
      debit: [0, Validators.min(0)],
      credit: [0, Validators.min(0)],
    });
  }

  addTransaction() {
    this.transactions.push(this.createTransaction());
  }

  removeTransaction(index: number) {
    this.transactions.removeAt(index);
  }

  saveEntry() {
    if (this.journalEntryForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields.' });
      return;
    }

    const formValue = this.journalEntryForm.value;
    if (this.isEditing && this.selectedEntry) {
      // Update existing entry
      this.selectedEntry.date = formValue.date;
      this.selectedEntry.description = formValue.description;
      this.selectedEntry.transactions = formValue.transactions;
      this.selectedEntry.debitTotal = formValue.transactions.reduce((sum: number, t: any) => sum + t.debit, 0);
      this.selectedEntry.creditTotal = formValue.transactions.reduce((sum: number, t: any) => sum + t.credit, 0);
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        entryNo: `JE-${this.journalEntries.length + 1}`,
        date: formValue.date,
        description: formValue.description,
        debitTotal: formValue.transactions.reduce((sum: number, t: any) => sum + t.debit, 0),
        creditTotal: formValue.transactions.reduce((sum: number, t: any) => sum + t.credit, 0),
        transactions: formValue.transactions,
      };

      this.journalEntries.push(newEntry);
    }

    this.filteredJournalEntries = this.journalEntries;
    this.showAddEntryModal = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Journal entry saved.' });
  }

  editEntry(entry: JournalEntry) {
    this.isEditing = true;
    this.selectedEntry = entry;
    this.journalEntryForm.patchValue({
      date: entry.date,
      description: entry.description,
    });

    this.transactions.clear();
    entry.transactions.forEach((transaction) => {
      this.transactions.push(this.fb.group(transaction));
    });

    this.showAddEntryModal = true;
  }

  confirmDeleteEntry(event: Event, entryNo: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this journal entry?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.journalEntries = this.journalEntries.filter((entry) => entry.entryNo !== entryNo);
        this.filteredJournalEntries = this.journalEntries;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Journal entry deleted.' });
      },
    });
  }

  exportToPDF(entry: JournalEntry) {
    const doc = new jsPDF();
    
    doc.setFontSize(10);
    doc.text('Appendix 1', doc.internal.pageSize.width - 20, 10, { align: 'right' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const ledgerText = 'GENERAL JOURNAL';
    const ledgerWidth = doc.getTextWidth(ledgerText);
    const ledgerCenterX = (doc.internal.pageSize.width - ledgerWidth) / 2;
    doc.text(ledgerText, ledgerCenterX, 20);
   
    doc.setFontSize(10);
    const monthText = 'Month: ___________________';
    const monthWidth = doc.getTextWidth(monthText);
    const monthCenterX = (doc.internal.pageSize.width - monthWidth) / 2;
    doc.text(monthText, monthCenterX, 30);
    
    doc.text('Entity Name: _________________________', 10, 40);
    doc.text('Fund Cluster: _________________________', 10, 50);
    doc.text('Sheet No.: _________________________', doc.internal.pageSize.width - 100, 50); 
   
    const columns = ['Date', 'JEV No.', 'Particulars', 'UACS Objects Code', 'P', { content: 'Amount', colSpan: 2 }];
    const subColumns = ['', '', '', '', '', 'Debit', 'Credit'];

    const rows = entry.transactions.map(transaction => [
        entry.date.toLocaleDateString(),
        entry.entryNo,
        entry.description,
        transaction.account,
        '', 
        transaction.debit,
        transaction.credit,
    ]);

    while (rows.length < 20) {
        rows.push(['', '', '', '', '', '', '']); 
    }
   
    rows.push([
        '',
        '',
        '',
        'Totals',
        '',
        entry.debitTotal.toFixed(2),
        entry.creditTotal.toFixed(2),
    ]);
  
    const tableOptions = {
        startY: 60,
        head: [columns, subColumns],
        body: rows,
        theme: 'plain',
        styles: {
            fontSize: 9,
            font: 'helvetica',
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: false,
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            halign: 'center', 
        },
        bodyStyles: {
            fillColor: false,
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
        },
        columnStyles: {
            5: { halign: 'center' }, 
            6: { halign: 'center' }, 
        },
    };
    
    (doc as any).autoTable(tableOptions);
    const finalY = (doc as any).lastAutoTable.finalY;
   
    doc.setFontSize(10);
    const certifiedText = 'CERTIFIED CORRECT:';
    const certifiedWidth = doc.getTextWidth(certifiedText);
    const certifiedCenterX = (doc.internal.pageSize.width - certifiedWidth) / 2;
    doc.text(certifiedText, certifiedCenterX, finalY + 5);
   
    const signatureY = doc.internal.pageSize.height - 25; 
 
    const lineStartX = doc.internal.pageSize.width - 100;
    const lineEndX = doc.internal.pageSize.width - 20;
    const lineY = signatureY - 5;
    doc.line(lineStartX, lineY, lineEndX, lineY); 
    
    const signatureText = '(Signature over Printed Name)';
    const signatureWidth = doc.getTextWidth(signatureText);
    const signatureCenterX = (lineStartX + lineEndX - signatureWidth) / 2;
    doc.text(signatureText, signatureCenterX, signatureY);
 
    const chiefAccountantText = 'Chief Accountant/Head of\nAccounting Division/Unit';
    const chiefAccountantWidth = doc.getTextWidth(chiefAccountantText.split('\n')[0]); 
    const chiefAccountantCenterX = (lineStartX + lineEndX - chiefAccountantWidth) / 2; 
    doc.text(chiefAccountantText, chiefAccountantCenterX, signatureY + 5);
    
    doc.save(`${entry.entryNo}_general_ledger.pdf`);
}

}