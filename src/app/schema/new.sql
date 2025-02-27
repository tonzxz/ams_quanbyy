CREATE TABLE procurement_process (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    process_order INTEGER NOT NULL,
    procurement_mode_id TEXT CHECK (procurement_mode_id IN ('Public', 'Alternative')) NOT NULL
);

CREATE TABLE procurement_mode (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mode_name TEXT NOT NULL,
    method TEXT CHECK (method IN ('Public', 'Alternative')) NOT NULL
);

CREATE TABLE fund_source (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name TEXT NOT NULL,
    budget_id UUID NOT NULL REFERENCES budget(id)
);

CREATE TABLE budget (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_id UUID NOT NULL REFERENCES office(id),
    created_by UUID NOT NULL REFERENCES users(id),
    fiscal_year INTEGER NOT NULL,
    total_budget NUMERIC NOT NULL,
    allocated_budget NUMERIC NOT NULL,
    used_amount NUMERIC NOT NULL,
    date_created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_budget (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    budget_id UUID NOT NULL REFERENCES budget(id),
    allocated_amount NUMERIC NOT NULL,
    used_amount NUMERIC NOT NULL,
    date_allocated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ppmp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_id UUID NOT NULL REFERENCES office(id),
    app_id UUID REFERENCES app(id),
    approvals_id UUID NOT NULL REFERENCES approvals(id),
    current_approver_id UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE ppmp_project (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ppmp_id UUID NOT NULL REFERENCES ppmp(id),
    procurement_mode_id UUID NOT NULL REFERENCES procurement_mode(id),
    prepared_by UUID NOT NULL REFERENCES users(id),
    project_title TEXT NOT NULL,
    project_code TEXT,
    project_description TEXT NOT NULL,
    classifications TEXT[],
    funding_source_id UUID NOT NULL REFERENCES budget(id),
    abc NUMERIC,
    contract_scope TEXT,
    fiscal_year INTEGER NOT NULL
);

CREATE TABLE ppmp_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ppmp_project_id UUID NOT NULL REFERENCES ppmp_project(id),
    quantity_required INTEGER NOT NULL,
    unit_of_measurement TEXT NOT NULL,
    estimated_unit_cost NUMERIC NOT NULL,
    estimated_total_cost NUMERIC NOT NULL,
    classification TEXT NOT NULL,
    technical_specification TEXT,
    scope_of_work TEXT,
    terms_of_reference TEXT
);

CREATE TABLE ppmp_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ppmp_id UUID NOT NULL REFERENCES ppmp(id),
    milestone TEXT NOT NULL,
    edit_from TEXT NOT NULL,
    created_by TEXT NOT NULL,
    date TIMESTAMP NOT NULL
);

CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approver_id UUID NOT NULL REFERENCES approver(id),
    approval_status TEXT CHECK (approval_status IN ('Approved', 'Rejected')) NOT NULL,
    remarks TEXT,
    signature TEXT
);

CREATE TABLE approver (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    entity_id UUID NOT NULL REFERENCES entity(id),
    name TEXT CHECK (name IN ('Department Head', 'BAC', 'Budget')) NOT NULL,
    approval_order INTEGER NOT NULL
);

CREATE TABLE entity (
    id SERIAL PRIMARY KEY,
    name TEXT CHECK (name IN ('PPMP', 'PurchaseRequest', 'APP', 'ProcurementProcess', 'Contract', 'InspectionAcceptance', 'Payment')) NOT NULL,
    description TEXT
);

CREATE TABLE app (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_source UUID NOT NULL REFERENCES fund_source(id),
    prepared_by UUID NOT NULL REFERENCES users(id),
    approvals_id UUID NOT NULL REFERENCES approvals(id),
    fiscal_year INTEGER NOT NULL,
    date_prepared TIMESTAMP DEFAULT NOW(),
    date_approved TIMESTAMP,
    total_quantity_required INTEGER NOT NULL,
    total_estimated_cost NUMERIC NOT NULL
);

CREATE TABLE purchase_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ppmp_id UUID NOT NULL REFERENCES ppmp(id),
    approvals_id UUID NOT NULL REFERENCES approvals(id),
    request_date TIMESTAMP NOT NULL
);

CREATE TABLE department (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL
);

CREATE TABLE office (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES department(id),
    name TEXT NOT NULL
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    user_type TEXT CHECK (user_type IN ('SuperAdmin', 'Admin', 'User')) NOT NULL,
    role TEXT CHECK (role IN ('End-User', 'BAC', 'Budget', 'Accounting', 'Supply', 'Inspection', 'HOPE')) NOT NULL,
    office_id UUID NOT NULL REFERENCES office(id)
);

CREATE TABLE contract (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_request_id UUID NOT NULL REFERENCES purchase_request(id),
    contractor_name TEXT NOT NULL,
    contract_amount NUMERIC NOT NULL,
    contract_date TIMESTAMP NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status TEXT CHECK (status IN ('Active', 'Completed', 'Terminated')) NOT NULL
);

CREATE TABLE inspection_acceptance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contract(id),
    inspected_by UUID NOT NULL REFERENCES users(id),
    inspection_date TIMESTAMP NOT NULL,
    signature TEXT NOT NULL,
    remarks TEXT
);

CREATE TABLE payment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contract(id),
    obligation_request_date TIMESTAMP NOT NULL,
    disbursement_voucher_date TIMESTAMP NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    amount_paid NUMERIC NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('Check', 'ADA')) NOT NULL
);

CREATE TABLE audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entity(id),
    record_id UUID NOT NULL,
    approvals_id UUID NOT NULL REFERENCES approvals(id),
    action TEXT CHECK (action IN ('Created', 'Updated', 'Approved', 'Rejected', 'Deleted')) NOT NULL,
    performed_by UUID NOT NULL REFERENCES users(id),
    performed_at TIMESTAMP DEFAULT NOW(),
    remarks TEXT
);

CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE document (
    id SERIAL PRIMARY KEY,
    procurement_process_id UUID NOT NULL REFERENCES procurement_process(id),
    entity_id UUID NOT NULL REFERENCES entity(id), 
    record_id UUID NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    upload_date TIMESTAMP DEFAULT NOW()
);
