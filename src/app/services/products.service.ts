// src/app/services/products.service.ts

import { Injectable } from '@angular/core';
import { z } from 'zod';

// Define the product schema using Zod
export const productSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  price: z.number().min(0, "Price must be a positive number"),
  quantity: z.number().int().min(0, "Quantity must be a non-negative integer"),
  dateAdded: z.date().optional(),
  category: z.string().min(1, "Category is required"),
});

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
    const localProducts = localStorage.getItem('products');
    if (localProducts) {
      this.productData = JSON.parse(localProducts) as Product[];
    }
    return this.productData;
  }

  // Fetch products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(product => product.category === category);
  }

  // Add a new product
  async addProduct(product: Omit<Product, 'id'>): Promise<void> {
    const id = this.generate32CharId();
    const newProduct: Product = {
      id,
      ...product,
      dateAdded: new Date(),
    };
    productSchema.parse(newProduct); // Validate the product
    this.productData.push(newProduct);
    localStorage.setItem('products', JSON.stringify(this.productData));
  }

  // Edit an existing product
  async editProduct(product: Product): Promise<void> {
    const productIndex = this.productData.findIndex((item) => item.id === product.id);
    if (productIndex > -1) {
      productSchema.parse(product); // Validate the product
      this.productData[productIndex] = product;
      localStorage.setItem('products', JSON.stringify(this.productData));
    } else {
      throw new Error('Product not found');
    }
  }

  // Delete a product by ID
  async deleteProduct(id: string): Promise<void> {
    this.productData = this.productData.filter((item) => item.id !== id);
    localStorage.setItem('products', JSON.stringify(this.productData));
  }

  // Reset products to initial dummy data
  async resetProducts(): Promise<void> {
    localStorage.removeItem('products');
    this.productData = [
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
  }

  // Helper method to generate a 32-character ID
  private generate32CharId(): string {
    return Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}