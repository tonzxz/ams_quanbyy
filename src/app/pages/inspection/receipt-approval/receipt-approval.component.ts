import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { DeliveryReceipt, DeliveryReceiptService } from 'src/app/services/delivery-receipt.service';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { FluidModule } from 'primeng/fluid';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FileUpload, FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Router } from '@angular/router';
import { LottieAnimationComponent } from '../../ui-components/lottie-animation/lottie-animation.component';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { RequisitionService } from 'src/app/services/requisition.service';
import { DeliveredItem, DeliveryItem } from '../../shared/delivered-items/delivered-items.interface';
import { PdfGeneratorService } from 'src/app/services/pdf-generator.service';
import { ChecklistModalComponent } from './checklist-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-receipt-approval',
  standalone: true,
  imports: [MaterialModule,CommonModule, StepperModule, TableModule, ButtonModule, ButtonGroupModule, 
    LottieAnimationComponent,InputTextModule, InputIconModule,IconFieldModule, FormsModule,
    FileUploadModule,DatePickerModule,InputNumberModule, ToastModule, ReactiveFormsModule, TextareaModule,
    FluidModule, TooltipModule, DialogModule, InputTextModule,ConfirmPopupModule],
  providers:[MessageService, ConfirmationService],
  templateUrl: './receipt-approval.component.html',
  styleUrl: './receipt-approval.component.scss'
})

