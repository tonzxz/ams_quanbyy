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
import { Product, ProductsService } from 'src/app/services/products.service';
import {toDataURL} from 'qrcode';
import {jsPDF} from 'jspdf';
import { User, UserService } from 'src/app/services/user.service';
import { DepartmentService } from 'src/app/services/departments.service';
@Component({
  selector: 'app-special-receiving',
  standalone: true,
  imports: [MaterialModule,TableModule, CommonModule, DividerModule,TabsModule,
    IconFieldModule,InputIconModule,InputTextModule, FluidModule, FormsModule,
    DialogModule,ButtonModule, ButtonGroupModule,ConfirmPopupModule, LottieAnimationComponent, 
    CarouselModule,InputNumberModule,ReactiveFormsModule, SelectModule,
    ToastModule,TooltipModule,TextareaModule,BadgeModule,OverlayBadgeModule
  ],
  providers: [ConfirmationService,MessageService],
   templateUrl: './special-receiving.component.html',
  styleUrl: './special-receiving.component.scss'
})
export class SpecialReceivingComponent {
    drItems: DeliveryReceiptItems[] = [];  // List of purchase orders with items
    allDRItems: DeliveryReceiptItems[] = [];  // List of purchase orders with items
    inventories: InventoryLocation[];
    allInventories:InventoryLocation[];
    products:Product[];
    stocks:Stock[]=[];
    currentUser?:User;
    searchValue:string='';
    stockTab:number=1;
    showReceipt:boolean=false;
    selectedReceipts:string[]=[
     'assets/images/products/sample-receipt.png'
    ];
  
    constructor(
      private messageService: MessageService,
      private stockService:StocksService,
      private productService:ProductsService,
      private confirmationService: ConfirmationService, 
      private departmentService:DepartmentService,
      private inventoryService: InventoryService,
      private userService:UserService,
      private deliveryReceiptService: DeliveryReceiptService) {}
  
    ngOnInit() {
      this.fetchItems();
    }
  
    generateRandomNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateQR(item:Stock){
      const pdf = new jsPDF();
      let yOffset = 10; // Vertical offset for positioning the QR codes on the PDF
      let xOffset = 10; // Starting position for QR code (horizontal)
      const qrSize = 40; // Size of the QR codes in the PDF
      const maxWidth = 210; // A4 page width in mm (ISO 216 standard)
      const maxHeight = 297; // A4 page height in mm (ISO 216 standard)
      const textOffset = 5; // Space between the QR code and the text
      const id = `${item.ticker}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`;

        // Generate QR code as a base64 image
        toDataURL(id, { width: qrSize, errorCorrectionLevel: 'M' }, (err: any, url: string) => {
          if (err) {
            console.error('Error generating QR code:', err);
            return;
          }

          // Add the QR code image to the PDF
          pdf.addImage(url, 'PNG', xOffset, yOffset, qrSize, qrSize); // Position and size
          const textWidth = pdf.getTextWidth(id); // Get width of the text
          const textXOffset = xOffset + (qrSize - textWidth) / 2; // Center the text beneath the QR code
          const fontSize = 8; // Font size for the text

          // Add text beneath the QR code, centered
          pdf.setFontSize(fontSize); // Set the font size
          pdf.text(id, textXOffset, yOffset + qrSize + textOffset); 

          // Update xOffset for the next QR code
          xOffset += qrSize + 10; // Add a little space between QR codes horizontally

          // If the QR code goes beyond the width of the page, move to the next row
          if (xOffset + qrSize > maxWidth) {
            xOffset = 10; // Reset xOffset to the start of the page
            yOffset += qrSize + 10; // Move to the next row
            yOffset += qrSize + textOffset + fontSize + 10; 
          }


          // Check if we need to add a new page for the QR codes
          if (yOffset + qrSize > maxHeight) {
            pdf.addPage(); // Add new page if the QR codes exceed the page height
            xOffset = 10; // Reset xOffset for new page
            yOffset = 10; // Reset yOffset for new page
          }
        });

        pdf.save(`${id}-qr-codes.pdf`);
    }

