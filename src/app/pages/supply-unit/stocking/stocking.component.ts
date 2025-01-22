import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { TabsModule } from 'primeng/tabs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { FormControl, FormGroup, FormsModule, Validators,ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LottieAnimationComponent } from '../../ui-components/lottie-animation/lottie-animation.component';
import { ToastModule } from 'primeng/toast';
import { CarouselModule } from 'primeng/carousel';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { Stock, StocksService } from 'src/app/services/stocks.service';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge'
import { DeliveryReceipt, DeliveryReceiptItems, DeliveryReceiptService } from 'src/app/services/delivery-receipt.service';
import { SelectModule } from 'primeng/select';
import { InventoryLocation, InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-stocking',
  standalone: true,
  imports: [MaterialModule,TableModule, CommonModule, DividerModule,TabsModule,
    IconFieldModule,InputIconModule,InputTextModule, FluidModule, FormsModule,
    DialogModule,ButtonModule, ButtonGroupModule,ConfirmPopupModule, LottieAnimationComponent, 
    CarouselModule,InputNumberModule,ReactiveFormsModule, SelectModule,
    ToastModule,TooltipModule,TextareaModule,BadgeModule,OverlayBadgeModule
  ],
  providers: [ConfirmationService,MessageService],
  templateUrl: './stocking.component.html',
  styleUrl: './stocking.component.scss'
})
export class StockingComponent {
    drItems: DeliveryReceiptItems[] = [];  // List of purchase orders with items
    allDRItems: DeliveryReceiptItems[] = [];  // List of purchase orders with items
    inventories: InventoryLocation[];
    allInventories:InventoryLocation[];
    searchValue:string='';
    stockTab:number=1;
    showReceipt:boolean=false;
    selectedReceipts:string[]=[
     'assets/images/products/sample-receipt.png'
    ];
  
    constructor(
      private messageService: MessageService,
      private stockService:StocksService,
      private confirmationService: ConfirmationService, 
      private inventoryService: InventoryService,
      private deliveryReceiptService: DeliveryReceiptService) {}
  
    ngOnInit() {
      this.fetchItems();
    }
  
    generateRandomNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    async fetchItems(){
      // Fetch the purchase orders with items
      this.allDRItems = await this.deliveryReceiptService.getAllDRItems();
      this.inventories = await this.inventoryService.getAllLocations();
      this.allInventories = await this.inventoryService.getAllLocations();
      this.switchStockTab(1);
    }
  
    switchStockTab(tab:number){
      if(tab ==0){
        this.drItems =this.allDRItems.filter(dr=>dr.deliveryReceipt.stocked);
      }else{
        this.drItems =this.allDRItems.filter(dr=>!dr.deliveryReceipt.stocked);
      }
      this.stockTab = tab;
    }
  
    countStocked(){
      return this.allDRItems.filter(dr=>dr.deliveryReceipt.stocked).length;
    }
  
    countUnstocked(){
      return this.allDRItems.filter(dr=>!dr.deliveryReceipt.stocked).length;
    }
  
    // Utility method to calculate the total number of items in each group
    calculateItemTotal(drId: string): number {
      const dr = this.drItems.find(item => item.deliveryReceipt.id === drId);
      return dr ? dr.items.length : 0;
    }
    calculateItemPriceTotal(drId: string): number {
      const dr = this.drItems.find(item => item.deliveryReceipt.id === drId);
      return dr ? dr.items.reduce((acc,curr)=>acc+curr.price * curr.quantity,0) : 0;
    }
  
    responsiveOptions: any[] = [
      {
          breakpoint: '1300px',
          numVisible: 4
      },
      {
          breakpoint: '575px',
          numVisible: 1
      }
    ];
    
    
    viewReceipts(receipts:string[]){
      // this.selectedReceipts = receipts;
      this.showReceipt = true;
    }
  
  
    showStockModal:boolean = false;
    selectedDeliveryReceipt?:DeliveryReceipt;
    async openAddStockModal(dr:DeliveryReceipt){
      this.selectedStock = undefined;
      this.stockForm.reset();
      this.selectedDeliveryReceipt = dr;
      this.inventories = await this.inventoryService.getLocationsOnDepartment(this.selectedDeliveryReceipt.department_id);
      this.showStockModal= true;
    }
  
