import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CarouselModule } from 'primeng/carousel';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { BadgeModule } from 'primeng/badge';
import { ConfirmationService, MessageService } from 'primeng/api';

interface Stock {
  id: string;
  name: string;
  ticker: string;
  storage_name: string;
  product_name: string;
  quantity: number;
  dateAdded: Date;
  description?: string;
}

interface InventoryLocation {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
}

@Component({
  selector: 'app-inventory-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TooltipModule,
    DividerModule,
    ConfirmPopupModule,
    CarouselModule,
    InputNumberModule,
    DropdownModule,
    SelectModule,
    ToastModule,
    TextareaModule,
    BadgeModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './inventory-item.component.html',
  styleUrl: './inventory-item.component.scss'
})
export class InventoryItemComponent {
  stocks: Stock[] = [
    {
      id: '1',
      name: 'Laptop Dell XPS',
      ticker: 'LAP001',
      storage_name: 'Main Warehouse',
      product_name: 'Electronics',
      quantity: 5,
      dateAdded: new Date('2024-01-15'),
      description: 'High-end laptop for developers'
    },
    {
      id: '2',
      name: 'Office Chair',
      ticker: 'CHR002',
      storage_name: 'Office Storage',
      product_name: 'Furniture',
      quantity: 10,
      dateAdded: new Date('2024-02-01'),
      description: 'Ergonomic office chairs'
    },
    {
      id: '3',
      name: 'Printer HP LaserJet',
      ticker: 'PRT003',
      storage_name: 'IT Department',
      product_name: 'Electronics',
      quantity: 3,
      dateAdded: new Date('2024-02-15')
    }
  ];

  inventories: InventoryLocation[] = [
    { id: '1', name: 'Main Warehouse' },
    { id: '2', name: 'Office Storage' },
    { id: '3', name: 'IT Department' }
  ];

  products: Product[] = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Furniture' },
    { id: '3', name: 'Office Supplies' },
    { id: '4', name: 'IT Equipment' }
  ];

  searchValue: string = '';
  showStockModal: boolean = false;
  selectedStock?: Stock;

  stockForm = new FormGroup({
    name: new FormControl('', Validators.required),
    ticker: new FormControl('', Validators.required),
    storage: new FormControl<InventoryLocation | null>(null, Validators.required),
    type: new FormControl<Product | null>(null, Validators.required),
    quantity: new FormControl<number|null>(null, [Validators.required, Validators.min(1)]),
    description: new FormControl(''),
  });

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  openAddStockModal() {
    this.selectedStock = undefined;
    this.stockForm.reset();
    this.showStockModal = true;
  }

  openEditStockModal(stock: Stock) {
    this.selectedStock = stock;
    this.stockForm.setValue({
      name: stock.name,
      ticker: stock.ticker,
      storage: this.inventories.find(inv => inv.name === stock.storage_name) ?? null,
      type: this.products.find(product => product.name === stock.product_name) ?? null,
      quantity: stock.quantity,
      description: stock.description || ''
    });
    this.showStockModal = true;
  }

  closeStockModal() {
    this.selectedStock = undefined;
    this.stockForm.reset();
    this.showStockModal = false;
  }

  async addStock() {
    if (!this.stockForm.valid) return;
    
    const formValue = this.stockForm.value;
    const newStock: Stock = {
      id: (this.stocks.length + 1).toString(),
      name: formValue.name!,
      ticker: formValue.ticker!,
      storage_name: formValue.storage?.name!,
      product_name: formValue.type?.name!,
      quantity: formValue.quantity!,
      dateAdded: new Date(),
      description: formValue.description || ''
    };

    this.stocks.push(newStock);
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Item successfully added!' 
    });
    this.closeStockModal();
  }

  async editStock() {
    if (!this.stockForm.valid || !this.selectedStock) return;
    
    const formValue = this.stockForm.value;
    const index = this.stocks.findIndex(s => s.id === this.selectedStock!.id);
    
    if (index !== -1) {
      this.stocks[index] = {
        ...this.selectedStock,
        name: formValue.name!,
        ticker: formValue.ticker!,
        storage_name: formValue.storage?.name!,
        product_name: formValue.type?.name!,
        quantity: formValue.quantity!,
        description: formValue.description || ''
      };
    }

    this.messageService.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Item successfully updated!' 
    });
    this.closeStockModal();
  }

  confirmDeleteStock(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this item?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.stocks = this.stocks.filter(stock => stock.id !== id);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Item successfully deleted!' 
        });
      }
    });
  }
}