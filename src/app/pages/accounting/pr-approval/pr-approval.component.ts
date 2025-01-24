import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { RequisitionService } from 'src/app/services/requisition.service'; // Adjust path if needed
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

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
    ToastModule
  ]
})
export class PrApprovalComponent implements OnInit {
  purchaseRequests: any[] = [];
  loading = true;

  constructor(
    private requisitionService: RequisitionService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.loadPendingRequests();
  }

  async loadPendingRequests() {
    try {
      this.loading = true;
      // Fetch pending requests from the backend
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

  async updateRequestStatus(requestId: string, status: 'Approved' | 'Rejected') {
    try {
      this.loading = true;
      // Update request status in the backend
      await this.requisitionService.updateRequisitionStatus(requestId, status);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Request has been ${status.toLowerCase()}`,
      });

      // Refresh the list of pending requests
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
}
