import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

// Re-export the interfaces and types
export { PurchaseRequest, PurchaseRequestStatus, Signatory, PurchaseRequestItem } from '../pages/inspection/purchase-request/purchase-request.interface';
import { PurchaseRequest, PurchaseRequestStatus } from '../pages/inspection/purchase-request/purchase-request.interface';

@Injectable({
    providedIn: 'root'
})
export class PurchaseRequestService {
    private purchaseRequests: PurchaseRequest[] = [];

    constructor() {
        this.initializeSampleData();
    }

    private initializeSampleData() {
        this.purchaseRequests.push({
            id: '1',
            prNo: '13-10-246',
            date: new Date('2017-10-06'),
            requisitioningOffice: 'Maintenance Section',
            items: [
                {
                    itemNo: 1,
                    unit: 'pc',
                    description: 'G1-1 - Advance Direction Signs Stack Signs',
                    qty: 6,
                    unitCost: 39620.76,
                    totalCost: 237724.56
                },
                {
                    itemNo: 2,
                    unit: 'pc',
                    description: 'G1-2 - Advance Direction Signs Stack Signs',
                    qty: 2,
                    unitCost: 9553.38,
                    totalCost: 19106.76
                },
                {
                    itemNo: 3,
                    unit: 'pc',
                    description: 'G3-1 - Advance Direction Signs Stack Signs',
                    qty: 6,
                    unitCost: 13501.35,
                    totalCost: 81008.07
                },
                {
                    itemNo: 4,
                    unit: 'pc',
                    description: 'G8-3 - Tourist Information and Destination Signs',
                    qty: 5,
                    unitCost: 23596.04,
                    totalCost: 117980.20
                },
                {
                    itemNo: 5,
                    unit: 'pc',
                    description: 'G8-4 - Tourist Information and Destination Signs',
                    qty: 8,
                    unitCost: 20949.75,
                    totalCost: 167597.98
                },
                {
                    itemNo: 6,
                    unit: 'bag',
                    description: 'Portland Cement',
                    qty: 160,
                    unitCost: 300.00,
                    totalCost: 48000.00
                },
                {
                    itemNo: 7,
                    unit: 'm³',
                    description: 'Sand',
                    qty: 8,
                    unitCost: 1466.00,
                    totalCost: 11728.00
                },
                {
                    itemNo: 8,
                    unit: 'm³',
                    description: 'Gravel',
                    qty: 16,
                    unitCost: 1452.00,
                    totalCost: 23232.00
                },
                {
                    itemNo: 9,
                    unit: 'bd.ft.',
                    description: 'Form Lumber, Good - 4 uses',
                    qty: 864,
                    unitCost: 48.00,
                    totalCost: 41940.13
                },
                {
                    itemNo: 10,
                    unit: 'm',
                    description: '3" Ø G.I. Pipe',
                    qty: 335,
                    unitCost: 636.00,
                    totalCost: 213060.00
                },
                {
                    itemNo: 11,
                    unit: 'kg',
                    description: 'Steel Plate',
                    qty: 216,
                    unitCost: 68.00,
                    totalCost: 14688.00
                },
                {
                    itemNo: 12,
                    unit: 'kg',
                    description: 'Bolts, 5mmØ',
                    qty: 1296,
                    unitCost: 12.00,
                    totalCost: 15552.00
                },
                {
                    itemNo: 13,
                    unit: 'kg',
                    description: 'Assorted CWN(1 kg./100 bd.ft. of Lumber)',
                    qty: 9,
                    unitCost: 51.36,
                    totalCost: 462.25
                },{
                    itemNo: 13,
                    unit: 'kg',
                    description: 'Assorted CWN(1 kg./100 bd.ft. of Lumber)',
                    qty: 9,
                    unitCost: 51.36,
                    totalCost: 462.25
                },{
                    itemNo: 13,
                    unit: 'kg',
                    description: 'Assorted CWN(1 kg./100 bd.ft. of Lumber)',
                    qty: 9,
                    unitCost: 51.36,
                    totalCost: 462.25
                },{
                    itemNo: 13,
                    unit: 'kg',
                    description: 'Assorted CWN(1 kg./100 bd.ft. of Lumber)',
                    qty: 9,
                    unitCost: 51.36,
                    totalCost: 462.25
                },
                {
                    itemNo: 13,
                    unit: 'kg',
                    description: 'Assorted CWN(1 kg./100 bd.ft. of Lumber)',
                    qty: 9,
                    unitCost: 51.36,
                    totalCost: 462.25
                }
            ],
            purpose: 'For use in the Installation of Directional Signs and Tourist Destination Signs at Designated ASEAN Route',
            totalAmount: 956000.00,
            requestedBy: {
                name: 'NICEAS C. CABERTE',
                designation: 'Chief, Maintenance Section'
            },
            recommendedBy: {
                name: 'NICEAS C. CABERTE',
                designation: 'Chief, Maintenance Section'
            },
            approvedBy: {
                name: 'FRANCIS ANTONIO L. FLORES',
                designation: 'District Engineer'
            },
            status: PurchaseRequestStatus.Pending,
            certification: {
                name: 'SERVILLA C. MEJIAS',
                designation: 'Head Procurement'
            }
        });
    }

    async getAll(): Promise<PurchaseRequest[]> {
        return this.purchaseRequests;
    }

    async getById(id: string): Promise<PurchaseRequest | undefined> {
        return this.purchaseRequests.find(pr => pr.id === id);
    }

