CREATE TABLE ProcurementProcess (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    process_order INT NOT NULL
);

CREATE TABLE ProcurementMode (
    id UUID PRIMARY KEY,
    procurement_process_id UUID REFERENCES ProcurementProcess(id) ON DELETE CASCADE,
    mode_name VARCHAR(255) NOT NULL,
    method VARCHAR(20) CHECK (method IN ('Public', 'Alternative'))
);

CREATE TABLE FundSource (
    id UUID PRIMARY KEY,
    source_name VARCHAR(255) NOT NULL,
    budget_id UUID REFERENCES Budget(id) ON DELETE CASCADE
);

CREATE TABLE Budget (
    id UUID PRIMARY KEY,
    office_id UUID REFERENCES Office(id) ON DELETE CASCADE,
    created_by UUID REFERENCES User(id) ON DELETE SET NULL,
    fiscal_year INT NOT NULL,
    total_budget DECIMAL(18,2) NOT NULL,
    allocated_budget DECIMAL(18,2) NOT NULL,
    used_amount DECIMAL(18,2) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE UserBudget (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES User(id) ON DELETE CASCADE,
    budget_id UUID REFERENCES Budget(id) ON DELETE CASCADE,
    allocated_amount DECIMAL(18,2) NOT NULL,
    used_amount DECIMAL(18,2) NOT NULL,
    date_allocated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PPMP (
    id UUID PRIMARY KEY,
    office_id UUID REFERENCES Office(id) ON DELETE CASCADE,
    app_id UUID REFERENCES APP(id) ON DELETE SET NULL,
    fiscal_year INT NOT NULL,
    approvals_id UUID REFERENCES Approvals(id) ON DELETE CASCADE,
    current_approver_id UUID REFERENCES Approver(id) ON DELETE CASCADE
);

CREATE TABLE PPMPProject (
    id UUID PRIMARY KEY,
    ppmp_id UUID REFERENCES PPMP(id) ON DELETE CASCADE,
    procurement_mode_id UUID REFERENCES ProcurementMode(id) ON DELETE CASCADE,
    prepared_by UUID REFERENCES User(id) ON DELETE CASCADE,
    project_title VARCHAR(255) NOT NULL,
    project_code VARCHAR(255),
    project_description TEXT NOT NULL,
    funding_source_id UUID REFERENCES FundSource(id) ON DELETE CASCADE
);

CREATE TABLE PPMPItem (
    id UUID PRIMARY KEY,
    ppmp_project_id UUID REFERENCES PPMPProject(id) ON DELETE CASCADE,
    technical_specification TEXT NOT NULL,
    quantity_required INT NOT NULL,
    unit_of_measurement VARCHAR(50) NOT NULL,
    estimated_unit_cost DECIMAL(18,2) NOT NULL,
    estimated_total_cost DECIMAL(18,2) NOT NULL
);

CREATE TABLE Approvals (
    id UUID PRIMARY KEY,
    approver_id UUID REFERENCES Approver(id) ON DELETE CASCADE,
    approval_status VARCHAR(20) CHECK (approval_status IN ('Approved', 'Rejected')),
    remarks TEXT,
    signature TEXT
);

CREATE TABLE Approver (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES User(id) ON DELETE CASCADE,
    entity_id INT REFERENCES Entity(id) ON DELETE CASCADE,
    name VARCHAR(50) CHECK (name IN ('Department Head', 'BAC', 'Budget')),
    approval_order INT NOT NULL
);

CREATE TABLE Entity (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) CHECK (name IN ('PPMP', 'PurchaseRequest', 'APP', 'ProcurementProcess', 'Contract', 'InspectionAcceptance', 'Payment')),
    description TEXT
);

CREATE TABLE PPMPSchedule (
    id UUID PRIMARY KEY,
    ppmp_id UUID REFERENCES PPMP(id) ON DELETE CASCADE,
    milestone VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL
);

CREATE TABLE APP (
    id UUID PRIMARY KEY,
    fund_source UUID REFERENCES FundSource(id) ON DELETE CASCADE,
    prepared_by UUID REFERENCES User(id) ON DELETE CASCADE,
    approvals_id UUID REFERENCES Approvals(id) ON DELETE CASCADE,
    fiscal_year INT NOT NULL,
    date_prepared TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_approved TIMESTAMP,
    total_quantity_required INT NOT NULL,
    total_estimated_cost DECIMAL(18,2) NOT NULL
);

CREATE TABLE PurchaseRequest (
    id UUID PRIMARY KEY,
    ppmp_id UUID REFERENCES PPMP(id) ON DELETE CASCADE,
    approvals_id UUID REFERENCES Approvals(id) ON DELETE CASCADE,
    request_date TIMESTAMP NOT NULL
);

CREATE TABLE Department (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE Office (
    id UUID PRIMARY KEY,
    department_id UUID REFERENCES Department(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE User (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    user_type VARCHAR(20) CHECK (user_type IN ('SuperAdmin', 'Admin', 'User')),
    role VARCHAR(50) CHECK (role IN ('End-User', 'BAC', 'Budget', 'Accounting', 'Supply', 'Inspection', 'HOPE')),
    office_id UUID REFERENCES Office(id) ON DELETE CASCADE
);

CREATE TABLE Contract (
    id UUID PRIMARY KEY,
    purchase_request_id UUID REFERENCES PurchaseRequest(id) ON DELETE CASCADE,
    contractor_name VARCHAR(255) NOT NULL,
    contract_amount DECIMAL(18,2) NOT NULL,
    contract_date TIMESTAMP NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Active', 'Completed', 'Terminated'))
);

CREATE TABLE InspectionAcceptance (
    id UUID PRIMARY KEY,
    contract_id UUID REFERENCES Contract(id) ON DELETE CASCADE,
    inspected_by UUID REFERENCES User(id) ON DELETE CASCADE,
    inspection_date TIMESTAMP NOT NULL,
    signature TEXT NOT NULL,
    remarks TEXT
);

CREATE TABLE Payment (
    id UUID PRIMARY KEY,
    contract_id UUID REFERENCES Contract(id) ON DELETE CASCADE,
    obligation_request_date TIMESTAMP NOT NULL,
    disbursement_voucher_date TIMESTAMP NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    amount_paid DECIMAL(18,2) NOT NULL,
    payment_method VARCHAR(10) CHECK (payment_method IN ('Check', 'ADA'))
);

CREATE TABLE AuditTrail (
    id UUID PRIMARY KEY,
    entity_id INT REFERENCES Entity(id) ON DELETE CASCADE,
    record_id UUID NOT NULL,
    approvals_id UUID REFERENCES Approvals(id) ON DELETE CASCADE,
    action VARCHAR(20) CHECK (action IN ('Created', 'Updated', 'Approved', 'Rejected', 'Deleted')),
    performed_by UUID REFERENCES User(id) ON DELETE CASCADE,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT
);

CREATE TABLE Notification (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES User(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Document (
    id SERIAL PRIMARY KEY,
    procurement_process_id UUID REFERENCES ProcurementProcess(id) ON DELETE CASCADE,
    entity_id INT REFERENCES Entity(id) ON DELETE CASCADE,
    record_id INT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES User(id) ON DELETE CASCADE,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
