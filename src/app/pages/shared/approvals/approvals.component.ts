// src/app/pages/shared/approvals/approvals.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

import { UserService, User } from 'src/app/services/user.service';
import { ApprovalsService, Approval, ApprovalStatus } from 'src/app/services/approvals.service';
import { NotificationService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,

    // PrimeNG
    DropdownModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TabViewModule
  ],
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {
  // ================
  // Tab 1: CREATE
  // ================
  approvalForm!: FormGroup;
  userDropdownOptions: { label: string; value: string }[] = [];
  submitted = false;

  // ================
  // Tab 2: My Sent
  // ================
  mySentApprovals: Approval[] = [];

  // ================
  // Tab 3: Received
  // ================
  myReceivedApprovals: Approval[] = [];

  allUsers: User[] = [];
  currentUser?: User;

  constructor(
    private userService: UserService,
    private approvalsService: ApprovalsService,
    private notificationService: NotificationService, // optional
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // Build the form
    this.approvalForm = this.fb.group({
      toUserId: ['', Validators.required],
      message: ['', Validators.required]
    });

    // Grab the currently logged-in user
    this.currentUser = this.userService.getUser();

    // Load all users from userService for the dropdown
    this.userService.getAllUsers().subscribe(users => {
      this.allUsers = users;
      this.userDropdownOptions = users.map(u => ({
        label: `${u.fullname} (${u.role})`,
        value: u.id!
      }));
    });

    // Refresh both "My Sent" and "My Received"
    this.refreshApprovals();
  }

  // Reload the approvals from ApprovalsService
  private refreshApprovals() {
    const all = this.approvalsService.getAllApprovals();
    if (this.currentUser) {
      // My Sent: fromUserId == currentUser.id
      this.mySentApprovals = all.filter(a => a.fromUserId === this.currentUser!.id);
      // My Received: toUserId == currentUser.id
      this.myReceivedApprovals = all.filter(a => a.toUserId === this.currentUser!.id);
    }
  }

  // ===================
  // TAB 1: CREATE
  // ===================
  onSend() {
    this.submitted = true;
    if (this.approvalForm.valid && this.currentUser) {
      const { toUserId, message } = this.approvalForm.value;
      // Create new approval with fromUserId = currentUser
      const newApproval = this.approvalsService.createApproval({
        fromUserId: this.currentUser.id!,
        toUserId,
        message
      });

      // Optionally, send a notification to the target user
      this.notificationService.addNotification(
        `New Approval from ${this.currentUser.fullname}: ${message}`,
        'info',
        toUserId // targeted
      );

      // Reset form
      this.approvalForm.reset();
      this.submitted = false;

      // Refresh "my sent" approvals
      this.refreshApprovals();
    }
  }

  // ===================
  // TAB 2: MY SENT
  // ===================
  // We show them in the table, no actions needed from the sender.
  // If you want to remove a request or something, you can add methods.

  // ===================
  // TAB 3: RECEIVED
  // ===================
  onApprove(approvalId: string) {
    this.approvalsService.updateApprovalStatus(approvalId, 'approved');
    // Optional: notify the sender
    const ap = this.approvalsService.getAllApprovals().find(a => a.id === approvalId);
    if (ap && this.currentUser) {
      this.notificationService.addNotification(
        `Your approval request was approved by ${this.currentUser.fullname}.`,
        'success',
        ap.fromUserId
      );
    }
    this.refreshApprovals();
  }

  onReject(approvalId: string) {
    this.approvalsService.updateApprovalStatus(approvalId, 'rejected');
    // Optional: notify the sender
    const ap = this.approvalsService.getAllApprovals().find(a => a.id === approvalId);
    if (ap && this.currentUser) {
      this.notificationService.addNotification(
        `Your approval request was rejected by ${this.currentUser.fullname}.`,
        'warning',
        ap.fromUserId
      );
    }
    this.refreshApprovals();
  }

  // Helper: get a user's full name by ID
  getUserFullName(userId: string): string {
    const found = this.allUsers.find(u => u.id === userId);
    return found ? found.fullname : 'Unknown User';
  }
}
