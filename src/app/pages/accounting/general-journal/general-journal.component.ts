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
}