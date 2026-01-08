/**
 * ChatInterface Component
 * Main AI assistant chat interface
 */

import { useWebSocket } from '../../hooks/useWebSocket';
import { Bot, Wifi, WifiOff } from 'lucide-react';
import MessageList from './MessageList';
import InputBar from './InputBar';

export default function ChatInterface({ projectId = null }) {
  const { messages, isConnected, isLoading, error, sendMessage, clearMessages } = useWebSocket();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.botIcon}>
            <Bot size={24} />
          </div>
          <div>
            <h1 style={styles.title}>AI Assistant</h1>
            <div style={styles.status}>
              {isConnected ? (
                <>
                  <Wifi size={14} style={styles.statusIcon} />
                  <span style={styles.statusText}>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff size={14} style={{ ...styles.statusIcon, color: '#ef4444' }} />
                  <span style={{ ...styles.statusText, color: '#ef4444' }}>Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button onClick={clearMessages} style={styles.clearButton}>
          Clear Chat
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <MessageList messages={messages} isLoading={isLoading} />
      
      <InputBar 
        onSend={sendMessage} 
        disabled={!isConnected || isLoading}
        projectId={projectId}
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 64px)',
    backgroundColor: '#000000',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #2a2a2a',
    backgroundColor: '#0a0a0a',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  botIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3b82f6',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '0.25rem',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
  statusIcon: {
    color: '#10b981',
  },
  statusText: {
    fontSize: '0.75rem',
    color: '#10b981',
  },
  clearButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#a0a0a0',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  error: {
    padding: '1rem 2rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    fontSize: '0.875rem',
  },
};