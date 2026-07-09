// src/components/common/FormField.jsx
import './FormField.css';

export function FormField({ label, error, required, hint, children }) {
  return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="form-hint">{hint}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

export function TextInput({ error, ...rest }) {
  return <input className={`form-input ${error ? 'form-input-error' : ''}`} {...rest} />;
}

export function Select({ error, children, ...rest }) {
  return (
    <select className={`form-input ${error ? 'form-input-error' : ''}`} {...rest}>
      {children}
    </select>
  );
}

export function Textarea({ error, ...rest }) {
  return <textarea className={`form-input ${error ? 'form-input-error' : ''}`} {...rest} />;
}
