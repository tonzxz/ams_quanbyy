import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { jsPDF } from 'jspdf';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';

import { RequisitionService, Requisition } from 'src/app/services/requisition.service';
import { GroupService, Group } from 'src/app/services/group.service'; 
import { Product, ProductsService } from 'src/app/services/products.service';
import { UserService, User } from 'src/app/services/user.service';
import { PurchaseRequestService, PurchaseRequest } from 'src/app/services/purchase-request.service';
import { ApprovalSequenceService } from 'src/app/services/approval-sequence.service';
import { NotificationService } from 'src/app/services/notifications.service';

interface SelectedProduct {
 id: string;
 name: string; 
 description?: string;
 quantity: number;
 price: number;
 specifications?: string;
}

@Component({
 selector: 'app-requisition',
 templateUrl: './requisition.component.html',
 styleUrls: ['./requisition.component.scss'],
 standalone: true,
 imports: [
   CommonModule,
   ReactiveFormsModule,
   FormsModule,
   MatCardModule,
   ButtonModule,
   InputTextModule,
   TabViewModule,
   DialogModule,
   CardModule,
   TableModule,
   ConfirmDialogModule,
   ToastModule,
   TooltipModule,
   TextareaModule,
   MultiSelectModule,
 ],
 providers: [ConfirmationService, MessageService],
})
export class RequisitionComponent implements OnInit {
 requisitionForm: FormGroup;
 groups: Group[] = [];
 allProducts: Product[] = [];
 selectedGroups: string[] = [];
 availableProducts: Product[] = [];
 selectedProducts: SelectedProduct[] = [];
 requisitions: (Requisition & { approvalSequenceDetails?: any })[] = [];
 pendingRequisitions: Requisition[] = [];
 approvedRequisitions: Requisition[] = [];
 loading = false;
 submitted = false;
 activeTabIndex = 0;
 displayPdfDialog = false;
 displayPreviewDialog = false;
 displayPpmpPreview = false;
 displayPurchaseRequestPreview = false;
 pdfDataUrl: SafeResourceUrl | null = null;
 selectedRequisitionPdf: SafeResourceUrl | null = null;
 selectedPurchaseRequestPdf: SafeResourceUrl | null = null;
 selectedRequest: PurchaseRequest | null = null;
 tempRequisitionData?: Partial<Requisition>;
 currentUser?: User;

 constructor(
   private formBuilder: FormBuilder,
   private notifService:NotificationService,
   private requisitionService: RequisitionService,
   private groupService: GroupService,
   private productsService: ProductsService,
   private confirmationService: ConfirmationService,
   private messageService: MessageService,
   private userService: UserService,
   private purchaseRequestService: PurchaseRequestService,
   private approvalSequenceService: ApprovalSequenceService,
   public sanitizer: DomSanitizer
 ) {
   this.requisitionForm = this.initializeForm();
 }

 async ngOnInit() {
   this.currentUser = this.userService.getUser();
   await Promise.all([
     this.loadGroups(),
     this.loadRequisitions(),  
     this.loadAllProducts()
   ]);
 }

 private initializeForm(): FormGroup {
   return this.formBuilder.group({
     title: ['', [Validators.required, Validators.minLength(3)]],
     description: [''],
     status: ['Pending']
   });
 }

 private async loadAllProducts(): Promise<void> {
   try {
     this.allProducts = await this.productsService.getAll();
   } catch (error) {
     this.handleError(error, 'Error loading products');
   }
 }

