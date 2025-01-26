// private loadDummyData(): void {
//   const dummy: Requisition[] = [
//     {
//       id: this.generate32CharId(),
//       title: 'Office Supplies Request',
//       description: 'Request for stationery items.',
//       status: 'Pending',
//       classifiedItemId: 'dummyClassifiedItemId1',
//       group: '12345678901234567890123456789012',
//       products: [
//         { id: '12345678901234567890123456789012', name: 'Pen', quantity: 10, price: 10, specifications: 'Blue ink' },
//         { id: '23456789012345678901234567890123', name: 'Notebook', quantity: 5, price: 50, specifications: 'A5 size' },
//       ],
//       selectedGroups: ['Group1', 'Group2'],
//       productQuantities: { '12345678901234567890123456789012': 10, '23456789012345678901234567890123': 5 },
//       productSpecifications: { '12345678901234567890123456789012': 'Blue ink', '23456789012345678901234567890123': 'A5 size' },
//       ppmpAttachment: 'ppmp-attachment-url-1',
//       purchaseRequestAttachment: 'purchase-request-attachment-url-1',
//       dateCreated: new Date('2023-10-01T08:00:00Z'),
//       lastModified: new Date('2023-10-01T08:00:00Z'),
//       signature: 'signature-url-1',
//       createdByUserId: 'enduser',
//       createdByUserName: 'Diana Green',
//       approvalSequenceId: 'level-1-budget-review',
//       currentApprovalLevel: 1,
//       approvalStatus: 'Pending',
//       approvalHistory: [], // No approvals yet
//     },
//     // Level 2: Technical Specification Review (Procurement Flow)
//     {
//       id: this.generate32CharId(),
//       title: 'Electronics Request',
//       description: 'Request for new laptops.',
//       status: 'Pending',
//       classifiedItemId: 'dummyClassifiedItemId2',
//       group: '23456789012345678901234567890123',
//       products: [
//         { id: '34567890123456789012345678901234', name: 'Laptop', quantity: 2, price: 50000, specifications: '16GB RAM, 512GB SSD' },
//       ],
//       selectedGroups: ['Group3'],
//       productQuantities: { '34567890123456789012345678901234': 2 },
//       productSpecifications: { '34567890123456789012345678901234': '16GB RAM, 512GB SSD' },
//       ppmpAttachment: 'ppmp-attachment-url-2',
//       purchaseRequestAttachment: 'purchase-request-attachment-url-2',
//       dateCreated: new Date('2023-10-02T09:00:00Z'),
//       lastModified: new Date('2023-10-02T09:00:00Z'),
//       signature: 'signature-url-2',
//       createdByUserId: 'enduser',
//       createdByUserName: 'Diana Green',
//       approvalSequenceId: 'level-2-inspection-review',
//       currentApprovalLevel: 2,
//       approvalStatus: 'Pending',
//       approvalHistory: [
//         { level: 1, status: 'Approved', timestamp: new Date('2023-10-01T10:00:00Z'), comments: 'Budget approved.' },
//       ],
//     },
//     // Level 3: College President Approval (Procurement Flow)
//     {
//       id: this.generate32CharId(),
//       title: 'Furniture Request',
//       description: 'Request for office chairs and desks.',
//       status: 'Pending',
//       classifiedItemId: 'dummyClassifiedItemId3',
//       group: '34567890123456789012345678901234',
//       products: [
//         { id: '45678901234567890123456789012345', name: 'Office Chair', quantity: 5, price: 2000, specifications: 'Ergonomic design' },
//         { id: '56789012345678901234567890123456', name: 'Desk', quantity: 3, price: 5000, specifications: 'Adjustable height' },
//       ],
//       selectedGroups: ['Group4'],
//       productQuantities: { '45678901234567890123456789012345': 5, '56789012345678901234567890123456': 3 },
//       productSpecifications: { '45678901234567890123456789012345': 'Ergonomic design', '56789012345678901234567890123456': 'Adjustable height' },
//       ppmpAttachment: 'ppmp-attachment-url-3',
//       purchaseRequestAttachment: 'purchase-request-attachment-url-3',
//       dateCreated: new Date('2023-10-03T10:00:00Z'),
//       lastModified: new Date('2023-10-03T10:00:00Z'),
//       signature: 'signature-url-3',
//       createdByUserId: 'enduser',
//       createdByUserName: 'Diana Green',
//       approvalSequenceId: 'level-3-president-approval',
//       currentApprovalLevel: 3,
//       approvalStatus: 'Pending',
//       approvalHistory: [
//         { level: 1, status: 'Approved', timestamp: new Date('2023-10-02T09:00:00Z'), comments: 'Budget approved.' },
//         { level: 2, status: 'Approved', timestamp: new Date('2023-10-03T14:30:00Z'), comments: 'Technical specifications verified.' },
//       ],
//     },
//     // Level 4: BAC Final Review (Procurement Flow)
//     {
//       id: this.generate32CharId(),
//       title: 'Software License Request',
//       description: 'Request for software licenses for the IT department.',
//       status: 'Pending',
//       classifiedItemId: 'dummyClassifiedItemId4',
//       group: '45678901234567890123456789012345',
//       products: [
//         { id: '67890123456789012345678901234567', name: 'Software License', quantity: 10, price: 1000, specifications: 'Annual subscription' },
//       ],
//       selectedGroups: ['Group5'],
//       productQuantities: { '67890123456789012345678901234567': 10 },
//       productSpecifications: { '67890123456789012345678901234567': 'Annual subscription' },
//       ppmpAttachment: 'ppmp-attachment-url-4',
//       purchaseRequestAttachment: 'purchase-request-attachment-url-4',
//       dateCreated: new Date('2023-10-04T11:00:00Z'),
//       lastModified: new Date('2023-10-04T11:00:00Z'),
//       signature: 'signature-url-4',
//       createdByUserId: 'enduser',
//       createdByUserName: 'Diana Green',
//       approvalSequenceId: 'level-4-bac-review',
//       currentApprovalLevel: 4,
//       approvalStatus: 'Pending',
//       approvalHistory: [
//         { level: 1, status: 'Approved', timestamp: new Date('2023-10-04T11:00:00Z'), comments: 'Budget approved.' },
//         { level: 2, status: 'Approved', timestamp: new Date('2023-10-05T15:00:00Z'), comments: 'Technical specifications verified.' },
//         { level: 3, status: 'Approved', timestamp: new Date('2023-10-06T10:00:00Z'), comments: 'Approved by College President.' },
//       ],
//     },
//     // Level 5: Delivery Inspection (Supply Management Flow)
//     {
//       id: this.generate32CharId(),
//       title: 'Projector Request',
//       description: 'Request for projectors for the conference room.',
//       status: 'Pending',
//       classifiedItemId: 'dummyClassifiedItemId5',
//       group: '56789012345678901234567890123456',
//       products: [
//         { id: '78901234567890123456789012345678', name: 'Projector', quantity: 3, price: 15000, specifications: 'HD resolution' },
//       ],
//       selectedGroups: ['Group6'],
//       productQuantities: { '78901234567890123456789012345678': 3 },
//       productSpecifications: { '78901234567890123456789012345678': 'HD resolution' },
//       ppmpAttachment: 'ppmp-attachment-url-5',
//       purchaseRequestAttachment: 'purchase-request-attachment-url-5',
//       dateCreated: new Date('2023-10-07T12:00:00Z'),
//       lastModified: new Date('2023-10-07T12:00:00Z'),
//       signature: 'signature-url-5',
//       createdByUserId: 'enduser',
//       createdByUserName: 'Diana Green',
//       approvalSequenceId: 'level-5-delivery-inspection',
//       currentApprovalLevel: 5,
//       approvalStatus: 'Pending',
//       approvalHistory: [
//         { level: 1, status: 'Approved', timestamp: new Date('2023-10-07T12:00:00Z'), comments: 'Budget approved.' },
//         { level: 2, status: 'Approved', timestamp: new Date('2023-10-08T16:00:00Z'), comments: 'Technical specifications verified.' },
//         { level: 3, status: 'Approved', timestamp: new Date('2023-10-09T10:00:00Z'), comments: 'Approved by College President.' },
//         { level: 4, status: 'Approved', timestamp: new Date('2023-10-10T09:00:00Z'), comments: 'Final review by BAC.' },
//       ],
//     },
//     // Level 6: RIS Review (Supply Management Flow)
//     {
//       id: this.generate32CharId(),
//       title: 'Printer Request',
//       description: 'Request for printers for the office.',
//       status: 'Pending',
//       classifiedItemId: 'dummyClassifiedItemId6',
//       group: '67890123456789012345678901234567',
//       products: [
//         { id: '89012345678901234567890123456789', name: 'Printer', quantity: 5, price: 8000, specifications: 'Laser printer' },
//       ],
//       selectedGroups: ['Group7'],
//       productQuantities: { '89012345678901234567890123456789': 5 },
//       productSpecifications: { '89012345678901234567890123456789': 'Laser printer' },
//       ppmpAttachment: 'ppmp-attachment-url-6',
//       purchaseRequestAttachment: 'purchase-request-attachment-url-6',
//       dateCreated: new Date('2023-10-11T12:00:00Z'),
//       lastModified: new Date('2023-10-11T12:00:00Z'),
//       signature: 'signature-url-6',
//       createdByUserId: 'enduser',
//       createdByUserName: 'Diana Green',
//       approvalSequenceId: 'level-6-ris-review',
//       currentApprovalLevel: 6,
//       approvalStatus: 'Pending',
//       approvalHistory: [
//         { level: 1, status: 'Approved', timestamp: new Date('2023-10-11T12:00:00Z'), comments: 'Budget approved.' },
//         { level: 2, status: 'Approved', timestamp: new Date('2023-10-12T16:00:00Z'), comments: 'Technical specifications verified.' },
//         { level: 3, status: 'Approved', timestamp: new Date('2023-10-13T10:00:00Z'), comments: 'Approved by College President.' },
//         { level: 4, status: 'Approved', timestamp: new Date('2023-10-14T09:00:00Z'), comments: 'Final review by BAC.' },
//         { level: 5, status: 'Approved', timestamp: new Date('2023-10-15T14:00:00Z'), comments: 'Delivery inspected.' },
//       ],
//     },
//     // Level 7: End User Receipt (Supply Management Flow)
//     {
//       id: this.generate32CharId(),
//       title: 'Scanner Request',
//       description: 'Request for scanners for the office.',
//       status: 'Pending',
//       classifiedItemId: 'dummyClassifiedItemId7',
//       group: '78901234567890123456789012345678',
//       products: [
//         { id: '90123456789012345678901234567890', name: 'Scanner', quantity: 2, price: 12000, specifications: 'High-speed scanning' },
//       ],
//       selectedGroups: ['Group8'],
//       productQuantities: { '90123456789012345678901234567890': 2 },
//       productSpecifications: { '90123456789012345678901234567890': 'High-speed scanning' },
//       ppmpAttachment: 'ppmp-attachment-url-7',
//       purchaseRequestAttachment: 'purchase-request-attachment-url-7',
//       dateCreated: new Date('2023-10-16T12:00:00Z'),
//       lastModified: new Date('2023-10-16T12:00:00Z'),
//       signature: 'signature-url-7',
//       createdByUserId: 'enduser',
//       createdByUserName: 'Diana Green',
//       approvalSequenceId: 'level-7-receipt-acknowledgement',
//       currentApprovalLevel: 7,
//       approvalStatus: 'Pending',
//       approvalHistory: [
//         { level: 1, status: 'Approved', timestamp: new Date('2023-10-16T12:00:00Z'), comments: 'Budget approved.' },
//         { level: 2, status: 'Approved', timestamp: new Date('2023-10-17T16:00:00Z'), comments: 'Technical specifications verified.' },
//         { level: 3, status: 'Approved', timestamp: new Date('2023-10-18T10:00:00Z'), comments: 'Approved by College President.' },
//         { level: 4, status: 'Approved', timestamp: new Date('2023-10-19T09:00:00Z'), comments: 'Final review by BAC.' },
//         { level: 5, status: 'Approved', timestamp: new Date('2023-10-20T14:00:00Z'), comments: 'Delivery inspected.' },
//         { level: 6, status: 'Approved', timestamp: new Date('2023-10-21T11:00:00Z'), comments: 'RIS reviewed.' },
//       ],
//     },
//     // Level 8: Final Document Verification (Supply Management Flow)
//     {
//       id: this.generate32CharId(),
//       title: 'Server Request',
//       description: 'Request for servers for the IT department.',
//       status: 'Pending',
//       classifiedItemId: 'dummyClassifiedItemId8',
//       group: '89012345678901234567890123456789',
//       products: [
//         { id: '01234567890123456789012345678901', name: 'Server', quantity: 1, price: 100000, specifications: 'High-performance server' },
//       ],
//       selectedGroups: ['Group9'],
//       productQuantities: { '01234567890123456789012345678901': 1 },
//       productSpecifications: { '01234567890123456789012345678901': 'High-performance server' },
//       ppmpAttachment: 'ppmp-attachment-url-8',
//       purchaseRequestAttachment: 'purchase-request-attachment-url-8',
//       dateCreated: new Date('2023-10-22T12:00:00Z'),
//       lastModified: new Date('2023-10-22T12:00:00Z'),
//       signature: 'signature-url-8',
//       createdByUserId: 'enduser',
//       createdByUserName: 'Diana Green',
//       approvalSequenceId: 'level-8-document-verification',
//       currentApprovalLevel: 8,
//       approvalStatus: 'Pending',
//       approvalHistory: [
//         { level: 1, status: 'Approved', timestamp: new Date('2023-10-22T12:00:00Z'), comments: 'Budget approved.' },
//         { level: 2, status: 'Approved', timestamp: new Date('2023-10-23T16:00:00Z'), comments: 'Technical specifications verified.' },
//         { level: 3, status: 'Approved', timestamp: new Date('2023-10-24T10:00:00Z'), comments: 'Approved by College President.' },
//         { level: 4, status: 'Approved', timestamp: new Date('2023-10-25T09:00:00Z'), comments: 'Final review by BAC.' },
//         { level: 5, status: 'Approved', timestamp: new Date('2023-10-26T14:00:00Z'), comments: 'Delivery inspected.' },
//         { level: 6, status: 'Approved', timestamp: new Date('2023-10-27T11:00:00Z'), comments: 'RIS reviewed.' },
//         { level: 7, status: 'Approved', timestamp: new Date('2023-10-28T13:00:00Z'), comments: 'Received by end user.' },
//       ],
//     },
//     // Level 9: Property Inspection (Supply Management Flow)
//     {
//       id: this.generate32CharId(),
//       title: 'Network Equipment Request',
//       description: 'Request for network equipment for the IT department.',
//       status: 'Pending',
//       classifiedItemId: 'dummyClassifiedItemId9',
//       group: '90123456789012345678901234567890',
//       products: [
//         { id: '12345678901234567890123456789012', name: 'Router', quantity: 5, price: 5000, specifications: 'High-speed router' },
//         { id: '23456789012345678901234567890123', name: 'Switch', quantity: 3, price: 3000, specifications: '24-port switch' },
//       ],
//       selectedGroups: ['Group10'],
//       productQuantities: { '12345678901234567890123456789012': 5, '23456789012345678901234567890123': 3 },
//       productSpecifications: { '12345678901234567890123456789012': 'High-speed router', '23456789012345678901234567890123': '24-port switch' },
//       ppmpAttachment: 'ppmp-attachment-url-9',
//       purchaseRequestAttachment: 'purchase-request-attachment-url-9',
//       dateCreated: new Date('2023-10-29T12:00:00Z'),
//       lastModified: new Date('2023-10-29T12:00:00Z'),
//       signature: 'signature-url-9',
//       createdByUserId: 'enduser',
//       createdByUserName: 'Diana Green',
//       approvalSequenceId: 'level-9-property-inspection',
//       currentApprovalLevel: 9,
//       approvalStatus: 'Pending',
//       approvalHistory: [
//         { level: 1, status: 'Approved', timestamp: new Date('2023-10-29T12:00:00Z'), comments: 'Budget approved.' },
//         { level: 2, status: 'Approved', timestamp: new Date('2023-10-30T16:00:00Z'), comments: 'Technical specifications verified.' },
//         { level: 3, status: 'Approved', timestamp: new Date('2023-10-31T10:00:00Z'), comments: 'Approved by College President.' },
//         { level: 4, status: 'Approved', timestamp: new Date('2023-11-01T09:00:00Z'), comments: 'Final review by BAC.' },
//         { level: 5, status: 'Approved', timestamp: new Date('2023-11-02T14:00:00Z'), comments: 'Delivery inspected.' },
//         { level: 6, status: 'Approved', timestamp: new Date('2023-11-03T11:00:00Z'), comments: 'RIS reviewed.' },
//         { level: 7, status: 'Approved', timestamp: new Date('2023-11-04T13:00:00Z'), comments: 'Received by end user.' },
//         { level: 8, status: 'Approved', timestamp: new Date('2023-11-05T15:00:00Z'), comments: 'Documents verified.' },
//       ],
//     },
//     // Level 10: Disposal Review (Supply Management Flow)
//     {
//       id: this.generate32CharId(),
//       title: 'Old Equipment Disposal Request',
//       description: 'Request for disposal of old equipment.',
//       status: 'Pending',
//       classifiedItemId: 'dummyClassifiedItemId10',
//       group: '01234567890123456789012345678901',
//       products: [
//         { id: '34567890123456789012345678901234', name: 'Old Server', quantity: 2, price: 0, specifications: 'For disposal' },
//       ],
//       selectedGroups: ['Group11'],
//       productQuantities: { '34567890123456789012345678901234': 2 },
//       productSpecifications: { '34567890123456789012345678901234': 'For disposal' },
//       ppmpAttachment: 'ppmp-attachment-url-10',
//       purchaseRequestAttachment: 'purchase-request-attachment-url-10',
//       dateCreated: new Date('2023-11-06T12:00:00Z'),
//       lastModified: new Date('2023-11-06T12:00:00Z'),
//       signature: 'signature-url-10',
//       createdByUserId: 'enduser',
//       createdByUserName: 'Diana Green',
//       approvalSequenceId: 'level-10-disposal-review',
//       currentApprovalLevel: 10,
//       approvalStatus: 'Pending',
//       approvalHistory: [
//         { level: 1, status: 'Approved', timestamp: new Date('2023-11-06T12:00:00Z'), comments: 'Budget approved.' },
//         { level: 2, status: 'Approved', timestamp: new Date('2023-11-07T16:00:00Z'), comments: 'Technical specifications verified.' },
//         { level: 3, status: 'Approved', timestamp: new Date('2023-11-08T10:00:00Z'), comments: 'Approved by College President.' },
//         { level: 4, status: 'Approved', timestamp: new Date('2023-11-09T09:00:00Z'), comments: 'Final review by BAC.' },
//         { level: 5, status: 'Approved', timestamp: new Date('2023-11-10T14:00:00Z'), comments: 'Delivery inspected.' },
//         { level: 6, status: 'Approved', timestamp: new Date('2023-11-11T11:00:00Z'), comments: 'RIS reviewed.' },
//         { level: 7, status: 'Approved', timestamp: new Date('2023-11-12T13:00:00Z'), comments: 'Received by end user.' },
//         { level: 8, status: 'Approved', timestamp: new Date('2023-11-13T15:00:00Z'), comments: 'Documents verified.' },
//         { level: 9, status: 'Approved', timestamp: new Date('2023-11-14T17:00:00Z'), comments: 'Property inspected.' },
//       ],
//     },
//   ]

