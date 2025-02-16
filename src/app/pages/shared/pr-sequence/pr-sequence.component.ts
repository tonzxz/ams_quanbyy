// pr-sequence.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';

export interface PRApprover {
  id: string;
  user_id: string;
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
    CommonModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    DropdownModule,
    InputSwitchModule,
    ToastModule,
    TableModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle
  ],
  templateUrl: './pr-sequence.component.html',
  providers: [MessageService, ConfirmationService],
})
export class PrSequenceComponent implements OnInit {
  sequences: PRApprover[] = [];
  approverForm!: FormGroup;
  approverDialog = false;
  isEditMode = false;
  currentApproverId: string | null = null;
  submitted = false;
  loading = false;

  roles = [
    { name: 'Department Head', code: 'Department Head' },
    { name: 'BAC', code: 'BAC' },
    { name: 'Budget', code: 'Budget' },
    { name: 'Supply Officer', code: 'Supply Officer' },
    { name: 'Procurement Officer', code: 'Procurement Officer' }
  ];

  departments = [
    { name: 'Finance', code: 'FIN' },
    { name: 'Human Resources', code: 'HR' },
    { name: 'Information Technology', code: 'IT' },
    { name: 'Operations', code: 'OPS' },
    { name: 'Procurement', code: 'PROC' }
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

  loadDummyData(): void {
    this.sequences = [
      {
        id: '1',
        user_id: '1',
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
        user_id: '2',
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
        user_id: '3',
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
    return this.sequences.length > 0 ? this.sequences[this.sequences.length - 1].approval_order + 1 : 1;
  }

  saveApprover(): void {
    this.submitted = true;
    if (this.approverForm.invalid) return;

    const formValue = this.approverForm.value;
    const newApprover: PRApprover = {
      id: this.isEditMode && this.currentApproverId ? this.currentApproverId : Math.random().toString(),
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
      this.sequences.push(newApprover);
      this.messageService.add({
        severity: 'success',
        summary: 'Created',
        detail: 'New approver added successfully!'
      });
    }

    this.hideDialog();
  }

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

  hideDialog(): void {
    this.approverDialog = false;
    this.submitted = false;
    this.approverForm.reset();
  }

  reorderSequence(): void {
    this.sequences = this.sequences
      .sort((a, b) => a.approval_order - b.approval_order)
      .map((approver, index) => ({
        ...approver,
        approval_order: index + 1
      }));
  }
}