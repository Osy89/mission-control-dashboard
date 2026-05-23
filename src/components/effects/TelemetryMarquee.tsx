import { useMemo } from 'react';

const telemetryItems = [
  'SYS.CORE: OPTIMAL',
  'NET: 1.2Gbps',
  'TEMP: 42C',
  'AI-7: PROCESSING',
  'SEC: LEVEL 5',
  'DB: SYNCED',
  'AGENT: 10/10 ONLINE',
  'QUEUE: 7 TASKS',
  'MEM: 58%',
  'CPU: 42%',
  'DISK: 68%',
  'UPTIME: 14d 6h',
  'MRR: 12,500',
  'TARGET: 66%',
  'LEADS: 234',
];

export default function TelemetryMarquee() {
  const duplicated = useMemo(() => [...telemetryItems, ...telemetryItems], []);

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          animation: 'scroll-up 20s linear infinite',
          gap: '1.5rem',
        }}
      >
        {duplicated.map((item, index) => (
          <p
            key={index}
            className="font-mono text-xs tracking-wider whitespace-nowrap"
            style={{
              color: item.includes('OPTIMAL') || item.includes('ONLINE') || item.includes('SYNCED')
                ? '#4ADE80'
                : item.includes('PROCESSING') || item.includes('TASKS')
                ? '#FACC15'
                : '#00FFFF',
              opacity: 0.7,
              textShadow: '0 0 8px currentColor',
            }}
          >
            {`> ${item}`}
          </p>
        ))}
      </div>
    </div>
  );
}
