// src/modules/laboratory/pages/ReferenceRanges.jsx
//
// Lets staff define normal ranges (e.g. by sex/age bracket) per test.
// Reads the existing `tests` catalog to populate the test picker, and
// stores range rows in the new `referenceRanges` collection.

import { useMemo, useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { FormField, TextInput, Select } from '../../../components/common/FormField';
import { useFirestoreList } from '../../../hooks/useFirestoreList';
import { useNotification } from '../../../hooks/useNotification';
import { useAuth } from '../../../hooks/useAuth';
import { validateForm, validators } from '../../../utils/validation';
import { PERMISSIONS } from '../../../utils/permissions';
import { testsService } from '../services/testCatalogService';
import { referenceRangesService } from '../services/referenceRangeService';

const EMPTY_FORM = { testId: '', sex: 'any', ageMin: '', ageMax: '', low: '', high: '', notes: '' };

const SEX_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export default function ReferenceRanges() {
  const { can } = useAuth();
  const notify = useNotification();
  const canManage = can(PERMISSIONS.LAB_REFERENCE_RANGES_MANAGE);

  const { data: tests } = useFirestoreList(testsService, { orderBy: ['name', 'asc'] });
  const { data: ranges, loading, refetch } = useFirestoreList(referenceRangesService);

  const [selectedTestId, setSelectedTestId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const testName = (id) => tests.find((t) => t.id === id)?.name || '—';

  const visibleRanges = useMemo(
    () => (selectedTestId ? ranges.filter((r) => r.testId === selectedTestId) : ranges),
    [ranges, selectedTestId]
  );

  const columns = [
    ...(selectedTestId ? [] : [{ key: 'test', header: 'Test', render: (row) => testName(row.testId) }]),
    { key: 'sex', header: 'Sex', render: (row) => capitalize(row.sex) },
    {
      key: 'age',
      header: 'Age Range',
      render: (row) => (row.ageMin || row.ageMax ? `${row.ageMin || 0}\u2013${row.ageMax || '+'}` : 'All ages'),
    },
    { key: 'range', header: 'Normal Range', render: (row) => `${row.low} \u2013 ${row.high}` },
    { key: 'notes', header: 'Notes' },
    ...(canManage
      ? [
          {
            key: 'actions',
            header: '',
            width: 140,
            render: (row) => (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>Delete</Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, testId: selectedTestId });
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditingId(row.id);
    setForm({
      testId: row.testId || '',
      sex: row.sex || 'any',
      ageMin: row.ageMin ?? '',
      ageMax: row.ageMax ?? '',
      low: row.low ?? '',
      high: row.high ?? '',
      notes: row.notes || '',
    });
    setErrors({});
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    const rules = {
      testId: [validators.required('Select a test')],
      low: [validators.required('Required'), validators.numeric()],
      high: [validators.required('Required'), validators.numeric()],
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
        ageMin: form.ageMin === '' ? null : Number(form.ageMin),
        ageMax: form.ageMax === '' ? null : Number(form.ageMax),
        low: Number(form.low),
        high: Number(form.high),
      };
      if (editingId) {
        await referenceRangesService.update(editingId, payload);
        notify.success('Reference range updated.');
      } else {
        await referenceRangesService.create(payload);
        notify.success('Reference range added.');
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
      await referenceRangesService.remove(deleteTarget.id);
      notify.success('Reference range removed.');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      console.error(err);
      notify.error('Could not delete this range. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <Card
        title="Reference Range Administration"
        subtitle="Normal value ranges used to flag abnormal lab results"
        actions={
          <>
            <Select value={selectedTestId} onChange={(e) => setSelectedTestId(e.target.value)} style={{ minWidth: 220 }}>
              <option value="">All tests</option>
              {tests.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
            {canManage && <Button onClick={openCreate}>Add Range</Button>}
          </>
        }
      >
        <Table columns={columns} rows={visibleRanges} loading={loading} emptyMessage="No reference ranges defined yet." />
      </Card>

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit Reference Range' : 'Add Reference Range'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <FormField label="Test" required error={errors.testId}>
            <Select value={form.testId} onChange={(e) => setForm({ ...form, testId: e.target.value })}>
              <option value="">Select test</option>
              {tests.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Sex">
            <Select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })}>
              {SEX_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Min Age">
              <TextInput type="number" min="0" value={form.ageMin} onChange={(e) => setForm({ ...form, ageMin: e.target.value })} placeholder="0" />
            </FormField>
            <FormField label="Max Age">
              <TextInput type="number" min="0" value={form.ageMax} onChange={(e) => setForm({ ...form, ageMax: e.target.value })} placeholder="No limit" />
            </FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Low" required error={errors.low}>
              <TextInput type="number" step="any" value={form.low} onChange={(e) => setForm({ ...form, low: e.target.value })} />
            </FormField>
            <FormField label="High" required error={errors.high}>
              <TextInput type="number" step="any" value={form.high} onChange={(e) => setForm({ ...form, high: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Notes">
            <TextInput value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional" />
          </FormField>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete reference range?"
        message="This range will be permanently removed."
        confirmLabel="Delete"
        danger
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function capitalize(s) {
  if (!s) return '—';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
