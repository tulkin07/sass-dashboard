interface MiniBarChartProps {
  data: number[];
  color?: string;
  className?: string;
}

export function MiniBarChart({
  data,
  color = "#2065D1",
  className,
}: MiniBarChartProps) {
  const bars = data.slice(-7);
  const max = Math.max(...bars, 1);
  const maxHeight = 48;

  return (
    <div
      className={`flex h-12 shrink-0 items-end gap-[3px] ${className ?? ""}`}
      aria-hidden="true"
    >
      {bars.map((value, index) => {
        const height = Math.max(8, Math.round((value / max) * maxHeight));
        return (
          <div
            key={index}
            className="w-[5px] rounded-[2px]"
            style={{
              height: `${height}px`,
              backgroundColor: color,
              opacity: 0.7 + (index / bars.length) * 0.3,
            }}
          />
        );
      })}
    </div>
  );
}
