/**
 * MessageList Component
 * Displays chat messages
 */

import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';
import { format } from 'date-fns';

export default function MessageList({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>
          <Bot size={48} />
        </div>
        <h3 style={styles.emptyTitle}>Start a Conversation</h3>
        <p style={styles.emptyText}>
          Ask me anything about your projects, tasks, or request status reports
        </p>
        <div style={styles.suggestions}>
          <div style={styles.suggestion}>Create a project plan</div>
          <div style={styles.suggestion}>Show project status</div>
          <div style={styles.suggestion}>Generate a report</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.messages}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isLoading && <LoadingMessage />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function Message({ message }) {
  const isUser = message.role === 'user';

  return (
    <div style={{
      ...styles.message,
      ...(isUser ? styles.userMessage : styles.assistantMessage),
    }}>
      <div style={styles.messageIcon}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div style={styles.messageContent}>
        <div style={styles.messageText}>{message.content}</div>
        <div style={styles.messageTime}>
          {format(new Date(message.timestamp), 'HH:mm')}
        </div>
      </div>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div style={{ ...styles.message, ...styles.assistantMessage }}>
      <div style={styles.messageIcon}>
        <Bot size={18} />
      </div>
      <div style={styles.messageContent}>
        <div style={styles.loadingDots}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#000000',
  },
  messages: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
  },
  message: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  userMessage: {
    flexDirection: 'row-reverse',
  },
  assistantMessage: {
    flexDirection: 'row',
  },
  messageIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    flexShrink: 0,
  },
  messageContent: {
    flex: 1,
    maxWidth: '70%',
  },
  messageText: {
    padding: '0.875rem 1rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  messageTime: {
    marginTop: '0.375rem',
    fontSize: '0.75rem',
    color: '#666666',
    paddingLeft: '0.25rem',
  },
  loadingDots: {
    padding: '0.875rem 1rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    display: 'flex',
    gap: '0.375rem',
  },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3b82f6',
    marginBottom: '1.5rem',
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
    maxWidth: '400px',
  },
  suggestions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  suggestion: {
    padding: '0.625rem 1rem',
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '20px',
    color: '#a0a0a0',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
};