import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => void;
}

const jsPDFWithAutoTable = jsPDF as unknown as { new (): jsPDFWithAutoTable };

@Component({
  selector: 'app-receiving',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    TabViewModule
  ],
  templateUrl: './receiving.component.html',
  styleUrls: ['./receiving.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ReceivingComponent {
  pendingOrders = [
    {
      prNumber: 'PR001',
      itemCategory: 'Electronics',
      dateOrdered: '2023-10-01',
      status: 'Pending',
      items: [
        { name: 'Laptop', quantity: 10, condition: 'New' },
        { name: 'Mouse', quantity: 50, condition: 'New' }
      ]
    },
    {
      prNumber: 'PR002',
      itemCategory: 'Furniture',
      dateOrdered: '2023-10-02',
      status: 'Pending',
      items: [
        { name: 'Chair', quantity: 20, condition: 'New' },
        { name: 'Table', quantity: 15, condition: 'New' }
      ]
    },
    {
      prNumber: 'PR003',
      itemCategory: 'Office Supplies',
      dateOrdered: '2023-10-03',
      status: 'Pending',
      items: [
        { name: 'Notebook', quantity: 100, condition: 'New' },
        { name: 'Pen', quantity: 200, condition: 'New' }
      ]
    },
    {
      prNumber: 'PR004',
      itemCategory: 'Kitchen Appliances',
      dateOrdered: '2023-10-04',
      status: 'Pending',
      items: [
        { name: 'Toaster', quantity: 10, condition: 'New' },
        { name: 'Microwave', quantity: 5, condition: 'New' }
      ]
    },
    {
      prNumber: 'PR005',
      itemCategory: 'Cleaning Supplies',
      dateOrdered: '2023-10-05',
      status: 'Pending',
      items: [
        { name: 'Broom', quantity: 30, condition: 'New' },
        { name: 'Mop', quantity: 25, condition: 'New' }
      ]
    },
    {
      prNumber: 'PR006',
      itemCategory: 'Gardening Tools',
      dateOrdered: '2023-10-06',
      status: 'Pending',
      items: [
        { name: 'Shovel', quantity: 15, condition: 'New' },
        { name: 'Rake', quantity: 20, condition: 'New' }
      ]
    },

    // Add more orders as needed
  ];

  deliveredOrders = [
    {
      prNumber: 'PR011',
      itemCategory: 'Electronics',
      dateOrdered: '2023-10-11',
      status: 'Delivered',
      items: [
        { name: 'Monitor', quantity: 10, condition: 'New' },
        { name: 'Keyboard', quantity: 50, condition: 'New' }
      ]
    },
    {
      prNumber: 'PR013',
      itemCategory: 'Fixed Assets',
      dateOrdered: '2023-10-13',
      status: 'Delivered',
      items: [
        { name: 'Office Building', quantity: 1, condition: 'New' },
        { name: 'Company Car', quantity: 5, condition: 'New' }
      ]
    },
    {
      prNumber: 'PR014',
      itemCategory: 'Semi-Expendable Assets',
      dateOrdered: '2023-10-14',
      status: 'Delivered',
      items: [
        { name: 'Laptop', quantity: 20, condition: 'New' },
        { name: 'Projector', quantity: 10, condition: 'New' }
      ]
    }
  ];

  displayModal: boolean = false;
  selectedOrder: any = null;

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService) {}

  openModal(order: any) {
    this.selectedOrder = order;
    this.displayModal = true;
  }

  confirmMarkAsReceived(order: any) {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Are you sure you want to mark this order as received? <br> Your signature will automatically be added to the <br><strong> Receipt and Acknowledgment Form</strong>.',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.markAsReceived(order);
      }
    });
  }

  confirmRejectOrder(order: any) {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Are you sure you want to reject this order?',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.rejectOrder(order);
      }
    });
  }

  markAsReceived(order: any) {
    this.selectedOrder = order;
    this.displayModal = false;
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Order marked as received'});
  }

  markAsNotReceived(order: any) {
    // Logic to mark the order as not received
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Order marked as not received'});
  }

  openConfirmDialog(order: any) {
    this.messageService.clear();
    this.messageService.add({key: 'confirm', sticky: true, severity:'warn', summary:'Are you sure?', detail:'Confirm to proceed'});
  }

  rejectOrder(order: any) {
    this.selectedOrder = order;
    this.displayModal = false;
    this.messageService.add({severity:'error', summary: 'Rejected', detail: 'Order has been rejected'});
  }

  onConfirm() {
    this.messageService.clear('confirm');
    const doc = new jsPDFWithAutoTable();
  }

  exportPDF(order: any) {
    const doc = new jsPDFWithAutoTable();
    doc.setFontSize(18);
    let title = 'Order Receipt';
    let fileName = 'Order_Receipt.pdf';

    if (order.itemCategory === 'Fixed Assets') {
      title = 'Property Acknowledgement Receipt';
      fileName = 'Property_Acknowledgement_Receipt.pdf';
    } else if (order.itemCategory === 'Semi-Expendable Assets') {
      title = 'Inventory Custodian Slip';
      fileName = 'Inventory_Custodian_Slip.pdf';
    }

    doc.text(title, 10, 10);
    doc.setFontSize(12);
    doc.text(`PR Number: ${order.prNumber}`, 10, 20);
    doc.text(`Item Category: ${order.itemCategory}`, 10, 30);
    doc.text(`Date Ordered: ${order.dateOrdered}`, 10, 40);
    doc.text('Items:', 10, 50);

    const items = order.items.map((item: any) => [item.name, item.quantity, item.condition]);
    doc.autoTable({
      head: [['Item', 'Quantity', 'Condition']],
      body: items,
      startY: 60,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
 
    doc.save(fileName);
  }
}