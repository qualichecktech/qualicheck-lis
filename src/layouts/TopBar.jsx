// src/layouts/TopBar.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/common/Icon';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/permissions';
import './TopBar.css';

const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMINISTRATOR]: 'Administrator',
  [ROLES.MEDICAL_TECHNOLOGIST]: 'Medical Technologist',
  [ROLES.PATHOLOGIST]: 'Pathologist',
  [ROLES.RECEPTIONIST]: 'Receptionist',
  [ROLES.CASHIER]: 'Cashier',
  [ROLES.DOCTOR]: 'Doctor',
};

export default function TopBar({ onToggleSidebar, onToggleMobile }) {
  const { profile, firebaseUser, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const displayName = profile?.name || firebaseUser?.email || 'User';
  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn desktop-only" onClick={onToggleSidebar} aria-label="Toggle navigation">
          <Icon name="menu" />
        </button>
        <button className="icon-btn mobile-only" onClick={onToggleMobile} aria-label="Open navigation">
          <Icon name="menu" />
        </button>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" aria-label="Notifications">
          <Icon name="bell" />
        </button>

        <div className="user-menu" ref={menuRef}>
          <button className="user-menu-trigger" onClick={() => setMenuOpen((v) => !v)}>
            <span className="user-avatar">{initials || 'U'}</span>
            <span className="user-menu-info desktop-only">
              <span className="user-name">{displayName}</span>
              <span className="user-role">{ROLE_LABELS[role] || 'No role assigned'}</span>
            </span>
            <Icon name="chevronDown" size={14} className="desktop-only" />
          </button>

          {menuOpen && (
            <div className="user-menu-dropdown">
              <div className="user-menu-header">
                <p className="user-name">{displayName}</p>
                <p className="user-role">{ROLE_LABELS[role] || 'No role assigned'}</p>
              </div>
              <button className="user-menu-item" onClick={() => navigate('/settings')}>
                Account Settings
              </button>
              <button className="user-menu-item user-menu-danger" onClick={handleLogout}>
                <Icon name="logout" size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
