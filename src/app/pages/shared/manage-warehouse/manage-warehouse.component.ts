import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-manage-warehouse',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TabViewModule,
    DropdownModule,
    CheckboxModule,
    TooltipModule
  ],
  templateUrl: './manage-warehouse.component.html',
  styleUrls: ['./manage-warehouse.component.scss']
})
export class ManageWarehouseComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  @ViewChild('dt2') dt2!: Table;
  @ViewChild('dt3') dt3!: Table;

  stocks: any[] = [];
  warehouses: any[] = [];
  stores: any[] = [];
  products: any[] = [];
  adjustments: any[] = [];
  transfers: any[] = [];
  
  selectedWarehouse: any = null;
  selectedStore: any = null;
  selectedProduct: any = null;
  selectedFromWarehouse: any = null;
  selectedToWarehouse: any = null;
  selectedSortOption: any = null;
  
  selectAll: boolean = false;
  selectAllAdjustments: boolean = false;
  selectAllTransfers: boolean = false;

  currentTab: 'stock' | 'adjustment' | 'transfer' = 'stock';

  sortOptions: any[] = [
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Custom Range', value: 'custom' }
  ];

  addStockDialog: boolean = false;
  selectedPerson: any = null;
  persons: any[] = [
    { name: 'James Kirwin', id: 1 },
    { name: 'Francis Chang', id: 2 },
    { name: 'Steven Parker', id: 3 }
    // Add more persons as needed
  ];

  addTransferDialog: boolean = false;
  referenceNumber: string = '';
  searchProduct: string = '';
  notes: string = '';

  addAdjustmentDialog: boolean = false;

  constructor() {}

  ngOnInit() {
    this.loadData();
    this.loadWarehouses();
    this.loadStores();
    this.loadProducts();
  }

  loadData() {
    this.loadStocks();
    this.loadAdjustments();
    this.loadTransfers();
  }

  loadWarehouses() {
    this.warehouses = [
      { name: 'Lavish Warehouse', code: 'LW' },
      { name: 'Quaint Warehouse', code: 'QW' },
      { name: 'Traditional Warehouse', code: 'TW' },
      { name: 'Cool Warehouse', code: 'CW' },
      { name: 'EdgeWare Solutions', code: 'EW' },
      { name: 'North Zone Warehouse', code: 'NZ' },
      { name: 'Overflow Warehouse', code: 'OW' },
      { name: 'Retail Supply Hub', code: 'RSH' },
      { name: 'Lobar Handy', code: 'LH' }
    ];
  }

  loadStores() {
    this.stores = [
      { name: 'Electro Mart', code: 'EM' },
      { name: 'Quantum Gadgets', code: 'QG' },
      { name: 'Prime Bazaar', code: 'PB' },
      { name: 'Gadget World', code: 'GW' },
      { name: 'Volt Vault', code: 'VV' },
      { name: 'Elite Retail', code: 'ER' },
      { name: 'Prime Mart', code: 'PM' },
      { name: 'NeoTech Store', code: 'NT' },
      { name: 'Urban Mart', code: 'UM' }
    ];
  }

  loadProducts() {
    this.products = [
      { name: 'Lenovo IdeaPad 3', image: 'assets/products/laptop.png' },
      { name: 'Beats Pro', image: 'assets/products/headphones.png' },
      { name: 'Nike Jordan', image: 'assets/products/shoes.png' },
      { name: 'Apple Series 5 Watch', image: 'assets/products/watch.png' },
      { name: 'Amazon Echo Dot', image: 'assets/products/speaker.png' },
      { name: 'Lobar Handy', image: 'assets/products/phone.png' },
      { name: 'Red Premium Satchel', image: 'assets/products/bag.png' },
      { name: 'iPhone 14 Pro', image: 'assets/products/iphone.png' },
      { name: 'Gaming Chair', image: 'assets/products/chair.png' }
    ];
  }

  loadStocks() {
    this.stocks = [
      {
        warehouse: 'Lavish Warehouse',
        store: 'Electro Mart',
        product: 'Lenovo IdeaPad 3',
        date: new Date('2024-12-24'),
        person: 'James Kirwin',
        qty: 100,
        productImage: 'assets/products/laptop.png',
        personImage: 'assets/avatars/avatar1.png'
      },
      {
        warehouse: 'Quaint Warehouse',
        store: 'Quantum Gadgets',
        product: 'Beats Pro',
        date: new Date('2024-12-10'),
        person: 'Francis Chang',
        qty: 140,
        productImage: 'assets/products/headphones.png',
        personImage: 'assets/avatars/avatar2.png'
      },
      {
        warehouse: 'Lobar Handy',
        store: 'Prime Bazaar',
        product: 'Nike Jordan',
        date: new Date('2023-07-25'),
        person: 'Steven',
        qty: 120,
        productImage: 'assets/products/shoes.png',
        personImage: 'assets/avatars/avatar3.png'
      }
    ];
  }

  loadAdjustments() {
    this.adjustments = [
      {
        warehouse: 'Lavish Warehouse',
        store: 'Electro Mart',
        product: 'Lenovo IdeaPad 3',
        date: new Date('2024-12-24'),
        person: 'James Kirwin',
        qty: 100,
        productImage: 'assets/products/laptop.png',
        personImage: 'assets/avatars/avatar1.png'
      },
      {
        warehouse: 'Quaint Warehouse',
        store: 'Quantum Gadgets',
        product: 'Beats Pro',
        date: new Date('2024-12-10'),
        person: 'Francis Chang',
        qty: 140,
        productImage: 'assets/products/headphones.png',
        personImage: 'assets/avatars/avatar2.png'
      }
    ];
  }

  loadTransfers() {
    this.transfers = [
      {
        fromWarehouse: 'Lavish Warehouse',
        toWarehouse: 'North Zone Warehouse',
        noOfProducts: 20,
        quantityTransferred: 15,
        refNumber: '#458924',
        date: new Date('2024-12-24')
      },
      {
        fromWarehouse: 'Lobar Handy',
        toWarehouse: 'Nova Storage Hub',
        noOfProducts: 4,
        quantityTransferred: 14,
        refNumber: '#145445',
        date: new Date('2023-07-25')
      },
      {
        fromWarehouse: 'Quaint Warehouse',
        toWarehouse: 'Cool Warehouse',
        noOfProducts: 21,
        quantityTransferred: 10,
        refNumber: '#135478',
        date: new Date('2023-07-28')
      },
      {
        fromWarehouse: 'Traditional Warehouse',
        toWarehouse: 'Retail Supply Hub',
        noOfProducts: 15,
        quantityTransferred: 14,
        refNumber: '#145124',
        date: new Date('2023-07-24')
      },
      {
        fromWarehouse: 'Cool Warehouse',
        toWarehouse: 'EdgeWare Solutions',
        noOfProducts: 14,
        quantityTransferred: 74,
        refNumber: '#474541',
        date: new Date('2023-07-15')
      }
    ];
  }

  openNewStock() {
    this.selectedWarehouse = null;
    this.selectedStore = null;
    this.selectedPerson = null;
    this.selectedProduct = null;
    this.addStockDialog = true;
  }

  hideAddStockDialog() {
    this.addStockDialog = false;
  }

  isStockFormValid(): boolean {
    return !!(
      this.selectedWarehouse &&
      this.selectedStore &&
      this.selectedPerson &&
      this.selectedProduct
    );
  }

  saveStock() {
    if (this.isStockFormValid()) {
      // Implement save logic here
      console.log('Saving stock:', {
        warehouse: this.selectedWarehouse,
        store: this.selectedStore,
        person: this.selectedPerson,
        product: this.selectedProduct
      });
      this.hideAddStockDialog();
    }
  }

  editStock(stock: any) {
    // Implement edit logic
  }

  deleteStock(stock: any) {
    // Implement delete logic
  }

  filterStocks() {
    console.log('Filtering stocks', {
      warehouse: this.selectedWarehouse,
      store: this.selectedStore,
      product: this.selectedProduct
    });
  }

  onSelectAllChange() {
    if (this.stocks) {
      this.stocks.forEach(stock => stock.selected = this.selectAll);
    }
  }

  onRowSelect() {
    if (this.stocks) {
      this.selectAll = this.stocks.every(stock => stock.selected);
    }
  }

  openNewAdjustment() {
    this.selectedWarehouse = null;
    this.selectedStore = null;
    this.selectedPerson = null;
    this.searchProduct = '';
    this.referenceNumber = '';
    this.notes = '';
    this.addAdjustmentDialog = true;
  }

  hideAddAdjustmentDialog() {
    this.addAdjustmentDialog = false;
  }

  isAdjustmentFormValid(): boolean {
    return !!(
      this.searchProduct &&
      this.selectedWarehouse &&
      this.referenceNumber &&
      this.selectedStore &&
      this.selectedPerson &&
      this.notes
    );
  }

  saveAdjustment() {
    if (this.isAdjustmentFormValid()) {
      // Implement save logic here
      console.log('Saving adjustment:', {
        product: this.searchProduct,
        warehouse: this.selectedWarehouse,
        referenceNumber: this.referenceNumber,
        store: this.selectedStore,
        person: this.selectedPerson,
        notes: this.notes
      });
      this.hideAddAdjustmentDialog();
    }
  }

  filterAdjustments() {
    console.log('Filtering adjustments', {
      warehouse: this.selectedWarehouse,
      sortOption: this.selectedSortOption
    });
  }

  onSelectAllAdjustmentsChange() {
    if (this.adjustments) {
      this.adjustments.forEach(adjustment => adjustment.selected = this.selectAllAdjustments);
    }
  }

  onAdjustmentRowSelect() {
    if (this.adjustments) {
      this.selectAllAdjustments = this.adjustments.every(adjustment => adjustment.selected);
    }
  }

  onSearch(event: any, tab: string) {
    const searchValue = event.target.value;
    switch(tab) {
      case 'stock':
        if (this.dt1) this.dt1.filterGlobal(searchValue, 'contains');
        break;
      case 'adjustment':
        if (this.dt2) this.dt2.filterGlobal(searchValue, 'contains');
        break;
      case 'transfer':
        if (this.dt3) this.dt3.filterGlobal(searchValue, 'contains');
        break;
    }
  }

  onTabChange(event: any) {
    this.currentTab = ['stock', 'adjustment', 'transfer'][event.index] as 'stock' | 'adjustment' | 'transfer';
  }

  openNewTransfer() {
    this.selectedFromWarehouse = null;
    this.selectedToWarehouse = null;
    this.referenceNumber = '';
    this.searchProduct = '';
    this.notes = '';
    this.addTransferDialog = true;
  }

  hideAddTransferDialog() {
    this.addTransferDialog = false;
  }

  isTransferFormValid(): boolean {
    return !!(
      this.selectedFromWarehouse &&
      this.selectedToWarehouse &&
      this.referenceNumber &&
      this.searchProduct &&
      this.notes
    );
  }

  saveTransfer() {
    if (this.isTransferFormValid()) {
      // Implement save logic here
      console.log('Saving transfer:', {
        fromWarehouse: this.selectedFromWarehouse,
        toWarehouse: this.selectedToWarehouse,
        referenceNumber: this.referenceNumber,
        product: this.searchProduct,
        notes: this.notes
      });
      this.hideAddTransferDialog();
    }
  }

  importTransfer() {
    console.log('Importing transfer');
  }

  filterTransfers() {
    console.log('Filtering transfers', {
      fromWarehouse: this.selectedFromWarehouse,
      toWarehouse: this.selectedToWarehouse,
      sortOption: this.selectedSortOption
    });
  }

  onSelectAllTransfersChange() {
    if (this.transfers) {
      this.transfers.forEach(transfer => transfer.selected = this.selectAllTransfers);
    }
  }

  onTransferRowSelect() {
    if (this.transfers) {
      this.selectAllTransfers = this.transfers.every(transfer => transfer.selected);
    }
  }
}
