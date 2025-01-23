import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PurchaseRequest {
  id: number;
  department: string;
  amount: number;
  submissionDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  budgetCompliance: 'Within Budget' | 'Exceeds Budget';
  attachments: string[];
}

@Component({
  selector: 'app-validate-approved-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validate-approved-request.component.html',
  styleUrls: ['./validate-approved-request.component.scss'],
})
export class ValidateApprovedRequestComponent {
  // Dummy data for purchase requests
  purchaseRequests: PurchaseRequest[] = [
    {
      id: 123,
      department: 'DeptA',
      amount: 10000,
      submissionDate: '2023-01-01',
      status: 'Pending',
      budgetCompliance: 'Within Budget',
      attachments: ['quote.pdf', 'specs.docx'],
    },
    {
      id: 456,
      department: 'DeptB',
      amount: 15000,
      submissionDate: '2023-01-02',
      status: 'Pending',
      budgetCompliance: 'Exceeds Budget',
      attachments: ['quote.pdf'],
    },
    {
      id: 789,
      department: 'DeptC',
      amount: 20000,
      submissionDate: '2023-01-03',
      status: 'Pending',
      budgetCompliance: 'Within Budget',
      attachments: ['specs.docx'],
    },
  ];

  selectedRequest: PurchaseRequest | null = null; // Currently selected request
  feedback: string = ''; // Feedback for rejected requests

  // Select a request from the list
  onRowSelect(request: PurchaseRequest) {
    this.selectedRequest = request;
  }

  // Approve the selected request
  approveRequest() {
    if (this.selectedRequest) {
      this.selectedRequest.status = 'Approved';
      alert(`PR ${this.selectedRequest.id} has been approved.`);
      this.logAction('Approved');
    }
  }

  // Reject the selected request
  rejectRequest() {
    if (this.selectedRequest) {
      this.selectedRequest.status = 'Rejected';
      alert(`PR ${this.selectedRequest.id} has been rejected.`);
      this.logAction('Rejected');
      this.notifyDepartment(this.selectedRequest.department, this.feedback);
      this.feedback = ''; // Clear feedback after rejection
    }
  }

  // Log the action (approve/reject)
  logAction(action: string) {
    console.log(`PR ${this.selectedRequest?.id} ${action}`);
  }

  // Notify the department (simulated)
  notifyDepartment(department: string, feedback: string) {
    console.log(`Notified ${department} with feedback: ${feedback}`);
  }
}