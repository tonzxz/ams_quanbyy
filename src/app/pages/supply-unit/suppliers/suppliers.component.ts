import { Component, OnInit, ViewChild } from '@angular/core';  
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputTextarea } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LottieAnimationComponent } from "../../ui-components/lottie-animation/lottie-animation.component";
import { MaterialModule } from 'src/app/material.module';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Supplier, SupplierService } from 'src/app/services/supplier.service';

function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null; // Allow empty values
    }
    
    const valid = /^\+639\d{9}$/.test(value);
    return valid ? null : { invalidPhoneNumber: true };
  };
}

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    MessageModule,
    ConfirmDialogModule,
    ToastModule,
    ConfirmPopupModule,
    InputTextarea,
    LottieAnimationComponent,
    MaterialModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MessageService, ConfirmationService]
})
export class SuppliersComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  
  suppliers: Supplier[] = [];
  selectedSupplier: Supplier | undefined;
  showSupplierModal: boolean = false;
  searchValue: string = '';
  isLoading: boolean = false;

  supplierForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      contact_person: [''],
      contact_number: ['', [phoneNumberValidator()]],
      email: ['', [Validators.email]],
      address: [''],
      description: [''],
      tin_number: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchSuppliers();
  }

  fetchSuppliers(): void {
    this.isLoading = true;
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching suppliers:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load suppliers'
        });
        this.isLoading = false;
      }
    });
  }

  openAddSupplierModal(): void {
    this.selectedSupplier = undefined;
    this.supplierForm.reset();
    this.showSupplierModal = true;
  }

  openEditSupplierModal(supplier: Supplier): void {
    this.selectedSupplier = supplier;
    this.supplierForm.patchValue({
      name: supplier.name,
      contact_person: supplier.contact_person,
      contact_number: supplier.contact_number,
      email: supplier.email,
      address: supplier.address,
      description: supplier.description,
      tin_number: supplier.tin_number
    });
    this.showSupplierModal = true;
  }

  closeSupplierModal(): void {
    this.showSupplierModal = false;
  }

  addSupplier(): void {
    if (this.supplierForm.valid) {
      const newSupplier: Supplier = this.supplierForm.value;
      this.supplierService.createSupplier(newSupplier).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Supplier added successfully'
          });
          this.closeSupplierModal();
          this.fetchSuppliers();
        },
        error: (error) => {
          console.error('Error adding supplier:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add supplier'
          });
        }
      });
    }
  }

  editSupplier(): void {
    if (this.supplierForm.valid && this.selectedSupplier) {
      const updatedSupplier: Supplier = {
        ...this.selectedSupplier,
        ...this.supplierForm.value
      };
      
      this.supplierService.updateSupplier(this.selectedSupplier.id!, updatedSupplier).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Supplier updated successfully'
          });
          this.closeSupplierModal();
          this.fetchSuppliers();
        },
        error: (error) => {
          console.error('Error updating supplier:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update supplier'
          });
        }
      });
    }
  }

  confirmDeleteSupplier(event: Event, id: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this supplier?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.supplierService.deleteSupplier(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Supplier deleted successfully'
            });
            this.fetchSuppliers();
          },
          error: (error) => {
            console.error('Error deleting supplier:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete supplier'
            });
          }
        });
      }
    });
  }
}