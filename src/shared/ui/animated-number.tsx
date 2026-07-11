"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  duration?: number;
  decimals?: number;
  enabled?: boolean;
}

export function useCountUp(
  target: number,
  { duration = 1200, decimals = 0, enabled = true }: UseCountUpOptions = {}
) {
  const [value, setValue] = useState(enabled ? 0 : target);
  const previousTarget = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      previousTarget.current = target;
      return;
    }

    const start = previousTarget.current;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      const factor = Math.pow(10, decimals);
      setValue(Math.round(current * factor) / factor);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousTarget.current = target;
        setValue(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, decimals, enabled]);

  return value;
}

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  format?: (value: number) => string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 1200,
  decimals = 0,
  format,
  className,
}: AnimatedNumberProps) {
  const animatedValue = useCountUp(value, {
    duration,
    decimals,
    enabled: duration > 0,
  });

  const display = format
    ? format(animatedValue)
    : decimals > 0
      ? animatedValue.toFixed(decimals)
      : String(Math.round(animatedValue));

  return <span className={className}>{display}</span>;
}
