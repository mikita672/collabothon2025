<template>
  <v-container fluid style="background-color: #f9f9fb" class="pa-6">
    <h1 style="font-family: afacad">AI Portfolio Dashboard</h1>
    <h3 style="font-family: afacad" class="font-weight-light">
      Your AI-managed investment portfolio performance and holdings
    </h3>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4 outlined-card" rounded="lg">
          <v-card-text>
            <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <CardsOverview :stats="portfolioStats" />
      </v-col>

      <v-col>
        <v-card rounded="lg">
          <PortfolioOverview />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolioData } from '@/composables/usePortfolioData'
import { usePortfolioSimulation } from '@/composables/usePortfolioSimulation'
import CardsOverview from '@/components/Dashboard/StatCards/CardsOverview.vue'
import PortfolioOverview from '@/components/Dashboard/PortfolioOverview.vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from 'chart.js'

const { portfolioStats, isLoading: isPortfolioLoading, error: portfolioError } = usePortfolioData()

const {
  chartData: simulationChartData,
  isLoading: isSimulationLoading,
  error: simulationError,
} = usePortfolioSimulation()

const isLoading = computed(() => isPortfolioLoading.value || isSimulationLoading.value)
const error = computed(() => portfolioError.value || simulationError.value)

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
)

const chartData = computed(() => {
  if (simulationChartData.value && simulationChartData.value.datasets.length > 0) {
    return simulationChartData.value
  }

  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Portfolio Value',
        borderColor: '#FFD501',
        data: [40, 39, 10, 40, 39, 80, 40],
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#42A5F5',
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        label: (context: any) => {
          return `$${context.parsed.y.toFixed(2)}`
        },
      },
    },
  },
  elements: {
    line: {
      borderWidth: 2,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
    },
  },
  scales: {
    x: {
      title: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        maxTicksLimit: 10,
      },
    },
    y: {
      title: {
        display: false,
      },
      beginAtZero: false,
      grid: {
        color: '#f0f0f0',
        drawBorder: false,
      },
      ticks: {
        callback: (value: any) => '$' + value.toFixed(2),
      },
    },
  },
}))
</script>

<style scoped>
.outlined-card {
  box-shadow: none;
  border: 1px solid #e5e7eb;
}
</style>
