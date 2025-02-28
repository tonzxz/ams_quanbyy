import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FundSource } from 'src/app/schema/schema';
import { finalize } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-funding-source',
  templateUrl: './funding-source.component.html',
  providers: [MessageService, ConfirmationService],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ButtonModule,
    ConfirmDialog
  ],
})
export class FundingSourceComponent implements OnInit {
  fundSources: FundSource[] = [];
  fundSourceForm!: FormGroup;
  fundSourceDialog = false;
  submitted = false;
  loading = false;
  isEditMode = false;
  currentFundSourceId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadFundSources();
  }

  initializeForm(): void {
    this.fundSourceForm = this.formBuilder.group({
      source_name: ['', Validators.required],
      budget_id: ['', Validators.required]
    });
  }

  loadFundSources(): void {
    this.loading = true;
    setTimeout(() => {
      const storedSources = JSON.parse(localStorage.getItem('fundSources') || '[]');
      if (storedSources.length === 0) {
        this.fundSources = [
          { id: this.generateId(), source_name: 'General Appropriations Act (GAA)', budget_id: this.generateId() },
          { id: this.generateId(), source_name: 'Special Purpose Funds (SPF)', budget_id: this.generateId() },
          { id: this.generateId(), source_name: 'Local Government Support Fund (LGSF)', budget_id: this.generateId() },
          { id: this.generateId(), source_name: 'Government-Owned and Controlled Corporations (GOCC)', budget_id: this.generateId() },
          { id: this.generateId(), source_name: 'Official Development Assistance (ODA)', budget_id: this.generateId() },
          { id: this.generateId(), source_name: 'Public-Private Partnership (PPP)', budget_id: this.generateId() },
          { id: this.generateId(), source_name: 'Trust Funds', budget_id: this.generateId() }
        ];
        localStorage.setItem('fundSources', JSON.stringify(this.fundSources));
      } else {
        this.fundSources = storedSources;
      }
      this.loading = false;
    }, 500);
  }

  openNewFundSourceDialog(): void {
    this.fundSourceForm.reset();
    this.isEditMode = false;
    this.currentFundSourceId = null;
    this.fundSourceDialog = true;
  }

  saveFundSource(): void {
    this.submitted = true;
    if (this.fundSourceForm.invalid) return;

    const formValue = this.fundSourceForm.value;
    const fundSourceData: FundSource = {
      id: this.isEditMode && this.currentFundSourceId ? this.currentFundSourceId : this.generateId(),
      source_name: formValue.source_name,
      budget_id: formValue.budget_id
    };

    this.loading = true;
    setTimeout(() => {
      let storedSources = JSON.parse(localStorage.getItem('fundSources') || '[]');
      if (this.isEditMode && this.currentFundSourceId) {
        storedSources = storedSources.map((fs: FundSource) =>
          fs.id === this.currentFundSourceId ? fundSourceData : fs
        );
      } else {
        storedSources.push(fundSourceData);
      }
      localStorage.setItem('fundSources', JSON.stringify(storedSources));
      this.loadFundSources();
      this.hideDialog();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Fund Source saved successfully',
      });
      this.loading = false;
    }, 500);
  }

  editFundSource(fundSource: FundSource): void {
    this.currentFundSourceId = fundSource.id;
    this.fundSourceForm.patchValue({
      source_name: fundSource.source_name,
      budget_id: fundSource.budget_id,
    });
    this.isEditMode = true;
    this.fundSourceDialog = true;
  }

  deleteFundSource(fundSource: FundSource): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this fund source?',
      accept: () => {
        this.loading = true;
        setTimeout(() => {
          let storedSources = JSON.parse(localStorage.getItem('fundSources') || '[]');
          storedSources = storedSources.filter((fs: FundSource) => fs.id !== fundSource.id);
          localStorage.setItem('fundSources', JSON.stringify(storedSources));
          this.loadFundSources();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Fund Source deleted successfully',
          });
          this.loading = false;
        }, 500);
      },
    });
  }

  hideDialog(): void {
    this.fundSourceDialog = false;
    this.submitted = false;
    this.currentFundSourceId = null;
  }

  generateId(): string {
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
}
