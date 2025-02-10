// src/app/schema/schema.ts

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
  department_id: string
  office_id: string
}

export class ProcurementMode {
  id: string
  mode_name: string
}

export class FundingSource {
  id: string
  source_name: string
}

export class Budget {
  id: string
  department_id: string
  fiscal_year: number
  total_budget: number
  allocated_budget: number
  remaining_budget: number
  created_by: number
  date_created: Date
}

export class UserBudget {
  id: string
  user_id: string
  budget_id: string
  allocated_amount: number
  used_amount: number
  remaining_amount: number
  date_allocated: Date
}

export class PPMP {
  id: string
  department_id: string
  office_id: string
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
  procurement_mode_id: string
  funding_source_id: string
  remarks?: string
  approval_status: 'Pending' | 'Approved' | 'Rejected'
  current_approval_stage: string
}

export class PPMPApprover {
  id: string
  ppmp_id: string
  user_id: string
  approver_role: 'Department Head' | 'BAC' | 'Budget'
  approval_status: 'Pending' | 'Approved' | 'Rejected'
  approval_date: Date
  signature?: string
  remarks?: string
  approval_order: number
}

export class APP {
  id: string
  app_reference_number: string
  agency_name: string
  fiscal_year: number
  prepared_by: number
  date_prepared: Date
  date_approved?: Date
  approved_by?: number
  ppmp_ids: string[]
  total_quantity_required: number
  total_estimated_cost: number
  implementation_schedule_q1: boolean
  implementation_schedule_q2: boolean
  implementation_schedule_q3: boolean
  implementation_schedule_q4: boolean
  remarks?: string
}

export class APPApprover {
  id: string
  app_id: string
  user_id: string
  approver_role: 'BAC' | 'HOPE'
  approval_status: 'Pending' | 'Approved' | 'Rejected'
  approval_date: Date
  signature?: string
  remarks?: string
  approval_order: number
}

export class PurchaseRequest {
  id: string
  ppmp_id: string
  requester_id: string
  request_date: Date
  item_description: string
  quantity: number
  estimated_cost: number
  status: 'Pending' | 'Approved' | 'Rejected'
  approval_date?: Date
}

export class PurchaseRequestApprover {
  id: string
  purchase_request_id: string
  user_id: string
  approver_role: 'Department Head' | 'BAC' | 'Budget'
  approval_status: 'Pending' | 'Approved' | 'Rejected'
  approval_date: Date
  signature?: string
  remarks?: string
  approval_order: number
}

export class ProcurementProcess {
  id: string
  purchase_request_id: string
  process_stage: string
  process_order: number
  date_started: Date
  date_completed?: Date
  remarks?: string
}

export class Contract {
  id: string
  procurement_id: string
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
  accepted: boolean
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
  certificate_of_completion_issued: boolean
} 
