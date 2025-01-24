import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { FormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

interface JournalEntry {
  entryNo: string;
  description: string;
  date: Date;
  debitAmount: number;
  creditAmount: number;
}

@Component({
  selector: 'app-journal-entry-voucher',
  standalone: true,
  imports: [
    ConfirmPopupModule,
    FormsModule,
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
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './journal-entry-voucher.component.html',
  styleUrl: './journal-entry-voucher.component.scss',
})
export class JournalEntryVoucherComponent {
  journalEntries: JournalEntry[] = [];
  searchValue: string = '';
  showEntryDetailsModal: boolean = false;
  selectedEntry?: JournalEntry;

  constructor() {}

  ngOnInit(): void {
    this.fetchJournalEntries();
  }

  fetchJournalEntries() {
    // Mock data for demonstration
    this.journalEntries = [
      {
        entryNo: 'JE-001',
        description: 'Office Supplies Purchase',
        date: new Date(),
        debitAmount: 5000,
        creditAmount: 5000,
      },
      {
        entryNo: 'JE-002',
        description: 'Utility Bill Payment',
        date: new Date(),
        debitAmount: 10000,
        creditAmount: 10000,
      },
    ];
  }

  viewEntryDetails(entry: JournalEntry) {
    this.selectedEntry = entry;
    this.showEntryDetailsModal = true;
  }
}