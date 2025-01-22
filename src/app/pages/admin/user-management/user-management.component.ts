import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ConfirmationService,  MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { TabViewModule } from 'primeng/tabview';

import { UserService, User, AccountCode, SubAccount } from 'src/app/services/user.service';
import { MaterialModule } from 'src/app/material.module';
import { ConfirmDialog } from 'primeng/confirmdialog';

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
    CommonModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    BadgeModule,
    TabViewModule,
    ConfirmDialog
  ],
  providers: [ConfirmationService, MessageService]
})
export class UserManagementComponent implements OnInit {
  // ------------------------------------
  // 1) USER MANAGEMENT
  // ------------------------------------
  users: User[] = [];
  userLoading: boolean = true;
  userDialog: boolean = false;
  userForm!: FormGroup;
  userSubmitted: boolean = false;
  isUserEditMode: boolean = false;
  selectedUserId: string | null = null;

  // ------------------------------------
  // 2) ACCOUNT CODE MANAGEMENT
  // ------------------------------------
  accountCodes: AccountCode[] = [];
  codeLoading: boolean = true;
  codeDialog: boolean = false;
  codeForm!: FormGroup;
  codeSubmitted: boolean = false;
  isCodeEditMode: boolean = false;
  selectedCodeId: string | null = null;

  // ------------------------------------
  // 3) SUB ACCOUNT MANAGEMENT
  // ------------------------------------
  subAccounts: SubAccount[] = [];
  subLoading: boolean = true;
  subDialog: boolean = false;
  subForm!: FormGroup;
  subSubmitted: boolean = false;
  isSubEditMode: boolean = false;
  selectedSubId: string | null = null;

  // ------------------------------------
  // COMMON
  // ------------------------------------
  roles: RoleOption[] = [];

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Init all data
    this.loadUsers();
    this.loadAccountCodes();
    this.loadSubAccounts();

    // Setup forms
    this.initializeUserForm();
    this.initializeCodeForm();
    this.initializeSubForm();

