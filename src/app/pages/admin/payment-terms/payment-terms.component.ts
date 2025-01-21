// src/app/components/payment-terms/payment-terms.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MaterialModule } from 'src/app/material.module';
import { PaymentTermsService, PaymentTerm } from 'src/app/services/payment-terms.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-payment-terms',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    InputSwitchModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './payment-terms.component.html',
  providers: [MessageService, ConfirmationService]
})
export class PaymentTermsComponent implements OnInit {
  terms: PaymentTerm[] = [];
  termDialog = false;
  termForm!: FormGroup;
  submitted = false;
  loading = false;
  isEditMode = false;
  currentTermId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private paymentTermsService: PaymentTermsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTerms();
  }

  initializeForm(): void {
    this.termForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(1)]],
      name: ['', Validators.required],
      description: ['', Validators.required],
      days: [0, [Validators.required, Validators.min(0)]],
      percentageRequired: [100, [Validators.required, Validators.min(0), Validators.max(100)]],
      isActive: [true]
    });
  }

  loadTerms(): void {
    this.loading = true;
    this.paymentTermsService.getAllTerms()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (terms) => {
          this.terms = terms;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load payment terms'
          });
        }
      });
  }

  openNewTermDialog(): void {
    this.termForm.reset({ isActive: true, days: 0, percentageRequired: 100 });
    this.isEditMode = false;
    this.termDialog = true;
  }

  editTerm(term: PaymentTerm): void {
    this.termForm.patchValue({
      code: term.code,
      name: term.name,
      description: term.description,
      days: term.days,
      percentageRequired: term.percentageRequired,
      isActive: term.isActive
    });
    this.isEditMode = true;
    this.currentTermId = term.id || null;
    this.termDialog = true;
  }

  deleteTerm(term: PaymentTerm): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this payment term?',
      accept: () => {
        this.loading = true;
        this.paymentTermsService.deleteTerm(term.id!)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Payment term deleted successfully'
              });
              this.loadTerms();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to delete payment term'
              });
            }
          });
      }
    });
  }

  saveTerm(): void {
    this.submitted = true;

    if (this.termForm.invalid) {
      return;
    }

    const formValue = this.termForm.value;
    
    if (this.isEditMode && this.currentTermId) {
      this.paymentTermsService.updateTerm(this.currentTermId, formValue)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Payment term updated successfully'
            });
            this.loadTerms();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to update payment term'
            });
          }
        });
    } else {
      this.paymentTermsService.addTerm(formValue)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Payment term created successfully'
            });
            this.loadTerms();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to create payment term'
            });
          }
        });
    }
  }

  hideDialog(): void {
    this.termDialog = false;
    this.submitted = false;
    this.termForm.reset();
  }
}