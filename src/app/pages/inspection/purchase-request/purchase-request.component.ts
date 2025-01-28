import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { ImageModule } from 'primeng/image';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PurchaseRequestService, PurchaseRequest } from 'src/app/services/purchase-request.service';

@Component({
  selector: 'app-purchase-request',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    TabViewModule,
    ImageModule,
    IconFieldModule,
    InputIconModule,
    ButtonGroupModule
  ],
  templateUrl: './purchase-request.component.html',
  styleUrls: ['./purchase-request.component.scss'],
  providers: [MessageService, ConfirmationService, PurchaseRequestService]
})
export class PurchaseRequestComponent implements OnInit {
  displayModal = false;
  selectedRequest: PurchaseRequest | null = null;
  searchQuery = '';
  selectedDepartment: string | null = null;
  activeTabIndex = 0;
  activeTabHeader = 'Pending Requests';
  tabHeaders = ['Pending Requests', 'Validated Requests', 'Rejected Requests'];

  allRequests: PurchaseRequest[] = [];
  pendingRequests: PurchaseRequest[] = [];
  validatedRequests: PurchaseRequest[] = [];
  rejectedRequests: PurchaseRequest[] = [];

  filteredPendingRequests: PurchaseRequest[] = [];
  filteredValidatedRequests: PurchaseRequest[] = [];
  filteredRejectedRequests: PurchaseRequest[] = [];

  departments = [
    { name: 'Department 1', value: 'Department 1' },
    { name: 'Department 2', value: 'Department 2' },
    { name: 'Department 3', value: 'Department 3' }
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private prService: PurchaseRequestService
  ) {}

  async ngOnInit() {
    await this.loadData();
    this.filterRequests();
  }

  private async loadData() {
    this.allRequests = await this.prService.getAll();
    this.categorizeRequests();
  }

  private categorizeRequests() {
    this.pendingRequests = this.allRequests.filter(r => r.status === 'pending');
    this.validatedRequests = this.allRequests.filter(r => r.status === 'approved');
    this.rejectedRequests = this.allRequests.filter(r => r.status === 'rejected');
  }

  filterRequests() {
    this.filteredPendingRequests = this.filterArray(this.pendingRequests);
    this.filteredValidatedRequests = this.filterArray(this.validatedRequests);
    this.filteredRejectedRequests = this.filterArray(this.rejectedRequests);
  }

  private filterArray(sourceArray: PurchaseRequest[]): PurchaseRequest[] {
    return sourceArray.filter(request => 
      (this.searchQuery === '' || 
        request.prNo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.requestedBy.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.department.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (this.selectedDepartment === null || request.department === this.selectedDepartment)
    );
  }

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    this.activeTabHeader = this.tabHeaders[this.activeTabIndex];
    this.filterRequests();
  }

  async acceptRequest(request: PurchaseRequest) {
    request.status = 'approved';
    await this.refreshData();
    this.messageService.add({
      severity: 'success',
      summary: 'Confirmed',
      detail: 'Purchase request accepted'
    });
  }

  async rejectRequest(request: PurchaseRequest) {
    request.status = 'rejected';
    await this.refreshData();
    this.messageService.add({
      severity: 'error', 
      summary: 'Confirmed',
      detail: 'Purchase request rejected'
    });
  }

  async revalidateRequest(request: PurchaseRequest) {
    request.status = 'pending';
    await this.refreshData();
    this.messageService.add({
      severity: 'success',
      summary: 'Moved to Pending',
      detail: 'Request has been moved back to pending'
    });
  }

  async unrejectRequest(request: PurchaseRequest) {
    request.status = 'pending';
    await this.refreshData();
    this.messageService.add({
      severity: 'success',
      summary: 'Moved to Pending',
      detail: 'Request has been moved back to pending'
    });
  }

  private async refreshData() {
    await this.loadData();
    this.filterRequests();
  }

  generateReport(header: string) {
    const data = this.getReportData();
    if (data.length > 0) {
      this.prService.generatePurchaseRequestPdf(data[0]);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'No requests to generate report for'
      });
    }
  }

  private getReportData(): PurchaseRequest[] {
    switch (this.activeTabIndex) {
      case 0: return this.filteredPendingRequests;
      case 1: return this.filteredValidatedRequests;
      case 2: return this.filteredRejectedRequests;
      default: return [];
    }
  }

  onRowSelect(event: any) {
    this.selectedRequest = event.data;
    this.displayModal = true;
  }

  hideModal() {
    this.displayModal = false;
    this.selectedRequest = null;
  }

  confirmAcceptRequest(request: PurchaseRequest) {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Are you sure you want to accept this purchase request?',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => this.acceptRequest(request)
    });
  }

  confirmRejectRequest(request: PurchaseRequest) {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Are you sure you want to reject this purchase request?',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => this.rejectRequest(request)
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedDepartment = null;
    this.filterRequests();
  }

  isRequestPending(request: PurchaseRequest): boolean {
    return request.status === 'pending';
  }
}