 private async loadGroups(): Promise<void> {
   try {
     this.loading = true;
     this.groups = await this.groupService.getAllGroups();
   } catch (error) {
     this.handleError(error, 'Error loading groups');
   } finally {
     this.loading = false;
   }
 }

//  async loadRequisitions(): Promise<void> {
//    try {
//      const requisitions = await this.requisitionService.getRequisitionsWithApprovalDetails();
     
//      const allApprovalSequences = await firstValueFrom(this.approvalSequenceService.getAllSequences());

//      this.requisitions = requisitions.map(req => {
//        const typeSequences = allApprovalSequences.filter(seq => 
//          seq.type === (req.currentApprovalLevel <= 4 ? 'procurement' : 'supply')
//        );

//        const currentSequence = typeSequences.find(seq => 
//          seq.level === req.currentApprovalLevel
//        );

//        return {
//          ...req,
//          ppmpAttachment: req.ppmpAttachment || undefined,
//          purchaseRequestAttachment: req.purchaseRequestAttachment || undefined,
//          approvalSequenceDetails: currentSequence ? {
//            level: currentSequence.level,
//            departmentName: currentSequence.departmentName,
//            roleName: currentSequence.roleName,
//            userFullName: currentSequence.userFullName,
//            userId: currentSequence.userId
//          } : undefined
//        };
//      });

//      this.filterRequisitions();
//    } catch (error) {
//      this.handleError(error, 'Error loading requisitions');
//    }
  //  }
  
  async loadRequisitions(): Promise<void> {
  try {
    this.loading = true;
    const allRequisitions = await this.requisitionService.getAllRequisitions();

    // Debugging: Log all requisitions
    console.log('All Requisitions:', allRequisitions);

    // Filter requisitions based on their approval level and status
    this.pendingRequisitions = allRequisitions.filter(req => req.currentApprovalLevel === 1 && req.status === 'Pending');
    this.approvedRequisitions = allRequisitions.filter(req => req.currentApprovalLevel === 2 && req.status === 'Pending');

    // Debugging: Log filtered requests
    console.log('Pending Requisitions:', this.pendingRequisitions);
    console.log('Approved Requisitions:', this.approvedRequisitions);
  } catch (error) {
    this.handleError(error, 'Error loading requisitions');
  } finally {
    this.loading = false;
  }
}

 private filterRequisitions(): void {
   this.pendingRequisitions = this.requisitions.filter(req => req.status === 'Pending');
   this.approvedRequisitions = this.requisitions.filter(req => req.status === 'Approved');
 }

 onGroupsSelectionChange(newSelectedGroups: string[]): void {
   this.selectedGroups = newSelectedGroups;
   this.loadProductsForGroups();
 }

 async loadProductsForGroups(): Promise<void> {
   try {
     if (this.selectedGroups.length === 0) {
       this.availableProducts = [];
       return;
     }
     this.loading = true;
     const productsSet = new Set<Product>();
     
     for (const groupId of this.selectedGroups) {
       const products = await this.productsService.getProductsByGroup(groupId);
       products.forEach(p => productsSet.add(p));
     }
     this.availableProducts = Array.from(productsSet);
   } catch (error) {
     this.handleError(error, 'Error loading products');
   } finally {
     this.loading = false;
   }
 }

 isProductSelected(product: Product): boolean {
   return this.selectedProducts.some(sp => sp.id === product.id);
 }

 getSelectedProduct(product: Product): SelectedProduct | undefined {
   return this.selectedProducts.find(sp => sp.id === product.id);
 }

 addProduct(product: Product): void {
   if (!this.isProductSelected(product)) {
     this.selectedProducts.push({
       id: product.id!,
       name: product.name,
       description: product.description || '',
       quantity: 1,
       price: 0,
       specifications: ''
     });
   }
 }

 removeProduct(product: Product): void {
   this.confirmationService.confirm({
     message: 'Are you sure you want to remove this product?',
     accept: () => {
       this.selectedProducts = this.selectedProducts.filter(sp => sp.id !== product.id);
     }
   });
 }

 calculateProductTotalPrice(product: Product): number {
   const selectedProduct = this.getSelectedProduct(product);
   if (selectedProduct) {
     return selectedProduct.quantity * selectedProduct.price;
   }
   return 0;
 }

 calculateGrandTotal(): number {
   return this.selectedProducts.reduce((total, product) => 
     total + (product.quantity * product.price), 0);
 }

