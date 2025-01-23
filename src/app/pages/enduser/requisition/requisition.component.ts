import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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

import { RequisitionService } from 'src/app/services/requisition.service';
import { GroupService, Group } from 'src/app/services/group.service';
import { Product, ProductsService } from 'src/app/services/products.service';

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
    TooltipModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class RequisitionComponent implements OnInit {
  // Form and data
  requisitionForm: FormGroup;
  groups: Group[] = [];
  selectedGroups: string[] = [];
  availableProducts: Product[] = [];
  selectedProducts: SelectedProduct[] = [];
  
  // Filtered requisitions
  requisitions: ExtendedRequisition[] = [];
  pendingRequisitions: ExtendedRequisition[] = [];
  approvedRequisitions: ExtendedRequisition[] = [];

  // UI state
  loading = false;
  submitted = false;
  searchQuery = '';
  activeTabIndex = 0;

  constructor(
    private formBuilder: FormBuilder,
    private requisitionService: RequisitionService,
    private groupService: GroupService,
    private productsService: ProductsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.requisitionForm = this.initializeForm();
  }

  async ngOnInit() {
    await Promise.all([
      this.loadGroups(),
      this.loadRequisitions()
    ]);
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['Pending']
    });
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
    this.pendingRequisitions = this.requisitions.filter(req => req.status === 'Pending');
    this.approvedRequisitions = this.requisitions.filter(req => req.status === 'Approved');
  }

  async toggleGroupSelection(group: Group): Promise<void> {
    if (!group.id) return;

    const index = this.selectedGroups.indexOf(group.id);
    
    if (index === -1) {
      this.selectedGroups.push(group.id);
    } else {
      this.selectedGroups.splice(index, 1);
      // Remove products from unselected group
      this.selectedProducts = this.selectedProducts.filter(product => 
        !group.products?.includes(product.id)
      );
    }

    await this.loadProductsForGroups();
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
        products.forEach(product => productsSet.add(product));
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
        specifications: ''
      });
    }
  }

  removeProduct(product: Product): void {
    this.selectedProducts = this.selectedProducts.filter(sp => sp.id !== product.id);
  }

  updateProductSpecifications(product: SelectedProduct, specifications: string): void {
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.selectedProducts[index] = { ...product, specifications };
    }
  }

  updateProductQuantity(product: SelectedProduct, quantity: number): void {
    if (quantity < 1) return;
    
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.selectedProducts[index] = { ...product, quantity };
    }
  }

  getProductName(productId: string): string {
    const product = this.availableProducts.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  }

  async saveRequisition(): Promise<void> {
    this.submitted = true;

    if (this.requisitionForm.invalid || 
        this.selectedGroups.length === 0 || 
        this.selectedProducts.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields and select at least one group and product'
      });
      return;
    }

    try {
      this.loading = true;
      const formValue = this.requisitionForm.value;
      
      const requisitionData: Partial<ExtendedRequisition> = {
        title: formValue.title,
        description: formValue.description,
        group: this.selectedGroups[0], // Primary group
        selectedGroups: this.selectedGroups,
        status: formValue.status,
        products: this.selectedProducts.map(p => p.id),
        productQuantities: this.selectedProducts.reduce((acc, curr) => {
          acc[curr.id] = curr.quantity;
          return acc;
        }, {} as Record<string, number>),
        productSpecifications: this.selectedProducts.reduce((acc, curr) => {
          acc[curr.id] = curr.specifications;
          return acc;
        }, {} as Record<string, string>),
        dateCreated: new Date(),
        classifiedItemId: this.generateClassifiedItemId()
      };

      await this.requisitionService.addRequisition(requisitionData as Omit<ExtendedRequisition, 'id'>);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Requisition created successfully'
      });

      this.resetForm();
      await this.loadRequisitions();
      this.activeTabIndex = 1; // Switch to Pending Requisitions tab
    } catch (error) {
      this.handleError(error, 'Error saving requisition');
    } finally {
      this.loading = false;
    }
  }

  async editRequisition(req: ExtendedRequisition): Promise<void> {
    this.activeTabIndex = 0; // Switch to Add Requisition tab
    
    try {
      this.loading = true;
      
      // Set form values
      this.requisitionForm.patchValue({
        title: req.title,
        description: req.description,
        status: req.status
      });

      // Set selected groups and products
      this.selectedGroups = req.selectedGroups || [req.group];
      await this.loadProductsForGroups();

      if (req.products) {
        this.selectedProducts = req.products.map(productId => {
          const product = this.availableProducts.find(p => p.id === productId);
          return {
            id: productId,
            name: product?.name || 'Unknown Product',
            description: product?.description || '',
            quantity: req.productQuantities?.[productId] || 1,
            specifications: req.productSpecifications?.[productId] || ''
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
              detail: 'Requisition deleted successfully'
            });
          }
        } catch (error) {
          this.handleError(error, 'Error deleting requisition');
        } finally {
          this.loading = false;
        }
      }
    });
  }

  resetForm(): void {
    this.submitted = false;
    this.selectedGroups = [];
    this.availableProducts = [];
    this.selectedProducts = [];
    this.requisitionForm.reset({
      status: 'Pending'
    });
  }

  private handleError(error: any, defaultMessage: string): void {
    console.error(error);
    const errorMessage = error?.message || defaultMessage;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage
    });
  }

  private generateClassifiedItemId(): string {
    return Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}