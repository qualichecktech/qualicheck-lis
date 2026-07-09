// src/modules/laboratory/services/referenceRangeService.js
//
// Reference ranges are a NEW piece of data this module owns (they don't
// exist in Firestore yet). Kept in their own collection, keyed by testId,
// so the existing `tests` collection/schema is never modified.

import { createFirestoreService } from '../../../services/firestoreService';

export const referenceRangesService = createFirestoreService('referenceRanges');
