import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  exportToPDF(account: LedgerAccount) {
    const doc = new jsPDF();
  
    // Add Appendix 5 to the top-right corner
    doc.setFontSize(10); // Smaller font size
    doc.text('Appendix 5', doc.internal.pageSize.width - 20, 10, { align: 'right' });
  
    // Add GENERAL LEDGER title at the center and make it bold
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold'); // Make text bold
    const textWidth = doc.getTextWidth('GENERAL LEDGER');
    const centerX = (doc.internal.pageSize.width - textWidth) / 2; // Center horizontally
    doc.text('GENERAL LEDGER', centerX, 20);
  
    // Reset font to normal
    doc.setFont('helvetica', 'normal');
  
    // Add Entity Name, Fund Cluster, Account Title, and UACS Object Code
    doc.setFontSize(10);
  
    // Define positions for the fields
    const startX = 10; // Starting X position
    const startY = 30; // Starting Y position
    const lineHeight = 10; // Vertical spacing between lines
    const columnWidth = 90; // Width of each column
  
    // First row: Entity Name and Fund Cluster
    doc.text(`Entity Name: ${account.accountName}`, startX, startY);
    doc.text(`Fund Cluster: [Fund Cluster Value]`, startX + columnWidth, startY);
  
    // Second row: Account Title and UACS Object Code
    doc.text(`Account Title: ${account.accountName}`, startX, startY + lineHeight);
    doc.text(`UACS Object Code: [UACS Object Code Value]`, startX + columnWidth, startY + lineHeight);
  
    // Define the table headers and data
    const columns = ['Date', 'Particulars', 'Ref', 'Amount', 'Debit', 'Credit', 'Balance'];
  
    // Get the first 25 transactions (or fewer if there are not enough)
    const transactions = account.transactions.slice(0, 25);
  
    // Create rows for the table
    const rows = transactions.map(transaction => [
      transaction.date.toLocaleDateString(),
      transaction.description,
      '[Ref Value]', // Replace with actual reference if available
      '', // Empty value for Amount (merged across Debit, Credit, Balance)
      transaction.debit,
      transaction.credit,
      account.balance,
    ]);
  
    // Add empty rows if there are fewer than 25 transactions
    while (rows.length < 25) {
      rows.push(['', '', '', '', '', '', '']);
    }
  
    // Add a row for totals
    rows.push([
      '',
      '',
      'TOTALS',
      '', // Empty for Amount
      account.debitTotal,
      account.creditTotal,
      account.balance,
    ]);
  
    // Generate the table with black borders and no background color
    (doc as any).autoTable({
      startY: startY + 2 * lineHeight, // Start table immediately below the fields
      head: [
        ['Date', 'Particulars', 'Ref', { content: 'Amount', colSpan: 3, align: 'center' }],
        ['', '', '', 'Debit', 'Credit', 'Balance'], // Labels for Debit, Credit, and Balance under Amount
      ],
      body: rows,
      theme: 'plain', // Use plain theme for no background color
      styles: { 
        fontSize: 9,
        font: 'helvetica', // Use Helvetica font
        lineColor: [0, 0, 0], // Black border lines
        lineWidth: 0.1, // Thin border lines
        cellPadding: 1,
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
        0: { halign: 'center' }, 
        1: { halign: 'left' },   
        2: { halign: 'center' }, 
        3: { halign: 'center' }, 
        4: { halign: 'right' },  
        5: { halign: 'right' },  
        6: { halign: 'right' },  
      },
    });
  
    // Save the PDF
    doc.save(`${account.accountName}_general_ledger.pdf`);
}
}