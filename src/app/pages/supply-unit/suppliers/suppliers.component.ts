import { Component, OnInit } from '@angular/core';  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
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
  suppliers: any[] = [];
  searchValue: string = '';
  showSupplierModal: boolean = false;
  supplierForm: FormGroup;
  selectedSupplier: any = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      address: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    // TODO: Implement API call to fetch suppliers
    this.suppliers = [];
  }

  openAddSupplierModal() {
    this.selectedSupplier = null;
    this.supplierForm.reset();
    this.showSupplierModal = true;
  }

  openEditSupplierModal(supplier: any) {
    this.selectedSupplier = supplier;
    this.supplierForm.patchValue({
      name: supplier.name,
      email: supplier.email,
      contact: supplier.contact,
      address: supplier.address,
      description: supplier.description
    });
    this.showSupplierModal = true;
  }

  closeSupplierModal() {
    this.showSupplierModal = false;
    this.selectedSupplier = null;
    this.supplierForm.reset();
  }

  addSupplier() {
    if (this.supplierForm.valid) {
      // TODO: Implement API call to add supplier
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier added successfully' });
      this.closeSupplierModal();
    }
  }

  editSupplier() {
    if (this.supplierForm.valid) {
      // TODO: Implement API call to edit supplier
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier updated successfully' });
      this.closeSupplierModal();
    }
  }

  confirmDeleteSupplier(event: Event, supplierId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this supplier?',
      accept: () => {
        // TODO: Implement API call to delete supplier
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier deleted successfully' });
      }
    });
  }
}