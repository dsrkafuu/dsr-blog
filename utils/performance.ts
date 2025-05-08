import perfHooks from 'perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`[performance] <${entry.name}>: ${entry.duration}ms`);
  });
  observer.disconnect(); // 断开监听
});

obs.observe({ entryTypes: ['measure'] }); // 监听测量事件

export const startPref = (name: string) => {
  perfHooks.performance.mark(`START_${name}`);
};

export const endPerf = (name: string) => {
  perfHooks.performance.mark(`END_${name}`);
  perfHooks.performance.measure(name, `START_${name}`, `END_${name}`);
};
