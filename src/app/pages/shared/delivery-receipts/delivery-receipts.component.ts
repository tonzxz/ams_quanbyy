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
import { KeyFilterModule } from 'primeng/keyfilter';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-delivery-receipts',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule, 
    StepperModule, 
    TableModule, 
    ButtonModule, 
    ButtonGroupModule,
    InputTextModule, 
    InputIconModule, 
    IconFieldModule, 
    FormsModule, 
    SelectModule,
    FileUploadModule, 
    DatePickerModule, 
    InputNumberModule, 
    ToastModule, 
    ReactiveFormsModule, 
    TextareaModule,
    FluidModule, 
    TooltipModule, 
    DialogModule, 
    InputTextModule, 
    ConfirmPopupModule, 
    ProgressTableComponent, 
    KeyFilterModule, 
    LottieAnimationComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MessageService, ConfirmationService, CurrencyPipe, DatePipe],
  templateUrl: './delivery-receipts.component.html',
  styleUrl: './delivery-receipts.component.scss'
})
export class DeliveryReceiptsComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload: FileUpload;

  isLoading: boolean = false;

  receipts:DeliveryReceipt[]=[];
  suppliers:Supplier[];
  departments:Department[];
  requisitions: Requisition[];

  showReceiptModal:boolean = false;

  form = new FormGroup({
    delivery_date: new FormControl('', [Validators.required]),
    receipt_number: new FormControl('', [Validators.required]),
    supplier: new FormControl<Supplier|null>(null),
    supplier_tin: new FormControl('', [Validators.required]),
    department: new FormControl<Department|null>(null),
    purchase_order: new FormControl<Requisition|null>(null),
    total_amount: new FormControl<number|null>(null, [Validators.required, Validators.min(0.001)]),
    notes: new FormControl(''),
    files: new FormControl<any>(null),
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
      files: dr.receipts,
      receipt_number: dr.receipt_number,
      supplier: this.suppliers.find(supplier => supplier.id == dr.supplier_id),
      supplier_tin: dr.supplier_tin,
      department: this.departments.find(department => department.id == dr.department_id),
      purchase_order: this.requisitions.find(req => req.id == dr.purchase_order),
      delivery_date: `${date[1]}/${date[2]}/${date[0]}`,
      total_amount: Number(dr.total_amount!),
      notes: dr.notes ?? '',
    });
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

  formatTIN(event: any) {
    // Get the raw input value
    const input = event.target.value;
    
    // Remove all non-digit characters
    const digitsOnly = input.replace(/\D/g, '');
    
    // Format with hyphens
    let formatted = '';
    for (let i = 0; i < digitsOnly.length && i < 12; i++) {
      if (i > 0 && i % 3 === 0) {
        formatted += '-';
      }
      formatted += digitsOnly[i];
    }
    
    // Set the formatted value directly
    event.target.value = formatted;
    
    // Update the form control
    this.form.get('supplier_tin')?.setValue(formatted);
  }

  async addReceipt(){
    const dr = this.form.value;
    await this.deliveryService.addReceipt({
      receipt_number: dr.receipt_number!.toUpperCase(),
      supplier_name: dr.supplier?.name || 'Test Supplier',
      supplier_id: dr.supplier?.id || '00000000000000000000000000000000',
      supplier_tin: dr.supplier_tin || '000-000-000-000',
      department_id: dr.department?.id || '00000000000000000000000000000000',
      department_name: dr.department?.name || 'Test Department',
      delivery_date: new Date(dr.delivery_date || new Date()),
      total_amount: dr.total_amount || 0,
      purchase_order: dr.purchase_order?.id,
      notes: dr.notes || '',
      status: 'unverified',
      stocked: false,
      receipts: [],
    }, this.files || []);
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
      receipt_number: dr.receipt_number!.toUpperCase(),
      supplier_name: dr.supplier!.name,
      supplier_id: dr.supplier!.id!,
      supplier_tin: dr.supplier_tin!,
      department_id: dr.department!.id!,
      department_name: dr.department!.name!,
      delivery_date: new Date(dr.delivery_date!),
      total_amount: dr.total_amount!,
      purchase_order: dr.purchase_order?.id,
      notes: dr.notes ?? '',
      status: 'unverified',
      stocked: false,
      receipts: [],
    });
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


  async confirmDeleteReceipt(event: Event, dr: DeliveryReceipt) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete receipt ${dr.receipt_number}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this.deliveryService.deleteReceipt(dr.id!);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Receipt ${dr.receipt_number} deleted successfully`
          });
          await this.fetchItems();
        } catch (error) {
          console.error('Error deleting receipt:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete receipt'
          });
        }
      }
    });
  }

  async confirmForInspection(event: Event, dr: DeliveryReceipt) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to submit receipt ${dr.receipt_number} for inspection?`,
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this.deliveryService.moveForInspection(dr.id!);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Receipt ${dr.receipt_number} submitted for inspection`
          });
          await this.fetchItems();
          this.progressTable.activeStep = 1; // Move to processing tab
        } catch (error) {
          console.error('Error submitting for inspection:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit receipt for inspection'
          });
        }
      }
    });
  }

  proceedToStocking() {
    this.router.navigate(['/supply-unit/stocking']);
  }

  progressTable: ProgressTableData<DeliveryReceipt,'status'> = {
      title: 'Delivery Receipts',
      description: 'Track and manage delivery receipts in this section.',
      topAction: {
        icon: 'pi pi-plus',
        function: ()=> this.openReceiptModal(),
        label:'Add Receipt'
      },
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
        icon:'pi pi-inbox',
        actions: [
          {
            icon:'pi pi-file-pdf',
            shape:'rounded',
            tooltip:'Click to export receipt PDF',
            function: (event:Event, dr:DeliveryReceipt)=>this.pdfService.generateDeliveryReceipt(dr)
          },
          {
            icon:'pi pi-pencil',
            shape:'rounded',
            tooltip: 'Click to edit receipt',
            function: (event:Event, dr:DeliveryReceipt)=>this.openEditReceiptModal(dr)
          },
          {
            icon:'pi pi-trash',
            color:'danger',
            shape:'rounded',
            tooltip: 'Click to delete receipt',
            function: (event:Event, dr:DeliveryReceipt)=>this.confirmDeleteReceipt(event,dr)
          },
          {
            icon:'pi pi-arrow-right',
            shape:'rounded',
            color:'success',
            tooltip: 'Click to submit this receipt for inspection',
            function:  (event:Event, dr:DeliveryReceipt)=>this.confirmForInspection(event,dr)
          }
        ]
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
        actions: [
          {
            hidden: (dr:DeliveryReceipt) => !dr.stocked,
            disabled: (dr:DeliveryReceipt)=> true,
            icon:'pi pi-box',
            shape:'rounded',
            color:'secondary',
          },
          {
            hidden: (dr:DeliveryReceipt) => dr.stocked,
            icon:'pi pi-arrow-right',
            shape:'rounded',
            color:'success',
            tooltip: 'Click to submit this receipt for inspection',
            function:  (event:Event, dr:DeliveryReceipt)=>this.proceedToStocking()
          }
        ]
       },
      ],
      data:[]
    }
  
  async fetchItems() {
    try {
      this.isLoading = true;  // Start loading
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
    } catch (error) {
      console.error('Error fetching items:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch delivery receipts'
      });
    } finally {
      this.isLoading = false;  // End loading regardless of success/failure
    }
  }



  
}
