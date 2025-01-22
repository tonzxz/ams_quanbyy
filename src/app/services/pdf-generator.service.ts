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

    // Header (More formal title, black and white)
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL PAYMENT AUTHORIZATION VOUCHER', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);  // Ensure black text color
    doc.line(10, 25, 200, 25);  // Line below header

    // Company Information (Example, black and white)
    doc.setFontSize(14);
    doc.text('Quanby Solutions Inc.', 105, 35, { align: 'center' });
    doc.setFontSize(10);
    doc.text('1234 Business Rd, Suite 500', 105, 40, { align: 'center' });
    doc.text('Legazpi City, Albay, 4200', 105, 45, { align: 'center' });
    doc.text('Phone: (123) 456-7890', 105, 50, { align: 'center' });
    doc.text('Email: quanbydevs@gmail.com', 105, 55, { align: 'center' });
    doc.line(10, 60, 200, 60);  // Line separator

    // Voucher Information Section (Black and white)
    doc.setFontSize(12);
    doc.text(`Voucher No: ${voucher.voucherNo}`, 15, 70);
    doc.text(`Date: ${new Date(voucher.date).toLocaleDateString()}`, 15, 80);
    doc.text(`Delivery Receipt No: ${voucher.deliveryReceiptNo}`, 15, 90);
    doc.text(`Supplier Name: ${voucher.supplierName}`, 15, 100);
    doc.text(`Payment Method: ${voucher.paymentMethod}`, 15, 110);
    doc.text(`Total Amount Due: P${voucher.totalAmountDue.toLocaleString()}`, 15, 120);

    if (voucher.notes) {
      doc.text(`Notes: ${voucher.notes}`, 15, 130);
    }

    doc.line(10, 135, 200, 135);  // Line separator

    // Function to format money with commas and peso sign
    const formatCurrency = (amount: number) => {
      return `P${amount.toLocaleString()}`;
    };

    // Items Table (Black and white)
    const tableData = voucher.itemizedDetails.map(item => [
      item.itemDescription,
      item.quantity.toString(),
      formatCurrency(item.unitPrice),
      formatCurrency(item.totalPrice),
    ]);

    (doc as any).autoTable({
      startY: 145,
      head: [['Item Description', 'Quantity', 'Unit Price (P)', 'Total Price (P)']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10, textColor: 0, lineWidth: 0.1 },  // Ensure black and white, add border
      headStyles: {
        textColor: 0,     // Black text
        fillColor: [255, 255, 255], // White background
        lineWidth: 0.1,   // Thin border line
        halign: 'center', // Center align header text
        valign: 'middle', // Middle vertical alignment
      },
      bodyStyles: { textColor: 0, lineWidth: 0.1 },  // Ensure black body text and border
      margin: { top: 20 },
    });
    

    // Final Amount & Notes (Optional)
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount Due: P${voucher.totalAmountDue.toLocaleString()}`, 15, finalY);

    if (voucher.notes) {
      doc.setFont('helvetica', 'normal');
      doc.text(`Notes: ${voucher.notes}`, 15, finalY + 10);
    }

    doc.line(10, finalY + 20, 200, finalY + 20);  // Line separator

    // Footer (Optional, Page Numbers, black and white)
    doc.setFontSize(8);
    const pageCount = doc.getNumberOfPages();
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber} of ${pageCount}`, 190, doc.internal.pageSize.height - 10, { align: 'right' });

    // Return Blob Output
    return doc.output('blob');
  }


}