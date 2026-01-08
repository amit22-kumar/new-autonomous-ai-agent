/**
 * MilestoneTracker Component
 * Tracks and displays project milestones
 */

import { CheckCircle2, Circle, AlertCircle, Clock } from 'lucide-react';
import { formatDate, daysUntil } from '../../utils/dateHelpers';

export default function MilestoneTracker({ projectData }) {
  // Mock data - replace with actual project data
  const milestones = [
    {
      id: 1,
      name: 'Project Kickoff',
      description: 'Initial planning and team setup',
      targetDate: '2026-01-15',
      actualDate: '2026-01-15',
      status: 'achieved',
      phase: 'Planning',
    },
    {
      id: 2,
      name: 'Requirements Complete',
      description: 'All requirements documented and approved',
      targetDate: '2026-02-01',
      actualDate: '2026-02-03',
      status: 'achieved',
      phase: 'Planning',
    },
    {
      id: 3,
      name: 'MVP Development',
      description: 'Minimum viable product completed',
      targetDate: '2026-03-01',
      actualDate: null,
      status: 'in_progress',
      phase: 'Development',
    },
    {
      id: 4,
      name: 'Beta Testing',
      description: 'Beta version ready for testing',
      targetDate: '2026-03-30',
      actualDate: null,
      status: 'not_started',
      phase: 'Testing',
    },
    {
      id: 5,
      name: 'Production Launch',
      description: 'Final launch to production',
      targetDate: '2026-04-25',
      actualDate: null,
      status: 'not_started',
      phase: 'Deployment',
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Milestones</h1>
        <div style={styles.summary}>
          <div style={styles.summaryItem}>
            <CheckCircle2 size={20} style={styles.achievedIcon} />
            <span>{milestones.filter(m => m.status === 'achieved').length} Achieved</span>
          </div>
          <div style={styles.summaryItem}>
            <Clock size={20} style={styles.progressIcon} />
            <span>{milestones.filter(m => m.status === 'in_progress').length} In Progress</span>
          </div>
          <div style={styles.summaryItem}>
            <Circle size={20} style={styles.pendingIcon} />
            <span>{milestones.filter(m => m.status === 'not_started').length} Upcoming</span>
          </div>
        </div>
      </div>

      <div style={styles.timeline}>
        {milestones.map((milestone, index) => (
          <MilestoneCard 
            key={milestone.id} 
            milestone={milestone} 
            isLast={index === milestones.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function MilestoneCard({ milestone, isLast }) {
  const getIcon = () => {
    switch (milestone.status) {
      case 'achieved':
        return <CheckCircle2 size={24} style={styles.achievedIcon} />;
      case 'in_progress':
        return <Clock size={24} style={styles.progressIcon} />;
      case 'at_risk':
        return <AlertCircle size={24} style={styles.riskIcon} />;
      default:
        return <Circle size={24} style={styles.pendingIcon} />;
    }
  };

  const getDaysInfo = () => {
    if (milestone.actualDate) {
      return `Completed on ${formatDate(milestone.actualDate)}`;
    }
    const days = daysUntil(milestone.targetDate);
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    return `${days} days remaining`;
  };

  return (
    <div style={styles.milestoneCard}>
      <div style={styles.iconWrapper}>
        {getIcon()}
        {!isLast && <div style={styles.connector} />}
      </div>

      <div style={styles.content}>
        <div style={styles.cardHeader}>
          <div>
            <h3 style={styles.milestoneName}>{milestone.name}</h3>
            <p style={styles.milestoneDesc}>{milestone.description}</p>
          </div>
          <div style={styles.phase}>{milestone.phase}</div>
        </div>

        <div style={styles.cardFooter}>
          <div style={styles.date}>
            <span style={styles.dateLabel}>Target:</span>
            <span style={styles.dateValue}>{formatDate(milestone.targetDate)}</span>
          </div>
          <div style={styles.daysInfo}>
            {getDaysInfo()}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '1.5rem',
  },
  summary: {
    display: 'flex',
    gap: '2rem',
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9375rem',
    color: '#a0a0a0',
  },
  achievedIcon: {
    color: '#10b981',
  },
  progressIcon: {
    color: '#3b82f6',
  },
  pendingIcon: {
    color: '#666666',
  },
  riskIcon: {
    color: '#f59e0b',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  milestoneCard: {
    display: 'flex',
    gap: '1.5rem',
    position: 'relative',
  },
  iconWrapper: {
    position: 'relative',
    flexShrink: 0,
    paddingTop: '0.375rem',
  },
  connector: {
    position: 'absolute',
    left: '50%',
    top: '36px',
    bottom: '-16px',
    width: '2px',
    backgroundColor: '#2a2a2a',
    transform: 'translateX(-50%)',
  },
  content: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  milestoneName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  milestoneDesc: {
    fontSize: '0.9375rem',
    color: '#a0a0a0',
    lineHeight: 1.6,
  },
  phase: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    fontSize: '0.75rem',
    color: '#a0a0a0',
    height: 'fit-content',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #2a2a2a',
  },
  date: {
    display: 'flex',
    gap: '0.5rem',
    fontSize: '0.875rem',
  },
  dateLabel: {
    color: '#666666',
  },
  dateValue: {
    color: '#ffffff',
    fontWeight: '500',
  },
  daysInfo: {
    fontSize: '0.875rem',
    color: '#a0a0a0',
    fontWeight: '500',
  },
};