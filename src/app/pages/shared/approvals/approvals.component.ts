import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';

import { RequisitionService, Requisition } from 'src/app/services/requisition.service';
import { UserService } from '../../../services/user.service';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonGroupModule } from 'primeng/buttongroup';

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TableModule,
    TabViewModule,
    ButtonModule,
    TooltipModule,
    ButtonGroupModule

  ],
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {
  requisitions: (Requisition & { approvalSequenceDetails?: any })[] = [];
loading: unknown;

  constructor(private requisitionService: RequisitionService, private userService: UserService) {}

  ngOnInit() {
    this.loadRequisitions();
  }


  // THIS IS WORKING 
// private async loadRequisitions() {
//   try {
//     const allRequisitions = await this.requisitionService.getAllRequisitions();
//     const allSequences = await this.requisitionService.getAllApprovalSequences();

//     this.requisitions = allRequisitions.map(req => {
//       // Find sequences of matching type (procurement/supply)
//       const typeSequences = allSequences.filter(seq => 
//         seq.type === (req.currentApprovalLevel <= 4 ? 'procurement' : 'supply')
//       );

//       // Get sequence for current level
//       const currentSequence = typeSequences.find(seq => 
//         seq.level === req.currentApprovalLevel
//       );

//       return {
//         ...req,
//         approvalSequenceDetails: currentSequence ? {
//           departmentName: currentSequence.departmentName,
//           roleName: currentSequence.roleName,
//           userFullName: currentSequence.userFullName
//         } : {
//           departmentName: 'N/A',
//           roleName: 'N/A', 
//           userFullName: 'N/A'
//         }
//       };
//     });
//   } catch (error) {
//     console.error('Failed to load requisitions:', error);
//   }
// }

  private async loadRequisitions() {
 try {
   const currentUser = this.userService.getUser(); // Get logged in user
   const allRequisitions = await this.requisitionService.getAllRequisitions();
   const allSequences = await this.requisitionService.getAllApprovalSequences();

   // Filter requisitions where current user is the approver for current level
   this.requisitions = allRequisitions.map(req => {
     const typeSequences = allSequences.filter(seq => 
       seq.type === (req.currentApprovalLevel <= 4 ? 'procurement' : 'supply')
     );

     const currentSequence = typeSequences.find(seq => 
       seq.level === req.currentApprovalLevel
     );

     return {
       ...req,
       approvalSequenceDetails: currentSequence ? {
         level: currentSequence.level,
         departmentName: currentSequence.departmentName,
         roleName: currentSequence.roleName,
         userFullName: currentSequence.userFullName,
         userId: currentSequence.userId
       } : {
         level: 'N/A',
         departmentName: 'N/A',
         roleName: 'N/A',
         userFullName: 'N/A',
         userId: 'N/A'
       }
     };
   }).filter(req => 
     // Only show requisitions where current user is the approver
     req.approvalSequenceDetails?.userId === currentUser?.id
   );

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
