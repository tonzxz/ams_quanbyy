import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { z } from 'zod';

export const purchaseRequestSchema = z.object({
 id: z.string().length(32, "ID must be exactly 32 characters").optional(),
 prNo: z.string(),
 date: z.date(),
 agency: z.string(),
 department: z.string(),
 office: z.string(),
 items: z.array(z.object({
   qty: z.number().min(1),
   unit: z.string(),
   description: z.string(),
   stockNo: z.string(),
   unitCost: z.number().min(0),
   totalCost: z.number().min(0)
 })),
 requestedBy: z.string(),
 approvedBy: z.string(),
 signature: z.string().optional(),
 status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export type PurchaseRequest = z.infer<typeof purchaseRequestSchema>;

@Injectable({
 providedIn: 'root'
})
export class PurchaseRequestService {
 
  private purchaseRequests: PurchaseRequest[] = [
    {
      id: 'PR-001',
      prNo: 'PR123',
      date: new Date('2023-10-01'),
      agency: 'Agency 1',
      department: 'Department 1',
      office: 'Office 1',
      items: [
        {
          qty: 10,
          unit: 'pcs',
          description: 'Item 1',
          stockNo: 'STK001',
          unitCost: 100,
          totalCost: 1000,
        },
      ],
      requestedBy: 'John Doe',
      approvedBy: 'Jane Doe',
      status: 'approved', // Example status
    },
    {
      id: 'PR-002',
      prNo: 'PR124',
      date: new Date('2023-10-05'),
      agency: 'Agency 2',
      department: 'Department 2',
      office: 'Office 2',
      items: [
        {
          qty: 5,
          unit: 'pcs',
          description: 'Item 2',
          stockNo: 'STK002',
          unitCost: 200,
          totalCost: 1000,
        },
      ],
      requestedBy: 'Alice',
      approvedBy: 'Bob',
      status: 'pending', // Example status
    },
    {
      id: 'PR-003',
      prNo: 'PR125',
      date: new Date('2023-10-10'),
      agency: 'Agency 3',
      department: 'Department 3',
      office: 'Office 3',
      items: [
        {
          qty: 20,
          unit: 'pcs',
          description: 'Item 3',
          stockNo: 'STK003',
          unitCost: 50,
          totalCost: 1000,
        },
      ],
      requestedBy: 'Charlie',
      approvedBy: 'Eve',
      status: 'approved', // Example status
    },
  ];

  constructor() {}

  // Add the getAll method
  async getAll(): Promise<PurchaseRequest[]> {
    return this.purchaseRequests; // Return the mock data
  }

 generatePurchaseRequestPdf(data: PurchaseRequest): string {
   const doc = new jsPDF();
   
   // Header
   doc.text('Purchase Request', 105, 20, { align: 'center' });
   doc.setFontSize(10);
   
   // PR Details
   doc.text(`PR No.: ${data.prNo}`, 20, 40);
   doc.text(`Date: ${data.date.toLocaleDateString()}`, 150, 40);
   doc.text(`Agency: ${data.agency}`, 20, 50);
   doc.text(`Department: ${data.department}`, 20, 60);
   doc.text(`Office: ${data.office}`, 20, 70);
   
   // Table Header
   let yPos = 90;
   const headers = ['Qty', 'Unit', 'Item Description', 'Stock No', 'Unit Cost', 'Total Cost'];
   const colWidths = [20, 30, 50, 30, 30, 30];
   
   headers.forEach((header, i) => {
     doc.rect(20 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), yPos, colWidths[i], 10);
     doc.text(header, 25 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), yPos + 7);
   });
   
   yPos += 10;
   
   // Items
   data.items.forEach(item => {
     doc.rect(20, yPos, colWidths[0], 10);
     doc.text(item.qty.toString(), 25, yPos + 7);
     
     doc.rect(40, yPos, colWidths[1], 10);
     doc.text(item.unit, 45, yPos + 7);
     
     doc.rect(70, yPos, colWidths[2], 10);
     doc.text(item.description, 75, yPos + 7);
     
     doc.rect(120, yPos, colWidths[3], 10);
     doc.text(item.stockNo, 125, yPos + 7);
     
     doc.rect(150, yPos, colWidths[4], 10);
     doc.text(item.unitCost.toFixed(2), 155, yPos + 7);
     
     doc.rect(180, yPos, colWidths[5], 10);
     doc.text(item.totalCost.toFixed(2), 185, yPos + 7);
     
     yPos += 10;
   });
   
   // Signatories
   yPos += 20;
   doc.text('Requested by:', 40, yPos);
   doc.text('Approved by:', 140, yPos);
   
   yPos += 20;
   doc.text(data.requestedBy, 40, yPos);
   doc.text(data.approvedBy, 140, yPos);

   return doc.output('datauristring');
 }
}