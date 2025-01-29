import { Injectable } from '@angular/core';
import { z } from 'zod';
import { StocksService } from './stocks.service';
import { Stock } from './stocks.service';
import { InventoryService } from './inventory.service';

export const stockTransferSchema = z.object({
  id: z.string().length(32, "Transfer ID must be exactly 32 characters"),  // ID of the stock being transferred
  stockId: z.string().length(32, "Stock ID must be exactly 32 characters"),  // ID of the stock being transferred
  location: z.string().length(32, "Stock ID must be exactly 32 characters"),  // ID of the stock being transferred
  amount: z.number().min(1, "Amount to transfer must be greater than 0"),  // Amount to transfer
  status: z.enum(['pending', 'transferred']),  // Status of the transfer
});

export type StockTransfer = z.infer<typeof stockTransferSchema>;

@Injectable({
  providedIn: 'root'
})
export class StockTransferService {
  private stockTransfers: StockTransfer[] = [];

  constructor(private stocksService: StocksService, private inventoryService:InventoryService) {}

  // Create and manage stock transfer
  async createTransfer(stockId: string, amount: number,location:string): Promise<void> {
    // Get the stock details
    const stock = await this.stocksService.getAll();
    const stockToTransfer = stock.find(item => item.id === stockId);

    if (!stockToTransfer) {
      throw new Error('Stock not found');
    }

    if (stockToTransfer.quantity < amount) {
      throw new Error('Not enough stock to transfer');
    }
    const id = (Math.random().toString(36) + Date.now().toString(36)).substring(2, 34);
    // Create the transfer entry with pending status
    const newTransfer: StockTransfer = {
      id,
      stockId,
      location,
      amount,
      status: 'pending',
    };

    this.stockTransfers.push(newTransfer);

    localStorage.setItem('stockTransfers', JSON.stringify(this.stockTransfers));

  }

  async commitTransfer(transferId:string){
    this.stockTransfers = await this.getTransfers();
    const transfer = this.stockTransfers.findIndex(s=>s.id ==transferId);
    const stock = await this.stocksService.getAll();
    const inventory = await this.inventoryService.getAllLocations();
    const stockToTransfer = stock.find(item => item.id === this.stockTransfers[transfer]?.stockId)!;
    // Update stock quantity and create a new stock for the transferred amount
    await this.stocksService.editStock({
      ...stockToTransfer,
      quantity: stockToTransfer.quantity - this.stockTransfers[transfer]?.amount!,
    });

    const newStock: Stock = {
      ...stockToTransfer,
      storage_id: this.stockTransfers[transfer]?.location,
      storage_name: inventory.find(i=>i.id == this.stockTransfers[transfer]?.location)?.name,
      quantity:this.stockTransfers[transfer]?.amount!,
    };

    
    const id = await this.stocksService.addStock(newStock);
    this.stockTransfers[transfer].stockId = id ;

    // Update transfer status to 'transferred'
    if (transfer >= 0) {
      this.stockTransfers[transfer].status = 'transferred';
    }
    localStorage.setItem('stockTransfers', JSON.stringify(this.stockTransfers));
  }

  async getTransfers(): Promise<StockTransfer[]> {
    const storedTransfers = localStorage.getItem('stockTransfers');
    if (storedTransfers) {
      this.stockTransfers = JSON.parse(storedTransfers) as StockTransfer[];
    }
    return this.stockTransfers;
  }
}
