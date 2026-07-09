// src/contexts/NotificationContext.jsx
//
// Global notification (toast) system. Any component can call
// useNotification().notify(...) instead of managing its own local toast
// state, so notifications look and behave consistently everywhere.

import { createContext, useCallback, useState } from 'react';

export const NotificationContext = createContext(null);

let idCounter = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const dismiss = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (message, { type = 'info', duration = 4000 } = {}) => {
      const id = ++idCounter;
      setNotifications((prev) => [...prev, { id, message, type }]);
      if (duration) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const value = {
    notifications,
    notify,
    dismiss,
    success: (message, opts) => notify(message, { ...opts, type: 'success' }),
    error: (message, opts) => notify(message, { ...opts, type: 'error' }),
    warning: (message, opts) => notify(message, { ...opts, type: 'warning' }),
    info: (message, opts) => notify(message, { ...opts, type: 'info' }),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
