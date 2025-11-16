<script setup lang="ts">
import Dashboard from './Dashboard/Dashboard.vue'
import NewsCard from './NewsFeed/NewsCard.vue'
import NewsDescription from './NewsFeed/NewsDescription.vue'
import { useNewsData } from '@/composables/useNewsData'
import { useNewsSelection } from '@/composables/useNewsSelection'
import { useNewsScheduler } from '@/composables/useNewsScheduler'
import { useNewsActions } from '@/composables/useNewsActions'
import { computed } from 'vue'

const { newsItems, stockData, isLoading, error, loadStockData, loadNews, loadDemoNews } =
  useNewsData()
const { selectedNews, selectNews, clearSelection } = useNewsSelection()

const { lastUpdateTime, nextUpdateTime, triggerFetch } = useNewsScheduler(
  async () => {
    await loadNews()
  },
  { intervalMinutes: 5, autoStart: false },
)

const { handleNewsClick, handleClose } = useNewsActions(
  selectedNews,
  selectNews,
  clearSelection,
  loadStockData,
)

const lastUpdateFormatted = computed(() => {
  if (!lastUpdateTime.value) return 'Never'
  return lastUpdateTime.value.toLocaleTimeString()
})

const nextUpdateFormatted = computed(() => {
  if (!nextUpdateTime.value) return 'N/A'
  return nextUpdateTime.value.toLocaleTimeString()
})

const handleRefresh = async () => {
  await triggerFetch()
}

const handleDemoNews = async () => {
  await loadDemoNews()
}
</script>

<template>
  <div class="split-layout">
    <div class="news-section pa-6" style="font-family: afacad; background-color: #f9f9fb">
      <div class="d-flex justify-space-between align-center mb-4">
        <div>
          <h1>News Feed</h1>
          <h3 class="font-weight-light">Latest news affecting your portfolio</h3>
        </div>
        <div class="d-flex align-center" style="gap: 12px">
          <div class="d-flex align-center" style="gap: 8px">
            <v-btn
              color="primary"
              variant="tonal"
              size="small"
              :loading="isLoading"
              @click="handleDemoNews"
              prepend-icon="mdi-presentation"
            >
              Demo
            </v-btn>

            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              :loading="isLoading"
              @click="handleRefresh"
              prepend-icon="mdi-refresh"
            >
              Refresh
            </v-btn>
          </div>

          <div class="d-flex flex-column" style="gap: 2px">
            <div class="text-caption text-grey">Last: {{ lastUpdateFormatted }}</div>
            <div class="text-caption text-grey">Next: {{ nextUpdateFormatted }}</div>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-2 text-grey">Loading news...</p>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <v-icon color="error" size="48">mdi-alert-circle-outline</v-icon>
        <p class="mt-2 text-error">{{ error }}</p>
      </div>

      <div v-else class="news-list">
        <NewsCard v-for="item in newsItems" :key="item.id" :news="item" @click="handleNewsClick" />
      </div>
    </div>

    <div class="dashboard-section">
      <Dashboard />
    </div>
  </div>

  <NewsDescription :news="selectedNews" :stock-data="stockData" @close="handleClose" />
</template>

<style scoped>
.split-layout {
  display: flex;
  gap: 2rem;
}

.news-section {
  flex: 1;
  flex-direction: column;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboard-section {
  flex: 1;
}

@media (max-width: 960px) {
  .split-layout {
    flex-direction: column;
  }

  .dashboard-section {
    display: none;
  }
}
</style>
