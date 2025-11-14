<template>
  <v-container fluid style="min-height: 100vh; background-color: #f9f9fb" class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" rounded="lg">
          <v-card-title class="text-h6 font-weight-medium"> Market Performance </v-card-title>
          <v-card-subtitle>Last 7 Months</v-card-subtitle>
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
      borderColor: '#42A5F5',
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