    generateQRBatch(item:Stock) {

      const remainingQR = item.quantity - (item.qrs?.length ?? 0) ;
      
      const pdf = new jsPDF();
      const textOffset = 5; 
      let yOffset = 10; // Vertical offset for positioning the QR codes on the PDF
      let xOffset = 10; // Starting position for QR code (horizontal)
      const qrSize = 40; // Size of the QR codes in the PDF
      const maxWidth = 210; // A4 page width in mm (ISO 216 standard)
      const maxHeight = 297; // A4 page height in mm (ISO 216 standard)
      const cols = Math.floor(maxWidth / qrSize); // Number of QR codes per row
      const rows = Math.floor(maxHeight / qrSize); // Number of QR codes per column
      for (let i = 0; i < remainingQR; i++) {
        const id = `${item.ticker}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`;
      
        // Generate QR code as a base64 image
        toDataURL(id, { width: qrSize, errorCorrectionLevel: 'M' }, (err: any, url: string) => {
          if (err) {
            console.error('Error generating QR code:', err);
            return;
          }
      
          // Add the QR code image to the PDF
          pdf.addImage(url, 'PNG', xOffset, yOffset, qrSize, qrSize); // Position and size
      
          // Calculate the width of the text and adjust xOffset for centering
          const textWidth = pdf.getTextWidth(id); // Get width of the text
          const textXOffset = xOffset + (qrSize - textWidth) / 2; // Center the text beneath the QR code
          const fontSize = 8; // Font size for the text
      
          // Set font size for the text
          pdf.setFontSize(fontSize); 
      
          // Add text beneath the QR code, centered
          pdf.text(id, textXOffset, yOffset + qrSize + textOffset); 
      
          // Update xOffset for the next QR code
          xOffset += qrSize + 10; // Add a little space between QR codes horizontally
      
          // If the QR code goes beyond the width of the page, move to the next row
          if (xOffset + qrSize > maxWidth) {
            xOffset = 10; // Reset xOffset to the start of the page
            yOffset += qrSize + 10; // Move to the next row
            yOffset += qrSize + textOffset + fontSize + 10; // Ensure space for the next QR and text
          }
      
          // Check if we need to add a new page for the QR codes
          if (yOffset + qrSize > maxHeight) {
            pdf.addPage(); // Add new page if the QR codes exceed the page height
            xOffset = 10; // Reset xOffset for new page
            yOffset = 10; // Reset yOffset for new page
          }
        });
      }
      

  
      pdf.save(`${item.ticker}-qr-codes.pdf`);
      
    }
  
    async fetchItems(){
      this.currentUser =  this.userService.getUser();
      if(this.currentUser?.role == 'superadmin'){
        this.currentUser!.role = 'supply';
      }
      this.stocks = await this.stockService.getAll();
      this.stocks = this.stocks.filter(s=>!s.dr_id )
      this.inventories = await this.inventoryService.getAllLocations();
      this.allInventories = await this.inventoryService.getAllLocations();
      this.products = await this.productService.getAll();
     
      this.switchStockTab(1);
    
    }
  

    async markItemAsDelivered(item:Stock){
      await this.stockService.editStock({
        ...item,
        status:'delivered'
      });
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Item marked as delivered!` });
      await this.fetchItems();
      this.switchStockTab(0);
    }

    async markItemForDelivery(item:Stock){
      await this.stockService.editStock({
        ...item,
        status:'pending'
      });
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Item marked for delivery!` });
      await this.fetchItems();
      this.switchStockTab(0);
    }

    switchStockTab(tab:number){
      if(tab ==0){
        this.drItems =this.allDRItems.filter(dr=>dr.deliveryReceipt.stocked);
        if(this.currentUser?.role =='end-user'){
          this.drItems = this.drItems.filter(dr=>dr.items.find(item=>item.status));
        }
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
    async openAddStockModal(){
      this.selectedStock = undefined;
      this.stockForm.reset();
      this.inventories = await this.inventoryService.getLocationsOnDepartment(await this.departmentService.getOfficeDepartment(this.currentUser?.officeId!));
      this.showStockModal= true;
    }
  
    selectedStock?:Stock;
    async openEditStockModal(stock:Stock){
      this.selectedStock = stock;
      this.inventories = await this.inventoryService.getLocationsOnDepartment(await this.departmentService.getOfficeDepartment(this.currentUser?.officeId!));
      this.stockForm.setValue({
        name: this.selectedStock.name,
        ticker: this.selectedStock.ticker,
        storage: this.allInventories.find(inv=>inv.id == this.selectedStock!.storage_id)??null,
        type: this.products.find(product=>product.id == this.selectedStock!.product_id)??null,
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
      type: new FormControl<Product|null>(null, Validators.required),
      quantity: new FormControl<number|null>(null, [Validators.required, Validators.min(1)]),
      description: new FormControl(''),
    });
  
    async addStock(){
      if (!this.stockForm.valid) return;
      const stockData = this.stockForm.value;
      await this.stockService.addStock({
        dr_id:undefined,
        dateAdded: new Date(),
        name: stockData.name!,
        storage_id: stockData.storage?.id,
        storage_name: stockData.storage?.name,
        product_id: stockData.type?.id,
        product_name: stockData.type?.name,
        ticker: stockData.ticker!.toUpperCase(),
        price: 0,
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
        dr_id: undefined,
        dateAdded: this.selectedStock!.dateAdded,
        name: stockData.name!,
        storage_id: stockData.storage?.id,
        storage_name: stockData.storage?.name,
        product_id: stockData.type?.id,
        product_name: stockData.type?.name,
        ticker: stockData.ticker!.toUpperCase(),
        price: 0,
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
