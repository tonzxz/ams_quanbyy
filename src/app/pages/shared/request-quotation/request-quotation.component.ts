import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Item {
  qty: number;
  description: string;
  brand: string;
  unitPrice: number;
  totalAmount: number;
}

interface RequestDetails {
  vendorName: string;
  projectName: string;
  prNumber: string;
}

interface Supplier {
  signature: string;
  nameDesignation: string;
  company: string;
  address: string;
  telephone: string;
  email: string;
  tin: string;
}

@Component({
  selector: 'app-request-quotation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8 px-4">
      <div id="quotation-form" class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div class="bg-blue-600 py-4 px-6 rounded-t-lg">
          <h1 class="title-text text-center text-white text-xl font-bold">REQUEST FOR QUOTATION</h1>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-2 gap-6 mb-8">
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-600 mb-1">Vendor Name</label>
              <input [(ngModel)]="requestDetails.vendorName" class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500" />
            </div>
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-600 mb-1">Project Name</label>
              <input [(ngModel)]="requestDetails.projectName" class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>

          <div class="mb-8">
            <label class="block text-sm font-medium text-gray-600 mb-1">P.R. No./Date Received</label>
            <input [(ngModel)]="requestDetails.prNumber" class="w-64 px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500">
          </div>

          <div class="mb-8 text-gray-700">
            <p>Dear <span>{{requestDetails.vendorName || '_____'}}</span>,</p>
            <p class="mt-3">
              We are currently seeking proposals for the construction of {{requestDetails.projectName || '_____'}}.
              We have identified your company as a potential vendor for this project and would like to request a quote from you.
            </p>
            <p class="mt-2">Please provide us with your best quote for the following services:</p>
          </div>

          <div class="mb-8">
            <h2 class="font-semibold mb-3">Terms and Conditions</h2>
            <ol class="list-decimal list-inside space-y-2 text-gray-600">
              <li>All entries shall be typed or written in a clear legible manner.</li>
              <li>Bids should not exceed the Approved Budget for the Contract (ABC).</li>
              <li>All prices offered herein are valid, binding and effective for 30 calendar days upon issuance of this document.</li>
            </ol>
          </div>

          <div class="mb-8">
            <div class="flex justify-between items-center mb-3">
              <h2 class="font-semibold">Item List</h2>
              <button (click)="addRow()" class="pdf-hide px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                Add Row
              </button>
            </div>

            <div class="overflow-x-auto border rounded-lg">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">QTY</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ABC</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ITEM/DESCRIPTION</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand/Model</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of items; let i = index" class="border-t">
                    <td class="px-4 py-3">{{i + 1}}</td>
                    <td class="px-4 py-3">
                      <input type="number" [(ngModel)]="item.qty" (input)="calculateTotal(i)" class="w-full px-2 py-1 border rounded-md">
                    </td>
                    <td class="px-4 py-3">ABC</td>
                    <td class="px-4 py-3 description-cell">
                      <textarea [(ngModel)]="item.description" class="w-full px-2 py-1 border rounded-md description-text" rows="3"></textarea>
                    </td>
                    <td class="px-4 py-3">
                      <input type="text" [(ngModel)]="item.brand" class="w-full px-2 py-1 border rounded-md">
                    </td>
                    <td class="px-4 py-3">
                      <input type="number" [(ngModel)]="item.unitPrice" (input)="calculateTotal(i)" class="w-full px-2 py-1 border rounded-md">
                    </td>
                    <td class="px-4 py-3 text-right">{{item.totalAmount | number:'1.2-2'}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8">
            <div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-600 mb-1">Signature</label>
                <input [(ngModel)]="supplier.signature" class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-600 mb-1">Name/Designation</label>
                <input [(ngModel)]="supplier.nameDesignation" class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
                <input [(ngModel)]="supplier.company" class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500">
              </div>
            </div>
            <div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-600 mb-1">Address</label>
                <input [(ngModel)]="supplier.address" class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-600 mb-1">Contact Number</label>
                <input [(ngModel)]="supplier.telephone" class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                <input [(ngModel)]="supplier.email" type="email" class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500">
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-600 mb-1">TIN</label>
                <input [(ngModel)]="supplier.tin" class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500">
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-8">
            <button (click)="exportToPDF()" class="pdf-hide px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Export to PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .description-cell textarea {
      white-space: pre-wrap;
      min-height: 100px;
      line-height: 1.5;
    }
    .description-text {
      white-space: pre-wrap;
      word-break: break-word;
    }
  `]
})
export class RequestQuotationComponent {
  requestDetails: RequestDetails = {
    vendorName: '',
    projectName: '',
    prNumber: ''
  };

  items: Item[] = Array(4).fill(null).map(() => ({
    qty: 0,
    description: '',
    brand: '',
    unitPrice: 0,
    totalAmount: 0
  }));

  supplier: Supplier = {
    signature: '',
    nameDesignation: '',
    company: '',
    address: '',
    telephone: '',
    email: '',
    tin: ''
  };

  addRow() {
    this.items.push({
      qty: 0,
      description: '',
      brand: '',
      unitPrice: 0,
      totalAmount: 0
    });
  }

  calculateTotal(index: number) {
    const item = this.items[index];
    item.totalAmount = (item.qty || 0) * (item.unitPrice || 0);
  }

  exportToPDF() {
    const element = document.getElementById('quotation-form') as HTMLElement;
    if (!element) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    let currentPage = 1;

    // Pre-process textareas to maintain formatting
    const textareas = element.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      const text = textarea.value;
      const div = document.createElement('div');
      div.style.whiteSpace = 'pre-wrap';
      div.style.wordBreak = 'break-word';
      div.style.width = textarea.style.width;
      div.style.minHeight = textarea.style.height;
      div.style.padding = '8px';
      div.style.border = '1px solid #ccc';
      div.style.lineHeight = '1.5';
      div.textContent = text;
      textarea.parentNode?.replaceChild(div, textarea);
    });

    const buttons = element.querySelectorAll('.pdf-hide');
    buttons.forEach((button) => (button as HTMLElement).style.display = 'none');

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      onclone: (clonedDoc) => {
        const clonedTextareas = clonedDoc.querySelectorAll('.description-cell div');
        clonedTextareas.forEach(div => {
          (div as HTMLElement).style.whiteSpace = 'pre-wrap';
          (div as HTMLElement).style.minHeight = '100px';
        });
      }
    }).then((canvas) => {
      // Restore textareas
      const divs = element.querySelectorAll('.description-cell div');
      divs.forEach(div => {
        const textarea = document.createElement('textarea');
        textarea.value = div.textContent || '';
        textarea.className = 'w-full px-2 py-1 border rounded-md description-text';
        textarea.rows = 3;
        div.parentNode?.replaceChild(textarea, div);
      });

      buttons.forEach((button) => (button as HTMLElement).style.display = '');

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let position = 0;
      let heightLeft = imgHeight;

      while (heightLeft > 0) {
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        position = -heightLeft;

        if (heightLeft > 0) {
          pdf.addPage();
          currentPage++;
        }
      }

      for (let i = 1; i <= currentPage; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Page ${i} of ${currentPage}`, pdfWidth - 40, pdfHeight - 10);
      }

      pdf.save(`RFQ-${this.requestDetails.projectName || 'Quotation'}.pdf`);
    });
  }
}