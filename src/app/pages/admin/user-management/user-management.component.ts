import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { ConfirmationService, MessageService } from 'primeng/api'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'
import { ToastModule } from 'primeng/toast'
import { BadgeModule } from 'primeng/badge'
import { TabViewModule } from 'primeng/tabview'
import { ConfirmDialog } from 'primeng/confirmdialog'
import { InputSwitchModule } from 'primeng/inputswitch'

export class User {
  id: string
  name: string
  username: string
  password: string
  user_type: 'SuperAdmin' | 'Admin' | 'User'
  role: 'End-User' | 'BAC' | 'Budget' | 'Accounting' | 'Supply' | 'Inspection' | 'HOPE'
  department_id: string
  office_id: string
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
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
  users: User[] = []
  userDialog = false
  userForm!: FormGroup
  isUserEditMode = false
  selectedUserId: string | null = null
  userLoading = false
  userSubmitted = false

  // User Type Options
  userTypes = [
    { label: 'SuperAdmin', value: 'SuperAdmin' },
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'User' }
  ]

  // Role Options
  roles = [
    { label: 'End-User', value: 'End-User' },
    { label: 'BAC', value: 'BAC' },
    { label: 'Budget', value: 'Budget' },
    { label: 'Accounting', value: 'Accounting' },
    { label: 'Supply', value: 'Supply' },
    { label: 'Inspection', value: 'Inspection' },
    { label: 'HOPE', value: 'HOPE' }
  ]

  officeDropdownOptions = [
    { label: 'Office 1', value: 'office1' },
    { label: 'Office 2', value: 'office2' },
    { label: 'Office 3', value: 'office3' }
  ]

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeUserForm()
    this.loadDummyUsers()
  }

  initializeUserForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      user_type: ['', Validators.required],  // Added user_type control
      role: ['', Validators.required],
      office_id: ['', Validators.required]
    })
  }

  loadDummyUsers() {
    this.users = [
      {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        user_type: 'Admin',
        role: 'Accounting',
        department_id: 'dept1',
        office_id: 'office1'
      },
      {
        id: '2',
        name: 'Jane Smith',
        username: 'janesmith',
        password: 'password123',
        user_type: 'SuperAdmin',
        role: 'HOPE',
        department_id: 'dept2',
        office_id: 'office2'
      },
      {
        id: '3',
        name: 'Bob Johnson',
        username: 'bobjohnson',
        password: 'password123',
        user_type: 'User',
        role: 'End-User',
        department_id: 'dept3',
        office_id: 'office3'
      }
    ]
  }

  openNewUserDialog() {
    this.isUserEditMode = false
    this.selectedUserId = null
    this.userForm.reset()
    this.userDialog = true
  }

  editUser(user: User) {
    this.isUserEditMode = true
    this.selectedUserId = user.id
    this.userForm.patchValue(user)
    this.userDialog = true
  }

  saveUser() {
    this.userSubmitted = true

    if (this.userForm.valid) {
      const userData = this.userForm.value

      if (this.isUserEditMode && this.selectedUserId) {
        const index = this.users.findIndex(user => user.id === this.selectedUserId)
        this.users[index] = { ...userData, id: this.selectedUserId }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully' })
      } else {
        const newUser: User = { ...userData, id: (this.users.length + 1).toString(), department_id: '', office_id: userData.office_id }
        this.users.push(newUser)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully' })
      }

      this.userDialog = false
      this.userForm.reset()
      this.userSubmitted = false
    }
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete user "${user.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter(u => u.id !== user.id)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully' })
      }
    })
  }

  hideUserDialog() {
    this.userDialog = false
    this.userForm.reset()
  }

  getRoleSeverity(role: string, isAdmin: boolean): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    if (isAdmin) {
      return 'success'
    }

    switch (role) {
      case 'Accounting': return 'info'
      case 'Supply': return 'warn'
      case 'BAC': return 'info'
      case 'Inspection': return 'danger'
      case 'End-User': return 'secondary'
      case 'HOPE': return 'success'
      default: return 'secondary'
    }
  }
}
