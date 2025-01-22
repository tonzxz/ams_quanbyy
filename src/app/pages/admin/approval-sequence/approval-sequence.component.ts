// approval-sequence.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TabViewModule } from 'primeng/tabview';
import { ApprovalSequenceService, ApprovalSequence } from 'src/app/services/approval-sequence.service';
import { UserService, User } from 'src/app/services/user.service';
import { finalize } from 'rxjs/operators';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-approval-sequence',
  standalone: true,
  imports: [
    MaterialModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ConfirmDialogModule,
    DropdownModule,
    InputSwitchModule,
    TabViewModule,
    ToastModule
  ],
  templateUrl: './approval-sequence.component.html',
  providers: [MessageService, ConfirmationService],
})
export class ApprovalSequenceComponent implements OnInit {
  procurementApprovers: ApprovalSequence[] = [];
  supplyApprovers: ApprovalSequence[] = [];
  approverForm!: FormGroup;
  approverDialog = false;
  isEditMode = false;
  currentApproverId: string | null = null;
  currentFlow: 'procurement' | 'supply' = 'procurement';
  submitted = false;
  loading = false;
  availableUsers: User[] = [];

  departments = [
    { name: 'Budget Unit', code: 'BUDGET' },
    { name: 'FACTO', code: 'FACTO' },
    { name: 'CSO', code: 'CSO' },
    { name: 'OCCP', code: 'OCCP' },
    { name: 'BAC', code: 'BAC' },
    { name: 'Supply Management', code: 'SUPPLY' }
  ];

  roles = [
    { name: 'Budget Officer', code: 'accounting' },
    { name: 'FACTO Officer', code: 'accounting' },
    { name: 'CSO Officer', code: 'accounting' },
    { name: 'OCCP Officer', code: 'accounting' },
    { name: 'BAC Chairman', code: 'bac' },
    { name: 'Supply Officer', code: 'supply' },
    { name: 'Property Custodian', code: 'supply' },
    { name: 'Supply Head', code: 'supply' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private approvalSequenceService: ApprovalSequenceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSequences();
  }

  initializeForm(): void {
    this.approverForm = this.formBuilder.group({
      name: ['', Validators.required],
      level: ['', [Validators.required, Validators.min(1)]],
      department: ['', Validators.required],
      role: ['', Validators.required],
      user: ['', Validators.required],
      isActive: [true]
    });

    // Listen to role changes to update available users
    this.approverForm.get('role')?.valueChanges.subscribe(role => {
      if (role) {
        this.loadAvailableUsers(role.code);
      }
    });
  }

  loadSequences(): void {
    this.loading = true;
    this.approvalSequenceService.getSequencesByType('procurement').subscribe({
      next: (sequences) => {
        this.procurementApprovers = sequences;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load procurement sequences'
        });
        this.loading = false;
      }
    });

    this.approvalSequenceService.getSequencesByType('supply').subscribe({
      next: (sequences) => {
        this.supplyApprovers = sequences;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load supply sequences'
        });
      }
    });
  }

  loadAvailableUsers(roleCode: string): void {
    this.approvalSequenceService.getAvailableUsers(roleCode).subscribe({
      next: (users) => {
        this.availableUsers = users;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load available users'
        });
      }
    });
  }

  openNewApproverDialog(flow: 'procurement' | 'supply'): void {
    this.currentFlow = flow;
    this.approverForm.reset();
    this.approverForm.patchValue({ isActive: true });
    this.isEditMode = false;
    this.approverDialog = true;
  }

  editApprover(approver: ApprovalSequence, flow: 'procurement' | 'supply'): void {
    this.currentFlow = flow;
    this.approverForm.patchValue({
      name: approver.name,
      level: approver.level,
      department: this.departments.find(d => d.code === approver.departmentCode),
      role: this.roles.find(r => r.code === approver.roleCode),
      user: this.availableUsers.find(u => u.id === approver.userId),
      isActive: approver.isActive
    });
    this.isEditMode = true;
    this.currentApproverId = approver.id || null;
    this.approverDialog = true;

    // Load available users for the selected role
    this.loadAvailableUsers(approver.roleCode);
  }

  saveApprover(): void {
    this.submitted = true;

    if (this.approverForm.invalid) {
      return;
    }

    const formValue = this.approverForm.value;
    const sequenceData = {
      name: formValue.name,
      level: formValue.level,
      departmentCode: formValue.department.code,
      departmentName: formValue.department.name,
      roleCode: formValue.role.code,
      roleName: formValue.role.name,
      userId: formValue.user.id,
      userFullName: formValue.user.fullname,
      type: this.currentFlow,
      isActive: formValue.isActive
    };

    if (this.isEditMode && this.currentApproverId) {
      this.approvalSequenceService.updateSequence(this.currentApproverId, sequenceData)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Approval sequence updated successfully!'
            });
            this.loadSequences();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to update sequence'
            });
          }
        });
    } else {
      this.approvalSequenceService.addSequence(sequenceData)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'New approval sequence added successfully!'
            });
            this.loadSequences();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to add sequence'
            });
          }
        });
    }
  }

  deleteApprover(approver: ApprovalSequence, flow: 'procurement' | 'supply'): void {
    this.currentFlow = flow;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this approval sequence?',
      accept: () => {
        this.loading = true;
        this.approvalSequenceService.deleteSequence(approver.id!)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Approval sequence deleted'
              });
              this.loadSequences();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to delete sequence'
              });
            }
          });
      }
    });
  }

  hideDialog(): void {
    this.approverDialog = false;
    this.submitted = false;
    this.approverForm.reset();
    this.availableUsers = [];
  }
}