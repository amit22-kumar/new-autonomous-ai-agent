/**
 * Sidebar Component
 * Main navigation sidebar
 */

import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  ListTodo, 
  BarChart3, 
  MessageSquare,
  Calendar
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/tasks', icon: ListTodo, label: 'Tasks' },
    { path: '/timeline', icon: Calendar, label: 'Timeline' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/chat', icon: MessageSquare, label: 'AI Assistant' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <FolderKanban size={28} />
        <span style={styles.logoText}>PM Agent</span>
      </div>

      <nav style={styles.nav}>
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              ...styles.navItem,
              ...(isActive(path) ? styles.navItemActive : {}),
            }}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div style={styles.footer}>
        <div style={styles.footerText}>v1.0.0</div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    height: '100vh',
    backgroundColor: '#0a0a0a',
    borderRight: '1px solid #2a2a2a',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 1rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '2rem',
    padding: '0 0.5rem',
    color: '#ffffff',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '600',
    letterSpacing: '-0.5px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 0.75rem',
    borderRadius: '8px',
    color: '#a0a0a0',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  navItemActive: {
    backgroundColor: '#141414',
    color: '#3b82f6',
  },
  footer: {
    padding: '1rem 0.5rem 0',
    borderTop: '1px solid #2a2a2a',
  },
  footerText: {
    fontSize: '0.75rem',
    color: '#666666',
    textAlign: 'center',
  },
};