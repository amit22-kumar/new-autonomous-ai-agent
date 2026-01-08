/**
 * TaskBoard Component
 * Kanban-style task board
 */

import { useTasks } from '../../hooks/useTasks';
import { groupTasksByStatus } from '../../utils/taskHelpers';
import TaskCard from './TaskCard';

export default function TaskBoard({ projectId }) {
  const { tasks, updateTaskStatus } = useTasks(projectId);
  const groupedTasks = groupTasksByStatus(tasks);

  const columns = [
    { id: 'not_started', title: 'Not Started', color: '#666666' },
    { id: 'in_progress', title: 'In Progress', color: '#3b82f6' },
    { id: 'completed', title: 'Completed', color: '#10b981' },
    { id: 'blocked', title: 'Blocked', color: '#ef4444' },
  ];

  const handleDrop = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Task Board</h1>
      </div>

      <div style={styles.board}>
        {columns.map(column => (
          <Column
            key={column.id}
            column={column}
            tasks={groupedTasks[column.id] || []}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}

function Column({ column, tasks, onDrop }) {
  return (
    <div style={styles.column}>
      <div style={styles.columnHeader}>
        <div style={{ ...styles.columnDot, backgroundColor: column.color }} />
        <h3 style={styles.columnTitle}>{column.title}</h3>
        <span style={styles.columnCount}>{tasks.length}</span>
      </div>

      <div style={styles.columnContent}>
        {tasks.length === 0 ? (
          <div style={styles.emptyColumn}>No tasks</div>
        ) : (
          tasks.map(task => (
            <TaskCard key={task.task_id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    height: 'calc(100vh - 64px)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    flex: 1,
    overflow: 'hidden',
  },
  column: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  columnHeader: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  columnDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  columnTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    flex: 1,
  },
  columnCount: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#666666',
    backgroundColor: '#141414',
    padding: '0.25rem 0.625rem',
    borderRadius: '12px',
  },
  columnContent: {
    padding: '1rem',
    overflow: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  emptyColumn: {
    padding: '2rem',
    textAlign: 'center',
    color: '#666666',
    fontSize: '0.875rem',
  },
};