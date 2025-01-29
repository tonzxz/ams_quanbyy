import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [ 
  // Common Items (No specific roles required)
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/admin-dashboard',
    requiredRoles: ['superadmin', 'admin', 'bac', 'enduser', 'accounting','inspection'],
  },

   {
    navCap: 'Admin',
    divider: true,
    requiredRoles: ['admin', 'superadmin'],
  },
  {
    displayName: 'User Management',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/user-management',
    requiredRoles: ['admin', 'superadmin'],
  },

  {
    displayName: 'Account Setup',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/account-setup',
    requiredRoles: ['admin', 'superadmin'],
  },

   {
    displayName: 'Purchase Order',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/purchase-order-admin',
    requiredRoles: ['admin', 'superadmin'],
  },

  {
    displayName: 'Department',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/department',
    requiredRoles: ['admin', 'superadmin'],
  },
  {
    displayName: 'Supplier List',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/supplier-list',
    requiredRoles: ['admin', 'superadmin'],
  },
  {
    displayName: 'End-User List',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/end-user-list',
    requiredRoles: ['admin', 'superadmin'],
  },
  {
    displayName: 'Product Type',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/product-type',
    requiredRoles: ['admin', 'superadmin'],
  },
  {
    displayName: 'Approval Sequence',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/approval-sequence',
    requiredRoles: ['admin', 'superadmin'],
  },
  {
    displayName: 'Payment Terms',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/payment-terms',
    requiredRoles: ['admin', 'superadmin'],
  },
  {
    displayName: 'Inventory Count',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/inventory',
    requiredRoles: ['admin', 'superadmin'],
  },
  {
    displayName: 'Item Classification',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/item-classification',
    requiredRoles: ['admin', 'superadmin'],
  },
  
  // {
  //   displayName: 'Dashboard',
  //   iconName: 'solar:widget-add-line-duotone',
  //   route: '/enduser/dashboard',
  //   requiredRoles: ['end-user'],
  // },
  // {
  //   displayName: 'Dashboard',
  //   iconName: 'solar:widget-add-line-duotone',
  //   route: '/inspection/inspection-dashboard',
  //   requiredRoles: ['inspection'],
  // },
  // {
  //   displayName: 'Dashboard',
  //   iconName: 'solar:documents-broken',
  //   route: '/supply-management/supply-dashboard',
  //   requiredRoles: ['supply'],
  // },
  // {
  //   displayName: 'Dashboard',
  //   iconName: 'solar:widget-add-line-duotone',
  //   route: '/accounting/accounting-dashboard',
  //   requiredRoles: ['accounting'],
  // },
  // {
  //   displayName: 'Dashboard',
  //   iconName: 'solar:checklist-minimalistic-line-duotone',
  //   route: '/bac/bac-dashboard',
  //   requiredRoles: ['bac'],
  // },
  // {
  //   displayName: 'Dashboard',
  //   iconName: 'solar:widget-add-line-duotone',
  //   route: '/dashboard',
  // },
  {
    displayName: 'Approvals',
    iconName: 'solar:widget-add-line-duotone',
    route: '/shared/approvals',
    requiredRoles: ['end-user' , 'bac', 'accounting','supply', 'caf', 'president', 'inspection'],

  },

 
  {
    displayName: 'Request for Quotation',
    iconName: 'solar:widget-add-line-duotone',
    route: '/shared/rfq-list',
    requiredRoles: ['bac'],
  },

    {
    displayName: 'Purchase Orders',
    iconName: 'solar:checklist-minimalistic-line-duotone',
    route: '/bac/purchase-orders',
      requiredRoles: ['bac'],
    
  },
  
  // {
  //   displayName: 'Disbursement Template',
  //   iconName: 'solar:widget-add-line-duotone',
  //   route: '/shared/disbursement',
  // },
  // {
  //   displayName: 'Stock-Card Template',
  //   iconName: 'solar:widget-add-line-duotone',
  //   route: '/shared/stock-card',
  // },
  // {
  //   displayName: 'Requisition and Issue Slip',
  //   iconName: 'solar:widget-add-line-duotone',
  //   route: '/shared/ris',
  // },
  // {
  //   displayName: 'Semi-Expendable',
  //   iconName: 'solar:widget-add-line-duotone',
  //   route: '/shared/semi-expendable',
  // },

 
  
  // {
  //   displayName: 'Notice to Proceed',
  //   iconName: 'solar:widget-add-line-duotone',
  //   route: '/shared/ntp',
  // },
  // {
  //   displayName: 'Purchase Request',
  //   iconName: 'solar:widget-add-line-duotone',
  //   route: '/shared/purchase-req',
  // },

  // End User Section
  
  {
    displayName: 'Requisition and Issue Slip',
    iconName: 'solar:documents-broken',
    route: '/enduser/requisition',
    requiredRoles: ['end-user'],
  },


  {
    displayName: 'Canvassing',
    iconName: 'solar:documents-broken',
    route: '/shared/rfq-list',
    requiredRoles: ['end-user'],
  },
  {
    displayName: 'Delivery',
    iconName: 'solar:inbox-archive-outline',
    route: '/supply-management/stocking',
    requiredRoles: ['end-user'],
  },
  {
    displayName: 'Approval Receiving',
    iconName: 'solar:documents-broken',
    route: '/enduser/receiving',
    requiredRoles: ['end-user'],
  },
  {
    displayName: 'Special Receiving',
    iconName: 'solar:documents-broken',
    route: '/enduser/special-receiving',
    requiredRoles: ['end-user','supply'],
  },

  

  // Inspection Section
  {
    navCap: 'Inspection',
    divider: true,
    requiredRoles: ['inspection'],
  },
  {
    displayName: 'Purchase Requests',
    iconName: 'solar:documents-broken',
    route: '/inspection/purchase-request',
    requiredRoles: ['inspection'],
  },
  {
    displayName: 'Receipt Approval',
    iconName: 'solar:documents-broken',
    route: '/inspection/receipt-approval',
    requiredRoles: ['inspection'],
  },

  // Supply Unit Section
  {
    navCap: 'Supply Unit',
    divider: true,
    requiredRoles: ['supply'],
  },
  {
    displayName: 'Delivery Receipts',
    iconName: 'solar:documents-broken',
    route: '/shared/delivery-receipts',
    requiredRoles: ['supply'],
  },
  {
    displayName: 'Supply Stocking',
    iconName: 'solar:inbox-archive-outline',
    route: '/supply-management/stocking',
    requiredRoles: ['supply'],
  },
  {
    displayName: 'Stock Transfer',
    iconName: 'solar:documents-broken',
    route: '/shared/stock-transfer',
    requiredRoles: ['supply'],
  },
  // {
  //   displayName: 'Delivery',
  //   iconName: 'solar:inbox-archive-outline',
  //   route: '/supply-management/delivery',
  //   requiredRoles: ['supply'],
  // },
  // {
  //   displayName: 'Delivered Items',
  //   iconName: 'fluent:check-24-regular',
  //   route: '/shared/delivered-items',
  //   requiredRoles: ['supply'],
  // },
  {
    displayName: 'Disbursement Vouchers',
    iconName: 'solar:ticket-sale-broken',
    route: '/shared/disbursement-vouchers',
    requiredRoles: ['supply'],
  },


 
  // Accounting Section
  {
    navCap: 'Accounting',
    divider: true,
    requiredRoles: [ 'accounting'],
  },
  {
    displayName: 'Budget',
    iconName: 'solar:widget-add-line-duotone',
    route: '/accounting/budget',
    requiredRoles: ['accounting'],
  },

  {
    displayName: 'Purchase Request Approval',
    iconName: 'solar:widget-add-line-duotone',
    route: '/accounting/pr-approval',
    requiredRoles: ['accounting'],
  },

   {
    displayName: 'Issue Slip',
    iconName: 'solar:widget-add-line-duotone',
    route: '/accounting/issue-slip',
    requiredRoles: ['accounting'],
  },
   

  {
    displayName: 'Budget Utilization Report',
    iconName: 'solar:widget-add-line-duotone',
    route: '/shared/rfq-list',
    requiredRoles: ['accounting'],
  },


  {
    displayName: 'Classification',
    iconName: 'solar:ticket-sale-broken',
    route: '/accounting/classification',
    requiredRoles: [ 'accounting'],
  },
  {
    displayName: 'Voucher Review',
    iconName: 'solar:ticket-sale-broken',
    route: '/accounting/voucher-review',
    requiredRoles: [ 'accounting'],
  },
  {
    displayName: 'Journal Entry Voucher',
    iconName: 'solar:ticket-sale-broken',
    route: '/accounting/journal-entry-voucher',
    requiredRoles: [ 'accounting'],
  },
  

  {
    displayName: 'General Ledger',
    iconName: 'solar:ticket-sale-broken',
    route: '/accounting/general-ledger',
    requiredRoles: [ 'accounting'],
  },
  {
    displayName: 'General Journal',
    iconName: 'solar:ticket-sale-broken',
    route: '/accounting/general-journal',
    requiredRoles: [ 'accounting'],
  },
  {
    displayName: 'Final Verification',
    iconName: 'solar:ticket-sale-broken',
    route: '/accounting/final-verification',
    requiredRoles: [ 'accounting'],
  },

  // Admin Section
 

  // Views Section
  

  // BAC Section
  {
    navCap: 'BAC',
    divider: true,
    requiredRoles: ['bac'],
  },
  
  // {
  //   displayName: 'Validate Approved Request',
  //   iconName: 'solar:checklist-minimalistic-line-duotone',
  //   route: '/bac/validate-approved-request',
  //   requiredRoles: ['bac'],
  // },
   {
    displayName: 'Approved Purchase Request',
    iconName: 'solar:checklist-minimalistic-line-duotone',
    route: '/bac/approved-purchase-requests',
    requiredRoles: ['bac'],
  },
   
    {
    displayName: 'Abstract of Quotations Template',
    iconName: 'solar:checklist-minimalistic-line-duotone',
    route: '/shared/aoq',
    requiredRoles: ['bac'],
  },
  // {
  //   displayName: 'Prepare Purchase Orders',
  //   iconName: 'solar:document-add-line-duotone',
  //   route: '/bac/prepare-purchase-orders',
  //   requiredRoles: ['bac'],
  // },
  //  {
  //   navCap: 'President',
  //   divider: true,
  //   requiredRoles: ['president'],
  // },
  //   {
  //   displayName: 'Approvals',
  //   iconName: 'solar:widget-add-line-duotone',
  //   route: '/shared/approvals',
  // },
    
     {
    navCap: 'Reports Generation',
    divider: true,
    requiredRoles: ['supply'],
  },
  {
    displayName: 'RSMI',
    iconName: 'solar:ticket-sale-broken',
    route: '/supply-management/rsmi',
    requiredRoles: ['supply'],
  },
  {
    displayName: 'PAR',
    iconName: 'solar:ticket-sale-broken',
    route: '/supply-management/par',
    requiredRoles: ['supply'],
  },
  {
    displayName: 'ICS',
    iconName: 'solar:ticket-sale-broken',
    route: '/supply-management/ics',
    requiredRoles: ['supply'],
  },
  {
    displayName: 'Compile Reports',
    iconName: 'solar:ticket-sale-broken',
    route: '/supply-management/compile-reports',
    requiredRoles: ['supply'],
  },


  {
    navCap: 'Views',
    divider: true,
    requiredRoles: ['supply', 'bac', 'president', 'end-user', 'inspection'],
  },
  {
    displayName: 'Inventory',
    iconName: 'solar:box-broken',
    route: '/shared/inventory',
    requiredRoles: ['supply', 'bac', 'president', 'end-user', 'inspection'],
  },
 
];

  // UI Components Section (No specific roles required)
  // {
  //   navCap: 'Ui Components',
  //   divider: true,
  // },
  // {
  //   displayName: 'Badge',
  //   iconName: 'solar:archive-minimalistic-line-duotone',
  //   route: '/ui-components/badge',
  // },
  // {
  //   displayName: 'Chips',
  //   iconName: 'solar:danger-circle-line-duotone',
  //   route: '/ui-components/chips',
  // },
  // {
  //   displayName: 'Lists',
  //   iconName: 'solar:bookmark-square-minimalistic-line-duotone',
  //   route: '/ui-components/lists',
  // },
  // {
  //   displayName: 'Menu',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/ui-components/menu',
  // },
  // {
  //   displayName: 'Tooltips',
  //   iconName: 'solar:text-field-focus-line-duotone',
  //   route: '/ui-components/tooltips',
  // },
  // {
  //   displayName: 'Forms',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/ui-components/forms',
  // },
  // {
  //   displayName: 'Tables',
  //   iconName: 'solar:tablet-line-duotone',
  //   route: '/ui-components/tables',
  // },

  // Auth Section (No specific roles required)
  // {
  //   navCap: 'Auth',
  //   divider: true,
  // },
  // {
  //   displayName: 'Login',
  //   iconName: 'solar:login-3-line-duotone',
  //   route: '/authentication/login',
  // },
  // {
  //   displayName: 'Register',
  //   iconName: 'solar:user-plus-rounded-line-duotone',
  //   route: '/authentication/register',
  // },

  // Extra Section (No specific roles required)
  // {
  //   navCap: 'Extra',
  //   divider: true,
  // },
  // {
  //   displayName: 'Icons',
  //   iconName: 'solar:sticker-smile-circle-2-line-duotone',
  //   route: '/extra/icons',
  // },
  // {
  //   displayName: 'Sample Page',
  //   iconName: 'solar:planet-3-line-duotone',
  //   route: '/extra/sample-page',
  // },

