/**
 * ProjectCard Component
 * Displays individual project as a card
 */

import { useNavigate } from 'react-router-dom';
import { Calendar, Target, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  const getHealthColor = (indicator) => {
    switch (indicator) {
      case 'green': return '#10b981';
      case 'yellow': return '#f59e0b';
      case 'red': return '#ef4444';
      default: return '#a0a0a0';
    }
  };

  const getStatusLabel = (status) => {
    return status?.replace('_', ' ').toUpperCase() || 'PLANNING';
  };

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/projects/${project.id || project.project_id}`)}
    >
      <div style={styles.header}>
        <div style={styles.healthDot} />
        <span style={styles.status}>
          {getStatusLabel(project.status)}
        </span>
      </div>

      <h3 style={styles.title}>{project.name}</h3>
      <p style={styles.description}>{project.description}</p>

      <div style={styles.progress}>
        <div style={styles.progressInfo}>
          <span style={styles.progressLabel}>Progress</span>
          <span style={styles.progressValue}>
            {project.completion_percentage || 0}%
          </span>
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${project.completion_percentage || 0}%`,
            }}
          />
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.footerItem}>
          <Calendar size={14} style={styles.footerIcon} />
          <span style={styles.footerText}>
            {project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : 'No deadline'}
          </span>
        </div>
        <div style={styles.footerItem}>
          <Target size={14} style={styles.footerIcon} />
          <span style={styles.footerText}>
            {project.goals?.length || 0} goals
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  healthDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
  status: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#a0a0a0',
    letterSpacing: '0.5px',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.5rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  description: {
    fontSize: '0.875rem',
    color: '#a0a0a0',
    marginBottom: '1.5rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: 1.5,
  },
  progress: {
    marginBottom: '1.5rem',
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  progressLabel: {
    fontSize: '0.75rem',
    color: '#a0a0a0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  progressValue: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#141414',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 0.3s',
  },
  footer: {
    display: 'flex',
    gap: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #2a2a2a',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
  footerIcon: {
    color: '#666666',
  },
  footerText: {
    fontSize: '0.75rem',
    color: '#a0a0a0',
  },
};