//   this.requisitions = dummy;
//   this.saveToLocalStorage();
// }


import { Injectable } from '@angular/core';
import { z } from 'zod';
import { GroupService } from './group.service';
import { UserService } from './user.service';
import { ApprovalSequence, ApprovalSequenceService } from './approval-sequence.service';
import { firstValueFrom } from 'rxjs';

/**
 * Zod schema for an Extended Requisition.
 */
export const requisitionSchema = z.object({
  id: z.string().length(6, "ID must be exactly 6 characters").optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().max(500).optional(),
  status: z.string(),
  classifiedItemId: z.string().length(32, "Classified Item ID is required"),
  group: z.string().min(1, "Group is required"),
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      specifications: z.string().optional(),
      price: z.number().min(0, "Price cannot be negative"),
    })
  ),
  selectedGroups: z.array(z.string()).optional(),
  productQuantities: z.record(z.string(), z.number()).optional(),
  productSpecifications: z.record(z.string(), z.string()).optional(),
  ppmpAttachment: z.string().optional(),
  purchaseRequestAttachment: z.string().optional(),
  rfqAttachement: z.string().optional(), 
  rfqFromSuppliersAttachment: z.array(z.string()).optional(), 
  abstractOfQuotationAttachment: z.string().optional(), 
  budgetUtilizationReportAttachment: z.string().optional(), 
  noticeOfAwardAttachment: z.string().optional(), 
  purchaseOrderAttachment: z.string().optional(), 
  noticeToProceedAttachment: z.string().optional(), 
  dateCreated: z.coerce.date().optional(), 
 lastModified: z.coerce.date().optional(), 
  signature: z.string().optional(),
  createdByUserId: z.string().optional(),
  createdByUserName: z.string().optional(),
  approvalSequenceId: z.string().min(1, "Approval Sequence ID is required").optional(),
  currentApprovalLevel: z.number().min(1).default(1), // Default to level 1
  approvalStatus: z.enum(['Pending', 'Approved', 'Rejected']).default('Pending'),
  approvalHistory: z.array(
    z.object({
      level: z.number().min(1),
      status: z.enum(['Approved', 'Rejected']),
      timestamp: z.date().default(() => new Date()),
      comments: z.string().optional(),
    })
  ).optional(),
});

