import { PPMP, PPMPItem, PPMPProject, PPMPSchedule, ProcurementMode, ProcurementProcess } from "./schema";
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
    {
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
            office_id: 1,
            app_id: 'APP-2026-001',
            approvals_id: 'APR-2026-001',
            current_approver_id: '1',
          },
          // Single Classification: Infrastructure
          {
            id: '2',
            office_id: 1,
            app_id: 'APP-2025-002',
            approvals_id: 'APR-2025-002',
            current_approver_id: '1',
          },
          // Single Classification: Goods
          {
            id: '3',
            office_id: 1,
            app_id: 'APP-2025-001',
            approvals_id: 'APR-2025-001',
            current_approver_id: '1',
          
          },
          // Single Classification: Consulting
          {
            id: '4',
            office_id: 1,
            app_id: 'APP-2025-002',
            approvals_id: 'APR-2025-002',
            current_approver_id: '1',
          
      },
    
      // Project 2: Hospital Modernization Program
      {
        id: '7',
        office_id: 4,
        app_id: 'APP-2025-005',
        approvals_id: 'APR-2025-005',
        current_approver_id: '4',
      },
    
      // Project 3: Digital Library Expansion
      {
        id: '8',
        office_id: 5,
        app_id: 'APP-2025-001',
        approvals_id: 'APR-2025-001',
        current_approver_id: '5',
        
      },
    
      // Project 4: Smart Traffic Management System
      {
        id: '9',
        office_id: 6,
        app_id: 'APP-2025-002',
        approvals_id: 'APR-2025-002',
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
export const ProcurementProcessModeData:ProcurementProcess[]=[
    { "id": "process_1", "name": "Initial Planning", "process_order": 1, "procurement_mode_id": "Public" },
    { "id": "process_2", "name": "Tender Preparation", "process_order": 2, "procurement_mode_id": "Public" },
    { "id": "process_3", "name": "Evaluation", "process_order": 3, "procurement_mode_id": "Public" },
    { "id": "process_4", "name": "Contract Awarding", "process_order": 4, "procurement_mode_id": "Alternative" },
    { "id": "process_5", "name": "Negotiation", "process_order": 5, "procurement_mode_id": "Alternative" },
    { "id": "process_6", "name": "Contract Signing", "process_order": 6, "procurement_mode_id": "Alternative" }
]