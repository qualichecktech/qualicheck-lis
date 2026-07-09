// src/utils/validation.js
// Small, reusable validation helpers shared by every module's forms.

export function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

export function isEmail(value) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isMinLength(value, min) {
  return typeof value === 'string' && value.length >= min;
}

export function isNumeric(value) {
  return value !== '' && !isNaN(Number(value));
}

/**
 * Runs a set of { field: [validatorFns] } rules against a values object.
 * Each validator fn receives the field's value and returns an error string
 * (or null/undefined if valid).
 *
 * Returns an { field: errorMessage } object containing only failed fields.
 */
export function validateForm(values, rules) {
  const errors = {};
  Object.entries(rules).forEach(([field, validators]) => {
    for (const validate of validators) {
      const error = validate(values[field], values);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  return errors;
}

export const validators = {
  required:
    (message = 'This field is required') =>
    (value) =>
      isRequired(value) ? null : message,
  email:
    (message = 'Enter a valid email address') =>
    (value) =>
      !value || isEmail(value) ? null : message,
  minLength:
    (min, message = `Must be at least ${min} characters`) =>
    (value) =>
      !value || isMinLength(value, min) ? null : message,
  numeric:
    (message = 'Must be a number') =>
    (value) =>
      !value || isNumeric(value) ? null : message,
};
