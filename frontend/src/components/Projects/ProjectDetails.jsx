/**
 * ProjectDetails Component
 * Detailed view of a single project
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProjects';
import { ArrowLeft, Calendar, Users, Target, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/dateHelpers';
import { calculateTaskProgress } from '../../utils/taskHelpers';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project, loading, error } = useProject(projectId);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Project not found</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/projects')} style={styles.backButton}>
        <ArrowLeft size={20} />
        Back to Projects
      </button>

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{project.name}</h1>
          <p style={styles.description}>{project.description}</p>
        </div>
        <div style={styles.actions}>
          <button style={styles.actionButton}>
            <Edit size={18} />
            Edit
          </button>
          <button style={{ ...styles.actionButton, ...styles.deleteButton }}>
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard
          icon={Target}
          label="Completion"
          value={`${project.completion_percentage || 0}%`}
          color="#3b82f6"
        />
        <StatCard
          icon={Calendar}
          label="Deadline"
          value={project.deadline ? formatDate(project.deadline) : 'No deadline'}
          color="#f59e0b"
        />
        <StatCard
          icon={Users}
          label="Team Members"
          value={project.team_members?.length || 0}
          color="#10b981"
        />
        <StatCard
          icon={TrendingUp}
          label="Status"
          value={project.status || 'Active'}
          color="#3b82f6"
        />
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Project Goals</h2>
          <div style={styles.goalsList}>
            {project.goals?.map((goal, index) => (
              <div key={index} style={styles.goalItem}>
                <div style={styles.goalNumber}>{index + 1}</div>
                <span style={styles.goalText}>{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {project.phases && project.phases.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Project Phases</h2>
            <div style={styles.phasesList}>
              {project.phases.map((phase, index) => (
                <PhaseCard key={index} phase={phase} />
              ))}
            </div>
          </div>
        )}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Project Timeline</h2>
          <div style={styles.timeline}>
            <div style={styles.timelineItem}>
              <span style={styles.timelineLabel}>Start Date:</span>
              <span style={styles.timelineValue}>
                {project.start_date ? formatDate(project.start_date) : 'Not set'}
              </span>
            </div>
            <div style={styles.timelineItem}>
              <span style={styles.timelineLabel}>End Date:</span>
              <span style={styles.timelineValue}>
                {project.end_date ? formatDate(project.end_date) : 'Not set'}
              </span>
            </div>
            <div style={styles.timelineItem}>
              <span style={styles.timelineLabel}>Deadline:</span>
              <span style={styles.timelineValue}>
                {project.deadline ? formatDate(project.deadline) : 'No deadline'}
              </span>
            </div>
          </div>
        </div>

        {project.team_members && project.team_members.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Team Members</h2>
            <div style={styles.teamGrid}>
              {project.team_members.map((member, index) => (
                <div key={index} style={styles.teamMember}>
                  <div style={styles.avatar}>
                    {member.charAt(0).toUpperCase()}
                  </div>
                  <span style={styles.memberName}>{member}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statIcon, backgroundColor: `${color}20` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statValue}>{value}</div>
      </div>
    </div>
  );
}

function PhaseCard({ phase }) {
  return (
    <div style={styles.phaseCard}>
      <div style={styles.phaseHeader}>
        <h3 style={styles.phaseName}>{phase.name}</h3>
        <span style={styles.phaseStatus}>{phase.status || 'Not Started'}</span>
      </div>
      {phase.description && (
        <p style={styles.phaseDesc}>{phase.description}</p>
      )}
      <div style={styles.phaseProgress}>
        <div style={styles.progressLabel}>
          <span>Progress</span>
          <span>{phase.completion_percentage || 0}%</span>
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${phase.completion_percentage || 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#a0a0a0',
    fontSize: '0.875rem',
    cursor: 'pointer',
    marginBottom: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '1.125rem',
    color: '#a0a0a0',
    lineHeight: 1.6,
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1rem',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  deleteButton: {
    color: '#ef4444',
    borderColor: '#ef444420',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  statIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#a0a0a0',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  section: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '2rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '1.5rem',
  },
  goalsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  goalItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  goalNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.875rem',
    flexShrink: 0,
  },
  goalText: {
    fontSize: '1rem',
    color: '#a0a0a0',
  },
  phasesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
  },
  phaseCard: {
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '1.25rem',
  },
  phaseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  phaseName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  phaseStatus: {
    fontSize: '0.75rem',
    color: '#a0a0a0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  phaseDesc: {
    fontSize: '0.875rem',
    color: '#a0a0a0',
    marginBottom: '1rem',
  },
  phaseProgress: {
    marginTop: '1rem',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    color: '#a0a0a0',
    marginBottom: '0.5rem',
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#000000',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 0.3s',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  timelineItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
  },
  timelineLabel: {
    fontSize: '0.875rem',
    color: '#666666',
  },
  timelineValue: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  teamMember: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  memberName: {
    fontSize: '0.9375rem',
    color: '#ffffff',
    fontWeight: '500',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#a0a0a0',
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    color: '#ef4444',
  },
};