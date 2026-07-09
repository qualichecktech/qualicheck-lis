// src/layouts/Sidebar.jsx
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from '../components/common/Icon';
import { navigationConfig } from '../routes/navigationConfig';
import { useAuth } from '../hooks/useAuth';
import './Sidebar.css';

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const { can } = useAuth();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState(() =>
    // Auto-expand a group if the current path is inside it.
    Object.fromEntries(
      navigationConfig
        .filter((item) => item.children?.some((c) => location.pathname.startsWith(c.path)))
        .map((item) => [item.key, true])
    )
  );

  const toggleGroup = (key) =>
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const visibleItems = navigationConfig.filter((item) => !item.permission || can(item.permission));

  return (
    <>
      <aside
        className={[
          'sidebar',
          collapsed ? 'sidebar-collapsed' : '',
          mobileOpen ? 'sidebar-mobile-open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">QC</div>
          {!collapsed && (
            <div>
              <p className="sidebar-brand-name">QualiCheck</p>
              <p className="sidebar-brand-sub">Admin Portal</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {visibleItems.map((item) =>
            item.children ? (
              <div key={item.key} className="sidebar-group">
                <button
                  className="sidebar-link sidebar-group-toggle"
                  onClick={() => toggleGroup(item.key)}
                >
                  <Icon name={item.icon} />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && (
                    <Icon
                      name="chevronDown"
                      size={14}
                      className={`sidebar-chevron ${expandedGroups[item.key] ? 'open' : ''}`}
                    />
                  )}
                </button>
                {(expandedGroups[item.key] || collapsed) && (
                  <div className="sidebar-submenu">
                    {item.children
                      .filter((c) => !c.permission || can(c.permission))
                      .map((child) => (
                        <NavLink
                          key={child.key}
                          to={child.path}
                          className={({ isActive }) =>
                            `sidebar-link sidebar-sublink ${isActive ? 'active' : ''}`
                          }
                          onClick={onCloseMobile}
                        >
                          {!collapsed && <span>{child.label}</span>}
                          {collapsed && <span>{child.label[0]}</span>}
                          {!child.implemented && !collapsed && (
                            <span className="sidebar-badge">Soon</span>
                          )}
                        </NavLink>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onCloseMobile}
              >
                <Icon name={item.icon} />
                {!collapsed && <span>{item.label}</span>}
                {!item.implemented && !collapsed && <span className="sidebar-badge">Soon</span>}
              </NavLink>
            )
          )}
        </nav>
      </aside>
      {mobileOpen && <div className="sidebar-scrim" onClick={onCloseMobile} />}
    </>
  );
}
