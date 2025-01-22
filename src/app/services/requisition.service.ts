import { Injectable } from '@angular/core';
import { z } from 'zod';
import { ItemClassificationService } from './item-classification.service';

/** 
 * Zod schema for a Requisition.
 */
export const requisitionSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().max(500).optional(),
  status: z.enum(['Pending', 'Approved', 'Rejected']),
  classifiedItemId: z.string().length(32, "Classified Item ID is required")
});

// TypeScript type for usage in your code
export type Requisition = z.infer<typeof requisitionSchema>;

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {
  private readonly STORAGE_KEY = 'requisitions';
  private requisitions: Requisition[] = [];

  constructor(private itemClassificationService: ItemClassificationService) {
    this.loadFromLocalStorage();
    // If empty, optionally load some dummy data for testing
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
        classifiedItemId: 'dummyClassifiedItemId1'
      },
      {
        id: this.generate32CharId(),
        title: 'Electronics Request',
        description: 'Request for new laptops.',
        status: 'Approved',
        classifiedItemId: 'dummyClassifiedItemId2'
      }
    ];
    this.requisitions = dummy;
    this.saveToLocalStorage();
  }

  // ================================
  // CRUD Methods
  // ================================
  async getAllRequisitions(): Promise<Requisition[]> {
    return this.requisitions;
  }

  async addRequisition(data: Omit<Requisition, 'id'>): Promise<void> {
    // Validate with Zod
    const newRequisition: Requisition = {
      ...data,
      id: this.generate32CharId()
    };
    requisitionSchema.parse(newRequisition);

    this.requisitions.push(newRequisition);
    this.saveToLocalStorage();
  }

  async updateRequisition(requisition: Requisition): Promise<void> {
    // Validate
    requisitionSchema.parse(requisition);
    const index = this.requisitions.findIndex(r => r.id === requisition.id);
    if (index === -1) {
      throw new Error('Requisition not found');
    }
    this.requisitions[index] = requisition;
    this.saveToLocalStorage();
  }

  async deleteRequisition(id: string): Promise<void> {
    this.requisitions = this.requisitions.filter(r => r.id !== id);
    this.saveToLocalStorage();
  }

  async getRequisitionById(id: string): Promise<Requisition | undefined> {
    return this.requisitions.find(r => r.id === id);
  }
}