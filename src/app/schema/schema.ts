// src/app/schema/schema.ts


// DONE


export class ProcurementProcess {
  id: string
  name: string
  process_order: number
}


export class ProcurementMode {
  id: string
  procurement_process_id: string
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


export interface PPMP {
  id: string
  office_id: number
  app_id?: string
  fiscal_year: number
  approvals_id: string
  current_approver_id: string
}

export interface PPMPItem {
  id: string
  ppmp_id: string
  procurement_mode_id: string
  funding_source_id: string
  prepared_by: string
  project_title: string
  project_code?: string
  item_description: string
  technical_specification: string
  unit_of_measurement: string
  quantity_required: number
  estimated_unit_cost: number
  estimated_total_cost: number
}

export interface Approvals { 
  id: string
  approver_id: string
  approval_status: 'Approved' | 'Rejected'
  remarks?: string
  signature?: string
}

export class Approver {
  id: string
  user_id: string 
  entity_id: string
  name: 'Department Head' | 'BAC' | 'Budget'
  approval_order: number
}

export interface Entity {
  id: number
  name: 'PPMP' | 'PurchaseRequest' | 'APP' | 'ProcurementProcess' | 'Contract' | 'InspectionAcceptance' | 'Payment'
  description?: string
}

export interface PPMPSchedule {
  id: string
  ppmp_id: string
  milestone: string
  date: Date
}

//

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
}

export class PurchaseRequest {
  id: string
  ppmp_id: string
  approvals_id: string
  request_date: Date
}

export class Department {
  id: string
  name: string
}

export class Office {
  id: string
  department_id: string
  name: string
}

export class User {
  id: string
  name: string
  username: string
  password: string
  user_type: 'SuperAdmin' | 'Admin' | 'User'
  role: 'End-User' | 'BAC' | 'Budget' | 'Accounting' | 'Supply' | 'Inspection' | 'HOPE'
  office_id: string
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



export interface AuditTrail {
  id: string
  entity_id: string             // References Entity table for type
  record_id: string             // The ID of the specific record in the entity (e.g., PPMP ID)
  approvals_id: string
  action: 'Created' | 'Updated' | 'Approved' | 'Rejected' | 'Deleted'
  performed_by: string         // User ID who performed the action
  performed_at: Date           // Timestamp when the action was performed
  remarks?: string             // Additional comments if any
}

export interface Notification {
  id: number
  user_id: number
  message: string
  is_read: boolean
  created_at: Date
}

export interface Document {
  id: number
  procurement_process_id: string
  entity_id: number             // References Entity table for type
  record_id: number             // The ID of the specific record in the entity
  file_path: string
  uploaded_by: number
  upload_date: Date
}

