
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { v4 as uuidv4 } from 'uuid';
import { PPMP, PPMPProject, PPMPItem, PPMPSchedule, ProcurementMode, ProcurementProcess } from 'src/app/schema/schema';
import html2canvas from 'html2canvas';


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
import { DatePickerModule } from 'primeng/datepicker';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { CrudService } from 'src/app/services/crud.service';

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
    DatePickerModule
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
   selectedClassifications: string[] = [];
  selectedProcurementMode: string[] = [];
  selectedPpmps: PPMPWithDetails[] = [];
  isDocumentView: boolean = false; // Default is system view
  animationClass: string;
  private uploadedFiles: Map<number, File[]> = new Map();


  get items() {
    return this.ppmpForm.get('items') as FormArray;
  }

  async initializeData() {
    this.ppmps = [
      // Single Classification: Goods
      {
        id: '1',
        office_id: 1,
        app_id: 'APP-2026-001',
        approvals_id: 'APR-2026-001',
        current_approver_id: '1',
        project: {
          id: 'PROJ-2026-001',
          ppmp_id: '1',
          procurement_mode_id: 'public_bidding',
          prepared_by: 'John Doe',
          project_title: 'Laboratory Equipment Procurement 2026',
          project_code: 'LE-2026-001',
          classifications: ['goods'],
          project_description: 'Procurement of new laboratory equipment for Science Department',
          contract_scope: 'Supply and delivery of high-precision laboratory equipment for research purposes.',
          funding_source_id: 'gaa',
          abc: 750000,
                fiscal_year: 2026,

        },
        items: [
          {
            id: 'ITEM-2025-001',
            ppmp_project_id: 'PROJ-2025-001',
            technical_specification: 'High-precision microscopes with digital imaging capability',
            quantity_required: 5,
            unit_of_measurement: 'units',
            estimated_unit_cost: 150000,
            estimated_total_cost: 750000,
            classification: 'goods'
          }
        ],
        schedules: [
          { id: 'SCH-2025-001', ppmp_id: '1', quarter: 'q1', milestone: 'Bid Submission', date: new Date('2025-03-10') },
          { id: 'SCH-2025-002', ppmp_id: '1', quarter: 'q1', milestone: 'Delivery of Equipment', date: new Date('2025-06-20') }
        ]
      },
      // Single Classification: Infrastructure
      {
        id: '2',
        office_id: 1,
        app_id: 'APP-2025-002',
        approvals_id: 'APR-2025-002',
        current_approver_id: '1',
        project: {
          id: 'PROJ-2025-002',
          ppmp_id: '2',
          procurement_mode_id: 'shopping',
          prepared_by: 'Jane Smith',
          project_title: 'Office Renovation Project 2025',
          project_code: 'ORP-2025-001',
          classifications: ['infrastructure'],
          project_description: 'Renovation of administrative office spaces',
          contract_scope: 'Complete renovation of 200 square meters of office space including installation of new flooring, painting, and procurement of office furniture.',
          funding_source_id: 'income',
          abc: 500000,
                fiscal_year: 2025,

        },
        items: [
          {
            id: 'ITEM-2025-002',
            ppmp_project_id: 'PROJ-2025-002',
            technical_specification: 'Complete renovation package including furniture and fixtures',
            quantity_required: 1,
            unit_of_measurement: 'lot',
            estimated_unit_cost: 500000,
            estimated_total_cost: 500000,
            classification: 'infrastructure'
          }
        ],
        schedules: [
          { id: 'SCH-2025-003', ppmp_id: '2', quarter: 'q1', milestone: 'Start of Renovation', date: new Date('2025-05-01') },
          { id: 'SCH-2025-004', ppmp_id: '2', quarter: 'q1', milestone: 'Project Completion', date: new Date('2025-08-30') }
        ]
      },
      // Single Classification: Goods
      {
        id: '3',
        office_id: 1,
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
          abc: 2000000,
                fiscal_year: 2025,

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
        ],
        schedules: [
          { id: 'SCH-2025-001', ppmp_id: '3', quarter: 'q1', milestone: 'Supplier Selection', date: new Date('2025-02-15') },
          { id: 'SCH-2025-002', ppmp_id: '3', quarter: 'q1', milestone: 'Installation', date: new Date('2025-06-30') }
        ]
      },
      // Single Classification: Consulting
      {
        id: '4',
        office_id: 1,
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
          abc: 1500000,
                fiscal_year: 2025,

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
        ],
        schedules: [
          { id: 'SCH-2025-003', ppmp_id: '4', quarter: 'q1', milestone: 'Consultant Hiring', date: new Date('2025-03-20') },
          { id: 'SCH-2025-004', ppmp_id: '4', quarter: 'q1', milestone: 'Program Launch', date: new Date('2025-09-15') }
        ]
      },

  {
    id: '6',
    office_id: 3,
    app_id: 'APP-2025-004',
    approvals_id: 'APR-2025-004',
    current_approver_id: '3',
    project: {
      id: 'PROJ-2025-004',
      ppmp_id: '6',
      procurement_mode_id: 'public_bidding',
      prepared_by: 'Michael Cruz',
      project_title: 'Smart Campus Development',
      project_code: 'SCD-2025-001',
      classifications: ['infrastructure', 'goods', 'consulting'],
      project_description: 'Implementation of smart classroom technology, campus-wide networking, and AI-driven student monitoring.',
      contract_scope: 'Procurement of smart boards, networking equipment, and consultancy for AI integration.',
      funding_source_id: 'gaa',
      abc: 3000000,
        fiscal_year: 2025,

    },
    items: [
      {
        id: 'ITEM-2025-005',
        ppmp_project_id: 'PROJ-2025-004',
        technical_specification: 'Smart Interactive Boards with AI Integration',
        quantity_required: 15,
        unit_of_measurement: 'units',
        estimated_unit_cost: 50000,
        estimated_total_cost: 750000,
        classification: 'goods'
      },
      {
        id: 'ITEM-2025-006',
        ppmp_project_id: 'PROJ-2025-004',
        technical_specification: 'Campus-wide High-Speed Networking Upgrade',
        quantity_required: 1,
        unit_of_measurement: 'lot',
        estimated_unit_cost: 1500000,
        estimated_total_cost: 1500000,
        classification: 'infrastructure'
      },
      {
        id: 'ITEM-2025-007',
        ppmp_project_id: 'PROJ-2025-004',
        technical_specification: 'Consulting Services for AI-driven Student Monitoring',
        quantity_required: 1,
        unit_of_measurement: 'service',
        estimated_unit_cost: 750000,
        estimated_total_cost: 750000,
        classification: 'consulting'
      }
    ],
    schedules: [
      { id: 'SCH-2025-005', ppmp_id: '6', quarter: 'q1', milestone: 'Procurement Start', date: new Date('2025-02-10') },
      { id: 'SCH-2025-006', ppmp_id: '6', quarter: 'q1', milestone: 'Installation Phase', date: new Date('2025-05-01') },
      { id: 'SCH-2025-007', ppmp_id: '6', quarter: 'q1', milestone: 'Training & Implementation', date: new Date('2025-07-15') }
    ]
  },

  // Project 2: Hospital Modernization Program
  {
    id: '7',
    office_id: 4,
    app_id: 'APP-2025-005',
    approvals_id: 'APR-2025-005',
    current_approver_id: '4',
    project: {
      id: 'PROJ-2025-005',
      ppmp_id: '7',
      procurement_mode_id: 'direct_contracting',
      prepared_by: 'Sarah Mendoza',
      project_title: 'Hospital Modernization Program',
      project_code: 'HMP-2025-001',
      classifications: ['goods', 'infrastructure'],
      project_description: 'Upgrading hospital facilities and medical equipment for better patient care.',
      contract_scope: 'Procurement of MRI machines, hospital beds, and renovation of patient wards.',
      funding_source_id: 'trust_fund',
      abc: 5000000,
        fiscal_year: 2025,

    },
    items: [
      {
        id: 'ITEM-2025-008',
        ppmp_project_id: 'PROJ-2025-005',
        technical_specification: 'MRI Machines - High Precision',
        quantity_required: 3,
        unit_of_measurement: 'units',
        estimated_unit_cost: 1200000,
        estimated_total_cost: 3600000,
        classification: 'goods'
      },
      {
        id: 'ITEM-2025-009',
        ppmp_project_id: 'PROJ-2025-005',
        technical_specification: 'Renovation of Patient Wards',
        quantity_required: 1,
        unit_of_measurement: 'lot',
        estimated_unit_cost: 1400000,
        estimated_total_cost: 1400000,
        classification: 'infrastructure'
      }
    ],
    schedules: [
      { id: 'SCH-2025-008', ppmp_id: '7', quarter: 'q1', milestone: 'Supplier Selection', date: new Date('2025-03-05') },
      { id: 'SCH-2025-009', ppmp_id: '7', quarter: 'q1', milestone: 'Equipment Delivery', date: new Date('2025-06-20') },
      { id: 'SCH-2025-010', ppmp_id: '7', quarter: 'q1', milestone: 'Ward Renovation Completion', date: new Date('2025-09-15') }
    ]
  },

  // Project 3: Digital Library Expansion
  {
    id: '8',
    office_id: 5,
    app_id: 'APP-2025-001',
    approvals_id: 'APR-2025-001',
    current_approver_id: '5',
    project: {
      id: 'PROJ-2025-001',
      ppmp_id: '8',
      procurement_mode_id: 'limited_source_bidding',
      prepared_by: 'Robert Lee',
      project_title: 'Digital Library Expansion',
      project_code: 'DLE-2025-001',
      classifications: ['goods', 'consulting'],
      project_description: 'Expansion of digital library resources, including e-books and research databases.',
      contract_scope: 'Procurement of e-book licenses, research database access, and consultancy for AI-powered library recommendations.',
      funding_source_id: 'gaa',
      abc: 2000000,
        fiscal_year: 2025,

    },
    items: [
      {
        id: 'ITEM-2025-001',
        ppmp_project_id: 'PROJ-2025-001',
        technical_specification: 'E-book Licenses for Academic Use',
        quantity_required: 500,
        unit_of_measurement: 'licenses',
        estimated_unit_cost: 2000,
        estimated_total_cost: 1000000,
        classification: 'goods'
      },
      {
        id: 'ITEM-2025-002',
        ppmp_project_id: 'PROJ-2025-001',
        technical_specification: 'Consultancy for AI-powered Library Recommendations',
        quantity_required: 1,
        unit_of_measurement: 'service',
        estimated_unit_cost: 1000000,
        estimated_total_cost: 1000000,
        classification: 'consulting'
      }
    ],
    schedules: [
      { id: 'SCH-2025-001', ppmp_id: '8', quarter:'q1', milestone: 'License Procurement', date: new Date('2025-02-15') },
      { id: 'SCH-2025-002', ppmp_id: '8', quarter:'q1', milestone: 'Database Integration', date: new Date('2025-06-10') },
      { id: 'SCH-2025-003', ppmp_id: '8', quarter:'q1', milestone: 'AI System Implementation', date: new Date('2025-09-01') }
    ]
  },

  // Project 4: Smart Traffic Management System
  {
    id: '9',
    office_id: 6,
    app_id: 'APP-2025-002',
    approvals_id: 'APR-2025-002',
    current_approver_id: '6',
    project: {
      id: 'PROJ-2025-002',
      ppmp_id: '9',
      procurement_mode_id: 'public_bidding',
      prepared_by: 'Angela Torres',
      project_title: 'Smart Traffic Management System',
      project_code: 'STMS-2025-001',
      classifications: ['infrastructure', 'goods', 'consulting'],
      project_description: 'Deployment of smart traffic lights, AI-driven congestion analysis, and infrastructure upgrades.',
      contract_scope: 'Procurement of AI-powered traffic cameras, construction of smart intersections, and consultancy for predictive traffic analytics.',
      funding_source_id: 'income',
      abc: 4500000,
        fiscal_year: 2025,

    },
    items: [
      {
        id: 'ITEM-2025-003',
        ppmp_project_id: 'PROJ-2025-002',
        technical_specification: 'AI-powered Traffic Cameras',
        quantity_required: 50,
        unit_of_measurement: 'units',
        estimated_unit_cost: 50000,
        estimated_total_cost: 2500000,
        classification: 'goods'
      },
      {
        id: 'ITEM-2025-004',
        ppmp_project_id: 'PROJ-2025-002',
        technical_specification: 'Smart Traffic Intersections Upgrade',
        quantity_required: 5,
        unit_of_measurement: 'lots',
        estimated_unit_cost: 500000,
        estimated_total_cost: 2500000,
        classification: 'infrastructure'
      }
    ],
    schedules: [
      { id: 'SCH-2025-004', ppmp_id: '9', quarter:'q1',  milestone: 'System Design Approval', date: new Date('2025-01-10') },
      { id: 'SCH-2025-005', ppmp_id: '9', quarter: 'q1',milestone: 'Equipment Procurement', date: new Date('2025-04-15') },
      { id: 'SCH-2025-006', ppmp_id: '9', quarter: 'q1',milestone: 'Deployment & Testing', date: new Date('2025-09-30') }
    ]
  }

    ];
    
    // Load real data
    const ppmps = await this.crudService.getAll(PPMP);
    const projects = await this.crudService.getAll(PPMPProject);
    const items = await this.crudService.getAll(PPMPItem);
    const schedules = await this.crudService.getAll(PPMPSchedule);

    for(let schedule of schedules) {
      schedule.date = new Date(schedule.date);
    }

    const joined_ppmps = [];
    for (let ppmp of ppmps) {
      // Find related projects for the PPMP
      const relatedProjects = projects.filter(project => project.ppmp_id === ppmp.id);
    
      for (let project of relatedProjects) {
        // Find related items for each project
        const relatedItems = items.filter(item => item.ppmp_project_id === project.id);
    
        // Find related schedules for the PPMP
        const relatedSchedules = schedules.filter(schedule => schedule.ppmp_id === ppmp.id);
    
        // Create the joined structure
        const ppmpWithDetails: PPMPWithDetails = {
          ...ppmp,
          project: project,
          items: relatedItems,
          schedules: relatedSchedules
        };
    
        joined_ppmps.push(ppmpWithDetails);
      }
    }

    this.procurementModeData = await this.crudService.getAll(ProcurementMode);

    this.procurementModes = this.procurementModeData.map(mode =>   { 
      return {label: mode.mode_name, value: mode.id}
    })

    this.procurementProcess = await this.crudService.getAll(ProcurementProcess);

    this.ppmps = joined_ppmps;

    this.filterByYear();
  }

  getModeProcesses(){
    this.schedules.clear();
    const id=  this.ppmpForm.get('project.procurement_mode_id')?.value
    const mode = this.procurementModeData.find(mode => mode.id == id);
    const modeProcesses =  this.procurementProcess.filter(p=>p.procurement_mode_id == mode?.method);
    for(let process of modeProcesses){
      this.schedules.push(this.createScheduleFormGroup(process.name));
    }
  
  }

 filterPPMPs() {
  this.filteredPpmps = this.ppmps.filter(ppmp => {
    const yearMatch = this.selectedYear ? ppmp.project?.fiscal_year === this.selectedYear : true; // Access from project

    const classificationMatch = this.selectedClassifications.length === 0 ? true :
      ppmp.project?.classifications.some(c => this.selectedClassifications.includes(c));

    const procurementMatch = this.selectedProcurementMode.length === 0 ? true :
      this.selectedProcurementMode.includes(ppmp.project?.procurement_mode_id || '');

    return yearMatch && classificationMatch && procurementMatch;
  });

  if (this.isDocumentView) {
    this.selectedPpmps = this.filteredPpmps;
  }
}

  procurementModes = [
    { label: 'Public Bidding', value: 'public_bidding' },
    { label: 'Limited Source Bidding', value: 'limited_source_bidding' },
    { label: 'Direct Contracting', value: 'direct_contracting' },
    { label: 'Repeat Order', value: 'repeat_order' },
    { label: 'Shopping', value: 'shopping' },
    { label: 'Negotiated Procurement', value: 'negotiated_procurement' }
  ];

  quarters = [
    { label: '1st Quarter', value: 'q1' },
    { label: '2nd Quarter', value: 'q2' },
    { label: '3rd Quarter', value: 'q3' },
    { label: '4th Quarter', value: 'q4' },
  ];

  procurementModeData:ProcurementMode[] = [];

  procurementProcess:ProcurementProcess[] = [];

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


  @ViewChild('ppmpPreview', { static: false }) ppmpPreview!: ElementRef

  
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private crudService:CrudService,
  ) {
    this.currentUser = this.userService.getUser();
    
    for (let year = 2000; year <= 2050; year++) {
      this.years.push({ label: year.toString(), value: year });
    }

    this.selectedYear = new Date().getFullYear();
    this.initializeData();
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


  // Generate unique IDs
  const ppmpId = uuidv4();
  const projectId = uuidv4();
  
  this.ppmpForm = this.formBuilder.group({
    id: [ppmpId],
    office_id: [this.currentUser.officeId],
    app_id: [`APP-${this.selectedYear}-${Math.floor(100 + Math.random() * 900)}`],
    approvals_id: [uuidv4()],
    current_approver_id: [this.currentUser?.id?.toString() || '1'],

    project: this.formBuilder.group({
      id: [projectId],
      ppmp_id: [ppmpId], // Ensure this is linked correctly
      procurement_mode_id: [this.procurementModes[0]?.value ?? '', [Validators.required]],
      prepared_by: [this.currentUser.fullname, [Validators.required]],
      project_title: ['', [Validators.required]],
      project_code: [''],
      classifications: [[], [Validators.required, Validators.minLength(1)]],
      project_description: ['', [Validators.required]],
      contract_scope: [''],
      fiscal_year: [this.selectedYear, [Validators.required]],
      funding_source_id: ['gaa'], // Default value
      abc: [0], // Allocated Budget for Contract
      schedules: this.formBuilder.array([])
    }),

    items: this.formBuilder.array([])
  });
  
  this.getModeProcesses();
  // Add an initial item
  this.addItem();

  // Make fields readonly
  this.ppmpForm.get('project.prepared_by')?.disable();
  
  // Subscribe to classification changes
  this.ppmpForm.get('project.classifications')?.valueChanges.subscribe((values: string[]) => {
    this.updateItemClassifications(values);
  });
  
  // Subscribe to changes in items to update ABC
  this.items.valueChanges.subscribe(() => {
    this.updateTotalProjectABC();
  });
}

  updateTotalProjectABC(): void {
  let total = 0;
  
  for (let i = 0; i < this.items.length; i++) {
    const item = this.items.at(i);
    const quantity = item.get('quantity_required')?.value || 0;
    const unitCost = item.get('estimated_unit_cost')?.value || 0;
    total += quantity * unitCost;
  }
  
  this.ppmpForm.get('project.abc')?.setValue(total);
}


  
// ✅ Get schedules array
get schedules(): FormArray {
  return this.ppmpForm.get('project.schedules') as FormArray;
}