 private generatePPMPPdf(reqData: Partial<Requisition>): string {
   const doc = new jsPDF({
     orientation: 'portrait',
     unit: 'pt',
     format: 'a4',
   });

   const pageWidth = doc.internal.pageSize.getWidth();
   const pageHeight = doc.internal.pageSize.getHeight();
   const margin = 40;

   // Header Section
   doc.setFontSize(12);
   doc.text('DDOST form No. 01', margin, 40);

   doc.setFontSize(16);
   doc.text('PROJECT PROCUREMENT MANAGEMENT PLAN', pageWidth / 2, 70, {
     align: 'center',
   });
   doc.setFontSize(14);
   const currentYear = new Date().getFullYear();
   doc.text(`C.Y. ${currentYear}`, pageWidth / 2, 90, { align: 'center' });

   // Program Information
   doc.setFontSize(12);
   doc.text('DAVAO DE ORO STATE COLLEGE', margin, 130);
   doc.text(`Date Submitted: ${new Date().toLocaleDateString()}`, pageWidth - margin - 120, 130);
   doc.text(`Program Control No: ${reqData.classifiedItemId}`, margin, 150);

   // Table Header
   const tableStartY = 180;
   const rowHeight = 20;

   const colWidths = [
     20, // ITEM
     90, // PRODUCT
     pageWidth - margin * 2 - 300, // DESCRIPTION
     80, // UNIT COST
     40, // QUANTITY
     80, // TOTAL COST
   ];

   const headers = ['NO', 'PRODUCT', 'DESCRIPTION', 'UNIT COST', 'PCS', 'TOTAL COST'];
   let xPos = margin;
   let yPos = tableStartY;

   doc.setFontSize(10);

   // Draw headers
   headers.forEach((header, i) => {
     doc.rect(xPos, yPos, colWidths[i], rowHeight);
     doc.text(header, xPos + 5, yPos + 14);
     xPos += colWidths[i];
   });

   yPos += rowHeight;

   // Table Rows
   let itemNo = 1;
   let grandTotal = 0;

   reqData.products?.forEach((product) => {
     const quantity = reqData.productQuantities?.[product.id] || 1;
     const unitPrice = product.price || 0;
     const totalPrice = quantity * unitPrice;
     grandTotal += totalPrice;

     const descriptionText = product.specifications || 'N/A';
     const wrappedDescription = doc.splitTextToSize(descriptionText, colWidths[2] - 10);
     const wrappedHeight = wrappedDescription.length * 12;
     const effectiveRowHeight = Math.max(rowHeight, wrappedHeight);

     if (yPos + effectiveRowHeight > pageHeight - margin) {
       doc.addPage();
       yPos = margin;

       xPos = margin;
       headers.forEach((header, i) => {
         doc.rect(xPos, yPos, colWidths[i], rowHeight);
         doc.text(header, xPos + 5, yPos + 14);
         xPos += colWidths[i];
       });

       yPos += rowHeight;
     }

     xPos = margin;

     [
       itemNo.toString(),
       product.name || 'Unknown',
       '',
       `${unitPrice.toFixed(2)}`,
       quantity.toString(),
       `${totalPrice.toFixed(2)}`,
     ].forEach((data, i) => {
       const isDescription = i === 2;
       const cellHeight = isDescription ? wrappedHeight : effectiveRowHeight;

       doc.rect(xPos, yPos, colWidths[i], cellHeight);

       if (isDescription) {
         doc.text(wrappedDescription, xPos + 5, yPos + 12, { maxWidth: colWidths[i] - 10 });
       } else {
         doc.text(data, xPos + 5, yPos + 14);
       }

       xPos += colWidths[i];
     });

     itemNo++;
     yPos += effectiveRowHeight;
   });

   if (yPos + rowHeight > pageHeight - margin) {
     doc.addPage();
     yPos = margin;
   }

   doc.setFontSize(12);
   doc.text(`Total: ${grandTotal.toFixed(2)}`, margin, yPos + 30);

   const user = this.userService.getUser();
   doc.setFontSize(10);
   doc.text(
     `Generated by: ${user?.fullname || 'Unknown'} (${user?.role || 'Unknown'})`,
     margin,
     pageHeight - 30
   );

   return doc.output('datauristring');
 }

