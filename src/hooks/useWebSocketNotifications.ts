import { useState, useEffect, useRef } from 'react';

// Define types for connection status
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

/**
 * Custom hook for WebSocket notification handling
 * 
 * @param token The authentication token
 * @param enabled Whether the WebSocket should be enabled
 * @returns Connection status and notification count
 */
export function useWebSocketNotifications(token: string | null, enabled: boolean = true) {
  // State for connection status and notifications
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Use a ref for the WebSocket to avoid triggering effect reruns
  const webSocketRef = useRef<WebSocket | null>(null);
  
  // Initialize WebSocket connection
  useEffect(() => {
    if (!enabled || !token) return;
    
    // Close existing connection if any
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }
    
    // Update connection status
    setConnectionStatus('connecting');
    
    // Create new WebSocket connection
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
    const ws = new WebSocket(`${wsUrl}?token=${token}`);
    webSocketRef.current = ws;
    
    // Set up event handlers
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
      webSocketRef.current = null;
    };
    
    ws.onerror = () => {
      console.error('WebSocket error');
      setConnectionStatus('disconnected');
    };
    
    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        
        // Handle notification messages
        if (parsedData.type === 'notification') {
          setNotificationCount(prev => prev + 1);
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };
    
    // Clean up on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [enabled, token]);
  
  // Reset notification count
  const resetNotificationCount = () => {
    setNotificationCount(0);
  };
  
  return {
    connectionStatus,
    notificationCount,
    resetNotificationCount
  };
}