// ✅ Create a new schedule entry
createScheduleFormGroup(milestone:string): FormGroup {
  return this.formBuilder.group({
    id: [uuidv4()],
    ppmp_id: [this.ppmpForm.get('id')?.value || ''],
    milestone: [milestone, [Validators.required]],
    quarter: ['', [Validators.required]],
    date: [new Date(), [Validators.required]]  // Initialize with current date
  });
}
  
// ✅ Add a schedule to the form
addSchedule(): void {
  this.schedules.push(this.createScheduleFormGroup(''));
}

// ✅ Remove a schedule
removeSchedule(index: number): void {
  this.schedules.removeAt(index);
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
    ppmp_project_id: [this.ppmpForm.get('project.id')?.value || ''],
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
      ppmp.project?.fiscal_year === this.selectedYear // Update to project.fiscal_year
    );
  } else {
    this.filteredPpmps = [...this.ppmps];
  }

  this.filterPPMPs();
}


getAvailableYears() {
  // Get unique years from PPMP projects, filtering out undefined values
  const uniqueYears = [
    ...new Set(this.ppmps.map(ppmp => ppmp.project?.fiscal_year).filter((year): year is number => year !== undefined))
  ];

  // Get the current year and add the next 5 years if they are not already included
  const currentYear = new Date().getFullYear();
  const futureYears = Array.from({ length: 5 }, (_, index) => currentYear + index + 1);
  const allYears = [...uniqueYears, ...futureYears, currentYear];

  // Remove duplicates by converting to Set and then back to an array
  const uniqueAllYears = [...new Set(allYears)];

  // Sort years in descending order, ensuring they are numbers
  uniqueAllYears.sort((b, a) => (b ?? 0) - (a ?? 0));

  // Create dropdown options, ensuring `year` is defined
  this.years = uniqueAllYears.map(year => ({
    label: (year ?? '').toString(),
    value: year ?? currentYear
  }));
  

  // Set default to current year if available, otherwise first year in list
  this.selectedYear = uniqueAllYears.includes(currentYear) ? currentYear : uniqueAllYears[0] ?? currentYear;
}

