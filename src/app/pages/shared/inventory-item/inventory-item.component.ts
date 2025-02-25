import { Component, AfterViewInit, ViewChild } from '@angular/core';
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
import JsBarcode from 'jsbarcode';
import { Table } from 'primeng/table';
import { v4 as uuidv4 } from 'uuid';

interface Stock {
  id: string;
  name: string;
  ticker: string;
  storage_name: string;
  product_name: string;
  quantity: number;
  dateAdded: Date;
  description?: string;
  imageUrl?: string;
  imageFile?: File;
  barcode: string;
  sku: string;
  minimumQty: number;
  unit: string;
  tax: string;
  discountType: string;
  price: number;
  status: string;
  brand?: string;
  subCategory?: string;
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
  styleUrls: ['./inventory-item.component.scss']
})
export class InventoryItemComponent implements AfterViewInit {
  @ViewChild('dt') dt!: Table;

  stocks: Stock[] = [
    {
      id: '1',
      name: 'Laptop Dell XPS',
      ticker: 'LAP001',
      storage_name: 'Main Warehouse',
      product_name: 'Electronics',
      quantity: 50,
      dateAdded: new Date('2024-01-15'),
      description: 'High-end laptop for developers',
      imageUrl: 'https://i.dell.com/is/image/DellContent//content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9315/media-gallery/notebook-xps-13-9315-silver-gallery-3.psd?fmt=png-alpha&pscan=auto&scl=1&wid=3000&hei=2000&qlt=100,1&resMode=sharp2&size=3000,2000',
      barcode: '86102192',
      sku: 'PT0001',
      minimumQty: 5,
      unit: 'Piece',
      tax: '0.00 %',
      discountType: 'Percentage',
      price: 1500.00,
      status: 'Active',
      brand: 'Dell',
      subCategory: 'Laptops'
    },
    {
      id: '2',
      name: 'Office Chair',
      ticker: 'CHR002',
      storage_name: 'Office Storage',
      product_name: 'Furniture',
      quantity: 10,
      dateAdded: new Date('2024-02-01'),
      description: 'Ergonomic office chairs',
      imageUrl: 'https://img.freepik.com/free-photo/home-appliance-seat-interior-ergonomic-sign_1172-512.jpg?t=st=1740443561~exp=1740447161~hmac=eaa89ac47ff5af512611e3ed5106ae6cbdd0d6c1f232f41fd4be4861bfe112f2&w=740',
      barcode: '86102193',
      sku: 'PT0002',
      minimumQty: 2,
      unit: 'Piece',
      tax: '0.00 %',
      discountType: 'Percentage',
      price: 200.00,
      status: 'Active',
      brand: 'IKEA',
      subCategory: 'Chairs'
    },
    {
      id: '3',
      name: 'Printer HP LaserJet',
      ticker: 'PRT003',
      storage_name: 'IT Department',
      product_name: 'Electronics',
      quantity: 0, // Out of stock
      dateAdded: new Date('2024-02-15'),
      description: 'High-speed printer for office use',
      imageUrl: 'https://electronicparadise.in/cdn/shop/files/81gU9g9R4GL._SX679.jpg?v=1707465857&width=800',
      barcode: '86102194',
      sku: 'PT0003',
      minimumQty: 1,
      unit: 'Piece',
      tax: '0.00 %',
      discountType: 'Percentage',
      price: 300.00,
      status: 'Active',
      brand: 'HP',
      subCategory: 'Printers'
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
  showDetailsModal: boolean = false;

  // State variable to track which table to display
  currentTable: 'all' | 'low' | 'out' = 'all';

  // Rename these properties to avoid conflicts
  showLowStockFlag: boolean = true; // Renamed from showLowStock
  showOutOfStockFlag: boolean = false; // Renamed from showOutOfStock

  stockForm = new FormGroup({
    name: new FormControl('', Validators.required),
    ticker: new FormControl('', Validators.required),
    storage: new FormControl<InventoryLocation | null>(null, Validators.required),
    type: new FormControl<Product | null>(null, Validators.required),
    quantity: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    description: new FormControl(''),
    imageUrl: new FormControl(''),
    barcode: new FormControl('')
  });

  quantity: number = 1; // Initialize with a default value

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    // Subscribe to changes in the ticker field
    this.stockForm.get('ticker')?.valueChanges.subscribe(value => {
      if (value) {
        this.generateBarcode(); // Generate barcode when ticker is set
      }
    });
  }

  ngAfterViewInit() {
    this.generateBarcode();
  }

  generateBarcode(): string {
    const barcodeValue = uuidv4();
    this.stockForm.patchValue({ barcode: barcodeValue });
    this.updateBarcodeImage(barcodeValue);
    return barcodeValue;
  }

  updateBarcodeImage(barcodeValue: string) {
    const canvas = document.getElementById('barcodeCanvas') as HTMLCanvasElement;
    JsBarcode(canvas, barcodeValue, {
      format: "CODE128",
      width: 2,
      height: 100,
      displayValue: true
    });
  }

  openAddStockModal() {
    this.selectedStock = undefined;
    this.stockForm.reset();
    this.showStockModal = true;
    this.generateBarcode();
  }

  openEditStockModal(stock: Stock) {
    this.selectedStock = stock;
    this.stockForm.setValue({
      name: stock.name,
      ticker: stock.ticker,
      storage: this.inventories.find(inv => inv.name === stock.storage_name) ?? null,
      type: this.products.find(product => product.name === stock.product_name) ?? null,
      quantity: stock.quantity,
      description: stock.description || '',
      imageUrl: stock.imageUrl || '',
      barcode: stock.barcode
    });
    this.showStockModal = true;
  }

  closeStockModal() {
    this.selectedStock = undefined;
    this.stockForm.reset();
    this.showStockModal = false;
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Only allow image files
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select an image file'
        });
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.stockForm.patchValue({
          imageUrl: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
      
      // Store the file for later upload
      if (this.selectedStock) {
        this.selectedStock.imageFile = file;
      }
    }
  }

