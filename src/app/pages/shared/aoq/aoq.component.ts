import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-aoq',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './aoq.component.html',
  styleUrls: ['./aoq.component.scss']
})
export class AoqComponent {
  mockData = {
    date: '15 2022',
    modeOfProcurement: 'SMALL VALUE PROCUREMENT',
    items: [
      {
        qty: 1,
        unitOfMeasurement: 'pc',
        itemDescription: 'HEAVY DUTY PAPER SHREDDER',
        approvedBudget: '50,000.00',
        philcopyCorporation: { unitPrice: '34,070.00', totalCost: '34,070.00' },
        solidBusinessMachineInc: { unitPrice: 'HAVEN\'T SUBMITTED QUOTATION', totalCost: 'HAVEN\'T SUBMITTED QUOTATION' },
        seccComputerSales: { unitPrice: 'HAVEN\'T SUBMITTED QUOTATION', totalCost: 'HAVEN\'T SUBMITTED QUOTATION' }
      }
    ],
    preparedBy: 'ADMINISTRATIVE ASSISTANT',
    checkedBy: 'BRANCH SERVICES OFFICER',
    notedBy: 'BRANCH HEAD',
    recommendingApproval: [
      { name: 'APP IDOM A / GALLEGO', role: 'Chairperson, RBAC' },
      { name: 'SM RYAN P PASTRANA', role: 'RBAC Member' },
      { name: 'SM DAN CEEVYKYL - URBAN LATEL', role: 'RBAC Member' },
      { name: 'SM ROSA CHLESTF PIERAS', role: 'Vice-Chairperson, RBAC' },
      { name: 'SM CHRIST E. VALDENDELA', role: 'RBAC Member' },
      { name: 'SB DOZI', role: 'RBAC Member' }
    ],
    approvedBy: 'Head of Procuring Entity (HOPE)'
  };

  exportPdf() {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="p-10 bg-white shadow-md rounded-lg" style="width: 297mm; height: 210mm;">
        <h1 class="text-4xl font-bold mb-4 flex justify-center">ABSTRACT OF QUOTATIONS</h1>
        
        <div class="mb-4 text-2xl">
          <div class="flex flex-row justify-between">
            <p><strong>DATE:</strong> ${this.mockData.date}</p>
            <p><strong>MODE OF PROCUREMENT:</strong> ${this.mockData.modeOfProcurement}</p>
          </div>
        </div>
      
        <table class="w-full border-collapse border border-gray-300 text-2xl" style="table-layout: fixed;">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 p-2" style="width: 5%;">QTY</th>
              <th class="border border-gray-300 p-2" style="width: 10%;">Unit of Measurement</th>
              <th class="border border-gray-300 p-2" style="width: 20%;">ITEM DESCRIPTION</th>
              <th class="border border-gray-300 p-2" style="width: 15%;">APPROVED BUDGET</th>
              <th class="border border-gray-300 p-2" style="width: 15%;">PHILCOPY CORPORATION</th>
              <th class="border border-gray-300 p-2" style="width: 15%;">SOLID BUSINESS MACHINE INC.</th>
              <th class="border border-gray-300 p-2" style="width: 15%;">SECC COMPUTER SALES, SERVICE & ENTERPRISES</th>
            </tr>
          </thead>
          <tbody>
            ${this.mockData.items
              .map(
                (item) => `
              <tr>
                <td class="border border-gray-300 p-2">${item.qty}</td>
                <td class="border border-gray-300 p-2">${item.unitOfMeasurement}</td>
                <td class="border border-gray-300 p-2">${item.itemDescription}</td>
                <td class="border border-gray-300 p-2">${item.approvedBudget}</td>
                <td class="border border-gray-300 p-2">${item.philcopyCorporation.unitPrice}<br>${item.philcopyCorporation.totalCost}</td>
                <td class="border border-gray-300 p-2">${item.solidBusinessMachineInc.unitPrice}<br>${item.solidBusinessMachineInc.totalCost}</td>
                <td class="border border-gray-300 p-2">${item.seccComputerSales.unitPrice}<br>${item.seccComputerSales.totalCost}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="mt-4 text-2xl">
          <p><strong>RESOLVED,</strong> that based on the above Abstract of Quotations, the RBAC recommends to the Head of Procuring Entity (HOPE) that the contract be awarded in favor of PHILCOPY CORPORATION as the single calculated and responsive bidder/quotation.</p>
          <p><strong>RESOLVED,</strong> this 15th day of 2022 in the City of Cebu.</p>
        </div>

        <div class="mt-4 text-2xl">
          <div class="flex flex-row justify-between">
            <p><strong>Purchase Requisition No. 2022-025</strong></p>
            <p><strong>Purchase Order No. 2022-025</strong></p>
          </div>
          <div class="flex flex-row justify-between">
            <p><strong>PREPARED BY:</strong> ${this.mockData.preparedBy}</p>
            <p><strong>CHECKED BY:</strong> ${this.mockData.checkedBy}</p>
            <p><strong>NOTED BY:</strong> ${this.mockData.notedBy}</p>
          </div>
        </div>

        <div class="mt-4 text-2xl">
          <p><strong>Recommending Approval:</strong></p>
          ${this.mockData.recommendingApproval
            .map(
              (approver) => `
            <p>${approver.name} - ${approver.role}</p>
          `
            )
            .join('')}
        </div>

        <div class="mt-4 text-2xl">
          <p><strong>APPROVED:</strong></p>
          <p>${this.mockData.approvedBy}</p>
        </div>
      </div>
    `;

    document.body.appendChild(content);

    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape mode
      const imgWidth = 350; // A4 width in mm (landscape)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pageWidth = pdf.internal.pageSize.getWidth(); // Get the page width (297mm for A4 landscape)
      const xOffset = (pageWidth - imgWidth) / 2;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('abstract-of-quotations.pdf');

      document.body.removeChild(content);
    });
  }
}