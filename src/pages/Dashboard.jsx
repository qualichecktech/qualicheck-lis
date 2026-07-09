// src/pages/Dashboard.jsx
import { StatCard } from '../components/common/Card';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

const STATS = [
  { key: 'patients', label: 'Patients', value: '—', icon: <Icon name="users" />, tone: 'primary' },
  { key: 'orders', label: 'Laboratory Orders', value: '—', icon: <Icon name="flask" />, tone: 'info' },
  { key: 'released', label: 'Released Results', value: '—', icon: <Icon name="file-text" />, tone: 'success' },
  { key: 'revenue', label: 'Revenue', value: '—', icon: <Icon name="credit-card" />, tone: 'warning' },
  { key: 'pending', label: 'Pending Verifications', value: '—', icon: <Icon name="bar-chart" />, tone: 'danger' },
];

export default function Dashboard() {
  const { profile, firebaseUser } = useAuth();
  const name = profile?.name || firebaseUser?.email?.split('@')[0] || 'there';

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <h1>Welcome back, {name}</h1>
        <p>Here's a snapshot of the clinic. Live figures will populate as modules go live.</p>
      </div>

      <div className="dashboard-stats">
        {STATS.map((s) => (
          <StatCard key={s.key} label={s.label} value={s.value} icon={s.icon} tone={s.tone} />
        ))}
      </div>

      <div className="dashboard-grid">
        <Card title="Recent Activity" subtitle="Latest actions across the system">
          <div className="dashboard-placeholder">
            <p>No activity to show yet.</p>
            <p className="dashboard-placeholder-hint">
              This panel will show real-time entries once the Patients and Laboratory modules are connected.
            </p>
          </div>
        </Card>

        <Card title="Quick Links" subtitle="Jump into a module">
          <ul className="dashboard-quicklinks">
            <li><a href="/laboratory/test-catalog">Laboratory Test Catalog</a></li>
            <li><a href="/laboratory/reference-ranges">Reference Ranges</a></li>
            <li><a href="/patients">Patients</a></li>
            <li><a href="/billing">Billing</a></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
