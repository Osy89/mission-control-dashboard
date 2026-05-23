interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export default function ProgressBar({
  current,
  target,
  label,
  color = '#00FFFF',
  size = 'md',
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);

  const heightMap = { sm: 4, md: 8, lg: 12 };
  const height = heightMap[size];

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs text-[#8B95A5] font-medium">{label}</span>
          )}
          {showPercentage && (
            <span className="text-xs font-mono font-medium" style={{ color }}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, backgroundColor: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] font-mono text-[#4A5568]">
          {typeof current === 'number' && current > 1000
            ? `£${(current / 1000).toFixed(1)}K`
            : current}
        </span>
        <span className="text-[10px] font-mono text-[#4A5568]">
          {typeof target === 'number' && target > 1000
            ? `£${(target / 1000).toFixed(0)}K`
            : target}
        </span>
      </div>
    </div>
  );
}
