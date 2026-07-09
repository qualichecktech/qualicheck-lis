// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import Icon from '../components/common/Icon';
import Button from '../components/common/Button';
import './StatusPage.css';

export default function NotFound() {
  return (
    <div className="status-page">
      <div className="status-icon status-icon-error">
        <Icon name="file-text" size={26} />
      </div>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/dashboard">
        <Button variant="secondary">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
