import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { jsPDF } from 'jspdf';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';

import { RequisitionService } from 'src/app/services/requisition.service';
import { GroupService, Group } from 'src/app/services/group.service';
import { Product, ProductsService } from 'src/app/services/products.service';
import { UserService, User } from 'src/app/services/user.service';

interface SelectedProduct {
  id: string;
  name: string;
  description: string;
  quantity: number;
  specifications: string;
}

interface ExtendedRequisition {
  id?: string;
  title: string;
  description?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  classifiedItemId: string;
  group: string;
  selectedGroups?: string[];
  products?: string[];
  productQuantities?: Record<string, number>;
  productSpecifications?: Record<string, string>;
  dateCreated?: Date;
  lastModified?: Date;
  ppmpAttachment?: string;
  createdByUserId?: string;
  createdByUserName?: string;
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
  requisitions: ExtendedRequisition[] = [];
  pendingRequisitions: ExtendedRequisition[] = [];
  approvedRequisitions: ExtendedRequisition[] = [];
  loading = false;
  submitted = false;
  activeTabIndex = 0;
  displayPdfDialog = false;
  pdfDataUrl: SafeResourceUrl | null = null;
  displayPpmpPreview = false;
  selectedRequisitionPdf: SafeResourceUrl | null = null;
  tempRequisitionData?: Partial<ExtendedRequisition>;
  currentUser?: User;

  constructor(
    private formBuilder: FormBuilder,
    private requisitionService: RequisitionService,
    private groupService: GroupService,
    private productsService: ProductsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: UserService,
    public sanitizer: DomSanitizer
  ) {
    this.requisitionForm = this.initializeForm();
  }

