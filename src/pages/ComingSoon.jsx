// src/pages/ComingSoon.jsx
import { useLocation } from 'react-router-dom';
import Icon from '../components/common/Icon';
import './StatusPage.css';

export default function ComingSoon({ label }) {
  const location = useLocation();
  const title = label || humanize(location.pathname);

  return (
    <div className="status-page">
      <div className="status-icon status-icon-info">
        <Icon name="settings" size={26} />
      </div>
      <h2>{title} is coming soon</h2>
      <p>This module hasn't been built yet, but it's already wired into navigation and access control.</p>
    </div>
  );
}

function humanize(pathname) {
  const last = pathname.split('/').filter(Boolean).pop() || 'This module';
  return last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
