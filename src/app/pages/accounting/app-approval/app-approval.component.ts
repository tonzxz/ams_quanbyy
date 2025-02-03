import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

interface Document {
  id: number;
  name: string;
  type: string;
  submissionDate: string;
  submittedBy: string;
  reviewer: string;
  date?: string;
  ppmpAttachment: string[];
  appAttachment: string[];
}

@Component({
  selector: 'app-app-approval',
  standalone: true,
  imports: [CommonModule, TableModule, TooltipModule, ButtonModule, CardModule],
  templateUrl: './app-approval.component.html',
  styleUrls: ['./app-approval.component.scss']
})
export class AppApprovalComponent {
  documents: Document[] = [
    { id: 2, name: 'Bidding Strategy', type: 'Bid Strategy', submissionDate: '2025-01-28', submittedBy: 'Alice Brown', reviewer: 'Robert White', date: '2025-01-29', ppmpAttachment: ['bidding_strategy.pdf'], appAttachment: ['contract_terms.pdf']},
    { id: 3, name: 'Procurement Plan Q2', type: 'Procurement Plan', submissionDate: '2025-02-15', submittedBy: 'Michael Green', reviewer: 'Sophia Adams', date: '2025-01-29', ppmpAttachment: ['procurement_q2.pdf'], appAttachment: ['contract_terms.pdf']},
    { id: 4, name: 'Supplier Evaluation', type: 'Evaluation Report', submissionDate: '2025-03-10', submittedBy: 'Emily Davis', reviewer: 'Mark Thompson', date: '2025-01-29', ppmpAttachment: ['supplier_eval.pd'], appAttachment: ['contract_terms.pdf']},
    { id: 5, name: 'Annual Procurement Plan', type: 'Annual Plan', submissionDate: '2025-04-05', submittedBy: 'David Wilson', reviewer: 'Emma Carter', date: '2025-01-29', ppmpAttachment: ['annual_plan.pdf'], appAttachment: ['contract_terms.pdf']},
    { id: 6, name: 'Contract Review Q1', type: 'Contract Review', submissionDate: '2025-05-20', submittedBy: 'Olivia Martinez', reviewer: 'Daniel Lee', date: '2025-01-29', ppmpAttachment: ['contract_q1.pdf'], appAttachment: ['contract_terms.pdf']}
  ];

  approveDocument(doc: Document) {
    
  }

  getStatusClass(status: string): string {
    return status === 'Approved' ? 'bg-green-200 text-green-800 px-2 py-1 rounded-lg' : '';
  }

  getAttachmentClass(): string {
    return 'text-blue-500 underline cursor-pointer hover:text-blue-700';
  }
}
