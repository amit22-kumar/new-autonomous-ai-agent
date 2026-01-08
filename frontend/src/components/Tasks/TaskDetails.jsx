/**
 * TaskDetails Component
 * Detailed view of a task in a modal
 */

import { X, Calendar, User, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/dateHelpers';
import { getStatusColor, getStatusLabel, getPriorityColor } from '../../utils/taskHelpers';

export default function TaskDetails({ task, onClose }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{task.title}</h2>
            <div style={styles.meta}>
              <span 
                style={{
                  ...styles.badge,
                  backgroundColor: `${getStatusColor(task.status)}20`,
                  color: getStatusColor(task.status),
                }}
              >
                {getStatusLabel(task.status)}
              </span>
              <span 
                style={{
                  ...styles.badge,
                  backgroundColor: `${getPriorityColor(task.priority)}20`,
                  color: getPriorityColor(task.priority),
                }}
              >
                {task.priority?.toUpperCase()} PRIORITY
              </span>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.content}>
          {task.description && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Description</h3>
              <p style={styles.description}>{task.description}</p>
            </div>
          )}

          <div style={styles.details}>
            {task.assignee && (
              <div style={styles.detail}>
                <User size={18} style={styles.icon} />
                <div>
                  <div style={styles.detailLabel}>Assignee</div>
                  <div style={styles.detailValue}>{task.assignee}</div>
                </div>
              </div>
            )}

            {task.deadline && (
              <div style={styles.detail}>
                <Calendar size={18} style={styles.icon} />
                <div>
                  <div style={styles.detailLabel}>Deadline</div>
                  <div style={styles.detailValue}>{formatDate(task.deadline)}</div>
                </div>
              </div>
            )}

            {task.estimated_hours && (
              <div style={styles.detail}>
                <Clock size={18} style={styles.icon} />
                <div>
                  <div style={styles.detailLabel}>Estimated Effort</div>
                  <div style={styles.detailValue}>{task.estimated_hours} hours</div>
                </div>
              </div>
            )}

            {task.actual_hours && (
              <div style={styles.detail}>
                <Clock size={18} style={styles.icon} />
                <div>
                  <div style={styles.detailLabel}>Actual Effort</div>
                  <div style={styles.detailValue}>{task.actual_hours} hours</div>
                </div>
              </div>
            )}
          </div>

          {task.dependencies && task.dependencies.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Dependencies</h3>
              <div style={styles.tags}>
                {task.dependencies.map((dep, idx) => (
                  <span key={idx} style={styles.tag}>{dep}</span>
                ))}
              </div>
            </div>
          )}

          {task.deliverables && task.deliverables.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Deliverables</h3>
              <ul style={styles.list}>
                {task.deliverables.map((deliverable, idx) => (
                  <li key={idx} style={styles.listItem}>{deliverable}</li>
                ))}
              </ul>
            </div>
          )}

          {task.notes && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Notes</h3>
              <p style={styles.notes}>{task.notes}</p>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <div style={styles.dates}>
            <div style={styles.dateText}>
              Created: {formatDate(task.created_at)}
            </div>
            {task.updated_at && (
              <div style={styles.dateText}>
                Updated: {formatDate(task.updated_at)}
              </div>
            )}
          </div>
          <button onClick={onClose} style={styles.doneButton}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.5rem',
    borderBottom: '1px solid #2a2a2a',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.75rem',
  },
  meta: {
    display: 'flex',
    gap: '0.5rem',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.625rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  closeButton: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: '#a0a0a0',
    cursor: 'pointer',
  },
  content: {
    padding: '1.5rem',
    flex: 1,
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  description: {
    fontSize: '0.9375rem',
    color: '#a0a0a0',
    lineHeight: 1.6,
  },
  details: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  detail: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
  },
  icon: {
    color: '#666666',
    flexShrink: 0,
  },
  detailLabel: {
    fontSize: '0.75rem',
    color: '#666666',
    marginBottom: '0.25rem',
  },
  detailValue: {
    fontSize: '0.9375rem',
    color: '#ffffff',
    fontWeight: '500',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tag: {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    fontSize: '0.8125rem',
    color: '#a0a0a0',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '0.625rem 0',
    borderBottom: '1px solid #2a2a2a',
    fontSize: '0.9375rem',
    color: '#a0a0a0',
  },
  notes: {
    fontSize: '0.9375rem',
    color: '#a0a0a0',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderTop: '1px solid #2a2a2a',
  },
  dates: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  dateText: {
    fontSize: '0.75rem',
    color: '#666666',
  },
  doneButton: {
    padding: '0.625rem 1.5rem',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
};