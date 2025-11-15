import { ref, onMounted, onUnmounted } from 'vue';

export interface SchedulerOptions {
  intervalMinutes?: number;
  autoStart?: boolean;
}

// Schedule periodic news updates
export function useNewsScheduler(
  fetchCallback: () => Promise<void>,
  options: SchedulerOptions = {}
) {
  const { intervalMinutes = 5, autoStart = false } = options;
  
  const isScheduled = ref(false);
  const lastUpdateTime = ref<Date | null>(null);
  const nextUpdateTime = ref<Date | null>(null);
  let intervalId: number | null = null;

  // Execute fetch with time tracking
  const executeFetch = async () => {
    try {
      await fetchCallback();
      lastUpdateTime.value = new Date();
      nextUpdateTime.value = new Date(Date.now() + intervalMinutes * 60 * 1000);
    } catch (error) {
      console.error('Scheduled fetch failed:', error);
    }
  };

  // Start auto-refresh
  const startScheduler = () => {
    if (isScheduled.value) return;
    isScheduled.value = true;
    executeFetch();
    intervalId = window.setInterval(executeFetch, intervalMinutes * 60 * 1000);
  };

  // Stop auto-refresh
  const stopScheduler = () => {
    if (!isScheduled.value) return;
    isScheduled.value = false;
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    nextUpdateTime.value = null;
  };

  // Manual refresh trigger
  const triggerFetch = async () => {
    await executeFetch();
  };

  // Auto-start if enabled
  onMounted(() => {
    if (autoStart) {
      startScheduler();
    }
  });

  // Clean up on unmount
  onUnmounted(() => {
    stopScheduler();
  });

  return {
    isScheduled,
    lastUpdateTime,
    nextUpdateTime,
    startScheduler,
    stopScheduler,
    triggerFetch,
  };
}
