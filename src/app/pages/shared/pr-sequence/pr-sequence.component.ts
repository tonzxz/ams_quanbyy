import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatCard,
  MatCardContent,
  MatCardTitle,
  MatCardSubtitle
} from '@angular/material/card';

// PrimeNG imports
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';

// If using the Lottie animation component (remove if not needed)
import { LottieAnimationComponent } from '../../ui-components/lottie-animation/lottie-animation.component';

export interface PRApprover {
  id: string;
  user_id: string;
  // Must match the 'code' for your role array
  approver_role: 'Department Head' | 'BAC' | 'Budget' | 'Supply Officer' | 'Procurement Officer';
  approval_order: number;
  title: string;
  department?: string;
  can_modify: boolean;
  can_approve: boolean;
  email_notification: boolean;
}

@Component({
  selector: 'app-pr-sequence',
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Angular Material
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,

    // PrimeNG
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    InputSwitchModule,
    ToastModule,

    // Additional PrimeNG modules for iconfield/inputicon/inputgroup
    InputGroupModule,
    IconFieldModule,
    InputIconModule,

    // Lottie animation (remove if not needed in HTML)
    LottieAnimationComponent
  ],
  templateUrl: './pr-sequence.component.html',
  providers: [MessageService, ConfirmationService]
})
export class PrSequenceComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  // For the search input
  searchValue: string = '';

  // Example data list
  sequences: PRApprover[] = [];

  // Form
  approverForm!: FormGroup;
  approverDialog = false;
  isEditMode = false;
  currentApproverId: string | null = null;
  submitted = false;
  loading = false;

  /**
   * Here we define the available roles, each with a colorClass.
   * Eventually, you can load these from a DB or config table
   * so super admin can set them dynamically.
   */
  roles = [
    {
      name: 'Department Head',
      code: 'Department Head',
      colorClass: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'BAC',
      code: 'BAC',
      colorClass: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Budget',
      code: 'Budget',
      colorClass: 'bg-green-100 text-green-800'
    },
    {
      name: 'Supply Officer',
      code: 'Supply Officer',
      colorClass: 'bg-yellow-100 text-yellow-800'
    },
    {
      name: 'Procurement Officer',
      code: 'Procurement Officer',
      colorClass: 'bg-red-100 text-red-800'
    }
  ];

  /**
   * Similarly for departments; each has a colorClass.
   * Super admin can manage these as well.
   */
  departments = [
    { name: 'Finance', code: 'FIN', colorClass: 'bg-gray-200 text-gray-900' },
    { name: 'Human Resources', code: 'HR', colorClass: 'bg-pink-200 text-pink-800' },
    { name: 'Information Technology', code: 'IT', colorClass: 'bg-indigo-200 text-indigo-800' },
    { name: 'Operations', code: 'OPS', colorClass: 'bg-green-200 text-green-900' },
    { name: 'Procurement', code: 'PROC', colorClass: 'bg-yellow-200 text-yellow-900' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDummyData();
  }

  // ------------------------------------------
  // Initialize form controls
  // ------------------------------------------
  initializeForm(): void {
    this.approverForm = this.formBuilder.group({
      user_id: ['', Validators.required],
      approver_role: ['', Validators.required],
      approval_order: [1, [Validators.required, Validators.min(1)]],
      title: ['', Validators.required],
      department: [''],
      can_modify: [false],
      can_approve: [true],
      email_notification: [true]
    });
  }

  // ------------------------------------------
  // Example: Load or mock some data
  // ------------------------------------------
  loadDummyData(): void {
    this.sequences = [
      {
        id: '1',
        user_id: 'john_doe',
        approver_role: 'Department Head',
        approval_order: 1,
        title: 'Department Manager',
        department: 'FIN',
        can_modify: true,
        can_approve: true,
        email_notification: true
      },
      {
        id: '2',
        user_id: 'jane_budg',
        approver_role: 'Budget',
        approval_order: 2,
        title: 'Budget Officer',
        department: 'FIN',
        can_modify: true,
        can_approve: true,
        email_notification: true
      },
      {
        id: '3',
        user_id: 'mike_supply',
        approver_role: 'Supply Officer',
        approval_order: 3,
        title: 'Supply Management Head',
        department: 'PROC',
        can_modify: true,
        can_approve: true,
        email_notification: true
      }
    ];
  }

  // ------------------------------------------
  // Create a new sequence
  // ------------------------------------------
  openNewApproverDialog(): void {
    this.approverForm.reset();
    this.approverForm.patchValue({
      approval_order: this.getNextOrder(),
      can_modify: false,
      can_approve: true,
      email_notification: true
    });
    this.isEditMode = false;
    this.approverDialog = true;
  }

  getNextOrder(): number {
    return this.sequences.length > 0
      ? this.sequences[this.sequences.length - 1].approval_order + 1
      : 1;
  }

  // ------------------------------------------
  // Save (Create or Update) an approver
  // ------------------------------------------
  saveApprover(): void {
    this.submitted = true;
    if (this.approverForm.invalid) return;

    const formValue = this.approverForm.value;
    const newApprover: PRApprover = {
      id: this.isEditMode && this.currentApproverId
        ? this.currentApproverId
        : Math.random().toString(),
      user_id: formValue.user_id,
      approver_role: formValue.approver_role,
      approval_order: formValue.approval_order,
      title: formValue.title,
      department: formValue.department,
      can_modify: formValue.can_modify,
      can_approve: formValue.can_approve,
      email_notification: formValue.email_notification
    };

    if (this.isEditMode) {
      // update existing
      const index = this.sequences.findIndex(a => a.id === this.currentApproverId);
      if (index !== -1) {
        this.sequences[index] = newApprover;
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Approver updated successfully!'
        });
      }
    } else {
      // add new
      this.sequences.push(newApprover);
      this.messageService.add({
        severity: 'success',
        summary: 'Created',
        detail: 'New approver added successfully!'
      });
    }

    this.hideDialog();
  }

  // ------------------------------------------
  // Edit sequence
  // ------------------------------------------
  editApprover(approver: PRApprover): void {
    this.approverForm.patchValue({
      user_id: approver.user_id,
      approver_role: approver.approver_role,
      approval_order: approver.approval_order,
      title: approver.title,
      department: approver.department,
      can_modify: approver.can_modify,
      can_approve: approver.can_approve,
      email_notification: approver.email_notification
    });
    this.isEditMode = true;
    this.currentApproverId = approver.id;
    this.approverDialog = true;
  }

  // ------------------------------------------
  // Delete sequence
  // ------------------------------------------
  deleteApprover(approver: PRApprover): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this approver from the sequence?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.sequences = this.sequences.filter(a => a.id !== approver.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Approver removed from sequence'
        });
      }
    });
  }

  // ------------------------------------------
  // Hide the add/edit dialog
  // ------------------------------------------
  hideDialog(): void {
    this.approverDialog = false;
    this.submitted = false;
    this.approverForm.reset();
  }

  // ------------------------------------------
  // Reorder (if needed)
  // ------------------------------------------
  reorderSequence(): void {
    this.sequences = this.sequences
      .sort((a, b) => a.approval_order - b.approval_order)
      .map((approver, index) => ({
        ...approver,
        approval_order: index + 1
      }));
  }

  // ------------------------------------------
  // Return the user-friendly role name for display
  // ------------------------------------------
  getRoleName(code: string): string {
    const role = this.roles.find(r => r.code === code);
    return role ? role.name : code;
  }

  // ------------------------------------------
  // Return the user-friendly department name for display
  // ------------------------------------------
  getDepartmentName(code: string | undefined): string {
    if (!code) return '';
    const dept = this.departments.find(d => d.code === code);
    return dept ? dept.name : code;
  }

  // ------------------------------------------
  // Return the role color class from roles array
  // ------------------------------------------
  getRoleColor(roleCode: string): string {
    const role = this.roles.find(r => r.code === roleCode);
    return role ? role.colorClass : 'bg-gray-100 text-gray-800';
  }

  // ------------------------------------------
  // Return the department color class
  // ------------------------------------------
  getDepartmentColor(deptCode: string | undefined): string {
    if (!deptCode) return 'bg-gray-100 text-gray-800';
    const dept = this.departments.find(d => d.code === deptCode);
    return dept ? dept.colorClass : 'bg-gray-100 text-gray-800';
  }
}
