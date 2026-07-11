"use client";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";

interface PriceRangeFilterProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  minLabel: string;
  maxLabel: string;
  className?: string;
}

export function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
  minLabel,
  maxLabel,
  className,
}: PriceRangeFilterProps) {
  return (
    <div
      className={cn(
        "flex h-9 shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-2",
        className
      )}
    >
      <Input
        type="number"
        min={min}
        max={value[1]}
        value={value[0]}
        onChange={(e) => {
          const next = e.target.value === "" ? min : Number(e.target.value);
          onChange([Math.min(Math.max(next, min), value[1]), value[1]]);
        }}
        placeholder={minLabel}
        aria-label={minLabel}
        className="h-7 w-[72px] rounded-md border-0 bg-muted/40 px-2 text-xs shadow-none focus-visible:ring-1"
      />
      <span className="text-xs text-muted-foreground">—</span>
      <Input
        type="number"
        min={value[0]}
        max={max}
        value={value[1]}
        onChange={(e) => {
          const next = e.target.value === "" ? max : Number(e.target.value);
          onChange([value[0], Math.max(Math.min(next, max), value[0])]);
        }}
        placeholder={maxLabel}
        aria-label={maxLabel}
        className="h-7 w-[72px] rounded-md border-0 bg-muted/40 px-2 text-xs shadow-none focus-visible:ring-1"
      />
    </div>
  );
}
