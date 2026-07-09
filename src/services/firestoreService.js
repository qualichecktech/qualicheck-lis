// src/services/firestoreService.js
//
// A generic, reusable CRUD wrapper around Firestore. Every module (Patients,
// EMR, Lab, Billing, etc.) should call createFirestoreService(collectionName)
// instead of writing its own getDocs/addDoc/etc. boilerplate. This keeps
// Firestore access patterns consistent and makes it trivial to add
// query caching, soft-deletes, or audit logging later in one place.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as fsLimit,
  startAfter,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Creates a set of CRUD helpers scoped to a single Firestore collection.
 *
 * @param {string} collectionName - name of the existing Firestore collection
 */
export function createFirestoreService(collectionName) {
  const colRef = collection(db, collectionName);

  return {
    /** Get a single document by id. Returns null if it doesn't exist. */
    async getById(id) {
      const snap = await getDoc(doc(db, collectionName, id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    /**
     * Get a list of documents.
     * options: { where: [[field, op, value]], orderBy: [field, dir], limit, cursor }
     */
    async getAll(options = {}) {
      const clauses = [];
      (options.where || []).forEach(([field, op, value]) => {
        clauses.push(where(field, op, value));
      });
      if (options.orderBy) {
        const [field, dir = 'asc'] = options.orderBy;
        clauses.push(orderBy(field, dir));
      }
      if (options.cursor) {
        clauses.push(startAfter(options.cursor));
      }
      if (options.limit) {
        clauses.push(fsLimit(options.limit));
      }

      const q = clauses.length ? query(colRef, ...clauses) : colRef;
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },

    /** Create a new document. Automatically stamps createdAt/updatedAt. */
    async create(data) {
      const ref = await addDoc(colRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return ref.id;
    },

    /** Update an existing document by id. Automatically stamps updatedAt. */
    async update(id, data) {
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },

    /** Hard-delete a document by id. */
    async remove(id) {
      await deleteDoc(doc(db, collectionName, id));
    },
  };
}