// TypeScript type for usage in your code
export type Requisition = z.infer<typeof requisitionSchema>;

@Injectable({
  providedIn: 'root',
})
export class RequisitionService {
  private readonly STORAGE_KEY = 'requisitions';
  private requisitions: Requisition[] = [];

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private approvalSequenceService: ApprovalSequenceService
  ) {
    this.loadFromLocalStorage();
    if (!this.requisitions || this.requisitions.length === 0) {
      this.loadDummyData();
    }
  }

  // Load from localStorage
  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.requisitions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load requisitions from localStorage:', error);
    }
  }

  // Save to localStorage
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.requisitions));
    } catch (error) {
      console.error('Failed to save requisitions to localStorage:', error);
    }
  }

  // Generate a random 32-character hex ID
  private generate32CharId(): string {
    return Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }


  private generate6DigitId(): string {
  return Array.from({ length: 6 }, () => 
    Math.floor(Math.random() * 10).toString()
  ).join('');
  }
  

  // Load some dummy data (optional)
private loadDummyData(): void {
  const dummy: Requisition[] = [
    // Level 1: Budget Unit Review (Procurement Flow)
    {
      id: '1111',
      title: 'Office Supplies Request',
      description: 'Request for stationery items.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId1',
      group: '12345678901234567890123456789012',
      products: [
        { id: '12345678901234567890123456789012', name: 'Pen', quantity: 10, price: 10, specifications: 'Blue ink' },
        { id: '23456789012345678901234567890123', name: 'Notebook', quantity: 5, price: 50, specifications: 'A5 size' },
      ],
      selectedGroups: ['Group1', 'Group2'],
      productQuantities: { '12345678901234567890123456789012': 10, '23456789012345678901234567890123': 5 },
      productSpecifications: { '12345678901234567890123456789012': 'Blue ink', '23456789012345678901234567890123': 'A5 size' },
      ppmpAttachment: 'ppmp-attachment-url-1',
      purchaseRequestAttachment: 'purchase-request-attachment-url-1',
      dateCreated: new Date('2023-10-01T08:00:00Z'),
      lastModified: new Date('2023-10-01T08:00:00Z'),
      signature: 'signature-url-1',
      createdByUserId: 'enduser',
      createdByUserName: 'Diana Green',
      approvalSequenceId: '111',
      currentApprovalLevel: 1,
      approvalStatus: 'Pending',
      approvalHistory: [], // No approvals yet
    },
    // Level 2: Technical Specification Review (Procurement Flow)
    {
      id: '2222',
      title: 'Electronics Request',
      description: 'Request for new laptops.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId2',
      group: '23456789012345678901234567890123',
      products: [
        { id: '34567890123456789012345678901234', name: 'Laptop', quantity: 2, price: 50000, specifications: '16GB RAM, 512GB SSD' },
      ],
      selectedGroups: ['Group3'],
      productQuantities: { '34567890123456789012345678901234': 2 },
      productSpecifications: { '34567890123456789012345678901234': '16GB RAM, 512GB SSD' },
      ppmpAttachment: 'ppmp-attachment-url-2',
      purchaseRequestAttachment: 'purchase-request-attachment-url-2',
      dateCreated: new Date('2023-10-02T09:00:00Z'),
      lastModified: new Date('2023-10-02T09:00:00Z'),
      signature: 'signature-url-2',
      createdByUserId: 'enduser',
      createdByUserName: 'Diana Green',
      approvalSequenceId: '222',
      currentApprovalLevel: 2,
      approvalStatus: 'Pending',
      approvalHistory: [
        { level: 1, status: 'Approved', timestamp: new Date('2023-10-01T10:00:00Z'), comments: 'Budget approved.' },
      ],
    },
    // Level 3: College President Approval (Procurement Flow)
    {
      id: '3333',
      title: 'Furniture Request',
      description: 'Request for office chairs and desks.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId3',
      group: '34567890123456789012345678901234',
      products: [
        { id: '45678901234567890123456789012345', name: 'Office Chair', quantity: 5, price: 2000, specifications: 'Ergonomic design' },
        { id: '56789012345678901234567890123456', name: 'Desk', quantity: 3, price: 5000, specifications: 'Adjustable height' },
      ],
      selectedGroups: ['Group4'],
      productQuantities: { '45678901234567890123456789012345': 5, '56789012345678901234567890123456': 3 },
      productSpecifications: { '45678901234567890123456789012345': 'Ergonomic design', '56789012345678901234567890123456': 'Adjustable height' },
      ppmpAttachment: 'ppmp-attachment-url-3',
      purchaseRequestAttachment: 'purchase-request-attachment-url-3',
      dateCreated: new Date('2023-10-03T10:00:00Z'),
      lastModified: new Date('2023-10-03T10:00:00Z'),
      signature: 'signature-url-3',
      createdByUserId: 'enduser',
      createdByUserName: 'Diana Green',
      approvalSequenceId: '333',
      currentApprovalLevel: 3,
      approvalStatus: 'Pending',
      approvalHistory: [
        { level: 1, status: 'Approved', timestamp: new Date('2023-10-02T09:00:00Z'), comments: 'Budget approved.' },
        { level: 2, status: 'Approved', timestamp: new Date('2023-10-03T14:30:00Z'), comments: 'Technical specifications verified.' },
      ],
    },
    // Level 4: BAC Final Review (Procurement Flow)
    {
      id: '4444',
      title: 'Software License Request',
      description: 'Request for software licenses for the IT department.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId4',
      group: '45678901234567890123456789012345',
      products: [
        { id: '67890123456789012345678901234567', name: 'Software License', quantity: 10, price: 1000, specifications: 'Annual subscription' },
      ],
      selectedGroups: ['Group5'],
      productQuantities: { '67890123456789012345678901234567': 10 },
      productSpecifications: { '67890123456789012345678901234567': 'Annual subscription' },
      ppmpAttachment: 'ppmp-attachment-url-4',
      purchaseRequestAttachment: 'purchase-request-attachment-url-4',
      dateCreated: new Date('2023-10-04T11:00:00Z'),
      lastModified: new Date('2023-10-04T11:00:00Z'),
      signature: 'signature-url-4',
      createdByUserId: 'enduser',
      createdByUserName: 'Diana Green',
      approvalSequenceId: '444',
      currentApprovalLevel: 4,
      approvalStatus: 'Pending',
      approvalHistory: [
        { level: 1, status: 'Approved', timestamp: new Date('2023-10-04T11:00:00Z'), comments: 'Budget approved.' },
        { level: 2, status: 'Approved', timestamp: new Date('2023-10-05T15:00:00Z'), comments: 'Technical specifications verified.' },
        { level: 3, status: 'Approved', timestamp: new Date('2023-10-06T10:00:00Z'), comments: 'Approved by College President.' },
      ],
    },
    // Level 5: Delivery Inspection (Supply Management Flow)
    {
      id: '5555',
      title: 'Projector Request',
      description: 'Request for projectors for the conference room.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId5',
      group: '56789012345678901234567890123456',
      products: [
        { id: '78901234567890123456789012345678', name: 'Projector', quantity: 3, price: 15000, specifications: 'HD resolution' },
      ],
      selectedGroups: ['Group6'],
      productQuantities: { '78901234567890123456789012345678': 3 },
      productSpecifications: { '78901234567890123456789012345678': 'HD resolution' },
      ppmpAttachment: 'ppmp-attachment-url-5',
      purchaseRequestAttachment: 'purchase-request-attachment-url-5',
      dateCreated: new Date('2023-10-07T12:00:00Z'),
      lastModified: new Date('2023-10-07T12:00:00Z'),
      signature: 'signature-url-5',
      createdByUserId: 'enduser',
      createdByUserName: 'Diana Green',
      approvalSequenceId: '555',
      currentApprovalLevel: 5,
      approvalStatus: 'Pending',
      approvalHistory: [
        { level: 1, status: 'Approved', timestamp: new Date('2023-10-07T12:00:00Z'), comments: 'Budget approved.' },
        { level: 2, status: 'Approved', timestamp: new Date('2023-10-08T16:00:00Z'), comments: 'Technical specifications verified.' },
        { level: 3, status: 'Approved', timestamp: new Date('2023-10-09T10:00:00Z'), comments: 'Approved by College President.' },
        { level: 4, status: 'Approved', timestamp: new Date('2023-10-10T09:00:00Z'), comments: 'Final review by BAC.' },
      ],
    },
  ];

  this.requisitions = dummy;
  this.saveToLocalStorage();
}

  // ================================
  // CRUD Methods
  // ================================

  /**
   * Fetch all requisitions.
   */
  getAllRequisitions(): Promise<Requisition[]> {
    return Promise.resolve(this.requisitions);
  }

  /**
   * Fetch all pending requisitions.
   */
  async getPendingRequisitions(): Promise<Requisition[]> {
    return this.requisitions.filter((req) => req.status === 'Pending');
  }

  /**
   * Add a new requisition.
   * @param data - The requisition data (without ID).
   */
  async addRequisition(data: Omit<Requisition, 'id'>): Promise<string> {
    const id =this.generate6DigitId();
    const currentUser = this.userService.getUser(); // Get the current logged-in user
    const newRequisition: Requisition = {
      ...data,
      id: id,
      createdByUserId: currentUser?.id || 'Unknown',
      createdByUserName: currentUser?.fullname || 'Unknown',
      currentApprovalLevel: 1, // Default to level 1
      approvalStatus: 'Pending', // Default to 'Pending'
      approvalHistory: [], // Initialize empty approval history
    };

    requisitionSchema.parse(newRequisition); // Validate the new requisition
    this.requisitions.push(newRequisition);
    this.saveToLocalStorage();
    return id
  }

  /**
   * Update an existing requisition.
   * @param requisition - The requisition to update.
   */
