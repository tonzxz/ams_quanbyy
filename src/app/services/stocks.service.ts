import { Injectable } from '@angular/core';
import { z } from 'zod';

export const stockSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  dr_id: z.string().length(10, 'Receipt ID is required').optional(),
  storage_id: z.string().min(1, 'Storage ID is required').optional(),
  storage_name: z.string().min(1, 'Storage name is required').optional(),
  product_id: z.string().min(1, 'Product ID is required').optional(),
  product_name: z.string().min(1, 'Product name is required').optional(),
  name: z.string().min(1, "Name is required"),
  ticker: z.string().min(1, "Ticker symbol is required"),
  price: z.number().min(0, "Price must be a positive number"),
  quantity: z.number().int().min(0, "Quantity must be a non-negative integer"),
  dateAdded: z.date().optional(),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  qrs: z.array(z.string()).optional(),
  status: z.enum(['pending', 'delivered', 'Approved', 'Rejected', 'Pending']).optional(),
});

export type Stock = z.infer<typeof stockSchema>;

interface DeliveryRequest {
  id: string;
  stockId: string;
  quantity: number;
  deliveryAddress: string;
  requestedDate: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

interface ReturnRequest {
  id: string;
  stockId: string;
  quantity: number;
  returnDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface FixedAssetRequest {
  id: string;
  assetId: string;
  transferTo: string;
  transferDate: Date;
  status: 'pending' | 'completed';
}

interface StockTransferRequest {
  id: string;
  fromStockId: string;
  toStockId: string;
  quantity: number;
  transferDate: Date;
  status: 'pending' | 'completed';
}

interface SuppliesIssuanceRequest {
  id: string;
  stockId: string;
  quantity: number;
  issuedDate: Date;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface DeliveryAddress {
  id: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PropertyBorrowingRequest {
  id: string;
  assetId: string;
  borrower: string;
  borrowDate: Date;
  returnDate: Date | null;
  status: 'pending' | 'approved' | 'returned';
}

@Injectable({
  providedIn: 'root',
})
export class StocksService {
  private stockData: Stock[] = [
    {
      id: '12345678901234567890123456789012',
      name: 'Tesla Inc.',
      ticker: 'TSLA',
      price: 800.25,
      quantity: 10,
      dateAdded: new Date('2023-06-15'),
      description: 'Electric vehicle manufacturer.',
      dr_id: 'REC0012351',
    },
    {
      id: '98765432109876543210987654321098',
      name: 'Apple Inc.',
      ticker: 'AAPL',
      price: 145.30,
      quantity: 50,
      dateAdded: new Date('2022-11-30'),
      description: 'Technology company, creator of iPhones.',
      dr_id: 'REC0012351',
    },
    // Add the rest of the existing stocks here...
  ];
  private deliveryRequests: DeliveryRequest[] = [];
  private returnRequests: ReturnRequest[] = [];
  private fixedAssetRequests: FixedAssetRequest[] = [];
  private stockTransferRequests: StockTransferRequest[] = [];
  private suppliesIssuanceRequests: SuppliesIssuanceRequest[] = [];
  private deliveryAddresses: DeliveryAddress[] = [];
  private propertyBorrowingRequests: PropertyBorrowingRequest[] = [];

  constructor() {}

  async getAll(): Promise<Stock[]> {
    const local_stocks = localStorage.getItem('stocks');
    if (local_stocks) {
      this.stockData = JSON.parse(local_stocks) as Stock[];
    }
    return this.stockData;
  }

  async addStock(stock: Stock): Promise<string> {
    const id = (Math.random().toString(36) + Math.random().toString(36) + Date.now().toString(36)).substring(2, 34);
    this.stockData.push({ ...stock, id });
    localStorage.setItem('stocks', JSON.stringify(this.stockData));
    return id;
  }

  async editStock(stock: Stock): Promise<void> {
    const stockIndex = this.stockData.findIndex((item) => item.id === stock.id);
    this.stockData[stockIndex] = stock;
    localStorage.setItem('stocks', JSON.stringify(this.stockData));
  }

  async deleteStock(id: string): Promise<void> {
    this.stockData = this.stockData.filter((item) => item.id !== id);
    localStorage.setItem('stocks', JSON.stringify(this.stockData));
  }

  // New Methods

  async getInventoryCount(): Promise<{ name: string; ticker: string; quantity: number }[]> {
    return this.stockData.map((stock) => ({
      name: stock.name,
      ticker: stock.ticker,
      quantity: stock.quantity,
    }));
  }

  async createDeliveryRequest(stockId: string, quantity: number, deliveryAddress: string): Promise<DeliveryRequest> {
    const newRequest: DeliveryRequest = {
      id: (Math.random().toString(36) + Date.now().toString(36)).substring(2, 16),
      stockId,
      quantity,
      deliveryAddress,
      requestedDate: new Date(),
      status: 'pending',
    };
    this.deliveryRequests.push(newRequest);
    return newRequest;
  }

  async createReturnRequest(stockId: string, quantity: number, reason: string): Promise<ReturnRequest> {
    const newRequest: ReturnRequest = {
      id: (Math.random().toString(36) + Date.now().toString(36)).substring(2, 16),
      stockId,
      quantity,
      returnDate: new Date(),
      reason,
      status: 'pending',
    };
    this.returnRequests.push(newRequest);
    return newRequest;
  }

  async createFixedAssetRequest(assetId: string, transferTo: string): Promise<FixedAssetRequest> {
    const newRequest: FixedAssetRequest = {
      id: (Math.random().toString(36) + Date.now().toString(36)).substring(2, 16),
      assetId,
      transferTo,
      transferDate: new Date(),
      status: 'pending',
    };
    this.fixedAssetRequests.push(newRequest);
    return newRequest;
  }

  async createStockTransferRequest(fromStockId: string, toStockId: string, quantity: number): Promise<StockTransferRequest> {
    const newRequest: StockTransferRequest = {
      id: (Math.random().toString(36) + Date.now().toString(36)).substring(2, 16),
      fromStockId,
      toStockId,
      quantity,
      transferDate: new Date(),
      status: 'pending',
    };
    this.stockTransferRequests.push(newRequest);
    return newRequest;
  }

  async createSuppliesIssuanceRequest(stockId: string, quantity: number, purpose: string): Promise<SuppliesIssuanceRequest> {
    const newRequest: SuppliesIssuanceRequest = {
      id: (Math.random().toString(36) + Date.now().toString(36)).substring(2, 16),
      stockId,
      quantity,
      issuedDate: new Date(),
      purpose,
      status: 'pending',
    };
    this.suppliesIssuanceRequests.push(newRequest);
    return newRequest;
  }

  async generateDeliveryAddress(address: DeliveryAddress): Promise<DeliveryAddress> {
    const newAddress: DeliveryAddress = { ...address, id: (Math.random().toString(36) + Date.now().toString(36)).substring(2, 16) };
    this.deliveryAddresses.push(newAddress);
    return newAddress;
  }

  async createPropertyBorrowingRequest(assetId: string, borrower: string): Promise<PropertyBorrowingRequest> {
    const newRequest: PropertyBorrowingRequest = {
      id: (Math.random().toString(36) + Date.now().toString(36)).substring(2, 16),
      assetId,
      borrower,
      borrowDate: new Date(),
      returnDate: null,
      status: 'pending',
    };
    this.propertyBorrowingRequests.push(newRequest);
    return newRequest;
  }
}
