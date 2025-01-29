import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { UserService, User, AccountCode, SubAccount, Position } from 'src/app/services/user.service';
import { MaterialModule } from 'src/app/material.module';
import { Department, DepartmentService, Office } from 'src/app/services/departments.service';
import { InputSwitchModule } from 'primeng/inputswitch';

/** 
 * Simple local helper to generate a random 32-char hex string.
 * We use this if a Position from the service lacks an id.
 */
function generateLocalId(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

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
    ConfirmDialog,
    InputSwitchModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class UserManagementComponent implements OnInit {
  // ------------------------------------------------------
  // 1) USER MANAGEMENT
  // ------------------------------------------------------
  users: User[] = [];
  userLoading = true;
  userDialog = false;
  userForm!: FormGroup;
  userSubmitted = false;
  isUserEditMode = false;
  selectedUserId: string | null = null;

  // ------------------------------------------------------
  // 2) ACCOUNT CODE MANAGEMENT
  // ------------------------------------------------------
  accountCodes: AccountCode[] = [];
  codeLoading = true;
  codeDialog = false;
  codeForm!: FormGroup;
  codeSubmitted = false;
  isCodeEditMode = false;
  selectedCodeId: string | null = null;

  // ------------------------------------------------------
  // 3) SUB ACCOUNT MANAGEMENT
  // ------------------------------------------------------
  subAccounts: SubAccount[] = [];
  subLoading = true;
  subDialog = false;
  subForm!: FormGroup;
  subSubmitted = false;
  isSubEditMode = false;
  selectedSubId: string | null = null;

  // ------------------------------------------------------
  // 4) POSITION MANAGEMENT
  // ------------------------------------------------------
  positions: Position[] = [];
  positionLoading = true;
  positionDialog = false;
  positionForm!: FormGroup;
  positionSubmitted = false;
  isPositionEditMode = false;
  selectedPositionId: string | null = null;

  usersLoaded = false;
officesLoaded = false;

  // Departments and Offices
  departments: Department[] = [];
  offices: Office[] = [];
  departmentDropdownOptions: { label: string; value: string }[] = [];
  officeDropdownOptions: { label: string; value: string }[] = [];

  // Role & Position dropdown data
  roles: RoleOption[] = [];
  positionDropdownOptions: { name: string; value: string }[] = [];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private departmentService: DepartmentService, 

  ) {}

  ngOnInit(): void {
    // Load data for each tab
    this.loadUsers();
    this.loadAccountCodes();
    this.loadSubAccounts();
    this.loadPositions();  // For the Position Management tab & user form

    // Initialize forms
    this.initializeUserForm();
    this.initializeCodeForm();
    this.initializeSubForm();
    this.initializePositionForm();

    // Initialize role dropdown
    this.initializeRoles();
    this.loadDepartmentsAndOffices();
  }

  // =============================================
  // USERS
  // =============================================
  // loadUsers() {
  //   this.userLoading = true;
  //   this.userService.getAllUsers().subscribe({
  //     next: (userList) => {
  //       this.users = userList;
  //       this.userLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error loading users:', err);
  //       this.userLoading = false;
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' });
  //     }
  //   });
  // }

  loadUsers(): void {
  this.userLoading = true;
  this.userService.getAllUsers().subscribe({
    next: (users) => {
      console.log('Users loaded:', users); // Debug output
      this.users = users.map(user => {
        const office = this.offices.find(o => o.id === user.officeId);
        return { ...user, officeName: office ? office.name : 'N/A' };
      });
      this.userLoading = false;
    },
    error: (error) => {
      console.error('Failed to load users:', error);
      this.userLoading = false;
    }
  });
}



loadDepartmentsAndOffices(): void {
  this.departmentService.getAllOffices().then((offices) => {
    console.log('Offices loaded:', offices); // Debug output
    this.offices = offices;

    // Map offices to dropdown options with proper type safety
    this.officeDropdownOptions = offices.map((o) => ({
      label: o.name,
      value: o.id ?? ""  // Ensure value is always a string
    }));

    // Reload users to update office names
    this.loadUsers();
  }).catch((error) => {
    console.error('Failed to load offices:', error);
  });
}



checkIfReadyToRender() {
  if (this.usersLoaded && this.officesLoaded) {
    this.userLoading = false;
  }
}

  getDepartmentName(id: string): string {
  return this.departments.find(d => d.id === id)?.name || 'N/A';
}

getOfficeName(id: string): string {
  console.log('Searching for Office ID:', id);
  const office = this.offices.find(o => o.id === id);
  console.log('Found Office:', office);
  return office ? office.name : 'N/A';
}



  
  
 initializeUserForm() {
  this.userForm = this.fb.group({
    fullname: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required],
    isAdmin: [false],  // Default is false
    profile: ['default-profile-pic-url'],
    position: [''],
    officeId: ['', Validators.required]
  });

  // If role == 'end-user', require 'position'
  this.userForm.get('role')?.valueChanges.subscribe((selectedRole) => {
    const positionControl = this.userForm.get('position');
    if (selectedRole === 'end-user') {
      positionControl?.setValidators([Validators.required]);
    } else {
      positionControl?.clearValidators();
    }
    positionControl?.updateValueAndValidity();
  });
}



  initializeRoles() {
  this.roles = [
    { label: 'Superadmin', value: 'superadmin' },
    { label: 'Accounting', value: 'accounting' },
    { label: 'Supply', value: 'supply' },
    { label: 'BAC', value: 'bac' },
    { label: 'Inspection', value: 'inspection' },
    { label: 'End User', value: 'end-user' },
    { label: 'President', value: 'president' }
  ];
}


  openNewUserDialog() {
    this.isUserEditMode = false;
    this.userSubmitted = false;
    this.selectedUserId = null;
    this.userDialog = true;

    this.initializeUserForm();
  }

  editUser(u: User) {
  this.isUserEditMode = true;
  this.selectedUserId = u.id!;
  this.userSubmitted = false;
  this.userDialog = true;

  this.initializeUserForm();
  this.userForm.patchValue({
    fullname: u.fullname,
    username: u.username,
    role: u.role,
    isAdmin: u.role === 'superadmin' ? false : u.isAdmin, // Superadmin can't be an admin
    profile: u.profile,
    position: u.position || '',
    officeId: u.officeId
  });

  // Disable isAdmin if role is Superadmin
  if (u.role === 'superadmin') {
    this.userForm.get('isAdmin')?.disable();
  }
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
            error: (err) => {
              console.error('Error deleting user:', err);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
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
  
  console.log("Form Status:", this.userForm.valid);
  console.log("Form Data:", this.userForm.value);

  if (this.userForm.valid) {
    const data = this.userForm.value;

    if (this.isUserEditMode && this.selectedUserId) {
      // Update existing user
      this.userService.updateUser(this.selectedUserId, data).subscribe({
        next: () => {
          this.loadUsers();
          this.hideUserDialog();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully' });
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
      });
    } else {
      // Create new user
      console.log("Sending user data to API:", data);
      
      this.userService.addUser(data).subscribe({
        next: () => {
          this.loadUsers();
          this.hideUserDialog();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully' });
        },
        error: (err) => {
          console.error('Error creating user:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
      });
    }
  } else {
    console.warn("Form is invalid. Check missing fields.");
  }
}


  getRoleSeverity(role: string, isAdmin: boolean): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
  if (role === 'superadmin') return 'success'; // Superadmin is always unique

  if (isAdmin) {
    return 'success'; // Admin roles get a special color
  }

  switch (role.toLowerCase()) {
    case 'accounting': return 'info';
    case 'supply': return 'warn';
    case 'bac': return 'info';
    case 'inspection': return 'danger';
    case 'end-user': return 'secondary';
    case 'president': return 'success';
    default: return 'secondary';
  }
}




  // =============================================
  // ACCOUNT CODE MANAGEMENT
  // =============================================
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
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load account codes'
        });
      }
    });
  }

  initializeCodeForm() {
    this.codeForm = this.fb.group({
      code: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  openNewAccountCodeDialog() {
    this.isCodeEditMode = false;
    this.codeSubmitted = false;
    this.selectedCodeId = null;
    this.codeDialog = true;
    this.initializeCodeForm();
  }

  editAccountCode(ac: AccountCode) {
    this.isCodeEditMode = true;
    this.selectedCodeId = ac.id ?? null;
    this.codeSubmitted = false;
    this.codeDialog = true;

    this.initializeCodeForm();
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
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Account Code deleted successfully'
              });
            },
            error: (err) => {
              console.error('Error deleting account code:', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.message
              });
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
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Account Code updated successfully'
            });
          },
          error: (err) => {
            console.error('Error updating account code:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.message
            });
          }
        });
      } else {
        // Create
        this.userService.addAccountCode(formData).subscribe({
          next: () => {
            this.loadAccountCodes();
            this.hideCodeDialog();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Account Code created successfully'
            });
          },
          error: (err) => {
            console.error('Error creating account code:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.message
            });
          }
        });
      }
    }
  }

  // =============================================
  // SUB ACCOUNT MANAGEMENT
  // =============================================
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
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load sub-accounts'
        });
      }
    });
  }

  initializeSubForm() {
    this.subForm = this.fb.group({
      mainAccountCode: ['', Validators.required],
      subClassification: ['', Validators.required],
      subLevel: ['', Validators.required],
      subCode: ['', Validators.required]
    });
  }

  openNewSubAccountDialog() {
    this.isSubEditMode = false;
    this.subSubmitted = false;
    this.selectedSubId = null;
    this.subDialog = true;
    this.initializeSubForm();
  }

  editSubAccount(sa: SubAccount) {
    this.isSubEditMode = true;
    this.selectedSubId = sa.id ?? null;
    this.subSubmitted = false;
    this.subDialog = true;

    this.initializeSubForm();
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
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Sub Account deleted successfully'
              });
            },
            error: (err) => {
              console.error('Error deleting sub account:', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.message
              });
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
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Sub Account updated successfully'
            });
          },
          error: (err) => {
            console.error('Error updating sub account:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.message
            });
          }
        });
      } else {
        // Create
        this.userService.addSubAccount(formData).subscribe({
          next: () => {
            this.loadSubAccounts();
            this.hideSubDialog();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Sub Account created successfully'
            });
          },
          error: (err) => {
            console.error('Error creating sub account:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.message
            });
          }
        });
      }
    }
  }

  // =============================================
  // POSITION MANAGEMENT
  // =============================================
  loadPositions() {
    this.positionLoading = true;
    this.userService.getAllPositions().subscribe({
      next: (posList) => {
        // If the service might return items missing 'id', fix them here:
        this.positions = posList.map((p) => ({
          id: p.id ?? generateLocalId(), // fallback if p.id is undefined
          name: p.name
        }));
        this.positionLoading = false;

        // Build the dropdown for end-user positions
        this.positionDropdownOptions = this.positions.map((p) => ({
          name: p.name,
          value: p.name // store name in userForm
        }));
      },
      error: (err) => {
        console.error('Error loading positions:', err);
        this.positionLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load positions'
        });
      }
    });
  }

  initializePositionForm() {
    this.positionForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  openNewPositionDialog() {
    this.isPositionEditMode = false;
    this.positionSubmitted = false;
    this.selectedPositionId = null;
    this.positionDialog = true;
    this.initializePositionForm();
  }

  editPosition(pos: Position) {
    this.isPositionEditMode = true;
    this.selectedPositionId = pos.id || null;
    this.positionSubmitted = false;
    this.positionDialog = true;

    this.initializePositionForm();
    this.positionForm.patchValue({
      name: pos.name
    });
  }

  deletePosition(pos: Position) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete position "${pos.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (pos.id) {
          this.userService.deletePosition(pos.id).subscribe({
            next: () => {
              this.loadPositions();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Position deleted successfully'
              });
            },
            error: (err) => {
              console.error('Error deleting position:', err);
              this.positionLoading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.message
              });
            }
          });
        }
      }
    });
  }

  hidePositionDialog() {
    this.positionDialog = false;
    this.positionSubmitted = false;
    this.positionForm.reset();
  }

  savePosition() {
    this.positionSubmitted = true;
    if (this.positionForm.valid) {
      const positionData = this.positionForm.value; // { name: ... }

      if (this.isPositionEditMode && this.selectedPositionId) {
        // Update
        this.userService.updatePosition(this.selectedPositionId, positionData).subscribe({
          next: () => {
            this.loadPositions();
            this.hidePositionDialog();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Position updated successfully'
            });
          },
          error: (err) => {
            console.error('Error updating position:', err);
            this.positionLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.message
            });
          }
        });
      } else {
        // Create
        this.userService.addPosition(positionData).subscribe({
          next: () => {
            this.loadPositions();
            this.hidePositionDialog();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Position created successfully'
            });
          },
          error: (err) => {
            console.error('Error creating position:', err);
            this.positionLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.message
            });
          }
        });
      }
    }
  }
}
