import { Injectable } from '@angular/core';

import { z } from 'zod';

export const stockSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(), 
  dr_id: z.string().length(10, 'Receipt  ID is required'),  
  storage_id: z.string().min(1, 'Storage  ID is required').optional(),  
  storage_name: z.string().min(1, 'Storage name is required').optional(),  
  product_id: z.string().min(1, 'Product  ID is required').optional(),  
  product_name: z.string().min(1, 'Product name is required').optional(),  
  name: z.string().min(1, "Name is required"), // Ensuring the name is not empty
  ticker: z.string().min(1, "Ticker symbol is required"), // Ticker symbol of the stock (e.g., "AAPL")
  price: z.number().min(0, "Price must be a positive number"), // Positive number for stock price
  quantity: z.number().int().min(0, "Quantity must be a non-negative integer"), // Non-negative integer for quantity
  dateAdded: z.date().optional(), // Optional date of stock addition
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(), // Optional stock description
  qrs: z.array(z.string()).optional(),
  status:z.enum(['pending','delivered']).optional(),
});

export type Stock = z.infer<typeof stockSchema>;


@Injectable({
  providedIn: 'root'
})
export class StocksService {
  private stockData: Stock[] = [
    {
      id: '12345678901234567890123456789012',  // 32 characters ID
      name: 'Tesla Inc.',
      ticker: 'TSLA',
      price: 800.25,
      quantity: 10,
      dateAdded: new Date('2023-06-15'),
      description: 'Electric vehicle manufacturer.',
      dr_id: 'REC0012351',  // Linked to the stocked and verified receipt for Emily White
    },
    {
      id: '98765432109876543210987654321098',  // 32 characters ID
      name: 'Apple Inc.',
      ticker: 'AAPL',
      price: 145.30,
      quantity: 50,
      dateAdded: new Date('2022-11-30'),
      description: 'Technology company, creator of iPhones.',
      dr_id: 'REC0012351',  // Linked to the stocked and verified receipt for Emily White
    },
    {
      id: 'abcdefabcdefabcdefabcdefabcdefabcd',  // 32 characters ID
      name: 'Amazon',
      ticker: 'AMZN',
      price: 3350.15,
      quantity: 5,
      dateAdded: new Date('2023-01-10'),
      description: 'E-commerce giant, AWS, and more.',
      dr_id: 'REC0012351',  // Linked to the stocked and verified receipt for David Clark
    },
    {
      id: '23456789012345678901234567890123',  // 32 characters ID
      name: 'Microsoft Corp.',
      ticker: 'MSFT',
      price: 290.50,
      quantity: 20,
      dateAdded: new Date('2023-05-22'),
      description: 'Technology company, developer of Windows OS.',
      dr_id: 'REC0012350',  // Linked to the stocked and verified receipt for David Clark
    },
    {
      id: '34567890123456789012345678901234',  // 32 characters ID
      name: 'NVIDIA Corporation',
      ticker: 'NVDA',
      price: 880.75,
      quantity: 15,
      dateAdded: new Date('2022-12-10'),
      description: 'Graphics card and AI hardware leader.',
      dr_id: 'REC0012350',  // Linked to the stocked and verified receipt for David Clark
    },
    {
      id: '45678901234567890123456789012345',  // 32 characters ID
      name: 'Alphabet Inc.',
      ticker: 'GOOGL',
      price: 2750.60,
      quantity: 8,
      dateAdded: new Date('2023-04-10'),
      description: 'Google parent company, focuses on AI, advertising.',
      dr_id: 'REC0012350',  // Linked to the stocked and verified receipt for Emily White
    },
    {
      id: '56789012345678901234567890123456',  // 32 characters ID
      name: 'Meta Platforms',
      ticker: 'META',
      price: 320.90,
      quantity: 25,
      dateAdded: new Date('2023-07-14'),
      description: 'Social media giant, owner of Facebook and Instagram.',
      dr_id: 'REC0012351',  // Linked to the stocked and verified receipt for Emily White
    },
    {
      id: '67890123456789012345678901234567',  // 32 characters ID
      name: 'Netflix Inc.',
      ticker: 'NFLX',
      price: 500.35,
      quantity: 12,
      dateAdded: new Date('2022-09-01'),
      description: 'Streaming service for movies and TV shows.',
      dr_id: 'REC0012350',  // Linked to the stocked and verified receipt for David Clark
    }
  ];
  
  constructor() { }

  async getAll():Promise<Stock[]>{
    const local_stocks = localStorage.getItem('stocks');
    if(local_stocks){
      this.stockData =  JSON.parse(local_stocks) as Stock[];
    }
    return this.stockData;
  }

  async addStock(stock:Stock){
    const id = (Math.random().toString(36) + Math.random().toString(36) + Date.now().toString(36)).substring(2, 34);
    this.stockData.push({
      id: id,
      ...stock
    });
    localStorage.setItem('stocks', JSON.stringify(this.stockData));
  }
  async editStock(stock:Stock){
    const stockIndex = this.stockData.findIndex(item=>item.id == stock.id);
    this.stockData[stockIndex] = stock;
    localStorage.setItem('stocks', JSON.stringify(this.stockData));
  }

  async deleteStock(id:string){
    this.stockData = this.stockData.filter(item => item.id != id);
    localStorage.setItem('stocks', JSON.stringify(this.stockData));
  }
}
