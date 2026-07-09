// src/components/common/LoadingSpinner.jsx
import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 28, label }) {
  return (
    <div className="loading-inline">
      <span className="loading-spinner" style={{ width: size, height: size }} />
      {label && <span className="loading-label">{label}</span>}
    </div>
  );
}

/** Full-screen overlay used for app-level or page-level blocking loads. */
export function LoadingOverlay({ label = 'Loading...' }) {
  return (
    <div className="loading-overlay">
      <span className="loading-spinner loading-spinner-lg" />
      <p className="loading-overlay-label">{label}</p>
    </div>
  );
}
