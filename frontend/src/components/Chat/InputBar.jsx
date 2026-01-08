/**
 * InputBar Component
 * Message input field with send button
 */

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function InputBar({ onSend, disabled, projectId }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSend(message, projectId);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about your projects..."
          disabled={disabled}
          rows={1}
          style={styles.input}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          style={{
            ...styles.button,
            ...(disabled || !message.trim() ? styles.buttonDisabled : {}),
          }}
        >
          <Send size={18} />
        </button>
      </form>
      <div style={styles.hint}>
        Press <kbd style={styles.kbd}>Enter</kbd> to send • <kbd style={styles.kbd}>Shift + Enter</kbd> for new line
      </div>
    </div>
  );
}

const styles = {
  container: {
    borderTop: '1px solid #2a2a2a',
    backgroundColor: '#0a0a0a',
    padding: '1.5rem 2rem',
  },
  form: {
    display: 'flex',
    gap: '0.75rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  input: {
    flex: 1,
    padding: '0.875rem 1rem',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
    resize: 'none',
    minHeight: '48px',
    maxHeight: '200px',
    lineHeight: 1.5,
  },
  button: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background 0.2s',
    flexShrink: 0,
  },
  buttonDisabled: {
    backgroundColor: '#141414',
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  hint: {
    marginTop: '0.75rem',
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#666666',
  },
  kbd: {
    padding: '0.125rem 0.375rem',
    backgroundColor: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '4px',
    fontSize: '0.6875rem',
    fontFamily: 'monospace',
    color: '#a0a0a0',
  },
};