  async addStock() {
    if (!this.stockForm.valid) return;
    
    const formValue = this.stockForm.value;
    
    try {
      const imageUrl = formValue.imageUrl || '';
      
      const newStock: Stock = {
        id: (this.stocks.length + 1).toString(),
        name: formValue.name!,
        ticker: formValue.ticker!,
        storage_name: formValue.storage?.name!,
        product_name: formValue.type?.name!,
        quantity: formValue.quantity!,
        dateAdded: new Date(),
        description: formValue.description || '',
        imageUrl: imageUrl,
        barcode: this.generateBarcode(),
        sku: '',
        minimumQty: 0,
        unit: '',
        tax: '',
        discountType: '',
        price: 0,
        status: '',
        brand: undefined,
        subCategory: undefined
      };

      this.stocks.push(newStock);
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Item successfully added!' 
      });
      this.closeStockModal();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add item. Please try again.'
      });
    }
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
        description: formValue.description || '',
        imageUrl: formValue.imageUrl || '',
        barcode: '',
        sku: '',
        minimumQty: 0,
        unit: '',
        tax: '',
        discountType: '',
        price: 0,
        status: '',
        brand: undefined,
        subCategory: undefined
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

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://placehold.co/200x200?text=No+Image';
    }
  }

  viewStockDetails(stock: Stock) {
    this.selectedStock = stock;
    this.showDetailsModal = true;
    setTimeout(() => {
      this.generateBarcode();
    });
  }

  printDetails() {
    window.print();
  }

  get filteredStocks() {
    return this.stocks.filter(stock => {
      if (this.showLowStockFlag && stock.quantity < stock.minimumQty) {
        return true;
      }
      if (this.showOutOfStockFlag && stock.quantity === 0) {
        return true;
      }
      return false;
    });
  }

  toggleLowStock() {
    this.showLowStockFlag = !this.showLowStockFlag;
  }

  toggleOutOfStock() {
    this.showOutOfStockFlag = !this.showOutOfStockFlag;
  }

  // Methods to switch between tables
  showAllItems() {
    this.currentTable = 'all';
  }

  showLowStock() {
    this.currentTable = 'low';
  }

  showOutOfStock() {
    this.currentTable = 'out';
  }

  get lowStockItems() {
    return this.stocks.filter(stock => stock.quantity < stock.minimumQty);
  }

  get outOfStockItems() {
    return this.stocks.filter(stock => stock.quantity === 0);
  }
}