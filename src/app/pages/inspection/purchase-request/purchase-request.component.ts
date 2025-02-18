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
        if (this.allRequests.length > 0) {
            this.currentRequest = this.allRequests[0];
        }
        this.categorizeRequests();
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

    private async refreshData() {
        await this.loadData();
        this.filterRequests();
    }

    generatePDF() {
        const element = document.querySelector('.pr-container') as HTMLElement // Ensure selection
    
        if (!element) {
            console.error('PR container not found!')
            return
        }
    
        html2canvas(element, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('landscape', 'mm', 'a4') // Landscape mode
    
            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
    
            const imgWidth = pageWidth - 20 // Margin
            const imgHeight = (canvas.height * imgWidth) / canvas.width
    
            let position = 10 // Start position for the first page
    
            if (imgHeight > pageHeight) {
                // Multi-page handling
                let currentHeight = imgHeight
                let yPosition = 10
    
                while (currentHeight > 0) {
                    pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight)
    
                    currentHeight -= pageHeight - 20 
                    yPosition -= pageHeight // Move to next page
    
                    if (currentHeight > 0) {
                        pdf.addPage('landscape') // Add a new page
                        yPosition = 10 // Reset for new page
                    }
                }
            } else {
                // Single-page PDF
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
            }
    
            pdf.save(`PR-${this.currentRequest.prNo}.pdf`)
        })
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