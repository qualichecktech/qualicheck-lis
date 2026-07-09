// src/layouts/Breadcrumbs.jsx
import { Link, useLocation } from 'react-router-dom';
import { buildBreadcrumbMap } from '../routes/navigationConfig';
import './Breadcrumbs.css';

const breadcrumbMap = buildBreadcrumbMap();

export default function Breadcrumbs() {
  const location = useLocation();
  const trail = breadcrumbMap[location.pathname] || humanizePath(location.pathname);

  if (!trail || trail.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/dashboard" className="breadcrumb-crumb">
        Home
      </Link>
      {trail.map((label, i) => (
        <span key={i} className="breadcrumb-item">
          <span className="breadcrumb-sep">/</span>
          <span className={i === trail.length - 1 ? 'breadcrumb-current' : 'breadcrumb-crumb'}>
            {label}
          </span>
        </span>
      ))}
    </nav>
  );
}

function humanizePath(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  return segments.map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
}
