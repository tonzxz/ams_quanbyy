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
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { LottieAnimationComponent } from '../../ui-components/lottie-animation/lottie-animation.component';
import {  IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Supplier, SuppliersService } from 'src/app/services/suppliers.service';
import { SelectModule } from 'primeng/select';
import { Department, DepartmentService } from 'src/app/services/departments.service';
import { Requisition, RequisitionService } from 'src/app/services/requisition.service';
import { UserService } from 'src/app/services/user.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';


@Component({
  selector: 'app-delivery-receipts',
  standalone: true,
  imports: [MaterialModule,CommonModule, StepperModule, TableModule, ButtonModule, ButtonGroupModule, 
    InputTextModule, InputIconModule,IconFieldModule, FormsModule, SelectModule,
    FileUploadModule,DatePickerModule,InputNumberModule, ToastModule, ReactiveFormsModule, TextareaModule,LottieAnimationComponent,
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
  suppliers:Supplier[];
  departments:Department[];
  requisitions: Requisition[];
  searchValue:string='';

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
    private userService:UserService,
    private requisitionService:RequisitionService,
    private confirmationService:ConfirmationService,
    private messageService:MessageService,
    private departmentService:DepartmentService,
    private supplierService:SuppliersService,
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

  async proceedToStocking(){
    this.router.navigate(['/supply-management/stocking'])
  }
  
  async fetchItems(){
    this.receipts = await this.deliveryService.getAll();
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
    this.filterByStatus('unverified');
  }

  generatePDF(receipt: DeliveryReceipt) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20; // Define margin for the header
  
    // Header
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.text('QUANBY SOLUTIONS INC', pageWidth / 2, margin - 5, { align: 'center' });
  
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('4th Flr. Dosc Bldg., Brgy. 37-Bitano, Legazpi City, Albay', pageWidth / 2, margin + 0, { align: 'center' });
    doc.text('VAT Reg. TIN: 625-263-719-00000', pageWidth / 2, margin + 5, { align: 'center' });
  
    // Horizontal Line below Header
    doc.setDrawColor(200, 200, 200); // Light gray line
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 15, pageWidth - margin, margin + 15);
  
    // Title
    doc.setFontSize(16);
    doc.text('DELIVERY RECEIPT', pageWidth / 2, margin + 30, { align: 'center' }); // Centered title
  
    // Header information
    doc.setFontSize(12);
    doc.text(`Delivered to: ${receipt.department_name}`, margin, margin + 50);
    doc.text(`Date: ${new Date(receipt.delivery_date).toLocaleDateString()}`, pageWidth - margin - 60, margin + 50);
  
    doc.text(`TIN: ${receipt.supplier_name}`, margin, margin + 60);
    doc.text(`Terms: N/A`, pageWidth - margin - 60, margin + 60);
  
    doc.text(`Address: ${receipt.department_name}`, margin, margin + 70);
  
    // Table Headers
    const startY = margin + 80; // Adjusted Y position
    const rowHeight = 8; // Reduced row height
    const numberOfRows = 10; // Reduced number of rows
  
    // Column widths (auto-resize based on page width and margins)
    const col1Width = 30; // QTY (fixed width)
    const col2Width = 40; // UNIT (fixed width)
    const col3Width = pageWidth - 2 * margin - col1Width - col2Width; // ARTICLES (dynamic width)
  
    // Draw table header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
  
    // Draw header cells
    doc.rect(margin, startY, col1Width, rowHeight);
    doc.rect(margin + col1Width, startY, col2Width, rowHeight);
    doc.rect(margin + col1Width + col2Width, startY, col3Width, rowHeight);
  
    // Header text
    doc.text('QTY', margin + 5, startY + 6); // Adjusted text position
    doc.text('UNIT', margin + col1Width + 5, startY + 6); // Adjusted text position
    doc.text('ARTICLES', margin + col1Width + col2Width + 5, startY + 6); // Adjusted text position
  
    // Draw table rows
    doc.setFont('helvetica', 'normal');
    for (let i = 0; i < numberOfRows; i++) {
      const y = startY + (i + 1) * rowHeight;
  
      // Draw row cells
      doc.rect(margin, y, col1Width, rowHeight);
      doc.rect(margin + col1Width, y, col2Width, rowHeight);
      doc.rect(margin + col1Width + col2Width, y, col3Width, rowHeight);
  
      // Add notes to the "ARTICLES" column in the first row
      if (i === 0 && receipt.notes) {
        // Split the notes into lines if they are too long
        const notesLines = doc.splitTextToSize(receipt.notes, col3Width - 10); // Split text to fit column width
  
        // Add each line of notes to the cell
        notesLines.forEach((line: string, lineIndex: number) => {
          doc.text(
            line,
            margin + col1Width + col2Width + 5, // X position (left padding)
            y + 6 + lineIndex * 5 // Y position (top padding + line spacing)
          );
        });
      }
    }
  
    // Signature line and text at the bottom right
    const signatureLineLength = 80; // Length of the underline
    const signatureY = pageHeight - margin - 20; // Positioned at the bottom with margin
    const signatureX = pageWidth - margin - signatureLineLength; // Aligned to the right
  
    // Draw underline
    doc.line(signatureX, signatureY, signatureX + signatureLineLength, signatureY);
  
    // Center the text relative to the underline
    const text = "Customer's signature over printed name";
    const textWidth = doc.getTextWidth(text);
    const textX = signatureX + (signatureLineLength - textWidth) / 2; // Center text horizontally
  
    doc.setFontSize(10);
    doc.text(text, textX, signatureY + 5); // Text below the line
  
    // Save PDF
    doc.save(`delivery-receipt-${receipt.receipt_number}.pdf`);
  }
}
