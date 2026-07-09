// src/components/common/Card.jsx
import './Card.css';

export default function Card({ title, subtitle, actions, children, className = '', padded = true }) {
  return (
    <div className={`card ${className}`}>
      {(title || actions) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className={padded ? 'card-body' : ''}>{children}</div>
    </div>
  );
}

export function StatCard({ label, value, icon, trend, tone = 'primary' }) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <div className="stat-card-icon">{icon}</div>
      <div>
        <p className="stat-card-value">{value}</p>
        <p className="stat-card-label">{label}</p>
        {trend && <p className="stat-card-trend">{trend}</p>}
      </div>
    </div>
  );
}
