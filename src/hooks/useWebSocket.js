import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;

export default function useWebSocket() {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected, error
    const [error, setError] = useState(null);
    const reconnectTimeoutRef = useRef(null);

    // Ref to keep track of unmounted state to prevent updates
    const isMounted = useRef(true);
    const socketRef = useRef(null);

    const connect = useCallback(async () => {
        if (!WS_URL) {
            setError("WebSocket URL not configured");
            return;
        }

        // Close any existing connection before starting a new one
        if (socketRef.current) {
            console.log('[WS] Closing existing connection before re-connect');
            socketRef.current.close(1000, "Reconnecting");
            socketRef.current = null;
        }

        try {
            setStatus('connecting');
            const session = await fetchAuthSession();
            const token = session.tokens.idToken.toString();

            // AWS WebSocket Auth usually requires token in query param
            const ws = new WebSocket(`${WS_URL}?Auth=${token}`);
            socketRef.current = ws;

            ws.onopen = () => {
                if (isMounted.current && socketRef.current === ws) {
                    setStatus('connected');
                    setError(null);
                    console.log('[WS] Connected');
                }
            };

            ws.onclose = (event) => {
                if (socketRef.current === ws) {
                    socketRef.current = null;
                }

                if (isMounted.current) {
                    setStatus('disconnected');
                    console.log('[WS] Disconnected', event.code, event.reason);

                    // Auto-reconnect if not closed normally (1000)
                    if (event.code !== 1000) {
                        reconnectTimeoutRef.current = setTimeout(() => {
                            console.log('[WS] Attempting reconnect...');
                            connect();
                        }, 3000);
                    }
                }
            };

            ws.onerror = (err) => {
                if (isMounted.current && socketRef.current === ws) {
                    console.error('[WS] Error:', err);
                    setError('Connection error');
                }
            };

            ws.onmessage = (event) => {
                if (isMounted.current && socketRef.current === ws) {
                    try {
                        const data = JSON.parse(event.data);
                        setMessages((prev) => [...prev, { ...data, timestamp: new Date(), direction: 'incoming' }]);
                    } catch (e) {
                        setMessages((prev) => [...prev, { content: event.data, timestamp: new Date(), direction: 'incoming' }]);
                    }
                }
            };

            // Socket stored in ref, state no longer needed

        } catch (err) {
            console.error("Failed to connect:", err);
            if (isMounted.current) {
                setStatus('error');
                setError(err.message);
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        isMounted.current = true;
        connect();

        return () => {
            isMounted.current = false;
            if (socketRef.current) {
                console.log('[WS] Cleaning up connection on unmount');
                socketRef.current.close(1000, "Component unmounted");
                socketRef.current = null;
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect]);

    const sendMessage = useCallback((content) => {
        const currentSocket = socketRef.current;
        if (currentSocket && currentSocket.readyState === WebSocket.OPEN) {
            const payload = JSON.stringify({ action: 'sendmessage', content });
            currentSocket.send(payload);
            // Optimistically add to UI
            setMessages((prev) => [...prev, { content, timestamp: new Date(), direction: 'outgoing' }]);
        } else {
            console.warn("Socket not open. Cannot send.");
        }
    }, []);

    return { status, messages, sendMessage, error };
}
