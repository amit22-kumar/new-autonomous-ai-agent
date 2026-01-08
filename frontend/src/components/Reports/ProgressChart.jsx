/**
 * ProgressChart Component
 * Visual charts for project metrics using Recharts
 */

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ProgressChart({ projectData }) {
  // Mock data - replace with actual project data
  const taskStatusData = [
    { name: 'Not Started', value: 5, color: '#666666' },
    { name: 'In Progress', value: 8, color: '#3b82f6' },
    { name: 'Completed', value: 12, color: '#10b981' },
    { name: 'Blocked', value: 2, color: '#ef4444' },
  ];

  const phaseProgressData = [
    { phase: 'Planning', progress: 100 },
    { phase: 'Development', progress: 65 },
    { phase: 'Testing', progress: 30 },
    { phase: 'Deployment', progress: 0 },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.chartGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  color: '#ffffff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={styles.legend}>
            {taskStatusData.map((item, index) => (
              <div key={index} style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: item.color }} />
                <span style={styles.legendLabel}>{item.name}</span>
                <span style={styles.legendValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Phase Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={phaseProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis 
                dataKey="phase" 
                stroke="#666666"
                style={{ fontSize: '0.75rem' }}
              />
              <YAxis 
                stroke="#666666"
                style={{ fontSize: '0.75rem' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  color: '#ffffff',
                }}
              />
              <Bar dataKey="progress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.metricsGrid}>
        <MetricCard 
          label="Total Tasks"
          value="27"
          change="+3 this week"
          positive={true}
        />
        <MetricCard 
          label="Completion Rate"
          value="44%"
          change="+8% this week"
          positive={true}
        />
        <MetricCard 
          label="Avg. Task Duration"
          value="3.2 days"
          change="-0.5 days"
          positive={true}
        />
        <MetricCard 
          label="On-Time Delivery"
          value="85%"
          change="-5% this week"
          positive={false}
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, positive }) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{value}</div>
      <div style={{
        ...styles.metricChange,
        color: positive ? '#10b981' : '#ef4444',
      }}>
        {change}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
  },
  chartCard: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  chartTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '1.5rem',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  legendLabel: {
    flex: 1,
    fontSize: '0.875rem',
    color: '#a0a0a0',
  },
  legendValue: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  metricCard: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '1.25rem',
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: '#666666',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.25rem',
  },
  metricChange: {
    fontSize: '0.875rem',
    fontWeight: '500',
  },
};