 async saveRequisition(): Promise<void> {
   this.submitted = true;

   if (this.requisitionForm.invalid || !this.selectedGroups.length || !this.selectedProducts.length) {
     this.messageService.add({
       severity: 'error',
       summary: 'Validation Error',
       detail: 'Please complete all required fields.',
     });
     return;
   }

   try {
     const sequences = await firstValueFrom(
       this.approvalSequenceService.getSequencesByType('procurement')
     );

     const requisitionData: Partial<Requisition> = {
       title: this.requisitionForm.get('title')?.value,
       description: this.requisitionForm.get('description')?.value,
       status: 'Pending',
       group: this.selectedGroups[0],
       selectedGroups: this.selectedGroups,
       products: this.selectedProducts.map((p) => ({
         id: p.id,
         name: p.name,
         quantity: p.quantity,
         price: p.price,
         specifications: p.specifications,
       })),
       productQuantities: Object.fromEntries(this.selectedProducts.map((p) => [p.id, p.quantity])),
       productSpecifications: Object.fromEntries(this.selectedProducts.map((p) => [p.id, p.specifications || ''])),
       dateCreated: new Date(),
       classifiedItemId: this.generateClassifiedItemId(),
       createdByUserId: this.currentUser?.id,
       createdByUserName: this.currentUser?.fullname,
       approvalSequenceId: sequences[0]?.id,
       currentApprovalLevel: 1,
       approvalStatus: 'Pending',
       approvalHistory: []
     };

     
 

     const ppmpBase64 = this.generatePPMPPdf(requisitionData);

   // Continued from before

     // Generate purchase request
     const prData: PurchaseRequest = {
       prNo: requisitionData.classifiedItemId!,
       date: new Date(),
       agency: 'CAGAYAN DE ORO STATE COLLEGE',
       department: sequences[0]?.departmentName || 'N/A',
       office: sequences[0]?.roleName || 'N/A',
       items: requisitionData.products!.map(p => ({
         qty: p.quantity,
         unit: 'Unit',
         description: p.name,
         stockNo: '-',
         unitCost: p.price,
         totalCost: p.quantity * p.price
       })),
       requestedBy: requisitionData.createdByUserName || 'N/A',
       approvedBy: sequences[0]?.userFullName || 'N/A'
     };

     const prBase64 = this.purchaseRequestService.generatePurchaseRequestPdf(prData);

     this.tempRequisitionData = { 
       ...requisitionData, 
       ppmpAttachment: ppmpBase64,
       purchaseRequestAttachment: prBase64
     };

     this.pdfDataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(ppmpBase64);
     this.displayPdfDialog = true;

   } catch (error) {
     this.handleError(error, 'Error generating documents');
   }
 }

 async confirmRequisitionSubmission(): Promise<void> {
   if (!this.tempRequisitionData) return;

   try {
     this.loading = true;
    await this.requisitionService.addRequisition(
       this.tempRequisitionData as Omit<Requisition, 'id'>
     );

     
     this.messageService.add({
       severity: 'success',
       summary: 'Success',
       detail: 'Requisition submitted successfully.'
     });

     this.resetForm();
     await this.loadRequisitions();
     this.activeTabIndex = 1;
   } catch (error) {
     this.handleError(error, 'Error submitting requisition');
   } finally {
     this.loading = false;
     this.displayPdfDialog = false;
     this.tempRequisitionData = undefined;
   }
 }

 cancelRequisitionSubmission(): void {
   this.displayPdfDialog = false;
   this.tempRequisitionData = undefined;
 }

