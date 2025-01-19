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
    displayName: 'Pending PRs',
    iconName: 'solar:documents-broken',
    route: '/shared/delivery-receipts',
    requiredRoles: ['inspection','superadmin']
  },
  {
    displayName: 'Validated PRs',
    iconName: 'solar:documents-broken',
    route: '/pages/inspection/validated-pr',
    requiredRoles: ['inspection','superadmin']
  },
  {
    displayName: 'Rejected',
    iconName: 'solar:documents-broken',
    route: '/shared/delivery-receipts',
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
    displayName: 'Purchase Orders',
    iconName: 'solar:inbox-archive-outline',
    route: '/supply-unit/purchase-orders',
    requiredRoles: ['supply','superadmin']
  },
  {
    displayName: 'Assets',
    iconName: 'solar:box-broken',
    route: '/shared/assets',
    requiredRoles: ['supply','superadmin'],
  },
  {
    displayName: 'Disbursement Vouchers',
    iconName: 'solar:ticket-sale-broken',
    route: '/shared/disbursement-vouchers',
    requiredRoles: ['supply','superadmin']
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
  {
    displayName: 'Validated',
    iconName: 'solar:planet-3-line-duotone',
    route: '/extra/validated',
  },
  {
    displayName: 'Rejected',
    iconName: 'solar:planet-3-line-duotone',
    route: '/extra/rejected',
  },
];
