//src\app\services\delivery-receipt.service.ts
import { Injectable } from '@angular/core';
import { z } from 'zod';
import { Stock, StocksService } from './stocks.service';
import { UserService } from './user.service';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from './notifications.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

export const deliveryReceiptSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  receipt_number: z.string().length(10, 'Receipt number is required'),
  supplier_id: z.string().length(32, "Supplier ID must be exactly 32 characters"),
  department_id: z.string().length(32, "Supplier ID must be exactly 32 characters").optional(),
  department_name: z.string().min(1, "Department name is required").optional(),
  supplier_name: z.string().min(1, "Customer name is required"),
  delivery_date: z.date(),
  supporting_documents: z.array(z.string()).optional(),
  total_amount: z.number().min(0, "Total amount must be a positive number"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  status: z.enum(['unverified', 'processing', 'verified', 'completed']), // Add 'completed' status
  purchase_order: z.string().optional(),
  stocked: z.boolean(),
  receipts: z.array(z.string()),
  supplier_tin: z.string().length(20, "Supplier TIN must be exactly 20 characters"),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
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
  private apiUrl = `${environment.api}/delivery_receipts`;

  constructor(
    private notifService: NotificationService,
    private stockService: StocksService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  async getAll(): Promise<DeliveryReceipt[]> {
    // Replace localStorage with HTTP request
    try {
      const response = await this.http.get<DeliveryReceipt[]>(this.apiUrl).toPromise();
      return response || [];
    } catch (error) {
      console.error('Error fetching delivery receipts:', error);
      return [];
    }
  }

  async editReceipt(receipt: DeliveryReceipt): Promise<any> {
    // Replace localStorage with HTTP PUT request
    return this.http.put(`${this.apiUrl}/${receipt.id}`, receipt).toPromise();
  }

  async moveForInspection(id: string) {
    const data = { status: 'processing' };
    return this.http.patch(`${this.apiUrl}/${id}`, data).toPromise();
  }

  async moveToVerified(id: string) {
    const data = { status: 'verified' };
    return this.http.patch(`${this.apiUrl}/${id}`, data).toPromise();
  }

  async moveToRejected(id: string) {
    const data = { status: 'unverified' };
    return this.http.patch(`${this.apiUrl}/${id}`, data).toPromise();
  }

  async markAsStocked(id: string) {
    const data = { stocked: true };
    return this.http.patch(`${this.apiUrl}/${id}`, data).toPromise();
  }

  async deleteReceipt(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`).toPromise();
  }

  async getAllDRItems(): Promise<DeliveryReceiptItems[]> {
    const [stocks, receipts] = await Promise.all([
      this.stockService.getAll(),
      this.getAll()
    ]);

    const verifiedReceipts = receipts.filter(dr => dr.status === 'verified');
    
    return verifiedReceipts.map(dr => ({
      deliveryReceipt: dr,
      items: stocks.filter(stock => stock.dr_id === dr.receipt_number)
    }));
  }

  async addReceipt(receipt: DeliveryReceipt, files: File[]): Promise<any> {
    const formData = new FormData();
    
    // Convert receipt data to plain object
    const receiptData = {
      ...receipt,
      receipts: [],  // Initialize empty array, will be populated by backend
      delivery_date: receipt.delivery_date.toISOString()  // Format date for API
    };
    
    // Add receipt data
    Object.entries(receiptData).forEach(([key, value]) => {
      formData.append(key, value?.toString() ?? '');
    });
    
    // Add files
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.http.post(this.apiUrl, formData).toPromise();
  }

  async getVerifiedReceipts(): Promise<DeliveryReceipt[]> {
    try {
      const receipts = await this.getAll();
      return receipts.filter(receipt => receipt.status === 'verified');
    } catch (error) {
      console.error('Error fetching verified receipts:', error);
      return [];
    }
  }
}
