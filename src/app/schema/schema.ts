// src/app/schema/schema.ts

export interface Department {
  id: number
  name: string
}

export interface Office {
  id: number
  department_id: number
  name: string
}

export interface User {
  id: number
  name: string
  username: string
  password: string
  user_type: 'SuperAdmin' | 'Admin' | 'User'
  role: 'End-User' | 'BAC' | 'Budget' | 'Accounting' | 'Supply' | 'Inspection' | 'HOPE'
  department_id: number
  office_id: number
}

export interface ProcurementMode {
  id: number
  mode_name: string
}

export interface FundingSource {
  id: number
  source_name: string
}

export interface Budget {
  id: number
  department_id: number
  fiscal_year: number
  total_budget: number
  allocated_budget: number
  remaining_budget: number
  created_by: number
  date_created: Date
}

export interface UserBudget {
  id: number
  user_id: number
  budget_id: number
  allocated_amount: number
  used_amount: number
  remaining_amount: number
  date_allocated: Date
}

export interface PPMP {
  id: string
  department_id: number
  office_id: number
  fiscal_year: number
  prepared_by: string
  approval_status: 'Pending' | 'Approved' | 'Rejected'
  current_approval_stage: string
  remarks?: string
  items: PPMPItem[]
}

export interface PPMPItem {
  id: string
  project_title: string
  project_code?: string
  procurement_method: 'Public Bidding' | 'Shopping' | 'Negotiated Procurement' | 'Direct Contracting'
  item_description: string
  technical_specification: string
  unit_of_measurement: string
  quantity_required: number
  estimated_unit_cost: number
  estimated_total_cost: number
  schedule: PPMPSchedule[]
}

export interface PPMPSchedule {
  month: string
  milestone: boolean
}

export interface PPMPApprover {
  id: number
  ppmp_id: number
  user_id: number
  approver_role: 'Department Head' | 'BAC' | 'Budget'
  approval_status: 'Pending' | 'Approved' | 'Rejected'
  approval_date: Date
  signature?: string
  remarks?: string
  approval_order: number
}

export interface APP {
  id: number
  app_reference_number: string
  agency_name: string
  fiscal_year: number
  prepared_by: number
  date_prepared: Date
  date_approved?: Date
  approved_by?: number
  ppmp_ids: number[]
  total_quantity_required: number
  total_estimated_cost: number
  implementation_schedule_q1: boolean
  implementation_schedule_q2: boolean
  implementation_schedule_q3: boolean
  implementation_schedule_q4: boolean
  remarks?: string
}

export interface APPApprover {
  id: number
  app_id: number
  user_id: number
  approver_role: 'BAC' | 'HOPE'
  approval_status: 'Pending' | 'Approved' | 'Rejected'
  approval_date: Date
  signature?: string
  remarks?: string
  approval_order: number
}

export interface PurchaseRequest {
  id: number
  ppmp_id: number
  requester_id: number
  request_date: Date
  item_description: string
  quantity: number
  estimated_cost: number
  status: 'Pending' | 'Approved' | 'Rejected'
  approval_date?: Date
}

export interface PurchaseRequestApprover {
  id: number
  purchase_request_id: number
  user_id: number
  approver_role: 'Department Head' | 'BAC' | 'Budget'
  approval_status: 'Pending' | 'Approved' | 'Rejected'
  approval_date: Date
  signature?: string
  remarks?: string
  approval_order: number
}

export interface ProcurementProcess {
  id: number
  purchase_request_id: number
  process_stage: string
  process_order: number
  date_started: Date
  date_completed?: Date
  remarks?: string
}

export interface Contract {
  id: number
  procurement_id: number
  contractor_name: string
  contract_amount: number
  contract_date: Date
  start_date: Date
  end_date: Date
  status: 'Active' | 'Completed' | 'Terminated'
}

export interface InspectionAcceptance {
  id: number
  contract_id: number
  inspected_by: number
  inspection_date: Date
  accepted: boolean
  remarks?: string
}

export interface Payment {
  id: number
  contract_id: number
  obligation_request_date: Date
  disbursement_voucher_date: Date
  payment_date: Date
  amount_paid: number
  payment_method: 'Check' | 'ADA'
  certificate_of_completion_issued: boolean
}

export interface Entity {
  id: number
  name: 'PPMP' | 'PurchaseRequest' | 'APP' | 'ProcurementProcess' | 'Contract' | 'InspectionAcceptance' | 'Payment'
  description?: string
}

export interface AuditTrail {
  id: number
  entity_id: number             // References Entity table for type
  record_id: number             // The ID of the specific record in the entity (e.g., PPMP ID)
  action: 'Created' | 'Updated' | 'Approved' | 'Rejected' | 'Deleted'
  performed_by: number         // User ID who performed the action
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
  entity_id: number             // References Entity table for type
  record_id: number             // The ID of the specific record in the entity
  file_path: string
  uploaded_by: number
  upload_date: Date
}

export interface ProcurementSchedule {
  id: number
  ppmp_id: number
  month: string
  milestone: boolean
  created_at: Date
  updated_at: Date
}
