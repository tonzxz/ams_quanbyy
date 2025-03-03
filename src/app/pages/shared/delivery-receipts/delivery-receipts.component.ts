import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
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
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { LottieAnimationComponent } from '../../ui-components/lottie-animation/lottie-animation.component';
import {  IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Supplier, SuppliersService } from 'src/app/services/suppliers.service';
import { SelectModule } from 'primeng/select';
import { Department, DepartmentService } from 'src/app/services/departments.service';
import { Requisition, RequisitionService } from 'src/app/services/requisition.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ProgressTableComponent, ProgressTableData } from 'src/app/components/progress-table/progress-table.component';
import { PdfGeneratorService } from 'src/app/services/pdf-generator.service';


@Component({
  selector: 'app-delivery-receipts',
  standalone: true,
  imports: [MaterialModule,CommonModule, StepperModule, TableModule, ButtonModule, ButtonGroupModule, 
    InputTextModule, InputIconModule,IconFieldModule, FormsModule, SelectModule,
    FileUploadModule,DatePickerModule,InputNumberModule, ToastModule, ReactiveFormsModule, TextareaModule,
    FluidModule, TooltipModule, DialogModule, InputTextModule,ConfirmPopupModule, ProgressTableComponent],
  providers:[MessageService, ConfirmationService, CurrencyPipe, DatePipe],
  templateUrl: './delivery-receipts.component.html',
  styleUrl: './delivery-receipts.component.scss'
})
export class DeliveryReceiptsComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload: FileUpload;

  receipts:DeliveryReceipt[]=[];
  suppliers:Supplier[];
  departments:Department[];
  requisitions: Requisition[];

  showReceiptModal:boolean = false;

  form = new FormGroup({
    delivery_date: new FormControl('', [Validators.required]),
    receipt_number:  new FormControl('',[ Validators.required]),
    supplier:  new FormControl<Supplier|null>(null,[Validators.required]),
    department:  new FormControl<Department|null>(null,[Validators.required]),
    purchase_order: new FormControl<Requisition|null>(null,[Validators.required]),
    total_amount:  new FormControl<number|null>( null,[Validators.required, Validators.min(0.001)]),
    notes:  new FormControl(''),
    files:  new FormControl<any>(null,[ Validators.required]), // You can later manage file upload logic in the component
  });

  constructor(
    private router:Router,
    private requisitionService:RequisitionService,
    private confirmationService:ConfirmationService,
    private datePipe:DatePipe,
    private currencyPipe:CurrencyPipe,
    private messageService:MessageService,
    private departmentService:DepartmentService,
    private supplierService:SuppliersService,
    private pdfService:PdfGeneratorService,
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
      supplier: this.suppliers.find(supplier => supplier.id ==dr.supplier_id),
      department: this.departments.find(department => department.id ==dr.department_id),
      purchase_order: this.requisitions.find(req=>req.id == dr.purchase_order),
      delivery_date: `${date[1]}/${date[2]}/${date[0]}`,
      total_amount: Number(dr.total_amount!),
      notes:dr.notes ?? '',
    })
    this.selectedDeliveryReceipt = dr;
    this.showReceiptModal = true;
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
      supplier_name: dr.supplier!.name,
      supplier_id: dr.supplier!.id!,
      department_id: dr.department!.id!,
      department_name: dr.department!.name!,
      delivery_date: new Date(dr.delivery_date!),
      total_amount: dr.total_amount!,
      purchase_order: dr.purchase_order?.id,
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
    this.progressTable.activeStep = 0;
  }

  async editReceipt(){
    const dr = this.form.value;
    await this.deliveryService.editReceipt({
      id: this.selectedDeliveryReceipt!.id,
      receipts:[
        'assets/images/products/sample-receipt.png'
      ],
      receipt_number: dr.receipt_number!.toUpperCase(),
      supplier_name: dr.supplier!.name,
      supplier_id: dr.supplier!.id!,
      department_id: dr.department!.id!,
      department_name: dr.department!.name!,
      delivery_date: new Date(dr.delivery_date!),
      total_amount: dr.total_amount!,
      purchase_order: dr.purchase_order?.id,
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
    this.progressTable.activeStep = 0;
  }


  async confirmDeleteReceipt(event: Event,dr:DeliveryReceipt){
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
          await this.deliveryService.deleteReceipt(dr.id!)
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully deleted receipt.` });
          await this.fetchItems();
          this.progressTable.activeStep = 0;
      },
      reject: () => {
          
      }
  });
  }

  async confirmForInspection(event: Event,dr:DeliveryReceipt){
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
          await this.deliveryService.moveForInspection(dr.id!)
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully submitted receipt for inspection.` });
          await this.fetchItems();
          this.progressTable.activeStep = 2;
      },
      reject: () => {
          
      }
    });
  }

  async proceedToStocking(){
    this.router.navigate(['/supply-management/stocking'])
  }

  progressTable: ProgressTableData<DeliveryReceipt,'status'> = {
      title: 'Delivery Receipts',
      description: 'Track and manage delivery receipts in this section.',
      topActions: [
        {
          icon: 'pi pi-plus',
          function: ()=> this.openReceiptModal(),
          label:'Add Receipt'
        },
      ],
      columns: {
        receipt_number:'Receipt No.',
        supplier_name: 'Supplier',
        department_name: 'Department',
        delivery_date: 'Delivery Date',
        total_amount: 'Total Amount',
        notes: 'Notes'
      },
      formatters:{
        total_amount: (value)=>this.currencyPipe.transform(value?.toString(), 'PHP', 'symbol', '1.2-2') ?? '',
        delivery_date: (value)=>this.datePipe.transform(value?.toString(),'shortDate') ?? ''
      },
      activeStep:0,
      stepField:'status',
      steps: [
       {
        id:'unverified',
        label:'Unverified',
        icon:'pi pi-inbox'
       },
       {
          id:'processing',
          label:'Processing',
          icon:'pi pi-spinner-dotted pi-spin',
       },
       {
        id:'verified',
        label:'Verified',
        icon:'pi pi-verified',
       },
      ],
      data:[],
      rowActions: [
        // Unverified
        {
          hidden: (dr:DeliveryReceipt) =>  dr.status !='unverified',
          icon:'pi pi-file-pdf',
          shape:'rounded',
          tooltip:'Click to export receipt PDF',
          function: (event:Event, dr:DeliveryReceipt)=>this.pdfService.generateDeliveryReceipt(dr)
        },
        {
          hidden: (dr:DeliveryReceipt) =>  dr.status !='unverified',
          icon:'pi pi-pencil',
          shape:'rounded',
          tooltip: 'Click to edit receipt',
          function: (event:Event, dr:DeliveryReceipt)=>this.openEditReceiptModal(dr)
        },
        {
          hidden: (dr:DeliveryReceipt) =>  dr.status !='unverified',
          icon:'pi pi-trash',
          color:'danger',
          shape:'rounded',
          tooltip: 'Click to delete receipt',
          confirmation: 'Are you sure you want to delete this receipt?',
          function: (event:Event, dr:DeliveryReceipt)=>this.confirmDeleteReceipt(event,dr)
        },
        {
          hidden: (dr:DeliveryReceipt) =>  dr.status !='unverified',
          icon:'pi pi-arrow-right',
          shape:'rounded',
          color:'success',
          tooltip: 'Click to submit this receipt for inspection',
          confirmation: 'Are you sure you want to submit this for inspection?',
          function:  (event:Event, dr:DeliveryReceipt)=>this.confirmForInspection(event,dr)
        },
        // Verified
        {
          hidden: (dr:DeliveryReceipt) => !dr.stocked || dr.status !='verified',
          disabled: (dr:DeliveryReceipt)=> true,
          icon:'pi pi-box',
          shape:'rounded',
          color:'secondary',
        },
        {
          hidden: (dr:DeliveryReceipt) => dr.stocked || dr.status !='verified',
          icon:'pi pi-arrow-right',
          shape:'rounded',
          color:'success',
          tooltip: 'Click to proceed to stocking section',
          function:  (event:Event, dr:DeliveryReceipt)=>this.proceedToStocking()
        }
      ]
    }
  
  async fetchItems(){
    this.receipts = await this.deliveryService.getAll();
    this.progressTable.data = this.receipts;
    this.suppliers = await this.supplierService.getAll();
    this.departments = await this.departmentService.getAllDepartments();
    const allRequisitions = await this.requisitionService.getAllRequisitions();
    const allSequences = await this.requisitionService.getAllApprovalSequences();

    this.requisitions = allRequisitions
      .map((req) => {
        // const typeSequences = allSequences.filter(
        //   (seq) => seq.type === (req.currentApprovalLevel <= 4 ? 'procurement' : 'supply')
        // );

        const currentSequence = allSequences.find(
          (seq) => seq.id === req.approvalSequenceId
        );

        return {
          ...req,
          approvalSequenceDetails: currentSequence
,
        };
      })
      .filter((req) => {
        if(this.receipts.find(dr=>dr.purchase_order == req.id)){
          return false;
        }
        return req.approvalSequenceDetails && (req.approvalSequenceDetails?.roleCode === 'supply' || req.approvalSequenceDetails?.roleCode === 'inspection')
      });
  }



  
}
