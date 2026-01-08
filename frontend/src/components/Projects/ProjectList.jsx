/**
 * ProjectList Component
 * Displays all projects in a grid
 */

import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Plus } from 'lucide-react';
import ProjectCard from './ProjectCard';
import CreateProject from './CreateProject';

export default function ProjectList() {
  const { projects, loading, createProject } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreate = async (projectData) => {
    try {
      await createProject(projectData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div className="spinner"></div>
          <div>Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Projects</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          style={styles.createButton}
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📁</div>
          <h3 style={styles.emptyTitle}>No projects yet</h3>
          <p style={styles.emptyText}>Create your first project to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={styles.emptyButton}
          >
            <Plus size={20} />
            Create Project
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateProject
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
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
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '4rem',
    color: '#a0a0a0',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  emptyText: {
    fontSize: '1rem',
    color: '#a0a0a0',
    marginBottom: '2rem',
  },
  emptyButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
};