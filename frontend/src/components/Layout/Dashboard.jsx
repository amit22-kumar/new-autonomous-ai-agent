/**
 * Dashboard Component
 * Main dashboard with overview metrics
 */

import { useProjects } from '../../hooks/useProjects';
import { FolderKanban, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  const stats = calculateStats(projects);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      <div style={styles.statsGrid}>
        <StatCard
          icon={FolderKanban}
          label="Total Projects"
          value={stats.total}
          color="#3b82f6"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={stats.completed}
          color="#10b981"
        />
        <StatCard
          icon={Clock}
          label="In Progress"
          value={stats.inProgress}
          color="#f59e0b"
        />
        <StatCard
          icon={AlertCircle}
          label="At Risk"
          value={stats.atRisk}
          color="#ef4444"
        />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Projects</h2>
        <div style={styles.projectsList}>
          {projects.slice(0, 5).map(project => (
            <ProjectRow key={project.id} project={project} />
          ))}
          {projects.length === 0 && (
            <div style={styles.empty}>No projects yet. Create your first project!</div>
          )}
        </div>
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
        <div style={styles.statValue}>{value}</div>
        <div style={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}

function ProjectRow({ project }) {
  return (
    <div style={styles.projectRow}>
      <div>
        <div style={styles.projectName}>{project.name}</div>
        <div style={styles.projectDesc}>{project.description}</div>
      </div>
      <div style={styles.projectProgress}>
        <span style={styles.progressText}>{project.completion_percentage}%</span>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${project.completion_percentage}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}

function calculateStats(projects) {
  return {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'active').length,
    atRisk: projects.filter(p => p.health_indicator === 'red').length,
  };
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '2rem',
    color: '#ffffff',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
  statValue: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 1,
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#a0a0a0',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#ffffff',
  },
  projectsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  projectRow: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'border-color 0.2s',
    cursor: 'pointer',
  },
  projectName: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: '0.25rem',
  },
  projectDesc: {
    fontSize: '0.875rem',
    color: '#a0a0a0',
  },
  projectProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    minWidth: '200px',
  },
  progressText: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#ffffff',
    minWidth: '40px',
  },
  progressBar: {
    flex: 1,
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
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#a0a0a0',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#a0a0a0',
  },
};