
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { v4 as uuidv4 } from 'uuid';
import { PPMP, PPMPProject, PPMPItem, PPMPSchedule } from 'src/app/schema/schema';

// PrimeNG Imports
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { UserService, User } from 'src/app/services/user.service';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBar } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';

interface PPMPWithDetails extends PPMP {
  project?: PPMPProject;
  items?: PPMPItem[];
  schedules?: PPMPSchedule[];
}

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
    MultiSelectModule,
    TextareaModule,
    CheckboxModule,
    TooltipModule,
    ConfirmDialogModule,
    CardModule,
    FileUploadModule,
    ProgressBar,
    BadgeModule,
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
  filteredPpmps: PPMPWithDetails[] = [];
  ppmps: PPMPWithDetails[] = [];
  itemClassificationOptions: any[] = [];
  ppmpDocumentDialog: boolean = false;
  selectedPpmp?: PPMPWithDetails;



  get items() {
    return this.ppmpForm.get('items') as FormArray;
  }

   initializeDummyData() {
  this.ppmps = [
    // Single Classification: Goods
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
        classifications: ['goods'],
        project_description: 'Procurement of new laboratory equipment for Science Department',
        contract_scope: 'Supply and delivery of high-precision laboratory equipment for research purposes.',
        funding_source_id: 'gaa',
        abc: 750000
      },
      items: [
        {
          id: 'ITEM-2024-001',
          ppmp_project_id: 'PROJ-2024-001',
          technical_specification: 'High-precision microscopes with digital imaging capability',
          quantity_required: 5,
          unit_of_measurement: 'units',
          estimated_unit_cost: 150000,
          estimated_total_cost: 750000,
          classification: 'goods'
        }
      ]
    },
    // Single Classification: Infrastructure
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
        classifications: ['infrastructure'],
        project_description: 'Renovation of administrative office spaces',
        contract_scope: 'Complete renovation of 200 square meters of office space including installation of new flooring, painting, and procurement of office furniture.',
        funding_source_id: 'income',
        abc: 500000
      },
      items: [
        {
          id: 'ITEM-2024-002',
          ppmp_project_id: 'PROJ-2024-002',
          technical_specification: 'Complete renovation package including furniture and fixtures',
          quantity_required: 1,
          unit_of_measurement: 'lot',
          estimated_unit_cost: 500000,
          estimated_total_cost: 500000,
          classification: 'infrastructure'
        }
      ]
    },
    // Single Classification: Goods
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
        classifications: ['goods'],
        project_description: 'Upgrade of campus-wide IT network infrastructure',
        contract_scope: 'Procurement and installation of enterprise-grade network switches and routers.',
        funding_source_id: 'gaa',
        abc: 2000000
      },
      items: [
        {
          id: 'ITEM-2025-001',
          ppmp_project_id: 'PROJ-2025-001',
          technical_specification: 'Enterprise-grade network switches and routers',
          quantity_required: 10,
          unit_of_measurement: 'sets',
          estimated_unit_cost: 200000,
          estimated_total_cost: 2000000,
          classification: 'goods'
        }
      ]
    },
    // Single Classification: Consulting
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
        classifications: ['consulting'],
        project_description: 'Development of research programs and methodologies',
        contract_scope: 'Engagement of a consultancy firm to design and implement comprehensive research programs including training sessions for staff.',
        funding_source_id: 'trust_fund',
        abc: 1500000
      },
      items: [
        {
          id: 'ITEM-2025-002',
          ppmp_project_id: 'PROJ-2025-002',
          technical_specification: 'Comprehensive research program development consultancy',
          quantity_required: 1,
          unit_of_measurement: 'service',
          estimated_unit_cost: 1500000,
          estimated_total_cost: 1500000,
          classification: 'consulting'
        }
      ]
    },
    // Multiple Classification: Infrastructure & Goods
    {
      id: '5',
      office_id: 2,
      fiscal_year: 2025,
      app_id: 'APP-2025-003',
      approvals_id: 'APR-2025-003',
      current_approver_id: '2',
      project: {
        id: 'PROJ-2025-003',
        ppmp_id: '5',
        procurement_mode_id: 'public_bidding',
        prepared_by: 'Maria Garcia',
        project_title: 'School Modernization Program 2025',
        project_code: 'SMP-2025-001',
        classifications: ['infrastructure', 'goods'],
        project_description: 'Upgrading school facilities and providing new educational equipment.',
        contract_scope: 'Renovation of classrooms, procurement of educational technology, and professional development for teachers.',
        funding_source_id: 'gaa',
        abc: 2500000
      },
      items: [
        {
          id: 'ITEM-2025-003',
          ppmp_project_id: 'PROJ-2025-003',
          technical_specification: 'Classroom Renovation (10 rooms)',
          quantity_required: 1,
          unit_of_measurement: 'lot',
          estimated_unit_cost: 2000000,
          estimated_total_cost: 2000000,
          classification: 'infrastructure'
        },
        {
          id: 'ITEM-2025-004',
          ppmp_project_id: 'PROJ-2025-003',
          technical_specification: 'Educational Tablets (Android, 10-inch)',
          quantity_required: 50,
          unit_of_measurement: 'units',
          estimated_unit_cost: 10000,
          estimated_total_cost: 500000,
          classification: 'goods'
        }
      ]
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
    this.currentUser = this.userService.getUser();
    
    for (let year = 2000; year <= 2050; year++) {
      this.years.push({ label: year.toString(), value: year });
    }

    this.selectedYear = new Date().getFullYear();
    this.initializeDummyData();
  }

  ngOnInit(): void {
    this.initializeForm();
      this.getAvailableYears();

    this.filterByYear();
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
      office_id: [this.currentUser.officeId],
      fiscal_year: [this.selectedYear],
      app_id: [''],
      approvals_id: [uuidv4()],
      current_approver_id: [''],

      // PPMP Project Info
      project: this.formBuilder.group({
        id: [uuidv4()],
        ppmp_id: [''],
        procurement_mode_id: ['', [Validators.required]],
        prepared_by: [this.currentUser.fullname, [Validators.required]],
        project_title: ['', [Validators.required]],
        project_code: [''],
        classifications: [[], [Validators.required, Validators.minLength(1)]],
        project_description: ['', [Validators.required]],
        contract_scope: ['']
      }),

      // PPMP Items Array
      items: this.formBuilder.array([])
    });

    // Add initial item
    this.addItem();

    // Make prepared_by field readonly
    this.ppmpForm.get('project.prepared_by')?.disable();
    this.ppmpForm.get('project.classifications')?.valueChanges.subscribe((values: string[]) => {
    this.updateItemClassifications(values);
  });
  }

 updateItemClassifications(projectClassifications: string[]) {
  if (!projectClassifications) return;

  // If only one classification is selected, set it for all items
  if (projectClassifications.length === 1) {
    this.itemClassificationOptions = [{
      label: projectClassifications[0].charAt(0).toUpperCase() + projectClassifications[0].slice(1),
      value: projectClassifications[0]
    }];
    
    // Update all items to use this classification
    this.items.controls.forEach(item => {
      item.patchValue({
        classification: projectClassifications[0]
      });
      item.get('classification')?.disable();
    });
  } else {
    // Multiple classifications selected, allow choice from selected ones
    this.itemClassificationOptions = projectClassifications.map(c => ({
      label: c.charAt(0).toUpperCase() + c.slice(1),
      value: c
    }));
    
    // Enable classification selection for all items
    this.items.controls.forEach(item => {
      item.get('classification')?.enable();
    });
  }
}

  
  
  

