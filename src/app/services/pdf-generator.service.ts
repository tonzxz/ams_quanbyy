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
    this.addHeaderImage(doc);
    doc.setFillColor(63, 81, 181);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255);
    doc.setFontSize(24);
    doc.text('INSPECTION AND ACCEPTANCE REPORT', 105, 25, { align: 'center' });

    // Content
    doc.setTextColor(0);
    doc.setFontSize(12);

    // Company Info Box
    doc.setFillColor(240, 240, 240);
    doc.rect(10, 50, 190, 50, 'F');

    doc.setFontSize(10);
    const leftColumn = [
      { label: 'Report No:', value: `${item.id}` },
      { label: 'Inspection Date:', value: new Date().toLocaleDateString() },
      { label: 'PO Number:', value: item.poNumber || 'N/A' },
      { label: 'Total Amount:', value: item.totalAmount ? `P${item.totalAmount.toLocaleString()}` : 'N/A' }
    ];

    const rightColumn = [
      { label: 'Supplier:', value: item.supplierName },
      { label: 'Department:', value: item.department },
      { label: 'Delivery Date:', value: new Date(item.dateDelivered).toLocaleDateString() }
    ];

    let yPos = 60;
    leftColumn.forEach(row => {
      this.setFontBold(doc);
      doc.text(row.label, 15, yPos);
      this.setFontNormal(doc);
      doc.text(row.value, 50, yPos);
      yPos += 10;
    });

    yPos = 60;
    rightColumn.forEach(row => {
      this.setFontBold(doc);
      doc.text(row.label, 110, yPos);
      this.setFontNormal(doc);
      doc.text(row.value, 145, yPos);
      yPos += 10;
    });

    // Inspection Results Table
    const tableData = item.items.map(i => [
      i.id,
      i.name,
      i.quantity.toString(),
      i.isDelivered ? 'Pass' : 'Pending',
      i.isDelivered ? 'Item meets specifications' : 'Inspection pending',
      i.dateChecked ? new Date(i.dateChecked).toLocaleDateString() : 'N/A'
    ]);

    (doc as any).autoTable({
      startY: 110,
      head: [['Item ID', 'Description', 'Qty', 'Status', 'Remarks', 'Date Inspected']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [63, 81, 181],
        fontSize: 10,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 50 },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 45 },
        5: { cellWidth: 30, halign: 'center' }
      }
    });

    // Quality Assurance Section
    const finalY = (doc as any).lastAutoTable.finalY + 20;

    doc.setFontSize(12);
    this.setFontBold(doc);
    doc.text('Quality Assurance Certification', 15, finalY);

    doc.setFontSize(10);
    this.setFontNormal(doc);
    doc.text('This is to certify that the above items have been inspected and verified according to', 15, finalY + 10);
    doc.text('specified quality standards and requirements.', 15, finalY + 17);
    // Signature Section - Continued from previous code
    const signatureY = finalY + 35;

    // Inspector
    doc.setFontSize(10);
    doc.text('Inspected by:', 15, signatureY);
    doc.line(15, signatureY + 20, 85, signatureY + 20);
    doc.setFontSize(8);
    doc.text('Quality Inspector', 15, signatureY + 25);
    doc.text('Date: _________________', 15, signatureY + 32);

    // Supervisor
    doc.setFontSize(10);
    doc.text('Verified by:', 105, signatureY);
    doc.line(105, signatureY + 20, 175, signatureY + 20);
    doc.setFontSize(8);
    doc.text('QA Supervisor', 105, signatureY + 25);
    doc.text('Date: _________________', 105, signatureY + 32);

    // Add footer to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      this.addFooter(doc, i);
    }

    return doc.output('blob');
  }



  private addHeaderImage(doc: jsPDF) {
    doc.setFillColor(63, 81, 181);
    doc.circle(20, 15, 8, 'F');
    doc.setTextColor(255);
    doc.setFontSize(12);
    doc.text('AMS', 20, 17, { align: 'center' });
  }

  private addFooter(doc: jsPDF, pageNumber: number) {
    const totalPages = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Page ${pageNumber} of ${totalPages}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
  }

  private setFontBold(doc: jsPDF) {
    doc.setFont('helvetica', 'bold');
  }

  private setFontNormal(doc: jsPDF) {
    doc.setFont('helvetica', 'normal');
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