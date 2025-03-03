import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { ImageModule } from 'primeng/image';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Approver, Users, PurchaseRequest, } from 'src/app/schema/schema';
import { CrudService } from 'src/app/services/crud.service';
import { PurchaseRequestData } from 'src/app/schema/dummy'; // Import dummy data
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-purchase-request',
  templateUrl: './purchase-request.component.html',
  styleUrls: ['./purchase-request.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    RouterModule,
    TableModule,
    CalendarModule,
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
    ButtonGroupModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class PurchaseRequestComponent implements OnInit {
  displayModal = false;
  selectedRequest: PurchaseRequest | null = null;
  searchQuery = '';
  selectedDepartment: string | null = null;
  activeTabIndex = 0;
  isEditMode = false;
  activeTabHeader = 'Pending Requests';
  tabHeaders = ['Pending Requests', 'Validated Requests', 'Rejected Requests'];
  currentRequest!: PurchaseRequest;
  allRequests: PurchaseRequest[] = PurchaseRequestData; // Use dummy data directly
  pendingRequests: PurchaseRequest[] = [];
  validatedRequests: PurchaseRequest[] = [];
  rejectedRequests: PurchaseRequest[] = [];

  filteredPendingRequests: PurchaseRequest[] = [];
  filteredValidatedRequests: PurchaseRequest[] = [];
  filteredRejectedRequests: PurchaseRequest[] = [];

  departments = [
    { name: 'Department 1', value: 'Department 1' },
    { name: 'Department 2', value: 'Department 2' },
    { name: 'Department 3', value: 'Department 3' },
  ];

  approvers: (Approver & { approver: string })[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private crudService: CrudService
  ) {}

  async ngOnInit() {
    try {
      const users = await this.crudService.getAll(Users);
      this.approvers = (await this.crudService.getAll(Approver))
        .filter((a) => a.entity_id == '2' && users.find((u) => u.id == a.user_id))
        .sort((a, b) => a.approval_order - b.approval_order)
        .map((a) => {
          const user = users.find((u) => u.id == a.user_id)!;
          return {
            ...a,
            approver: user.fullname,
          };
        });

      this.categorizeRequests();

      this.activatedRoute.queryParams.subscribe((params) => {
        if (params['prNo']) {
          const foundRequest = this.allRequests.find((pr) => pr.prNo === params['prNo']);
          if (foundRequest) {
            this.currentRequest = foundRequest;
            this.computeTotalAmount();
          }
        } else if (this.allRequests.length > 0) {
          this.currentRequest = this.allRequests[0];
        }
      });

      if (!this.currentRequest.coaInfo) {
        this.currentRequest.coaInfo = {
          annexNo: 'Annex G-6',
          circularNo: 'COA Circular No. 2001-04, S. 2001',
        };
      }
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to initialize component',
      });
    }
  }

  private categorizeRequests() {
    this.pendingRequests = this.allRequests.filter((r) => r.status === PurchaseRequest.Pending);
    this.validatedRequests = this.allRequests.filter((r) => r.status === PurchaseRequest.Approved);
    this.rejectedRequests = this.allRequests.filter((r) => r.status === PurchaseRequest.Rejected);
    this.filterRequests();
  }

  private computeTotalAmount(): void {
    if (this.currentRequest?.items) {
      this.currentRequest.totalAmount = this.currentRequest.items.reduce((sum, item) => sum + item.qty * item.unitCost, 0);
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.saveChanges();
    }
  }

  saveChanges() {
    const index = this.allRequests.findIndex((pr) => pr.prNo === this.currentRequest.prNo);
    if (index >= 0) {
      this.allRequests[index] = this.currentRequest;
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Changes saved successfully',
    });
    this.categorizeRequests();
  }

  addNewItem() {
    const newItem = {
      itemNo: (this.currentRequest.items.length + 1).toString(),
      unit: '',
      description: '',
      qty: 0,
      unitCost: 0,
      totalCost: 0,
    };
    this.currentRequest.items.push(newItem);
    this.computeTotalAmount();
  }

  removeItem(index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this item?',
      accept: () => {
        this.currentRequest.items.splice(index, 1);
        this.currentRequest.items.forEach((item, idx) => {
          item.itemNo = (idx + 1).toString();
        });
        this.computeTotalAmount();
      },
    });
  }

  filterRequests() {
    this.filteredPendingRequests = this.pendingRequests.filter((request) =>
      (this.searchQuery === '' ||
        request.prNo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.requestedBy.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.requisitioningOffice.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (this.selectedDepartment === null || request.requisitioningOffice === this.selectedDepartment)
    );

    this.filteredValidatedRequests = this.validatedRequests.filter((request) =>
      (this.searchQuery === '' ||
        request.prNo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.requestedBy.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.requisitioningOffice.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (this.selectedDepartment === null || request.requisitioningOffice === this.selectedDepartment)
    );

    this.filteredRejectedRequests = this.rejectedRequests.filter((request) =>
      (this.searchQuery === '' ||
        request.prNo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.requestedBy.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.requisitioningOffice.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (this.selectedDepartment === null || request.requisitioningOffice === this.selectedDepartment)
    );
  }

  onQuantityOrCostChange() {
    this.computeTotalAmount();
  }

  async exportToPDF(): Promise<void> {
    const element = document.querySelector('.pr-container');
    if (!element) {
      console.error('No element found with class pr-container');
      return;
    }

    try {
      const exportBtn = document.querySelector('.export-button');
      if (exportBtn) (exportBtn as HTMLElement).style.display = 'none';

      const originalBackground = (element as HTMLElement).style.background;
      (element as HTMLElement).style.background = 'white';

      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      if (exportBtn) (exportBtn as HTMLElement).style.display = 'flex';
      (element as HTMLElement).style.background = originalBackground;

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297;
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`PR-${this.currentRequest?.prNo || Date.now()}.pdf`);
    } catch (error) {
      console.error('Error in exportToPDF:', error);
    }
  }

  goBack(): void {
    this.router.navigate(['/shared/app-pr-shared']);
  }
}