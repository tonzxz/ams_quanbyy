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
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Router } from '@angular/router';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
@Component({
  selector: 'app-delivery-receipts',
  standalone: true,
  imports: [MaterialModule,CommonModule, StepperModule, TableModule, ButtonModule, ButtonGroupModule, 
    FileUploadModule,DatePickerModule,InputNumberModule, ToastModule, ReactiveFormsModule, TextareaModule,
    FluidModule, TooltipModule, DialogModule, InputTextModule,ConfirmPopupModule],
  providers:[MessageService, ConfirmationService],
  templateUrl: './delivery-receipts.component.html',
  styleUrl: './delivery-receipts.component.scss'
})
export class DeliveryReceiptsComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload: FileUpload;

  activeStep:number = 1;
  receipts:DeliveryReceipt[]=[];
  filteredReceipts:DeliveryReceipt[]=[];

  showReceiptModal:boolean = false;

  form = new FormGroup({
    delivery_date: new FormControl('', [Validators.required]),
    receipt_number:  new FormControl('',[ Validators.required]),
    supplier_name:  new FormControl('',[Validators.required]),
    total_amount:  new FormControl<number|null>( null,[Validators.required, Validators.min(0.001)]),
    notes:  new FormControl(''),
    files:  new FormControl<any>(null,[ Validators.required]), // You can later manage file upload logic in the component
  });

  constructor(
    private router:Router,
    private confirmationService:ConfirmationService,
    private messageService:MessageService,
    private purchaseOrderService:PurchaseOrderService,
    private deliveryService:DeliveryReceiptService){}

  ngOnInit(): void {
    this.fetchItems();
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

  openEditReceiptModal(dr: DeliveryReceipt){
    this.form.reset();
    this.files = [];
    if (this.fileUpload) {
      this.fileUpload.clear(); 
    }
    const date = dr.delivery_date.toString().split('T')[0].split('-');
    this.form.patchValue({
      files:dr.receipts,
      receipt_number: dr.receipt_number,
      supplier_name: dr.supplier_name!,
      delivery_date: `${date[1]}/${date[2]}/${date[0]}`,
      total_amount: Number(dr.total_amount!),
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

  async addReceipt(){
    const dr = this.form.value;
    await this.deliveryService.addReceipt({
      receipts:[
        'assets/images/products/sample-receipt.png'
      ],
      receipt_number: dr.receipt_number!.toUpperCase(),
      supplier_name: dr.supplier_name!,
      delivery_date: new Date(dr.delivery_date!),
      total_amount: dr.total_amount!,
      notes:dr.notes ?? '',
      status:'unverified',
      stocked:false,
    })
    this.form.reset();
    this.files = [];
    if (this.fileUpload) {
      this.fileUpload.clear(); 
    }
    this.showReceiptModal = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully added receipt no. ${dr.receipt_number?.toUpperCase()}` });
    await this.fetchItems();
    this.activeStep = 1;
  }

  async editReceipt(){
    const dr = this.form.value;
    await this.deliveryService.editReceipt({
      id: this.selectedDeliveryReceipt!.id,
      receipts:[
        'assets/images/products/sample-receipt.png'
      ],
      receipt_number: dr.receipt_number!.toUpperCase(),
      supplier_name: dr.supplier_name!,
      delivery_date: new Date(dr.delivery_date!),
      total_amount: dr.total_amount!,
      notes:dr.notes ?? '',
      status:'unverified',
      stocked:false
    })
    this.form.reset();
    this.files = [];
    if (this.fileUpload) {
      this.fileUpload.clear(); 
    }
    this.showReceiptModal = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully edited receipt no. ${dr.receipt_number?.toUpperCase()}` });
    await this.fetchItems();
    this.activeStep = 1;
  }



  nextStep(){
    this.activeStep++;
    switch (this.activeStep) {
      case 1:
        this.filterByStatus('unverified');
        break;
      case 2:
        this.filterByStatus('processing');
        break;
      case 3:
        this.filterByStatus('verified');
        break;
    }
  }
  backStep(){
    this.activeStep--;
    switch (this.activeStep) {
      case 1:
        this.filterByStatus('unverified');
        break;
      case 2:
        this.filterByStatus('processing');
        break;
      case 3:
        this.filterByStatus('verified');
        break;
    }
  }

  async confirmDeleteReceipt(event: Event,id:string){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this receipt?',
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
          await this.deliveryService.deleteReceipt(id)
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully deleted receipt.` });
          await this.fetchItems();
          this.activeStep = 1;
      },
      reject: () => {
          
      }
  });
  }

  async confirmForInspection(event: Event,id:string){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to submit this receipt for inspection?',
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
          await this.deliveryService.moveForInspection(id)
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully submitted receipt for inspection.` });
          await this.fetchItems();
          this.filterByStatus('processing');
          this.activeStep = 2;
      },
      reject: () => {
          
      }
  });
  }

  async proceedToStocking(dr:DeliveryReceipt){
    this.router.navigate(['/supply-management/stocking'])
  }
  
  async fetchItems(){
    this.receipts = await this.deliveryService.getAll();
    this.filterByStatus('unverified');
  }
}
