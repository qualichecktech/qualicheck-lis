// src/components/common/Table.jsx
import './Table.css';
import LoadingSpinner from './LoadingSpinner';

/**
 * Generic data table.
 *
 * columns: [{ key, header, render?(row), width? }]
 * rows: array of data objects (must include an `id` field, or pass rowKey)
 */
export default function Table({
  columns,
  rows,
  loading = false,
  emptyMessage = 'No records found.',
  rowKey = 'id',
  onRowClick,
}) {
  if (loading) {
    return (
      <div className="table-state">
        <LoadingSpinner />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return <div className="table-state table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[rowKey]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'row-clickable' : ''}
            >
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
