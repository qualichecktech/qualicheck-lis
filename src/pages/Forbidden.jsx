// src/pages/Forbidden.jsx
import { Link } from 'react-router-dom';
import Icon from '../components/common/Icon';
import Button from '../components/common/Button';
import './StatusPage.css';

export default function Forbidden() {
  return (
    <div className="status-page">
      <div className="status-icon status-icon-warning">
        <Icon name="user-cog" size={26} />
      </div>
      <h2>You don't have access to this page</h2>
      <p>Your account role doesn't include permission for this section. Contact an administrator if you believe this is a mistake.</p>
      <Link to="/dashboard">
        <Button variant="secondary">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
