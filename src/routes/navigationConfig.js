// src/routes/navigationConfig.js
//
// Single source of truth for navigation. Both the Sidebar and AppRoutes
// read from this list, so adding a future module means adding ONE entry
// here (plus its page component) instead of touching multiple files.
//
// `implemented: false` entries automatically render the shared
// "Coming Soon" page until a real page is wired up.

import { PERMISSIONS } from '../utils/permissions';

export const navigationConfig = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'grid',
    permission: PERMISSIONS.DASHBOARD_VIEW,
    implemented: true,
  },
  {
    key: 'patients',
    label: 'Patients',
    path: '/patients',
    icon: 'users',
    permission: PERMISSIONS.PATIENTS_VIEW,
    implemented: false,
  },
  {
    key: 'emr',
    label: 'EMR',
    path: '/emr',
    icon: 'file-text',
    permission: PERMISSIONS.EMR_VIEW,
    implemented: false,
  },
  {
    key: 'laboratory',
    label: 'Laboratory',
    icon: 'flask',
    permission: PERMISSIONS.LAB_TEST_CATALOG_VIEW,
    children: [
      {
        key: 'lab-test-catalog',
        label: 'Test Catalog',
        path: '/laboratory/test-catalog',
        permission: PERMISSIONS.LAB_TEST_CATALOG_VIEW,
        implemented: true,
      },
      {
        key: 'lab-reference-ranges',
        label: 'Reference Ranges',
        path: '/laboratory/reference-ranges',
        permission: PERMISSIONS.LAB_REFERENCE_RANGES_VIEW,
        implemented: true,
      },
      {
        key: 'lab-result-entry',
        label: 'Result Entry',
        path: '/laboratory/result-entry',
        permission: PERMISSIONS.LAB_RESULT_ENTRY,
        implemented: false,
      },
      {
        key: 'lab-verification',
        label: 'Verification',
        path: '/laboratory/verification',
        permission: PERMISSIONS.LAB_RESULT_VERIFICATION,
        implemented: false,
      },
    ],
  },
  {
    key: 'billing',
    label: 'Billing',
    path: '/billing',
    icon: 'credit-card',
    permission: PERMISSIONS.BILLING_VIEW,
    implemented: false,
  },
  {
    key: 'doctors',
    label: 'Doctors',
    path: '/doctors',
    icon: 'stethoscope',
    permission: PERMISSIONS.DOCTORS_VIEW,
    implemented: false,
  },
  {
    key: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'bar-chart',
    permission: PERMISSIONS.REPORTS_VIEW,
    implemented: false,
  },
  {
    key: 'users',
    label: 'Users',
    path: '/users',
    icon: 'user-cog',
    permission: PERMISSIONS.USERS_MANAGE,
    implemented: false,
  },
  {
    key: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'settings',
    permission: PERMISSIONS.SETTINGS_MANAGE,
    implemented: false,
  },
];

/** Flattens the (possibly nested) nav config into a single list of leaf routes. */
export function flattenRoutes(items = navigationConfig) {
  return items.flatMap((item) =>
    item.children ? flattenRoutes(item.children) : item.path ? [item] : []
  );
}

/** Builds a { path: label } map for breadcrumb rendering. */
export function buildBreadcrumbMap(items = navigationConfig, parents = []) {
  let map = {};
  items.forEach((item) => {
    if (item.path) {
      map[item.path] = [...parents, item.label];
    }
    if (item.children) {
      map = { ...map, ...buildBreadcrumbMap(item.children, [...parents, item.label]) };
    }
  });
  return map;
}
