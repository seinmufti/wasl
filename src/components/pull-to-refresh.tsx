"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  indicatorOffset,
  PULL_TO_REFRESH,
  pullProgress,
  resistedPull,
} from "@/lib/pull-to-refresh-config";
import { cn } from "@/lib/utils";

export function LoadingCircle({
  progress,
  spinning = false,
  className,
}: {
  progress: number;
  spinning?: boolean;
  className?: string;
}) {
  const { ringSize, ringStroke, ringSpinOffset } = PULL_TO_REFRESH;
  const radius = (ringSize - ringStroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div
      className={cn(
        "flex size-11 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border/60",
        spinning && "shadow-lg",
        className,
      )}
    >
      <svg
        width={ringSize}
        height={ringSize}
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        className={cn(spinning && "animate-spin")}
        aria-hidden
      >
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          className="stroke-muted/40"
          strokeWidth={ringStroke}
          fill="none"
        />
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          className="stroke-primary"
          strokeWidth={ringStroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={spinning ? circumference * ringSpinOffset : offset}
          transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
        />
      </svg>
    </div>
  );
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
}: {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [animating, setAnimating] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const pullRef = useRef(0);
  const refreshingRef = useRef(false);
  const triggeredRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);

  const progress = pullProgress(pull);
  const visible = pull > 0 || refreshing;
  const offset = indicatorOffset(pull, refreshing);
  const contentOffset = !refreshing && pull > 0 ? pull : 0;

  const updatePull = useCallback((value: number) => {
    pullRef.current = value;
    setPull(value);
  }, []);

  const runRefresh = useCallback(async () => {
    if (refreshingRef.current || triggeredRef.current) return;
    triggeredRef.current = true;
    pulling.current = false;
    refreshingRef.current = true;
    setRefreshing(true);
    setAnimating(true);
    updatePull(0);

    try {
      await onRefreshRef.current();
    } finally {
      setRefreshing(false);
      refreshingRef.current = false;
      triggeredRef.current = false;
      updatePull(0);
      window.setTimeout(() => setAnimating(false), PULL_TO_REFRESH.snapDuration);
    }
  }, [updatePull]);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    function onTouchStart(event: TouchEvent) {
      if (refreshingRef.current || element!.scrollTop > 0) return;
      startY.current = event.touches[0].clientY;
      pulling.current = true;
      triggeredRef.current = false;
      setAnimating(false);
    }

    function onTouchMove(event: TouchEvent) {
      if (!pulling.current || refreshingRef.current || triggeredRef.current) return;
      if (element!.scrollTop > 0) {
        pulling.current = false;
        updatePull(0);
        return;
      }

      const delta = event.touches[0].clientY - startY.current;
      if (delta > 0) {
        const resisted = resistedPull(delta);
        updatePull(resisted);
        if (resisted > PULL_TO_REFRESH.dragStart) event.preventDefault();

        if (resisted >= PULL_TO_REFRESH.threshold) {
          void runRefresh();
        }
      } else {
        updatePull(0);
      }
    }

    function onTouchEnd() {
      if (!pulling.current) return;
      pulling.current = false;

      if (triggeredRef.current || refreshingRef.current) return;

      setAnimating(true);
      updatePull(0);
      window.setTimeout(() => setAnimating(false), PULL_TO_REFRESH.snapDuration);
    }

    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchmove", onTouchMove, { passive: false });
    element.addEventListener("touchend", onTouchEnd, { passive: true });
    element.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [runRefresh, updatePull]);

  return (
    <div className={cn("relative min-h-0 flex-1 overflow-hidden", className)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 z-10 flex justify-center",
          animating && "transition-[transform,opacity] duration-200 ease-out",
          visible ? "opacity-100" : "opacity-0",
        )}
        style={{ transform: `translateY(${offset}px)` }}
        aria-hidden={!visible}
      >
        <LoadingCircle progress={progress} spinning={refreshing} />
      </div>

      <div
        ref={scrollRef}
        data-page-scroll
        className={cn(
          "h-full min-h-0 touch-pan-y overflow-y-auto overscroll-y-contain px-5 py-5",
          animating && "transition-transform duration-200 ease-out",
        )}
        style={{
          transform: contentOffset > 0 ? `translateY(${contentOffset}px)` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
