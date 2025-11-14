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
        <CardsOverview />
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
import { ref } from 'vue'
import CardsOverview from './StatCards/CardsOverview.vue'
import PortfolioOverview from './PortfolioOverview.vue'
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

const isLoading = ref(true)
const error = ref(null)

setTimeout(() => {
  isLoading.value = false
}, 2000)

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

const chartData = ref({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Stock Prices',
      borderColor: '#FFD501',
      data: [40, 39, 10, 40, 39, 80, 40],
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBackgroundColor: '#42A5F5',
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
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
    },
    y: {
      title: {
        display: false,
      },
      beginAtZero: true,
      grid: {
        color: '#f0f0f0',
        drawBorder: false,
      },
      ticks: {
        callback: (value: any) => '$' + value,
      },
    },
  },
})
</script>

<style scoped>
.outlined-card {
  box-shadow: none;
  border: 1px solid #e5e7eb;
}
</style>
