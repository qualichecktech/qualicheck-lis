// src/components/common/Pagination.jsx
import './Pagination.css';

export default function Pagination({ page, pageCount, onChange, totalItems, pageSize }) {
  if (pageCount <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="pagination">
      <span className="pagination-summary">
        {totalItems === 0 ? '0 results' : `${start}\u2013${end} of ${totalItems}`}
      </span>
      <div className="pagination-controls">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Prev
        </button>
        <span className="pagination-page">
          Page {page} of {pageCount}
        </span>
        <button disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
