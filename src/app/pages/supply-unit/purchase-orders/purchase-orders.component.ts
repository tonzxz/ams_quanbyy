import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { PurchaseOrderItems, PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { TabsModule } from 'primeng/tabs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';


@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [MaterialModule,TableModule, CommonModule, DividerModule,TabsModule,
    IconFieldModule,InputIconModule,InputTextModule, FluidModule, FormsModule,
    DialogModule,ButtonModule, ButtonGroupModule
  ],
  templateUrl: './purchase-orders.component.html',
  styleUrl: './purchase-orders.component.scss'
})
export class PurchaseOrdersComponent {
  purchaseOrders: PurchaseOrderItems[] = [];  // List of purchase orders with items
  allPurchaseOrders: PurchaseOrderItems[] = [];  // List of purchase orders with items
  searchValue:string='';
  stockTab:number=0;
  showViewPanel:boolean=false;

  constructor(private purchaseOrderService: PurchaseOrderService) {}

  async ngOnInit() {
    // Fetch the purchase orders with items
    this.allPurchaseOrders = await this.purchaseOrderService.getAll();
    this.switchStockTab(0);
  }

  switchStockTab(tab:number){
    if(tab ==0){
      this.purchaseOrders =this.allPurchaseOrders.filter(po=>po.purchaseOrder.stocked);
    }else{
      this.purchaseOrders =this.allPurchaseOrders.filter(po=>!po.purchaseOrder.stocked);
    }
    this.stockTab = 0;
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

  toggleViewPanel(){
    this.showViewPanel = true;
  }
}
