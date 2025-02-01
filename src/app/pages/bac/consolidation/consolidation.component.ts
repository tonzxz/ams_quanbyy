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
  status: string;
  approvalDate?: string;
  attachments: string[];
}

@Component({
  selector: 'app-consolidation',
  standalone: true,
  imports: [CommonModule, TableModule, TooltipModule, ButtonModule, CardModule],
  templateUrl: './consolidation.component.html',
  styleUrls: ['./consolidation.component.scss']
})
export class ConsolidationComponent {
  documents: Document[] = [
    { id: 2, name: 'Bidding Strategy', type: 'Bid Strategy', submissionDate: '2025-01-28', submittedBy: 'Alice Brown', reviewer: 'Robert White', status: 'Approved', approvalDate: '2025-01-29', attachments: ['bidding_strategy.pdf', 'contract_terms.pdf'] },
    { id: 3, name: 'Procurement Plan Q2', type: 'Procurement Plan', submissionDate: '2025-02-15', submittedBy: 'Michael Green', reviewer: 'Sophia Adams', status: 'Approved', approvalDate: '2025-02-16', attachments: ['procurement_q2.pdf', 'budget_q2.pdf'] },
    { id: 4, name: 'Supplier Evaluation', type: 'Evaluation Report', submissionDate: '2025-03-10', submittedBy: 'Emily Davis', reviewer: 'Mark Thompson', status: 'Approved', approvalDate: '2025-03-11', attachments: ['supplier_eval.pdf', 'comparison_chart.pdf'] },
    { id: 5, name: 'Annual Procurement Plan', type: 'Annual Plan', submissionDate: '2025-04-05', submittedBy: 'David Wilson', reviewer: 'Emma Carter', status: 'Approved', approvalDate: '2025-04-06', attachments: ['annual_plan.pdf', 'financial_analysis.pdf'] },
    { id: 6, name: 'Contract Review Q1', type: 'Contract Review', submissionDate: '2025-05-20', submittedBy: 'Olivia Martinez', reviewer: 'Daniel Lee', status: 'Approved', approvalDate: '2025-05-21', attachments: ['contract_q1.pdf', 'terms_conditions.pdf'] }
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