    selectedStock?:Stock;
    async openEditStockModal(dr:DeliveryReceipt,stock:Stock){
      this.selectedDeliveryReceipt = dr;
      this.selectedStock = stock;
      this.inventories = await this.inventoryService.getLocationsOnDepartment(this.selectedDeliveryReceipt.department_id);
      this.stockForm.setValue({
        name: this.selectedStock.name,
        ticker: this.selectedStock.ticker,
        price: this.selectedStock.price,
        storage: this.allInventories.find(inv=>inv.id == this.selectedStock!.storage_id)??null,
        quantity: this.selectedStock.quantity,
        description: this.selectedStock.description || '' 
      })
      this.showStockModal= true;
    }
  
  
    closeStockModal(){
      this.selectedDeliveryReceipt = undefined;
      this.selectedStock = undefined;
      this.stockForm.reset();
      this.showStockModal= false;
    }
  
    stockForm = new FormGroup({
      name: new FormControl('', Validators.required),
      ticker: new FormControl('', Validators.required),
      storage: new FormControl<InventoryLocation|null>(null, Validators.required),
      price: new FormControl<number|null>(null, [Validators.required, Validators.min(0.001)]),
      quantity: new FormControl<number|null>(null, [Validators.required, Validators.min(1)]),
      description: new FormControl(''),
    });
  
    async addStock(){
      if (!this.stockForm.valid) return;
      const stockData = this.stockForm.value;
      await this.stockService.addStock({
        dr_id: this.selectedDeliveryReceipt?.receipt_number!,
        dateAdded: new Date(),
        name: stockData.name!,
        storage_id: stockData.storage?.id,
        storage_name: stockData.storage?.name,
        ticker: stockData.ticker!.toUpperCase(),
        price: Number(stockData.price!),
        quantity: Number(stockData.quantity!),
        description: stockData.description ?? undefined,
      })
      this.stockForm.reset();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully added stock to Receipt No. ${this.selectedDeliveryReceipt?.id}` });
      this.closeStockModal()
      await this.fetchItems();
      this.switchStockTab(1);
    }
  
    async editStock(){
      if (!this.stockForm.valid) return;
      const stockData = this.stockForm.value;
      await this.stockService.editStock({
        id: this.selectedStock!.id,
        dr_id: this.selectedStock!.dr_id,
        dateAdded: this.selectedStock!.dateAdded,
        name: stockData.name!,
        storage_id: stockData.storage?.id,
        storage_name: stockData.storage?.name,
        ticker: stockData.ticker!.toUpperCase(),
        price: Number(stockData.price!),
        quantity: Number(stockData.quantity!),
        description: stockData.description ?? undefined,
      })
      this.stockForm.reset();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully edited stock on Receipt No. ${this.selectedDeliveryReceipt?.id}` });
      this.closeStockModal()
      await this.fetchItems();
      this.switchStockTab(1);
    }
  
    async confirmDeleteStock(event: Event,id:string){
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure you want to delete this stock in this receipt?',
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
            await this.stockService.deleteStock(id);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `Stock successfully deleted!` });
            await this.fetchItems();
            this.switchStockTab(1);
        },
        reject: () => {
            
        }
    });
    }
  
    confirmSubmit(event: Event, dr:DeliveryReceipt) {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'Are you sure you want to finalize stocks for this receipt?',
          icon: 'pi  pi-exclamation-triangle',
          rejectButtonProps: {
              label: 'Cancel',
              severity: 'secondary',
              outlined: true
          },
          acceptButtonProps: {
              label: 'Confirm'
          },
          accept: async () => {
              await this.deliveryReceiptService.markAsStocked(dr.id!);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: `Receipt No. ${dr.receipt_number.toUpperCase()} successfully stocked!` });
              this.fetchItems();
          },
          reject: () => {
              
          }
      });
  }
}
