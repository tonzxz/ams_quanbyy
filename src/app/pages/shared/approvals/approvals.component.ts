import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RequisitionService, Requisition } from 'src/app/services/requisition.service';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApprovalSequenceService } from 'src/app/services/approval-sequence.service';
import { firstValueFrom } from 'rxjs';
import { DepartmentService } from 'src/app/services/departments.service';

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    ToastModule,
  ],
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss'],
  providers: [MessageService],
})
export class ApprovalsComponent implements OnInit {
  requisitions: (Requisition & { approvalSequenceDetails?: any })[] = [];
  loading = false;
  displayPdfDialog = false;
  displaySignatureDialog = false;
  displayPreviewDialog = false;
  selectedPdfUrl: SafeResourceUrl | null = null;
  selectedRequest: Requisition | null = null;
  signatureDataUrl: string | null = null;
  departmentName: string = 'N/A';
  officeName: string = 'N/A';

  @ViewChild('signatureCanvas', { static: false })
  signatureCanvas!: ElementRef<HTMLCanvasElement>;
  private canvasContext!: CanvasRenderingContext2D;
  private isSigned = false;

  constructor(
    private requisitionService: RequisitionService,
    private userService: UserService,
    private approvalSequenceService: ApprovalSequenceService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private departmentService: DepartmentService
  ) {}

  async ngOnInit() {
    await this.loadRequisitions();
    await this.loadDepartmentAndOfficeNames();
  }

  private async loadRequisitions() {
    try {
      this.loading = true;
      const currentUser = this.userService.getUser();
      const allRequisitions = await this.requisitionService.getAllRequisitions();
      const allSequences = await this.requisitionService.getAllApprovalSequences();

      this.requisitions = allRequisitions
        .map((req) => {
          const typeSequences = allSequences.filter(
            (seq) => seq.type === (req.currentApprovalLevel <= 4 ? 'procurement' : 'supply')
          );

          const currentSequence = typeSequences.find(
            (seq) => seq.level === req.currentApprovalLevel
          );

          return {
            ...req,
            approvalSequenceDetails: currentSequence
              ? {
                  level: currentSequence.level,
                  departmentName: currentSequence.departmentName,
                  roleName: currentSequence.roleName,
                  userFullName: currentSequence.userFullName,
                  userId: currentSequence.userId,
                }
              : {
                  level: 'N/A',
                  departmentName: 'N/A',
                  roleName: 'N/A',
                  userFullName: 'N/A',
                  userId: 'N/A',
                },
          };
        })
        .filter((req) => req.approvalSequenceDetails?.userId === currentUser?.id);
    } catch (error) {
      console.error('Failed to load requisitions:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load requisitions.',
      });
    } finally {
      this.loading = false;
    }
  }

  async loadDepartmentAndOfficeNames() {
  try {
    const currentUser = this.userService.getUser();
    if (!currentUser?.id) {
      this.departmentName = 'N/A';
      this.officeName = 'N/A';
      return;
    }

    const user = this.userService.getUserById(currentUser.id);
    if (!user?.officeId) {
      this.departmentName = 'N/A';
      this.officeName = 'N/A';
      return;
    }

    const offices = await this.departmentService.getAllOffices();
    const userOffice = offices.find(office => office.id === user.officeId);

    if (userOffice) {
      const departments = await this.departmentService.getAllDepartments();
      const userDepartment = departments.find(department => department.id === userOffice.departmentId);
      this.departmentName = userDepartment?.name || 'N/A';
      this.officeName = userOffice.name || 'N/A';
    } else {
      this.departmentName = 'N/A';
      this.officeName = 'N/A';
    }
  } catch (error) {
    console.error('Failed to load department and office names:', error);
    this.departmentName = 'N/A';
    this.officeName = 'N/A';
  }
}

  viewAttachment(pdfUrl: string, title: string) {
    this.selectedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
    this.displayPdfDialog = true;
  }

  openSignatureDialog(request: Requisition) {
    this.selectedRequest = request;
    this.displaySignatureDialog = true;
    setTimeout(() => this.setupSignatureCanvas(), 0);
  }

  private setupSignatureCanvas() {
    const canvas = this.signatureCanvas.nativeElement;
    this.canvasContext = canvas.getContext('2d')!;
    this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    this.isSigned = false;

    let isDrawing = false;

    canvas.addEventListener('mousedown', () => {
      isDrawing = true;
      this.isSigned = true;
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
    this.isSigned = false;
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

    // Capture the signature
    const canvas = this.signatureCanvas.nativeElement;
    this.signatureDataUrl = canvas.toDataURL('image/png');

    // Update the requisition with the signature
    this.selectedRequest.signature = this.signatureDataUrl;
    this.selectedRequest.approvalStatus = 'Approved';
    this.selectedRequest.currentApprovalLevel += 1;

    // Show the preview dialog
    this.displayPreviewDialog = true;
    this.displaySignatureDialog = false;
  } catch (error) {
    console.error('Failed to approve requisition:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to approve requisition.',
    });
  }
}

async confirmApproval() {
  try {
    if (!this.selectedRequest || !this.signatureDataUrl) {
      throw new Error('No request or signature selected for approval.');
    }

    // Add the approval history entry with a Date object for timestamp
    this.selectedRequest.approvalHistory = this.selectedRequest.approvalHistory || [];
    this.selectedRequest.approvalHistory.push({
      level: this.selectedRequest.currentApprovalLevel,
      status: 'Approved',
      timestamp: new Date(), // Ensure this is a Date object
      comments: '',
    });

    // Update the requisition with the signature and approval status
    this.selectedRequest.signature = this.signatureDataUrl;
    this.selectedRequest.approvalStatus = 'Approved';
    this.selectedRequest.currentApprovalLevel += 1;

    // Save the updated requisition
    await this.requisitionService.updateRequisition(this.selectedRequest);
    this.loadRequisitions();

    // Show success message
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Requisition approved successfully.',
    });

    // Close the preview dialog
    this.displayPreviewDialog = false;
    this.signatureDataUrl = null;
  } catch (error) {
    console.error('Failed to confirm approval:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to confirm approval.',
    });
  }
}
  
  closePreviewDialog() {
    this.displayPreviewDialog = false;
    this.signatureDataUrl = null;
  }

  async onReject(requisitionId: string) {
    try {
      await this.requisitionService.updateRequisitionStatus(requisitionId, 'Rejected');
      this.loadRequisitions();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Requisition rejected successfully.',
      });
    } catch (error) {
      console.error('Failed to reject requisition:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to reject requisition.',
      });
    }
  }

  closeSignatureDialog() {
    this.displaySignatureDialog = false;
    this.clearSignature();
    this.selectedRequest = null;
  }
}