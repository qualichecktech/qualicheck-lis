// src/modules/laboratory/pages/TestCatalog.jsx
//
// Reads/writes the EXISTING `tests` collection (plus the existing
// `departments`, `units`, and `inputTypes` lookup collections) through
// testCatalogService. Nothing here alters the shape of that data.

import { useMemo, useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import SearchBar from '../../../components/common/SearchBar';
import Pagination from '../../../components/common/Pagination';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { FormField, TextInput, Select } from '../../../components/common/FormField';
import { useFirestoreList } from '../../../hooks/useFirestoreList';
import { useNotification } from '../../../hooks/useNotification';
import { useAuth } from '../../../hooks/useAuth';
import { validateForm, validators } from '../../../utils/validation';
import { PERMISSIONS } from '../../../utils/permissions';
import {
  testsService,
  departmentsService,
  unitsService,
  inputTypesService,
} from '../services/testCatalogService';

const PAGE_SIZE = 10;
const EMPTY_FORM = { name: '', code: '', departmentId: '', unitId: '', inputTypeId: '', price: '' };

export default function TestCatalog() {
  const { can } = useAuth();
  const notify = useNotification();
  const canManage = can(PERMISSIONS.LAB_TEST_CATALOG_MANAGE);

  const { data: tests, loading, refetch } = useFirestoreList(testsService, { orderBy: ['name', 'asc'] });
  const { data: departments } = useFirestoreList(departmentsService);
  const { data: units } = useFirestoreList(unitsService);
  const { data: inputTypes } = useFirestoreList(inputTypesService);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const lookupName = (list, id) => list.find((item) => item.id === id)?.name || '—';

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tests;
    return tests.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.code?.toLowerCase().includes(q) ||
        lookupName(departments, t.departmentId).toLowerCase().includes(q)
    );
  }, [tests, search, departments]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { key: 'code', header: 'Code', width: 100 },
    { key: 'name', header: 'Test Name' },
    { key: 'department', header: 'Department', render: (row) => lookupName(departments, row.departmentId) },
    { key: 'unit', header: 'Unit', render: (row) => lookupName(units, row.unitId) },
    {
      key: 'inputType',
      header: 'Input Type',
      render: (row) => lookupName(inputTypes, row.inputTypeId),
    },
    {
      key: 'price',
      header: 'Price',
      render: (row) => (row.price != null ? `₱${Number(row.price).toLocaleString()}` : '—'),
    },
    ...(canManage
      ? [
          {
            key: 'actions',
            header: '',
            width: 140,
            render: (row) => (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditingId(row.id);
    setForm({
      name: row.name || '',
      code: row.code || '',
      departmentId: row.departmentId || '',
      unitId: row.unitId || '',
      inputTypeId: row.inputTypeId || '',
      price: row.price ?? '',
    });
    setErrors({});
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    const rules = {
      name: [validators.required('Test name is required')],
      code: [validators.required('Test code is required')],
    };
    const validationErrors = validateForm(form, rules);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: form.price === '' ? null : Number(form.price),
      };
      if (editingId) {
        await testsService.update(editingId, payload);
        notify.success('Test updated successfully.');
      } else {
        await testsService.create(payload);
        notify.success('Test added to the catalog.');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      notify.error('Something went wrong while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await testsService.remove(deleteTarget.id);
      notify.success(`"${deleteTarget.name}" was removed.`);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      console.error(err);
      notify.error('Could not delete this test. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <Card
        title="Laboratory Test Catalog"
        subtitle={`${filtered.length} test${filtered.length === 1 ? '' : 's'}`}
        actions={
          <>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search tests..." />
            {canManage && <Button onClick={openCreate}>Add Test</Button>}
          </>
        }
      >
        <Table columns={columns} rows={pageRows} loading={loading} emptyMessage="No tests found." />
        <Pagination
          page={page}
          pageCount={pageCount}
          onChange={setPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit Test' : 'Add Test'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <FormField label="Test Name" required error={errors.name}>
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Complete Blood Count"
            />
          </FormField>
          <FormField label="Test Code" required error={errors.code}>
            <TextInput
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="e.g. CBC"
            />
          </FormField>
          <FormField label="Department">
            <Select
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Unit">
            <Select value={form.unitId} onChange={(e) => setForm({ ...form, unitId: e.target.value })}>
              <option value="">Select unit</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Input Type">
            <Select
              value={form.inputTypeId}
              onChange={(e) => setForm({ ...form, inputTypeId: e.target.value })}
            >
              <option value="">Select input type</option>
              {inputTypes.map((it) => (
                <option key={it.id} value={it.id}>{it.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Price (₱)">
            <TextInput
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00"
            />
          </FormField>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete test?"
        message={`"${deleteTarget?.name}" will be permanently removed from the catalog.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
