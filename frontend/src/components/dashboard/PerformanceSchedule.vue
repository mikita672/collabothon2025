<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h1 style="font-family: afacad">Performance Schedule</h1>
        <h3 style="font-family: afacad" class="font-weight-light">Daily performance data</h3>
      </div>
      <v-select
        v-model="selectedTicker"
        :items="tickerItems"
        item-title="label"
        item-value="value"
        variant="outlined"
        density="compact"
        style="max-width: 200px"
        hide-details
        @update:model-value="emit('update:selectedTicker', selectedTicker)"
      />
    </div>
    
    <v-card class="pa-6" rounded="lg">

    <v-card v-if="selectedCompany" class="mb-4 pa-4 bg-grey-lighten-4" rounded="lg" elevation="0">
      <v-row>
        <v-col cols="6">
          <div class="text-caption text-grey-darken-1">Current Price</div>
          <div class="text-h6">${{ currentPrice.toFixed(2) }}</div>
        </v-col>
        <v-col cols="6">
          <div class="text-caption text-grey-darken-1">Total Gain/Loss</div>
          <div
            class="text-h6"
            :class="gainLossPercent >= 0 ? 'text-green' : 'text-red'"
          >
            {{ gainLossPercent >= 0 ? '+' : '' }}{{ gainLossPercent.toFixed(2) }}%
          </div>
        </v-col>
      </v-row>
    </v-card>

    <div class="overflow-auto">
      <v-table>
        <thead>
          <tr>
            <th class="text-left text-caption text-grey-darken-1">Date</th>
            <th class="text-right text-caption text-grey-darken-1">Open</th>
            <th class="text-right text-caption text-grey-darken-1">Close</th>
            <th class="text-right text-caption text-grey-darken-1">Change</th>
            <th class="text-right text-caption text-grey-darken-1">Change %</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(day, index) in displayedScheduleData"
            :key="index"
            class="hover-row"
          >
            <td class="text-body-2">{{ formatDate(day.date) }}</td>
            <td class="text-body-2 text-right">${{ day.open.toFixed(2) }}</td>
            <td class="text-body-2 text-right">${{ day.close.toFixed(2) }}</td>
            <td
              class="text-body-2 text-right"
              :class="day.change >= 0 ? 'text-green' : 'text-red'"
            >
              <div class="d-flex align-center justify-end ga-1">
                <v-icon v-if="day.change >= 0" size="16">mdi-trending-up</v-icon>
                <v-icon v-else size="16">mdi-trending-down</v-icon>
                {{ day.change >= 0 ? '+' : '' }}${{ day.change.toFixed(2) }}
              </div>
            </td>
            <td
              class="text-body-2 text-right"
              :class="day.changePercent >= 0 ? 'text-green' : 'text-red'"
            >
              {{ day.changePercent >= 0 ? '+' : '' }}{{ day.changePercent.toFixed(2) }}%
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <div v-if="scheduleData.length === 0" class="text-center py-8 text-grey">
      No performance data available for {{ selectedTicker }}
    </div>
  </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Stock, DailyPerformance, PerformanceData } from '@/types/portfolio'

interface Props {
  stocks: Stock[]
  performanceData: PerformanceData
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:selectedTicker': [ticker: string]
}>()

const selectedTicker = ref(props.stocks[0]?.ticker || '')

// Get all unique tickers from both stocks and performanceData
const allTickers = computed(() => {
  const stockTickers = props.stocks.map(s => s.ticker)
  const performanceTickers = Object.keys(props.performanceData)
  const uniqueTickers = [...new Set([...stockTickers, ...performanceTickers])]
  return uniqueTickers
})

const tickerItems = computed(() =>
  allTickers.value.map((ticker) => {
    const stock = props.stocks.find(s => s.ticker === ticker)
    return {
      label: stock ? `${ticker} - ${stock.quantity} shares` : ticker,
      value: ticker,
    }
  })
)

const selectedCompany = computed(() =>
  props.stocks.find((s) => s.ticker === selectedTicker.value)
)

const scheduleData = computed(() => {
  const data = props.performanceData[selectedTicker.value] || []
  // Sort by date in reverse order (newest first)
  return [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const displayedScheduleData = computed(() =>
  scheduleData.value.slice(0, 15) // Show last 15 days
)

// Latest price from performance data (most recent close)
const latestPrice = computed(() => {
  if (scheduleData.value.length === 0) return 0
  return scheduleData.value[0]?.close || 0
})

// Current price - either from stock data or latest performance data
const currentPrice = computed(() => {
  if (selectedCompany.value?.currentPrice) {
    return selectedCompany.value.currentPrice
  }
  // Fallback to latest price from performance data
  return latestPrice.value
})

// Calculate gain/loss from first historical price to current price
const gainLossPercent = computed(() => {
  if (scheduleData.value.length === 0) return 0
  
  // Get the oldest price (last in sorted array)
  const oldestPrice = scheduleData.value[scheduleData.value.length - 1]?.close || 0
  
  if (oldestPrice === 0) return 0
  
  const current = currentPrice.value
  return ((current - oldestPrice) / oldestPrice) * 100
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

watch(
  () => [props.stocks, props.performanceData],
  () => {
    const tickers = allTickers.value
    if (tickers.length > 0 && (!selectedTicker.value || !tickers.includes(selectedTicker.value))) {
      const firstTicker = tickers[0]
      if (firstTicker) {
        selectedTicker.value = firstTicker
      }
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.hover-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
