// src/app/services/budget.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { z } from 'zod';
import { DepartmentService } from './departments.service';

export const budgetAllocationSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  departmentId: z.string().length(32, "Department ID is required"),
  fiscalYear: z.number().int().min(2000, "Invalid fiscal year"),
  totalBudget: z.number().min(0, "Budget must be non-negative"),
  allocatedAmount: z.number().min(0, "Allocated amount must be non-negative"),
  remainingBalance: z.number().min(0, "Remaining balance must be non-negative"),
  status: z.enum(['draft', 'pending', 'approved', 'rejected']),
  remarks: z.string().max(500, "Remarks cannot exceed 500 characters").optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  approvedBy: z.string().optional(),
  approvedAt: z.date().optional()
});

export type BudgetAllocation = z.infer<typeof budgetAllocationSchema>;

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private budgetAllocations: BudgetAllocation[] = [];
  private readonly BUDGET_STORAGE_KEY = 'budget_allocations';

  constructor(private departmentService: DepartmentService) {
    this.loadFromStorage();
    if (!this.budgetAllocations.length) {
      this.initializeDummyData();
      this.saveToStorage();
    }
  }

  private generateId(): string {
    return Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.BUDGET_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      this.budgetAllocations = parsed.map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        approvedAt: item.approvedAt ? new Date(item.approvedAt) : null
      }));
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.BUDGET_STORAGE_KEY, JSON.stringify(this.budgetAllocations));
  }

 
  private initializeDummyData(): void {
  const dummyBudgets: BudgetAllocation[] = [
    {
      id: '550e8400e29b41d4a716446655440000',
      departmentId: '550e8400e29b41d4a716446655440000',
      fiscalYear: 2025,
      totalBudget: 5000000,
      allocatedAmount: 3000000,
      remainingBalance: 2000000,
      status: 'approved',
      remarks: 'Budget approved for department',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '550e8400e29b41d4a716446655440001',
      departmentId: '550e8400e29b41d4a716446655440001',
      fiscalYear: 2025,
      totalBudget: 3000000,
      allocatedAmount: 1500000,
      remainingBalance: 1500000,
      status: 'pending',
      remarks: 'Awaiting approval',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '550e8400e29b41d4a716446655440002',
      departmentId: '550e8400e29b41d4a716446655440002',
      fiscalYear: 2025,
      totalBudget: 4000000,
      allocatedAmount: 2500000,
      remainingBalance: 1500000,
      status: 'draft',
      remarks: 'Draft budget submitted',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '550e8400e29b41d4a716446655440003',
      departmentId: '550e8400e29b41d4a716446655440003',
      fiscalYear: 2025,
      totalBudget: 3500000,
      allocatedAmount: 3000000,
      remainingBalance: 500000,
      status: 'rejected',
            remarks: 'Budget rejected due to inconsistencies',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '550e8400e29b41d4a716446655440004',
      departmentId: '550e8400e29b41d4a716446655440004',
      fiscalYear: 2025,
      totalBudget: 4500000,
      allocatedAmount: 2000000,
      remainingBalance: 2500000,
      status: 'approved',
      remarks: 'Approved for the agriculture department',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '550e8400e29b41d4a716446655440005',
      departmentId: '550e8400e29b41d4a716446655440005',
      fiscalYear: 2025,
      totalBudget: 6000000,
      allocatedAmount: 5000000,
      remainingBalance: 1000000,
      status: 'approved',
      remarks: 'Nursing department budget allocation',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '550e8400e29b41d4a716446655440006',
      departmentId: '550e8400e29b41d4a716446655440006',
      fiscalYear: 2025,
      totalBudget: 2500000,
      allocatedAmount: 1000000,
      remainingBalance: 1500000,
      status: 'draft',
      remarks: 'Arts and Sciences budget draft',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '550e8400e29b41d4a716446655440007',
      departmentId: '550e8400e29b41d4a716446655440007',
      fiscalYear: 2025,
      totalBudget: 3200000,
      allocatedAmount: 1500000,
      remainingBalance: 1700000,
      status: 'pending',
      remarks: 'Pending review for Criminal Justice budget',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Assign dummy budgets to the service's budgetAllocations array.
  this.budgetAllocations = dummyBudgets;
  this.saveToStorage();
}


  getAllBudgetAllocations(): Observable<BudgetAllocation[]> {
    return of(this.budgetAllocations);
  }

  getBudgetAllocationsByDepartment(departmentId: string): Observable<BudgetAllocation[]> {
    return of(this.budgetAllocations.filter(b => b.departmentId === departmentId));
  }

  getBudgetAllocationsByYear(year: number): Observable<BudgetAllocation[]> {
    return of(this.budgetAllocations.filter(b => b.fiscalYear === year));
  }

  addBudgetAllocation(allocation: Omit<BudgetAllocation, 'id' | 'createdAt' | 'updatedAt'>): Observable<BudgetAllocation> {
    try {
      const newAllocation: BudgetAllocation = {
        ...allocation,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      budgetAllocationSchema.parse(newAllocation);
      this.budgetAllocations.push(newAllocation);
      this.saveToStorage();

      return of(newAllocation);
    } catch (error) {
      return throwError(() => error);
    }
  }

  updateBudgetAllocation(id: string, update: Partial<BudgetAllocation>): Observable<BudgetAllocation> {
    try {
      const index = this.budgetAllocations.findIndex(b => b.id === id);
      if (index === -1) {
        return throwError(() => new Error('Budget allocation not found'));
      }

      const updatedAllocation: BudgetAllocation = {
        ...this.budgetAllocations[index],
        ...update,
        updatedAt: new Date()
      };

      budgetAllocationSchema.parse(updatedAllocation);
      this.budgetAllocations[index] = updatedAllocation;
      this.saveToStorage();

      return of(updatedAllocation);
    } catch (error) {
      return throwError(() => error);
    }
  }

  approveBudgetAllocation(id: string, approverName: string): Observable<BudgetAllocation> {
    return this.updateBudgetAllocation(id, {
      status: 'approved',
      approvedBy: approverName,
      approvedAt: new Date()
    });
  }

  rejectBudgetAllocation(id: string, remarks: string): Observable<BudgetAllocation> {
    return this.updateBudgetAllocation(id, {
      status: 'rejected',
      remarks
    });
  }

  deleteBudgetAllocation(id: string): Observable<boolean> {
    const index = this.budgetAllocations.findIndex(b => b.id === id);
    if (index === -1) {
      return throwError(() => new Error('Budget allocation not found'));
    }

    this.budgetAllocations.splice(index, 1);
    this.saveToStorage();
    return of(true);
  }
}
