/**
 * GanttChart Component
 * Visual timeline/Gantt chart for project phases and tasks
 */

import { formatDate } from '../../utils/dateHelpers';

export default function GanttChart({ projectData }) {
  // Mock data - replace with actual project data
  const phases = [
    {
      id: 1,
      name: 'Planning',
      startDate: '2026-01-01',
      endDate: '2026-01-15',
      progress: 100,
      color: '#10b981',
    },
    {
      id: 2,
      name: 'Development',
      startDate: '2026-01-16',
      endDate: '2026-03-15',
      progress: 65,
      color: '#3b82f6',
    },
    {
      id: 3,
      name: 'Testing',
      startDate: '2026-03-01',
      endDate: '2026-04-15',
      progress: 30,
      color: '#f59e0b',
    },
    {
      id: 4,
      name: 'Deployment',
      startDate: '2026-04-10',
      endDate: '2026-04-30',
      progress: 0,
      color: '#666666',
    },
  ];

  const startDate = new Date('2026-01-01');
  const endDate = new Date('2026-04-30');
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  const getPosition = (date) => {
    const d = new Date(date);
    const days = Math.ceil((d - startDate) / (1000 * 60 * 60 * 24));
    return (days / totalDays) * 100;
  };

  const getDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const days = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return (days / totalDays) * 100;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Project Timeline</h1>
        <div style={styles.dateRange}>
          {formatDate(startDate)} - {formatDate(endDate)}
        </div>
      </div>

      <div style={styles.gantt}>
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>Phases</div>
          {phases.map(phase => (
            <div key={phase.id} style={styles.phaseLabel}>
              <div style={styles.phaseName}>{phase.name}</div>
              <div style={styles.phaseProgress}>{phase.progress}%</div>
            </div>
          ))}
        </div>

        <div style={styles.timeline}>
          <div style={styles.timelineHeader}>
            <div style={styles.monthsRow}>
              <div style={styles.month}>January</div>
              <div style={styles.month}>February</div>
              <div style={styles.month}>March</div>
              <div style={styles.month}>April</div>
            </div>
          </div>

          <div style={styles.bars}>
            {phases.map(phase => (
              <div key={phase.id} style={styles.barRow}>
                <div
                  style={{
                    ...styles.bar,
                    left: `${getPosition(phase.startDate)}%`,
                    width: `${getDuration(phase.startDate, phase.endDate)}%`,
                    backgroundColor: phase.color,
                  }}
                >
                  <div
                    style={{
                      ...styles.barProgress,
                      width: `${phase.progress}%`,
                      backgroundColor: phase.color,
                      opacity: 0.6,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={styles.todayLine} />
        </div>
      </div>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendBox, backgroundColor: '#10b981' }} />
          <span>Completed</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendBox, backgroundColor: '#3b82f6' }} />
          <span>In Progress</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendBox, backgroundColor: '#f59e0b' }} />
          <span>Upcoming</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendBox, backgroundColor: '#666666' }} />
          <span>Not Started</span>
        </div>
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
  dateRange: {
    fontSize: '0.875rem',
    color: '#a0a0a0',
    fontWeight: '500',
  },
  gantt: {
    display: 'flex',
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '2rem',
  },
  sidebar: {
    width: '200px',
    borderRight: '1px solid #2a2a2a',
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #2a2a2a',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#a0a0a0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
  },
  phaseLabel: {
    padding: '1rem 1.25rem',
    height: '60px',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  phaseName: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: '0.25rem',
  },
  phaseProgress: {
    fontSize: '0.75rem',
    color: '#666666',
  },
  timeline: {
    flex: 1,
    position: 'relative',
  },
  timelineHeader: {
    borderBottom: '1px solid #2a2a2a',
    height: '60px',
  },
  monthsRow: {
    display: 'flex',
    height: '100%',
  },
  month: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#a0a0a0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderLeft: '1px solid #2a2a2a',
  },
  bars: {
    position: 'relative',
  },
  barRow: {
    height: '60px',
    borderBottom: '1px solid #2a2a2a',
    position: 'relative',
  },
  bar: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    height: '32px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  barProgress: {
    height: '100%',
    borderRadius: '4px',
  },
  todayLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '25%',
    width: '2px',
    backgroundColor: '#ef4444',
    zIndex: 10,
  },
  legend: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#a0a0a0',
  },
  legendBox: {
    width: '16px',
    height: '16px',
    borderRadius: '3px',
  },
};