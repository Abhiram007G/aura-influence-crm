import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { config } from './config';

interface LogEntry {
  message: string;
  status: string;
  timestamp: string;
  progress?: number;
  data?: any;
}

interface CampaignLogState {
  logs: LogEntry[];
  isStreaming: boolean;
  streamError: string | null;
}

interface LogContextType {
  getLogs: (campaignId: string) => CampaignLogState;
  startLogStream: (campaignId: string) => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const useLogContext = () => {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error('useLogContext must be used within a LogProvider');
  return ctx;
};

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaignLogs, setCampaignLogs] = useState<Record<string, CampaignLogState>>({});
  const streamControllers = useRef<Record<string, AbortController>>({});
  const streamStarted = useRef<Record<string, boolean>>({});

  // Helper to parse stream lines
  const parseStreamLine = (line: string) => {
    try {
      if (line.startsWith('data: ')) {
        return JSON.parse(line.replace('data: ', ''));
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const getLogs = useCallback((campaignId: string): CampaignLogState => {
    return (
      campaignLogs[campaignId] || {
        logs: [],
        isStreaming: false,
        streamError: null,
      }
    );
  }, [campaignLogs]); 

  const startLogStream = useCallback((campaignId: string) => {
    if (streamStarted.current[campaignId]) return; // Already streaming
    streamStarted.current[campaignId] = true;
    setCampaignLogs((prev) => ({
      ...prev,
      [campaignId]: { logs: [], isStreaming: true, streamError: null },
    }));
    const abortController = new AbortController();
    streamControllers.current[campaignId] = abortController;

    const fetchLogs = async () => {
      try {
        const response = await fetch(`${config.agentApiBaseUrl}/api/campaign-trigger/trigger/${campaignId}/stream?force_refresh=false&max_creators=5&call_priority=high_match`, {
          method: 'GET',
          signal: abortController.signal,
        });
        if (!response.body) throw new Error('No stream');
        const reader = response.body.getReader();
        let decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (let line of lines) {
            const parsed = parseStreamLine(line);
            if (parsed) {
              setCampaignLogs((prev) => {
                const prevLogs = prev[campaignId]?.logs || [];
                return {
                  ...prev,
                  [campaignId]: {
                    ...prev[campaignId],
                    logs: [...prevLogs, parsed],
                    isStreaming: true,
                    streamError: null,
                  },
                };
              });
            }
          }
        }
        setCampaignLogs((prev) => ({
          ...prev,
          [campaignId]: {
            ...prev[campaignId],
            isStreaming: false,
          },
        }));
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setCampaignLogs((prev) => ({
            ...prev,
            [campaignId]: {
              ...prev[campaignId],
              isStreaming: false,
              streamError: 'Failed to stream logs.',
            },
          }));
        }
      }
    };
    fetchLogs();
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      Object.values(streamControllers.current).forEach((controller) => controller.abort());
    };
  }, []);

  return (
    <LogContext.Provider value={{ getLogs, startLogStream }}>
      {children}
    </LogContext.Provider>
  );
}; 