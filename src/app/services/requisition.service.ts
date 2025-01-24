import { Injectable } from '@angular/core';
import { z } from 'zod';
import { GroupService } from './group.service';

/**
 * Zod schema for a Requisition.
 */
export const requisitionSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().max(500).optional(),
  status: z.enum(['Pending', 'Approved', 'Rejected']),
  classifiedItemId: z.string().length(32, "Classified Item ID is required"),
  group: z.string().min(1, "Group is required"),
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      specifications: z.string().optional(),
      price: z.number().min(0, "Price cannot be negative"),
    })
  ),
  signature: z.string().optional(), // Base64 image string for signature
});

// TypeScript type for usage in your code
export type Requisition = z.infer<typeof requisitionSchema>;

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {
  private readonly STORAGE_KEY = 'requisitions';
  private requisitions: Requisition[] = [];

  constructor(private groupService: GroupService) {
    this.loadFromLocalStorage();
    if (!this.requisitions.length) {
      this.loadDummyData();
    }
  }

  // Load from localStorage
  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.requisitions = JSON.parse(stored);
    }
  }

  // Save to localStorage
  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.requisitions));
  }

  // Generate a random 32-character hex ID
  private generate32CharId(): string {
    return Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  // Load some dummy data (optional)
  

  private loadDummyData(): void {
  const dummy: Requisition[] = [
    {
      id: this.generate32CharId(),
      title: 'Office Supplies Request',
      description: 'Request for stationery items.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId1',
      group: '12345678901234567890123456789012',
      products: [
        { id: '12345678901234567890123456789012', name: 'Pen', quantity: 10, price: 10, specifications: 'Blue ink' },
        { id: '23456789012345678901234567890123', name: 'Notebook', quantity: 5, price: 50, specifications: 'A5 size' },
      ],
      signature: undefined, // Use undefined instead of null
    },
    {
      id: this.generate32CharId(),
      title: 'Electronics Request',
      description: 'Request for new laptops.',
      status: 'Approved',
      classifiedItemId: 'dummyClassifiedItemId2',
      group: '23456789012345678901234567890123',
      products: [
        { id: '34567890123456789012345678901234', name: 'Laptop', quantity: 2, price: 50000, specifications: '16GB RAM, 512GB SSD' },
      ],
      signature: undefined, // Use undefined instead of null
    }
  ];
  this.requisitions = dummy;
  this.saveToLocalStorage();
}


  // ================================
  // CRUD Methods
  // ================================

  /**
   * Fetch all requisitions.
   */
  async getAllRequisitions(): Promise<Requisition[]> {
    return this.requisitions;
  }

  /**
   * Fetch all pending requisitions.
   */
  async getPendingRequisitions(): Promise<Requisition[]> {
    return this.requisitions.filter((req) => req.status === 'Pending');
  }

  /**
   * Add a new requisition.
   * @param data - The requisition data (without ID).
   */
  async addRequisition(data: Omit<Requisition, 'id'>): Promise<void> {
    const newRequisition: Requisition = {
      ...data,
      id: this.generate32CharId(),
    };
    requisitionSchema.parse(newRequisition);

    this.requisitions.push(newRequisition);
    this.saveToLocalStorage();
  }

  /**
   * Update an existing requisition.
   * @param requisition - The requisition to update.
   */
  async updateRequisition(requisition: Requisition): Promise<void> {
    requisitionSchema.parse(requisition);
    const index = this.requisitions.findIndex((r) => r.id === requisition.id);
    if (index === -1) {
      throw new Error('Requisition not found');
    }
    this.requisitions[index] = requisition;
    this.saveToLocalStorage();
  }

  /**
   * Update the status of a requisition with a signature.
   * @param id - The ID of the requisition.
   * @param status - The new status ('Approved' or 'Rejected').
   * @param signature - Base64 string of the signature (optional).
   */
  async updateRequisitionStatusWithSignature(id: string, status: 'Approved' | 'Rejected', signature: string): Promise<void> {
    const requisition = this.requisitions.find((req) => req.id === id);
    if (!requisition) {
      throw new Error('Requisition not found');
    }
    requisition.status = status;
    requisition.signature = signature;
    this.saveToLocalStorage();
  }

  /**
   * Update the status of a requisition.
   * @param id - The ID of the requisition.
   * @param status - The new status ('Approved' or 'Rejected').
   */
  async updateRequisitionStatus(id: string, status: 'Approved' | 'Rejected'): Promise<void> {
    const requisition = this.requisitions.find((req) => req.id === id);
    if (!requisition) {
      throw new Error('Requisition not found');
    }
    requisition.status = status;
    this.saveToLocalStorage();
  }

  /**
   * Delete a requisition by ID.
   * @param id - The ID of the requisition to delete.
   */
  async deleteRequisition(id: string): Promise<void> {
    this.requisitions = this.requisitions.filter((r) => r.id !== id);
    this.saveToLocalStorage();
  }

  /**
   * Fetch a requisition by ID.
   * @param id - The ID of the requisition to fetch.
   */
  async getRequisitionById(id: string): Promise<Requisition | undefined> {
    return this.requisitions.find((r) => r.id === id);
  }
}
