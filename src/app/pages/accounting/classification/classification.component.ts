import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DeliveryReceipt, DeliveryReceiptService } from 'src/app/services/delivery-receipt.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { LottieAnimationComponent } from "../../ui-components/lottie-animation/lottie-animation.component";
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DropdownModule } from 'primeng/dropdown';

interface JournalEntry {
  accountType: 'debit' | 'credit';
  accountCode: string;
  amount: number;
}

@Component({
  selector: 'app-classification',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    ButtonModule,
    TableModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    LottieAnimationComponent,
    ToastModule,
    ConfirmPopupModule,
    DropdownModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.scss'],
})
export class ClassificationComponent implements OnInit {
  verifiedReceipts: DeliveryReceipt[] = [];
  searchValue: string = '';
  showReceiptDetailsModal: boolean = false;
  showSubmitFormModal: boolean = false;
  selectedReceipt?: DeliveryReceipt;

  // Form-related properties
  accountTypes = [
    { label: 'Debit', value: 'debit' },
    { label: 'Credit', value: 'credit' },
  ];
  newEntry: JournalEntry = {
    accountType: 'debit',
    accountCode: '',
    amount: 0,
  };
  entries: JournalEntry[] = [];

  constructor(
    private deliveryReceiptService: DeliveryReceiptService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    try {
      this.verifiedReceipts = await this.deliveryReceiptService.getVerifiedReceipts();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load verified receipts.',
      });
    }
  }

  viewReceiptDetails(receipt: DeliveryReceipt) {
    this.selectedReceipt = receipt;
    this.showReceiptDetailsModal = true;
  }

  exportPdf(receipt: DeliveryReceipt) {
    const doc = new jsPDF();
    doc.text('Delivery Receipt', 10, 10);
    doc.text(`Receipt Number: ${receipt.receipt_number}`, 10, 20);
    doc.text(`Supplier Name: ${receipt.supplier_name}`, 10, 30);
    doc.text(`Delivery Date: ${receipt.delivery_date}`, 10, 40);
    doc.text(`Total Amount: PHP ${receipt.total_amount}`, 10, 50);
    doc.save(`Delivery_Receipt_${receipt.receipt_number}.pdf`);
  }

  openSubmitForm(receipt: DeliveryReceipt) {
    this.selectedReceipt = receipt;
    this.showSubmitFormModal = true;
    this.entries = []; // Reset entries when opening the form
  }

  addEntry() {
    if (this.isEntryValid(this.newEntry)) {
      this.entries.push({ ...this.newEntry });
      this.resetNewEntry();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all fields correctly.',
      });
    }
  }

  removeEntry(entry: JournalEntry) {
    this.entries = this.entries.filter((e) => e !== entry);
  }
  isEntryValid(entry: JournalEntry): boolean {
    return entry.accountType !== undefined && entry.accountCode.trim() !== '' && entry.amount > 0;
  }

  resetNewEntry() {
    this.newEntry = { accountType: 'debit', accountCode: '', amount: 0 };
  }

  get totalDebits(): number {
    return this.entries
      .filter((e) => e.accountType === 'debit')
      .reduce((sum, e) => sum + e.amount, 0);
  }

  get totalCredits(): number {
    return this.entries
      .filter((e) => e.accountType === 'credit')
      .reduce((sum, e) => sum + e.amount, 0);
  }

  get isBalanced(): boolean {
    return this.totalDebits === this.totalCredits;
  }

  confirmSubmission() {
    if (this.isBalanced) {
      this.submitJournalEntry();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debits and credits must balance.',
      });
    }
  }

  async submitJournalEntry() {
    try {
      // Replace with actual API call
      console.log('Submitting journal entry:', this.entries);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Journal entry submitted successfully!',
      });
      this.showSubmitFormModal = false;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to submit journal entry.',
      });
    }
  }
}
