// src/utils/permissions.js
//
// Central, expandable definition of roles and permissions.
// Nothing in the rest of the app hardcodes role checks — pages and nav
// items declare which PERMISSIONS they require, and each role is mapped
// to a set of permissions here. Adding a new role or permission later
// only means editing this file.

// Roles the system currently knows about. Add new roles here as needed.
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMINISTRATOR: 'administrator',
  MEDICAL_TECHNOLOGIST: 'medical_technologist',
  PATHOLOGIST: 'pathologist',
  RECEPTIONIST: 'receptionist',
  CASHIER: 'cashier',
  DOCTOR: 'doctor',
};

// Fine-grained permissions. Group by module using a `module:action` shape
// so it stays readable as more modules are added.
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard:view',

  PATIENTS_VIEW: 'patients:view',
  PATIENTS_MANAGE: 'patients:manage',

  EMR_VIEW: 'emr:view',
  EMR_MANAGE: 'emr:manage',

  LAB_TEST_CATALOG_VIEW: 'lab:test_catalog:view',
  LAB_TEST_CATALOG_MANAGE: 'lab:test_catalog:manage',
  LAB_REFERENCE_RANGES_VIEW: 'lab:reference_ranges:view',
  LAB_REFERENCE_RANGES_MANAGE: 'lab:reference_ranges:manage',
  LAB_RESULT_ENTRY: 'lab:result_entry',
  LAB_RESULT_VERIFICATION: 'lab:result_verification',
  LAB_RESULT_RELEASE: 'lab:result_release',

  BILLING_VIEW: 'billing:view',
  BILLING_MANAGE: 'billing:manage',
  PAYMENTS_MANAGE: 'payments:manage',

  DOCTORS_VIEW: 'doctors:view',
  DOCTORS_MANAGE: 'doctors:manage',

  REPORTS_VIEW: 'reports:view',

  USERS_MANAGE: 'users:manage',
  SETTINGS_MANAGE: 'settings:manage',
  AUDIT_LOGS_VIEW: 'audit_logs:view',
};

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

// Maps each role to the permissions it holds. Super Admin always gets
// everything automatically (see hasPermission below), so it isn't
// duplicated here.
export const ROLE_PERMISSIONS = {
  [ROLES.ADMINISTRATOR]: ALL_PERMISSIONS,

  [ROLES.MEDICAL_TECHNOLOGIST]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PATIENTS_VIEW,
    PERMISSIONS.LAB_TEST_CATALOG_VIEW,
    PERMISSIONS.LAB_REFERENCE_RANGES_VIEW,
    PERMISSIONS.LAB_RESULT_ENTRY,
  ],

  [ROLES.PATHOLOGIST]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PATIENTS_VIEW,
    PERMISSIONS.LAB_TEST_CATALOG_VIEW,
    PERMISSIONS.LAB_REFERENCE_RANGES_VIEW,
    PERMISSIONS.LAB_RESULT_VERIFICATION,
    PERMISSIONS.LAB_RESULT_RELEASE,
    PERMISSIONS.REPORTS_VIEW,
  ],

  [ROLES.RECEPTIONIST]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PATIENTS_VIEW,
    PERMISSIONS.PATIENTS_MANAGE,
    PERMISSIONS.DOCTORS_VIEW,
  ],

  [ROLES.CASHIER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.BILLING_VIEW,
    PERMISSIONS.BILLING_MANAGE,
    PERMISSIONS.PAYMENTS_MANAGE,
  ],

  [ROLES.DOCTOR]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PATIENTS_VIEW,
    PERMISSIONS.EMR_VIEW,
    PERMISSIONS.EMR_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
  ],
};

/**
 * Returns true if the given role has the given permission.
 * Super Admin implicitly has every permission.
 */
export function hasPermission(role, permission) {
  if (!role || !permission) return false;
  if (role === ROLES.SUPER_ADMIN) return true;
  const granted = ROLE_PERMISSIONS[role] || [];
  return granted.includes(permission);
}

/**
 * Returns true if the given role has at least one of the listed permissions.
 */
export function hasAnyPermission(role, permissions = []) {
  return permissions.some((p) => hasPermission(role, p));
}
