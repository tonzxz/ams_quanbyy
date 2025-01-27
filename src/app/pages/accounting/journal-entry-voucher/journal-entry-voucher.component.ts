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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DisbursementVoucherService, DisbursementVoucher } from 'src/app/services/disbursement-voucher.service';
import { DeliveryReceiptService, DeliveryReceipt } from 'src/app/services/delivery-receipt.service';

interface DetailedJournalEntry extends DisbursementVoucher {
  debitEntries: { accountCode: string; accountName: string; amount: number }[];
  creditEntries: { accountCode: string; accountName: string; amount: number }[];
  deliveryReceipt?: DeliveryReceipt;
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
    FluidModule,
    TooltipModule,
    DialogModule,
    InputTextModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './journal-entry-voucher.component.html',
  styleUrl: './journal-entry-voucher.component.scss',
})
export class JournalEntryVoucherComponent {
  journalEntries: DetailedJournalEntry[] = [];
  searchValue: string = '';
  showEntryDetailsModal: boolean = false;
  showDetailedInfoModal: boolean = false;
  selectedEntry?: DetailedJournalEntry;

  constructor(
    private disbursementVoucherService: DisbursementVoucherService,
    private deliveryReceiptService: DeliveryReceiptService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchJournalEntries();
  }

  async fetchJournalEntries() {
    try {
      const allVouchers = await this.disbursementVoucherService.getAll();
      const allReceipts = await this.deliveryReceiptService.getAll();
      
      this.journalEntries = allVouchers
        .filter(voucher => voucher.status === 'recorded')
        .map(voucher => ({
          ...voucher,
          debitEntries: [
            { accountCode: '101', accountName: 'Cash in Bank', amount: voucher.totalAmountDue },
          ],
          creditEntries: [
            { accountCode: '201', accountName: 'Accounts Payable', amount: voucher.totalAmountDue },
          ],
          deliveryReceipt: allReceipts.find(receipt => receipt.receipt_number === voucher.deliveryReceiptNo)
        }));
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch journal entries'
      });
    }
  }

  viewEntryDetails(entry: DetailedJournalEntry) {
    this.selectedEntry = entry;
    this.showEntryDetailsModal = true;
  }

  viewDetailedInfo(entry: DetailedJournalEntry) {
    this.selectedEntry = entry;
    this.showDetailedInfoModal = true;
  }

  exportPdf(entry: DetailedJournalEntry) {
    const doc = new jsPDF();
  
    // Header Section
    doc.setFontSize(16).setFont('helvetica', 'bold');
    doc.text('Journal Entry Voucher', 105, 20, { align: 'center' });
  
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text(`Voucher No: ${entry.voucherNo}`, 20, 30);
    doc.text(`Date: ${new Date(entry.date).toLocaleDateString()}`, 20, 36);
    doc.text(`Supplier Name: ${entry.supplierName}`, 20, 42);
    doc.text(`Total Amount: PHP ${entry.totalAmountDue.toFixed(2)}`, 20, 48);
  
    // Debit and Credit Table
    const tableData = [
      ['Account Code', 'Account Name', 'Debit (Dr)', 'Credit (Cr)'],
      ...entry.debitEntries.map(e => [e.accountCode, e.accountName, e.amount.toFixed(2), '']),
      ...entry.creditEntries.map(e => [e.accountCode, e.accountName, '', e.amount.toFixed(2)]),
    ];
  
    (doc as any).autoTable({
      startY: 60,
      head: [tableData.shift()],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [200, 200, 200] },
      bodyStyles: { textColor: [0, 0, 0] },
      margin: { left: 20, right: 20 },
    });
  
    // Footer Section
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8).setFont('helvetica', 'italic');
    doc.text('Prepared By: __________________', 20, pageHeight - 30);
    doc.text('Checked By: __________________', 80, pageHeight - 30);
    doc.text('Approved By: __________________', 150, pageHeight - 30);
  
    doc.save(`Journal_Entry_Voucher_${entry.voucherNo}.pdf`);
  }
}