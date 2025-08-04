import React, { useState, useEffect } from 'react';

export default function QueueMonitorPage() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const es = new EventSource('http://localhost:3000/_debug/audit_queue/stream');
    es.onmessage = e => {
      try {
        setQueue(JSON.parse(e.data));
      } catch {
        console.error('Invalid SSE JSON', e.data);
      }
    };
    return () => es.close();
  }, []);

  return (
    <div className="queue-monitor-page">
      <h2>AuditQueue Monitor</h2>
      <p>Pending items: {queue.length}</p>
      <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f7f7f7', padding: '1rem' }}>
        {JSON.stringify(queue, null, 2)}
      </pre>
    </div>
  );
}
