import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

const html2pdf = require('html2pdf.js');


@Component({
  selector: 'app-request-quotation',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    CardModule,
    
  ],
  templateUrl: './request-quotation.component.html',
  styleUrl: './request-quotation.component.scss'
})
export class RequestQuotationComponent {
  prNumber: string = '';
  items = [
    { quantity: '', abc: '', description: '5TB External Hard Drive (HDD)', brandModel: '', unitPrice: '', totalAmount: '' },
    { quantity: '', abc: '', description: 'Portable Fast Document Scanner', brandModel: '', unitPrice: '', totalAmount: '' },
    { quantity: '', abc: '', description: 'LED Smart TV with Stand', brandModel: '', unitPrice: '', totalAmount: '' },
    { quantity: '', abc: '', description: 'HDMI Cables', brandModel: '', unitPrice: '', totalAmount: '' }
  ];
  supplierSignature: string = '';
  supplierName: string = '';
  companyName: string = '';
  companyAddress: string = '';
  telephoneFax: string = '';
  emailAddress: string = '';
  tin: string = '';

  

  exportToPDF() {
    const element = document.querySelector('.quotation-form') as HTMLElement;

    // Correct usage: Use the `from` method
    html2pdf()
      .from(element)
      .save('request-quotation.pdf');
  }
}
