"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const VIRTUAL_THRESHOLD = 15;

export function useVirtualTable(count: number, estimateSize = 52) {
  const parentRef = useRef<HTMLDivElement>(null);
  const enabled = count > VIRTUAL_THRESHOLD;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 6,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = enabled && virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    enabled && virtualRows.length > 0
      ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0;

  return {
    parentRef,
    enabled,
    virtualRows,
    paddingTop,
    paddingBottom,
    measureElement: virtualizer.measureElement,
  };
}
