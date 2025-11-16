import { ref, onMounted, onUnmounted } from 'vue'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'
import type { PerformanceData } from '@/types/portfolio'

export function usePerformanceData() {
  const authStore = useAuthStore()
  const performanceData = ref<PerformanceData>({})
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  let unsubscribe: (() => void) | null = null

  const fetchPerformanceData = () => {
    if (!authStore.userId) {
      error.value = 'User not authenticated'
      isLoading.value = false
      return
    }

    try {
      const performanceDocRef = doc(db, 'performance', authStore.userId)
      
      unsubscribe = onSnapshot(
        performanceDocRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            performanceData.value = docSnapshot.data() as PerformanceData
            error.value = null
          } else {
            // No performance data yet - this is okay
            performanceData.value = {}
            error.value = null
          }
          isLoading.value = false
        },
        (err) => {
          console.error('Error fetching performance data:', err)
          error.value = 'Failed to load performance data'
          isLoading.value = false
        }
      )
    } catch (err) {
      console.error('Error setting up performance listener:', err)
      error.value = 'Failed to setup performance data listener'
      isLoading.value = false
    }
  }

  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
    }
  }

  onMounted(() => {
    fetchPerformanceData()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    performanceData,
    isLoading,
    error,
    fetchPerformanceData,
    cleanup,
  }
}
