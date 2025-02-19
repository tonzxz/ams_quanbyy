-- -- Enable the uuid-ossp extension for generating UUIDs
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Entity Table (Referenced by multiple tables)
CREATE TABLE Entity (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) CHECK (name IN ('PPMP', 'PurchaseRequest', 'APP', 'ProcurementProcess', 'Contract', 'InspectionAcceptance', 'Payment')),
    description TEXT
);

-- Department Table (Referenced by Office)
CREATE TABLE Department (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL
);

-- Office Table (Referenced by multiple tables)
CREATE TABLE Office (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES Department(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

-- User Table (Referenced by multiple tables)
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    user_type VARCHAR(20) CHECK (user_type IN ('SuperAdmin', 'Admin', 'User')),
    role VARCHAR(50) CHECK (role IN ('End-User', 'BAC', 'Budget', 'Accounting', 'Supply', 'Inspection', 'HOPE')),
    office_id UUID REFERENCES Office(id) ON DELETE CASCADE
);

-- Procurement Process Table
CREATE TABLE ProcurementProcess (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    process_order INT NOT NULL
);

-- Procurement Mode Table
CREATE TABLE ProcurementMode (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procurement_process_id UUID REFERENCES ProcurementProcess(id) ON DELETE CASCADE,
    mode_name VARCHAR(255) NOT NULL,
    method VARCHAR(20) CHECK (method IN ('Public', 'Alternative'))
);

-- Budget Table
CREATE TABLE Budget (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    office_id UUID REFERENCES Office(id) ON DELETE CASCADE,
    created_by UUID REFERENCES Users(id) ON DELETE SET NULL,
    fiscal_year INT NOT NULL,
    total_budget DECIMAL(18,2) NOT NULL,
    allocated_budget DECIMAL(18,2) NOT NULL,
    used_amount DECIMAL(18,2) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fund Source Table
CREATE TABLE FundSource (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_name VARCHAR(255) NOT NULL,
    budget_id UUID REFERENCES Budget(id) ON DELETE CASCADE
);

-- Approver Table
CREATE TABLE Approver (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    entity_id INT REFERENCES Entity(id) ON DELETE CASCADE,
    name VARCHAR(50) CHECK (name IN ('Department Head', 'BAC', 'Budget')),
    approval_order INT NOT NULL
);

-- Approvals Table
CREATE TABLE Approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    approver_id UUID REFERENCES Approver(id) ON DELETE CASCADE,
    approval_status VARCHAR(20) CHECK (approval_status IN ('Approved', 'Rejected')),
    remarks TEXT,
    signature TEXT
);

-- APP Table
CREATE TABLE APP (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fund_source UUID REFERENCES FundSource(id) ON DELETE CASCADE,
    prepared_by UUID REFERENCES Users(id) ON DELETE CASCADE,
    approvals_id UUID REFERENCES Approvals(id) ON DELETE CASCADE,
    fiscal_year INT NOT NULL,
    date_prepared TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_approved TIMESTAMP,
    total_quantity_required INT NOT NULL,
    total_estimated_cost DECIMAL(18,2) NOT NULL
);

-- PPMP Table
CREATE TABLE PPMP (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    office_id UUID REFERENCES Office(id) ON DELETE CASCADE,
    app_id UUID REFERENCES APP(id) ON DELETE SET NULL,
    fiscal_year INT NOT NULL,
    approvals_id UUID REFERENCES Approvals(id) ON DELETE CASCADE,
    current_approver_id UUID REFERENCES Approver(id) ON DELETE CASCADE
);

-- PPMP Project Table
CREATE TABLE PPMPProject (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ppmp_id UUID REFERENCES PPMP(id) ON DELETE CASCADE,
    procurement_mode_id UUID REFERENCES ProcurementMode(id) ON DELETE CASCADE,
    prepared_by UUID REFERENCES Users(id) ON DELETE CASCADE,
    project_title VARCHAR(255) NOT NULL,
    project_code VARCHAR(255),
    classification VARCHAR(255) NOT NULL,
    project_description TEXT NOT NULL,
    funding_source_id UUID REFERENCES FundSource(id) ON DELETE CASCADE
);

-- PPMP Item Table
CREATE TABLE PPMPItem (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ppmp_project_id UUID REFERENCES PPMPProject(id) ON DELETE CASCADE,
    technical_specification TEXT NOT NULL,
    quantity_required INT NOT NULL,
    unit_of_measurement VARCHAR(50) NOT NULL,
    estimated_unit_cost DECIMAL(18,2) NOT NULL,
    estimated_total_cost DECIMAL(18,2) NOT NULL
);

-- PPMP Schedule Table
CREATE TABLE PPMPSchedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ppmp_id UUID REFERENCES PPMP(id) ON DELETE CASCADE,
    milestone VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL
);

-- Purchase Request Table
CREATE TABLE PurchaseRequest (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ppmpproject_id UUID REFERENCES PPMPProject(id) ON DELETE CASCADE,
    approvals_id UUID REFERENCES Approvals(id) ON DELETE CASCADE,
    request_date TIMESTAMP NOT NULL
);

-- Contract Table
CREATE TABLE Contract (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_request_id UUID REFERENCES PurchaseRequest(id) ON DELETE CASCADE,
    contractor_name VARCHAR(255) NOT NULL,
    contract_amount DECIMAL(18,2) NOT NULL,
    contract_date TIMESTAMP NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Active', 'Completed', 'Terminated'))
);

-- Inspection Acceptance Table
CREATE TABLE InspectionAcceptance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES Contract(id) ON DELETE CASCADE,
    inspected_by UUID REFERENCES Users(id) ON DELETE CASCADE,
    inspection_date TIMESTAMP NOT NULL,
    signature TEXT NOT NULL,
    remarks TEXT
);

-- Payment Table
CREATE TABLE Payment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES Contract(id) ON DELETE CASCADE,
    obligation_request_date TIMESTAMP NOT NULL,
    disbursement_voucher_date TIMESTAMP NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    amount_paid DECIMAL(18,2) NOT NULL,
    payment_method VARCHAR(10) CHECK (payment_method IN ('Check', 'ADA'))
);

-- User Budget Table
CREATE TABLE UserBudget (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    budget_id UUID REFERENCES Budget(id) ON DELETE CASCADE,
    allocated_amount DECIMAL(18,2) NOT NULL,
    used_amount DECIMAL(18,2) NOT NULL,
    date_allocated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Trail Table
CREATE TABLE AuditTrail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id INT REFERENCES Entity(id) ON DELETE CASCADE,
    record_id UUID NOT NULL,
    approvals_id UUID REFERENCES Approvals(id) ON DELETE CASCADE,
    action VARCHAR(20) CHECK (action IN ('Created', 'Updated', 'Approved', 'Rejected', 'Deleted')),
    performed_by UUID REFERENCES Users(id) ON DELETE CASCADE,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT
);

-- Notification Table
CREATE TABLE Notification (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Table
CREATE TABLE Document (
    id SERIAL PRIMARY KEY,
    procurement_process_id UUID REFERENCES ProcurementProcess(id) ON DELETE CASCADE,
    entity_id INT REFERENCES Entity(id) ON DELETE CASCADE,
    record_id UUID NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES Users(id) ON DELETE CASCADE,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ICS Table
CREATE TABLE ics (
    ics_no VARCHAR(50) PRIMARY KEY,
    entity_name VARCHAR(255) NOT NULL,
    fund_cluster VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    inventory_item_no VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    description TEXT,
    estimated_useful_life VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
