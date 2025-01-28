import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DeliveryReceiptService, DeliveryReceiptItems } from 'src/app/services/delivery-receipt.service';
import { MaterialModule } from 'src/app/material.module';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { LottieAnimationComponent } from "../../ui-components/lottie-animation/lottie-animation.component";

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ConfirmPopupModule,
    MaterialModule,
    DividerModule,
    BadgeModule,
    OverlayBadgeModule,
    IconField,
    InputIcon,
    LottieAnimationComponent
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit {
  drItems: DeliveryReceiptItems[] = []; // Items fetched from the service
  allDRItems: DeliveryReceiptItems[] = []; // Complete list of items
  searchValue: string = '';

  constructor(
    private deliveryReceiptService: DeliveryReceiptService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.fetchDeliveryItems();
  }

  async fetchDeliveryItems() {
    try {
      this.allDRItems = await this.deliveryReceiptService.getAllDRItems();
      this.drItems = this.allDRItems.filter(dr => dr.deliveryReceipt.stocked);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error Fetching Data',
        detail: 'Failed to load delivery items.',
      });
    }
  }

  countStocked(): number {
    return this.allDRItems.filter(dr => dr.deliveryReceipt.stocked).length;
  }

  calculateItemTotal(drId: string): number {
    const dr = this.drItems.find(item => item.deliveryReceipt.id === drId);
    return dr ? dr.items.length : 0;
  }

  calculateItemPriceTotal(drId: string): number {
    const dr = this.drItems.find(item => item.deliveryReceipt.id === drId);
    return dr ? dr.items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0) : 0;
  }

  deliverItem(item: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Delivery Initiated',
      detail: `Item "${item.name || 'Unnamed Item'}" is being delivered.`,
    });
  }

  deliverToEndUser(receipt: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Delivery Initiated',
      detail: `Items under Receipt No. ${receipt.receipt_number} are being delivered.`,
    });
  }
}