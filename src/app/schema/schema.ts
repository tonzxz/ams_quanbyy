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
  procurement_mode_id: number
  funding_source_id: number
  remarks?: string
  approval_status: 'Pending' | 'Approved' | 'Rejected'
  current_approval_stage: string
    schedule: PPMPSchedule[]

}


export interface PPMPSchedule {
  month: string
  milestone: boolean
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

// export class ProcurementProcess {
//   id: string
//   purchase_request_id: string
//   process_stage: string
//   process_order: number
//   date_started: Date
//   date_completed?: Date
//   remarks?: string
// }

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

// export class InspectionAcceptance {
//   id: string
//   contract_id: string
//   inspected_by: number
//   inspection_date: Date
//   accepted: boolean
//   remarks?: string
// }

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


// departments.ts
export class Departments {
  id: string;
  name: string;
}

// offices.ts
export class Offices {
  id: string;
  departmentId: string;
  name: string;
}

// users.ts
export class Users {
  id: string;
  name: string;
  username: string;
  password: string;
  userType: 'SuperAdmin' | 'Admin' | 'User';
  role: 'End-User' | 'BAC' | 'Budget' | 'Accounting' | 'Supply' | 'Inspection' | 'HOPE';
  departmentId?: string;
  officeId?: string;
}

// procurement-modes.ts
export class ProcurementModes {
  id: string;
  modeName: string;
}

// funding-sources.ts
export class FundingSources {
  id: string;
  sourceName: string;
}

// budgets.ts
export class Budgets {
  id: string;
  departmentId: string;
  fiscalYear: number;
  totalBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
  createdBy: string;
  dateCreated: string;
}

// user-budgets.ts
export class UserBudgets {
  id: string;
  userId: string;
  budgetId: string;
  allocatedAmount: number;
  usedAmount: number;
  remainingAmount: number;
  dateAllocated: string;
}

// ppmp.ts
export class Ppmp {
  id: string;
  departmentId: string;
  officeId: string;
  projectTitle: string;
  projectCode: string;
  fiscalYear: number;
  startDate: string;
  endDate: string;
  preparedBy: string;
  datePrepared: string;
  itemDescription: string;
  unitOfMeasurement: string;
  quantityRequired: number;
  estimatedUnitCost: number;
  estimatedTotalCost: number;
  procurementModeId: string;
  fundingSourceId: string;
  remarks: string;
  approvalStatus: string;
  currentApprovalStage: string;
}

// ppmp-approvers.ts
export class PpmpApprovers {
  id: string;
  ppmpId: string;
  userId: string;
  approverRole: string;
  approvalStatus: string;
  approvalDate: string;
  signature: string;
  remarks: string;
  approvalOrder: number;
}

// app.ts
export class App {
  id: string;
  appReferenceNumber: string;
  agencyName: string;
  fiscalYear: number;
  preparedBy: string;
  datePrepared: string;
  dateApproved: string;
  approvedBy: string;
  ppmpIds: string[];
  totalQuantityRequired: number;
  totalEstimatedCost: number;
  implementationScheduleQ1: boolean;
  implementationScheduleQ2: boolean;
  implementationScheduleQ3: boolean;
  implementationScheduleQ4: boolean;
  remarks: string;
}

// app-approvers.ts
export class AppApprovers {
  id: string;
  appId: string;
  userId: string;
  approverRole: string;
  approvalStatus: string;
  approvalDate: string;
  signature: string;
  remarks: string;
  approvalOrder: number;
}

// purchase-requests.ts
export class PurchaseRequests {
  id: string;
  ppmpId: string;
  requesterId: string;
  requestDate: string;
  itemDescription: string;
  quantity: number;
  estimatedCost: number;
  status: string;
  approvalDate: string;
}

// purchase-request-approvers.ts
export class PurchaseRequestApprovers {
  id: string;
  purchaseRequestId: string;
  userId: string;
  approverRole: string;
  approvalStatus: string;
  approvalDate: string;
  signature: string;
  remarks: string;
  approvalOrder: number;
}

// procurement-process.ts
export class ProcurementProcess {
  id: string;
  processStage: string;
  processOrder: number;
}

// contracts.ts
export class Contracts {
  id: string;
  procurementId: string;
  contractorName: string;
  contractAmount: number;
  contractDate: string;
  startDate: string;
  endDate: string;
  status: string;
}

// inspection-acceptance.ts
export class InspectionAcceptance {
  id: string;
  contractId: string;
  inspectionDate: string;
  accepted: boolean;
  remarks: string;
}

// payments.ts
export class Payments {
  id: string;
  contractId: string;
  obligationRequestDate: string;
  disbursementVoucherDate: string;
  paymentDate: string;
  amountPaid: number;
  paymentMethod: 'Check' | 'ADA';
  certificateOfCompletionIssued: boolean;
}
