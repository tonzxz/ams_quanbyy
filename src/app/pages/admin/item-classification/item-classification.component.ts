// src/app/pages/admin/item-classification/item-classification.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';

import { TabViewModule } from 'primeng/tabview';
import { MaterialModule } from 'src/app/material.module';

import { ItemClassificationService, ItemClassification } from 'src/app/services/item-classification.service';

@Component({
  selector: 'app-item-classification',
  templateUrl: './item-classification.component.html',
  styleUrls: ['./item-classification.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MaterialModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    BadgeModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    TabViewModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class ItemClassificationComponent implements OnInit {
  classifications: ItemClassification[] = [];
  loading = true;

  // Dialog
  dialogVisible = false;
  classificationForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  selectedId: string | null = null;

  constructor(
    private itemClassificationService: ItemClassificationService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    this.initializeForm();
    await this.loadData();
  }

  initializeForm() {
    this.classificationForm = this.formBuilder.group({
      category: ['', Validators.required],
      group: ['', Validators.required],
      description: ['']
    });
  }

  async loadData() {
    this.loading = true;
    this.classifications = await this.itemClassificationService.getAllClassifications();
    this.loading = false;
  }

  // Show dialog for new classification
  openNewDialog() {
    this.isEditMode = false;
    this.submitted = false;
    this.selectedId = null;
    this.dialogVisible = true;

    // Reset form
    this.classificationForm.reset({});
  }

  // Show dialog for edit
  editClassification(item: ItemClassification) {
    this.isEditMode = true;
    this.submitted = false;
    this.selectedId = item.id || null;
    this.dialogVisible = true;

    this.classificationForm.patchValue({
      category: item.category,
      group: item.group,
      description: item.description
    });
  }

  // Delete classification
  deleteClassification(item: ItemClassification) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete '${item.category} - ${item.group}'?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          if (item.id) {
            await this.itemClassificationService.deleteClassification(item.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Classification deleted successfully'
            });
            await this.loadData();
          }
        } catch (err: any) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
      }
    });
  }

  // Hide dialog
  hideDialog() {
    this.dialogVisible = false;
    this.submitted = false;
    this.classificationForm.reset({});
  }

  // Save classification (create or update)
  async saveClassification() {
    this.submitted = true;
    if (this.classificationForm.valid) {
      const formValue = this.classificationForm.value;
      try {
        if (this.isEditMode && this.selectedId) {
          // Update existing
          const updated: ItemClassification = {
            ...formValue,
            id: this.selectedId
          };
          await this.itemClassificationService.updateClassification(updated);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Classification updated'
          });
        } else {
          // Create new
          await this.itemClassificationService.addClassification(formValue);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Classification created'
          });
        }
        this.dialogVisible = false;
        this.classificationForm.reset({});
        await this.loadData();
      } catch (err: any) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      }
    }
  }
}
