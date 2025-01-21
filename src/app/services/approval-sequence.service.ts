// src/app/services/approval-sequence.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { z } from 'zod';
import { UserService, User } from './user.service';

export const approvalSequenceSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  name: z.string().min(1, "Name is required"),
  level: z.number().min(1, "Level must be at least 1"),
  departmentCode: z.string().min(1, "Department code is required"),
  departmentName: z.string().min(1, "Department name is required"),
  roleCode: z.string().min(1, "Role code is required"),
  roleName: z.string().min(1, "Role name is required"),
  userId: z.string().min(1, "User ID is required"),
  userFullName: z.string().min(1, "User full name is required"),
  type: z.enum(['procurement', 'supply']),
  isActive: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export type ApprovalSequence = z.infer<typeof approvalSequenceSchema>;

@Injectable({
  providedIn: 'root'
})
export class ApprovalSequenceService {
  private sequences: ApprovalSequence[] = [];
  private readonly SEQUENCES_STORAGE_KEY = 'approval_sequences_data';

  constructor(private userService: UserService) {
    this.loadSequences();
    this.initializeDefaultSequences();
  }

  private initializeDefaultSequences() {
    if (this.sequences.length === 0) {
      // Procurement Flow Sequences
      const procurementSequences: Omit<ApprovalSequence, 'id' | 'createdAt' | 'updatedAt'>[] = [
        // Budget Unit - Initial Review
        {
          name: 'Budget Unit Review',
          level: 1,
          departmentCode: 'BUDGET',
          departmentName: 'Budget Unit',
          roleCode: 'accounting',
          roleName: 'Budget Officer',
          userId: '',
          userFullName: '',
          type: 'procurement',
          isActive: true
        },
        // Inspection Team - Specification Check
        {
          name: 'Technical Specification Review',
          level: 2,
          departmentCode: 'INSPECTION',
          departmentName: 'Inspection Team',
          roleCode: 'inspection',
          roleName: 'Inspection Officer',
          userId: '',
          userFullName: '',
          type: 'procurement',
          isActive: true
        },
        // College President Approval
        {
          name: 'College President Approval',
          level: 3,
          departmentCode: 'ADMIN',
          departmentName: 'Administration',
          roleCode: 'superadmin',
          roleName: 'College President',
          userId: '',
          userFullName: '',
          type: 'procurement',
          isActive: true
        },
        // BAC Final Review
        {
          name: 'BAC Final Review',
          level: 4,
          departmentCode: 'BAC',
          departmentName: 'Bids and Awards Committee',
          roleCode: 'bac',
          roleName: 'BAC Chairman',
          userId: '',
          userFullName: '',
          type: 'procurement',
          isActive: true
        }
      ];

      // Supply Management Flow Sequences
      const supplySequences: Omit<ApprovalSequence, 'id' | 'createdAt' | 'updatedAt'>[] = [
        // Initial Inspection
        {
          name: 'Delivery Inspection',
          level: 1,
          departmentCode: 'INSPECTION',
          departmentName: 'Inspection Team',
          roleCode: 'inspection',
          roleName: 'Inspection Officer',
          userId: '',
          userFullName: '',
          type: 'supply',
          isActive: true
        },
        // CAF for RIS
        {
          name: 'RIS Review',
          level: 2,
          departmentCode: 'ACCOUNTING',
          departmentName: 'Accounting Unit',
          roleCode: 'accounting',
          roleName: 'CAF Officer',
          userId: '',
          userFullName: '',
          type: 'supply',
          isActive: true
        },
        // End User Receipt
        {
          name: 'Receipt and Acknowledgement',
          level: 3,
          departmentCode: 'END_USER',
          departmentName: 'End User Department',
          roleCode: 'end-user',
          roleName: 'End User',
          userId: '',
          userFullName: '',
          type: 'supply',
          isActive: true
        },
        // Accounting Final Verification
        {
          name: 'Final Document Verification',
          level: 4,
          departmentCode: 'ACCOUNTING',
          departmentName: 'Accounting Unit',
          roleCode: 'accounting',
          roleName: 'Accounting Officer',
          userId: '',
          userFullName: '',
          type: 'supply',
          isActive: true
        },
        // Property Inspection (Semi-expendable/PPA)
        {
          name: 'Property Inspection',
          level: 5,
          departmentCode: 'INSPECTION',
          departmentName: 'Inspection Team',
          roleCode: 'inspection',
          roleName: 'Property Inspector',
          userId: '',
          userFullName: '',
          type: 'supply',
          isActive: true
        },
        // Supply Management - Disposal Approval
        {
          name: 'Disposal Review',
          level: 6,
          departmentCode: 'SUPPLY',
          departmentName: 'Supply Management Unit',
          roleCode: 'supply',
          roleName: 'Supply Officer',
          userId: '',
          userFullName: '',
          type: 'supply',
          isActive: true
        }
      ];

      // Get users and assign to sequences
      this.userService.getAllUsers().subscribe(users => {
        // Get users by role
        const accountingUsers = users.filter(u => u.role === 'accounting');
        const inspectionOfficer = users.find(u => u.role === 'inspection');
        const collegePresident = users.find(u => u.role === 'superadmin');
        const bacChairman = users.find(u => u.role === 'bac');
        const endUserOfficer = users.find(u => u.role === 'end-user');
        const supplyOfficer = users.find(u => u.role === 'supply');

        // Assign users to procurement sequences
        if (accountingUsers.length > 0) {
          const budgetSequence = procurementSequences.find(seq => seq.departmentCode === 'BUDGET');
          if (budgetSequence) {
            budgetSequence.userId = accountingUsers[0].id!;
            budgetSequence.userFullName = accountingUsers[0].fullname;
          }
        }

        if (inspectionOfficer) {
          const inspectionSeqs = [...procurementSequences, ...supplySequences]
            .filter(seq => seq.roleCode === 'inspection');
          inspectionSeqs.forEach(seq => {
            seq.userId = inspectionOfficer.id!;
            seq.userFullName = inspectionOfficer.fullname;
          });
        }

        if (collegePresident) {
          const presidentSeq = procurementSequences.find(seq => seq.departmentCode === 'ADMIN');
          if (presidentSeq) {
            presidentSeq.userId = collegePresident.id!;
            presidentSeq.userFullName = collegePresident.fullname;
          }
        }

        if (bacChairman) {
          const bacSeq = procurementSequences.find(seq => seq.departmentCode === 'BAC');
          if (bacSeq) {
            bacSeq.userId = bacChairman.id!;
            bacSeq.userFullName = bacChairman.fullname;
          }
        }

        // Assign users to supply sequences
        if (accountingUsers.length > 0) {
          const accountingSeqs = supplySequences.filter(seq => seq.roleCode === 'accounting');
          accountingSeqs.forEach(seq => {
            seq.userId = accountingUsers[0].id!;
            seq.userFullName = accountingUsers[0].fullname;
          });
        }

        if (endUserOfficer) {
          const endUserSeq = supplySequences.find(seq => seq.departmentCode === 'END_USER');
          if (endUserSeq) {
            endUserSeq.userId = endUserOfficer.id!;
            endUserSeq.userFullName = endUserOfficer.fullname;
          }
        }

        if (supplyOfficer) {
          const supplySeq = supplySequences.find(seq => seq.departmentCode === 'SUPPLY');
          if (supplySeq) {
            supplySeq.userId = supplyOfficer.id!;
            supplySeq.userFullName = supplyOfficer.fullname;
          }
        }

        // Add all sequences with assigned users
        [...procurementSequences, ...supplySequences].forEach(sequence => {
          if (sequence.userId) {
            this.addSequence(sequence).subscribe();
          }
        });
      });
    }
  }

