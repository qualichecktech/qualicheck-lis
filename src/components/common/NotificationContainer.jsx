// src/components/common/NotificationContainer.jsx
import { useNotification } from '../../hooks/useNotification';
import './NotificationContainer.css';

const ICONS = {
  success: '✓',
  error: '!',
  warning: '!',
  info: 'i',
};

export default function NotificationContainer() {
  const { notifications, dismiss } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((n) => (
        <div key={n.id} className={`notification notification-${n.type}`}>
          <span className="notification-icon">{ICONS[n.type] || ICONS.info}</span>
          <span className="notification-message">{n.message}</span>
          <button
            className="notification-close"
            onClick={() => dismiss(n.id)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