export class ReceiptApprovalComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload: FileUpload;
  @ViewChild('dt') dt!: Table;

  activeStep:number = 1;
  receipts:DeliveryReceipt[]=[];
  filteredReceipts:DeliveryReceipt[]=[];

  searchValue:string='';

  showReceiptModal:boolean = false;

  form = new FormGroup({
    notes:  new FormControl(''),
    files:  new FormControl<any>(null,[ Validators.required]), // You can later manage file upload logic in the component
  });

  isLoading: boolean = false;

  constructor(
    private router:Router,
    private requisitionService:RequisitionService,
    private confirmationService:ConfirmationService,
    private dialog: MatDialog,
    private messageService:MessageService,
    private pdfService:PdfGeneratorService,
    private deliveryService:DeliveryReceiptService){}

  ngOnInit(): void {
    this.fetchItems();
  }
  
   async viewChecklist(item: DeliveryReceipt) {
    const requisition = await this.requisitionService.getRequisitionById(item.purchase_order??'#');
    if(!requisition) return;
    const dialogRef = this.dialog.open(ChecklistModalComponent, {
      width: '800px',
      data: { ...requisition }
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (result) {
        await this.requisitionService.updateRequisition(requisition);
        this.fetchItems();
        this.filterByStatus('processing');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully updated receipt checklist.` });
      }
    });
  }


  openReceiptModal(){
    this.form.reset();
    this.files = [];
    if (this.fileUpload) {
      this.fileUpload.clear(); 
    }
    this.selectedDeliveryReceipt = undefined;
    this.showReceiptModal = true;
  }

  selectedDeliveryReceipt?:DeliveryReceipt;

  openUploadReportsModal(dr: DeliveryReceipt){
    this.form.reset();
    this.files = [];
    if (this.fileUpload) {
      this.fileUpload.clear(); 
    }
    this.form.patchValue({
      files:dr.receipts,
      notes:dr.notes ?? '',
    })
    this.selectedDeliveryReceipt = dr;
    this.showReceiptModal = true;
  }

  filterByStatus(status:'unverified'|'processing'|'verified'){
    this.filteredReceipts = this.receipts.filter(r => r.status == status);
  }

  getSeverityFromStatus(status:'unverified'|'processing'|'verified'){
    return status == 'verified' ? 'success' : 'secondary';
  }

  files:File[] = [];
  onSelectedFiles(event:any) {
    this.files = event.currentFiles ?? [],
    this.form.patchValue({
      files: event.currentFiles,
    });
  }

  async uploadReports(){
    const dr = this.form.value;
    this.form.reset();
    this.files = [];
    if (this.fileUpload) {
      this.fileUpload.clear(); 
    }
    this.showReceiptModal = false;
    await this.deliveryService.moveToRejected(this.selectedDeliveryReceipt?.id??'#')
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully rejected receipt.` });
    await this.fetchItems();
    this.filterByStatus('processing');
    this.activeStep = 1;
    await this.fetchItems();
    this.activeStep = 1;
  }

  


  nextStep(){
    this.activeStep++;
    switch (this.activeStep) {
      case 1:
        this.filterByStatus('processing');
        break;
      case 2:
        this.filterByStatus('verified');
        break;
    }
  }
  backStep(){
    this.activeStep--;
    switch (this.activeStep) {
      case 1:
        this.filterByStatus('processing');
        break;
      case 2:
        this.filterByStatus('verified');
        break;
    }
  }

  async confirmToVerification(event: Event,receipt:DeliveryReceipt){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to submit this receipt to verified receipts?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true
      },
      acceptButtonProps: {
          label: 'Confirm'
      },
      accept: async () => {
          
          // const req = await this.requisitionService.getRequisitionById(receipt.purchase_order!);
          // const allSequences = await this.requisitionService.getAllApprovalSequences();
    
          // const currentSequenceIndex = allSequences.findIndex(seq=>seq.id==req?.approvalSequenceId)
          // if(currentSequenceIndex + 1 < allSequences.length){
          //   req!.approvalSequenceId = allSequences[currentSequenceIndex + 1].id;
          //   req!.currentApprovalLevel = allSequences[currentSequenceIndex + 1].level;
          // }else{
          //   req!.approvalSequenceId = undefined;
          //   req!.currentApprovalLevel = 0;
          //   req!.approvalStatus = 'Approved'; 
          // }
          // await this.requisitionService.updateRequisition(req!);
          const requisition = await this.requisitionService.getRequisitionById(receipt.purchase_order??'#');
          if(requisition){
            if(requisition?.products.length > requisition?.products.filter(product=>product.status == 'delivered').length){
              this.messageService.add({ severity: 'error', summary: 'Failed', detail: `Purchase Order checklist has not been cleared` });
              return;
            }
          }
          await this.deliveryService.moveToVerified(receipt.id!)
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully submitted receipt to verified receipts.` });
          await this.fetchItems();
          this.filterByStatus('verified');
          this.activeStep = 2;
      },
      reject: () => {
          
      }
    });
  }

  async generateInspectionReport(receipt:DeliveryReceipt){
    const requisition = await this.requisitionService.getRequisitionById(receipt.purchase_order??'#');
    if(requisition){
     
      const deliveredItem:DeliveredItem={
        id : `IAR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`,
        supplierName: receipt.supplier_name,
        supplierId: receipt.supplier_id,
        dateDelivered: new Date(receipt.delivery_date),
        department: receipt.department_name??'N/A',
        documentUrl: '',
        status:'accepted',
        items :  requisition.products.reduce((acc:DeliveryItem[], curr)=>{
          return [...acc,
            {
                id: curr.id,
                name: curr.name,
                quantity: curr.quantity,
                status:  'delivered',
                isDelivered: true,
                remarks: '',
                dateChecked: new Date(),
            } as DeliveryItem
          ]
        },[]),
        totalAmount: receipt.total_amount,
        poNumber: receipt.purchase_order,
        remarks: 'asd',
        lastUpdated: new Date()
      };
     
      const blob =  this.pdfService.generateInspectionReport(deliveredItem);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${deliveredItem.id}.pdf`;
      link.click();
    }

  }

  async confirmToReject(event: Event,id:string){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to reject this receipt?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true
      },
      acceptButtonProps: {
          label: 'Confirm'
      },
      accept: async () => {
          await this.deliveryService.moveToRejected(id)
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully rejected receipt.` });
          await this.fetchItems();
          this.filterByStatus('processing');
          this.activeStep = 1;
      },
      reject: () => {
          
      }
    });
  }

  async fetchItems() {
    try {
      this.isLoading = true;
      this.receipts = await this.deliveryService.getAll();
      this.filterByStatus('processing');
    } catch (error: any) {
      console.error('Error fetching delivery receipts:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to fetch delivery receipts. Please try again later.',
        life: 5000,
        closable: true,
        key: 'fetchError'
      });
      this.receipts = [];
      this.filteredReceipts = [];
    } finally {
      this.isLoading = false;
    }
  }
}
