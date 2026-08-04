import { performance } from 'node:perf_hooks';

export type ContentLogLevel = 'silent' | 'perf' | 'debug';

interface PerformanceStats {
  count: number;
  total: number;
  max: number;
}

const performanceStats = new Map<string, PerformanceStats>();
let flushTimer: ReturnType<typeof setTimeout> | undefined;
let hasExitHandler = false;

export const resolveContentLogLevel = (value = process.env.CONTENT_LOG_LEVEL): ContentLogLevel => {
  if (value === 'silent' || value === 'perf' || value === 'debug') {
    return value;
  }
  return 'perf';
};

export const formatDuration = (duration: number) => `${Math.max(0, duration).toFixed(1)}ms`;

export const formatPerformanceSummary = (name: string, stats: PerformanceStats) => {
  const average = stats.count > 0 ? stats.total / stats.count : 0;
  return `[content:perf] ${name} count=${stats.count} total=${formatDuration(stats.total)} avg=${formatDuration(average)} max=${formatDuration(stats.max)}`;
};

const flushPerformanceStats = () => {
  flushTimer = undefined;
  for (const [name, stats] of [...performanceStats].sort(([a], [b]) => a.localeCompare(b))) {
    console.info(formatPerformanceSummary(name, stats));
  }
  performanceStats.clear();
};

const schedulePerformanceFlush = () => {
  if (flushTimer) {
    clearTimeout(flushTimer);
  }
  flushTimer = setTimeout(flushPerformanceStats, 100);
  flushTimer.unref();

  if (!hasExitHandler) {
    process.once('beforeExit', flushPerformanceStats);
    hasExitHandler = true;
  }
};

export const startPerf = () => {
  if (resolveContentLogLevel() === 'silent') {
    return null;
  }
  return performance.now();
};

export const endPerf = (name: string, start: number | null) => {
  if (start === null) {
    return;
  }
  const duration = performance.now() - start;
  const stats = performanceStats.get(name) ?? { count: 0, total: 0, max: 0 };
  stats.count += 1;
  stats.total += duration;
  stats.max = Math.max(stats.max, duration);
  performanceStats.set(name, stats);
  schedulePerformanceFlush();
};

export const logCacheHit = (key: string) => {
  if (resolveContentLogLevel() === 'debug') {
    console.info(`[content:cache] hit ${key}`);
  }
};
