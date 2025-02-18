interface PPMPWithDetails extends PPMP {
  project?: PPMPProject;
  item?: PPMPItem;
}

// ppmp.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { v4 as uuidv4 } from 'uuid';
import { PPMP, PPMPProject, PPMPItem } from 'src/app/schema/schema';

// PrimeNG Imports
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
import { TextareaModule } from 'primeng/textarea';
import { UserService, User } from 'src/app/services/user.service';


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
    // PrimeNG Modules
    DropdownModule,
    DialogModule,
    ToastModule,
    ButtonModule,
    TableModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
    TooltipModule,
    ConfirmDialogModule,
    CardModule
  ]
})
export class PpmpComponent implements OnInit {
  ppmpForm!: FormGroup;
  ppmpDialog = false;
  submitted = false;
  loading = false;
  isEditMode = false;
  selectedYear = new Date().getFullYear();
  currentEditId: string | null = null;
  currentUser?: User;
  years: any[] = [];
  filteredPpmps: PPMP[] = [];
  ppmps: PPMPWithDetails[] = [];

  initializeDummyData() {
    this.ppmps = [
      {
        id: '1',
        office_id: 1,
        fiscal_year: 2024,
        app_id: 'APP-2024-001',
        approvals_id: 'APR-2024-001',
        current_approver_id: '1',
        project: {
          id: 'PROJ-2024-001',
          ppmp_id: '1',
          procurement_mode_id: 'public_bidding',
          prepared_by: 'John Doe',
          project_title: 'Laboratory Equipment Procurement 2024',
          project_code: 'LE-2024-001',
          classification: 'goods',
          project_description: 'Procurement of new laboratory equipment for Science Department',
          funding_source_id: 'gaa'
        },
        item: {
          id: 'ITEM-2024-001',
          ppmp_project_id: 'PROJ-2024-001',
          technical_specification: 'High-precision microscopes with digital imaging capability',
          quantity_required: 5,
          unit_of_measurement: 'units',
          estimated_unit_cost: 150000,
          estimated_total_cost: 750000
        }
      },
      {
        id: '2',
        office_id: 1,
        fiscal_year: 2024,
        app_id: 'APP-2024-002',
        approvals_id: 'APR-2024-002',
        current_approver_id: '1',
        project: {
          id: 'PROJ-2024-002',
          ppmp_id: '2',
          procurement_mode_id: 'shopping',
          prepared_by: 'Jane Smith',
          project_title: 'Office Renovation Project 2024',
          project_code: 'ORP-2024-001',
          classification: 'infrastructure',
          project_description: 'Renovation of administrative office spaces',
          funding_source_id: 'income'
        },
        item: {
          id: 'ITEM-2024-002',
          ppmp_project_id: 'PROJ-2024-002',
          technical_specification: 'Complete renovation package including furniture and fixtures',
          quantity_required: 1,
          unit_of_measurement: 'lot',
          estimated_unit_cost: 500000,
          estimated_total_cost: 500000
        }
      },
      {
        id: '3',
        office_id: 1,
        fiscal_year: 2025,
        app_id: 'APP-2025-001',
        approvals_id: 'APR-2025-001',
        current_approver_id: '1',
        project: {
          id: 'PROJ-2025-001',
          ppmp_id: '3',
          procurement_mode_id: 'limited_source_bidding',
          prepared_by: 'Alice Johnson',
          project_title: 'IT Infrastructure Upgrade 2025',
          project_code: 'IT-2025-001',
          classification: 'goods',
          project_description: 'Upgrade of campus-wide IT network infrastructure',
          funding_source_id: 'gaa'
        },
        item: {
          id: 'ITEM-2025-001',
          ppmp_project_id: 'PROJ-2025-001',
          technical_specification: 'Enterprise-grade network switches and routers',
          quantity_required: 10,
          unit_of_measurement: 'sets',
          estimated_unit_cost: 200000,
          estimated_total_cost: 2000000
        }
      },
      {
        id: '4',
        office_id: 1,
        fiscal_year: 2025,
        app_id: 'APP-2025-002',
        approvals_id: 'APR-2025-002',
        current_approver_id: '1',
        project: {
          id: 'PROJ-2025-002',
          ppmp_id: '4',
          procurement_mode_id: 'negotiated_procurement',
          prepared_by: 'Robert Wilson',
          project_title: 'Research Program Development 2025',
          project_code: 'RPD-2025-001',
          classification: 'consulting',
          project_description: 'Development of research programs and methodologies',
          funding_source_id: 'trust_fund'
        },
        item: {
          id: 'ITEM-2025-002',
          ppmp_project_id: 'PROJ-2025-002',
          technical_specification: 'Comprehensive research program development consultancy',
          quantity_required: 1,
          unit_of_measurement: 'service',
          estimated_unit_cost: 1500000,
          estimated_total_cost: 1500000
        }
      }
    ];

    this.filterByYear();
  }

  procurementModes = [
    { label: 'Public Bidding', value: 'public_bidding' },
    { label: 'Limited Source Bidding', value: 'limited_source_bidding' },
    { label: 'Direct Contracting', value: 'direct_contracting' },
    { label: 'Repeat Order', value: 'repeat_order' },
    { label: 'Shopping', value: 'shopping' },
    { label: 'Negotiated Procurement', value: 'negotiated_procurement' }
  ];

  classifications = [
    { label: 'Goods', value: 'goods' },
    { label: 'Infrastructure', value: 'infrastructure' },
    { label: 'Consulting', value: 'consulting' }
  ];

  fundingSources = [
    { label: 'GAA', value: 'gaa' },
    { label: 'Income', value: 'income' },
    { label: 'Trust Fund', value: 'trust_fund' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService
  ) {
    // Get current user
    this.currentUser = this.userService.getUser();
    if (!this.currentUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No user logged in'
      });
    }

