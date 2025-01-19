// user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { UserService, User } from 'src/app/services/user.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MaterialModule } from 'src/app/material.module';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BadgeModule } from 'primeng/badge';


interface RoleOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [
    BadgeModule,
    InputIconModule,
    IconFieldModule,
    MaterialModule,
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ReactiveFormsModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  roles: RoleOption[] = [];
  userDialog: boolean = false;
  userForm!: FormGroup;
  submitted: boolean = false;
  isEditMode: boolean = false;
  selectedUserId: string | null = null;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.initializeRoles();
    this.initializeForm();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' });
      }
    });
  }

  initializeRoles() {
    this.roles = [
      { label: 'Superadmin', value: 'superadmin' },
      { label: 'Accounting', value: 'accounting' },
      { label: 'Supply', value: 'supply' },
      { label: 'BAC', value: 'bac' },
      { label: 'Inspection', value: 'inspection' },
      { label: 'End User', value: 'end-user' }
    ];
  }

  initializeForm() {
    this.userForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      profile: ['default-profile-pic-url']  // Default value
    });
  }

  openNewUserDialog() {
    this.isEditMode = false;
    this.submitted = false;
    this.userDialog = true;
    this.selectedUserId = null;
    this.initializeForm();
  }

  editUser(user: User) {
    this.isEditMode = true;
    this.selectedUserId = user.id!;
    this.userForm.patchValue({
      fullname: user.fullname,
      username: user.username,
      role: user.role,
      profile: user.profile
    });
    // Make password optional in edit mode
    this.userForm.get('password')?.setValidators(Validators.minLength(6));
    this.userForm.get('password')?.updateValueAndValidity();
    this.userDialog = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.fullname}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (user.id) {
          this.userService.deleteUser(user.id).subscribe({
            next: () => {
              this.loadUsers();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully' });
            },
            error: (error) => {
              console.error('Error deleting user:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
            }
          });
        }
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
    this.userForm.reset();
  }

  saveUser() {
    this.submitted = true;

    if (this.userForm.valid) {
      const userData = this.userForm.value;
      
      if (this.isEditMode && this.selectedUserId) {
        // Handle update
        this.userService.updateUser(this.selectedUserId, userData).subscribe({
          next: () => {
            this.loadUsers();
            this.hideDialog();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully' });
          },
          error: (error) => {
            console.error('Error updating user:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          }
        });
      } else {
        // Handle create
        this.userService.addUser(userData).subscribe({
          next: () => {
            this.loadUsers();
            this.hideDialog();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully' });
          },
          error: (error) => {
            console.error('Error creating user:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          }
        });
      }
    }
  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (role.toLowerCase()) {
      case 'superadmin':
        return 'success';
      case 'accounting':
        return 'info';
      case 'supply':
        return 'warn';
      case 'bac':
        return 'info';
      case 'inspection':
        return 'danger';
      case 'end-user':
        return 'secondary';
      default:
        return 'secondary';
    }
  }
}