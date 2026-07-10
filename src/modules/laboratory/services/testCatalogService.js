// src/modules/laboratory/services/testCatalogService.js
//
// Reuses the existing Firestore collections (tests, departments, units,
// inputTypes) and adapts them to the imported laboratory data format so the
// UI can read the existing CSV-imported records and also write new tests and
// components back to Firestore in a compatible shape.

import { createFirestoreService } from '../../../services/firestoreService';

const baseTestsService = createFirestoreService('tests');
const baseDepartmentsService = createFirestoreService('departments');
const baseUnitsService = createFirestoreService('units');
const baseInputTypesService = createFirestoreService('inputTypes');

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeComponents(components = [], fallbackId = 'component') {
  return (Array.isArray(components) ? components : []).map((component, index) => ({
    ...component,
    id: component.id || component.componentId || `${fallbackId}-${index + 1}`,
    name: component.name || component.componentName || '',
    unit: component.unit || component.unitName || '',
    inputType: component.inputType || component.inputTypeName || '',
    displayOrder: component.displayOrder ?? index + 1,
    referenceRanges: Array.isArray(component.referenceRanges) ? component.referenceRanges : [],
  }));
}

function normalizeTestRecord(record) {
  if (!record || typeof record !== 'object') return record;

  const components = normalizeComponents(record.components, record.id || record.testId || 'component');

  return {
    ...record,
    id: record.id || record.testId || '',
    code: record.code || record.testId || '',
    name: record.name || record.testName || '',
    departmentId: record.departmentId || record.department || '',
    department: record.department || record.departmentId || '',
    unitId: record.unitId || record.unit || '',
    unit: record.unit || record.unitId || '',
    inputTypeId: record.inputTypeId || record.inputType || '',
    inputType: record.inputType || record.inputTypeId || '',
    price: record.price ?? null,
    active: record.active ?? true,
    hasComponents: record.hasComponents ?? components.length > 0,
    components,
  };
}

function normalizeDepartmentRecord(record) {
  if (!record || typeof record !== 'object') return record;
  const departmentId = record.departmentId || record.id || '';
  return {
    ...record,
    id: record.id || departmentId,
    name: record.name || '',
    departmentId,
  };
}

function normalizeUnitRecord(record) {
  if (!record || typeof record !== 'object') return record;
  const unitCode = record.unitCode || record.id || '';
  return {
    ...record,
    id: record.id || unitCode,
    name: record.name || '',
    unitCode,
  };
}

function normalizeInputTypeRecord(record) {
  if (!record || typeof record !== 'object') return record;
  const inputType = record.inputType || record.name || record.id || '';
  return {
    ...record,
    id: record.id || inputType,
    name: record.name || inputType,
    inputType,
  };
}

function toPersistedTestRecord(data) {
  const components = normalizeComponents(data.components, data.code || data.testId || 'component');
  const departmentId = data.departmentId || data.department || '';
  const unitId = data.unitId || data.unit || '';
  const inputTypeId = data.inputTypeId || data.inputType || '';
  const code = data.code || data.testId || '';

  return {
    ...data,
    name: data.name || '',
    code,
    testId: code,
    department: departmentId,
    departmentId,
    unit: unitId,
    unitId,
    inputType: inputTypeId,
    inputTypeId,
    price: data.price === '' || data.price == null ? null : Number(data.price),
    active: data.active ?? true,
    hasComponents: components.length > 0,
    components,
  };
}

function toPersistedDepartmentRecord(data) {
  const name = data.name || '';
  const departmentId = data.departmentId || data.code || data.id || slugify(name);

  return {
    ...data,
    name,
    departmentId,
  };
}

function toPersistedUnitRecord(data) {
  const name = data.name || '';
  const unitCode = data.unitCode || data.code || data.id || slugify(name);

  return {
    ...data,
    name,
    unitCode,
  };
}

function toPersistedInputTypeRecord(data) {
  const inputType = data.inputType || data.name || data.id || 'Text';
  return {
    ...data,
    name: data.name || inputType,
    inputType,
  };
}

export const testsService = {
  async getAll(options = {}) {
    const records = await baseTestsService.getAll(options);
    return records.map(normalizeTestRecord);
  },
  async getById(id) {
    const record = await baseTestsService.getById(id);
    return record ? normalizeTestRecord(record) : null;
  },
  async create(data) {
    return baseTestsService.create(toPersistedTestRecord(data));
  },
  async update(id, data) {
    return baseTestsService.update(id, toPersistedTestRecord(data));
  },
  async remove(id) {
    return baseTestsService.remove(id);
  },
};

export const departmentsService = {
  async getAll(options = {}) {
    const records = await baseDepartmentsService.getAll(options);
    return records.map(normalizeDepartmentRecord);
  },
  async getById(id) {
    const record = await baseDepartmentsService.getById(id);
    return record ? normalizeDepartmentRecord(record) : null;
  },
  async create(data) {
    return baseDepartmentsService.create(toPersistedDepartmentRecord(data));
  },
  async update(id, data) {
    return baseDepartmentsService.update(id, toPersistedDepartmentRecord(data));
  },
  async remove(id) {
    return baseDepartmentsService.remove(id);
  },
};

export const unitsService = {
  async getAll(options = {}) {
    const records = await baseUnitsService.getAll(options);
    return records.map(normalizeUnitRecord);
  },
  async getById(id) {
    const record = await baseUnitsService.getById(id);
    return record ? normalizeUnitRecord(record) : null;
  },
  async create(data) {
    return baseUnitsService.create(toPersistedUnitRecord(data));
  },
  async update(id, data) {
    return baseUnitsService.update(id, toPersistedUnitRecord(data));
  },
  async remove(id) {
    return baseUnitsService.remove(id);
  },
};

export const inputTypesService = {
  async getAll(options = {}) {
    const records = await baseInputTypesService.getAll(options);
    return records.map(normalizeInputTypeRecord);
  },
  async getById(id) {
    const record = await baseInputTypesService.getById(id);
    return record ? normalizeInputTypeRecord(record) : null;
  },
  async create(data) {
    return baseInputTypesService.create(toPersistedInputTypeRecord(data));
  },
  async update(id, data) {
    return baseInputTypesService.update(id, toPersistedInputTypeRecord(data));
  },
  async remove(id) {
    return baseInputTypesService.remove(id);
  },
};
