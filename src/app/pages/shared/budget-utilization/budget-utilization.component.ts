import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-bur',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './budget-utilization.component.html',
  styleUrls: ['./budget-utilization.component.scss']
})
export class BudgetUtilizationComponent {
  mockData = {
    title: 'ANNEX C',
    subtitle: 'LOCAL GOVERNMENT SUPPORT FUND',
    reportTitle: 'Report on Fund Utilization and Status of Program/Project Implementation',
    quarterEnded: 'For the Quarter Ended ______',
    tableHeaders: [
      'Fund Source',
      'Date of Notice of Authority to Debit Account Issued (NADAI)',
      'Type of Program/ Project',
      'Name/Title of Program/ Project',
      'Specific Location',
      'Mechanism/ Mode of Implementation',
      'Estimated Number of Beneficiaries',
      'Amount',
      'Estimated Period of Completion (month and year)',
      'Remarks on Program/ Project Status'
    ],
    tableData: [
      {
        fundSource: 'Sample Fund Source',
        nadaiDate: '2022-01-01',
        programType: 'Infrastructure',
        programTitle: 'Sample Project',
        location: 'Sample Location',
        implementationMode: 'Contractor',
        beneficiaries: 1000,
        amountReceived: '1,000,000.00',
        amountContracted: '900,000.00',
        amountDisbursed: '800,000.00',
        completionPeriod: 'December 2023',
        remarks: 'Ongoing'
      }
    ],
    certifiedBy: {
      lfc: 'The Local Finance Committee (LFC)',
      budgetOfficer: 'Local Budget Officer',
      treasurer: 'Local Treasurer'
    },
    attestedBy: {
      chiefExecutive: 'Local Chief Executive',
      planningCoordinator: 'Local Planning and Development Coordinator'
    }
  };

  exportPdf() {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="p-10 ml-5 bg-white shadow-md rounded-lg" style="width: 380mm; height: 250mm;">
        <h1 class="text-4xl font-bold mb-4 flex justify-center">${this.mockData.title}</h1>
        <h2 class="text-3xl font-bold mb-4 flex justify-center">${this.mockData.subtitle}</h2>
        <h3 class="text-2xl font-bold mb-4 flex justify-center">${this.mockData.reportTitle}</h3>
        <h4 class="text-xl font-bold mb-4 flex justify-center">${this.mockData.quarterEnded}</h4>

        <!-- Table with expanded width and reduced font size -->
        <table class="w-full border-collapse border border-gray-300 text-lg" style="table-layout: auto; width: 100%;">
          <thead>
            <tr class="bg-gray-200">
              ${this.mockData.tableHeaders
                .map(
                  (header) => `
                <th class="border border-gray-300 p-2" style="min-width: 100px;">${header}</th>
              `
                )
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${this.mockData.tableData
              .map(
                (row) => `
              <tr>
                <td class="border border-gray-300 p-2">${row.fundSource}</td>
                <td class="border border-gray-300 p-2">${row.nadaiDate}</td>
                <td class="border border-gray-300 p-2">${row.programType}</td>
                <td class="border border-gray-300 p-2">${row.programTitle}</td>
                <td class="border border-gray-300 p-2">${row.location}</td>
                <td class="border border-gray-300 p-2">${row.implementationMode}</td>
                <td class="border border-gray-300 p-2">${row.beneficiaries}</td>
                <td class="border border-gray-300 p-2">
                  <strong>Received:</strong> ${row.amountReceived}<br>
                  <strong>Contracted:</strong> ${row.amountContracted}<br>
                  <strong>Disbursed:</strong> ${row.amountDisbursed}
                </td>
                <td class="border border-gray-300 p-2">${row.completionPeriod}</td>
                <td class="border border-gray-300 p-2">${row.remarks}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <!-- Spacing between table and certification section -->
        <div class="mt-8 text-2xl">
          <p><strong>Certified correct by:</strong></p>
          <p>${this.mockData.certifiedBy.lfc}</p>
          <p>${this.mockData.certifiedBy.budgetOfficer}</p>
          <p>${this.mockData.certifiedBy.treasurer}</p>
        </div>

        <!-- Spacing between certification and attestation section -->
        <div class="mt-8 text-2xl">
          <p><strong>Attested by:</strong></p>
          <p>${this.mockData.attestedBy.chiefExecutive}</p>
          <p>${this.mockData.attestedBy.planningCoordinator}</p>
        </div>
      </div>
    `;

    document.body.appendChild(content);

    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgWidth = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pageWidth = pdf.internal.pageSize.getWidth(); // Get the page width (297mm for A4 landscape)
      const xOffset = (pageWidth - imgWidth) / 2; // Center the image horizontally

      pdf.addImage(imgData, 'PNG', xOffset, 0, imgWidth, imgHeight);
      pdf.save('fund-utilization-report.pdf');

      document.body.removeChild(content);
    });
  }
}