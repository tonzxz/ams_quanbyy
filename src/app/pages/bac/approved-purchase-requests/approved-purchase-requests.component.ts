import { Component, OnInit } from '@angular/core';
import { RequisitionService, Requisition } from 'src/app/services/requisition.service'; // Adjust the import path as needed
import { Router } from '@angular/router'; // Import Router for navigation
import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass and date pipe
import { TableModule } from 'primeng/table'; // Import PrimeNG TableModule
import { ButtonModule } from 'primeng/button'; // Import PrimeNG ButtonModule
import { DialogModule } from 'primeng/dialog'; // Import PrimeNG DialogModule for modal
import { ProgressSpinner, ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-approved-purchase-requests',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, ProgressSpinnerModule], // Import required modules
  templateUrl: './approved-purchase-requests.component.html',
  styleUrls: ['./approved-purchase-requests.component.scss']
})
export class ApprovedPurchaseRequestsComponent implements OnInit {
  requisitions: Requisition[] = []; // Array to store requisitions
  loading: boolean = true; // Loading state
  displayModal: boolean = false; // Modal visibility state
  selectedRequisition: Requisition | null = null; // Selected requisition for modal

  constructor(
    private requisitionService: RequisitionService,
    private router: Router // Inject Router for navigation
  ) {}

  ngOnInit(): void {
    this.loadRequisitions();
  }

  // Fetch requisitions with currentApprovalLevel = 4
  async loadRequisitions(): Promise<void> {
    try {
      // Fetch all requisitions from the service
      const allRequisitions = await this.requisitionService.getAllRequisitions();
      
      // Filter requisitions where currentApprovalLevel is 4
      this.requisitions = allRequisitions.filter(req => req.currentApprovalLevel === 4);
    } catch (error) {
      console.error('Failed to load requisitions:', error);
    } finally {
      this.loading = false; // Set loading to false after fetching data
    }
  }

  // Navigate to the details page for a specific requisition
  viewDetails(requisitionId: string): void {
    this.router.navigate(['/requisition-details', requisitionId]);
  }

  // Show modal with attachments for a specific requisition
  showAttachments(requisition: Requisition): void {
    this.selectedRequisition = requisition;
    this.displayModal = true;
  }
}