<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h1 style="font-family: afacad">Performance Chart</h1>
        <h3 style="font-family: afacad" class="font-weight-light">
          {{ selectedTicker }} stock price over time
        </h3>
      </div>
      <v-btn-toggle
        v-model="timeRange"
        variant="outlined"
        density="compact"
        mandatory
        divided
      >
        <v-btn value="7" size="small">Week</v-btn>
        <v-btn value="30" size="small">Month</v-btn>
        <v-btn value="365" size="small">Year</v-btn>
      </v-btn-toggle>
    </div>

    <v-card class="pa-6" rounded="lg">
      <div v-if="chartData.labels.length === 0" class="text-center py-8 text-grey">
        No performance data available for {{ selectedTicker }}
      </div>
      <div v-else class="chart-container">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js'
import type { DailyPerformance } from '@/types/portfolio'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  selectedTicker: string
  performanceData: DailyPerformance[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:timeRange': [value: string]
}>()

const timeRange = ref('30') // Default to month

// Emit timeRange changes to parent
watch(timeRange, (newValue) => {
  emit('update:timeRange', newValue)
}, { immediate: true })

const filteredData = computed(() => {
  // Sort data by date (oldest first)
  const sortedData = [...props.performanceData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  
  const days = parseInt(timeRange.value)
  
  // For year view, group by month and take the last point of each month
  if (timeRange.value === '365') {
    const monthlyData: typeof sortedData = []
    const monthMap = new Map<string, typeof sortedData[0]>()
    
    sortedData.forEach(dataPoint => {
      const date = new Date(dataPoint.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`
      // Keep the last data point for each month
      if (!monthMap.has(monthKey) || new Date(dataPoint.date) > new Date(monthMap.get(monthKey)!.date)) {
        monthMap.set(monthKey, dataPoint)
      }
    })
    
    // Convert back to array and sort by date
    monthlyData.push(...Array.from(monthMap.values()))
    monthlyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    return monthlyData
  }
  
  const slicedData = sortedData.slice(-days)
  return slicedData
})

const chartData = computed(() => {
  return {
    labels: filteredData.value.map((d) => {
      const date = new Date(d.date)
      // Different format based on time range
      if (timeRange.value === '7') {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      } else if (timeRange.value === '30') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      } else {
        // For year, show month and year
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }
    }),
    datasets: [
      {
        label: 'Close Price',
        data: filteredData.value.map((d) => d.close),
        borderColor: '#FFD501',
        backgroundColor: 'rgba(255, 213, 1, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#FFD501',
        pointHoverBackgroundColor: '#FFD501',
        borderWidth: 2,
      },
    ],
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (context) => {
          const value = context.parsed.y
          if (typeof value === 'number') {
            return `$${value.toFixed(2)}`
          }
          return ''
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        autoSkip: true,
        maxTicksLimit: 10,
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        callback: (value) => {
          if (typeof value === 'number') {
            return `$${value}`
          }
          return value
        },
      },
    },
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
}))
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
