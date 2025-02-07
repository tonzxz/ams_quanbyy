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
  id: number
  department_id: number
  office_id: number
  project_title: string
  project_code?: string
  fiscal_year: number
  start_date: Date
  end_date: Date
  prepared_by: string
  date_prepared: Date
  item_description: string
  unit_of_measurement: string
  quantity_required: number
  estimated_unit_cost: number
  estimated_total_cost: number
  procurement_mode_id: number
  funding_source_id: number
  remarks?: string
  approval_status: 'Pending' | 'Approved' | 'Rejected'
  current_approval_stage: string
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
