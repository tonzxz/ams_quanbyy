// services/pdf-generator.service.ts
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DeliveredItem } from '../pages/shared/delivered-items/delivered-items.interface';
import { DisbursementVoucher } from './disbursement-voucher.service';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  generateDeliveryReceipt(item: DeliveredItem): Blob {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('DELIVERY RECEIPT', 105, 15, { align: 'center' });
    
    // Information
    doc.setFontSize(12);
    doc.text(`Receipt No: ${item.id}`, 15, 30);
    doc.text(`Date: ${new Date(item.dateDelivered).toLocaleDateString()}`, 15, 40);
    
    // Supplier Info
    doc.text('Supplier Information:', 15, 55);
    doc.text(`Name: ${item.supplierName}`, 25, 65);
    doc.text(`ID: ${item.supplierId}`, 25, 75);
    doc.text(`Department: ${item.department}`, 25, 85);

    // Items Table
    const tableData = item.items.map(i => [
      i.id,
      i.name,
      i.quantity.toString(),
      i.isDelivered ? 'Delivered' : 'Pending'
    ]);

    (doc as any).autoTable({
      startY: 95,
      head: [['Item ID', 'Item Name', 'Quantity', 'Status']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });

    // Signatures
    const finalY = (doc as any).lastAutoTable.finalY + 30;
    
    doc.text('Received by:', 15, finalY);
    doc.line(15, finalY + 25, 85, finalY + 25);
    doc.text('Signature over Printed Name', 25, finalY + 35);
    doc.text('Position/Designation:', 25, finalY + 45);
    doc.text('Date:', 25, finalY + 55);

    doc.text('Delivered by:', 120, finalY);
    doc.line(120, finalY + 25, 190, finalY + 25);
    doc.text('Signature over Printed Name', 130, finalY + 35);
    doc.text('Position/Designation:', 130, finalY + 45);
    doc.text('Date:', 130, finalY + 55);

    return doc.output('blob');
  }

  generateInspectionReport(item: DeliveredItem): Blob {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('INSPECTION AND ACCEPTANCE REPORT', 105, 15, { align: 'center' });
    
    // Document Info
    doc.setFontSize(12);
    doc.text(`IAR No: ${item.id}`, 15, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 40);

    // Supplier Info
    doc.text('Supplier Information:', 15, 55);
    doc.text(`Name: ${item.supplierName}`, 25, 65);
    doc.text(`ID: ${item.supplierId}`, 25, 75);
    doc.text(`Department: ${item.department}`, 25, 85);

    // Items Table
    const tableData = item.items.map(i => [
      i.id,
      i.name,
      i.quantity.toString(),
      i.isDelivered ? 'Pass' : 'Pending',
      '' // Remarks
    ]);

    (doc as any).autoTable({
      startY: 95,
      head: [['Item ID', 'Item Description', 'Quantity', 'Inspection', 'Remarks']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });

    // Inspection Details
    const finalY = (doc as any).lastAutoTable.finalY + 30;
    
    doc.text('INSPECTION', 15, finalY);
    doc.text('Date Inspected: _________________', 25, finalY + 10);
    doc.text('Time Started: ___________________', 25, finalY + 20);
    doc.text('Time Finished: __________________', 25, finalY + 30);

    // Checkboxes
    doc.text('Inspection Findings:', 15, finalY + 45);
    doc.rect(25, finalY + 50, 5, 5); // Checkbox
    doc.text('Inspected and verified the items as to quantity and specifications', 35, finalY + 54);
    
    doc.rect(25, finalY + 60, 5, 5); // Checkbox
    doc.text('Complete and in good condition', 35, finalY + 64);

    // Signatures
    doc.text('Inspected by:', 15, finalY + 80);
    doc.line(15, finalY + 100, 85, finalY + 100);
    doc.text('Inspector', 35, finalY + 110);

    doc.text('Accepted by:', 120, finalY + 80);
    doc.line(120, finalY + 100, 190, finalY + 100);
    doc.text('Property Officer', 140, finalY + 110);

    return doc.output('blob');
  }

   // Method for generating a Disbursement Voucher PDF
   generateDisbursementVoucher(voucher: DisbursementVoucher): Blob {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('DISBURSEMENT VOUCHER', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.line(10, 25, 200, 25);  // Line below header

    // Voucher Information Section
    doc.text(`Voucher No: ${voucher.voucherNo}`, 15, 40);
    doc.text(`Date: ${new Date(voucher.date).toLocaleDateString()}`, 15, 50);
    doc.text(`Delivery Receipt No: ${voucher.deliveryReceiptNo}`, 15, 60);
    doc.text(`Supplier Name: ${voucher.supplierName}`, 15, 70);
    doc.text(`Payment Method: ${voucher.paymentMethod}`, 15, 80);
    doc.text(`Total Amount Due: ${voucher.totalAmountDue.toFixed(2)}`, 15, 90);

    if (voucher.notes) {
      doc.text(`Notes: ${voucher.notes}`, 15, 100);
    }

    doc.line(10, 105, 200, 105);  // Line separator

    // Items Table
    const tableData = voucher.itemizedDetails.map(item => [
      item.itemDescription,
      item.quantity.toString(),
      item.unitPrice.toFixed(2),
      item.totalPrice.toFixed(2),
    ]);

    (doc as any).autoTable({
      startY: 125,
      head: [['Item Description', 'Quantity', 'Unit Price', 'Total Price']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 11, halign: 'center' },
      bodyStyles: { fontSize: 10, halign: 'center' },
      margin: { top: 20 },
    });

    // Final Amount & Notes (Optional)
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount Due: ${voucher.totalAmountDue.toFixed(2)}`, 15, finalY);

    if (voucher.notes) {
      doc.setFont('helvetica', 'normal');
      doc.text(`Notes: ${voucher.notes}`, 15, finalY + 10);
    }

    doc.line(10, finalY + 20, 200, finalY + 20);  // Line separator

    // Footer (Optional, Page Numbers)
    doc.setFontSize(8);
    const pageCount = doc.getNumberOfPages();
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber} of ${pageCount}`, 190, doc.internal.pageSize.height - 10, { align: 'right' });

    // Return Blob Output
    return doc.output('blob');

  }
}