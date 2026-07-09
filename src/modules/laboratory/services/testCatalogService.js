// src/modules/laboratory/services/testCatalogService.js
//
// Reuses the EXISTING Firestore collections (tests, departments, units,
// inputTypes) that already contain the clinic's Laboratory Test Catalog.
// This file does not create, seed, or restructure those collections —
// it only reads/writes through the generic firestoreService.

import { createFirestoreService } from '../../../services/firestoreService';

export const testsService = createFirestoreService('tests');
export const departmentsService = createFirestoreService('departments');
export const unitsService = createFirestoreService('units');
export const inputTypesService = createFirestoreService('inputTypes');
