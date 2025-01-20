import { Component, OnInit } from '@angular/core';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { ButtonGroupModule } from 'primeng/buttongroup';

interface PurchaseRequest {
  code: string;
  name: string;
  department: string;
  item: string;
  quantity: number;
  date: string;
}

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [ButtonModule, TableModule, CardModule, TooltipModule, IconFieldModule, InputIconModule, InputTextModule, DialogModule, ImageModule, ButtonGroupModule],
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {
  purchaseRequests: PurchaseRequest[] = [
    { code: 'PR001', name: 'John Doe', department: 'IT', item: 'Laptop', quantity: 1, date: '2023-01-01' },
    { code: 'PR002', name: 'Jane Smith', department: 'HR', item: 'Office Chair', quantity: 5, date: '2023-01-02' },
    { code: 'PR003', name: 'Alice Johnson', department: 'Finance', item: 'Calculator', quantity: 10, date: '2023-01-03' },
    { code: 'PR004', name: 'Bob Brown', department: 'Marketing', item: 'Printer', quantity: 2, date: '2023-01-04' },
    { code: 'PR005', name: 'Charlie Davis', department: 'Sales', item: 'Projector', quantity: 1, date: '2023-01-05' },
    { code: 'PR006', name: 'David Evans', department: 'IT', item: 'Mouse', quantity: 20, date: '2023-01-06' },
    { code: 'PR007', name: 'Eve Foster', department: 'HR', item: 'Desk', quantity: 3, date: '2023-01-07' },
    { code: 'PR008', name: 'Frank Green', department: 'Finance', item: 'Notebook', quantity: 50, date: '2023-01-08' },
    { code: 'PR009', name: 'Grace Harris', department: 'Marketing', item: 'Camera', quantity: 1, date: '2023-01-09' },
    { code: 'PR010', name: 'Hank Irving', department: 'Sales', item: 'Whiteboard', quantity: 2, date: '2023-01-10' }
  ];

  displayModal: boolean = false;
  selectedRequest: PurchaseRequest | null = null;

  ngOnInit(): void {}

  onRowSelect(event: TableRowSelectEvent): void {
    this.selectedRequest = event.data;
    this.displayModal = true;
  }

  hideModal(): void {
    this.displayModal = false;
    this.selectedRequest = null;
  }
}