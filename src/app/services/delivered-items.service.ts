import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface DeliveryItem {
  id: string;
  name: string;
  quantity: number;
  status: 'pending' | 'delivered' | 'missing';
  isDelivered: boolean;
}

export interface DeliveredItem {
  id: string;
  supplierName: string;
  supplierId: string;
  dateDelivered: Date;
  department: string;
  documentUrl: string;
  status: 'pending' | 'accepted' | 'rejected';
  items: DeliveryItem[];
}

@Injectable({
  providedIn: 'root'
})
export class DeliveredItemsService {
  private mockData: DeliveredItem[] = [
    {
      id: '1',
      supplierName: 'Tech Solutions Inc.',
      supplierId: 'SUP-001',
      dateDelivered: new Date('2025-01-20'),
      department: 'IT',
      documentUrl: 'assets/mock-invoice.pdf',
      status: 'pending',
      items: [
        { id: '1-1', name: 'Laptop Dell XPS 13', quantity: 5, status: 'pending', isDelivered: false },
        { id: '1-2', name: 'Monitor 27"', quantity: 5, status: 'pending', isDelivered: false },
        { id: '1-3', name: 'Wireless Mouse', quantity: 10, status: 'pending', isDelivered: false }
      ]
    },
    {
      id: '2',
      supplierName: 'Office Depot',
      supplierId: 'SUP-002',
      dateDelivered: new Date('2025-01-19'),
      department: 'HR',
      documentUrl: 'assets/mock-invoice.pdf',
      status: 'pending',
      items: [
        { id: '2-1', name: 'Office Chairs', quantity: 10, status: 'pending', isDelivered: false },
        { id: '2-2', name: 'Filing Cabinets', quantity: 3, status: 'pending', isDelivered: false }
      ]
    }
  ];

  getDeliveredItems(): Observable<DeliveredItem[]> {
    return of(this.mockData);
  }

  updateDeliveryItems(itemId: string, updatedItems: DeliveryItem[]): Observable<any> {
    const itemIndex = this.mockData.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      this.mockData[itemIndex].items = updatedItems;
    }
    return of({ success: true });
  }

  acceptDelivery(itemId: string): Observable<any> {
    const itemIndex = this.mockData.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      this.mockData[itemIndex].status = 'accepted';
    }
    return of({ success: true });
  }

  rejectDelivery(itemId: string, reason: string): Observable<any> {
    const itemIndex = this.mockData.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      this.mockData[itemIndex].status = 'rejected';
    }
    return of({ success: true });
  }

  generateDeliveryReceipt(itemId: string): Observable<Blob> {
    const item = this.mockData.find(i => i.id === itemId);
    if (!item) return of(new Blob());
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('DELIVERY RECEIPT', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Receipt No: ${item.supplierId}_DR`, 15, 30);
    doc.text(`Date: ${new Date(item.dateDelivered).toLocaleDateString()}`, 15, 40);
    doc.text(`Supplier: ${item.supplierName}`, 15, 50);
    doc.text(`Department: ${item.department}`, 15, 60);

    const tableData = item.items.map(i => [
      i.id,
      i.name,
      i.quantity.toString(),
      i.isDelivered ? 'Delivered' : 'Pending'
    ]);

    (doc as any).autoTable({
      head: [['Item ID', 'Description', 'Quantity', 'Status']],
      body: tableData,
      startY: 70,
    });

    return of(doc.output('blob'));
  }

  generateInspectionReport(itemId: string): Observable<Blob> {
    const item = this.mockData.find(i => i.id === itemId);
    if (!item) return of(new Blob());
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('INSPECTION AND ACCEPTANCE REPORT', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`IAR No: ${item.supplierId}_IAR`, 15, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 40);
    doc.text(`Supplier: ${item.supplierName}`, 15, 50);
    doc.text(`Department: ${item.department}`, 15, 60);

    const tableData = item.items.map(i => [
      i.id,
      i.name,
      i.quantity.toString(),
      i.isDelivered ? 'Passed' : 'Pending',
      ''
    ]);

    (doc as any).autoTable({
      head: [['Item ID', 'Description', 'Quantity', 'Status', 'Remarks']],
      body: tableData,
      startY: 70,
    });

    return of(doc.output('blob'));
  }
}