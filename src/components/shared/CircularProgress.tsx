interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  unit?: string;
}

export default function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  label,
  unit = '%',
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const color =
    percentage < 70 ? '#4ADE80' :
    percentage < 85 ? '#FACC15' : '#F87171';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
            style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-heading font-bold text-white">{value.toFixed(1)}</span>
          <span className="text-[9px] font-mono text-[#4A5568]">{unit}</span>
        </div>
      </div>
      <span className="text-[10px] font-mono text-[#8B95A5] uppercase tracking-wider">{label}</span>
    </div>
  );
}