getFutureYears(){
  const currentYear = new Date().getFullYear();
  return this.years.filter(year=>year.value >=currentYear)
}



  
 editPpmp(ppmp: PPMPWithDetails): void {
  this.isEditMode = true;
  this.currentEditId = ppmp.id;

  // Clear existing items & schedules
  while (this.items.length !== 0) {
    this.items.removeAt(0);
  }
  while (this.schedules.length !== 0) {
    this.schedules.removeAt(0);
  }

 this.ppmpForm.patchValue({
  id: ppmp.id,
  office_id: ppmp.office_id,
  app_id: ppmp.app_id,
  approvals_id: ppmp.approvals_id,
  current_approver_id: ppmp.current_approver_id,
  project: {
    ...ppmp.project,
  }
});


  // Add items
  ppmp.items?.forEach(item => {
    const itemForm = this.createItemFormGroup();
    itemForm.patchValue(item);
    this.items.push(itemForm);
  });

  // Add schedules
  ppmp.schedules?.forEach(schedule => {
    const scheduleForm = this.createScheduleFormGroup('');
    scheduleForm.patchValue(schedule);
    this.schedules.push(scheduleForm);
  });

  this.ppmpDialog = true;
}


 // Fixed savePpmp method that handles undefined arrays
async savePpmp(): Promise<void> {
  this.submitted = true;

  if (!this.currentUser) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'You must be logged in to save a PPMP'
    });
    return;
  }

  try {
    // Check form validity
    if (this.ppmpForm.invalid) {
      for (const control in this.ppmpForm.controls) {
        if (this.ppmpForm.controls[control].invalid) {
          console.log(`${control} errors: `, this.ppmpForm.controls[control].errors);
        }
      }
      
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please check all required fields'
      });
      return;
    }

    this.loading = true;
    
    // Get raw form values (including disabled fields)
    const formValue = this.ppmpForm.getRawValue();
    
    // Safely access nested properties with null checks
    const projectData = formValue.project || {};
    const itemsData = formValue.items || [];
    const schedulesData = projectData.schedules || [];
    
    // Create PPMP with nested data and proper null checks
    const ppmpData: PPMPWithDetails = {
      id: this.isEditMode ? this.currentEditId! : formValue.id,
      office_id: formValue.office_id,
      app_id: formValue.app_id || `APP-${this.selectedYear}-${Math.floor(1000 + Math.random() * 9000)}`,
      approvals_id: formValue.approvals_id,
      current_approver_id: formValue.current_approver_id,
      
      // Ensure project data is properly structured
      project: {
        id: projectData.id || uuidv4(),
        ppmp_id: this.isEditMode ? this.currentEditId! : formValue.id,
        procurement_mode_id: projectData.procurement_mode_id || '',
        prepared_by: projectData.prepared_by || this.currentUser?.fullname || '',
        project_title: projectData.project_title || '',
        project_code: projectData.project_code || '',
        classifications: projectData.classifications || [],
        project_description: projectData.project_description || '',
        contract_scope: projectData.contract_scope || '',
        fiscal_year: projectData.fiscal_year || this.selectedYear,
        funding_source_id: projectData.funding_source_id || 'gaa',
        abc: projectData.abc || 0
      },
      
      // Safely map items array with null check
      items: Array.isArray(itemsData) ? 
        itemsData.map(item => ({
          id: item.id || uuidv4(),
          ppmp_project_id: projectData.id || '',
          technical_specification: item.technical_specification || '',
          quantity_required: item.quantity_required || 0,
          unit_of_measurement: item.unit_of_measurement || '',
          estimated_unit_cost: item.estimated_unit_cost || 0,
          estimated_total_cost: (item.quantity_required || 0) * (item.estimated_unit_cost || 0),
          classification: item.classification || ''
        })) : [],
      
      // Safely map schedules array with null check
      schedules: Array.isArray(schedulesData) ? 
        schedulesData.map(schedule => ({
          id: schedule.id || uuidv4(),
          ppmp_id: this.isEditMode ? this.currentEditId! : formValue.id,
          quarter:schedule.quarter ||  '',
          milestone: schedule.milestone || '',
          date: schedule.date ? new Date(schedule.date) : new Date()
        })) : []
    };

    // Update or add PPMP to the list
    if (this.isEditMode && this.currentEditId) {
      // Find and update existing PPMP
      const index = this.ppmps.findIndex(p => p.id === this.currentEditId);
      if (index !== -1) {
        this.ppmps[index] = ppmpData;
      } else {
        this.ppmps.push(ppmpData);
      }
      
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'PPMP updated successfully'
      });
    } else {
      
      const savedPpmp = await this.crudService.create(PPMP,ppmpData);
      
      const savedProject = await this.crudService.create(PPMPProject, {
        ...ppmpData.project as PPMPProject,
        ppmp_id: savedPpmp.id,
      });

      
      for(const item of ppmpData.items ?? []){
        await this.crudService.create(PPMPItem, {
          ...item,
          ppmp_project_id: savedProject.id
        });
      }

      for(const schedule of ppmpData.schedules ?? []){
        await this.crudService.create(PPMPSchedule, {
          ...schedule,
          ppmp_id: savedPpmp.id
        });
      }
      // Add new PPMP
      this.ppmps.push(ppmpData);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'PPMP created successfully'
      });
    }

  

    // Refresh the filtered list
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


  deletePpmp(event:Event,ppmp: PPMP): void {
    event.stopPropagation();
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this PPMP?',
      accept: async () => {
        await this.crudService.delete(PPMP,ppmp.id);
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
  
isItemFileRequired(itemIndex: number): boolean {
  const item = this.items.at(itemIndex);
  const classification = item.get('classification')?.value;
  
  // If classification is set and no file is uploaded, mark as required
  if (classification && this.submitted) {
    // Fix for uploadedFiles.get(itemIndex)?.length possibly undefined
    const files = this.uploadedFiles.get(itemIndex);
    const hasFile = files !== undefined && files.length > 0;
                    
    if (!hasFile) {
      if (classification === 'goods' && !item.get('technical_specification')?.value) {
        return true;
      }
      if (classification === 'infrastructure' && !item.get('scope_of_work')?.value) {
        return true;
      }
      if (classification === 'consulting' && !item.get('terms_of_reference')?.value) {
        return true;
      }
    }
  }
  
  return false;
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
  
  
  viewPpmpDocument(ppmp: PPMPWithDetails) {
  this.selectedPpmp = ppmp;
  this.ppmpDocumentDialog = true;
  }
  
  // upload

  getValidationMessage(fieldName: string): string {
  const field = this.ppmpForm.get(fieldName);
  
  if (!field || !field.errors) return '';
  
  if (field.errors['required']) {
    return 'This field is required';
  }
  
  if (field.errors['minlength']) {
    return `Minimum length is ${field.errors['minlength'].requiredLength}`;
  }
  
  if (field.errors['min']) {
    return `Minimum value is ${field.errors['min'].min}`;
  }
  
  return 'Invalid value';
}
  
 totalSize: string = '0';
totalSizePercent: number = 0;

formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

  onSelectedFiles(event: any, itemIndex?: number) {
  const files = event.files;
  let size = 0;
  
  for (const file of files) {
    size += file.size;
  }
  
  this.totalSize = this.formatSize(size);
  this.totalSizePercent = (size / 1000000) * 100; // 1MB = 1000000B
  
  // Store files for specific item if index is provided
  if (itemIndex !== undefined) {
    this.uploadedFiles.set(itemIndex, files);
  }
}

uploadEvent(uploadCallback: Function, itemIndex?: number) {
  // Execute the PrimeNG upload callback
  uploadCallback();
  
  // Show success message
  this.messageService.add({ 
    severity: 'success', 
    summary: 'Success', 
    detail: 'Files Uploaded' 
  });
  
  // In a real application, you would actually upload the files to your server here
  // and store the returned file URLs/paths with the item
  if (itemIndex !== undefined && this.uploadedFiles.has(itemIndex)) {
    const files = this.uploadedFiles.get(itemIndex);
    const itemForm = this.items.at(itemIndex);
    
    // Update the appropriate field based on classification
    const classification = itemForm.get('classification')?.value;
    if (classification === 'goods') {
      itemForm.patchValue({ technical_specification: files?.map(f => f.name).join(', ') });
    } else if (classification === 'infrastructure') {
      itemForm.patchValue({ scope_of_work: files?.map(f => f.name).join(', ') });
    } else if (classification === 'consulting') {
      itemForm.patchValue({ terms_of_reference: files?.map(f => f.name).join(', ') });
    }
  }
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
  
    yearStatus: Map<number, boolean> = new Map(); // To track finalization status by year

    isYearFinalized(year: number): boolean {
  return this.filteredPpmps.some(ppmp => ppmp.project?.fiscal_year === year && this.yearStatus.get(year));
}

  finalizePpmp(year: number) {
    this.confirmationService.confirm({
      message: `Are you sure you want to finalize all PPMPs for year ${year}? This action cannot be undone.`,
      accept: () => {
        this.yearStatus.set(year, true);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `PPMPs for ${year} have been finalized`
        });
      }
    });
  }

  backToSystemView() {
  this.isDocumentView = false;
}


  openPreviewDialog() {
  if (this.filteredPpmps.length > 0) {
    this.selectedPpmps = this.filteredPpmps; // Bind to always reflect changes
    this.isDocumentView = true; // Switch to document view
  } else {
    this.messageService.add({
      severity: 'warn',
      summary: 'No PPMP Available',
      detail: 'There are no PPMPs available for the selected year.'
    });
  }
}




  calculateTotalEstimatedCost(ppmp?: PPMPWithDetails): number {
  if (!ppmp || !ppmp.items) return 0;
  return ppmp.items.reduce((total, item) => total + (item.estimated_total_cost || 0), 0);
  }
  
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


  isMilestoneScheduled(ppmp: PPMPWithDetails, month: string): boolean {
  if (!ppmp.schedules) return false;
  return ppmp.schedules.some(schedule => {
    const scheduleMonth = new Date(schedule.date).toLocaleString('en-US', { month: 'short' });
    return scheduleMonth === month;
  });
}

    
 

  async downloadPPMP() {
    if (!this.ppmpPreview) return

    const exportButton = document.getElementById('download-btn')
    if (exportButton) exportButton.style.display = 'none'

    const canvas = await html2canvas(this.ppmpPreview.nativeElement, { scale: 2, useCORS: true })
    if (exportButton) exportButton.style.display = 'block'

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('landscape', 'mm', 'a4')
    pdf.addImage(imgData, 'PNG', 0, 0, 297, (canvas.height * 297) / canvas.width)
    pdf.save(`PPMP_${this.selectedYear}.pdf`)
  }

 toggleView() {
  if (this.isDocumentView) {
    this.animationClass = 'animate-slide-out'
    setTimeout(() => {
      this.isDocumentView = false
      this.animationClass = 'animate-slide-in' // Reset animation for next toggle
    }, 200) // Match animation duration
  } else {
    this.isDocumentView = true  
    this.selectedPpmps = this.filteredPpmps
    this.animationClass = 'animate-slide-in'
  }
}



}


