import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { RequisitionService } from 'src/app/services/requisition.service';
import { UserService } from 'src/app/services/user.service';
import { DepartmentService } from 'src/app/services/departments.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pr-approval',
  templateUrl: './pr-approval.component.html',
  styleUrls: ['./pr-approval.component.scss'],
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    ToastModule,
    DialogModule,
  ],
})
export class PrApprovalComponent implements OnInit {
  purchaseRequests: any[] = [];
  loading = true;
  displayPpmpPreview = false;
  displaySignatureDialog = false;
  displayPrPreview = false;
  selectedRequisitionPdf: SafeResourceUrl | null = null;
  selectedRequest: any | null = null;
  generatedPrHtml: string = ''; // Holds the generated HTML for PR
  loggedInUser: any | null = null; // Logged-in user
  departmentName: string = 'Department';
  officeName: string = 'Office';

  @ViewChild('signatureCanvas', { static: false })
  signatureCanvas!: ElementRef<HTMLCanvasElement>;
  private canvasContext!: CanvasRenderingContext2D;
  private isSigned = false; // Track if the signature exists

  constructor(
    private requisitionService: RequisitionService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    this.loggedInUser = this.userService.getUser();
    await this.loadPendingRequests();
    await this.loadDepartmentAndOfficeNames();
  }

  async loadPendingRequests() {
    try {
      this.loading = true;
      this.purchaseRequests = await this.requisitionService.getPendingRequisitions();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load pending requests.',
      });
    } finally {
      this.loading = false;
    }
  }

  async loadDepartmentAndOfficeNames() {
    try {
      const departments = await this.departmentService.getAllDepartments();
      const offices = await this.departmentService.getAllOffices();

      if (departments.length > 0) {
        this.departmentName = departments[0].name; // Set the first department
      }
      if (offices.length > 0) {
        this.officeName = offices[0].name; // Set the first office
      }
    } catch (error) {
      console.error('Error loading department and office data:', error);
    }
  }

  viewPPMP(request: any) {
    if (request.ppmpAttachment) {
      this.selectedRequisitionPdf = this.sanitizer.bypassSecurityTrustResourceUrl(
        request.ppmpAttachment
      );
      this.selectedRequest = request;
      this.displayPpmpPreview = true;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Document',
        detail: 'PPMP document is not available for this request.',
      });
    }
  }

  openSignatureDialog(request: any) {
    this.selectedRequest = request;
    this.displaySignatureDialog = true;
    setTimeout(() => this.setupSignatureCanvas(), 0);
  }

  private setupSignatureCanvas() {
    const canvas = this.signatureCanvas.nativeElement;
    this.canvasContext = canvas.getContext('2d')!;
    this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    this.isSigned = false; // Reset signature flag

    let isDrawing = false;

    canvas.addEventListener('mousedown', () => {
      isDrawing = true;
      this.isSigned = true; // Mark as signed
      this.canvasContext.beginPath();
    });

    canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.canvasContext.lineTo(x, y);
        this.canvasContext.stroke();
      }
    });

    canvas.addEventListener('mouseup', () => (isDrawing = false));
    canvas.addEventListener('mouseout', () => (isDrawing = false));
  }

  clearSignature() {
    const canvas = this.signatureCanvas.nativeElement;
    this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    this.isSigned = false; // Reset signature flag
  }

  async submitApproval() {
    try {
      if (!this.selectedRequest) {
        throw new Error('No request selected for approval.');
      }

      if (!this.isSigned) {
        this.messageService.add({
          severity: 'warn',
          summary: 'No Signature',
          detail: 'Please provide your signature before approving.',
        });
        return;
      }

      const canvas = this.signatureCanvas.nativeElement;
      const signatureDataUrl = canvas.toDataURL('image/png');

      this.loading = true;

      // Prepare PR preview HTML
      this.generatedPrHtml = this.generatePrHtml(
        this.selectedRequest,
        signatureDataUrl
      );
      this.displaySignatureDialog = false;
      this.displayPrPreview = true; // Show PR Preview
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to approve request.',
      });
    } finally {
      this.loading = false;
    }
  }

  generatePrHtml(request: any, signature: string): string {
  return `
    <div class="p-10 bg-white shadow-md rounded-lg">
      <h1 class="text-2xl font-bold mb-4 flex justify-center">Purchase Request</h1>
      <div class="mb-4 text-xl">
        <div class="flex flex-row justify-between">
          <p><strong>PR No.:</strong> ${this.generateUniqueId()}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p><strong>Agency:</strong> CAGAYAN DE ORO STATE COLLEGE</p>
        <div class="flex flex-row gap-20">
          <p><strong>Department:</strong> ${this.departmentName}</p>
          <p><strong>Office:</strong> ${this.officeName}</p>
        </div>
      </div>
      <table class="w-full border-collapse border border-gray-300 text-xl">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 p-4">Qty</th>
            <th class="border border-gray-300 p-4">Unit</th>
            <th class="border border-gray-300 p-4">Item Description</th>
            <th class="border border-gray-300 p-4">Stock No</th>
            <th class="border border-gray-300 p-4">Estimated Unit Cost</th>
            <th class="border border-gray-300 p-4">Estimated Total Cost</th>
          </tr>
        </thead>
        <tbody>
          ${request.products
            .map(
              (product: any) => `
            <tr>
              <td class="border border-gray-300 p-4">${product.quantity}</td>
              <td class="border border-gray-300 p-4">Unit</td>
              <td class="border border-gray-300 p-4">${product.name}</td>
              <td class="border border-gray-300 p-4">-</td>
              <td class="border border-gray-300 p-4">${product.price}</td>
              <td class="border border-gray-300 p-4">${
                product.quantity * product.price
              }</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      <div class="mt-4 text-xl flex flex-row justify-between">
        <p class="ml-20"><strong>Requested By:</strong><br> ${
          request.createdByUserName || 'N/A'
        }</p>
        <p class="mr-20"><strong>Approved By:</strong><br> ${
          this.loggedInUser?.fullname || 'N/A'
        }</p>
      </div>
      <div class="mt-4 text-xl flex flex-row justify-between">
        <p class="ml-20"><strong>Signature:</strong><br> <img src="${signature}" alt="Signature" /></p>
      </div>
    </div>
  `;
}


  generatePrPdf() {
    const content = document.createElement('div');
    content.innerHTML = this.generatedPrHtml;

    document.body.appendChild(content);

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

      pdf.save('purchase-request.pdf');
      document.body.removeChild(content);
      this.displayPrPreview = false;
    });
  }

  closePrPreview() {
    this.displayPrPreview = false;
  }

  generateUniqueId(): string {
    return Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  async updateRequestStatus(requestId: string, status: 'Approved' | 'Rejected') {
    try {
      this.loading = true;

      await this.requisitionService.updateRequisitionStatus(requestId, status);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Request has been ${status.toLowerCase()}.`,
      });

      this.displayPpmpPreview = false;
      this.selectedRequest = null;

      await this.loadPendingRequests();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update request status.',
      });
    } finally {
      this.loading = false;
    }
  }

  closeSignatureDialog() {
    this.displaySignatureDialog = false;
    this.clearSignature();
    this.selectedRequest = null;
  }
}
