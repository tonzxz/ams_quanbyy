import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  },
  {
    navCap: 'Inspection',
    divider: true,
    requiredRoles:['inspection','superadmin']
  },
  {
    displayName: 'Purchase Requests',
    iconName: 'solar:documents-broken',
    route: '/inspection/purchase-request/purchase-request',
    requiredRoles: ['inspection','superadmin']
  },
  {
    displayName: 'Receipt Approval',
    iconName: 'solar:documents-broken',
    route: '/inspection/receipt-approval',
    requiredRoles: ['inspection','superadmin']
  },
  {
    navCap: 'Supply Unit',
    divider: true,
    requiredRoles:['supply','superadmin']
  },
  {
    displayName: 'Delivery Receipts',
    iconName: 'solar:documents-broken',
    route: '/shared/delivery-receipts',
    requiredRoles: ['supply','superadmin']
  },
  {
    displayName: 'Supply Stocking',
    iconName: 'solar:inbox-archive-outline',
    route: '/supply-management/stocking',
    requiredRoles: ['supply','superadmin']
  },
  {
    displayName: 'Delivered Items',
    iconName: 'fluent:check-24-regular',
    route: '/shared/delivered-items',
    requiredRoles: ['supply','superadmin']
  },
  {
    displayName: 'Disbursement Vouchers',
    iconName: 'solar:ticket-sale-broken',
    route: '/shared/disbursement-vouchers',
    requiredRoles: ['supply','superadmin']
  },

   {
    navCap: 'Accounting',
    divider: true,
    requiredRoles:['supply', 'admin','superadmin']
  },

  {
    displayName: 'Budget',
    iconName: 'solar:box-broken',
    route: '/accounting/budget',
    requiredRoles: ['supply','superadmin'],
  },
  

  
  {
    navCap: 'Admin',
    divider: true,
    requiredRoles:['admin','superadmin']
  },
  {
    displayName: 'User Management',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/user-management', 
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
    navCap: 'Views',
    divider: true,
    requiredRoles:['supply', 'admin','superadmin']
  },

  {
    displayName: 'Inventory',
    iconName: 'solar:box-broken',
    route: '/shared/inventory',
    requiredRoles: ['supply','superadmin'],
  },
  {
    navCap: 'Ui Components',
    divider: true
  },
  {
    displayName: 'Badge',
    iconName: 'solar:archive-minimalistic-line-duotone',
    route: '/ui-components/badge',
  },
  {
    displayName: 'Chips',
    iconName: 'solar:danger-circle-line-duotone',
    route: '/ui-components/chips',
  },
  {
    displayName: 'Lists',
    iconName: 'solar:bookmark-square-minimalistic-line-duotone',
    route: '/ui-components/lists',
  },
  {
    displayName: 'Menu',
    iconName: 'solar:file-text-line-duotone',
    route: '/ui-components/menu',
  },
  {
    displayName: 'Tooltips',
    iconName: 'solar:text-field-focus-line-duotone',
    route: '/ui-components/tooltips',
  },
  {
    displayName: 'Forms',
    iconName: 'solar:file-text-line-duotone',
    route: '/ui-components/forms',
  },
  {
    displayName: 'Tables',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/tables',
  },
  {
    navCap: 'Auth',
    divider: true
  },
  {
    displayName: 'Login',
    iconName: 'solar:login-3-line-duotone',
    route: '/authentication/login',
  },
  {
    displayName: 'Register',
    iconName: 'solar:user-plus-rounded-line-duotone',
    route: '/authentication/register',
  },
  {
    navCap: 'Extra',
    divider: true
  },
  {
    displayName: 'Icons',
    iconName: 'solar:sticker-smile-circle-2-line-duotone',
    route: '/extra/icons',
  },
  {
    displayName: 'Sample Page',
    iconName: 'solar:planet-3-line-duotone',
    route: '/extra/sample-page',
  },
];
