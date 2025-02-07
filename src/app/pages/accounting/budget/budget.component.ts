import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BudgetService, BudgetAllocation } from 'src/app/services/budget.service';
import { UserService, User } from 'src/app/services/user.service';
import { finalize } from 'rxjs/operators';
import { Table, TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { Dialog, DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Button, ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ButtonGroupModule } from 'primeng/buttongroup';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  providers: [MessageService, ConfirmationService],
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, ButtonGroupModule, InputTextModule, DropdownModule, DialogModule, Dialog, ToastModule, ButtonModule, TableModule, TagModule, InputNumberModule ],
})
export class BudgetComponent implements OnInit {
  budgetAllocations: BudgetAllocation[] = [];
  users: User[] = [];
  budgetForm!: FormGroup;
  budgetDialog = false;
  submitted = false;
  loading = false;
  isEditMode = false;
  selectedYear = new Date().getFullYear();
  currentBudgetId: string | null = null;
 years: number[] = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  statuses = [
    { label: 'Draft', value: 'draft' },
    { label: 'Pending Approval', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private budgetService: BudgetService,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUsers();
    this.loadBudgetAllocations();
  }

  initializeForm(): void {
  this.budgetForm = this.formBuilder.group({
    userId: ['', Validators.required], 
    fiscalYear: [this.selectedYear, Validators.required],
    totalBudget: [0, [Validators.required, Validators.min(0)]],
    allocatedAmount: [0, [Validators.required, Validators.min(0)]]
  });
}

  loadUsers(): void {
  this.userService.getAllUsers().subscribe(users => {
    this.users = users.filter(user => user.role === 'end-user');
    console.log('Loaded Users:', this.users); // Debugging log
  });
}


  loadBudgetAllocations(): void {
    this.loading = true;
    this.budgetService.getAllBudgetAllocations()
      .pipe(finalize(() => this.loading = false))
      .subscribe(allocations => this.budgetAllocations = allocations);
  }

  openNewBudgetDialog(): void {
    this.budgetForm.reset({
      fiscalYear: this.selectedYear,
      totalBudget: 0,
      allocatedAmount: 0,
      status: 'draft'
    });
    this.isEditMode = false;
    this.currentBudgetId = null;
    this.budgetDialog = true;
  }

  

   generateId(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}


saveBudget(): void {
  this.submitted = true;

  if (this.budgetForm.invalid) {
    console.log('Invalid Form:', this.budgetForm.value);
    return;
  }

  console.log('Saving Budget:', this.budgetForm.value);

  const formValue = this.budgetForm.value;

  // Ensure allocated amount doesn't exceed total budget
  if (formValue.allocatedAmount > formValue.totalBudget) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Allocated amount cannot exceed total budget'
    });
    return;
  }

  const budgetData: BudgetAllocation = {
    id: this.isEditMode && this.currentBudgetId ? this.currentBudgetId : this.generateId(),
    userId: formValue.userId,
    fiscalYear: formValue.fiscalYear,
    totalBudget: formValue.totalBudget,
    allocatedAmount: formValue.allocatedAmount,
    remainingBalance: formValue.totalBudget - formValue.allocatedAmount
  };

  this.loading = true;

  if (this.isEditMode && this.currentBudgetId) {
    this.budgetService.updateBudgetAllocation(this.currentBudgetId, budgetData)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Budget updated successfully'
        });
        this.loadBudgetAllocations();
        this.hideDialog();
      });
  } else {
    this.budgetService.addBudgetAllocation(budgetData)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Budget added successfully'
        });
        this.loadBudgetAllocations();
        this.hideDialog();
      });
  }
}


  getUserName(userId: string): string {
    return this.users.find(user => user.id === userId)?.fullname || 'Unknown User';
  }

  getStatusSeverity(status: string): 'success' | 'danger' | 'warn' | 'info' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'pending': return 'warn';
      default: return 'info';
    }
  }

  editBudget(budget: BudgetAllocation): void {
    this.currentBudgetId = budget.id ?? null;
    this.budgetForm.patchValue({
      userId: budget.userId,
      fiscalYear: budget.fiscalYear,
      totalBudget: budget.totalBudget,
      allocatedAmount: budget.allocatedAmount
    });
    this.isEditMode = true;
    this.budgetDialog = true;
}

deleteBudget(budget: BudgetAllocation): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this budget allocation?',
      accept: () => {
        this.loading = true;
        this.budgetService.deleteBudgetAllocation(budget.id!)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Budget deleted successfully'
              });
              this.loadBudgetAllocations();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to delete budget'
              });
            }
          });
      }
    });
}


  onYearChange(year: number): void {
    this.selectedYear = year;
    this.loadBudgetAllocations();
  }

  hideDialog(): void {
    this.budgetDialog = false;
    this.submitted = false;
    this.currentBudgetId = null;
  }
}
