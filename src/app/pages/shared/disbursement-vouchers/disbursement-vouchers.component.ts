import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { DeliveryReceiptService } from 'src/app/services/delivery-receipt.service';
import { DisbursementVoucher, DisbursementVoucherService } from 'src/app/services/disbursement-voucher.service';
import { LottieAnimationComponent } from '../../ui-components/lottie-animation/lottie-animation.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FluidModule } from 'primeng/fluid';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
import { PdfGeneratorService } from 'src/app/services/pdf-generator.service';

@Component({
  selector: 'app-disbursement-vouchers',
  standalone: true,
  imports:  [MaterialModule,CommonModule, StepperModule, TableModule, ButtonModule, ButtonModule, 
      InputText, InputIcon,IconFieldModule, FormsModule,
       ToastModule, ReactiveFormsModule, LottieAnimationComponent,
      FluidModule, TooltipModule, DialogModule, InputTextModule,ConfirmPopupModule],
  providers:[MessageService, ConfirmationService],
  
  templateUrl: './disbursement-vouchers.component.html',
  styleUrl: './disbursement-vouchers.component.scss'
})
export class DisbursementVouchersComponent {
  
    activeStep:number = 1;
    disbursementVouchers:DisbursementVoucher[]=[];
    filteredDisbursementVouchers:DisbursementVoucher[]=[];
  
    searchValue:string='';
  
    showDisbursementModal:boolean = false;
  
    form = new FormGroup({
      delivery_date: new FormControl('', [Validators.required]),
      receipt_number:  new FormControl('',[ Validators.required]),
      supplier_name:  new FormControl('',[Validators.required]),
      total_amount:  new FormControl<number|null>( null,[Validators.required, Validators.min(0.001)]),
      notes:  new FormControl(''),
      files:  new FormControl<any>(null,[ Validators.required]), // You can later manage file upload logic in the component
    });
  
    constructor(
      private router:Router,
      private confirmationService:ConfirmationService,
      private messageService:MessageService,
      private pdfService:PdfGeneratorService,
      private deliveryReceiptService:DeliveryReceiptService,
      private disbursementVoucherService:DisbursementVoucherService){}
  
    ngOnInit(): void {
      this.fetchItems();
    }

    selectedDisbursementVoucher?:DisbursementVoucher;

  
    filterByStatus(status:'pending'|'processing'|'recorded'){
      this.filteredDisbursementVouchers = this.disbursementVouchers.filter(r => r.status == status);
    }
  
    getSeverityFromStatus(status:'pending'|'processing'|'recorded'){
      return status == 'recorded' ? 'success' : 'secondary';
    }  
  
    nextStep(){
      this.activeStep++;
      switch (this.activeStep) {
        case 1:
          this.filterByStatus('pending');
          break;
        case 2:
          this.filterByStatus('processing');
          break;
        case 3:
          this.filterByStatus('recorded');
          break;
      }
    }
    backStep(){
      this.activeStep--;
      switch (this.activeStep) {
        case 1:
          this.filterByStatus('pending');
          break;
        case 2:
          this.filterByStatus('processing');
          break;
        case 3:
          this.filterByStatus('recorded');
          break;
      }
    }

  
    async confirmToAccounting(event: Event,id:string){
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure you want to submit this voucher to accounting?',
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
            this.disbursementVoucherService.sendToAccounting(id);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully submitted voucher to accounting.` });
            await this.fetchItems();
            this.filterByStatus('processing');
            this.activeStep = 2;
        },
        reject: () => {
            
        }
      });
    }

    printVoucher(voucher:DisbursementVoucher){
      const blob = this.pdfService.generateDisbursementVoucher(voucher);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `disbursement-voucher-${voucher.voucherNo}.pdf`;
      link.click();
    }
  
  
    async fetchItems(){
      const receiptWithItems = await this.deliveryReceiptService.getAllDRItems();
      this.disbursementVouchers = await this.disbursementVoucherService.generateDisbursementVouchers(receiptWithItems);
      this.filterByStatus('pending');
    }
}
