import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RequisitionService } from 'src/app/services/requisition.service';
import { UserService } from 'src/app/services/user.service';
import { Requisition } from 'src/app/services/requisition.service';

@Component({
  selector: 'app-issue-slip',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './issue-slip.component.html',
  styleUrl: './issue-slip.component.scss'
})
export class IssueSlipComponent implements OnInit {
  requisitions: Requisition[] = [];
  selectedRequisition: Requisition | null = null;
  displayPreviewDialog = false;
  pdfPreviewUrl: SafeResourceUrl | null = null;
  loading = false;
  isAccountingUser = false;

  constructor(
    private requisitionService: RequisitionService,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    await this.loadRequisitions();
    this.checkUserRole();
  }

  private checkUserRole() {
    const currentUser = this.userService.getUser();
    this.isAccountingUser = currentUser?.role === 'accounting';
  }

  private async loadRequisitions() {
    try {
      this.loading = true;
      const allRequisitions = await this.requisitionService.getAllRequisitions();
      // Filter requisitions that have issue slips
      this.requisitions = allRequisitions.filter(req => 
        req.issueSlipId && 
        req.issuedStocks && 
        req.issuedStocks.length > 0
      );
    } catch (error) {
      this.handleError(error);
    } finally {
      this.loading = false;
    }
  }

  viewIssueSlip(requisition: Requisition) {
    this.selectedRequisition = requisition;
    const pdfUrl = this.generateIssuePdf(requisition);
    this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
    this.displayPreviewDialog = true;
  }

  // async approveIssueSlip(requisition: Requisition) {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to approve this issue slip?',
  //     header: 'Confirm Approval',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: async () => {
  //       try {
  //         this.loading = true;
          
  //         const updatedRequisition = {
  //           ...requisition,
  //           issueSlipStatus: 'completed',
  //           issuedStocks: requisition.issuedStocks?.map(stock => ({
  //             ...stock,
  //             status: 'issued'
  //           })),
  //           lastModified: new Date()
  //         };

  //         await this.requisitionService.updateRequisition(updatedRequisition);
          
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Success',
  //           detail: 'Issue slip has been approved successfully'
  //         });

  //         await this.loadRequisitions();
  //       } catch (error) {
  //         this.handleError(error);
  //       } finally {
  //         this.loading = false;
  //       }
  //     }
  //   });
  // }

  private generateIssuePdf(requisition: Requisition): string {
    // Re-use the same PDF generation logic from the requisition component
    // This is just a placeholder - you should implement the actual PDF generation
    return 'data:application/pdf;base64,....';
  }

  private handleError(error: any) {
    console.error('Error:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error?.message || 'An error occurred'
    });
  }
}