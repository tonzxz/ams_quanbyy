import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent {
  purchaseOrderData = {
    requestingOffice: 'OFFICE OF THE DIRECTOR GENERAL',
    contractor: 'QUANBY SOLUTIONS, INC.',
    address: '4F Landlo Business Park Imperial St.',
    tin: '625-263-719-00000',
    telNo: '052-431-1169',
    faxNo: 'N/A',
    email: 'chrisma@quanbyit.com',
    poNo: 'ODC-2024-N-022',
    prNo: '2024-09-0288',
    poDate: 'Nov. 12, 2024',
    prDate: 'April 29, 2024',
    modeOfProcurement: 'Shopping',
    deliveryTerm: 'As specified in the Terms of Reference',
    placeOfDelivery: '5th Floor NFA Building, Visayas Avenue, Diliman, Quezon City',
    dateOfDelivery: 'As specified in the Terms of Reference',
    paymentTerm: '30 days after the submission of complete documents',
    items: [
      { itemNo: 1, qty: 10, unit: 'pcs', description: '5 TB External Hard Drive', unitCost: 7900.00, totalCost: 79000.00 },
      { itemNo: 2, qty: 2, unit: 'units', description: 'Portable Fast Document Scanner', unitCost: 48000.00, totalCost: 96000.00 },
      { itemNo: 3, qty: 3, unit: 'units', description: 'LED Smart TV with Stand', unitCost: 49000.00, totalCost: 147000.00 },
      { itemNo: 4, qty: 5, unit: 'pcs', description: 'HDMI Cables', unitCost: 1500.00, totalCost: 7500.00 }
    ],
    totalGrossAmountInWords: 'Three Hundred Twenty-Nine Thousand Five Hundred Pesos',
    totalGrossAmount: 329500.00,
    penaltyClause: 'In case of failure to make the full delivery within the date specified above, without written justifiable explanation as permitted by existing laws, a penalty of equivalent to one-tenth (1/10) of one percent (1%) of the value under items shall be imposed for each day of delay.',
    conforme: 'Signature Over Printed Name of Suppliers',
    conformeDate: '13 2024 NY + 5W',
    fundsAvailable: 'Funds Available:',
    supportingDocuments: 'Supporting Documents Complete and Proper:',
    dbrNo: 'DBR No: ______',
    dbrDate: 'Date: ______',
    accountant: 'Accountant',
    supplierSignature: '________________________',
    supplierName: 'QUANBY SOLUTIONS, INC.',
    supplierDesignation: 'Authorized Representative',
    requestingOfficeSignature: '________________________',
    requestingOfficeName: 'OFFICE OF THE DIRECTOR GENERAL',
    requestingOfficeDesignation: 'Authorized Signatory'
  };

  exportPdf() {
    const content = document.createElement('div');
    content.className = 'p-5 bg-white font-sans';

    content.innerHTML = `
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold">PURCHASE ORDER</h2>
        <h3 class="text-2xl">${this.purchaseOrderData.requestingOffice}</h3>
      </div>

      <table class="w-full border-collapse text-xl border border-black mb-6">
        <tr>
          <td class="border border-black p-8"><strong>Contractor:</strong> ${this.purchaseOrderData.contractor}</td>
          <td class="border border-black p-8"><strong>P.O. NO.:</strong> ${this.purchaseOrderData.poNo}</td>
        </tr>
        <tr>
          <td class="border border-black p-8"><strong>Address:</strong> ${this.purchaseOrderData.address}</td>
          <td class="border border-black p-8"><strong>Date:</strong> ${this.purchaseOrderData.poDate}</td>
        </tr>
        <tr>
          <td class="border border-black p-8"><strong>T.I.N.:</strong> ${this.purchaseOrderData.tin}</td>
          <td class="border border-black p-8"><strong>PR No.:</strong> ${this.purchaseOrderData.prNo}</td>
        </tr>
        <tr>
          <td class="border border-black p-8"><strong>TEL. NO.:</strong> ${this.purchaseOrderData.telNo}</td>
          <td class="border border-black p-8"><strong>Date:</strong> ${this.purchaseOrderData.prDate}</td>
        </tr>
        <tr>
          <td class="border border-black p-8"><strong>FAX NO.:</strong> ${this.purchaseOrderData.faxNo}</td>
          <td class="border border-black p-8"><strong>Mode of Procurement:</strong> ${this.purchaseOrderData.modeOfProcurement}</td>
        </tr>
        <tr>
          <td class="border border-black p-8"><strong>EMAIL ADDRESS:</strong> ${this.purchaseOrderData.email}</td>
          <td class="border border-black p-8"><strong>Delivery Term:</strong> ${this.purchaseOrderData.deliveryTerm}</td>
        </tr>
        <tr>
          <td class="border border-black p-8"><strong>Place of Delivery:</strong> ${this.purchaseOrderData.placeOfDelivery}</td>
          <td class="border border-black p-8"><strong>Date of Delivery:</strong> ${this.purchaseOrderData.dateOfDelivery}</td>
        </tr>
        <tr>
          <td colspan="2" class="border border-black p-8"><strong>Payment Term:</strong> ${this.purchaseOrderData.paymentTerm}</td>
        </tr>
      </table>

      <table class="w-full border-collapse border text-xl border-black mb-6">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-black p-8">Item No.</th>
            <th class="border border-black p-8">Qty.</th>
            <th class="border border-black p-8">Unit</th>
            <th class="border border-black p-8">Job Description</th>
            <th class="border border-black p-8">Unit Cost</th>
            <th class="border border-black p-8">Total Cost</th>
          </tr>
        </thead>
        <tbody>
          ${this.purchaseOrderData.items.map(item => `
            <tr>
              <td class="border border-black p-8">${item.itemNo}</td>
              <td class="border border-black p-8">${item.qty}</td>
              <td class="border border-black p-8">${item.unit}</td>
              <td class="border border-black p-8">${item.description}</td>
              <td class="border border-black p-8">₱${item.unitCost.toLocaleString()}</td>
              <td class="border border-black p-8">₱${item.totalCost.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="mb-6 text-xl">
        <p><strong>Total (Gross) Amount in Words:</strong> ${this.purchaseOrderData.totalGrossAmountInWords}</p>
        <p><strong>Total (Gross):</strong> ₱${this.purchaseOrderData.totalGrossAmount.toLocaleString()}</p>
      </div>

      <div class="mb-6 text-xl">
        <p><strong>Penalty Clause:</strong> ${this.purchaseOrderData.penaltyClause}</p>
      </div>

      <div class="mb-6 text-xl">
        <p><strong>Conforme:</strong></p>
        <p class="mt-4">${this.purchaseOrderData.supplierSignature}</p>
        <p><strong>${this.purchaseOrderData.supplierName}</strong></p>
        <p>${this.purchaseOrderData.supplierDesignation}</p>
        <p><strong>Date:</strong> ${this.purchaseOrderData.conformeDate}</p>
      </div>

      <div class="mb-6 text-xl">
        <p>${this.purchaseOrderData.fundsAvailable}</p>
        <p>${this.purchaseOrderData.supportingDocuments}</p>
        <p>${this.purchaseOrderData.dbrNo}</p>
        <p>${this.purchaseOrderData.dbrDate}</p>
        <p>${this.purchaseOrderData.accountant}</p>
      </div>

      <div class="mb-6 text-xl">
        <p><strong>Requesting Office:</strong></p>
        <p class="mt-4">${this.purchaseOrderData.requestingOfficeSignature}</p>
        <p><strong>${this.purchaseOrderData.requestingOfficeName}</strong></p>
        <p>${this.purchaseOrderData.requestingOfficeDesignation}</p>
      </div>
    `;

    document.body.appendChild(content);

    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('purchase-order.pdf');

      document.body.removeChild(content);
    });
  }
}