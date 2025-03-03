
import { PPMP, PPMPItem, PPMPProject, PPMPSchedule, ProcurementMode, ProcurementProcess, Users, Department, Building, Office, Entity, Approver, PurchaseRequest} from "./schema";

// PPMP Items
export const PPMPItemData: PPMPItem[] = [
    {
      id: 'ITEM-2025-001',
      ppmp_project_id: 'PROJ-2025-001',
      technical_specification: 'Enterprise-grade network switches and routers',
      quantity_required: 10,
      unit_of_measurement: 'sets',
      estimated_unit_cost: 200000,
      estimated_total_cost: 2000000,
      classification: 'goods',
    },
    {
      id: 'ITEM-2025-002',
      ppmp_project_id: 'PROJ-2025-002',
      technical_specification: 'Complete renovation package including furniture and fixtures',
      quantity_required: 1,
      unit_of_measurement: 'lot',
      estimated_unit_cost: 500000,
      estimated_total_cost: 500000,
      classification: 'infrastructure',
    },
    {
      id: 'ITEM-2025-005',
      ppmp_project_id: 'PROJ-2025-004',
      technical_specification: 'Smart Interactive Boards with AI Integration',
      quantity_required: 15,
      unit_of_measurement: 'units',
      estimated_unit_cost: 50000,
      estimated_total_cost: 750000,
      classification: 'goods',
    },
    {
      id: 'ITEM-2025-006',
      ppmp_project_id: 'PROJ-2025-004',
      technical_specification: 'Campus-wide High-Speed Networking Upgrade',
      quantity_required: 1,
      unit_of_measurement: 'lot',
      estimated_unit_cost: 1500000,
      estimated_total_cost: 1500000,
      classification: 'infrastructure',
    },
    {
      id: 'ITEM-2025-007',
      ppmp_project_id: 'PROJ-2025-004',
      technical_specification: 'Consulting Services for AI-driven Student Monitoring',
      quantity_required: 1,
      unit_of_measurement: 'service',
      estimated_unit_cost: 750000,
      estimated_total_cost: 750000,
      classification: 'consulting',
    },
    {
      id: 'ITEM-2025-008',
      ppmp_project_id: 'PROJ-2025-005',
      technical_specification: 'MRI Machines - High Precision',
      quantity_required: 3,
      unit_of_measurement: 'units',
      estimated_unit_cost: 1200000,
      estimated_total_cost: 3600000,
      classification: 'goods',
    },
    {
      id: 'ITEM-2025-009',
      ppmp_project_id: 'PROJ-2025-005',
      technical_specification: 'Renovation of Patient Wards',
      quantity_required: 1,
      unit_of_measurement: 'lot',
      estimated_unit_cost: 1400000,
      estimated_total_cost: 1400000,
      classification: 'infrastructure',
    },
    {
      id: 'ITEM-2025-001',
      ppmp_project_id: 'PROJ-2025-001',
      technical_specification: 'E-book Licenses for Academic Use',
      quantity_required: 500,
      unit_of_measurement: 'licenses',
      estimated_unit_cost: 2000,
      estimated_total_cost: 1000000,
      classification: 'goods',
    },
    {
      id: 'ITEM-2025-002',
      ppmp_project_id: 'PROJ-2025-001',
      technical_specification: 'Consultancy for AI-powered Library Recommendations',
      quantity_required: 1,
      unit_of_measurement: 'service',
      estimated_unit_cost: 1000000,
      estimated_total_cost: 1000000,
      classification: 'consulting',
    },
    {
      id: 'ITEM-2025-003',
      ppmp_project_id: 'PROJ-2025-002',
      technical_specification: 'AI-powered Traffic Cameras',
      quantity_required: 50,
      unit_of_measurement: 'units',
      estimated_unit_cost: 50000,
      estimated_total_cost: 2500000,
      classification: 'goods',
    },
    {
      id: 'ITEM-2025-004',
      ppmp_project_id: 'PROJ-2025-002',
      technical_specification: 'Smart Traffic Intersections Upgrade',
      quantity_required: 5,
      unit_of_measurement: 'lots',
      estimated_unit_cost: 500000,
      estimated_total_cost: 2500000,
      classification: 'infrastructure',
    },
  ]
  
  // PPMP Projects
  export const PPMPProjectData: PPMPProject[] = [
    {
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
    {
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
    {
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
    {
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
    {
      id: 'PROJ-2025-006',
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
    {
      id: 'PROJ-2025-007',
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
  ]
  
  // PPMP Schedules
  export const PPMPScheduleData: PPMPSchedule[] = [
    { id: 'SCH-2025-001', ppmp_id: '3', quarter: 'q1', milestone: 'Supplier Selection', date: new Date('2025-02-15') },
    { id: 'SCH-2025-002', ppmp_id: '3', quarter: 'q1', milestone: 'Installation', date: new Date('2025-06-30') },
    { id: 'SCH-2025-003', ppmp_id: '4', quarter: 'q1', milestone: 'Consultant Hiring', date: new Date('2025-03-20') },
    { id: 'SCH-2025-004', ppmp_id: '4', quarter: 'q1', milestone: 'Program Launch', date: new Date('2025-09-15') },
    { id: 'SCH-2025-005', ppmp_id: '6', quarter: 'q1', milestone: 'Procurement Start', date: new Date('2025-02-10') },
    { id: 'SCH-2025-006', ppmp_id: '6', quarter: 'q1', milestone: 'Installation Phase', date: new Date('2025-05-01') },
    { id: 'SCH-2025-007', ppmp_id: '6', quarter: 'q1', milestone: 'Training & Implementation', date: new Date('2025-07-15') },
    { id: 'SCH-2025-008', ppmp_id: '7', quarter: 'q1', milestone: 'Supplier Selection', date: new Date('2025-03-05') },
    { id: 'SCH-2025-009', ppmp_id: '7', quarter: 'q1', milestone: 'Equipment Delivery', date: new Date('2025-06-20') },
    { id: 'SCH-2025-010', ppmp_id: '7', quarter: 'q1', milestone: 'Ward Renovation Completion', date: new Date('2025-09-15') },
    { id: 'SCH-2025-001', ppmp_id: '8', quarter: 'q1', milestone: 'License Procurement', date: new Date('2025-02-15') },
    { id: 'SCH-2025-002', ppmp_id: '8', quarter: 'q1', milestone: 'Database Integration', date: new Date('2025-06-10') },
    { id: 'SCH-2025-003', ppmp_id: '8', quarter: 'q1', milestone: 'AI System Implementation', date: new Date('2025-09-01') },
    { id: 'SCH-2025-004', ppmp_id: '9', quarter: 'q1', milestone: 'System Design Approval', date: new Date('2025-01-10') },
    { id: 'SCH-2025-005', ppmp_id: '9', quarter: 'q1', milestone: 'Equipment Procurement', date: new Date('2025-04-15') },
    { id: 'SCH-2025-006', ppmp_id: '9', quarter: 'q1', milestone: 'Deployment & Testing', date: new Date('2025-09-30') },
  ]
  

  // PPMP
  export const PPMPData:PPMP[] = [
    // Single Classification: Goods
          {
            id: '1',
            office_id: '550e8400e29b41d4a716446655440015',
            app_id: 'APP-2026-001',
            current_approver_id: '1',
          },
          // Single Classification: Infrastructure
          {
            id: '2',
            office_id: '550e8400e29b41d4a716446655440015',
            app_id: 'APP-2025-002',
            current_approver_id: '1',
          },
          // Single Classification: Goods
          {
            id: '3',
            office_id: '550e8400e29b41d4a716446655440015',
            app_id: 'APP-2025-001',
            current_approver_id: '1',
          
          },
          // Single Classification: Consulting
          {
            id: '4',
            office_id: '550e8400e29b41d4a716446655440015',
            app_id: 'APP-2025-002',
            current_approver_id: '1',
          
      },
    
      // Project 2: Hospital Modernization Program
      {
        id: '7',
        office_id: '550e8400e29b41d4a716446655440015',
        app_id: 'APP-2025-005',
        current_approver_id: '4',
      },
    
      // Project 3: Digital Library Expansion
      {
        id: '8',
        office_id: '550e8400e29b41d4a716446655440015',
        app_id: 'APP-2025-001',
        current_approver_id: '5',
        
      },
    
      // Project 4: Smart Traffic Management System
      {
        id: '9',
        office_id: '550e8400e29b41d4a716446655440015',
        app_id: 'APP-2025-002',
        current_approver_id: '6',
      }
    
]

export const ProcurementModeData:ProcurementMode[]=[
    { "id": "public_bidding", "mode_name": "Public Bidding", "method": "Public" },
    { "id": "limited_source_bidding", "mode_name": "Limited Source Bidding", "method": "Alternative" },
    { "id": "direct_contracting", "mode_name": "Direct Contracting", "method": "Alternative" },
    { "id": "repeat_order", "mode_name": "Repeat Order", "method": "Alternative" },
    { "id": "shopping", "mode_name": "Shopping", "method": "Public" },
    { "id": "negotiated_procurement", "mode_name": "Negotiated Procurement", "method": "Alternative" }
]
export const ProcurementProcessData:ProcurementProcess[]=[
    { "id": "process_1", "name": "Initial Planning", "process_order": 1, "procurement_mode_id": "Public" },
    { "id": "process_2", "name": "Tender Preparation", "process_order": 2, "procurement_mode_id": "Public" },
    { "id": "process_3", "name": "Evaluation", "process_order": 3, "procurement_mode_id": "Public" },
    { "id": "process_4", "name": "Contract Awarding", "process_order": 4, "procurement_mode_id": "Alternative" },
    { "id": "process_5", "name": "Negotiation", "process_order": 5, "procurement_mode_id": "Alternative" },
    { "id": "process_6", "name": "Contract Signing", "process_order": 6, "procurement_mode_id": "Alternative" }
]



// USERS
export const UsersData: Users[] = [
  {
    id: "1",
    fullname: "John Doe",
    username: "accounting",
    password: "test123",
    user_type: "Admin",
    role: "accounting",
    isAdmin: true,
    profile: "profile-pic-url-1",
    officeId: "550e8400e29b41d4a716446655440010"
  },
  {
    id: "2",
    fullname: "Jane Smith",
    username: "superadmin",
    password: "test123",
    user_type: "SuperAdmin",
    role: "superadmin",
    isAdmin: true,
    profile: "profile-pic-url-2",
    officeId: "550e8400e29b41d4a716446655440011"
  },
  {
    id: "3",
    fullname: "Alice Johnson",
    username: "supply",
    password: "test123",
    user_type: "Admin",
    role: "supply",
    isAdmin: true,
    profile: "profile-pic-url-3",
    officeId: "550e8400e29b41d4a716446655440012"
  },
  {
    id: "4",
    fullname: "Bob Brown",
    username: "bac",
    password: "test123",
    user_type: "User",
    role: "bac",
    isAdmin: true,
    profile: "profile-pic-url-4",
    officeId: "550e8400e29b41d4a716446655440013"
  },
  {
    id: "5",
    fullname: "Charlie White",
    username: "inspection",
    password: "test123",
    user_type: "Admin",
    role: "inspection",
    isAdmin: true,
    profile: "profile-pic-url-5",
    officeId: "550e8400e29b41d4a716446655440014"
  },
  {
    id: "6",
    fullname: "Diana Green",
    username: "enduser",
    password: "test123",
    user_type: "User",
    role: "end-user",
    isAdmin: true,
    profile: "profile-pic-url-6",
    officeId: "550e8400e29b41d4a716446655440015"
  },
];


export const EntityData: Entity[] = [
   {
    id: 1,
    name: 'PPMP',
    description: 'Project Procurement Management Plan'
  },
  {
    id: 2,
    name: 'PurchaseRequest',
    description: 'Request for purchase of goods/services'
  },
  {
    id: 3,
    name: 'APP',
    description: 'Annual Procurement Plan'
  },
  {
    id: 4,
    name: 'ProcurementProcess',
    description: 'Processes related to procurement'
  },
  {
    id: 5,
    name: 'Contract',
    description: 'Contract management and tracking'
  },
  {
    id: 6,
    name: 'InspectionAcceptance',
    description: 'Inspection and acceptance of deliveries'
  },
  {
    id: 7,
    name: 'Payment',
    description: 'Processing payments for procurement'
  }
];

export const ApproverData: Approver[] = [
  {
    id: 'APR-2025-001',
    user_id: '1', // This maps to "John Doe"
    entity_id: '1', // Only PPMP entity
    name: 'Department Head Approver', // Approval Sequence Name
    approval_order: 1
  },
  {
    id: 'APR-2025-002',
    user_id: '2', // This maps to "Jane Smith"
    entity_id: '1', // Only PPMP entity
    name: 'BAC Approver', // Approval Sequence Name
    approval_order: 2
  },
  {
    id: 'APR-2025-003',
    user_id: '3', // This maps to "Alice Johnson"
    entity_id: '1', // Only PPMP entity
    name: 'Budget Approver', // Approval Sequence Name
    approval_order: 3
  },
  {
    id: 'APR-2025-001',
    user_id: '1', // This maps to "John Doe"
    entity_id: '2', // Only PPMP entity
    name: 'Department Head Approver', // Approval Sequence Name
    approval_order: 1
  },
  {
    id: 'APR-2025-002',
    user_id: '2', // This maps to "Jane Smith"
    entity_id: '2', // Only PPMP entity
    name: 'BAC Approver', // Approval Sequence Name
    approval_order: 2
  },
  {
    id: 'APR-2025-003',
    user_id: '3', // This maps to "Alice Johnson"
    entity_id: '2', // Only PPMP entity
    name: 'Budget Approver', // Approval Sequence Name
    approval_order: 3
  }
];



  
// Dummy Departments (moved from departments.service.ts)
export const DepartmentData: Department[] = [
  {
    id: '550e8400e29b41d4a716446655440000',
    name: 'College of Engineering'
  },
  {
    id: '550e8400e29b41d4a716446655440001',
    name: 'College of Business Administration'
  },
  {
    id: '550e8400e29b41d4a716446655440002',
    name: 'College of Education'
  },
  {
    id: '550e8400e29b41d4a716446655440003',
    name: 'College of Information Technology'
  },
  {
    id: '550e8400e29b41d4a716446655440004',
    name: 'College of Agriculture'
  },
  {
    id: '550e8400e29b41d4a716446655440005',
    name: 'College of Nursing'
  },
  {
    id: '550e8400e29b41d4a716446655440006',
    name: 'College of Arts and Sciences'
  },
  {
    id: '550e8400e29b41d4a716446655440007',
    name: 'College of Criminal Justice Education'
  }
];

// Optionally include Buildings and Offices if you want them in CrudService too
export const BuildingData: Building[] = [
  {
    id: '550e8400e29b41d4a716446655440008',
    name: 'Engineering Building',
    address: 'DDOSC Main Campus, Nabunturan, Davao de Oro',
    numberOfFloors: 4,
    dateConstructed: new Date('1996-03-25')
  },
  {
    id: '550e8400e29b41d4a716446655440009',
    name: 'Business Administration Building',
    address: 'DDOSC Main Campus, Nabunturan, Davao de Oro',
    numberOfFloors: 3,
    dateConstructed: new Date('1991-07-12')
  },
  // Add remaining buildings as needed
];

export const OfficeData: Office[] = [
  {
    id: '550e8400e29b41d4a716446655440010',
    name: 'Dean\'s Office - COE',
    department_id: '550e8400e29b41d4a716446655440000', // Matches DepartmentData[0]
    building_id: '550e8400e29b41d4a716446655440008'
  },
  {
    id: '550e8400e29b41d4a716446655440011',
    name: 'Registrar\'s Office - CBA',
    department_id: '550e8400e29b41d4a716446655440001', // Matches DepartmentData[1]
    building_id: '550e8400e29b41d4a716446655440009'
  },
  {
    id: '550e8400e29b41d4a716446655440015',
    name: 'Faculty\'s Office - CBA',
    department_id: '550e8400e29b41d4a716446655440001', // Matches DepartmentData[1]
    building_id: '550e8400e29b41d4a716446655440009'
  },
  // Add remaining offices as needed
];

export const PurchaseRequestData: PurchaseRequest[] = [
  {
    id: 'PR-2026-001',
    prNo: 'PR-2026-001',
    project_id: 'PROJ-2025-001',
    current_approver_id: '1',
    request_date: new Date('2025-03-01'),
    status: 'Draft',
    prNo: 'PR-2026-001',
    saiNo: 'SAI-2026-001',
    alobsNo: 'ALOBS-2026-001',
    saiDate: new Date('2025-02-28'),
    alobsDate: new Date('2025-03-01'),
    requisitioningOffice: 'Procurement Department',
    items: [
      {
        unit: 'pcs',
        description: 'Laptop - Intel i7, 16GB RAM, 512GB SSD',
        qty: 2,
        unitCost: 80000,
        totalCost: 160000,
        itemNo: 'ITM-001'
      }
    ],
    totalAmount: 160000,
    purpose: 'Office Upgrade',
    requestedBy: { name: 'John Doe', designation: 'IT Manager' },
    recommendedBy: { name: 'Jane Smith', designation: 'Procurement Officer' },
    approvedBy: { name: 'Dr. Robert Brown', designation: 'Director' },
    certification: { name: 'Emily White', designation: 'Finance Officer' },
    ppmpId: 'PPMP-2026-001',
    appId: 'APP-2026-001',
    coaInfo: { annexNo: 'A-101', circularNo: 'C-2026-001' },
    date: ""
  },
  {
    id: 'PR-2025-002',
    prNo: 'PR-2025-002',
    project_id: 'PROJ-2025-002',
    current_approver_id: '1',
    request_date: new Date('2025-03-02'),
    status: 'Pending',
    prNo: 'PR-2025-002',
    saiNo: 'SAI-2025-002',
    alobsNo: 'ALOBS-2025-002',
    saiDate: new Date('2025-02-27'),
    alobsDate: new Date('2025-03-01'),
    requisitioningOffice: 'Finance Department',
    items: [
      {
        unit: 'box',
        description: 'Bond Paper A4, 70gsm',
        qty: 50,
        unitCost: 200,
        totalCost: 10000,
        itemNo: 'ITM-002'
      },
      {
        unit: 'pcs',
        description: 'Printer Ink Cartridge - Black',
        qty: 5,
        unitCost: 1200,
        totalCost: 6000,
        itemNo: 'ITM-003'
      }
    ],
    totalAmount: 16000,
    purpose: 'Office Supplies Replenishment',
    requestedBy: { name: 'Alice Green', designation: 'Admin Officer' },
    recommendedBy: { name: 'Mark Evans', designation: 'Finance Head' },
    approvedBy: { name: 'Sarah Black', designation: 'Chief Accountant' },
    certification: { name: 'Emily White', designation: 'Finance Officer' },
    ppmpId: 'PPMP-2025-002',
    appId: 'APP-2025-002',
    coaInfo: { annexNo: 'A-102', circularNo: 'C-2025-002' },
    date: ""
  },
  {
    id: 'PR-2025-003',
    prNo: 'PR-2025-003',
    project_id: 'PROJ-2025-004',
    current_approver_id: '1',
    request_date: new Date('2025-03-03'),
    status: 'Pending',
    prNo: 'PR-2025-003',
    saiNo: 'SAI-2025-003',
    alobsNo: 'ALOBS-2025-003',
    saiDate: new Date('2025-02-26'),
    alobsDate: new Date('2025-02-28'),
    requisitioningOffice: 'HR Department',
    items: [
      {
        unit: 'pcs',
        description: 'Ergonomic Office Chairs',
        qty: 10,
        unitCost: 5000,
        totalCost: 50000,
        itemNo: 'ITM-004'
      },
      {
        unit: 'pcs',
        description: 'Standing Desk',
        qty: 5,
        unitCost: 15000,
        totalCost: 75000,
        itemNo: 'ITM-005'
      }
    ],
    totalAmount: 125000,
    purpose: 'Workplace Enhancement',
    requestedBy: { name: 'Laura Scott', designation: 'HR Manager' },
    recommendedBy: { name: 'James Wilson', designation: 'Admin Supervisor' },
    approvedBy: { name: 'Ethan Adams', designation: 'Executive Director' },
    certification: { name: 'Emily White', designation: 'Finance Officer' },
    ppmpId: 'PPMP-2025-003',
    appId: 'APP-2025-003',
    coaInfo: { annexNo: 'A-103', circularNo: 'C-2025-003' },
    date: ""
  },
  {
    id: 'PR-2025-004',
    prNo: 'PR-2025-004',
    project_id: 'PROJ-2025-005',
    current_approver_id: '1',
    request_date: new Date('2025-03-04'),
    status: 'Draft',
    prNo: 'PR-2025-004',
    saiNo: 'SAI-2025-004',
    alobsNo: 'ALOBS-2025-004',
    saiDate: new Date('2025-02-25'),
    alobsDate: new Date('2025-02-27'),
    requisitioningOffice: 'IT Department',
    items: [
      {
        unit: 'pcs',
        description: 'Wireless Router - Dual Band',
        qty: 5,
        unitCost: 3500,
        totalCost: 17500,
        itemNo: 'ITM-006'
      },
      {
        unit: 'rolls',
        description: 'Ethernet Cable Cat6 - 50m',
        qty: 3,
        unitCost: 2500,
        totalCost: 7500,
        itemNo: 'ITM-007'
      }
    ],
    totalAmount: 25000,
    purpose: 'Network Infrastructure Upgrade',
    requestedBy: { name: 'Michael Brown', designation: 'IT Specialist' },
    recommendedBy: { name: 'Sophia Taylor', designation: 'Tech Lead' },
    approvedBy: { name: 'William Anderson', designation: 'CIO' },
    certification: { name: 'Emily White', designation: 'Finance Officer' },
    ppmpId: 'PPMP-2025-004',
    appId: 'APP-2025-004',
    coaInfo: { annexNo: 'A-104', circularNo: 'C-2025-004' },
    date: ""
  }
]
