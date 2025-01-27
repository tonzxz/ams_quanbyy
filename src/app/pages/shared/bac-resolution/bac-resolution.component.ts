import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-bac-resolution',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './bac-resolution.component.html',
  styleUrls: ['./bac-resolution.component.scss']
})
export class BACResolutionComponent {
  mockData = {
    title: 'BAC Resolution No. 2022-22',
    subtitle: 'RECOMMENDING AWARD OF CONTRACT FOR THE PROCUREMENT OF TWENTY-THREE (23) WIRELESS KEYBOARD AND MOUSE COMBO THROUGH NEGOTIATED PROCUREMENT (SMALL VALUE PROCUREMENT)',
    department: 'Department of Agriculture',
    agency: 'AGRICULTURAL CREDIT POLICY COUNCIL',
    address: '28/F One San Miguel Avenue (OSMA) Bldg., San Miguel Avenue corner Shaw Blvd., Ortigas Center 1605 Pasig City',
    contact: 'Tel. Nos. 8634-3320 to 21; 8634-3326 / Fax Nos. 8634-3319; 8584-3691',
    resolutionDetails: [
      'WHEREAS, on 21 April 2022, Executive Director (ED) Jocelyn Alma R. Badiola, as Head of Procuring Entity (HoPE), approved the purchase request for the Procurement of Twenty-Three (23) Wireless Keyboard and Mouse Combo;',
      'WHEREAS, with an Approved Budget for the Contract (ABC) of Forty-Six Thousand Pesos (PhP 46,000.00), the “Procurement of Twenty-Three (23) Wireless Keyboard and Mouse Combo” will be acquired pursuant to Section 53.9 (Small Value Procurement) of the 2016 revised Implementing Rules and Regulations (IRR) of Republic Act (RA) No. 9184.',
      'WHEREAS, the BAC, thru its Secretariat, posted the Request for Quotation on April 27, 2022 at the Philippine Government Electronic Procurement System (PhilGEPS) and set the deadline of submission of bids on May 4, 2022 and received seven (7) price quotations, namely:',
      'WHEREAS, the proposal of WORD SOLUTION TECHNOLOGY INC. found to be compliant with the specifications and the details of the duly accomplished RFQ together with eligibility requirements.',
      'WHEREAS, the proposal of WORD SOLUTION TECHNOLOGY INC. amounting to P 35,075.00 found to be the lowest from the other bidder’s proposal.',
      'WHEREAS, Section 12 of R.A. No. 9184 mandates that the BAC shall recommend the award of contract to the Head of the Procuring Entity of his/her duly authorized representative.'
    ],
    suppliers: [
      { name: 'WORD SOLUTION TECHNOLOGY INC.', bidAmount: '₱ 35,075.00', remarks: 'Compliant with the specifications and eligibility requirements' },
      { name: 'PRONET SYSTEMS INTEGRATED NETWORK SOLUTION, INC.', bidAmount: '₱ 38,019.00', remarks: 'Compliant with the specifications and eligibility requirements' },
      { name: 'E PARTNERS SOLUTIONS INC.', bidAmount: '₱ 38,065.00', remarks: 'Compliant with the specifications and eligibility requirements' },
      { name: 'ASPIRE APPLIANCE MARKETING', bidAmount: '₱ 43,424.00', remarks: 'Compliant with the specifications and eligibility requirements' },
      { name: 'METOS OFFSHORE INC.', bidAmount: '₱ 45,000.00', remarks: 'Compliant with the specifications and eligibility requirements' },
      { name: 'CCP COMPUTER TECHNOLOGIES INC.', bidAmount: '₱ 45,977.00', remarks: 'Compliant with the specifications and eligibility requirements' },
      { name: 'BAYANPC TECHNOLOGIES INC.', bidAmount: '₱ 45,977.00', remarks: 'Compliant with the specifications and eligibility requirements' }
    ],
    resolutionConclusion: [
      'THEREFORE, BE IT RESOLVED AS IT HEREBY RESOLVED, for and in consideration of the foregoing, we, the members of ACPC-BAC, hereby recommend the following:',
      '1) AWARD OF CONTRACT via Small Value Procurement to WORD SOLUTION TECHNOLOGY INC. for the Procurement of Twenty-Three (23) Wireless Keyboard and Mouse Combo in the amount Thirty-Five Thousand Seventy-Five Pesos (PhP 35,075.00) inclusive of appropriate taxes and fees.'
    ],
    bacMembers: [
      { name: 'DIR. MAGDALENA S. CASUGA', role: 'Chairperson' },
      { name: 'DIR. MA. CRISTINA G. LOPEZ', role: 'Vice Chairperson' },
      { name: 'DIR. NORMAN WILLIAM KRAFT', role: 'Member' },
      { name: 'NOEL CLAREICE M. DUCUSIN', role: 'Member' },
      { name: 'KENNEDY A. CARABIAG', role: 'Member' }
    ]
  };

  exportPdf() {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="p-10 ml-5 bg-white shadow-md rounded-lg" style="width: 390mm; height: auto;">
        <h1 class="text-3xl font-bold mb-4 flex justify-center">${this.mockData.title}</h1>
        <h2 class="text-2xl font-bold mb-4 flex justify-center">${this.mockData.subtitle}</h2>
        <p class="text-xl mb-4"><strong>${this.mockData.department}</strong></p>
        <p class="text-xl mb-4"><strong>${this.mockData.agency}</strong></p>
        <p class="text-xl mb-4">${this.mockData.address}</p>
        <p class="text-xl mb-4">${this.mockData.contact}</p>

        <div class="mb-4 text-xl">
          ${this.mockData.resolutionDetails
            .map(
              (detail) => `
            <p>${detail}</p>
          `
            )
            .join('')}
        </div>

        <table class="w-full border-collapse border border-gray-300 text-xl" style="table-layout: fixed;">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 p-4">SUPPLIER</th>
              <th class="border border-gray-300 p-4">BID AMOUNT</th>
              <th class="border border-gray-300 p-4">REMARKS</th>
            </tr>
          </thead>
          <tbody>
            ${this.mockData.suppliers
              .map(
                (supplier) => `
              <tr>
                <td class="border border-gray-300 p-4">${supplier.name}</td>
                <td class="border border-gray-300 p-4">${supplier.bidAmount}</td>
                <td class="border border-gray-300 p-4">${supplier.remarks}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="mt-4 text-xl">
          ${this.mockData.resolutionConclusion
            .map(
              (conclusion) => `
            <p>${conclusion}</p>
          `
            )
            .join('')}
        </div>

        <div class="mt-8 text-xl">
          <p><strong>By:</strong></p>
          <p><strong>THE BIDS AND AWARDS COMMITTEE:</strong></p>
          ${this.mockData.bacMembers
            .map(
              (member) => `
            <p>${member.name} - ${member.role}</p>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    document.body.appendChild(content);

    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'letter'); // Portrait mode
      const imgWidth = 210; // A4 width in mm (portrait)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('bac-resolution.pdf');

      document.body.removeChild(content);
    });
  }
}