import { Injectable } from '@angular/core';

import { z } from 'zod';
import { Stock, StocksService } from './stocks.service';

export const purchaseOrderSchema = z.object({
  id: z.string().length(10, 'Purchase Order ID must be exactly 32 characters'),  // 32 characters ID
  supplierName: z.string().min(1, 'Supplier Name is required'),
  totalAmount: z.number().min(0, 'Total Amount must be positive'),
  dateCreated: z.date(),
  status: z.enum(['Pending', 'Completed', 'Cancelled']),
  stocked: z.boolean(),
  receipts: z.array(z.string()),
});
export type PurchaseOrder = z.infer<typeof purchaseOrderSchema>;

export type PurchaseOrderItems = {
  purchaseOrder: PurchaseOrder,
  items:Stock[],
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private purchaseOrders:PurchaseOrder[] = [
    {
      id: 'PO12345678',  // 10 characters ID (substring of original)
      supplierName: 'John Doe',
      totalAmount: 10500.50,
      dateCreated: new Date('2023-06-15'),
      status: 'Completed',
      stocked: true,
      receipts:['assets/images/products/sample-receipt.png'],
    },
    {
      id: 'PO98765432',  // 10 characters ID (substring of original)
      supplierName: 'Jane Smith',
      totalAmount: 4500.75,
      dateCreated: new Date('2022-11-30'),
      status: 'Pending',
      stocked: true,
      receipts:['assets/images/products/sample-receipt.png'],
    },
    {
      id: 'PO54321abc',  // 10 characters ID (substring of original)
      supplierName: 'Mark Brown',
      totalAmount: 2300.30,
      dateCreated: new Date('2023-01-10'),
      status: 'Cancelled',
      stocked: true,
      receipts:['assets/images/products/sample-receipt.png'],
    },

    {
      id: 'PO54300000',  // 10 characters ID (substring of original)
      supplierName: 'Joshua Corda',
      totalAmount: 2300.30,
      dateCreated: new Date('2023-01-10'),
      status: 'Pending',
      stocked:false,
      receipts:[],
    },

    {
      id: 'PO54300120',  // 10 characters ID (substring of original)
      supplierName: 'Anton Caesar Cabais',
      totalAmount: 2300.30,
      dateCreated: new Date('2023-01-10'),
      status: 'Pending',
      stocked: false,
      receipts:['assets/images/products/sample-receipt.png', 'assets/images/products/sample-receipt.png'],
    },
  ];
  constructor() { }

  purchaseOrderItems:PurchaseOrderItems[]=[];

  async getAll(){
      return this.purchaseOrderItems;
  }

  async generatePurchaseOrder(purchaseOrder:PurchaseOrder){
     if(this.purchaseOrders.find(p=>p.id == purchaseOrder.id)) return;
      this.purchaseOrders.push({
        ...purchaseOrder
      });
      localStorage.setItem('purchase_orders', JSON.stringify(this.purchaseOrders));
  }
  


}
