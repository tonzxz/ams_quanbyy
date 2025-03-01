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
import { finalize } from 'rxjs/operators';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

export class PPMPApprover {
  id!: string
  user_id!: string
  approver_role!: 'Department Head' | 'BAC' | 'Budget'
  approval_order!: number
  title!: string
}

@Component({
  selector: 'app-ppmp-sequence',
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
    MatCardSubtitle,
    IconField,
    InputIcon
  ],
  templateUrl: './ppmp-sequence.component.html',
  providers: [MessageService, ConfirmationService],
})
export class PpmpSequenceComponent implements OnInit {
  sequences: PPMPApprover[] = []
  approverForm!: FormGroup
  approverDialog = false
  isEditMode = false
  currentApproverId: string | null = null
  submitted = false
  loading = false
  
  roles = [
    { name: 'Department Head', code: 'Department Head' },
    { name: 'BAC', code: 'BAC' },
    { name: 'Budget', code: 'Budget' }
  ]

  dummyUsers = [
    { id: '1', name: 'Juan Dela Cruz' },
    { id: '2', name: 'Maria Clara' },
    { id: '3', name: 'Jose Rizal' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initializeForm()
    this.loadDummyData()
  }

  initializeForm(): void {
    this.approverForm = this.formBuilder.group({
      user_id: ['', Validators.required],
      approver_role: ['', Validators.required],
      approval_order: [1, [Validators.required, Validators.min(1)]],
      title: ['', Validators.required]
    })
  }

  loadDummyData(): void {
    this.sequences = [
      { id: '1', user_id: '1', approver_role: 'Department Head', approval_order: 1, title: 'Chief Auditor' },
      { id: '2', user_id: '2', approver_role: 'BAC', approval_order: 2, title: 'Procurement Officer' },
      { id: '3', user_id: '3', approver_role: 'Budget', approval_order: 3, title: 'Budget Analyst' }
    ];
  }

  openNewApproverDialog(): void {
    this.approverForm.reset()
    this.approverForm.patchValue({ approval_order: this.getNextOrder() })
    this.isEditMode = false
    this.approverDialog = true
  }

  getNextOrder(): number {
    return this.sequences.length > 0 ? this.sequences[this.sequences.length - 1].approval_order + 1 : 1
  }

  saveApprover(): void {
    this.submitted = true
    if (this.approverForm.invalid) return

    const formValue = this.approverForm.value
    const newApprover: PPMPApprover = {
      id: this.isEditMode && this.currentApproverId ? this.currentApproverId : Math.random().toString(),
      user_id: formValue.user_id,
      approver_role: formValue.approver_role,
      approval_order: formValue.approval_order,
      title: formValue.title
    }

    if (this.isEditMode) {
      const index = this.sequences.findIndex(a => a.id === this.currentApproverId)
      if (index !== -1) this.sequences[index] = newApprover
    } else {
      this.sequences.push(newApprover)
    }

    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Approver saved successfully!' })
    this.hideDialog()
  }

  editApprover(approver: PPMPApprover): void {
    this.approverForm.patchValue({
      user_id: approver.user_id,
      approver_role: approver.approver_role,
      approval_order: approver.approval_order,
      title: approver.title
    });
    this.isEditMode = true;
    this.currentApproverId = approver.id;
    this.approverDialog = true;
  }

  deleteApprover(approver: PPMPApprover): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this approver?',
      accept: () => {
        this.sequences = this.sequences.filter(a => a.id !== approver.id)
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Approver deleted' })
      }
    })
  }

  hideDialog(): void {
    this.approverDialog = false
    this.submitted = false
    this.approverForm.reset()
  }
}