  async ngOnInit() {
    this.currentUser = this.userService.getUser();
    await Promise.all([
      this.loadGroups(),
      this.loadRequisitions(),
      this.loadAllProducts(),
    ]);
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['Pending'],
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

  private async loadRequisitions(): Promise<void> {
    try {
      this.loading = true;
      this.requisitions = await this.requisitionService.getAllRequisitions();
      this.filterRequisitions();
    } catch (error) {
      this.handleError(error, 'Error loading requisitions');
    } finally {
      this.loading = false;
    }
  }

  private filterRequisitions(): void {
    this.pendingRequisitions = this.requisitions.filter(
      (req) => req.status === 'Pending'
    );
    this.approvedRequisitions = this.requisitions.filter(
      (req) => req.status === 'Approved'
    );
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
        products.forEach((p) => productsSet.add(p));
      }
      this.availableProducts = Array.from(productsSet);
    } catch (error) {
      this.handleError(error, 'Error loading products');
    } finally {
      this.loading = false;
    }
  }

  isProductSelected(product: Product): boolean {
    return this.selectedProducts.some((sp) => sp.id === product.id);
  }

  getSelectedProduct(product: Product): SelectedProduct | undefined {
    return this.selectedProducts.find((sp) => sp.id === product.id);
  }

  addProduct(product: Product): void {
    if (!this.isProductSelected(product)) {
      this.selectedProducts.push({
        id: product.id!,
        name: product.name,
        description: product.description || '',
        quantity: 1,
        specifications: '',
      });
    }
  }

  removeProduct(product: Product): void {
    this.selectedProducts = this.selectedProducts.filter(
      (sp) => sp.id !== product.id
    );
  }

  getProductName(productId: string): string {
    const product = this.allProducts.find((p) => p.id === productId);
    return product?.name || 'Unknown Product';
  }

   private generatePPMPPdf(reqData: Partial<ExtendedRequisition>): string {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(12);
    doc.text('LGU form No. 01', 20, 20);
    
    doc.setFontSize(16);
    doc.text('PROJECT PROCUREMENT MANAGEMENT PLAN', doc.internal.pageSize.width/2, 35, { align: 'center' });
    doc.setFontSize(14);
    const currentYear = new Date().getFullYear();
    doc.text(`C.Y. ${currentYear}`, doc.internal.pageSize.width/2, 45, { align: 'center' });
    
    // Program Info
    doc.setFontSize(12);
    doc.text('DAVAO DE ORO STATE COLLEGE', 20, 85);
    doc.text(`Date Submitted: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width - 60, 70);
    doc.text(`Program Control No: ${reqData.classifiedItemId}`, 20, 70);

    // Create the table headers
    let yPos = 100;
    doc.setFontSize(10);
    
    // Draw table headers
    const columns = ['ITEM NO.', 'DESCRIPTION', 'UNIT', 'UNIT COST', 'QTY.', 'TOTAL COST'];
    const widths = [30, 150, 30, 40, 30, 40];
    let xPos = 20;
    
    // Header row
    columns.forEach((col, i) => {
        doc.rect(xPos, yPos, widths[i], 10);
        doc.text(col, xPos + 2, yPos + 7);
        xPos += widths[i];
    });
    yPos += 10;

    // Items
    let itemNo = 1;
    reqData.products?.forEach((productId) => {
        const product = this.allProducts.find(p => p.id === productId);
        const qty = reqData.productQuantities?.[productId] || 1;
        const specs = reqData.productSpecifications?.[productId] || '';
        const unitCost = 0; // You might want to add this to your product interface
        const totalCost = qty * unitCost;
        
        xPos = 20;
        columns.forEach((_, i) => {
            doc.rect(xPos, yPos, widths[i], 10);
            xPos += widths[i];
        });

        // Item data
        doc.text(itemNo.toString(), 22, yPos + 7);
        doc.text(product?.name || 'Unknown', 52, yPos + 7);
        doc.text('pcs', 82, yPos + 7); // Default unit
        doc.text(unitCost.toString(), 112, yPos + 7);
        doc.text(qty.toString(), 142, yPos + 7);
        doc.text(totalCost.toString(), 172, yPos + 7);

        yPos += 10;
        itemNo++;
    });

    // Footer
    const user = this.userService.getUser();
    doc.text(`Generated by: ${user?.fullname || 'Unknown'} (${user?.role || 'Unknown'})`, 20, doc.internal.pageSize.height - 20);
    
    return doc.output('datauristring');
  }

  async saveRequisition(): Promise<void> {
    this.submitted = true;
    
    if (this.requisitionForm.invalid || !this.selectedGroups.length || !this.selectedProducts.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please complete all required fields'
      });
      return;
    }

    const requisitionData: Partial<ExtendedRequisition> = {
      title: this.requisitionForm.get('title')?.value,
      description: this.requisitionForm.get('description')?.value,
      status: 'Pending',
      group: this.selectedGroups[0],
      selectedGroups: this.selectedGroups,
      products: this.selectedProducts.map(p => p.id),
      productQuantities: Object.fromEntries(
        this.selectedProducts.map(p => [p.id, p.quantity])
      ),
      productSpecifications: Object.fromEntries(
        this.selectedProducts.map(p => [p.id, p.specifications])
      ),
      dateCreated: new Date(),
      classifiedItemId: this.generateClassifiedItemId(),
      createdByUserId: this.currentUser?.id,
      createdByUserName: this.currentUser?.fullname
    };

    const pdfBase64 = this.generatePPMPPdf(requisitionData);
    requisitionData.ppmpAttachment = pdfBase64;
    this.tempRequisitionData = requisitionData;
    this.pdfDataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfBase64);
    this.displayPdfDialog = true;
  }

  async finalizeRequisitionSave(): Promise<void> {
    if (!this.tempRequisitionData) return;

    try {
      this.loading = true;
      await this.requisitionService.addRequisition(
        this.tempRequisitionData as Omit<ExtendedRequisition, 'id'>
      );
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Requisition saved successfully'
      });
      
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

  cancelRequisitionSave(): void {
    this.displayPdfDialog = false;
    this.tempRequisitionData = undefined;
  }

  async editRequisition(req: ExtendedRequisition): Promise<void> {
    this.activeTabIndex = 0;
    try {
      this.loading = true;
      this.requisitionForm.patchValue({
        title: req.title,
        description: req.description,
        status: req.status,
      });
      this.selectedGroups = req.selectedGroups || [req.group];
      await this.loadProductsForGroups();

      if (req.products) {
        this.selectedProducts = req.products.map((productId) => {
          const product = this.availableProducts.find((p) => p.id === productId);
          return {
            id: productId,
            name: product?.name || 'Unknown Product',
            description: product?.description || '',
            quantity: req.productQuantities?.[productId] || 1,
            specifications: req.productSpecifications?.[productId] || '',
          };
        });
      }
    } catch (error) {
      this.handleError(error, 'Error loading requisition details');
    } finally {
      this.loading = false;
    }
  }

  deleteRequisition(req: ExtendedRequisition): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the requisition "${req.title}"?`,
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
              detail: 'Requisition deleted successfully',
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

  viewPPMP(requisition: ExtendedRequisition): void {
    if (requisition.ppmpAttachment) {
      this.selectedRequisitionPdf = this.sanitizer.bypassSecurityTrustResourceUrl(requisition.ppmpAttachment);
      this.displayPpmpPreview = true;
    }
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
    const errorMessage = error?.message || defaultMessage;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
    });
  }

  private generateClassifiedItemId(): string {
    return Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}