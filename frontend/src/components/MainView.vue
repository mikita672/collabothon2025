<script setup lang="ts">
import Dashboard from './Dashboard/Dashboard.vue'
import NewsCard from './NewsFeed/NewsCard.vue'
import NewsDescription from './NewsFeed/NewsDescription.vue'
import PerformanceSchedule from './Dashboard/PerformanceSchedule.vue'
import PortfolioAllocationChart from './Dashboard/PortfolioAllocationChart.vue'
import PerformanceChart from './Dashboard/PerformanceChart.vue'
import { useNewsData } from '@/composables/useNewsData'
import { useNewsSelection } from '@/composables/useNewsSelection'
import { useNewsScheduler } from '@/composables/useNewsScheduler'
import { useNewsActions } from '@/composables/useNewsActions'
import { usePortfolioStore } from '@/stores/portfolio'
import { usePortfolioData } from '@/composables/usePortfolioData'
import { useStockPerformance } from '@/composables/useStockPerformance'
import { computed, ref, watch } from 'vue'

const portfolioStore = usePortfolioStore()

const { newsItems, stockData, isLoading, error, loadStockData, loadNews, loadDemoNews } =
  useNewsData()
const { selectedNews, selectNews, clearSelection } = useNewsSelection()
const { portfolioData, portfolioStats } = usePortfolioData()

const stocks = computed(() => portfolioData.value?.stocks || [])

// All available tickers (portfolio + common stocks)
const allTickers = computed(() => {
  const portfolioTickers = stocks.value.map((s) => s.ticker)
  const commonTickers = ['AAPL', 'MSFT', 'AMZN', 'NVDA', 'GOOGL', 'TSLA', 'META', 'NFLX']
  return [...new Set([...portfolioTickers, ...commonTickers])]
})

// Create stock-like objects for all tickers
const allStocks = computed(() => {
  return allTickers.value.map((ticker) => {
    const existingStock = stocks.value.find((s) => s.ticker === ticker)
    if (existingStock) return existingStock
    return {
      ticker,
      quantity: 0,
      purchasePrice: 0,
      purchaseDate: new Date().toISOString(),
    }
  })
})

// Load performance data from API for all stocks (like NewsDescription does)
const {
  performanceData,
  isLoading: isPerformanceLoading,
  error: performanceError,
} = useStockPerformance(allStocks)

// Selected ticker for performance chart
const selectedTicker = ref('')
const selectedTimeRange = ref('30')

// Get performance data for selected ticker
const selectedPerformanceData = computed(() => performanceData.value[selectedTicker.value] || [])

// Watch stocks and set first ticker
watch(
  stocks,
  (newStocks) => {
    if (newStocks.length > 0 && !selectedTicker.value && newStocks[0]?.ticker) {
      selectedTicker.value = newStocks[0].ticker
    }
  },
  { immediate: true },
)

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

  // Trigger bad news simulation if portfolio simulation is active
  if (portfolioStore.isSimulationActive) {
    await portfolioStore.simulateBadNews()
  }
}
</script>

<template>
  <div class="main-container">
    <div class="split-layout">
      <!-- News Feed Section -->
      <div class="news-section pa-6" style="font-family: afacad; background-color: #f9f9fb">
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <h1>News Feed</h1>
            <h3 class="font-weight-light">Latest news affecting your portfolio</h3>
          </div>
          <div class="d-flex align-center" style="gap: 12px">
            <!-- Action Buttons Group -->
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

            <!-- Update Times -->
            <div class="d-flex flex-column" style="gap: 2px">
              <div class="text-caption text-grey">Last: {{ lastUpdateFormatted }}</div>
              <div class="text-caption text-grey">Next: {{ nextUpdateFormatted }}</div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-2 text-grey">Loading news...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <v-icon color="error" size="48">mdi-alert-circle-outline</v-icon>
          <p class="mt-2 text-error">{{ error }}</p>
        </div>

        <!-- News List -->
        <div v-else class="news-list">
          <NewsCard
            v-for="item in newsItems"
            :key="item.id"
            :news="item"
            @click="handleNewsClick"
          />
        </div>
      </div>

      <!-- Dashboard -->
      <div class="dashboard-section">
        <Dashboard />
      </div>
    </div>

    <!-- New Components Below - Full Width -->
    <div class="charts-row mt-6 px-6" style="display: flex; gap: 1.5rem">
      <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1.5rem">
        <PerformanceChart
          v-if="selectedTicker && selectedPerformanceData.length > 0"
          :selectedTicker="selectedTicker"
          :performanceData="selectedPerformanceData"
          @update:timeRange="selectedTimeRange = $event"
        />

        <PortfolioAllocationChart
          v-if="stocks.length > 0"
          :stocks="stocks"
          :totalValue="portfolioStats.currentValue"
        />
      </div>

      <div style="flex: 1; min-width: 0">
        <PerformanceSchedule
          v-if="allStocks.length > 0"
          :stocks="allStocks"
          :performanceData="performanceData"
          :timeRange="selectedTimeRange"
          @update:selectedTicker="selectedTicker = $event"
        />
      </div>
    </div>
  </div>

  <NewsDescription :news="selectedNews" :stock-data="stockData" @close="handleClose" />
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
}

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
