// src/components/common/ConfirmDialog.jsx
import Modal from './Modal';
import Button from './Button';

/**
 * Reusable confirmation dialog. Render once and drive it with state, e.g.:
 *
 * const [confirmOpen, setConfirmOpen] = useState(false);
 * <ConfirmDialog
 *   open={confirmOpen}
 *   title="Delete test?"
 *   message="This cannot be undone."
 *   confirmLabel="Delete"
 *   danger
 *   onCancel={() => setConfirmOpen(false)}
 *   onConfirm={handleDelete}
 * />
 */
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>{message}</p>
    </Modal>
  );
}
