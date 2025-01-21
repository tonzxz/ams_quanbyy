import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar'; // Import CalendarModule
import { MaterialModule } from 'src/app/material.module';
import { BudgetService, BudgetAllocation } from 'src/app/services/budget.service';
import { DepartmentService, Department } from 'src/app/services/departments.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    DropdownModule,
    ToastModule,
    TagModule,
    ConfirmDialogModule,
    InputTextModule,
    CalendarModule // Add CalendarModule to imports
  ],
  templateUrl: './budget.component.html',
  providers: [MessageService, ConfirmationService]
})
export class BudgetComponent implements OnInit {
  budgetAllocations: BudgetAllocation[] = [];
  departments: any[] = [];
  budgetForm!: FormGroup;
  budgetDialog = false;
  submitted = false;
  loading = false;
  isEditMode = false;
  currentYear = new Date().getFullYear();
  years: number[] = [];
  selectedYear = this.currentYear;
  currentBudgetId: string | null = null;

  statuses = [
    { label: 'Draft', value: 'draft' },
    { label: 'Pending Approval', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private budgetService: BudgetService,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    for (let i = -5; i <= 5; i++) {
      this.years.push(this.currentYear + i);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadDepartments();
    this.loadBudgetAllocations();
  }

 initializeForm(): void {
  this.budgetForm = this.formBuilder.group({
    departmentId: ['', Validators.required],
    fiscalYear: [this.currentYear, Validators.required],
    totalBudget: [0, [Validators.required, Validators.min(0)]],
    allocatedAmount: [0, [Validators.required, Validators.min(0)]],
    status: ['draft', Validators.required],
    approvedBy: [''],
    approvedAt: [null]
  });
}

  loadDepartments(): void {
    this.departmentService.getAllDepartments().then(departments => {
      this.departments = departments;
    });
  }

  loadBudgetAllocations(): void {
    this.loading = true;
    this.budgetService.getBudgetAllocationsByYear(this.selectedYear)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (allocations) => {
          this.budgetAllocations = allocations;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load budget allocations'
          });
        }
      });
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.loadBudgetAllocations();
  }

  getDepartmentName(departmentId: string): string {
    return this.departments.find(d => d.id === departmentId)?.name || 'Unknown Department';
  }

  getStatusSeverity(status: string): 'success' | 'danger' | 'warn' | 'info' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'pending': return 'warn';
      default: return 'info';
    }
  }

  openNewBudgetDialog(): void {
    this.budgetForm.reset({
      fiscalYear: this.currentYear,
      totalBudget: 0,
      allocatedAmount: 0,
      remainingBalance: 0,
      status: 'draft',
      remarks: '',
      approvedBy: '',
      approvedAt: null
    });
    this.isEditMode = false;
    this.currentBudgetId = null;
    this.budgetDialog = true;
  }

  editBudget(budget: BudgetAllocation): void {
    this.currentBudgetId = budget.id ?? null;
    this.budgetForm.patchValue({
      departmentId: budget.departmentId,
      fiscalYear: budget.fiscalYear,
      totalBudget: budget.totalBudget,
      allocatedAmount: budget.allocatedAmount,
      remainingBalance: budget.remainingBalance,
      status: budget.status,
      remarks: budget.remarks,
      approvedBy: budget.approvedBy,
      approvedAt: budget.approvedAt
    });
    this.isEditMode = true;
    this.budgetDialog = true;
  }

  saveBudget(): void {
  this.submitted = true;
  if (this.budgetForm.invalid) {
    return;
  }

  const formValue = this.budgetForm.value;

  // Auto-generate remainingBalance
  const remainingBalance = formValue.totalBudget - formValue.allocatedAmount;

  const budgetData = {
    ...formValue,
    remainingBalance: remainingBalance // Auto-generated remaining balance
  };

  this.loading = true;

  if (this.isEditMode && this.currentBudgetId) {
    this.budgetService.updateBudgetAllocation(this.currentBudgetId, budgetData)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Budget updated successfully'
          });
          this.loadBudgetAllocations();
          this.hideDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to update budget'
          });
        }
      });
  } else {
    this.budgetService.addBudgetAllocation(budgetData)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Budget added successfully'
          });
          this.loadBudgetAllocations();
          this.hideDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to add budget'
          });
        }
      });
  }
}

  deleteBudget(budget: BudgetAllocation): void {
    if (budget.status === 'approved') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Approved budgets cannot be deleted'
      });
      return;
    }

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

  hideDialog(): void {
    this.budgetDialog = false;
    this.submitted = false;
    this.currentBudgetId = null;
  }
}