import { Injectable } from '@angular/core';
import { z } from 'zod';
import { GroupService } from './group.service';
import { UserService } from './user.service';
import { ApprovalSequenceService } from './approval-sequence.service';

/**
 * Zod schema for an Extended Requisition.
 */
export const requisitionSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().max(500).optional(),
  status: z.enum(['Pending', 'Approved', 'Rejected']),
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
  dateCreated: z.date().optional(),
  lastModified: z.date().optional(),
  signature: z.string().optional(),
  createdByUserId: z.string().optional(),
  createdByUserName: z.string().optional(),
  approvalSequenceId: z.string().min(1, "Approval Sequence ID is required"),
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
  providedIn: 'root'
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
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      console.log('Loaded from localStorage:', JSON.parse(stored));
      this.requisitions = JSON.parse(stored);
    }
  }

  // Save to localStorage
  private saveToLocalStorage(): void {
    console.log('Saving to localStorage:', this.requisitions);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.requisitions));
  }

  // Generate a random 32-character hex ID
  private generate32CharId(): string {
    return Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  // Load some dummy data (optional)
private loadDummyData(): void {
  const dummy: Requisition[] = [
    // Level 1: Budget Unit Review (Procurement Flow)
    {
      id: this.generate32CharId(),
      title: 'Office Supplies Request',
      description: 'Request for stationery items.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId1',
      group: '12345678901234567890123456789012',
      products: [
        { id: '12345678901234567890123456789012', name: 'Pen', quantity: 10, price: 10, specifications: 'Blue ink' },
        { id: '23456789012345678901234567890123', name: 'Notebook', quantity: 5, price: 50, specifications: 'A5 size' },
      ],
      approvalSequenceId: 'dummyApprovalSequenceId1',
      currentApprovalLevel: 1,
      approvalStatus: 'Pending',
      approvalHistory: [], // No approvals yet
    },
    // Level 2: Technical Specification Review (Procurement Flow)
    {
      id: this.generate32CharId(),
      title: 'Electronics Request',
      description: 'Request for new laptops.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId2',
      group: '23456789012345678901234567890123',
      products: [
        { id: '34567890123456789012345678901234', name: 'Laptop', quantity: 2, price: 50000, specifications: '16GB RAM, 512GB SSD' },
      ],
      approvalSequenceId: 'dummyApprovalSequenceId2',
      currentApprovalLevel: 2,
      approvalStatus: 'Pending',
      approvalHistory: [
        { level: 1, status: 'Approved', timestamp: new Date('2023-10-01T10:00:00Z'), comments: 'Budget approved.' },
      ],
    },
    // Level 3: College President Approval (Procurement Flow)
    {
      id: this.generate32CharId(),
      title: 'Furniture Request',
      description: 'Request for office chairs and desks.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId3',
      group: '34567890123456789012345678901234',
      products: [
        { id: '45678901234567890123456789012345', name: 'Office Chair', quantity: 5, price: 2000, specifications: 'Ergonomic design' },
        { id: '56789012345678901234567890123456', name: 'Desk', quantity: 3, price: 5000, specifications: 'Adjustable height' },
      ],
      approvalSequenceId: 'dummyApprovalSequenceId3',
      currentApprovalLevel: 3,
      approvalStatus: 'Pending',
      approvalHistory: [
        { level: 1, status: 'Approved', timestamp: new Date('2023-10-02T09:00:00Z'), comments: 'Budget approved.' },
        { level: 2, status: 'Approved', timestamp: new Date('2023-10-03T14:30:00Z'), comments: 'Technical specifications verified.' },
      ],
    },
    // Level 4: BAC Final Review (Procurement Flow)
    {
      id: this.generate32CharId(),
      title: 'Software License Request',
      description: 'Request for software licenses for the IT department.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId4',
      group: '45678901234567890123456789012345',
      products: [
        { id: '67890123456789012345678901234567', name: 'Software License', quantity: 10, price: 1000, specifications: 'Annual subscription' },
      ],
      approvalSequenceId: 'dummyApprovalSequenceId4',
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
      id: this.generate32CharId(),
      title: 'Projector Request',
      description: 'Request for projectors for the conference room.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId5',
      group: '56789012345678901234567890123456',
      products: [
        { id: '78901234567890123456789012345678', name: 'Projector', quantity: 3, price: 15000, specifications: 'HD resolution' },
      ],
      approvalSequenceId: 'dummyApprovalSequenceId5',
      currentApprovalLevel: 5,
      approvalStatus: 'Pending',
      approvalHistory: [
        { level: 1, status: 'Approved', timestamp: new Date('2023-10-07T12:00:00Z'), comments: 'Budget approved.' },
        { level: 2, status: 'Approved', timestamp: new Date('2023-10-08T16:00:00Z'), comments: 'Technical specifications verified.' },
        { level: 3, status: 'Approved', timestamp: new Date('2023-10-09T10:00:00Z'), comments: 'Approved by College President.' },
        { level: 4, status: 'Approved', timestamp: new Date('2023-10-10T09:00:00Z'), comments: 'Final review by BAC.' },
      ],
    },
    // Level 6: RIS Review (Supply Management Flow)
    {
      id: this.generate32CharId(),
      title: 'Printer Request',
      description: 'Request for printers for the office.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId6',
      group: '67890123456789012345678901234567',
      products: [
        { id: '89012345678901234567890123456789', name: 'Printer', quantity: 5, price: 8000, specifications: 'Laser printer' },
      ],
      approvalSequenceId: 'dummyApprovalSequenceId6',
      currentApprovalLevel: 6,
      approvalStatus: 'Pending',
      approvalHistory: [
        { level: 1, status: 'Approved', timestamp: new Date('2023-10-11T12:00:00Z'), comments: 'Budget approved.' },
        { level: 2, status: 'Approved', timestamp: new Date('2023-10-12T16:00:00Z'), comments: 'Technical specifications verified.' },
        { level: 3, status: 'Approved', timestamp: new Date('2023-10-13T10:00:00Z'), comments: 'Approved by College President.' },
        { level: 4, status: 'Approved', timestamp: new Date('2023-10-14T09:00:00Z'), comments: 'Final review by BAC.' },
        { level: 5, status: 'Approved', timestamp: new Date('2023-10-15T14:00:00Z'), comments: 'Delivery inspected.' },
      ],
    },
    // Level 7: End User Receipt (Supply Management Flow)
    {
      id: this.generate32CharId(),
      title: 'Scanner Request',
      description: 'Request for scanners for the office.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId7',
      group: '78901234567890123456789012345678',
      products: [
        { id: '90123456789012345678901234567890', name: 'Scanner', quantity: 2, price: 12000, specifications: 'High-speed scanning' },
      ],
      approvalSequenceId: 'dummyApprovalSequenceId7',
      currentApprovalLevel: 7,
      approvalStatus: 'Pending',
      approvalHistory: [
        { level: 1, status: 'Approved', timestamp: new Date('2023-10-16T12:00:00Z'), comments: 'Budget approved.' },
        { level: 2, status: 'Approved', timestamp: new Date('2023-10-17T16:00:00Z'), comments: 'Technical specifications verified.' },
        { level: 3, status: 'Approved', timestamp: new Date('2023-10-18T10:00:00Z'), comments: 'Approved by College President.' },
        { level: 4, status: 'Approved', timestamp: new Date('2023-10-19T09:00:00Z'), comments: 'Final review by BAC.' },
        { level: 5, status: 'Approved', timestamp: new Date('2023-10-20T14:00:00Z'), comments: 'Delivery inspected.' },
        { level: 6, status: 'Approved', timestamp: new Date('2023-10-21T11:00:00Z'), comments: 'RIS reviewed.' },
      ],
    },
    // Level 8: Final Document Verification (Supply Management Flow)
    {
      id: this.generate32CharId(),
      title: 'Server Request',
      description: 'Request for servers for the IT department.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId8',
      group: '89012345678901234567890123456789',
      products: [
        { id: '01234567890123456789012345678901', name: 'Server', quantity: 1, price: 100000, specifications: 'High-performance server' },
      ],
      approvalSequenceId: 'dummyApprovalSequenceId8',
      currentApprovalLevel: 8,
      approvalStatus: 'Pending',
      approvalHistory: [
        { level: 1, status: 'Approved', timestamp: new Date('2023-10-22T12:00:00Z'), comments: 'Budget approved.' },
        { level: 2, status: 'Approved', timestamp: new Date('2023-10-23T16:00:00Z'), comments: 'Technical specifications verified.' },
        { level: 3, status: 'Approved', timestamp: new Date('2023-10-24T10:00:00Z'), comments: 'Approved by College President.' },
        { level: 4, status: 'Approved', timestamp: new Date('2023-10-25T09:00:00Z'), comments: 'Final review by BAC.' },
        { level: 5, status: 'Approved', timestamp: new Date('2023-10-26T14:00:00Z'), comments: 'Delivery inspected.' },
        { level: 6, status: 'Approved', timestamp: new Date('2023-10-27T11:00:00Z'), comments: 'RIS reviewed.' },
        { level: 7, status: 'Approved', timestamp: new Date('2023-10-28T13:00:00Z'), comments: 'Received by end user.' },
      ],
    },
    // Level 9: Property Inspection (Supply Management Flow)
    {
      id: this.generate32CharId(),
      title: 'Network Equipment Request',
      description: 'Request for network equipment for the IT department.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId9',
      group: '90123456789012345678901234567890',
      products: [
        { id: '12345678901234567890123456789012', name: 'Router', quantity: 5, price: 5000, specifications: 'High-speed router' },
        { id: '23456789012345678901234567890123', name: 'Switch', quantity: 3, price: 3000, specifications: '24-port switch' },
      ],
      approvalSequenceId: 'dummyApprovalSequenceId9',
      currentApprovalLevel: 9,
      approvalStatus: 'Pending',
      approvalHistory: [
        { level: 1, status: 'Approved', timestamp: new Date('2023-10-29T12:00:00Z'), comments: 'Budget approved.' },
        { level: 2, status: 'Approved', timestamp: new Date('2023-10-30T16:00:00Z'), comments: 'Technical specifications verified.' },
        { level: 3, status: 'Approved', timestamp: new Date('2023-10-31T10:00:00Z'), comments: 'Approved by College President.' },
        { level: 4, status: 'Approved', timestamp: new Date('2023-11-01T09:00:00Z'), comments: 'Final review by BAC.' },
        { level: 5, status: 'Approved', timestamp: new Date('2023-11-02T14:00:00Z'), comments: 'Delivery inspected.' },
        { level: 6, status: 'Approved', timestamp: new Date('2023-11-03T11:00:00Z'), comments: 'RIS reviewed.' },
        { level: 7, status: 'Approved', timestamp: new Date('2023-11-04T13:00:00Z'), comments: 'Received by end user.' },
        { level: 8, status: 'Approved', timestamp: new Date('2023-11-05T15:00:00Z'), comments: 'Documents verified.' },
      ],
    },
    // Level 10: Disposal Review (Supply Management Flow)
    {
      id: this.generate32CharId(),
      title: 'Old Equipment Disposal Request',
      description: 'Request for disposal of old equipment.',
      status: 'Pending',
      classifiedItemId: 'dummyClassifiedItemId10',
      group: '01234567890123456789012345678901',
      products: [
        { id: '34567890123456789012345678901234', name: 'Old Server', quantity: 2, price: 0, specifications: 'For disposal' },
      ],
      approvalSequenceId: 'dummyApprovalSequenceId10',
      currentApprovalLevel: 10,
      approvalStatus: 'Pending',
      approvalHistory: [
        { level: 1, status: 'Approved', timestamp: new Date('2023-11-06T12:00:00Z'), comments: 'Budget approved.' },
        { level: 2, status: 'Approved', timestamp: new Date('2023-11-07T16:00:00Z'), comments: 'Technical specifications verified.' },
        { level: 3, status: 'Approved', timestamp: new Date('2023-11-08T10:00:00Z'), comments: 'Approved by College President.' },
        { level: 4, status: 'Approved', timestamp: new Date('2023-11-09T09:00:00Z'), comments: 'Final review by BAC.' },
        { level: 5, status: 'Approved', timestamp: new Date('2023-11-10T14:00:00Z'), comments: 'Delivery inspected.' },
        { level: 6, status: 'Approved', timestamp: new Date('2023-11-11T11:00:00Z'), comments: 'RIS reviewed.' },
        { level: 7, status: 'Approved', timestamp: new Date('2023-11-12T13:00:00Z'), comments: 'Received by end user.' },
        { level: 8, status: 'Approved', timestamp: new Date('2023-11-13T15:00:00Z'), comments: 'Documents verified.' },
        { level: 9, status: 'Approved', timestamp: new Date('2023-11-14T17:00:00Z'), comments: 'Property inspected.' },
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
  async getAllRequisitions(): Promise<Requisition[]> {
    return this.requisitions;
  }

  /**
   * Fetch all pending requisitions.
   */
  async getPendingRequisitions(): Promise<Requisition[]> {
    console.log('Current requisitions:', this.requisitions);
    return this.requisitions.filter((req) => req.status === 'Pending');
  }

  /**
   * Add a new requisition.
   * @param data - The requisition data (without ID).
   */
  async addRequisition(data: Omit<Requisition, 'id'>): Promise<void> {
    const currentUser = this.userService.getUser(); // Get the current logged-in user
    const newRequisition: Requisition = {
      ...data,
      id: this.generate32CharId(),
      createdByUserId: currentUser?.id || 'Unknown',
      createdByUserName: currentUser?.fullname || 'Unknown',
      currentApprovalLevel: 1, // Default to level 1
      approvalStatus: 'Pending', // Default to 'Pending'
      approvalHistory: [], // Initialize empty approval history
    };

    requisitionSchema.parse(newRequisition); // Validate the new requisition
    this.requisitions.push(newRequisition);
    this.saveToLocalStorage();
  }

  /**
   * Update an existing requisition.
   * @param requisition - The requisition to update.
   */
  async updateRequisition(requisition: Requisition): Promise<void> {
    requisitionSchema.parse(requisition);
    const index = this.requisitions.findIndex((r) => r.id === requisition.id);
    if (index === -1) {
      throw new Error('Requisition not found');
    }
    this.requisitions[index] = requisition;
    this.saveToLocalStorage();
  }

  /**
   * Update the status of a requisition with a signature.
   * @param id - The ID of the requisition.
   * @param status - The new status ('Approved' or 'Rejected').
   * @param signature - Base64 string of the signature (optional).
   */
  async updateRequisitionStatusWithSignature(id: string, status: 'Approved' | 'Rejected', signature: string): Promise<void> {
    const requisition = this.requisitions.find((req) => req.id === id);
    if (!requisition) {
      throw new Error('Requisition not found');
    }
    requisition.status = status;
    requisition.signature = signature;
    this.saveToLocalStorage();
  }

  /**
   * Update the status of a requisition.
   * @param id - The ID of the requisition.
   * @param status - The new status ('Approved' or 'Rejected').
   */
  async updateRequisitionStatus(id: string, status: 'Approved' | 'Rejected'): Promise<void> {
    const requisitionIndex = this.requisitions.findIndex((req) => req.id === id);
    if (requisitionIndex === -1) {
      throw new Error('Requisition not found');
    }

    this.requisitions[requisitionIndex].status = status;
    console.log('Updated requisition:', this.requisitions[requisitionIndex]);

    this.saveToLocalStorage();
    console.log('Requisitions after saving:', this.requisitions);
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
   * Update requisition with a purchase request attachment and status.
   * @param id - The requisition ID.
   * @param purchaseRequestAttachment - The Base64 PDF string of the PR.
   * @param status - The new status ('Approved' or 'Rejected').
   * @param signature - The Base64 string of the approver's signature.
   */
  async updateRequisitionWithAttachment(
    id: string,
    purchaseRequestAttachment: string,
    status: 'Approved' | 'Rejected',
    signature: string
  ): Promise<void> {
    console.log('Updating requisition with ID:', id); // Debugging
    const requisition = this.requisitions.find((req) => req.id === id);
    if (!requisition) {
      console.error('Requisition not found for ID:', id); // Debugging
      throw new Error('Requisition not found');
    }
    console.log('Requisition found:', requisition); // Debugging

    requisition.purchaseRequestAttachment = purchaseRequestAttachment;
    requisition.status = status;
    requisition.signature = signature;
    this.saveToLocalStorage();
    console.log('Requisition updated:', requisition); // Debugging
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

    // Fetch the approval sequence
    const sequences = await this.approvalSequenceService
      .getSequencesByType('procurement') // Assuming procurement flow
      .toPromise();

    if (!sequences) {
      throw new Error('Failed to fetch approval sequences');
    }

    const approvalSequence = sequences.find(seq => seq.id === requisition.approvalSequenceId);

    if (!approvalSequence) {
      throw new Error('Approval sequence not found');
    }

    // Update requisition status
    requisition.status = status;
    requisition.signature = signature;

    // Add to approval history
    requisition.approvalHistory = requisition.approvalHistory || [];
    requisition.approvalHistory.push({
      level: requisition.currentApprovalLevel,
      status,
      timestamp: new Date(),
      comments,
    });

    if (status === 'Approved') {
      // Move to the next approval level
      requisition.currentApprovalLevel += 1;

      // Check if all levels are approved
      const maxLevel = approvalSequence.level;
      if (requisition.currentApprovalLevel > maxLevel) {
        requisition.approvalStatus = 'Approved'; // Final approval
      } else {
        requisition.approvalStatus = 'Pending'; // Reset to 'Pending' for the next level
      }
    } else {
      requisition.approvalStatus = 'Rejected'; // Reject the requisition
    }

    this.saveToLocalStorage();
  }
}