import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';

import { RequisitionService, Requisition } from 'src/app/services/requisition.service';

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TableModule,
    TabViewModule,
    ButtonModule
  ],
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {
  requisitions: (Requisition & { approvalSequenceDetails?: any })[] = [];

  constructor(private requisitionService: RequisitionService) {}

  ngOnInit() {
    this.loadRequisitions();
  }

private async loadRequisitions() {
  try {
    // Fetch all requisitions with their approval details
    this.requisitions = await this.requisitionService.getRequisitionsWithApprovalDetails();

    // Fetch all approval sequences once to avoid redundant API calls
    const allApprovalSequences = await this.requisitionService.getAllApprovalSequences();

    for (const req of this.requisitions) {
      if (req.approvalSequenceId) {
        // Match the approvalSequenceId to the approval sequence in the list
        const matchingSequence = allApprovalSequences.find(
          (seq) => seq.id === req.approvalSequenceId
        );

        if (matchingSequence) {
          req.approvalSequenceDetails = {
            userFullName: matchingSequence.userFullName || 'N/A',
            userId: matchingSequence.userId || 'N/A',
          };
        } else {
          console.warn(`No matching approval sequence for requisition ID: ${req.id}`);
          req.approvalSequenceDetails = {
            userFullName: 'N/A',
            userId: 'N/A',
          };
        }
      } else {
        console.warn(
          `Requisition ID: ${req.id} is missing approvalSequenceId`
        );
        req.approvalSequenceDetails = {
          userFullName: 'N/A',
          userId: 'N/A',
        };
      }
    }

    console.log('Requisitions Loaded:', this.requisitions);
  } catch (error) {
    console.error('Failed to load requisitions:', error);
  }
}



  async onApprove(requisitionId: string) {
    try {
      await this.requisitionService.updateRequisitionStatus(requisitionId, 'Approved');
      this.loadRequisitions();
    } catch (error) {
      console.error('Failed to approve requisition:', error);
    }
  }

  async onReject(requisitionId: string) {
    try {
      await this.requisitionService.updateRequisitionStatus(requisitionId, 'Rejected');
      this.loadRequisitions();
    } catch (error) {
      console.error('Failed to reject requisition:', error);
    }
  }
}
