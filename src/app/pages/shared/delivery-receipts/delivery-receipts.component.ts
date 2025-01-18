import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-delivery-receipts',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './delivery-receipts.component.html',
  styleUrl: './delivery-receipts.component.scss'
})
export class DeliveryReceiptsComponent {

}
