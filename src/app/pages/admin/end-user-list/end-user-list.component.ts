// src/app/pages/admin/end-user-list/end-user-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule,  } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

import { UserService, User } from 'src/app/services/user.service';
import { DepartmentService, Office } from 'src/app/services/departments.service';
import { EndUserListService, EndUserRecord } from 'src/app/services/end-user-list.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-end-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './end-user-list.component.html',
  styleUrls: ['./end-user-list.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class EndUserListComponent implements OnInit {
  endUsers: EndUserRecord[] = [];
  loading = false;
  dialogVisible = false;
  endUserForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  selectedRecordId: string | null = null;

  // For user dropdown => all users from userService
  userDropdown: { label: string; value: string }[] = [];
  // For office dropdown => from departmentService
  officeDropdown: { label: string; value: string }[] = [];

  constructor(
    private endUserListService: EndUserListService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    this.buildForm();
    this.loadRecords();
    this.loadDropdowns();
  }

  buildForm() {
    this.endUserForm = this.fb.group({
      userId: ['', Validators.required],
      officeId: ['', Validators.required]
    });
  }

  loadRecords() {
    this.loading = true;
    this.endUsers = this.endUserListService.getAllRecords();
    this.loading = false;
  }

  async loadDropdowns() {
    // 1) userDropdown => show ALL users (no role filter)
    this.userService.getAllUsers().subscribe(users => {
      this.userDropdown = users.map(u => ({
        label: `${u.fullname} (${u.role})`,
        value: u.id!
      }));
    });

    // 2) officeDropdown => from DepartmentService
    const offices = await this.departmentService.getAllOffices();
    this.officeDropdown = offices.map(o => ({
      label: `${o.name} (Room ${o.roomNumber})`,
      value: o.id!
    }));
  }

  // =========================
  // CRUD
  // =========================
  openNew() {
    this.isEditMode = false;
    this.submitted = false;
    this.selectedRecordId = null;
    this.endUserForm.reset();
    this.dialogVisible = true;
  }

  editRecord(rec: EndUserRecord) {
    this.isEditMode = true;
    this.submitted = false;
    this.selectedRecordId = rec.id!;
    this.endUserForm.patchValue({
      userId: rec.userId,
      officeId: rec.officeId
    });
    this.dialogVisible = true;
  }

  deleteRecord(rec: EndUserRecord) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this assignment?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.endUserListService.deleteRecord(rec.id!);
        this.loadRecords();
        this.messageService.add({ 
          severity: 'success',
          summary: 'Success',
          detail: 'Record deleted'
        });
      }
    });
  }

  hideDialog() {
    this.dialogVisible = false;
    this.submitted = false;
    this.endUserForm.reset();
  }

  saveEndUser() {
    this.submitted = true;
    if (this.endUserForm.valid) {
      const formData = this.endUserForm.value; // userId, officeId
      try {
        if (this.isEditMode && this.selectedRecordId) {
          this.endUserListService.updateRecord(this.selectedRecordId, formData);
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'End user assignment updated'
          });
        } else {
          this.endUserListService.addRecord(formData);
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: 'End user assignment created'
          });
        }
        this.dialogVisible = false;
        this.endUserForm.reset();
        this.loadRecords();
      } catch (err: any) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message
        });
      }
    }
  }

  // =========================
  // Display Helpers
  // =========================
  getUserLabel(userId: string): string {
    const found = this.userDropdown.find(u => u.value === userId);
    return found ? found.label : 'Unknown User';
  }

  getOfficeLabel(officeId: string): string {
    const found = this.officeDropdown.find(o => o.value === officeId);
    return found ? found.label : 'Unknown Office';
  }
}
