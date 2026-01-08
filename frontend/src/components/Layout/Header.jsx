/**
 * Header Component
 * Top navigation bar
 */

import { Search, Bell, User } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header style={styles.header}>
      <div style={styles.searchContainer}>
        <Search size={18} style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search projects, tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.actions}>
        <button style={styles.iconButton} title="Notifications">
          <Bell size={20} />
        </button>
        <button style={styles.iconButton} title="Profile">
          <User size={20} />
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: '64px',
    backgroundColor: '#0a0a0a',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
  },
  searchContainer: {
    position: 'relative',
    width: '400px',
  },
  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666666',
  },
  searchInput: {
    width: '100%',
    padding: '0.625rem 0.75rem 0.625rem 2.5rem',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  iconButton: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#a0a0a0',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};