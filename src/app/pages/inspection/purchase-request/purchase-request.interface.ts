//purchase-request.interface
export interface Signatory {
    name: string;
    designation: string;
}

export interface PurchaseRequestItem {
    itemNo: number;
    unit: string;
    description: string;
    qty: number;
    unitCost: number;
    totalCost: number;
}

export interface PurchaseRequest {
    id: string;
    prNo: string;
    saiNo?: string;
    alobsNo?: string;
    date: Date;
    requisitioningOffice: string;
    ppmpId?: string;
    appId?: string;
    items: PurchaseRequestItem[];
    purpose: string;
    totalAmount: number;
    requestedBy: Signatory;
    recommendedBy: Signatory;
    approvedBy: Signatory;
    certification: Signatory;
    status: 'pending' | 'approved' | 'rejected';
}

export enum PurchaseRequestStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected'
}