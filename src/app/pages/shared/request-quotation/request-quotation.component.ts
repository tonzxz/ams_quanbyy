import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { RequisitionService, Requisition } from 'src/app/services/requisition.service';
import { ApprovalSequenceService } from 'src/app/services/approval-sequence.service';

@Component({
  selector: 'app-request-quotation',
  standalone: true,
  imports: [CommonModule, ButtonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8 px-4">
      <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div class="bg-blue-600 py-4 px-6 rounded-t-lg">
          <h1 class="text-center text-white text-xl font-bold">REQUEST FOR QUOTATION</h1>
          <h2 class="text-center text-white text-lg">
            {{ requisition?.title || 'PROCUREMENT OF GOODS AND SERVICES' }}
          </h2>
        </div>

        <div class="p-6">
          <div *ngIf="requisition" class="preview-section">
            <h1 class="text-2xl font-bold mb-4 flex justify-center">Request for Quotation</h1>

            <div class="mb-4 text-xl">
              <div class="flex flex-row justify-between">
                <p><strong>Requisition ID:</strong> {{ requisition.id }}</p>
                <p><strong>Date:</strong> {{ requisition.dateCreated | date: 'longDate' }}</p>
              </div>
              <p><strong>Agency:</strong> CAGAYAN DE ORO STATE COLLEGE</p>
              <div class="flex flex-row gap-20">
                <p><strong>Division:</strong> SOEPD</p>
                <p><strong>Section:</strong> SMEE</p>
              </div>
            </div>

            <h2 class="font-semibold mb-3">Approver Information</h2>
            <p>BAC Chairman: <strong>{{ approverName }}</strong></p>

            <table class="w-full border-collapse border border-gray-300 text-xl">
              <thead>
                <tr class="bg-gray-200">
                  <th class="border border-gray-300 p-4">Qty</th>
                  <th class="border border-gray-300 p-4">Item Description</th>
                  <th class="border border-gray-300 p-4">Specifications</th>
                  <th class="border border-gray-300 p-4">ABC</th>
                  <th class="border border-gray-300 p-4">Total ABC</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let product of requisition?.products">
                  <td class="border border-gray-300 p-4">{{ product.quantity }}</td>
                  <td class="border border-gray-300 p-4">{{ product.name }}</td>
                  <td class="border border-gray-300 p-4">{{ product.specifications }}</td>
                  <td class="border border-gray-300 p-4">{{ product.price | currency: 'PHP' }}</td>
                  <td class="border border-gray-300 p-4">{{ product.quantity * product.price | currency: 'PHP' }}</td>
                </tr>
              </tbody>
            </table>

            <div class="mt-4 text-xl">
              <p><strong>Total ABC:</strong> {{ totalABC | currency: 'PHP' }}</p>
            </div>

            <div class="mt-4 text-xl">
              <p><strong>Purpose:</strong> {{ requisition.description }}</p>
            </div>

            <div class="flex justify-end mt-8">
              <p-button label="Export to PDF" (onClick)="exportToPDF()" class="mt-4"></p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RequestQuotationComponent implements OnInit {
  @Input() requisitionId!: string;
  requisition: Requisition | undefined;
  approverName: string = '';
  totalABC: number = 0;

  constructor(
    private requisitionService: RequisitionService,
    private approvalSequenceService: ApprovalSequenceService
  ) {}

  ngOnInit(): void {
    if (this.requisitionId) {
      this.loadRequisition();
    }
  }

  async loadRequisition() {
    try {
      this.requisition = await this.requisitionService.getRequisitionById(this.requisitionId);
      if (this.requisition) {
        this.totalABC = this.requisition.products.reduce((sum, product) => sum + product.quantity * product.price, 0);
        await this.loadApproverInfo('444');
      } else {
        console.error('Requisition not found.');
      }
    } catch (error) {
      console.error('Error loading requisition:', error);
    }
  }

  async loadApproverInfo(sequenceId: string) {
    try {
      const sequence = await this.approvalSequenceService.getSequenceById(sequenceId).toPromise();
      if (sequence) {
        this.approverName = sequence.userFullName;
      } else {
        this.approverName = 'Unknown';
      }
    } catch (error) {
      console.error('Error loading approver info:', error);
      this.approverName = 'Unknown';
    }
  }

  exportToPDF() {
    const content = document.querySelector('.preview-section') as HTMLElement;

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('request-for-quotation.pdf');
    });
  }
}
