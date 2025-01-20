import { Injectable } from '@angular/core';
import { z } from 'zod';

// Define the product schema using Zod
export const productSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  name: z.string().min(1, "Product name is required"), // Product name
  sku: z.string().min(1, "SKU is required"), // SKU (Stock Keeping Unit)
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(), // Optional description
  price: z.number().min(0, "Price must be a positive number"), // Positive price
  quantity: z.number().int().min(0, "Quantity must be a non-negative integer"), // Non-negative integer quantity
  dateAdded: z.date().optional(), // Optional date when the product was added
  category: z.string().min(1, "Category is required"), // Product category
});

// TypeScript type inferred from the Zod schema
export type Product = z.infer<typeof productSchema>;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productData: Product[] = [
    {
      id: '12345678901234567890123456789012',
      name: 'Wireless Mouse',
      sku: 'MOUSE001',
      description: 'Ergonomic wireless mouse with adjustable DPI settings.',
      price: 25.99,
      quantity: 100,
      dateAdded: new Date('2023-06-15'),
      category: 'Electronics',
    },
    {
      id: '23456789012345678901234567890123',
      name: 'Gaming Keyboard',
      sku: 'KEYBOARD001',
      description: 'Mechanical keyboard with RGB lighting and custom keys.',
      price: 75.49,
      quantity: 50,
      dateAdded: new Date('2023-05-10'),
      category: 'Electronics',
    },
    {
      id: '34567890123456789012345678901234',
      name: 'Office Chair',
      sku: 'CHAIR001',
      description: 'Comfortable office chair with adjustable height and lumbar support.',
      price: 120.00,
      quantity: 25,
      dateAdded: new Date('2023-04-05'),
      category: 'Furniture',
    },
    {
      id: '45678901234567890123456789012345',
      name: 'Laptop Stand',
      sku: 'STAND001',
      description: 'Aluminum laptop stand with adjustable angles.',
      price: 30.99,
      quantity: 75,
      dateAdded: new Date('2023-03-20'),
      category: 'Accessories',
    },
    {
      id: '56789012345678901234567890123456',
      name: 'Noise-Cancelling Headphones',
      sku: 'HEADPHONES001',
      description: 'Over-ear noise-cancelling headphones with Bluetooth.',
      price: 199.99,
      quantity: 30,
      dateAdded: new Date('2023-02-15'),
      category: 'Electronics',
    },
    {
      id: '67890123456789012345678901234567',
      name: 'Standing Desk',
      sku: 'DESK001',
      description: 'Height-adjustable standing desk with memory presets.',
      price: 350.00,
      quantity: 20,
      dateAdded: new Date('2023-01-10'),
      category: 'Furniture',
    },
    {
      id: '78901234567890123456789012345678',
      name: 'Smartphone Holder',
      sku: 'HOLDER001',
      description: 'Flexible smartphone holder for desks and beds.',
      price: 15.00,
      quantity: 150,
      dateAdded: new Date('2023-07-01'),
      category: 'Accessories',
    },
  ];

  constructor() {}

  // Fetch all products
  async getAll(): Promise<Product[]> {
    const local_products = localStorage.getItem('products');
    if (local_products) {
      this.productData = JSON.parse(local_products) as Product[];
    }
    return this.productData;
  }

  // Add a new product
  async addProduct(product: Product) {
    const id = (Math.random().toString(36) + Math.random().toString(36) + Date.now().toString(36)).substring(2, 34);
    this.productData.push({
      id: id,
      ...product,
    });
    localStorage.setItem('products', JSON.stringify(this.productData));
  }

  // Edit an existing product
  async editProduct(product: Product) {
    const productIndex = this.productData.findIndex((item) => item.id === product.id);
    if (productIndex > -1) {
      this.productData[productIndex] = product;
      localStorage.setItem('products', JSON.stringify(this.productData));
    }
  }

  // Delete a product by ID
  async deleteProduct(id: string) {
    this.productData = this.productData.filter((item) => item.id !== id);
    localStorage.setItem('products', JSON.stringify(this.productData));
  }

  async resetProducts(): Promise<void> {
  localStorage.removeItem('products');  // Remove just products
  this.productData = [];  // Reset the in-memory array
}

}
