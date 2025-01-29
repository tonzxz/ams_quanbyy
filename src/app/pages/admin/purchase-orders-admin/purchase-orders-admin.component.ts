import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-purchase-orders-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    TabViewModule,
    
  ],
  templateUrl: './purchase-orders-admin.component.html',
  styleUrls: ['./purchase-orders-admin.component.scss'],
  providers: [MessageService]
})
export class PurchaseOrdersAdminComponent implements OnInit {
  purchaseOrders: any[] = [];
  isCreateModalVisible = false;
  newPurchaseOrder: any = {
    title: '',
    totalValue: 0,
    requestedBy: ''
  };

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.loadPurchaseOrders();
  }

  async loadPurchaseOrders() {
    try {
      this.purchaseOrders = await this.purchaseOrderService.getAll();
    } catch (error) {
      console.error('Failed to load Purchase Orders:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load purchase orders.' });
    }
  }

  openCreatePurchaseOrderModal() {
    this.isCreateModalVisible = true;
  }

  closeCreatePurchaseOrderModal() {
    this.isCreateModalVisible = false;
    this.newPurchaseOrder = { title: '', totalValue: 0, requestedBy: '' };
  }

  async createPurchaseOrder() {
    if (!this.newPurchaseOrder.title || this.newPurchaseOrder.totalValue <= 0 || !this.newPurchaseOrder.requestedBy) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill all fields correctly.' });
      return;
    }

    try {
      const newPO = {
        id: `PO-${Math.floor(Math.random() * 100000)}`,
        title: this.newPurchaseOrder.title,
        totalValue: this.newPurchaseOrder.totalValue,
        requestedBy: this.newPurchaseOrder.requestedBy,
        dateCreated: new Date()
      };

      this.purchaseOrders.push(newPO);
      this.closeCreatePurchaseOrderModal();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Purchase Order Created' });
    } catch (error) {
      console.error('Error creating purchase order:', error);
    }
  }

  async deletePurchaseOrder(poId: string) {
    this.purchaseOrders = this.purchaseOrders.filter(po => po.id !== poId);
    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Purchase Order Removed' });
  }

  async editPurchaseOrder(po: any) {
    console.log('Edit PO:', po);
  }
}
