// ppmp.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { v4 as uuidv4 } from 'uuid';
import { PPMP, PPMPItem, PPMPSchedule } from 'src/app/schema/schema';

@Component({
  selector: 'app-ppmp',
  templateUrl: './ppmp.component.html',
  styleUrls: ['./ppmp.component.scss'],
  providers: [MessageService, ConfirmationService],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    ButtonModule,
    TableModule,
    InputNumberModule,
    InputTextModule,
    
    CheckboxModule,
    TooltipModule,
    ConfirmDialogModule,
    CardModule
  ]
})
export class PpmpComponent implements OnInit {
  ppmps: PPMP[] = [];
  ppmpForm!: FormGroup;
  ppmpDialog = false;
  submitted = false;
  loading = false;
  isEditMode = false;
  selectedYear = new Date().getFullYear();
  currentEditId: string | null = null;

  procurementMethods = [
    { label: 'Public Bidding', value: 'Public Bidding' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Negotiated Procurement', value: 'Negotiated Procurement' },
    { label: 'Direct Contracting', value: 'Direct Contracting' }
  ];

  months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.ppmpForm = this.formBuilder.group({
      id: [uuidv4()],
      department_id: [1],
      office_id: [1],
      fiscal_year: [this.selectedYear],
      prepared_by: ['User'],
      project_title: ['', [Validators.required]],
      project_code: [''],
      procurement_method: ['', [Validators.required]],
      item_description: ['', [Validators.required]],
      technical_specification: ['', [Validators.required]],
      unit_of_measurement: ['', [Validators.required]],
      quantity_required: [1, [Validators.required, Validators.min(1)]],
      estimated_unit_cost: [0, [Validators.required, Validators.min(0)]],
      estimated_total_cost: [{ value: 0, disabled: true }],
      start_month: [null, Validators.required],
      end_month: [null, Validators.required]
    });

    // Subscribe to quantity and unit cost changes for auto-calculation
    this.ppmpForm.get('quantity_required')?.valueChanges.subscribe(() => this.calculateTotal());
    this.ppmpForm.get('estimated_unit_cost')?.valueChanges.subscribe(() => this.calculateTotal());

    // Add validator for end month
    this.ppmpForm.get('end_month')?.valueChanges.subscribe(value => {
      const startMonth = this.ppmpForm.get('start_month')?.value;
      if (startMonth && value < startMonth) {
        this.ppmpForm.get('end_month')?.setErrors({ invalidRange: true });
      }
    });
  }

  calculateTotal(): void {
    const quantity = this.ppmpForm.get('quantity_required')?.value || 0;
    const unitCost = this.ppmpForm.get('estimated_unit_cost')?.value || 0;
    const total = quantity * unitCost;
    this.ppmpForm.patchValue({ estimated_total_cost: total }, { emitEvent: false });
  }

  getFilteredEndMonths() {
    const startMonth = this.ppmpForm.get('start_month')?.value;
    return this.months.filter(month => !startMonth || month.value >= startMonth);
  }

  openNewPpmpDialog(): void {
    this.isEditMode = false;
    this.currentEditId = null;
    this.submitted = false;
    this.initializeForm();
    this.ppmpDialog = true;
  }

  editPpmp(ppmp: PPMP): void {
    this.isEditMode = true;
    this.currentEditId = ppmp.id;
    const item = ppmp.items[0];
    
    this.ppmpForm.patchValue({
      id: ppmp.id,
      department_id: ppmp.department_id,
      office_id: ppmp.office_id,
      fiscal_year: ppmp.fiscal_year,
      prepared_by: ppmp.prepared_by,
      project_title: item.project_title,
      project_code: item.project_code,
      procurement_method: item.procurement_method,
      item_description: item.item_description,
      technical_specification: item.technical_specification,
      unit_of_measurement: item.unit_of_measurement,
      quantity_required: item.quantity_required,
      estimated_unit_cost: item.estimated_unit_cost,
      estimated_total_cost: item.estimated_total_cost
    });
    
    this.ppmpDialog = true;
  }

  savePpmp(): void {
    this.submitted = true;

    if (this.ppmpForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please check all required fields and try again.'
      });
      return;
    }

    try {
      const formValue = this.ppmpForm.getRawValue();
      
      // Create schedule array from start and end month
      const schedule: PPMPSchedule[] = [];
      const startMonth = formValue.start_month;
      const endMonth = formValue.end_month;
      
      for (let i = 1; i <= 12; i++) {
        schedule.push({
          month: this.months[i-1].label,
          milestone: i >= startMonth && i <= endMonth
        });
      }

      // Create PPMPItem
      const ppmpItem: PPMPItem = {
        id: uuidv4(),
        project_title: formValue.project_title,
        project_code: formValue.project_code,
        procurement_method: formValue.procurement_method,
        item_description: formValue.item_description,
        technical_specification: formValue.technical_specification,
        unit_of_measurement: formValue.unit_of_measurement,
        quantity_required: formValue.quantity_required,
        estimated_unit_cost: formValue.estimated_unit_cost,
        estimated_total_cost: formValue.estimated_total_cost,
        schedule: schedule,
      };

      // Create PPMP
      const ppmpData: PPMP = {
        id: this.isEditMode ? this.currentEditId! : uuidv4(),
        department_id: formValue.department_id,
        office_id: formValue.office_id,
        fiscal_year: formValue.fiscal_year,
        prepared_by: formValue.prepared_by,
        approval_status: 'Pending',
        current_approval_stage: 'Initial',
        items: [ppmpItem]
      };

      if (this.isEditMode && this.currentEditId) {
        this.ppmps = this.ppmps.map(p => p.id === this.currentEditId ? ppmpData : p);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'PPMP updated successfully'
        });
      } else {
        this.ppmps.push(ppmpData);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'PPMP created successfully'
        });
      }

      this.hideDialog();
    } catch (error) {
      console.error('Error saving PPMP:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while saving'
      });
    } finally {
      this.loading = false;
    }
  }

  deletePpmp(ppmp: PPMP): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this PPMP?',
      accept: () => {
        this.ppmps = this.ppmps.filter(p => p.id !== ppmp.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'PPMP deleted successfully'
        });
      }
    });
  }

  hideDialog(): void {
    this.ppmpDialog = false;
    this.submitted = false;
    this.ppmpForm.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.ppmpForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched || this.submitted)) : false;
  }
}