// src/app/schema/schema.ts


// DONE


export class ProcurementProcess {
  id: string
  name: string
  process_order: number
  procurement_mode_id:'Public' | 'Alternative'
}

export class ProcurementMode {
  id: string 
  mode_name: string
  method: 'Public' | 'Alternative'
}

export class FundSource {
  id: string
  source_name: string
  budget_id: string
}

export class Budget {
  id: string
  office_id: string
  created_by: number
  fiscal_year: number
  total_budget: number
  allocated_budget: number
  used_amount: number
  date_created: Date
}

export class UserBudget {
  id: string
  user_id: string
  budget_id: string
  allocated_amount: number
  used_amount: number
  date_allocated: Date
}


export class PPMP {
  id: string
  office_id: string;
  app_id?: string
  current_approver_id: string
}


export class PPMPProject {
  id: string
  ppmp_id: string  
  procurement_mode_id: string  
  prepared_by: string  
  project_title: string  
  project_code?: string 
  project_description: string
  classifications: string[]
  funding_source_id: string // si budget 
  abc?: number;  // update ig optional ko lang nguna | si budget /add
  contract_scope?: string // add 
  fiscal_year: number
}

export class PPMPItem {
  id: string
  ppmp_project_id: string  
  quantity_required: number  
  unit_of_measurement: string 
  estimated_unit_cost: number  
  estimated_total_cost: number 
  classification: string
  technical_specification?: string; // For Goods
  scope_of_work?: string; // For Services and Infrastructure
  terms_of_reference?: string; // For Consulting Services
}

export class PPMPSchedule { // end user nguna and then i veverify ni bac if pwede.
  id: string;
  ppmp_id: string;
  milestone: string;
  quarter:string;
  date: Date
}

export class Approvals { 
  id: string
  approver_id: string
  document_id:string
  entity_id:string
  approval_status: 'Approved' | 'Rejected'
  remarks?: string
  signature?: string
}

export class Approver {
  id: string
  user_id: string 
  entity_id: string
  name: string
  approval_order: number
}

export class Entity {
  id: number
  name: 'PPMP' | 'PurchaseRequest' | 'APP' | 'ProcurementProcess' | 'Contract' | 'InspectionAcceptance' | 'Payment'
  description?: string
}

export class APP {
  id: string
  fund_source: string
  prepared_by: number
  approvals_id: string
  fiscal_year: number
  date_prepared: Date
  date_approved?: Date
  total_quantity_required: number
  total_estimated_cost: number
  // add 
}

export class PurchaseRequest {
  id: string
  prNo: string
  project_id: string
  current_approver_id?: string
  request_date: Date
  status: 'Draft' | 'Pending' | 'Approved'
  
  prNo: string
  saiNo?: string
  alobsNo?: string
  saiDate?: Date | null
  alobsDate?: Date | null
  requisitioningOffice: string
  items: PurchaseRequestItem[]
  totalAmount: number
  purpose: string
  requestedBy: Signatory
  recommendedBy: Signatory
  approvedBy: Signatory
  certification?: Signatory
  ppmpId?: string
  appId?: string
  coaInfo?: {
    annexNo: string
    circularNo: string
  }
date: string|number|Date
    static Pending: string
    static Approved: string
    static Rejected: string
}
// remove if existing for signatory
export interface Signatory {
  name: string
  designation: string
}

export interface PurchaseRequestItem {
  unit: string
  description: string
  qty: number
  unitCost: number
  totalCost: number
  itemNo: string
}


export class Department {
  id!: string
  name!: string
}

export class Building {
  id!: string
  name!: string
  address!: string
  numberOfFloors!: number
  dateConstructed?: Date
}

export class Office {
  id!: string
  department_id!: string
  building_id?: string
  name!: string
}

export class Users {
  id: string
  fullname: string
  username: string
  password: string
  user_type: 'SuperAdmin' | 'Admin' | 'User'
  role: 'superadmin' | 'accounting' | 'supply' | 'bac' | 'inspection' | 'end-user' | 'president'
  isAdmin?: boolean
  profile: string
  officeId: string
}


export class Contract {
  id: string
  purchase_request_id: string
  contractor_name: string
  contract_amount: number
  contract_date: Date
  start_date: Date
  end_date: Date
  status: 'Active' | 'Completed' | 'Terminated'
}

export class InspectionAcceptance {
  id: string
  contract_id: string
  inspected_by: number
  inspection_date: Date
  signature: string
  remarks?: string
}

export class Payment {
  id: string
  contract_id: string
  obligation_request_date: Date
  disbursement_voucher_date: Date
  payment_date: Date
  amount_paid: string
  payment_method: 'Check' | 'ADA'
}



export class AuditTrail {
  id: string
  entity_id: string             // References Entity table for type
  record_id: string             // The ID of the specific record in the entity (e.g., PPMP ID)
  approvals_id: string
  action: 'Created' | 'Updated' | 'Approved' | 'Rejected' | 'Deleted'
  performed_by: string         // User ID who performed the action
  performed_at: Date           // Timestamp when the action was performed
  remarks?: string             // Additional comments if any
}

export class Notification {
  id: number
  user_id: number
  message: string
  is_read: boolean
  created_at: Date
}

export class Document {
  id: number
  procurement_process_id: string
  entity_id: number             // References Entity table for type
  record_id: number             // The ID of the specific record in the entity
  file_path: string
  uploaded_by: number
  upload_date: Date
}

