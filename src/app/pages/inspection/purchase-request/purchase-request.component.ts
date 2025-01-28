import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PurchaseRequest {
  code: string;
  name: string;
  department: string;
  item: string;
  quantity: number;
  date: string;
}

interface Department {
  name: string;
  value: string;
}

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
    MultiSelectModule,
    CheckboxModule,
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
  providers: [MessageService, ConfirmationService]
})
export class PurchaseRequestComponent {
  displayModal: boolean = false;
  selectedRequest: any = null;
  searchQuery: string = '';
  selectedDepartment: string | null = null;
  activeTabIndex: number = 0;
  activeTabHeader: string = 'Pending Requests';
  tabHeaders: string[] = ['Pending Requests', 'Validated Requests', 'Rejected Requests'];

  pendingRequests: PurchaseRequest[] = [ 
    { code: 'PR001', name: 'John Doe', department: 'IT', item: 'Laptop', quantity: 1, date: '2023-01-01' },
    { code: 'PR002', name: 'Jane Smith', department: 'HR', item: 'Office Chair', quantity: 5, date: '2023-01-02' },
    { code: 'PR003', name: 'Alice Johnson', department: 'Finance', item: 'Calculator', quantity: 10, date: '2023-01-03' },
    { code: 'PR004', name: 'Bob Brown', department: 'Marketing', item: 'Printer', quantity: 2, date: '2023-01-04' },
    { code: 'PR005', name: 'Charlie Davis', department: 'Sales', item: 'Projector', quantity: 1, date: '2023-01-05' },
    { code: 'PR006', name: 'David Evans', department: 'IT', item: 'Mouse', quantity: 20, date: '2023-01-06' },
    { code: 'PR007', name: 'Eve Foster', department: 'HR', item: 'Desk', quantity: 3, date: '2023-01-07' },
    { code: 'PR008', name: 'Frank Green', department: 'Finance', item: 'Notebook', quantity: 50, date: '2023-01-08' },
    { code: 'PR009', name: 'Grace Harris', department: 'Marketing', item: 'Camera', quantity: 1, date: '2023-01-09' },
    { code: 'PR010', name: 'Hank Irving', department: 'Sales', item: 'Whiteboard', quantity: 2, date: '2023-01-10' }
  ];

  validatedRequests: PurchaseRequest[] = [];
  rejectedRequests: PurchaseRequest[] = [];
  filteredRequests: PurchaseRequest[] = [];

  departments: Department[] = [
    { name: 'IT', value: 'IT' },
    { name: 'HR', value: 'HR' },
    { name: 'Finance', value: 'Finance' },
    { name: 'Marketing', value: 'Marketing' },
    { name: 'Sales', value: 'Sales' }
  ];

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService) {}

  filterRequests() {
    const sourceArray = this.getSourceArray();
    this.filteredRequests = sourceArray.filter(request =>
      (this.searchQuery === '' || 
        request.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.department.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.item.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.date.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (this.selectedDepartment === null || request.department === this.selectedDepartment)
    );
  }

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    this.activeTabHeader = this.tabHeaders[this.activeTabIndex];
    this.filterRequests();
  }

  acceptRequest(request: PurchaseRequest) {
    const index = this.pendingRequests.findIndex(r => r.code === request.code);
    if (index > -1) {
      const [acceptedRequest] = this.pendingRequests.splice(index, 1);
      this.validatedRequests.push(acceptedRequest);
      this.filterRequests();
    }
  }

  rejectRequest(request: PurchaseRequest) {
    const index = this.pendingRequests.findIndex(r => r.code === request.code);
    if (index > -1) {
      const [rejectedRequest] = this.pendingRequests.splice(index, 1);
      this.rejectedRequests.push(rejectedRequest);
      this.filterRequests();
    }
  }

  revalidateRequest(request: PurchaseRequest) {
    const index = this.validatedRequests.findIndex(r => r.code === request.code);
    if (index > -1) {
      const [movedRequest] = this.validatedRequests.splice(index, 1);
      this.pendingRequests.push(movedRequest);
      this.filterRequests();
      this.messageService.add({
        severity: 'success',
        summary: 'Moved to Pending',
        detail: 'Request has been moved back to pending'
      });
    }
  }

  unrejectRequest(request: PurchaseRequest) {
    const index = this.rejectedRequests.findIndex(r => r.code === request.code);
    if (index > -1) {
      const [movedRequest] = this.rejectedRequests.splice(index, 1);
      this.pendingRequests.push(movedRequest);
      this.filterRequests();
      this.messageService.add({
        severity: 'success',
        summary: 'Moved to Pending',
        detail: 'Request has been moved back to pending'
      });
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

  confirmAcceptRequest(request: any) {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Are you sure you want to accept this purchase request?',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.acceptRequest(request);
        this.messageService.add({severity:'success', summary: 'Confirmed', detail: 'Purchase request accepted'});
      }
    });
  }

  confirmRejectRequest(request: any) {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Are you sure you want to reject this purchase request?',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.rejectRequest(request);
        this.messageService.add({severity:'error', summary: 'Confirmed', detail: 'Purchase request rejected'});
      }
    });
  }

  getRequestStatus(request: PurchaseRequest): string {
    if (this.validatedRequests.includes(request)) return 'validated';
    if (this.rejectedRequests.includes(request)) return 'rejected';
    return 'pending';
  }

  isRequestPending(request: any): boolean {
    return this.pendingRequests.includes(request);
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedDepartment = null;
    this.filteredRequests = [...this.getSourceArray()];
  }
  
  private getSourceArray(): PurchaseRequest[] {
    switch (this.activeTabIndex) {
      case 0: return this.pendingRequests;
      case 1: return this.validatedRequests;
      case 2: return this.rejectedRequests;
      default: return [];
    }
  }

  generateReport(header: string) {
    console.log('Generating report for:', header);
    const doc = new jsPDF();
  
    // Add title with active tab header
    doc.setFontSize(18);
    doc.text(`${header} Report`, 10, 10);
  
    // Add filters information
    doc.setFontSize(12);
    doc.text(`Search Query: ${this.searchQuery || 'None'}`, 10, 20);
    doc.text(`Selected Department: ${this.selectedDepartment || 'None'}`, 10, 30);
  
    // Add table
    const headers = [['PR#', 'Requestor', 'Department', 'Item', 'Quantity', 'Date']];
    const requests = this.getSourceArray().map(req => [
      req.code,
      req.name,
      req.department,
      req.item,
      req.quantity,
      req.date,
    ]);
    
    (doc as any).autoTable({
      head: [['PR#', 'Requestor', 'Department', 'Item', 'Quantity', 'Date']],
      body: requests,
    });
    
    doc.save(`PurchaseRequests_${header}.pdf`);
    
  }
}