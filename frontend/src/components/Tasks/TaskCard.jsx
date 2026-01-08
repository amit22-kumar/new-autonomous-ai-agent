/**
 * TaskCard Component
 * Individual task card for board/list views
 */

import { useState } from 'react';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatDate, getDeadlineStatus } from '../../utils/dateHelpers';
import { getPriorityColor, getPriorityLabel } from '../../utils/taskHelpers';
import TaskDetails from './TaskDetails';

export default function TaskCard({ task }) {
  const [showDetails, setShowDetails] = useState(false);
  const deadlineStatus = getDeadlineStatus(task.deadline);

  return (
    <>
      <div 
        style={styles.card}
        onClick={() => setShowDetails(true)}
      >
        <div style={styles.header}>
          <span 
            style={{
              ...styles.priority,
              color: getPriorityColor(task.priority)
            }}
          >
            {getPriorityLabel(task.priority)}
          </span>
          {task.status === 'blocked' && (
            <AlertCircle size={16} style={styles.blockedIcon} />
          )}
          {task.status === 'completed' && (
            <CheckCircle2 size={16} style={styles.completedIcon} />
          )}
        </div>

        <h4 style={styles.title}>{task.title}</h4>
        
        {task.description && (
          <p style={styles.description}>{task.description}</p>
        )}

        {task.deadline && (
          <div style={styles.deadline}>
            <Clock size={14} style={{ color: deadlineStatus.color }} />
            <span style={{ color: deadlineStatus.color }}>
              {deadlineStatus.label}
            </span>
          </div>
        )}

        {task.assignee && (
          <div style={styles.assignee}>
            <div style={styles.avatar}>
              {task.assignee.charAt(0).toUpperCase()}
            </div>
            <span style={styles.assigneeName}>{task.assignee}</span>
          </div>
        )}

        {task.estimated_hours && (
          <div style={styles.effort}>
            <span>{task.estimated_hours}h estimated</span>
          </div>
        )}
      </div>

      {showDetails && (
        <TaskDetails 
          task={task} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </>
  );
}

const styles = {
  card: {
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  priority: {
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  blockedIcon: {
    color: '#ef4444',
  },
  completedIcon: {
    color: '#10b981',
  },
  title: {
    fontSize: '0.9375rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.5rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  description: {
    fontSize: '0.8125rem',
    color: '#a0a0a0',
    marginBottom: '0.75rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: 1.5,
  },
  deadline: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    marginBottom: '0.75rem',
  },
  assignee: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #2a2a2a',
  },
  avatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  assigneeName: {
    fontSize: '0.75rem',
    color: '#a0a0a0',
  },
  effort: {
    fontSize: '0.75rem',
    color: '#666666',
    marginTop: '0.5rem',
  },
};