import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MessageService, ConfirmationService } from 'primeng/api'
import { CrudService } from 'src/app/services/crud.service'
import { Approver, Users, Entity } from 'src/app/schema/schema'
import { Table } from 'primeng/table'

// PrimeNG and Angular Material Components
import { TableModule, TableRowReorderEvent } from 'primeng/table';

import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { DialogModule } from 'primeng/dialog'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { DropdownModule } from 'primeng/dropdown'
import { ToastModule } from 'primeng/toast'
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card'
import { IconField } from 'primeng/iconfield'
import { InputIcon } from 'primeng/inputicon'

// Import dummy data
import { dummyPPMPSequence, dummyUsers, dummyEntity } from 'src/app/schema/dummy'

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-ppmp-sequence',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    ToastModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    IconField,
    InputIcon,
    
  ],
  templateUrl: './ppmp-sequence.component.html',
  providers: [MessageService, ConfirmationService],
})
export class PpmpSequenceComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  
  sequences: any[] = [];
  users: Users[] = [];
  entities: Entity[] = [];
  approverForm!: FormGroup;
  approverDialog = false;
  isEditMode = false;
  currentApproverId: string | null = null;
  submitted = false;
  loading = false;
  deleteDialogVisible = false;
  approverToDelete: Approver | null = null;
  
  // Dropdown options
  userOptions: DropdownOption[] = [];
  entityOptions: DropdownOption[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private crudService: CrudService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeData();
  }

  initializeForm(): void {
    this.approverForm = this.formBuilder.group({
      user_id: ['', Validators.required],
      name: ['', Validators.required],
      approval_order: [1, [Validators.required, Validators.min(1)]],
      entity_id: ['1', Validators.required] // Default to PPMP entity
    });
  }

  // Initialize data by checking if data exists in localStorage, and if not, initializing with dummy data
  async initializeData(): Promise<void> {
    try {
      let usersExist = false;
      let entitiesExist = false;
      let approversExist = false;
      
      try {
        // Check if data exists in localStorage
        const users = await this.crudService.getAll<Users>(Users);
        usersExist = users && users.length > 0;
        
        const entities = await this.crudService.getAll<Entity>(Entity);
        entitiesExist = entities && entities.length > 0;
        
        const approvers = await this.crudService.getAll<Approver>(Approver);
        approversExist = approvers && approvers.length > 0;
      } catch (error) {
        console.warn('Error checking if data exists:', error);
      }
      
      // Initialize with dummy data if needed
      if (!usersExist) {
        console.log('Initializing users with dummy data');
        await this.crudService.flushDummyData(Users, dummyUsers);
      }
      
      if (!entitiesExist) {
        console.log('Initializing entities with dummy data');
        await this.crudService.flushDummyData(Entity, dummyEntity);
      }
      
      if (!approversExist) {
        console.log('Initializing approvers with dummy data');
        await this.crudService.flushDummyData(Approver, dummyPPMPSequence);
      }
      
      // Then load the data
      await this.loadApprovers();
    } catch (error) {
      console.error('Failed to initialize data:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Initialization Error', 
        detail: 'Failed to initialize data' 
      });
    }
  }

  async loadApprovers(): Promise<void> {
    this.loading = true;
    try {
      // Load users from CrudService
      const loadedUsers = await this.crudService.getAll<Users>(Users);
      this.users = loadedUsers.length > 0 ? loadedUsers : dummyUsers;
      
      // Load entities from CrudService, filter for PPMP
      const loadedEntities = await this.crudService.getAll<Entity>(Entity);
      this.entities = loadedEntities.length > 0 
        ? loadedEntities.filter(entity => entity.name === 'PPMP')
        : dummyEntity.filter(entity => entity.name === 'PPMP');

      // Create dropdown options
      this.userOptions = this.users.map(user => ({
        label: user.fullname,
        value: user.id
      }));
      
      this.entityOptions = this.entities.map(entity => ({
        label: entity.name,
        value: entity.id.toString()
      }));

      // Load sequences from CrudService
      const loadedSequences = await this.crudService.getAll<Approver>(Approver);
      const ppmpSequences = loadedSequences.length > 0
        ? loadedSequences.filter(seq => seq.entity_id === '1')
        : dummyPPMPSequence.filter(seq => seq.entity_id === '1');
      
      // Sort sequences by approval_order
      const sortedSequences = [...ppmpSequences].sort((a, b) => a.approval_order - b.approval_order);
      
      // Map sequences to display format
      this.sequences = sortedSequences.map(sequence => {
        const user = this.users.find(user => user.id === sequence.user_id);
        const entity = this.entities.find(entity => entity.id.toString() === sequence.entity_id);
        
        return {
          ...sequence,
          user_fullname: user ? user.fullname : 'Unknown User',
          user_role: user ? user.role : 'Unknown Role',
          entity_name: entity ? entity.name : 'Unknown Entity'
        };
      });
      
      // Verify that sequences are stored in localStorage
      const storedApprovers = await this.crudService.getAll<Approver>(Approver);
      if (!storedApprovers || storedApprovers.length === 0) {
        console.warn('No approvers found in localStorage after loading, reinitializing...');
        await this.crudService.flushDummyData(Approver, dummyPPMPSequence);
        await this.loadApprovers(); // Reload after reinitializing
      }
    } catch (error) {
      console.error('Error loading approvers:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Data Load Error', 
        detail: 'Failed to load approvers' 
      });
    } finally {
      this.loading = false;
    }
  }

  openNewApproverDialog(): void {
    this.isEditMode = false;
    this.currentApproverId = null;
    this.approverForm.reset();
    this.approverForm.patchValue({ 
      approval_order: this.getNextOrder(),
      entity_id: '1' // Default to PPMP entity
    });
    this.approverDialog = true;
    this.submitted = false;
  }

  getNextOrder(): number {
    return this.sequences.length > 0 ? Math.max(...this.sequences.map(s => s.approval_order)) + 1 : 1;
  }

  async saveApprover(): Promise<void> {
    this.submitted = true;
    
    if (this.approverForm.invalid) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Validation Error', 
        detail: 'Please fill in all required fields.' 
      });
      return;
    }

    this.loading = true;
    try {
      if (this.isEditMode && this.currentApproverId) {
        // Edit existing approver
        const updateData = { 
          user_id: this.approverForm.value.user_id,
          name: this.approverForm.value.name,
          approval_order: this.approverForm.value.approval_order,
          entity_id: this.approverForm.value.entity_id
        };
        
        await this.crudService.update<Approver>(Approver, this.currentApproverId, updateData as any);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Approver updated successfully' 
        });
      } else {
        // Create new approver
        const newId = this.generateUniqueId();
        const newApproverData = {
          id: newId,
          user_id: this.approverForm.value.user_id,
          name: this.approverForm.value.name,
          approval_order: this.approverForm.value.approval_order,
          entity_id: this.approverForm.value.entity_id
        };
        
        // For create, we need to separate the ID from the data
        const { id, ...dataWithoutId } = newApproverData;
        await this.crudService.create<Approver>(Approver, dataWithoutId as any);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'New approver created successfully' 
        });
      }
      
      // Reload the data
      await this.loadApprovers();
      this.hideDialog();
    } catch (error) {
      console.error('Operation failed:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: `Operation failed: ${error}` 
      });
    } finally {
      this.loading = false;
    }
  }

  editApprover(approver: any): void {
    this.approverForm.patchValue({
      user_id: approver.user_id,
      name: approver.name,
      approval_order: approver.approval_order,
      entity_id: approver.entity_id
    });
    
    this.isEditMode = true;
    this.currentApproverId = approver.id;
    this.approverDialog = true;
    this.submitted = false;
  }

  deleteApprover(approver: any): void {
    this.approverToDelete = approver;
    this.deleteDialogVisible = true;
  }

  async confirmDeleteAction(): Promise<void> {
    if (!this.approverToDelete) return;
    
    this.loading = true;
    try {
      // Make sure we're using the correct ID
      const idToDelete = this.approverToDelete.id;
      const deletedOrderNumber = this.approverToDelete.approval_order;
      
      // First delete the approver
      await this.crudService.delete<Approver>(Approver, idToDelete);
      
      // Then update the order numbers of the remaining approvers
      const allApprovers = await this.crudService.getAll<Approver>(Approver);
      const ppmpApprovers = allApprovers.filter(a => a.entity_id === '1');
      
      // Update order numbers for all approvers with higher order than the deleted one
      for (const approver of ppmpApprovers) {
        if (approver.approval_order > deletedOrderNumber) {
          // Decrement the order number
          await this.crudService.update<Approver>(
            Approver, 
            approver.id, 
            { ...approver, approval_order: approver.approval_order - 1 } as any
          );
        }
      }
      
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Approver deleted successfully' 
      });
      
      // Reload data after deletion and reordering
      await this.loadApprovers();
    } catch (error) {
      console.error('Delete failed:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: `Failed to delete approver: ${error}` 
      });
    } finally {
      this.loading = false;
      this.deleteDialogVisible = false;
      this.approverToDelete = null;
    }
  }

  hideDialog(): void {
    this.approverDialog = false;
    this.submitted = false;
    this.approverForm.reset();
  }

  // Handle row reordering event from drag and drop
  async onRowReorder(event: any): Promise<void> {
    // Get the moved item
    const movedItem = this.sequences[event.dragIndex];
    
    // Calculate the new order of items
    const newIndex = event.dropIndex;
    const oldOrder = movedItem.approval_order;
    const newOrder = this.sequences[newIndex].approval_order;
    
    this.loading = true;
    try {
      // Get all approvers that need to be updated
      const allApprovers = await this.crudService.getAll<Approver>(Approver);
      const ppmpApprovers = allApprovers.filter(a => a.entity_id === '1');
      
      if (oldOrder < newOrder) {
        // Moving down: decrement orders for items between old and new positions
        for (const approver of ppmpApprovers) {
          if (approver.approval_order > oldOrder && approver.approval_order <= newOrder) {
            await this.crudService.update<Approver>(
              Approver,
              approver.id,
              { ...approver, approval_order: approver.approval_order - 1 } as any
            );
          }
        }
      } else if (oldOrder > newOrder) {
        // Moving up: increment orders for items between new and old positions
        for (const approver of ppmpApprovers) {
          if (approver.approval_order >= newOrder && approver.approval_order < oldOrder) {
            await this.crudService.update<Approver>(
              Approver,
              approver.id,
              { ...approver, approval_order: approver.approval_order + 1 } as any
            );
          }
        }
      }
      
      // Update the moved item's order
      await this.crudService.update<Approver>(
        Approver,
        movedItem.id,
        { ...movedItem, approval_order: newOrder } as any
      );
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Approval sequence reordered successfully'
      });
      
      // Reload data to show the updated order
      await this.loadApprovers();
    } catch (error) {
      console.error('Reordering failed:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to reorder approval sequence: ${error}`
      });
      
      // Reload to restore the original order if there was an error
      await this.loadApprovers();
    } finally {
      this.loading = false;
    }
  }

  // Helper function to generate unique ID in APR-YYYY-XXX format
  generateUniqueId(): string {
    const year = new Date().getFullYear();
    const existingIds = this.sequences.map(s => s.id);
    let sequence = 1;
    
    // Extract the highest sequence number from existing IDs
    existingIds.forEach(id => {
      if (id.startsWith(`APR-${year}-`)) {
        const seqStr = id.split('-')[2];
        const seqNum = parseInt(seqStr, 10);
        if (!isNaN(seqNum) && seqNum >= sequence) {
          sequence = seqNum + 1;
        }
      }
    });
    
    // Pad sequence with leading zeros
    const paddedSequence = sequence.toString().padStart(3, '0');
    return `APR-${year}-${paddedSequence}`;
  }
}