 viewPPMP(requisition: Requisition): void {
   if (requisition.ppmpAttachment) {
     this.selectedRequisitionPdf = this.sanitizer.bypassSecurityTrustResourceUrl(requisition.ppmpAttachment);
     this.displayPpmpPreview = true;
   } else {
     this.messageService.add({
       severity: 'warn',
       summary: 'No Document',
       detail: 'PPMP document is not available.'
     });
   }
 }

 viewPurchaseRequest(requisition: Requisition): void {
   if (requisition.purchaseRequestAttachment) {
     this.selectedPurchaseRequestPdf = this.sanitizer.bypassSecurityTrustResourceUrl(requisition.purchaseRequestAttachment);
     this.displayPurchaseRequestPreview = true;
   } else {
     this.messageService.add({
       severity: 'warn',
       summary: 'No Document',
       detail: 'Purchase Request document is not available.'
     });
   }
 }

 closeDialog(): void {
   this.displayPpmpPreview = false;
   this.displayPurchaseRequestPreview = false;
   this.selectedRequisitionPdf = null; 
   this.selectedPurchaseRequestPdf = null;
 }

 deleteRequisition(req: Requisition): void {
   this.confirmationService.confirm({
     message: `Are you sure you want to delete "${req.title}"?`,
     header: 'Confirm Deletion',
     icon: 'pi pi-exclamation-triangle',
     acceptButtonStyleClass: 'p-button-danger',
     accept: async () => {
       try {
         this.loading = true;
         if (req.id) {
           await this.requisitionService.deleteRequisition(req.id);
           await this.loadRequisitions();
           this.messageService.add({
             severity: 'success',
             summary: 'Success',
             detail: 'Requisition deleted successfully'
           });
         }
       } catch (error) {
         this.handleError(error, 'Error deleting requisition');
       } finally {
         this.loading = false;
       }
     },
   });
 }

 resetForm(): void {
   this.submitted = false;
   this.selectedGroups = [];
   this.availableProducts = [];
   this.selectedProducts = [];
   this.requisitionForm.reset({ status: 'Pending' });
 }

 private handleError(error: any, defaultMessage: string): void {
   console.error(error);
   this.messageService.add({
     severity: 'error',
     summary: 'Error',
     detail: error?.message || defaultMessage
   });
 }

 private generateClassifiedItemId(): string {
   return Array.from(
     { length: 32 }, 
     () => Math.floor(Math.random() * 16).toString(16)
   ).join('');
 }
  
  getProductName(productId: string): string {
 const product = this.allProducts.find((p) => p.id === productId);
 return product?.name || 'Unknown Product';
  }
  
  cancelRequisitionSave(): void {
 this.displayPdfDialog = false;
 this.tempRequisitionData = undefined;
  }
  


async finalizeRequisitionSave(): Promise<void> {
  if (!this.tempRequisitionData) return;

  try {
    this.loading = true;
    const id = await this.requisitionService.addRequisition(
      this.tempRequisitionData as Omit<Requisition, 'id'>
    );

    this.messageService.add({
      severity: 'success', 
      summary: 'Success',
      detail: 'Requisition saved successfully'
    });

    const allSequences = await this.requisitionService.getAllApprovalSequences();
     if(allSequences[0]){
      const nextUserRole = allSequences[0]?.roleCode;
          const users = await firstValueFrom (this.userService.getAllUsers());
          for(let user of users){
            if(user.role == 'superadmin' || nextUserRole == user.role  ){
              this.notifService.addNotification(
              `Requisiton No. ${id} has been created and now under ${allSequences[0].name}.`,
              'info',
              user.id
              )
            }
          }
     }
    
    this.resetForm();
    await this.loadRequisitions();
    this.activeTabIndex = 1;
  } catch (error) {
    this.handleError(error, 'Error saving requisition');
  } finally {
    this.loading = false;
    this.displayPdfDialog = false;
    this.tempRequisitionData = undefined;
  }
}
}