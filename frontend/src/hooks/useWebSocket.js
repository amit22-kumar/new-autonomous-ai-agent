/**
 * useWebSocket Hook
 * React hook for WebSocket functionality
 */

import { useState, useEffect, useCallback } from 'react';
import websocketService from '../services/websocket';

export function useWebSocket(sessionId = null) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const connect = async () => {
      try {
        await websocketService.connect(sessionId);
      } catch (err) {
        setError(err.message);
      }
    };

    connect();

    const unsubscribeMessage = websocketService.onMessage((data) => {
      if (data.type === 'message') {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
        }]);
        setIsLoading(false);
      }
    });

    const unsubscribeStatus = websocketService.onStatus((status) => {
      setIsConnected(status.connected);
    });

    const unsubscribeError = websocketService.onError((err) => {
      setError(err.message);
      setIsLoading(false);
    });

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
      unsubscribeError();
      websocketService.disconnect();
    };
  }, [sessionId]);

  const sendMessage = useCallback((message, projectId = null) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      websocketService.sendMessage(message, projectId);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isConnected,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}