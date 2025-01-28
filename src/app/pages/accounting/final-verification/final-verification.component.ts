// final-verification.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { DeliveryReceipt, DeliveryReceiptService } from 'src/app/services/delivery-receipt.service';

interface DocumentStatus {
  supplyLedger: boolean;
  jev: boolean;
  supportingDocs: boolean;
  generalJournal: boolean;
}

enum ApprovalStatus {
  Pending = 'pending',
  Approved = 'approved'
}

@Component({
  selector: 'app-final-verification',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ButtonModule,
    TableModule,
    TabViewModule,
    DialogModule,
    ToastModule,
    StepsModule
  ],
  providers: [MessageService],
  templateUrl: './final-verification.component.html'
})
export class FinalVerificationComponent implements OnInit {
  receipts: DeliveryReceipt[] = [];
  selectedReceipt?: DeliveryReceipt;
  showDetailsModal: boolean = false;
  documentStatus: { [key: string]: DocumentStatus } = {};
  steps: MenuItem[] = [];
  currentStep: number = 0;

  activeTabIndex: number = 0;
  showPreviewModal: boolean = false;
  currentDocument: string = '';

  constructor(
    private deliveryReceiptService: DeliveryReceiptService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
  this.initializeSteps();
  try {
    this.receipts = await this.deliveryReceiptService.getVerifiedReceipts();
    
    // Load saved document status from localStorage
    const savedStatus = localStorage.getItem('documentStatus');
    if (savedStatus) {
      this.documentStatus = JSON.parse(savedStatus);
    }
    
    // Initialize missing status
    this.receipts.forEach(receipt => {
      if (!this.documentStatus[receipt.id!]) {
        this.documentStatus[receipt.id!] = {
          supplyLedger: false,
          jev: false,
          supportingDocs: false,
          generalJournal: false
        };
      }
    });
  } catch (error) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load receipts'
    });
  }
}

  initializeSteps() {
    this.steps = [
      {
        label: 'Pending Approval',
        command: () => {
          this.currentStep = 0;
        }
      },
      {
        label: 'Approved',
        command: () => {
          this.currentStep = 1;
        }
      }
    ];
  }

  getFilteredReceipts() {
    return this.receipts.filter(receipt => {
      const isApproved = this.isReceiptFullyVerified(receipt.id!);
      return this.currentStep === 0 ? !isApproved : isApproved;
    });
  }

  openDetails(receipt: DeliveryReceipt) {
    this.selectedReceipt = receipt;
    this.showDetailsModal = true;
  }

  previewDocument(type: string) {
    this.currentDocument = type;
    this.showPreviewModal = true;
  }

  toggleDocumentStatus(receiptId: string, docType: keyof DocumentStatus) {
    this.documentStatus[receiptId][docType] = !this.documentStatus[receiptId][docType];
    // Save status to localStorage
    localStorage.setItem('documentStatus', JSON.stringify(this.documentStatus));
  }

  isReceiptFullyVerified(receiptId: string): boolean {
    const status = this.documentStatus[receiptId];
    return status.supplyLedger && status.jev && status.supportingDocs && status.generalJournal;
  }

  async finalizeVerification(receipt: DeliveryReceipt) {
    try {
      // Update receipt status to final verified
      await this.deliveryReceiptService.editReceipt({
        ...receipt,
        status: 'verified'
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Receipt has been finalized'
      });

      // Refresh the receipts list
      this.receipts = await this.deliveryReceiptService.getVerifiedReceipts();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to finalize verification'
      });
    }
  }
}