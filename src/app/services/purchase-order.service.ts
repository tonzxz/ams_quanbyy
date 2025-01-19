import { Injectable } from '@angular/core';

import { z } from 'zod';
import { Stock, StocksService } from './stocks.service';

export const purchaseOrderSchema = z.object({
  id: z.string().length(10, 'Purchase Order ID must be exactly 32 characters'),  // 32 characters ID
  customerName: z.string().min(1, 'Customer Name is required'),
  totalAmount: z.number().min(0, 'Total Amount must be positive'),
  dateCreated: z.date(),
  status: z.enum(['Pending', 'Completed', 'Cancelled']),
  stocked: z.boolean(),
});
export type PurchaseOrder = z.infer<typeof purchaseOrderSchema>;

export type PurchaseOrderItems = {
  purchaseOrder: PurchaseOrder,
  items: Stock[],
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private purchaseOrders:PurchaseOrder[] = [
    {
      id: 'PO12345678',  // 10 characters ID (substring of original)
      customerName: 'John Doe',
      totalAmount: 10500.50,
      dateCreated: new Date('2023-06-15'),
      status: 'Completed',
      stocked: true,
    },
    {
      id: 'PO98765432',  // 10 characters ID (substring of original)
      customerName: 'Jane Smith',
      totalAmount: 4500.75,
      dateCreated: new Date('2022-11-30'),
      status: 'Pending',
      stocked: true,
    },
    {
      id: 'PO54321abc',  // 10 characters ID (substring of original)
      customerName: 'Mark Brown',
      totalAmount: 2300.30,
      dateCreated: new Date('2023-01-10'),
      status: 'Cancelled',
      stocked: true,
    },

    {
      id: 'PO54300000',  // 10 characters ID (substring of original)
      customerName: 'Joshua Corda',
      totalAmount: 2300.30,
      dateCreated: new Date('2023-01-10'),
      status: 'Pending',
      stocked:false
    },

    {
      id: 'PO54300120',  // 10 characters ID (substring of original)
      customerName: 'Anton Caesar Cabais',
      totalAmount: 2300.30,
      dateCreated: new Date('2023-01-10'),
      status: 'Pending',
      stocked: false,
    },
  ];
  constructor(private stockService:StocksService) { }

  async getAll(){
    const stocks = await this.stockService.getAll(); 
    const joined:PurchaseOrderItems[] = [];

    for(let purchaseOrder of this.purchaseOrders){
      joined.push({
        purchaseOrder: purchaseOrder,
        items:stocks.filter(stock=>stock.purchase_order_id == purchaseOrder.id)
      })
    }
    console.log(joined);
    return joined;
  }

}
