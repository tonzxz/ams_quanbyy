import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';

import { RequisitionService, Requisition } from 'src/app/services/requisition.service';
import { ItemClassificationService, ItemClassification } from 'src/app/services/item-classification.service';

@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.component.html',
  styleUrls: ['./requisition.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class RequisitionComponent implements OnInit {
  requisitions: Requisition[] = [];
  classifiedItems: ItemClassification[] = [];
  loading = true;

  // Dialog
  dialogVisible = false;
  requisitionForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  selectedId: string | null = null;

  // Dropdown options
  statusOptions = ['Pending', 'Approved', 'Rejected'];

  constructor(
    private requisitionService: RequisitionService,
    private itemClassificationService: ItemClassificationService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    this.initializeForm();
    await this.loadData();
    await this.loadClassifiedItems();
  }

  initializeForm() {
    this.requisitionForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      status: ['', Validators.required],
      classifiedItemId: ['', Validators.required]
    });
  }

  async loadData() {
    this.loading = true;
    this.requisitions = await this.requisitionService.getAllRequisitions();
    this.loading = false;
  }

  async loadClassifiedItems() {
    this.classifiedItems = await this.itemClassificationService.getAllClassifications();
  }

  getClassifiedItemName(id: string): string {
    const item = this.classifiedItems.find((i) => i.id === id);
    return item ? `${item.category} - ${item.group}` : 'N/A';
  }

  openNewDialog() {
    this.isEditMode = false;
    this.submitted = false;
    this.selectedId = null;
    this.dialogVisible = true;
    this.requisitionForm.reset();
  }

  editRequisition(item: Requisition) {
    this.isEditMode = true;
    this.submitted = false;
    this.selectedId = item.id || null;
    this.dialogVisible = true;

    this.requisitionForm.patchValue({
      title: item.title,
      description: item.description,
      status: item.status,
      classifiedItemId: item.classifiedItemId
    });
  }

  deleteRequisition(item: Requisition) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete '${item.title}'?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          if (item.id) {
            await this.requisitionService.deleteRequisition(item.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Requisition deleted successfully'
            });
            await this.loadData();
          }
        } catch (err: any) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
      }
    });
  }

  hideDialog() {
    this.dialogVisible = false;
    this.submitted = false;
    this.requisitionForm.reset();
  }

  async saveRequisition() {
    this.submitted = true;
    if (this.requisitionForm.valid) {
      const formValue = this.requisitionForm.value;
      try {
        if (this.isEditMode && this.selectedId) {
          // Update existing
          const updated: Requisition = {
            ...formValue,
            id: this.selectedId
          };
          await this.requisitionService.updateRequisition(updated);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Requisition updated'
          });
        } else {
          // Create new
          await this.requisitionService.addRequisition(formValue);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Requisition created'
          });
        }
        this.dialogVisible = false;
        this.requisitionForm.reset();
        await this.loadData();
      } catch (err: any) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      }
    }
  }
}