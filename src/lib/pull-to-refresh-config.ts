/** Shared pull-to-refresh physics — keep every page identical. */
export const PULL_TO_REFRESH = {
  threshold: 100,
  maxPull: 160,
  resistance: 0.55,
  indicatorRatio: 0.65,
  indicatorMin: 8,
  indicatorRefreshing: 52,
  dragStart: 8,
  snapDuration: 220,
  ringSize: 32,
  ringStroke: 3,
  ringSpinOffset: 0.3,
} as const;

export function resistedPull(fingerDelta: number) {
  return Math.min(
    PULL_TO_REFRESH.maxPull,
    fingerDelta * PULL_TO_REFRESH.resistance,
  );
}

export function pullProgress(pull: number) {
  return Math.min(pull / PULL_TO_REFRESH.threshold, 1);
}

export function indicatorOffset(pull: number, refreshing: boolean) {
  if (refreshing) return PULL_TO_REFRESH.indicatorRefreshing;
  return Math.max(PULL_TO_REFRESH.indicatorMin, pull * PULL_TO_REFRESH.indicatorRatio);
}