  // Helper method to generate a random 32-character ID
  private generateId(): string {
    return Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  // Load sequences from localStorage
  private loadSequences() {
    const storedSequences = localStorage.getItem(this.SEQUENCES_STORAGE_KEY);
    if (storedSequences) {
      const parsedSequences = JSON.parse(storedSequences);
      this.sequences = parsedSequences.map((seq: any) => ({
        ...seq,
        createdAt: seq.createdAt ? new Date(seq.createdAt) : new Date(),
        updatedAt: seq.updatedAt ? new Date(seq.updatedAt) : new Date()
      }));
    }
  }

  // Save sequences to localStorage
  private saveSequences() {
    localStorage.setItem(this.SEQUENCES_STORAGE_KEY, JSON.stringify(this.sequences));
  }

  // Get all sequences
  getAllSequences(): Observable<ApprovalSequence[]> {
    return of(this.sequences);
  }

  // Get sequences by type (procurement or supply)
  getSequencesByType(type: 'procurement' | 'supply'): Observable<ApprovalSequence[]> {
    return of(this.sequences.filter(seq => seq.type === type));
  }

  // Create new sequence
  addSequence(sequenceData: Omit<ApprovalSequence, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApprovalSequence> {
    try {
      const newSequence: ApprovalSequence = {
        ...sequenceData,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      approvalSequenceSchema.parse(newSequence);
      this.sequences.push(newSequence);
      this.saveSequences();

      return of(newSequence);
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Update existing sequence
  updateSequence(sequenceId: string, sequenceData: Partial<ApprovalSequence>): Observable<ApprovalSequence> {
    try {
      const sequenceIndex = this.sequences.findIndex(seq => seq.id === sequenceId);
      if (sequenceIndex === -1) {
        return throwError(() => new Error('Sequence not found'));
      }

      const updatedSequence: ApprovalSequence = {
        ...this.sequences[sequenceIndex],
        ...sequenceData,
        id: sequenceId,
        updatedAt: new Date()
      };

      approvalSequenceSchema.parse(updatedSequence);
      this.sequences[sequenceIndex] = updatedSequence;
      this.saveSequences();

      return of(updatedSequence);
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Delete sequence
  deleteSequence(sequenceId: string): Observable<boolean> {
    const sequenceIndex = this.sequences.findIndex(seq => seq.id === sequenceId);
    if (sequenceIndex === -1) {
      return throwError(() => new Error('Sequence not found'));
    }

    this.sequences.splice(sequenceIndex, 1);
    this.saveSequences();

    return of(true);
  }

  // Get available users for approver selection based on role
  getAvailableUsers(role: string): Observable<User[]> {
    return new Observable(subscriber => {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          const availableUsers = users.filter(user => user.role === role.toLowerCase());
          subscriber.next(availableUsers);
          subscriber.complete();
        },
        error: (error) => subscriber.error(error)
      });
    });
  }

  // Reset sequences (for testing)
  resetSequences(): Observable<boolean> {
    this.sequences = [];
    this.saveSequences();
    return of(true);
  }
}