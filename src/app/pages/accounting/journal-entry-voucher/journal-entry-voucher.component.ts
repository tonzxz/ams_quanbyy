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
        voucherNo: 'DV-2024-001',
        date: new Date(),
        supplierName: 'Office Supplies Co.',
        totalAmountDue: 5000,
        notes: 'Office supplies purchase.',
      },
      {
        voucherNo: 'DV-2024-002',
        date: new Date(),
        supplierName: 'Utility Services Inc.',
        totalAmountDue: 10000,
        notes: 'Utility bill payment.',
      },
      {
        voucherNo: 'DV-2024-003',
        date: new Date(),
        supplierName: 'Tech Gadgets Ltd.',
        totalAmountDue: 15000,
        notes: 'Tech equipment purchase.',
      },
    ];
  }

  viewEntryDetails(entry: JournalEntry) {
    this.selectedEntry = entry;
    this.showEntryDetailsModal = true;
  }

  exportPdf(entry: JournalEntry) {
    const doc = new jsPDF();
  
    // Set a formal font
    doc.setFont('helvetica', 'normal');
  
    // Add a header with company details (centered)
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40); 
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFont('helvetica', 'bold'); 
    doc.text('QUANBY SOLUTIONS INC', pageWidth / 2, 15, { align: 'center' }); 
  
    doc.setFont('helvetica', 'normal'); 
    doc.setFontSize(8);
    doc.text('4th Flr. Dosc Bldg., Brgy. 37-Bitano, Legazpi City, Albay', pageWidth / 2, 20, { align: 'center' }); 
    doc.text('VAT Reg. TIN: 625-263-719-00000', pageWidth / 2, 25, { align: 'center' }); 
  
    // Add a horizontal line below the header
    doc.setDrawColor(200, 200, 200); // Light gray line
    doc.setLineWidth(0.5);
    doc.line(10, 35, doc.internal.pageSize.getWidth() - 10, 35);
  
    // Add the title (Journal Entry Voucher) in bold
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Black for the title
    doc.setFont('helvetica', 'bold'); // Set font to bold
    doc.text('Journal Entry Voucher', pageWidth / 2, 50, { align: 'center' });
  
    // Add voucher details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold'); // Set font to bold for labels
    doc.text('Voucher Number:', 10, 60);
    doc.setFont('helvetica', 'normal'); // Reset to normal font for values
    doc.text(`${entry.voucherNo}`, 50, 60); // Adjust x position for alignment
  
    doc.setFont('helvetica', 'bold'); // Set font to bold for labels
    doc.text('Date:', 10, 67);
    doc.setFont('helvetica', 'normal'); // Reset to normal font for values
    doc.text(`${new Date(entry.date).toLocaleDateString()}`, 50, 67); // Adjust x position for alignment
  
    // Add description
    doc.setFont('helvetica', 'bold'); // Set font to bold for labels
    doc.text('Description:', 10, 77);
    doc.setFont('helvetica', 'normal'); // Reset to normal font for values
    doc.text(entry.notes || 'No description provided.', 50, 77); // Adjust x position for alignment
  
    // Add account details table
    const accountDetails = [
      { code: '101', name: 'Cash in Bank', debit: entry.totalAmountDue.toFixed(2), credit: '' },
      { code: '201', name: 'Accounts Payable', debit: '', credit: entry.totalAmountDue.toFixed(2) },
    ];
  
    (doc as any).autoTable({
      startY: 90, // Start table below the description
      head: [['Account Code', 'Account Name', 'Debit (Dr)', 'Credit (Cr)']],
      body: accountDetails.map((row) => [row.code, row.name, row.debit, row.credit]),
      styles: { 
        fontSize: 10, // Reduce font size for the table
        fillColor: null, // Remove background color
        lineColor: [0, 0, 0], // Set border color to black
        lineWidth: 0.1, // Set border width
      },
      headStyles: {
        fillColor: null, // Remove header background color
        textColor: [0, 0, 0], // Set header text color to black
        lineColor: [0, 0, 0], // Set header border color to black
        lineWidth: 0.1, // Set header border width
      },
      bodyStyles: {
        fillColor: null, // Remove body background color
        textColor: [0, 0, 0], // Set body text color to black
        lineColor: [0, 0, 0], // Set body border color to black
        lineWidth: 0.1, // Set body border width
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Adjust column widths as needed
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 },
      },
    });
  
    // Add prepared by, checked by, and approved by sections
    const finalY = (doc as any).autoTable.previous.finalY + 15; // Start after the table
    doc.setFontSize(9);
    doc.text('Prepared By:', 10, finalY);
    doc.text('Name: _______________________', 10, finalY + 8);
    doc.text('Date: _______________________', 10, finalY + 16);
  
    doc.text('Checked By:', 10, finalY + 30); // Reduced gap
    doc.text('Name: _______________________', 10, finalY + 38);
    doc.text('Date: _______________________', 10, finalY + 46);
  
    doc.text('Approved By:', 10, finalY + 60); // Reduced gap
    doc.text('Name: _______________________', 10, finalY + 68);
    doc.text('Date: _______________________', 10, finalY + 76);
  
    // Add a footer with a horizontal line and page number
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setDrawColor(200, 200, 200); // Light gray line
    doc.setLineWidth(0.5);
    doc.line(10, footerY, doc.internal.pageSize.getWidth() - 10, footerY);
  
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100); // Gray for the footer
    doc.text('Page 1 of 1', pageWidth / 2, footerY + 10, { align: 'center' });
  
    // Save the PDF
    doc.save(`Journal_Entry_Voucher_${entry.voucherNo}.pdf`);
  }
}