/**
 * StatusReport Component
 * Displays project status reports
 */

import { useState, useEffect } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Download, FileText, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateHelpers';
import ProgressChart from './ProgressChart';

export default function StatusReport() {
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [reportType, setReportType] = useState('weekly');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-select first project
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id || projects[0].project_id);
    }
  }, [projects, selectedProjectId]);

  const selectedProject = projects?.find(
    p => (p.id === selectedProjectId || p.project_id === selectedProjectId)
  );

  const handleGenerate = async () => {
    if (!selectedProjectId) {
      setError('Please select a project first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/projects/${selectedProjectId}/report?type=${reportType}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      const result = await response.json();
      setReport(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Status Reports</h1>
        <div style={styles.actions}>
          {projects && projects.length > 0 && (
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={styles.select}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option 
                  key={project.id || project.project_id} 
                  value={project.id || project.project_id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          )}
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            style={styles.select}
          >
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="executive">Executive Summary</option>
            <option value="detailed">Detailed Report</option>
          </select>
          <button
            onClick={handleGenerate}
            disabled={loading || !selectedProjectId}
            style={{
              ...styles.generateButton,
              ...(loading || !selectedProjectId ? styles.disabledButton : {})
            }}
          >
            <FileText size={18} />
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {selectedProject && (
        <div style={styles.projectInfo}>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Project</div>
            <div style={styles.infoValue}>{selectedProject.name}</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Completion</div>
            <div style={styles.infoValue}>
              {selectedProject.completion_percentage || 0}%
            </div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Status</div>
            <div style={styles.infoValue}>
              {selectedProject.status || 'Active'}
            </div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Health</div>
            <div style={{
              ...styles.healthIndicator,
              backgroundColor: getHealthColor(selectedProject.health_indicator),
            }} />
          </div>
        </div>
      )}

      {report && (
        <div style={styles.reportContent}>
          <div style={styles.reportHeader}>
            <div style={styles.reportMeta}>
              <Calendar size={16} />
              <span>Generated on {formatDate(report.generated_at)}</span>
            </div>
            <button style={styles.downloadButton}>
              <Download size={16} />
              Export PDF
            </button>
          </div>

          <div style={styles.reportBody}>
            <div style={styles.reportText}>
              {report.report || 'Report content will appear here...'}
            </div>
          </div>
        </div>
      )}

      {!report && !loading && (
        <div style={styles.empty}>
          <FileText size={48} style={styles.emptyIcon} />
          <h3 style={styles.emptyTitle}>No Report Generated</h3>
          <p style={styles.emptyText}>
            {projects && projects.length === 0 
              ? 'Create a project first before generating reports'
              : 'Select a project, choose report type, and click "Generate Report"'
            }
          </p>
        </div>
      )}

      {selectedProject && (
        <div style={styles.charts}>
          <h2 style={styles.chartsTitle}>Project Metrics</h2>
          <ProgressChart projectData={selectedProject} />
        </div>
      )}
    </div>
  );
}

function getHealthColor(indicator) {
  const colors = {
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
  };
  return colors[indicator] || '#666666';
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  select: {
    padding: '0.625rem 0.875rem',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  generateButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1.25rem',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  errorBox: {
    padding: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    marginBottom: '2rem',
  },
  projectInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  infoCard: {
    padding: '1.25rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
  },
  infoLabel: {
    fontSize: '0.75rem',
    color: '#666666',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  healthIndicator: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginTop: '0.5rem',
  },
  reportContent: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '2rem',
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #2a2a2a',
  },
  reportMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#a0a0a0',
  },
  downloadButton: {
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
  },
  reportBody: {
    padding: '2rem',
  },
  reportText: {
    fontSize: '0.9375rem',
    color: '#a0a0a0',
    lineHeight: 1.8,
    whiteSpace: 'pre-wrap',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  emptyIcon: {
    color: '#666666',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  emptyText: {
    fontSize: '0.9375rem',
    color: '#a0a0a0',
    maxWidth: '400px',
  },
  charts: {
    marginTop: '3rem',
  },
  chartsTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '1.5rem',
  },
};