    for (let year = 2000; year <= 2050; year++) {
      this.years.push({ label: year.toString(), value: year });
    }

    this.selectedYear = new Date().getFullYear();

    this.initializeDummyData();

  }

  ngOnInit(): void {
    this.initializeForm();
    this.filterByYear(); 

  }

   filterByYear() {
    if (this.selectedYear) {
      this.filteredPpmps = this.ppmps.filter(ppmp => 
        ppmp.fiscal_year === this.selectedYear
      );
    } else {
      this.filteredPpmps = [...this.ppmps]; // Show all if no year selected
    }
  }

  initializeForm(): void {
    if (!this.currentUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please log in to create a PPMP'
      });
      return;
    }

    this.ppmpForm = this.formBuilder.group({
      // PPMP Base Info
      id: [uuidv4()],
      office_id: [this.currentUser.officeId], // Set from current user
      fiscal_year: [this.selectedYear],
      app_id: [''],
      approvals_id: [uuidv4()],
      current_approver_id: [''],

      // PPMP Project Info
      project: this.formBuilder.group({
        id: [uuidv4()],
        ppmp_id: [''],
        procurement_mode_id: ['', [Validators.required]],
        prepared_by: [this.currentUser.fullname, [Validators.required]], // Set from current user
        project_title: ['', [Validators.required]],
        project_code: [''],
        classification: ['', [Validators.required]],
        project_description: ['', [Validators.required]],
        funding_source_id: ['', [Validators.required]]
      }),

      // PPMP Item Info
      item: this.formBuilder.group({
        id: [uuidv4()],
        ppmp_project_id: [''],
        technical_specification: ['', [Validators.required]],
        quantity_required: [1, [Validators.required, Validators.min(1)]],
        unit_of_measurement: ['', [Validators.required]],
        estimated_unit_cost: [0, [Validators.required, Validators.min(0)]],
        estimated_total_cost: [{ value: 0, disabled: true }]
      })
    });

    // Make prepared_by field readonly since it's set from logged-in user
    this.ppmpForm.get('project.prepared_by')?.disable();

    // Subscribe to quantity and unit cost changes for auto-calculation
    const itemGroup = this.ppmpForm.get('item');
    itemGroup?.get('quantity_required')?.valueChanges.subscribe(() => this.calculateTotal());
    itemGroup?.get('estimated_unit_cost')?.valueChanges.subscribe(() => this.calculateTotal());
  }

  calculateTotal(): void {
    const itemGroup = this.ppmpForm.get('item');
    const quantity = itemGroup?.get('quantity_required')?.value || 0;
    const unitCost = itemGroup?.get('estimated_unit_cost')?.value || 0;
    const total = quantity * unitCost;
    itemGroup?.patchValue({ estimated_total_cost: total }, { emitEvent: false });
  }

  openNewPpmpDialog(): void {
    this.isEditMode = false;
    this.currentEditId = null;
    this.submitted = false;
    this.initializeForm();
    this.ppmpDialog = true;
  }

 editPpmp(ppmp: PPMPWithDetails): void {
    this.isEditMode = true;
    this.currentEditId = ppmp.id;
    
    this.ppmpForm.patchValue({
      id: ppmp.id,
      office_id: ppmp.office_id,
      fiscal_year: ppmp.fiscal_year,
      app_id: ppmp.app_id,
      approvals_id: ppmp.approvals_id,
      current_approver_id: ppmp.current_approver_id,
      project: ppmp.project,
      item: ppmp.item
    });
    
    this.ppmpDialog = true;
  }

 savePpmp(): void {
    this.submitted = true;

    if (!this.currentUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'You must be logged in to save a PPMP'
      });
      return;
    }

    if (this.ppmpForm.invalid) {
      // ... existing validation logic
      return;
    }

    try {
      this.loading = true;
      const formValue = this.ppmpForm.getRawValue();
      
      // Create PPMP with nested data
      const ppmpData: PPMPWithDetails = {
        id: this.isEditMode ? this.currentEditId! : formValue.id,
        office_id: formValue.office_id,
        fiscal_year: formValue.fiscal_year,
        app_id: formValue.app_id || undefined,
        approvals_id: formValue.approvals_id,
        current_approver_id: formValue.current_approver_id,
        project: {
          id: formValue.project.id,
          ppmp_id: formValue.id,
          procurement_mode_id: formValue.project.procurement_mode_id,
          prepared_by: formValue.project.prepared_by,
          project_title: formValue.project.project_title,
          project_code: formValue.project.project_code || '',
          classification: formValue.project.classification,
          project_description: formValue.project.project_description,
          funding_source_id: formValue.project.funding_source_id
        },
        item: {
          id: formValue.item.id,
          ppmp_project_id: formValue.project.id,
          technical_specification: formValue.item.technical_specification,
          quantity_required: formValue.item.quantity_required,
          unit_of_measurement: formValue.item.unit_of_measurement,
          estimated_unit_cost: formValue.item.estimated_unit_cost,
          estimated_total_cost: formValue.item.estimated_total_cost
        }
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

      this.filterByYear();
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
        this.filterByYear(); // Refresh filtered list
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

   getClassificationClass(classification?: string): string {
    switch (classification) {
      case 'goods':
        return 'bg-blue-100 text-blue-800';
      case 'infrastructure':
        return 'bg-green-100 text-green-800';
      case 'consulting':
        return 'bg-purple-100 text-purple-800';
      default:
        return '';
    }
  }

  getProcurementModeLabel(modeId?: string): string {
    const mode = this.procurementModes.find(m => m.value === modeId);
    return mode ? mode.label : '';
  }

}