createItemFormGroup(): FormGroup {
  return this.formBuilder.group({
    id: [uuidv4()],
    ppmp_project_id: [''],
    technical_specification: [''],
    scope_of_work: [''],
    terms_of_reference: [''],
    classification: ['', [Validators.required]],
    quantity_required: [1, [Validators.required, Validators.min(1)]],
    unit_of_measurement: ['', [Validators.required]],
    estimated_unit_cost: [0, [Validators.required, Validators.min(0)]],
    estimated_total_cost: [{ value: 0, disabled: true }]
  });
}

  addItem(): void {
    const itemForm = this.createItemFormGroup();
    this.items.push(itemForm);
    
    // Subscribe to changes for total calculation
    itemForm.get('quantity_required')?.valueChanges.subscribe(() => this.calculateItemTotal(this.items.length - 1));
    itemForm.get('estimated_unit_cost')?.valueChanges.subscribe(() => this.calculateItemTotal(this.items.length - 1));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  calculateItemTotal(index: number): void {
    const itemGroup = this.items.at(index);
    const quantity = itemGroup.get('quantity_required')?.value || 0;
    const unitCost = itemGroup.get('estimated_unit_cost')?.value || 0;
    const total = quantity * unitCost;
    itemGroup.patchValue({ estimated_total_cost: total }, { emitEvent: false });
  }

  filterByYear() {
    if (this.selectedYear) {
      this.filteredPpmps = this.ppmps.filter(ppmp => 
        ppmp.fiscal_year === this.selectedYear
      );
    } else {
      this.filteredPpmps = [...this.ppmps];
    }
  }

  getAvailableYears() {
  // Get unique years from actual PPMP data
  const uniqueYears = [...new Set(this.ppmps.map(ppmp => ppmp.fiscal_year))];
  
  // Sort years in descending order
  uniqueYears.sort((a, b) => b - a);
  
  // Create dropdown options
  this.years = uniqueYears.map(year => ({
    label: year.toString(),
    value: year
  }));

  // Set default to current year if available, otherwise first year in list
  const currentYear = new Date().getFullYear();
  this.selectedYear = uniqueYears.includes(currentYear) ? currentYear : uniqueYears[0];
  }
  
  editPpmp(ppmp: PPMPWithDetails): void {
    this.isEditMode = true;
    this.currentEditId = ppmp.id;
    
    // Clear existing items
    while (this.items.length !== 0) {
      this.items.removeAt(0);
    }

    // Set form values
    this.ppmpForm.patchValue({
      id: ppmp.id,
      office_id: ppmp.office_id,
      fiscal_year: ppmp.fiscal_year,
      app_id: ppmp.app_id,
      approvals_id: ppmp.approvals_id,
      current_approver_id: ppmp.current_approver_id,
      project: ppmp.project
    });

    // Add items
    ppmp.items?.forEach(item => {
      const itemForm = this.createItemFormGroup();
      itemForm.patchValue(item);
      this.items.push(itemForm);
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
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please check all required fields'
      });
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
          ...formValue.project,
          ppmp_id: formValue.id
        },
        items: formValue.items.map((item: any) => ({
          ...item,
          ppmp_project_id: formValue.project.id
        }))
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
        this.filterByYear();
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
    
    // Clear items array
    while (this.items.length !==.0) {
      this.items.removeAt(0);
    }
    
    // Add one empty item
    this.addItem();
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

  openNewPpmpDialog(): void {
  this.isEditMode = false;
  this.currentEditId = null;
  this.submitted = false;

  // Reset the form
  this.initializeForm();

  // Clear items array
  while (this.items.length !== 0) {
    this.items.removeAt(0);
  }
  
  // Add one empty item
  this.addItem();

  // Show the dialog
  this.ppmpDialog = true;
  }
  
  calculateTotalEstimatedCost(ppmp: PPMPWithDetails): number {
  return ppmp.items?.reduce((total, item) => total + (item.estimated_total_cost || 0), 0) || 0;
  }
  
  viewPpmpDocument(ppmp: PPMPWithDetails) {
  this.selectedPpmp = ppmp;
  this.ppmpDocumentDialog = true;
  }
  
  // upload

  
 totalSize: string = '0';
totalSizePercent: number = 0;

formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

onSelectedFiles(event: any) {
  const files = event.files;
  let size = 0;
  for (const file of files) {
    size += file.size;
  }
  this.totalSize = this.formatSize(size);
  this.totalSizePercent = (size / 1000000) * 100; // 1MB = 1000000B
}

uploadEvent(uploadCallback: Function) {
  uploadCallback();
  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Files Uploaded' });
}

choose(event: any, chooseCallback: Function) {
  chooseCallback();
}

onTemplatedUpload() {
  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File Uploaded' });
}

onRemoveTemplatingFile(event: any, file: any, removeCallback: Function, index: number) {
  removeCallback(index);
}

removeUploadedFileCallback(index: number) {
  this.messageService.add({ severity: 'info', summary: 'Removed', detail: 'File removed from uploaded list' });
}

}