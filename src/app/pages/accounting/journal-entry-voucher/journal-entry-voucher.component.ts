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

interface JournalEntry {
  voucherNo: string;
  date: Date;
  supplierName: string;
  totalAmountDue: number;
  notes?: string;
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
  journalEntries: DisbursementVoucher[] = [];
  searchValue: string = '';
  showEntryDetailsModal: boolean = false;
  selectedEntry?: DisbursementVoucher;

  constructor(private disbursementVoucherService: DisbursementVoucherService) {}

  ngOnInit(): void {
    this.fetchJournalEntries();
  }

  async fetchJournalEntries() {
    // Fetch recorded vouchers from the service
    const allVouchers = await this.disbursementVoucherService.getAll();
    this.journalEntries = allVouchers.filter(voucher => voucher.status === 'recorded');
  }

  viewEntryDetails(entry: DisbursementVoucher) {
    this.selectedEntry = entry;
    this.showEntryDetailsModal = true;
  }

  exportPdf(entry: JournalEntry) {
    const doc = new jsPDF();
  
    // Set page margins (1 inch each)
    const margin = 20; // 1 inch margin in points (1 inch = 72 points)
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Set formal font
    doc.setFont('helvetica', 'normal');
  
    // Header Section
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.text('QUANBY SOLUTIONS INC', pageWidth / 2, margin - 5, { align: 'center' });
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('4th Flr. Dosc Bldg., Brgy. 37-Bitano, Legazpi City, Albay', pageWidth / 2, margin + 0, { align: 'center' });
    doc.text('VAT Reg. TIN: 625-263-719-00000', pageWidth / 2, margin + 5, { align: 'center' });
  
    // Horizontal Line below Header
    doc.setDrawColor(200, 200, 200); // Light gray line
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 15, pageWidth - margin, margin + 15);
  
    // Title Section
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Black for title
    doc.setFont('helvetica', 'bold');
    doc.text('Journal Entry Voucher', pageWidth / 2, margin + 25, { align: 'center' });
  
    // Voucher Details Section
    doc.setFontSize(10);
    const detailsStartY = margin + 35;
    doc.setFont('helvetica', 'bold');
    doc.text('Voucher Number:', margin, detailsStartY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${entry.voucherNo}`, margin + 50, detailsStartY);
  
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', margin, detailsStartY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(`${new Date(entry.date).toLocaleDateString()}`, margin + 50, detailsStartY + 7);
  
    // Account Details Table
    const accountDetails = [
      {
        code: '101',
        name: 'Cash in Bank',
        description: entry.notes || 'No description provided.',
        debit: entry.totalAmountDue.toFixed(2),
        credit: '',
      },
      {
        code: '201',
        name: 'Accounts Payable',
        description: entry.notes || 'No description provided.',
        debit: '',
        credit: entry.totalAmountDue.toFixed(2),
      },
    ];
  
    // Table Configuration
    const tableStartY = detailsStartY + 15; // Position table below voucher details
  
    (doc as any).autoTable({
      startY: tableStartY,
      head: [['Account Code', 'Account Name', 'Description', 'Debit (Dr)', 'Credit (Cr)']],
      body: accountDetails.map(row => [row.code, row.name, row.description, row.debit, row.credit]),
      styles: {
        fontSize: 10,
        fillColor: null,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: null,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      bodyStyles: {
        fillColor: null,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      margin: { top: 10, left: margin, right: margin }, // Ensure equal left and right margins
      tableWidth: 'auto', // Automatically adjust table width to fit within margins
      pageBreak: 'auto', // Automatically add page breaks if content overflows
    });
  
    // Add Prepared By, Checked By, Approved By Section
    const finalY = (doc as any).autoTable.previous.finalY + 10;
    const sectionHeight = 16; // Space between each row in the section
  
    doc.setFontSize(9);
    doc.text('Prepared By:', margin, finalY);
    doc.text('Name: _____________', margin, finalY + 8); // Shorter line
    doc.text('Date:  ______________', margin, finalY + 16); // Shorter line
  
    doc.text('Checked By:', pageWidth / 3, finalY);
    doc.text('Name: _____________', pageWidth / 3, finalY + 8); // Shorter line
    doc.text('Date:  ______________', pageWidth / 3, finalY + 16); // Shorter line
  
    doc.text('Approved By:', (pageWidth * 2) / 3, finalY);
    doc.text('Name: _____________', (pageWidth * 2) / 3, finalY + 8); // Shorter line
    doc.text('Date:  ______________', (pageWidth * 2) / 3, finalY + 16); // Shorter line
  
    // Footer Section
    const footerY = pageHeight - margin;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
  
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Page 1 of 1', pageWidth / 2, footerY, { align: 'center' });
  
    // Save the PDF
    doc.save(`Journal_Entry_Voucher_${entry.voucherNo}.pdf`);
  }
}