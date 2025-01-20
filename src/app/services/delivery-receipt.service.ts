import { Injectable } from '@angular/core';
import { z } from 'zod';
import { Stock, StocksService } from './stocks.service';

export const deliveryReceiptSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  receipt_number: z.string().length(10, 'Receipt number is required'),
  supplier_name: z.string().min(1, "Customer name is required"), // Ensuring customer name is not empty
  delivery_date: z.date(), // Date when the delivery was made
  supporting_documents: z.array(z.string()).optional(), // Array of image links as plain strings
  total_amount: z.number().min(0, "Total amount must be a positive number"), // Total amount of the delivery receipt
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(), // Optional notes for the receipt
  status: z.enum(['unverified','processing','verified']),
  stocked: z.boolean(),
  receipts: z.array(z.string()),
});

export type DeliveryReceipt = z.infer<typeof deliveryReceiptSchema>;


export type DeliveryReceiptItems = {
  deliveryReceipt: DeliveryReceipt,
  items: Stock[],
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryReceiptService {
  private receiptData: DeliveryReceipt[] = [
    {
      id: '12345678901234567890123456789012',  // 32 characters ID
      receipt_number: 'REC0012345',
      supplier_name: 'John Doe',
      delivery_date: new Date('2023-01-15'),
      receipts: [
        'assets/images/products/sample-receipt.png'
      ], // Just plain string links for images
      total_amount: 1051.00,
      notes: 'Customer requested expedited shipping.',
      status: 'unverified',  // Status: Unverified
      stocked:false,
    },
    {
      id: '23456789012345678901234567890123',  // 32 characters ID
      receipt_number: 'REC0012346',
      supplier_name: 'Jane Smith',
      delivery_date: new Date('2023-02-20'),
      receipts: [
        'assets/images/products/sample-receipt.png'
      ], // Just plain string links for images
      total_amount: 815.00,
      notes: 'Delivery on the 20th.',
      status: 'unverified',  // Status: Unverified
      stocked:false,
    },
    {
      id: '34567890123456789012345678901234',  // 32 characters ID
      receipt_number: 'REC0012347',
      supplier_name: 'Alice Johnson',
      delivery_date: new Date('2023-03-05'),
      receipts: [
        'assets/images/products/sample-receipt.png'
      ], // Just plain string links for images
      total_amount: 1250.75,
      notes: 'Customer requested special handling.',
      status: 'unverified',  // Status: Unverified (New Unverified Receipt)
      stocked:false,
    },
    {
      id: '45678901234567890123456789012345',  // 32 characters ID
      receipt_number: 'REC0012348',
      supplier_name: 'Bob Williams',
      delivery_date: new Date('2023-03-10'),
      receipts: [
        'assets/images/products/sample-receipt.png'
      ], // Just plain string links for images
      total_amount: 980.40,
      notes: 'Delayed due to weather conditions.',
      status: 'verified',  // Status: Processing (New Processing Receipt)
      stocked:false,
    },
    {
      id: '56789012345678901234567890123456',  // 32 characters ID
      receipt_number: 'REC0012349',
      supplier_name: 'Cathy Brown',
      delivery_date: new Date('2023-03-12'),
      receipts: [
        'assets/images/products/sample-receipt.png'
      ], // Just plain string links for images
      total_amount: 340.50,
      notes: 'Urgent delivery, needs confirmation.',
      status: 'verified',  // Status: Processing (New Processing Receipt)
      stocked:false,
    },
    {
      id: '67890123456789012345678901234567',  // 32 characters ID
      receipt_number: 'REC0012350',
      supplier_name: 'David Clark',
      delivery_date: new Date('2023-03-15'),
      receipts: [
        'assets/images/products/sample-receipt.png'
      ], // Just plain string links for images
      total_amount: 1500.00,
      notes: 'Payment confirmed.',
      status: 'verified',  // Status: Verified (New Verified Receipt)
      stocked:true,
    },
    {
      id: '78901234567890123456789012345678',  // 32 characters ID
      receipt_number: 'REC0012351',
      supplier_name: 'Emily White',
      delivery_date: new Date('2023-03-18'),
      receipts: [
        'assets/images/products/sample-receipt.png'
      ], // Just plain string links for images
      total_amount: 920.00,
      notes: 'Verified and completed.',
      status: 'verified',  // Status: Verified (New Verified Receipt)
      stocked:true,
    }
  ];
  

  constructor(private stockService:StocksService) { }


  async getAllDRItems(){
        const stocks = await this.stockService.getAll(); 
        const joined:DeliveryReceiptItems[] = [];
        const local_dr_items = localStorage.getItem('deliveryReceipts');
        if(local_dr_items){
          this.receiptData = JSON.parse(local_dr_items) as DeliveryReceipt[];
        }
    
        this.receiptData = this.receiptData.filter(dr=>dr.status == 'verified');
        for(let dr of this.receiptData){
          joined.push({
            deliveryReceipt: dr,
            items:stocks.filter(stock=>stock.dr_id == dr.receipt_number)
          })
        }
      
    
        return joined;
  }
  async getAll(): Promise<DeliveryReceipt[]> {
    const local_receipts = localStorage.getItem('deliveryReceipts');
    if (local_receipts) {
      this.receiptData = JSON.parse(local_receipts) as DeliveryReceipt[];
    }
    return this.receiptData;
  }

  async addReceipt(receipt: DeliveryReceipt) {
    const id = (Math.random().toString(36) + Math.random().toString(36) + Date.now().toString(36)).substring(2, 34);
    this.receiptData.push({
      id: id,
      ...receipt
    });
    localStorage.setItem('deliveryReceipts', JSON.stringify(this.receiptData));
  }

  async editReceipt(receipt: DeliveryReceipt) {
    const receiptIndex = this.receiptData.findIndex(item => item.id == receipt.id);
    if (receiptIndex !== -1) {
      this.receiptData[receiptIndex] = receipt;
      localStorage.setItem('deliveryReceipts', JSON.stringify(this.receiptData));
    }
  }

  async moveForInspection(id: string) {
    const receiptIndex = this.receiptData.findIndex(item => item.id == id);
    if (receiptIndex !== -1) {
      this.receiptData[receiptIndex].status = 'processing';
      localStorage.setItem('deliveryReceipts', JSON.stringify(this.receiptData));
    }
  }

  async moveToVerified(id: string) {
    const receiptIndex = this.receiptData.findIndex(item => item.id == id);
    if (receiptIndex !== -1) {
      this.receiptData[receiptIndex].status = 'verified';
      localStorage.setItem('deliveryReceipts', JSON.stringify(this.receiptData));
    }
  }

  async moveToRejected(id: string) {
    const receiptIndex = this.receiptData.findIndex(item => item.id == id);
    if (receiptIndex !== -1) {
      this.receiptData[receiptIndex].status = 'unverified';
      localStorage.setItem('deliveryReceipts', JSON.stringify(this.receiptData));
    }
  }

  async markAsStocked(id:string){
    const drIndex = this.receiptData.findIndex(dr => dr.id==id);
    this.receiptData[drIndex].stocked = true;
    localStorage.setItem('purchase_orders', JSON.stringify(this.receiptData));
  }

  async deleteReceipt(id: string) {
    this.receiptData = this.receiptData.filter(item => item.id !== id);
    localStorage.setItem('deliveryReceipts', JSON.stringify(this.receiptData));
  }
}
