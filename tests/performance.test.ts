import { describe, expect, test } from 'bun:test';

import {
  formatDuration,
  formatPerformanceSummary,
  resolveContentLogLevel,
} from '@/utils/performance';

describe('content diagnostics', () => {
  test('defaults unknown and missing log levels to perf', () => {
    expect(resolveContentLogLevel(undefined)).toBe('perf');
    expect(resolveContentLogLevel('verbose')).toBe('perf');
  });

  test('accepts the documented diagnostic levels', () => {
    expect(resolveContentLogLevel('silent')).toBe('silent');
    expect(resolveContentLogLevel('perf')).toBe('perf');
    expect(resolveContentLogLevel('debug')).toBe('debug');
  });

  test('formats durations consistently', () => {
    expect(formatDuration(12.345)).toBe('12.3ms');
    expect(formatDuration(-1)).toBe('0.0ms');
  });

  test('formats aggregated performance summaries', () => {
    expect(formatPerformanceSummary('getPostContent', { count: 2, total: 10, max: 7 })).toBe(
      '[content:perf] getPostContent count=2 total=10.0ms avg=5.0ms max=7.0ms',
    );
  });
});