//   async updateRequisition(requisition: Requisition): Promise<void> {
//   try {
//     // Validate the requisition
//     requisitionSchema.parse(requisition);

//     // Find the index of the requisition
//     const index = this.requisitions.findIndex((r) => r.id === requisition.id);
//     if (index === -1) {
//       throw new Error('Requisition not found');
//     }

//     // Update the requisition
//     this.requisitions[index] = requisition;

//     // Save to local storage
//     this.saveToLocalStorage();
//   } catch (error) {
//     console.error('Error updating requisition:', error);
//     throw error;
//   }
  // }
  
  async updateRequisition(requisition: Requisition): Promise<void> {
  try {
    // Convert timestamp strings to Date objects in approvalHistory
    if (requisition.approvalHistory) {
      requisition.approvalHistory = requisition.approvalHistory.map(history => ({
        ...history,
        timestamp: new Date(history.timestamp), // Convert string to Date
      }));
    }

    // Validate the requisition
    requisitionSchema.parse(requisition);

    // Save the updated requisition
    const index = this.requisitions.findIndex(req => req.id === requisition.id);
    if (index !== -1) {
      this.requisitions[index] = requisition;
      this.saveToLocalStorage();
    }
  } catch (error) {
    console.error('Error updating requisition:', error);
    throw error;
  }
}

  /**
   * Update the status of a requisition.
   * @param requisitionId - The ID of the requisition.
   * @param status - The new status ('Approved' or 'Rejected').
   */
  updateRequisitionStatus(requisitionId: string, status: 'Approved' | 'Rejected'): Promise<void> {
    const requisition = this.requisitions.find((req) => req.id === requisitionId);
    if (requisition) {
      requisition.approvalStatus = status;
    }
    return Promise.resolve();
  }

  /**
   * Delete a requisition by ID.
   * @param id - The ID of the requisition to delete.
   */
  async deleteRequisition(id: string): Promise<void> {
    this.requisitions = this.requisitions.filter((r) => r.id !== id);
    this.saveToLocalStorage();
  }

  /**
   * Fetch a requisition by ID.
   * @param id - The ID of the requisition to fetch.
   */
  async getRequisitionById(id: string): Promise<Requisition | undefined> {
    return this.requisitions.find((r) => r.id === id);
  }

  /**
   * Assign an approval sequence to a requisition.
   * @param requisitionId - The ID of the requisition.
   * @param approvalSequenceId - The ID of the approval sequence.
   */
  async assignApprovalSequence(requisitionId: string, approvalSequenceId: string): Promise<void> {
    const requisition = this.requisitions.find((req) => req.id === requisitionId);
    if (!requisition) {
      throw new Error('Requisition not found');
    }

    requisition.approvalSequenceId = approvalSequenceId;
    requisition.currentApprovalLevel = 1; // Start at the first level
    requisition.approvalStatus = 'Pending'; // Set initial approval status
    this.saveToLocalStorage();
  }

  /**
   * Approve or reject a requisition.
   * @param requisitionId - The ID of the requisition.
   * @param status - The new status ('Approved' or 'Rejected').
   * @param signature - The Base64 string of the approver's signature.
   * @param comments - Optional comments from the approver.
   */
 async approveRequisition(
 requisitionId: string,
 status: 'Approved' | 'Rejected', 
 signature: string,
 comments?: string
): Promise<void> {
 const requisition = this.requisitions.find((req) => req.id === requisitionId);
 if (!requisition) {
   throw new Error('Requisition not found');
 }

 if (!requisition.approvalSequenceId || !requisition.currentApprovalLevel) {
   throw new Error('Approval sequence not assigned');
 }

 // Convert dates to Date objects
 requisition.dateCreated = new Date(requisition.dateCreated!);
 requisition.lastModified = new Date();

 // Fetch approval sequence
 const sequences = await firstValueFrom(
   this.approvalSequenceService.getSequencesByType('procurement')
 );

 const approvalSequence = sequences.find((seq) => seq.id === requisition.approvalSequenceId);
 if (!approvalSequence) {
   throw new Error('Approval sequence not found');
 }

 // Update requisition status
 requisition.status = status;
 requisition.signature = signature;

 // Handle approval history
 requisition.approvalHistory = requisition.approvalHistory || [];
 const newHistoryEntry = {
   level: requisition.currentApprovalLevel,
   status,
   timestamp: new Date(),
   comments
 };
 requisition.approvalHistory = [
   ...requisition.approvalHistory.map(h => ({
     ...h,
     timestamp: new Date(h.timestamp)
   })),
   newHistoryEntry
 ];

 if (status === 'Approved') {
   requisition.currentApprovalLevel += 1;
   const maxLevel = approvalSequence.level;
   requisition.approvalStatus = requisition.currentApprovalLevel > maxLevel ? 'Approved' : 'Pending';
 } else {
   requisition.approvalStatus = 'Rejected';
 }

 await this.updateRequisition(requisition);
 this.saveToLocalStorage();
}

  /**
   * Fetch requisitions with their approval sequence details.
   */
  async getRequisitionsWithApprovalDetails(): Promise<(Requisition & { approvalSequenceDetails?: ApprovalSequence })[]> {
    const requisitions = await this.getAllRequisitions(); // Fetch all requisitions
    const approvalSequences = (await this.approvalSequenceService.getAllSequences().toPromise()) || [];

    // Map requisitions to include the entire approval sequence details
    return requisitions.map((req) => {
      const sequence = approvalSequences.find((seq) => seq.id === req.approvalSequenceId);
      return {
        ...req,
        approvalSequenceDetails: sequence, // Add the entire approval sequence details
      };
    });
  }

   async getApprovalSequenceDetails(
    approvalSequenceId: string,
    currentApprovalLevel: number
  ): Promise<ApprovalSequence | undefined> {
    try {
      // Fetch all approval sequences
      const sequences = await this.approvalSequenceService
        .getAllSequences()
        .toPromise();

      if (!sequences) {
        throw new Error('Failed to fetch approval sequences');
      }

      // Find the sequence with the matching ID and level
      const sequence = sequences.find(
        (seq) =>
          seq.id === approvalSequenceId && seq.level === currentApprovalLevel
      );

      return sequence;
    } catch (error) {
      console.error('Failed to fetch approval sequence details:', error);
      return undefined;
    }
   }
  
  /**
 * Load the userFullName from the ApprovalSequence data schema for a given requisition.
 * @param requisitionId - The ID of the requisition.
 * @returns A promise that resolves to the userFullName or undefined if not found.
 */
async loadUserFullName(requisitionId: string): Promise<string | undefined> {
  try {
    // Find the requisition by ID
    const requisition = this.requisitions.find((req) => req.id === requisitionId);
    if (!requisition) {
      throw new Error(`Requisition with ID ${requisitionId} not found.`);
    }

    // Fetch the approval sequence using the requisition's approvalSequenceId
    const approvalSequence = await this.approvalSequenceService
      .getSequenceById(requisition.approvalSequenceId??'#')
      .toPromise();

    if (!approvalSequence) {
      console.warn(`Approval sequence with ID ${requisition.approvalSequenceId} not found.`);
      return undefined;
    }

    // Return the userFullName from the approval sequence
    return approvalSequence.userFullName;
  } catch (error) {
    console.error('Failed to load userFullName:', error);
    return undefined;
  }
}
  
  async getAllApprovalSequences(): Promise<ApprovalSequence[]> {
  try {
    const sequences = await this.approvalSequenceService.getAllSequences().toPromise();
    if (!sequences) {
      throw new Error('No approval sequences found');
    }
    return sequences;
  } catch (error) {
    console.error('Failed to fetch all approval sequences:', error);
    return [];
  }
}


}