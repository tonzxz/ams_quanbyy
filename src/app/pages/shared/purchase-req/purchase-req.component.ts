import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-purchase-req',
  standalone: true,
  imports: [ButtonModule], // Import PrimeNG ButtonModule
  templateUrl: './purchase-req.component.html',
  styleUrls: ['./purchase-req.component.scss']
})
export class PurchaseReqComponent {
  exportPdf() {
    // Create a temporary div to hold the HTML content
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="p-10 bg-white shadow-md rounded-lg">
        <h1 class="text-2xl font-bold mb-4 flex justify-center">Purchase Request</h1>
        
        <div class="mb-4 text-xl">
          <div class="flex flex-row justify-between">
            <p><strong>PR No.:</strong> 520240905089-0-1</p>
            <p><strong>Date:</strong> November 14, 2024</p>
          </div>
          <p><strong>Agency:</strong> PHILIPPINE INSTITUTE OF VOLCANOLOGY AND SEISMOLOGY</p>
          <div class="flex flex-row gap-20">
            <p><strong>Division:</strong> SOEPD</p>
            <p><strong>Section:</strong> SMEE</p>
          </div>
        </div>
      
        <table class="w-full border-collapse border border-gray-300 text-xl">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 p-4">Qty</th>
              <th class="border border-gray-300 p-">Unit</th>
              <th class="border border-gray-300 p-4">Item Description</th>
              <th class="border border-gray-300 p-4">Stock No</th>
              <th class="border border-gray-300 p-4">Estimated Unit Cost</th>
              <th class="border border-gray-300 p-4">Estimated Total Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 p-4">3</td>
              <td class="border border-gray-300 p-4">Unit(s)</td>
              <td class="border border-gray-300 p-4">
                NETWORK ATTACHED STORAGE<br>
                Specifications:<br>
                • CPU Frequency: 4-core up to 3.6 GHz<br>
                • Hardware Encryption Engine (AES-NI)<br>
                • Memory: 16 GB (8x2) DDR4<br>
                • Drive Bays: 8<br>
                • External Ports: 2 (1GbE LAN Port) with Link Aggregation/Failover, 1 (10GbE LAN Port), 3 (USB 3.2 Gen 1 Port), 2 (eSATA Port)<br>
                • Hard Drives: 8 (4TB 3.5" Enterprise SATA HDD)<br>
                • Certifications: FCC, CE, BSMI, VCCI, RCM, EAC, CCC, KC<br>
                • RoHS Compliant<br>
                • Supports RAID<br>
                • Warranty: 5 years parts, labor and onsite<br>
                Inclusion: Uninterruptible Power Supply<br>
                • Rated power: 2200 VA, 230V<br>
                • Input frequency: 50/60 Hz +/- 5 Hz auto-sensing<br>
                • Output frequency: 50/60 Hz +/- 1 Hz sync to mains<br>
                • Product certifications: CE<br>
                • IP degree of protection: IP20<br>
                • Standards: EN/IEC 62040-1:2019/A11:2021, EN/IEC 62040-2:2006/AC:2006, EN/IEC 62040-2:2018<br>
                • Warranty: 2 years<br>
                • Brand must be at least 40 years in the market
              </td>
              <td class="border border-gray-300 p-4">-</td>
              <td class="border border-gray-300 p-4">250,000.00</td>
              <td class="border border-gray-300 p-4">750,000.00</td>
            </tr>
          </tbody>
        </table>
      
        <div class="mt-4 text-xl">
          <p><strong>Purpose:</strong> Will be used as backup storage unit for intensity meter data (Capital Outlay - Equipment FY 2025)</p>
        </div>
      
        <div class="mt-4 text-xl flex flex-row justify-between">
          <p class="ml-20"><strong>Requested By:</strong><br> Ishmael C. Narag</p>
          <p class="mr-20"><strong>Approved By:</strong><br> Teresito C. Bacolcol</p>
        </div>
        <div class="mt-4 text-xl flex flex-row justify-between">
          <p class="ml-20"><strong>Signature:</strong><br></p>
          <p class="mr-20"><strong>Signature:</strong><br></p>
        </div>
      </div>
    `;

    // Append the content to the body temporarily
    document.body.appendChild(content);

    // Use html2canvas to capture the content as an image
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if the content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save('purchase-request.pdf');

      // Remove the temporary content from the DOM
      document.body.removeChild(content);
    });
  }
}