    async save(purchaseRequest: PurchaseRequest): Promise<void> {
        const index = this.purchaseRequests.findIndex(pr => pr.id === purchaseRequest.id);
        if (index >= 0) {
            this.purchaseRequests[index] = purchaseRequest;
        } else {
            this.purchaseRequests.push(purchaseRequest);
        }
    }

    async updateStatus(id: string, status: PurchaseRequestStatus): Promise<void> {
        const request = await this.getById(id);
        if (request) {
            request.status = status;
            await this.save(request);
        }
    }

    async getByPPMPId(ppmpId: string): Promise<PurchaseRequest[]> {
        return this.purchaseRequests.filter(pr => pr.ppmpId === ppmpId);
    }

    async getByAPPId(appId: string): Promise<PurchaseRequest[]> {
        return this.purchaseRequests.filter(pr => pr.appId === appId);
    }

    generatePurchaseRequestPdf(data: PurchaseRequest): string {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(12);
        doc.text('Republic of the Philippines', 105, 20, { align: 'center' });
        doc.text('DEPARTMENT OF PUBLIC WORKS AND HIGHWAYS', 105, 25, { align: 'center' });
        doc.text('OFFICE OF THE DISTRICT ENGINEER', 105, 30, { align: 'center' });
        doc.text('Bohol 1st District Engineering Office', 105, 35, { align: 'center' });
        doc.text('Tagbilaran City, Bohol', 105, 40, { align: 'center' });

        // Title
        doc.setFontSize(16);
        doc.text('PURCHASE REQUEST', 105, 50, { align: 'center' });

        // PR Details
        doc.setFontSize(10);
        doc.text(`REQUISITIONING OFFICE: ${data.requisitioningOffice}`, 20, 60);
        doc.text(`P.R. No.: ${data.prNo}`, 150, 60);
        doc.text(`Date: ${data.date.toLocaleDateString()}`, 150, 65);

        // Table
        let yPos = 80;
        const headers = ['ITEM NO.', 'UNIT', 'ITEM / DESCRIPTION', 'QTY.', 'ESTIMATED UNIT COST', 'ESTIMATED TOTAL'];
        const colWidths = [20, 25, 60, 20, 35, 35];
        let xPos = 15;
        
        // Draw Headers
        headers.forEach((header, i) => {
            doc.rect(xPos, yPos, colWidths[i], 10);
            doc.text(header, xPos + 2, yPos + 6);
            xPos += colWidths[i];
        });
        
        yPos += 10;

        // Draw Items
        data.items.forEach(item => {
            xPos = 15;
            const rowHeight = 10;

            // Item Number
            doc.rect(xPos, yPos, colWidths[0], rowHeight);
            doc.text(item.itemNo.toString(), xPos + 2, yPos + 6);
            xPos += colWidths[0];
            
            // Unit
            doc.rect(xPos, yPos, colWidths[1], rowHeight);
            doc.text(item.unit, xPos + 2, yPos + 6);
            xPos += colWidths[1];
            
            // Description (handle long text)
            doc.rect(xPos, yPos, colWidths[2], rowHeight);
            doc.text(item.description, xPos + 2, yPos + 6, { maxWidth: colWidths[2] - 4 });
            xPos += colWidths[2];
            
            // Quantity
            doc.rect(xPos, yPos, colWidths[3], rowHeight);
            doc.text(item.qty.toString(), xPos + 2, yPos + 6);
            xPos += colWidths[3];
            
            // Unit Cost
            doc.rect(xPos, yPos, colWidths[4], rowHeight);
            doc.text(item.unitCost.toFixed(2), xPos + 2, yPos + 6);
            xPos += colWidths[4];
            
            // Total Cost
            doc.rect(xPos, yPos, colWidths[5], rowHeight);
            doc.text(item.totalCost.toFixed(2), xPos + 2, yPos + 6);
            
            yPos += rowHeight;
        });

        // Total
        xPos = 15;
        const totalWidth = colWidths.reduce((a, b) => a + b, 0);
        doc.rect(xPos, yPos, totalWidth - colWidths[5], 10);
        doc.text('TOTAL', xPos + totalWidth - colWidths[5] - 20, yPos + 6);
        doc.rect(xPos + totalWidth - colWidths[5], yPos, colWidths[5], 10);
        doc.text(`₱ ${data.totalAmount.toFixed(2)}`, xPos + totalWidth - colWidths[5] + 2, yPos + 6);

        // Certification
        yPos += 20;
        doc.text('CERTIFICATION:', 20, yPos);
        yPos += 10;
        doc.text('This is to certify that the', 25, yPos);
        yPos += 5;
        doc.text('herein requisitioned items are included', 25, yPos);
        yPos += 5;
        doc.text('in the approved APP.', 25, yPos);
        yPos += 15;
        doc.text(data.certification.name, 25, yPos);
        yPos += 5;
        doc.text(data.certification.designation, 25, yPos);

        // Purpose
        yPos += 15;
        doc.text(`Purpose: ${data.purpose}`, 20, yPos);

        // Signatories
        yPos += 20;
        doc.text('RECOMMENDING APPROVAL:', 20, yPos);
        doc.text('APPROVED BY:', 120, yPos);
        yPos += 25;
        doc.text(data.recommendedBy.name, 20, yPos);
        doc.text(data.approvedBy.name, 120, yPos);
        yPos += 5;
        doc.text(data.recommendedBy.designation, 20, yPos);
        doc.text(data.approvedBy.designation, 120, yPos);

        return doc.output('datauristring');
    }

    // Alias method for backward compatibility
    generatePDF = this.generatePurchaseRequestPdf;
}