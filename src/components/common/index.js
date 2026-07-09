// src/components/common/index.js
// Barrel export so pages can do:
//   import { Button, Card, Table, Modal, ConfirmDialog } from '../components/common';

export { default as Button } from './Button';
export { default as Card, StatCard } from './Card';
export { default as Table } from './Table';
export { default as Modal } from './Modal';
export { default as ConfirmDialog } from './ConfirmDialog';
export { default as SearchBar } from './SearchBar';
export { default as Pagination } from './Pagination';
export { default as LoadingSpinner, LoadingOverlay } from './LoadingSpinner';
export { default as NotificationContainer } from './NotificationContainer';
export { FormField, TextInput, Select, Textarea } from './FormField';
