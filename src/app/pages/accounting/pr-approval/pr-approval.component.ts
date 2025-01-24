import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { RequisitionService } from 'src/app/services/requisition.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  selectedRequisitionPdf: SafeResourceUrl | null = null;
  selectedRequest: any | null = null;

  @ViewChild('signatureCanvas', { static: false })
  signatureCanvas!: ElementRef<HTMLCanvasElement>;
  private canvasContext!: CanvasRenderingContext2D;

  constructor(
    private requisitionService: RequisitionService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    await this.loadPendingRequests();
  }

  async loadPendingRequests() {
    try {
      this.loading = true;
      this.purchaseRequests = await this.requisitionService.getPendingRequisitions();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load pending requests',
      });
    } finally {
      this.loading = false;
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

    let isDrawing = false;

    canvas.addEventListener('mousedown', () => {
      isDrawing = true;
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
  }

  async submitApproval() {
    try {
      if (!this.selectedRequest) {
        throw new Error('No request selected for approval.');
      }

      const canvas = this.signatureCanvas.nativeElement;
      const signatureDataUrl = canvas.toDataURL('image/png');

      if (signatureDataUrl === canvas.toDataURL()) {
        this.messageService.add({
          severity: 'warn',
          summary: 'No Signature',
          detail: 'Please provide your signature before approving.',
        });
        return;
      }

      this.loading = true;

      // Send approval with signature
      await this.requisitionService.updateRequisitionStatusWithSignature(
        this.selectedRequest.id,
        'Approved',
        signatureDataUrl
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Request has been approved with signature.',
      });

      this.displaySignatureDialog = false;
      this.selectedRequest = null;

      await this.loadPendingRequests();
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

  async updateRequestStatus(requestId: string, status: 'Approved' | 'Rejected') {
    try {
      this.loading = true;

      await this.requisitionService.updateRequisitionStatus(requestId, status);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Request has been ${status.toLowerCase()}`,
      });

      this.displayPpmpPreview = false;
      this.selectedRequest = null;

      await this.loadPendingRequests();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update request status',
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
