/**
 * TaskList Component
 * List view of tasks with filtering and sorting
 */

import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { Filter, SortAsc } from 'lucide-react';
import { formatDate } from '../../utils/dateHelpers';
import { getStatusColor, getStatusLabel, getPriorityColor } from '../../utils/taskHelpers';

export default function TaskList({ projectId }) {
  const { tasks, sortTasksByDeadline, sortTasksByPriority } = useTasks(projectId);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  const sortedTasks = sortBy === 'deadline' 
    ? sortTasksByDeadline()
    : sortTasksByPriority();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Task List</h1>
        
        <div style={styles.controls}>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Status</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <div style={styles.colTask}>Task</div>
          <div style={styles.colStatus}>Status</div>
          <div style={styles.colPriority}>Priority</div>
          <div style={styles.colAssignee}>Assignee</div>
          <div style={styles.colDeadline}>Deadline</div>
          <div style={styles.colProgress}>Progress</div>
        </div>

        <div style={styles.tableBody}>
          {sortedTasks.map(task => (
            <TaskRow key={task.task_id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskRow({ task }) {
  return (
    <div style={styles.row}>
      <div style={styles.colTask}>
        <div style={styles.taskTitle}>{task.title}</div>
        {task.description && (
          <div style={styles.taskDesc}>{task.description}</div>
        )}
      </div>

      <div style={styles.colStatus}>
        <span 
          style={{
            ...styles.badge,
            backgroundColor: `${getStatusColor(task.status)}20`,
            color: getStatusColor(task.status),
          }}
        >
          {getStatusLabel(task.status)}
        </span>
      </div>

      <div style={styles.colPriority}>
        <span style={{ color: getPriorityColor(task.priority) }}>
          {task.priority?.toUpperCase()}
        </span>
      </div>

      <div style={styles.colAssignee}>
        {task.assignee ? (
          <div style={styles.assignee}>
            <div style={styles.avatar}>
              {task.assignee.charAt(0).toUpperCase()}
            </div>
            <span>{task.assignee}</span>
          </div>
        ) : (
          <span style={styles.unassigned}>Unassigned</span>
        )}
      </div>

      <div style={styles.colDeadline}>
        {task.deadline ? formatDate(task.deadline) : '-'}
      </div>

      <div style={styles.colProgress}>
        {task.status === 'completed' ? '100%' : 
         task.status === 'in_progress' ? '50%' : '0%'}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  controls: {
    display: 'flex',
    gap: '0.75rem',
  },
  select: {
    padding: '0.5rem 0.75rem',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  table: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.75fr',
    gap: '1rem',
    padding: '1rem 1.5rem',
    backgroundColor: '#141414',
    borderBottom: '1px solid #2a2a2a',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#a0a0a0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.75fr',
    gap: '1rem',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #2a2a2a',
    transition: 'background 0.2s',
    cursor: 'pointer',
  },
  colTask: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  colStatus: {},
  colPriority: {},
  colAssignee: {},
  colDeadline: {},
  colProgress: {},
  taskTitle: {
    fontSize: '0.9375rem',
    fontWeight: '500',
    color: '#ffffff',
  },
  taskDesc: {
    fontSize: '0.8125rem',
    color: '#666666',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.625rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  assignee: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
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
  unassigned: {
    color: '#666666',
    fontSize: '0.875rem',
  },
};