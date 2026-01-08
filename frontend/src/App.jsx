/**
 * App Component
 * Main application with routing
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Layout/Dashboard';
import ProjectList from './components/Projects/ProjectList';
import ProjectDetails from './components/Projects/ProjectDetails';
import ChatInterface from './components/Chat/ChatInterface';
import TaskBoard from './components/Tasks/TaskBoard';
import TaskList from './components/Tasks/TaskList';
import GanttChart from './components/Timeline/GanttChart';
import MilestoneTracker from './components/Timeline/MilestoneTracker';
import StatusReport from './components/Reports/StatusReport';
import './styles/main.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />
            <Route path="/tasks" element={<TaskBoard />} />
            <Route path="/tasks/list" element={<TaskList />} />
            <Route path="/timeline" element={<GanttChart />} />
            <Route path="/milestones" element={<MilestoneTracker />} />
            <Route path="/reports" element={<StatusReport />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function ComingSoon() {
  return (
    <div style={styles.comingSoon}>
      <h2 style={styles.title}>Coming Soon</h2>
      <p style={styles.text}>This feature is under development</p>
    </div>
  );
}

const styles = {
  comingSoon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '3rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  text: {
    fontSize: '1rem',
    color: '#a0a0a0',
  },
};