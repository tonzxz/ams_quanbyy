import { Injectable } from '@angular/core';

import { z } from 'zod';

export const stockSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(), 
  dr_id: z.string().length(10, 'Receipt  ID is required').optional(),  
  storage_id: z.string().min(1, 'Storage  ID is required').optional(),  
  storage_name: z.string().min(1, 'Storage name is required').optional(),  
  product_id: z.string().min(1, 'Product  ID is required').optional(),  
  product_name: z.string().min(1, 'Product name is required').optional(),  
  name: z.string().min(1, "Name is required"), 
  ticker: z.string().min(1, "Ticker symbol is required"), 
  price: z.number().min(0, "Price must be a positive number"), 
  quantity: z.number().int().min(0, "Quantity must be a non-negative integer"), 
  dateAdded: z.date().optional(), 
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(), 
  category: z.enum(['semi-expendable', 'expendable']).optional(), 
  qrs: z.array(z.string()).optional(),
  status:z.enum(['pending','delivered','Approved','Rejected','Pending']).optional(),
});

export type Stock = z.infer<typeof stockSchema>;

@Injectable({
  providedIn: 'root'
})
export class StocksService {
  private stockData: Stock[] = [
    {
      id: '12345678901234567890123456789012',
      name: 'HP EliteBook 840 G8',
      ticker: 'LAPTOP001',
      price: 75000.00,
      quantity: 5,
      dateAdded: new Date('2023-06-15'),
      description: '14-inch FHD, Intel Core i7, 16GB RAM, 512GB SSD, Windows 11 Pro.',
      dr_id: 'REC0012351',
    },
    {
      id: '98765432109876543210987654321098',
      name: 'Epson L3110 Printer',
      ticker: 'PRINTER001',
      price: 9500.00,
      quantity: 10,
      dateAdded: new Date('2022-11-30'),
      description: 'All-in-One Ink Tank Printer with Scan and Copy.',
      dr_id: 'REC0012351',
    },
    {
      id: 'abcdefabcdefabcdefabcdefabcdefabcd',
      name: 'Logitech MX Keys Keyboard',
      ticker: 'KEYBOARD001',
      price: 6500.00,
      quantity: 8,
      dateAdded: new Date('2023-01-10'),
      description: 'Wireless backlit keyboard with advanced layout and comfortable typing.',
      dr_id: 'REC0012351',
    },
    {
      id: '23456789012345678901234567890123',
      name: 'Dell OptiPlex 7090 SFF',
      ticker: 'DESKTOP001',
      price: 60000.00,
      quantity: 7,
      dateAdded: new Date('2023-05-22'),
      description: 'Intel Core i5, 16GB RAM, 512GB SSD, Windows 11 Pro.',
      dr_id: 'REC0012350',
    },
    {
      id: '34567890123456789012345678901234',
      name: 'Canon DR-C240 Scanner',
      ticker: 'SCANNER001',
      price: 35000.00,
      quantity: 4,
      dateAdded: new Date('2022-12-10'),
      description: 'High-speed document scanner with duplex scanning capability.',
      dr_id: 'REC0012350',
    },
    {
      id: '45678901234567890123456789012345',
      name: 'Panasonic KX-TS880 Landline Phone',
      ticker: 'PHONE001',
      price: 2500.00,
      quantity: 12,
      dateAdded: new Date('2023-04-10'),
      description: 'Corded telephone with speakerphone and caller ID.',
      dr_id: 'REC0012350',
    },
    {
      id: '56789012345678901234567890123456',
      name: 'Brother DCP-T720DW Printer',
      ticker: 'PRINTER002',
      price: 12000.00,
      quantity: 6,
      dateAdded: new Date('2023-07-14'),
      description: 'Ink tank printer with wireless and auto duplex printing.',
      dr_id: 'REC0012351',
    },
    {
      id: '67890123456789012345678901234567',
      name: 'Lenovo ThinkPad X1 Carbon Gen 9',
      ticker: 'LAPTOP002',
      price: 98000.00,
      quantity: 3,
      dateAdded: new Date('2022-09-01'),
      description: '14-inch UHD, Intel Core i7, 16GB RAM, 1TB SSD, Windows 11 Pro.',
      dr_id: 'REC0012350',
    },
    {
    id: '78901234567890123456789012345678',
    name: 'Apple MacBook Pro 16-inch',
    ticker: 'LAPTOP003',
    price: 150000.00,
    quantity: 2,
    dateAdded: new Date('2023-03-20'),
    description: '16-inch Retina Display, Apple M1 Pro, 16GB RAM, 1TB SSD, macOS Monterey.',
    dr_id: 'REC0012352',
    category: 'semi-expendable',
    status: 'delivered',
  },
  {
    id: '89012345678901234567890123456789',
    name: 'Samsung 49-inch Odyssey G9 Monitor',
    ticker: 'MONITOR001',
    price: 75000.00,
    quantity: 3,
    dateAdded: new Date('2023-02-15'),
    description: 'Dual QHD, 240Hz, 1ms, 1000R Curved Gaming Monitor.',
    dr_id: 'REC0012352',
    category: 'semi-expendable',
    status: 'Approved',
  },
  {
    id: '90123456789012345678901234567890',
    name: 'Logitech MX Master 3 Mouse',
    ticker: 'MOUSE001',
    price: 5500.00,
    quantity: 15,
    dateAdded: new Date('2023-08-01'),
    description: 'Wireless mouse with ergonomic design and customizable buttons.',
    dr_id: 'REC0012353',
    category: 'expendable',
    status: 'pending',
  },
  {
    id: '01234567890123456789012345678901',
    name: 'Microsoft Surface Pro 8',
    ticker: 'TABLET001',
    price: 85000.00,
    quantity: 4,
    dateAdded: new Date('2023-07-25'),
    description: '13-inch touchscreen, Intel Core i5, 8GB RAM, 256GB SSD, Windows 11.',
    dr_id: 'REC0012353',
    category: 'semi-expendable',
    status: 'Rejected',
  },
  {
    id: '12345678901234567890123456789013',
    name: 'Sony WH-1000XM5 Headphones',
    ticker: 'HEADPHONES001',
    price: 22000.00,
    quantity: 9,
    dateAdded: new Date('2023-06-10'),
    description: 'Noise-cancelling wireless headphones with 30-hour battery life.',
    dr_id: 'REC0012354',
    category: 'expendable',
    status: 'delivered',
  },
  {
    id: '23456789012345678901234567890124',
    name: 'Cisco Webex Desk Pro',
    ticker: 'VIDEOCONF001',
    price: 120000.00,
    quantity: 1,
    dateAdded: new Date('2023-05-05'),
    description: 'All-in-one video conferencing device with 4K camera and noise suppression.',
    dr_id: 'REC0012354',
    category: 'semi-expendable',
    status: 'Approved',
  },
  {
    id: '34567890123456789012345678901235',
    name: 'APC Back-UPS Pro 1500',
    ticker: 'UPS001',
    price: 30000.00,
    quantity: 5,
    dateAdded: new Date('2023-04-18'),
    description: '1500VA/900W UPS with surge protection and battery backup.',
    dr_id: 'REC0012355',
    category: 'semi-expendable',
    status: 'pending',
  },
  {
    id: '45678901234567890123456789012346',
    name: 'WD My Book Duo 20TB External Hard Drive',
    ticker: 'STORAGE001',
    price: 45000.00,
    quantity: 7,
    dateAdded: new Date('2023-03-12'),
    description: 'Dual-drive external storage with RAID support and hardware encryption.',
    dr_id: 'REC0012355',
    category: 'semi-expendable',
    status: 'delivered',
  },
  {
    id: '56789012345678901234567890123457',
    name: 'Raspberry Pi 4 Model B',
    ticker: 'SBC001',
    price: 5000.00,
    quantity: 20,
    dateAdded: new Date('2023-02-28'),
    description: '2GB RAM, 1.5GHz quad-core CPU, dual-band Wi-Fi, Bluetooth 5.0.',
    dr_id: 'REC0012356',
    category: 'expendable',
    status: 'Approved',
  },
  {
    id: '67890123456789012345678901234568',
    name: 'DJI Mavic Air 2 Drone',
    ticker: 'DRONE001',
    price: 80000.00,
    quantity: 2,
    dateAdded: new Date('2023-01-15'),
    description: '4K camera drone with 34-minute flight time and 10km HD video transmission.',
    dr_id: 'REC0012356',
    category: 'semi-expendable',
    status: 'Rejected',
  },
    
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
      ...stock,
      id: id,
    });

    localStorage.setItem('stocks', JSON.stringify(this.stockData));
    return id;
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
