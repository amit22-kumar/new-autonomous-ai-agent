/**
 * WebSocket Service
 * Manages WebSocket connection for real-time chat
 */

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.sessionId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.messageHandlers = [];
    this.errorHandlers = [];
    this.statusHandlers = [];
  }

  connect(sessionId) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    this.sessionId = sessionId || `session_${Date.now()}`;
    const url = `${WS_BASE_URL}/ws/${this.sessionId}`;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.notifyStatus({ type: 'connected', connected: true });
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.notifyError(error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.notifyStatus({ type: 'disconnected', connected: false });
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  sendMessage(message, projectId = null) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    const payload = {
      message,
      project_id: projectId,
      timestamp: new Date().toISOString(),
    };

    this.ws.send(JSON.stringify(payload));
  }

  handleMessage(data) {
    if (data.type === 'error') {
      this.notifyError(new Error(data.message));
    } else {
      this.messageHandlers.forEach(handler => handler(data));
    }
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onError(handler) {
    this.errorHandlers.push(handler);
    return () => {
      this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
    };
  }

  onStatus(handler) {
    this.statusHandlers.push(handler);
    return () => {
      this.statusHandlers = this.statusHandlers.filter(h => h !== handler);
    };
  }

  notifyError(error) {
    this.errorHandlers.forEach(handler => handler(error));
  }

  notifyStatus(status) {
    this.statusHandlers.forEach(handler => handler(status));
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);

    console.log(`Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (this.sessionId) {
        this.connect(this.sessionId).catch(console.error);
      }
    }, delay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.sessionId = null;
    this.reconnectAttempts = 0;
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Create a single instance and export it as default
const websocketService = new WebSocketService();
export default websocketService;