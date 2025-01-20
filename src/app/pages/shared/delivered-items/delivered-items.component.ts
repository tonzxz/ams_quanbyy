// delivered-items.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeliveredItemsService, DeliveredItem } from '../../../services/delivered-items.service';
import { ChecklistModalComponent } from './checklist-modal.component';
import { RejectModalComponent } from './reject-modal.component';

@Component({
  selector: 'app-delivered-items',
  templateUrl: './delivered-items.component.html',
  styleUrls: ['./delivered-items.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule
  ]
})
export class DeliveredItemsComponent implements OnInit {
  dataSource = new MatTableDataSource<DeliveredItem>();
  displayedColumns: string[] = ['supplier', 'dateDelivered', 'department', 'status', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private deliveredItemsService: DeliveredItemsService
  ) {}

  ngOnInit() {
    this.loadDeliveredItems();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadDeliveredItems() {
    this.deliveredItemsService.getDeliveredItems().subscribe(items => {
      this.dataSource.data = items;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewChecklist(item: DeliveredItem) {
    const dialogRef = this.dialog.open(ChecklistModalComponent, {
      width: '800px',
      data: { ...item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deliveredItemsService.updateDeliveryItems(item.id, result.items)
          .subscribe(() => this.loadDeliveredItems());
      }
    });
  }

  viewDocument(documentUrl: string) {
    window.open(documentUrl, '_blank');
  }

  acceptDelivery(item: DeliveredItem) {
    this.deliveredItemsService.acceptDelivery(item.id).subscribe(() => {
      // Generate and download PDFs
      this.deliveredItemsService.generateDeliveryReceipt(item.id).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `delivery-receipt-${item.id}.pdf`;
        link.click();
      });

      this.deliveredItemsService.generateInspectionReport(item.id).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `inspection-report-${item.id}.pdf`;
        link.click();
      });

      this.loadDeliveredItems();
    });
  }

  rejectDelivery(item: DeliveredItem) {
    const dialogRef = this.dialog.open(RejectModalComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(reason => {
      if (reason) {
        this.deliveredItemsService.rejectDelivery(item.id, reason)
          .subscribe(() => this.loadDeliveredItems());
      }
    });
  }

  getDepartmentClass(department: string): string {
    return department.toLowerCase() === 'it' 
      ? 'bg-blue-50 text-blue-700' 
      : 'bg-green-50 text-green-700';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'accepted': return 'bg-green-50 text-green-700';
      case 'rejected': return 'bg-red-50 text-red-700';
      default: return 'bg-yellow-50 text-yellow-700';
    }
  }
}