    // Initialize roles for user management
    this.initializeRoles();
  }

  // ==========================================================================
  // USER MANAGEMENT
  // ==========================================================================
  loadUsers() {
    this.userLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.userLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.userLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' });
      }
    });
  }

  initializeUserForm() {
    this.userForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      profile: ['default-profile-pic-url']
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

  openNewUserDialog() {
    this.isUserEditMode = false;
    this.userSubmitted = false;
    this.userDialog = true;
    this.selectedUserId = null;
    this.initializeUserForm();
  }

  editUser(u: User) {
    this.isUserEditMode = true;
    this.selectedUserId = u.id!;
    this.userForm.patchValue({
      fullname: u.fullname,
      username: u.username,
      role: u.role,
      profile: u.profile
    });
    // Password optional in edit mode
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.addValidators(Validators.minLength(6));
    this.userForm.get('password')?.updateValueAndValidity();

    this.userDialog = true;
  }

  deleteUser(u: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete user "${u.fullname}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (u.id) {
          this.userService.deleteUser(u.id).subscribe({
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

  hideUserDialog() {
    this.userDialog = false;
    this.userSubmitted = false;
    this.userForm.reset();
  }

  saveUser() {
    this.userSubmitted = true;
    if (this.userForm.valid) {
      const data = this.userForm.value;
      if (this.isUserEditMode && this.selectedUserId) {
        // Update user
        this.userService.updateUser(this.selectedUserId, data).subscribe({
          next: () => {
            this.loadUsers();
            this.hideUserDialog();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully' });
          },
          error: (error) => {
            console.error('Error updating user:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          }
        });
      } else {
        // Add user
        this.userService.addUser(data).subscribe({
          next: () => {
            this.loadUsers();
            this.hideUserDialog();
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

  // For showing different badge colors based on role
  getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
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

  // ==========================================================================
  // ACCOUNT CODE MANAGEMENT
  // ==========================================================================
  loadAccountCodes() {
    this.codeLoading = true;
    this.userService.getAllAccountCodes().subscribe({
      next: (codes) => {
        this.accountCodes = codes;
        this.codeLoading = false;
      },
      error: (err) => {
        console.error('Error loading account codes:', err);
        this.codeLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load account codes' });
      }
    });
  }

  initializeCodeForm() {
    this.codeForm = this.formBuilder.group({
      code: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  openNewAccountCodeDialog() {
    this.isCodeEditMode = false;
    this.codeSubmitted = false;
    this.codeDialog = true;
    this.selectedCodeId = null;
    this.initializeCodeForm();
  }

  editAccountCode(ac: AccountCode) {
    this.isCodeEditMode = true;
    this.selectedCodeId = ac.id ?? null;
    this.codeDialog = true;
    this.codeForm.patchValue({
      code: ac.code,
      description: ac.description
    });
  }

  deleteAccountCode(ac: AccountCode) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete code "${ac.code}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (ac.id) {
          this.userService.deleteAccountCode(ac.id).subscribe({
            next: () => {
              this.loadAccountCodes();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account Code deleted successfully' });
            },
            error: (err) => {
              console.error('Error deleting account code:', err);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
            }
          });
        }
      }
    });
  }

  hideCodeDialog() {
    this.codeDialog = false;
    this.codeSubmitted = false;
    this.codeForm.reset();
  }

  saveAccountCode() {
    this.codeSubmitted = true;
    if (this.codeForm.valid) {
      const formData = this.codeForm.value;
      if (this.isCodeEditMode && this.selectedCodeId) {
        // Update
        this.userService.updateAccountCode(this.selectedCodeId, formData).subscribe({
          next: () => {
            this.loadAccountCodes();
            this.hideCodeDialog();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account Code updated successfully' });
          },
          error: (err) => {
            console.error('Error updating account code:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
          }
        });
      } else {
        // Create
        this.userService.addAccountCode(formData).subscribe({
          next: () => {
            this.loadAccountCodes();
            this.hideCodeDialog();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account Code created successfully' });
          },
          error: (err) => {
            console.error('Error creating account code:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
          }
        });
      }
    }
  }

  // ==========================================================================
  // SUB ACCOUNT MANAGEMENT
  // ==========================================================================
  loadSubAccounts() {
    this.subLoading = true;
    this.userService.getAllSubAccounts().subscribe({
      next: (subs) => {
        this.subAccounts = subs;
        this.subLoading = false;
      },
      error: (err) => {
        console.error('Error loading sub accounts:', err);
        this.subLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load sub-accounts' });
      }
    });
  }

  initializeSubForm() {
    this.subForm = this.formBuilder.group({
      mainAccountCode: ['', Validators.required],
      subClassification: ['', Validators.required],
      subLevel: ['', Validators.required],
      subCode: ['', Validators.required]
    });
  }

  openNewSubAccountDialog() {
    this.isSubEditMode = false;
    this.subSubmitted = false;
    this.subDialog = true;
    this.selectedSubId = null;
    this.initializeSubForm();
  }

  editSubAccount(sa: SubAccount) {
    this.isSubEditMode = true;
    this.selectedSubId = sa.id ?? null;
    this.subDialog = true;
    this.subForm.patchValue({
      mainAccountCode: sa.mainAccountCode,
      subClassification: sa.subClassification,
      subLevel: sa.subLevel,
      subCode: sa.subCode
    });
  }

  deleteSubAccount(sa: SubAccount) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete sub code "${sa.subCode}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (sa.id) {
          this.userService.deleteSubAccount(sa.id).subscribe({
            next: () => {
              this.loadSubAccounts();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sub Account deleted successfully' });
            },
            error: (err) => {
              console.error('Error deleting sub account:', err);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
            }
          });
        }
      }
    });
  }

  hideSubDialog() {
    this.subDialog = false;
    this.subSubmitted = false;
    this.subForm.reset();
  }

  saveSubAccount() {
    this.subSubmitted = true;
    if (this.subForm.valid) {
      const formData = this.subForm.value;
      if (this.isSubEditMode && this.selectedSubId) {
        // Update
        this.userService.updateSubAccount(this.selectedSubId, formData).subscribe({
          next: () => {
            this.loadSubAccounts();
            this.hideSubDialog();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sub Account updated successfully' });
          },
          error: (err) => {
            console.error('Error updating sub account:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
          }
        });
      } else {
        // Create
        this.userService.addSubAccount(formData).subscribe({
          next: () => {
            this.loadSubAccounts();
            this.hideSubDialog();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sub Account created successfully' });
          },
          error: (err) => {
            console.error('Error creating sub account:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
          }
        });
      }
    }
  }
}
