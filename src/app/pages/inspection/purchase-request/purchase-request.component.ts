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
import { PurchaseRequestService } from 'src/app/services/purchase-request.service';
import { PurchaseRequest, PurchaseRequestStatus } from './purchase-request.interface';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { CalendarModule } from 'primeng/calendar';


@Component({
    selector: 'app-purchase-request',
    templateUrl: './purchase-request.component.html',
    styleUrls: ['./purchase-request.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        TableModule,
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
        ButtonGroupModule
    ],
    providers: [MessageService, ConfirmationService, PurchaseRequestService]
})
export class PurchaseRequestComponent implements OnInit {
    displayModal = false;
    selectedRequest: PurchaseRequest | null = null;
    currentRequest: PurchaseRequest;
    searchQuery = '';
    selectedDepartment: string | null = null;
    activeTabIndex = 0;
    saiDate: Date;  
    alobsDate: Date;  
    isEditMode = false;
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
        await this.loadData()
        this.computeTotalAmount()
        this.filterRequests()
    }


    private categorizeRequests() {
        this.pendingRequests = this.allRequests.filter(r => r.status === PurchaseRequestStatus.Pending);
        this.validatedRequests = this.allRequests.filter(r => r.status === PurchaseRequestStatus.Approved);
        this.rejectedRequests = this.allRequests.filter(r => r.status === PurchaseRequestStatus.Rejected);
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
                request.requestedBy.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                request.requisitioningOffice.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
            (this.selectedDepartment === null || request.requisitioningOffice === this.selectedDepartment)
        );
    }
    private computeItemTotalCost(): void {
        if (this.currentRequest?.items) {
            this.currentRequest.items.forEach(item => {
                item.totalCost = item.qty * item.unitCost
            })
        }
    }
    
    // Function to compute the total amount of all items
    private computeTotalAmount(): void {
        if (this.currentRequest?.items) {
            this.computeItemTotalCost() // Ensure item costs are updated first
            this.currentRequest.totalAmount = this.currentRequest.items.reduce((sum, item) => sum + item.totalCost, 0)
        }
    }
    
    // Ensure calculations are re-run when data is loaded or modified
    private async loadData() {
        this.allRequests = await this.prService.getAll()
        if (this.allRequests.length > 0) {
            this.currentRequest = this.allRequests[0]
        }
        this.computeTotalAmount() // Recalculate total amounts
        this.categorizeRequests()
    }
    
    // Function to handle dynamic input changes in the table
    onQuantityOrCostChange() {
        this.computeTotalAmount()
    }

    onTabChange(event: any) {
        this.activeTabIndex = event.index;
        this.activeTabHeader = this.tabHeaders[this.activeTabIndex];
        this.filterRequests();
    }

    async approve() {
        try {
            await this.prService.updateStatus(this.currentRequest.id, PurchaseRequestStatus.Approved);
            this.currentRequest.status = PurchaseRequestStatus.Approved;
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Purchase request approved'
            });
            await this.refreshData();
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to approve purchase request'
            });
        }
    }

    async reject() {
        try {
            await this.prService.updateStatus(this.currentRequest.id, PurchaseRequestStatus.Rejected);
            this.currentRequest.status = PurchaseRequestStatus.Rejected;
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Purchase request rejected'
            });
            await this.refreshData();
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to reject purchase request'
            });
        }
    }

    async acceptRequest(request: PurchaseRequest) {
        request.status = PurchaseRequestStatus.Approved;
        await this.refreshData();
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Purchase request accepted'
        });
    }

    async rejectRequest(request: PurchaseRequest) {
        request.status = PurchaseRequestStatus.Rejected;
        await this.refreshData();
        this.messageService.add({
            severity: 'error',
            summary: 'Success',
            detail: 'Purchase request rejected'
        });
    }

    async revalidateRequest(request: PurchaseRequest) {
        request.status = PurchaseRequestStatus.Pending;
        await this.refreshData();
        this.messageService.add({
            severity: 'success',
            summary: 'Moved to Pending',
            detail: 'Request has been moved back to pending'
        });
    }

    async unrejectRequest(request: PurchaseRequest) {
        request.status = PurchaseRequestStatus.Pending;
        await this.refreshData();
        this.messageService.add({
            severity: 'success',
            summary: 'Moved to Pending',
            detail: 'Request has been moved back to pending'
        });
    }
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        if (!this.isEditMode) {
            // Save changes when exiting edit mode
            this.saveChanges();
        }
    }
    
    async saveChanges() {
        try {
            await this.prService.update(this.currentRequest);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Changes saved successfully'
            });
            await this.refreshData();
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save changes'
            });
        }
    }
    
    addNewItem() {
        const newItem = {
            itemNo: (this.currentRequest.items.length + 1).toString(),
            unit: '',
            description: '',
            qty: 0,
            unitCost: 0,
            totalCost: 0
        };
        this.currentRequest.items.push(newItem);
    }
    
    removeItem(index: number) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to remove this item?',
            accept: () => {
                this.currentRequest.items.splice(index, 1);
                // Recalculate item numbers
                this.currentRequest.items.forEach((item, idx) => {
                    item.itemNo = (idx + 1).toString();
                });
                this.computeTotalAmount();
            }
        });
    }

    private async refreshData() {
        await this.loadData();
        this.filterRequests();
    }
    async exportToPDF(): Promise<void> {
        console.log('Export function called')
        const element = document.querySelector('.pr-container')
    
        if (!element) {
            console.error('No element found with class pr-container')
            return
        }
    
        try {
            // Hide export button before capturing
            const exportBtn = document.querySelector('.export-button')
            if (exportBtn) (exportBtn as HTMLElement).style.display = 'none'
    
            // Store original styles
            const originalBackground = (element as HTMLElement).style.background
            ;(element as HTMLElement).style.background = 'white'
    
            console.log('Starting html2canvas')
    
            const canvas = await html2canvas(element as HTMLElement, {
                scale: 2, // Higher scale for better resolution
                useCORS: true,
                logging: true,
                backgroundColor: '#ffffff',
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            })
    
            console.log('Canvas created')
    
            // Restore styles
            if (exportBtn) (exportBtn as HTMLElement).style.display = 'flex'
            ;(element as HTMLElement).style.background = originalBackground
    
            const imgData = canvas.toDataURL('image/png', 1.0)
            const pdf = new jsPDF({
                orientation: 'landscape', // Landscape mode
                unit: 'mm',
                format: 'a4'
            })
    
            // Calculate dimensions for A4 landscape page
            const imgWidth = 297 // A4 width in mm (landscape)
            const pageHeight = 210 // A4 height in mm (landscape)
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            let heightLeft = imgHeight
            let position = 0
    
            console.log('Creating PDF in landscape')
    
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
    
            while (heightLeft > 0) {
                position -= pageHeight
                pdf.addPage()
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pageHeight
            }
    
            console.log('Saving PDF in landscape')
            pdf.save(`PR-${this.currentRequest?.prNo || Date.now()}.pdf`)
        } catch (error) {
            console.error('Error in exportToPDF:', error)
        }
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
        return request.status === PurchaseRequestStatus.Pending;
    }
}