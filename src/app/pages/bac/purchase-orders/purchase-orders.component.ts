import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TableModule } from 'primeng/table';
import { RFQ, RFQService } from 'src/app/services/rfq.service';
import { RequisitionService } from 'src/app/services/requisition.service';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'primeng/api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { NoaComponent } from '../../shared/noa/noa.component';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TableModule,
    MatButtonModule,
    MatIconModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    TabViewModule,
    NoaComponent,
    CommonModule
  ],
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss'],
  providers: [MessageService],
})
export class PurchaseOrdersComponent implements OnInit {
  rfqs: RFQ[] = [];
  approvedRfqs: any[] = [];
  rfqsWithPO: any[] = [];
  loading = false;
  isCreateModalVisible = false;
  selectedRfq: any = null;

  constructor(
    private rfqService: RFQService,
    private requisitionService: RequisitionService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.loadApprovedRFQs();
    await this.loadRFQsWithPO();
  }

  private async loadApprovedRFQs() {
    try {
      this.loading = true;
      const allRfqs = await this.rfqService.getAll();

      const approvedRfqs = allRfqs.filter(rfq => 
        rfq.status === 'approved'
      );

      this.approvedRfqs = await Promise.all(
        approvedRfqs.map(async (rfq) => {
          const requisition = await this.requisitionService.getRequisitionById(rfq.purchase_order || '');
          const user = await this.userService.getUserById(requisition?.createdByUserId || '');

          if (requisition && !requisition.purchaseOrderId) {
            return {
  id: rfq.id,
  title: requisition?.title || 'No Title',
  description: requisition?.description || 'No Description',
  totalEstimatedValue: rfq.suppliers?.reduce(
    (sum, supplier) => sum + (supplier.biddingPrice || 0),
    0
  ) || 0,
  requestedBy: user?.fullname || 'Unknown',
  dateRequested: requisition?.dateCreated || new Date(),
  qualifiedSupplier: rfq.suppliers?.[0]?.supplierName || 'N/A',
  noticeOfAward: requisition?.noticeOfAwardAttachment || null,
  purchase_order: rfq.purchase_order
};

          }
          return null;
        })
      );

      this.approvedRfqs = this.approvedRfqs.filter(rfq => rfq !== null);

    } catch (error) {
      console.error('Failed to load RFQs:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load RFQs.',
      });
    } finally {
      this.loading = false;
    }
  }

  private async loadRFQsWithPO() {
  try {
    this.loading = true;
    const allRfqs = await this.rfqService.getAll();

    const approvedRfqs = allRfqs.filter(rfq => 
      rfq.status === 'approved'
    );

    this.rfqsWithPO = await Promise.all(
      approvedRfqs.map(async (rfq) => {
        const requisition = await this.requisitionService.getRequisitionById(rfq.purchase_order || '');
        const user = await this.userService.getUserById(requisition?.createdByUserId || '');

        if (requisition && requisition.purchaseOrderId) {
          return {
            id: rfq.id,
            title: requisition?.title || 'No Title',
            description: requisition?.description || 'No Description',
            totalEstimatedValue: rfq.suppliers?.reduce(
              (sum, supplier) => sum + (supplier.biddingPrice || 0),
              0
            ) || 0,
            requestedBy: user?.fullname || 'Unknown',
            dateRequested: requisition?.dateCreated || new Date(),
            purchaseOrderId: requisition.purchaseOrderId,
            qualifiedSupplier: rfq.suppliers?.[0]?.supplierName || 'N/A',
            requisitionId: requisition.id,
            purchaseRequestAttachment: requisition?.purchaseRequestAttachment || null
          };
        }
        return null;
      })
    );

    this.rfqsWithPO = this.rfqsWithPO.filter(rfq => rfq !== null);
    
  } catch (error) {
    console.error('Failed to load RFQs with PO:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load Purchase Orders.',
    });
  } finally {
    this.loading = false;
  }
}

viewPurchaseRequest(attachment: string) {
  if (attachment) {
    window.open(attachment, '_blank');
  } else {
    this.messageService.add({
      severity: 'warn',
      summary: 'No Purchase Request',
      detail: 'No Purchase Request document has been attached.',
    });
  }
}

  openCreatePurchaseOrderModal() {
    this.isCreateModalVisible = true;
  }



  async createPurchaseOrder() {
    if (!this.selectedRfq) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select an RFQ to create a purchase order.',
      });
      return;
    }

    try {
      const purchaseOrderId = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      await this.requisitionService.updatePurchaseOrderId(
        this.selectedRfq.purchase_order,
        purchaseOrderId
      );
      
      await this.loadApprovedRFQs();
      await this.loadRFQsWithPO(); // Reload both lists
      
      this.isCreateModalVisible = false;
      this.selectedRfq = null;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Purchase Order ${purchaseOrderId} created successfully!`,
      });
      
    } catch (error) {
      console.error('Error creating purchase order:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create purchase order.',
      });
    }
  }

 viewNoticeOfAward(attachment: string) {
  if (attachment) {
    window.open(attachment, '_blank');
  } else {
    this.messageService.add({
      severity: 'warn',
      summary: 'No Notice of Award',
      detail: 'No Notice of Award has been attached for this RFQ.',
    });
  }
   
   
}

 

  onCancelCreatePurchaseOrder() {
    this.isCreateModalVisible = false;
    this.selectedRfq = null;
  }


  openNTPModal() {
    this.isNTPModalVisible = true;
  }
 

  // Add to your component properties
isNTPModalVisible = false;
selectedPO: any = null;

// Add these methods
openCreateNTPModal() {
  this.isNTPModalVisible = true;
}

onCancelNTP() {
  this.isNTPModalVisible = false;
  this.selectedPO = null;
}

async createNTP() {
  if (!this.selectedPO) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please select a Purchase Order to create a Notice to Proceed.',
    });
    return;
  }

  try {
    const ntpId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    await this.requisitionService.updateNoticeToProceedId(
      this.selectedPO.requisitionId,
      ntpId
    );

    await this.loadRFQsWithPO(); // Refresh the list
    
    this.isNTPModalVisible = false;
    this.selectedPO = null;

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Notice to Proceed ${ntpId} created successfully!`,
    });
  } catch (error) {
    console.error('Error creating NTP:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create Notice to Proceed.',
    });
  }
}
  
  showNOAModal: boolean = false;
selectedRFQId: string | null = null;

  openNOAModal(rfqId: string): void {
  this.selectedRFQId = rfqId; // Pass the RFQ ID to the NOA component
  this.showNOAModal = true; // Open the modal
}

  closeNOAModal(): void {
  this.selectedRFQId = null; // Clear the RFQ ID
  this.showNOAModal = false; // Close the modal
}

}