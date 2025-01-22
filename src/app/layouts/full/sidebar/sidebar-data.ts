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

  // End User Section
  {
    navCap: 'End User',
    divider: true,
    requiredRoles: ['end-user'], // Only visible to end-user role
  },
  {
    displayName: 'Create Plan',
    iconName: 'solar:documents-broken',
    route: '/enduser/create-plan',
    requiredRoles: ['end-user'], // Only visible to end-user role
  },
  {
    displayName: 'View Plan',
    iconName: 'solar:documents-broken',
    route: '/enduser/view-plan',
    requiredRoles: ['end-user'], // Only visible to end-user role
  },
  {
    displayName: 'Approved Budget',
    iconName: 'solar:documents-broken',
    route: '/enduser/approved-budget',
    requiredRoles: ['end-user'], // Only visible to end-user role
  },
  {
    displayName: 'Plan Tracking',
    iconName: 'solar:documents-broken',
    route: '/enduser/plan-tracking',
    requiredRoles: ['end-user'], // Only visible to end-user role
  },

  // Inspection Section
  {
    navCap: 'Inspection',
    divider: true,
    requiredRoles: ['inspection', 'superadmin'], // Only visible to inspection and superadmin roles
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/inspection/inspection-dashboard',
    requiredRoles: ['inspection','superadmin']
  },
  {
    displayName: 'Purchase Requests',
    iconName: 'solar:documents-broken',
    route: '/inspection/purchase-request',
    requiredRoles: ['inspection','superadmin']
  },
  {
    displayName: 'Receipt Approval',
    iconName: 'solar:documents-broken',
    route: '/inspection/receipt-approval',
    requiredRoles: ['inspection', 'superadmin'], // Only visible to inspection and superadmin roles
  },

  // Supply Unit Section
  {
    navCap: 'Supply Unit',
    divider: true,
    requiredRoles: ['supply', 'superadmin'], // Only visible to supply and superadmin roles
  },
  {
    displayName: 'Delivery Receipts',
    iconName: 'solar:documents-broken',
    route: '/shared/delivery-receipts',
    requiredRoles: ['supply', 'superadmin'], // Only visible to supply and superadmin roles
  },
  {
    displayName: 'Supply Stocking',
    iconName: 'solar:inbox-archive-outline',
    route: '/supply-management/stocking',
    requiredRoles: ['supply', 'superadmin'], // Only visible to supply and superadmin roles
  },
  {
    displayName: 'Delivered Items',
    iconName: 'fluent:check-24-regular',
    route: '/shared/delivered-items',
    requiredRoles: ['supply', 'superadmin'], // Only visible to supply and superadmin roles
  },
  {
    displayName: 'Disbursement Vouchers',
    iconName: 'solar:ticket-sale-broken',
    route: '/shared/disbursement-vouchers',
    requiredRoles: ['supply', 'superadmin'], // Only visible to supply and superadmin roles
  },

    {
    navCap: 'Accounting',
    divider: true,
    requiredRoles: ['admin', 'superadmin'], // Only visible to admin and superadmin roles
  },
  {
    displayName: 'Budget',
    iconName: 'solar:widget-add-line-duotone',
    route: '/accounting/budget',
    requiredRoles: ['admin', 'superadmin'], // Only visible to admin and superadmin roles
  },

  // Admin Section
  {
    navCap: 'Admin',
    divider: true,
    requiredRoles: ['admin', 'superadmin'], // Only visible to admin and superadmin roles
  },
  {
    displayName: 'User Management',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/user-management',
    requiredRoles: ['admin', 'superadmin'], // Only visible to admin and superadmin roles
  },
  {
    displayName: 'Department',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/department',
    requiredRoles: ['admin', 'superadmin'], // Only visible to admin and superadmin roles
  },
  {
    displayName: 'Supplier List',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/supplier-list',
    requiredRoles: ['admin', 'superadmin'], // Only visible to admin and superadmin roles
  },
  {
    displayName: 'Product Type',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/product-type',
    requiredRoles: ['admin', 'superadmin'], // Only visible to admin and superadmin roles
  },
  {
    displayName: 'Approval Sequence',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/approval-sequence',
    requiredRoles: ['admin', 'superadmin'], // Only visible to admin and superadmin roles
  },
  {
    displayName: 'Payment Terms',
    iconName: 'solar:widget-add-line-duotone',
    route: '/admin/payment-terms',
    requiredRoles: ['admin', 'superadmin'], // Only visible to admin and superadmin roles
  },

  // Views Section
  {
    navCap: 'Views',
    divider: true,
    requiredRoles: ['supply', 'admin', 'superadmin'], // Only visible to supply, admin, and superadmin roles
  },
  {
    displayName: 'Inventory',
    iconName: 'solar:box-broken',
    route: '/shared/inventory',
    requiredRoles: ['supply', 'superadmin'], // Only visible to supply and superadmin roles
  },

  // UI Components Section
  {
    navCap: 'Ui Components',
    divider: true,
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

  // Auth Section
  {
    navCap: 'Auth',
    divider: true,
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

  // Extra Section
  {
    navCap: 'Extra',
    divider: true,
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