import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { PurchaseOrderItems, PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [MaterialModule,TableModule, CommonModule, DividerModule],
  templateUrl: './purchase-orders.component.html',
  styleUrl: './purchase-orders.component.scss'
})
export class PurchaseOrdersComponent {
  purchaseOrders: PurchaseOrderItems[] = [];  // List of purchase orders with items

  constructor(private purchaseOrderService: PurchaseOrderService) {}

  async ngOnInit() {
    // Fetch the purchase orders with items
    this.purchaseOrders = await this.purchaseOrderService.getAll();
  }

  // Utility method to calculate the total number of items in each group
  calculateItemTotal(purchaseOrderId: string): number {
    const purchaseOrder = this.purchaseOrders.find(order => order.purchaseOrder.id === purchaseOrderId);
    return purchaseOrder ? purchaseOrder.items.length : 0;
  }
  calculateItemPriceTotal(purchaseOrderId: string): number {
    const purchaseOrder = this.purchaseOrders.find(order => order.purchaseOrder.id === purchaseOrderId);
    return purchaseOrder ? purchaseOrder.items.reduce((acc,curr)=>acc+curr.price,0) : 0;
  }
}
