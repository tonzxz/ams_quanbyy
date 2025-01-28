import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StocksService, Stock } from 'src/app/services/stocks.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-requisition-and-issue-slip',
  standalone: true,
  templateUrl: './requisition-and-issue-slip.component.html',
  styleUrls: ['./requisition-and-issue-slip.component.scss'],
  providers: [MessageService],
  imports: [CommonModule, TabViewModule, CardModule, FormsModule, DropdownModule,ButtonModule, TableModule, ReactiveFormsModule ]
})
export class RequisitionAndIssueSlipComponent implements OnInit {
  requisitionForm: FormGroup;
  products: Stock[] = [];
  issuedItems: Stock[] = [];
  selectedProduct: Stock | null = null;
  loading = false;
  submitted = false;
  activeTabIndex = 0;

  constructor(
    private formBuilder: FormBuilder,
    private stocksService: StocksService,
    private messageService: MessageService
  ) {
    this.requisitionForm = this.formBuilder.group({
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  async ngOnInit() {
    await this.loadProducts();
    this.loadIssuedItems();
  }

 private async loadProducts(): Promise<void> {
  try {
    this.products = await this.stocksService.getAll();
    console.log('Products:', this.products); // Debugging
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

  private loadIssuedItems(): void {
    const issuedItems = localStorage.getItem('issuedItems');
    this.issuedItems = issuedItems ? JSON.parse(issuedItems) : [];
  }

  async submitRequisition(): Promise<void> {
    this.submitted = true;

    if (!this.selectedProduct || this.requisitionForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please select a product and enter a valid quantity.',
      });
      return;
    }

    try {
      this.loading = true;

      const quantity = this.requisitionForm.get('quantity')?.value;

      if (quantity > this.selectedProduct.quantity) {
        this.messageService.add({
          severity: 'error',
          summary: 'Insufficient Stock',
          detail: 'Requested quantity exceeds available stock.',
        });
        return;
      }

      // Update product stock
      const updatedProduct = {
        ...this.selectedProduct,
        quantity: this.selectedProduct.quantity - quantity,
      };
      await this.stocksService.editStock(updatedProduct);

      // Add to issued items
      const issuedItem = {
        ...updatedProduct,
        quantity,
        dateAdded: new Date(),
      };
      this.issuedItems.push(issuedItem);
      localStorage.setItem('issuedItems', JSON.stringify(this.issuedItems));

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Requisition submitted successfully.',
      });

      this.resetForm();
      await this.loadProducts();
    } catch (error) {
      console.error('Error submitting requisition:', error);
    } finally {
      this.loading = false;
    }
  }

  removeIssuedItem(id: string): void {
    this.issuedItems = this.issuedItems.filter((item) => item.id !== id);
    localStorage.setItem('issuedItems', JSON.stringify(this.issuedItems));
    this.messageService.add({
      severity: 'success',
      summary: 'Item Removed',
      detail: 'Issued item has been removed.',
    });
  }

  resetForm(): void {
    this.requisitionForm.reset();
    this.selectedProduct = null;
    this.submitted = false;
  }
}
