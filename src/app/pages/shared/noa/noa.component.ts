import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-noa',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './noa.component.html',
  styleUrls: ['./noa.component.scss']
})
export class NoaComponent {
  mockData = {
    noaNumber: 'ODG-2024-11-022',
    date: 'November 12, 2024',
    recipient: {
      name: 'MARIA CRISMA EDITHA MAXWELL',
      position: 'Chief Operating Officer',
      company: 'Quanby Solutions Inc.',
      address: '4F Landlo Business Park Imperial St.',
      email: 'chrisma@quanbyit.com'
    },
    items: [
      { description: '5 TB External Hard Drive', quantity: 10, unit: 'Pos', price: '79,000.00' },
      { description: 'Portable Fast Document Scanner', quantity: 2, unit: 'Units', price: '96,000.00' },
      { description: 'LED Smart TV with stand', quantity: 3, unit: 'Units', price: '147,000.00' },
      { description: 'HDMI Cables', quantity: 5, unit: 'Pos', price: '7,500.00' }
    ],
    totalPrice: '329,500.00',
    deliveryInstructions: 'Within the date indicated in the Work Order (WO) / Purchase Order (PO)'
  };

  exportPdf() {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="p-10 ml-10 bg-white shadow-md" style="width: 360mm; min-height: 350mm; font-family: Arial, sans-serif;">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold">NOTICE OF AWARD</h1>
          <p class="text-2xl">NOA No.: ${this.mockData.noaNumber}</p>
          <p class="text-2xl">${this.mockData.date}</p>
        </div>

        <div class="mb-6 text-xl">
          <p class="font-bold">${this.mockData.recipient.name}</p>
          <p>${this.mockData.recipient.position}</p>
          <p>${this.mockData.recipient.company}</p>
          <p>${this.mockData.recipient.address}</p>
          <p>${this.mockData.recipient.email}</p>
        </div>

        <div class="mb-6 text-xl">
          <p class="font-bold">Dear MS. MAXWELL:</p>
          <p class="mt-2">This is to inform you that the Anti-Red Tape Authority has recommended the award
          of contract in your favor for the Procurement of Semi-Expendable ICT Equipment
          for the Office of the Director General, and you are hereby issued this NOTICE OF
          AWARD:</p>
        </div>

        <table class="w-full border-collapse border border-black mb-6 text-xl">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-black p-2">Lot No.</th>
              <th class="border border-black p-2">Item/Description</th>
              <th class="border border-black p-2">Quantity</th>
              <th class="border border-black p-2">Unit</th>
              <th class="border border-black p-2">Total Price</th>
            </tr>
          </thead>
          <tbody>
            ${this.mockData.items.map((item, index) => `
              <tr>
                <td class="border border-black p-2 text-center">${index + 1}</td>
                <td class="border border-black p-2">${item.description}</td>
                <td class="border border-black p-2 text-center">${item.quantity}</td>
                <td class="border border-black p-2 text-center">${item.unit}</td>
                <td class="border border-black p-2 text-right">${item.price}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="4" class="border border-black p-2 text-right font-bold">TOTAL</td>
              <td class="border border-black p-2 text-right font-bold">${this.mockData.totalPrice}</td>
            </tr>
          </tbody>
        </table>

        <div class="mb-8 text-xl">
          <p class="font-bold mb-2">Delivery Instructions:</p>
          <p>${this.mockData.deliveryInstructions}</p>
        </div>

        <div class="mb-6 text-xl">
          <p class="mb-4">INSTRUCTIONS:</p>
          <p>Please sign this Notice of Award (NOA) if you have no corrections to the contents and
          Work Order (WO) within five (5) calendar days from receipt hereof. The original copy
          of the NOA and WO shall be returned to the Anti-Red Tape Authority. Failure to sign</p>
        </div>

        <div class="mt-16 text-xl">
          <p class="mb-4">Page 1 of 2</p>
          <p class="border-t-2 border-black pt-4">Authorized Signature</p>
          <p>Printed Name: _________________________</p>
          <p>Designation: _________________________</p>
          <p>Date: _________________________</p>
        </div>
      </div>
    `;

    document.body.appendChild(content);

    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('notice-of-award.pdf');
      document.body.removeChild(content);
    });
  }
}